import SiteSettings from '../models/SiteSettings.js';
import ActivityLog from '../models/ActivityLog.js';

export async function getSettings(req, res, next) {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
}

export async function updateHomeSettings(req, res, next) {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    const homeData = req.body.home || req.body;
    const updatePayload = {
      'home.heroTagline': homeData.heroTagline || homeData.tagline || settings.home?.heroTagline || settings.tagline,
      'home.heroSubTagline': homeData.heroSubTagline || homeData.subTagline || settings.home?.heroSubTagline || settings.subTagline,
      'home.heroMediaType': homeData.heroMediaType || settings.home?.heroMediaType || settings.heroMediaType,
      'home.heroImage': homeData.heroImage || settings.home?.heroImage || settings.heroImage,
      'home.heroVideoUrl': homeData.heroVideoUrl ?? settings.home?.heroVideoUrl ?? settings.heroVideoUrl,
      'home.heroYouTubeUrl': homeData.heroYouTubeUrl ?? settings.home?.heroYouTubeUrl ?? settings.heroYouTubeUrl,
      'home.aboutSectionHeading': homeData.aboutSectionHeading || settings.home?.aboutSectionHeading || "Welcome to Adarsha High School",
      'home.aboutText': homeData.aboutText ?? settings.home?.aboutText ?? ""
    };

    // Mirror hero fields to top-level for legacy fallbacks without touching about
    if (homeData.heroTagline || homeData.tagline) updatePayload.tagline = homeData.heroTagline || homeData.tagline;
    if (homeData.heroSubTagline || homeData.subTagline) updatePayload.subTagline = homeData.heroSubTagline || homeData.subTagline;
    if (homeData.heroMediaType) updatePayload.heroMediaType = homeData.heroMediaType;
    if (homeData.heroImage) updatePayload.heroImage = homeData.heroImage;
    if (homeData.heroVideoUrl !== undefined) updatePayload.heroVideoUrl = homeData.heroVideoUrl;
    if (homeData.heroYouTubeUrl !== undefined) updatePayload.heroYouTubeUrl = homeData.heroYouTubeUrl;

    const updated = await SiteSettings.findByIdAndUpdate(
      settings._id,
      { $set: updatePayload },
      { returnDocument: 'after', runValidators: true }
    );

    await ActivityLog.create({
      action: 'Updated Home Settings',
      entity: 'SiteSettings',
      entityId: settings._id,
      details: 'Homepage CMS content updated'
    });

    return res.json({ success: true, message: 'Homepage settings updated successfully.', data: updated });
  } catch (error) {
    next(error);
  }
}

export async function updateAboutSettings(req, res, next) {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    const aboutData = req.body.about || req.body;
    const updatePayload = { about: aboutData };
    if (req.body.schoolFullName !== undefined) {
      updatePayload.schoolFullName = req.body.schoolFullName;
    }

    // Atomically set ONLY the about sub-document without touching home or top-level hero fields
    const updated = await SiteSettings.findByIdAndUpdate(
      settings._id,
      { $set: updatePayload },
      { returnDocument: 'after', runValidators: true }
    );

    await ActivityLog.create({
      action: 'Updated About Settings',
      entity: 'SiteSettings',
      entityId: settings._id,
      details: 'About School CMS content updated'
    });

    return res.json({ success: true, message: 'About School settings updated successfully.', data: updated });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req, res, next) {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const setPayload = {};
    for (const key of Object.keys(updateData)) {
      setPayload[key] = updateData[key];
    }

    const updated = await SiteSettings.findByIdAndUpdate(
      settings._id,
      { $set: setPayload },
      { returnDocument: 'after', runValidators: true }
    );

    await ActivityLog.create({
      action: 'Updated Site Settings',
      entity: 'SiteSettings',
      entityId: settings._id,
      details: 'Website settings updated'
    });

    return res.json({ success: true, message: 'Website settings saved successfully.', data: updated });
  } catch (error) {
    next(error);
  }
}
