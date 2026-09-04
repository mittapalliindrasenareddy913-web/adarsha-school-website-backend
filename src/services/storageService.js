import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import path from 'path';

let cachedR2Client = null;

/**
 * Returns a lazy-initialized S3Client instance configured for Cloudflare R2.
 */
function getR2Client() {
  const accountId = (process.env.R2_ACCOUNT_ID || '').replace(/^["']|["']$/g, '').trim();
  const accessKeyId = (process.env.R2_ACCESS_KEY_ID || '').replace(/^["']|["']$/g, '').trim();
  const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || '').replace(/^["']|["']$/g, '').trim();

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('Cloudflare R2 Configuration Error: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY must be configured in environment variables to perform R2 operations.');
  }

  if (!cachedR2Client) {
    cachedR2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey
      },
      maxAttempts: 2
    });
  }

  return cachedR2Client;
}

/**
 * Constructs public delivery URL for a given object key.
 * Format: ${R2_PUBLIC_BASE_URL}/${objectKey}
 * Safely handles trailing/leading slashes.
 */
export function getPublicUrl(objectKey) {
  const publicBaseUrl = (process.env.R2_PUBLIC_BASE_URL || '').replace(/^["']|["']$/g, '').trim();

  if (!publicBaseUrl) {
    throw new Error('Cloudflare R2 Configuration Error: R2_PUBLIC_BASE_URL is not configured in backend environment variables.');
  }

  const cleanBase = publicBaseUrl.replace(/\/+$/, '');
  const cleanKey = String(objectKey).replace(/^\/+/, '');
  return `${cleanBase}/${cleanKey}`;
}

/**
 * Sanitizes category/folder name and maps to standard R2 key path structure:
 * school/
 *   images/
 *   videos/
 *   documents/
 *   gallery/
 *   faculty/
 *   achievements/
 *   facilities/
 *   events/
 *   hero/
 */
export function generateObjectKey(originalName, category = '', mimeType = '') {
  let subfolder = 'images';

  const catLower = (category || '').toLowerCase().trim();
  if (catLower.includes('gallery')) {
    subfolder = 'gallery';
  } else if (catLower.includes('faculty')) {
    subfolder = 'faculty';
  } else if (catLower.includes('achievement')) {
    subfolder = 'achievements';
  } else if (catLower.includes('facilit')) {
    subfolder = 'facilities';
  } else if (catLower.includes('event')) {
    subfolder = 'events';
  } else if (catLower.includes('hero')) {
    subfolder = 'hero';
  } else if (mimeType.startsWith('video/')) {
    subfolder = 'videos';
  } else if (mimeType === 'application/pdf' || mimeType.includes('document')) {
    subfolder = 'documents';
  } else {
    subfolder = 'images';
  }

  const ext = path.extname(originalName || '').toLowerCase() || (mimeType.startsWith('video/') ? '.mp4' : mimeType === 'application/pdf' ? '.pdf' : '.jpg');
  const safeExt = ext.replace(/[^a-z0-9.]/g, '');
  const baseName = path.basename(originalName || 'file', ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);

  const uniqueId = crypto.randomUUID();
  const objectKey = `school/${subfolder}/${baseName}-${uniqueId}${safeExt}`;
  
  return path.normalize(objectKey).replace(/\\/g, '/');
}

/**
 * Uploads a file buffer to Cloudflare R2 object storage.
 */
export async function uploadFileToR2({ buffer, originalName, mimeType, category = '' }) {
  const bucketName = (process.env.R2_BUCKET_NAME || '').replace(/^["']|["']$/g, '').trim();

  if (!bucketName) {
    throw new Error('Cloudflare R2 Configuration Error: R2_BUCKET_NAME is not configured in backend environment variables.');
  }

  const client = getR2Client();
  const objectKey = generateObjectKey(originalName, category, mimeType);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    Body: buffer,
    ContentType: mimeType,
    Metadata: {
      originalName: originalName || 'file',
      category: category || 'General'
    }
  });

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 25000);

  try {
    console.log(`[MediaUpload R2] Starting upload of "${originalName}" (${buffer?.length || 0} bytes) to bucket "${bucketName}"...`);
    await client.send(command, { abortSignal: abortController.signal });
    console.log(`[MediaUpload R2] Upload completed successfully. Key: "${objectKey}"`);
  } catch (err) {
    console.error('[MediaUpload R2] Upload failed:', err.name, err.message);
    if (err.name === 'AbortError') {
      throw new Error('Cloudflare R2 storage upload timed out after 25 seconds.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  const url = getPublicUrl(objectKey);

  return {
    objectKey,
    url,
    provider: 'r2',
    originalName,
    mimeType,
    size: buffer ? buffer.length : 0
  };
}

/**
 * Deletes an object from Cloudflare R2.
 * Gracefully handles errors if key is empty or object does not exist in bucket.
 */
export async function deleteFileFromR2(objectKey) {
  if (!objectKey) {
    return true;
  }

  const bucketName = process.env.R2_BUCKET_NAME;
  if (!bucketName || !process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    console.warn('[R2 Storage Service Warning] Skipping R2 object deletion: Cloudflare R2 credentials are not fully configured.');
    return false;
  }

  try {
    const client = getR2Client();
    const command = new DeleteObjectCommand({
      Bucket: bucketName.trim(),
      Key: objectKey
    });

    await client.send(command);
    return true;
  } catch (error) {
    console.warn(`[R2 Storage Service Warning] Non-fatal error deleting object "${objectKey}" from R2:`, error.message);
    return false;
  }
}

/**
 * Checks if an object exists in Cloudflare R2 bucket.
 */
export async function checkFileExistsInR2(objectKey) {
  if (!objectKey) return false;
  const bucketName = process.env.R2_BUCKET_NAME;
  if (!bucketName || !process.env.R2_ACCOUNT_ID) return false;

  try {
    const client = getR2Client();
    const command = new HeadObjectCommand({
      Bucket: bucketName.trim(),
      Key: objectKey
    });
    await client.send(command);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Generates a presigned download URL for private or admin-only files.
 */
export async function getPresignedDownloadUrl(objectKey, expiresIn = 3600) {
  const bucketName = process.env.R2_BUCKET_NAME;
  if (!bucketName || !objectKey) {
    throw new Error('Cannot generate presigned URL: Missing bucket or object key.');
  }

  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: bucketName.trim(),
    Key: objectKey
  });

  return await getSignedUrl(client, command, { expiresIn });
}

export default {
  uploadFileToR2,
  deleteFileFromR2,
  getPublicUrl,
  generateObjectKey,
  checkFileExistsInR2,
  getPresignedDownloadUrl
};
