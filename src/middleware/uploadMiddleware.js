import multer from 'multer';

// Use memory storage so buffers can be streamed to Cloudflare R2
const storage = multer.memoryStorage();

const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'application/pdf'
];

function fileFilter(req, file, cb) {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file format: ${file.mimetype}. Allowed formats: JPG, JPEG, PNG, WEBP, GIF, MP4, WEBM, PDF.`), false);
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size limit
  }
});
