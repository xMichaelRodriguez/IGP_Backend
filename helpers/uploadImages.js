const cloudDinary = require('cloudinary');
const fs = require('fs-extra');
cloudDinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CD,
  api_secret: process.env.API_SECRET_CD,
});

const uploadImageToCloud = async (path) => {
  try {
    if (path === '')
      return { error: true, resp: 'no hay imagen' };
    const resp = await cloudDinary.v2.uploader.upload(path);
    if (!resp) {
      return { error: true, resp };
    }

    return { error: false, resp };
  } catch (err) {
    throw Error(err);
  }
};
const deleteImageCloud = async (publicId = undefined) => {
  try {
    if (publicId === undefined)
      return {
        error: true,
        resp: 'publicId no encontrado',
      };
    const resp = await cloudDinary.v2.api.delete_resources(
      publicId,
      (Option = {})
    );

    if (!resp) {
      return { error: true, resp };
    }
    return { error: false, resp };
  } catch (error) {
    throw Error(error);
  }
};
const updatedCloud = async (path, publicId) => {
  try {
    const resp = await cloudDinary.v2.uploader.upload(path);
    if (!resp) {
      return { error: true, resp };
    }

    await deleteImageCloud(publicId);
    return { error: false, resp };
  } catch (error) {
    throw Error(error);
  }
};

const uploadMultiImages = async (path = {}) => {
  let commicResult = {
    coverPage: {},
    gallery: [],
  };

  const { coverPage, gallery } = path;
  if (!coverPage || !gallery)
    return { error: 'No Hay commic', commicResult };

  const resultCover = await uploadCoverImage(
    coverPage[0].path
  );

  if (!resultCover)
    return {
      error: 'Something wen wrong',
      commicResult: resultCover,
    };

  commicResult.coverPage = {
    imageUrl: resultCover.secure_url,
    publicId: resultCover.public_id,
  };
  const resGallery = await uploadGalleryImages(gallery);
  commicResult.gallery = [...resGallery];
  return { error: false, commicResult };
};

const uploadCoverImage = async (cover = undefined) => {
  const resp = await cloudDinary.v2.uploader.upload(cover);
  await fs.unlink(cover);
  return resp;
};

const uploadGalleryImages = async (arrGallery = []) => {
  if (arrGallery === []) {
    return 'Images needed';
  }

  let urls = [];
  for (const file of arrGallery) {
    const { path } = file;
    const { secure_url, public_id } =
      await cloudDinary.v2.uploader.upload(path);


    urls.push({
      imageUrl: secure_url,
      publicID: public_id,
    });
    await fs.unlinkSync(path);
  }
  return urls;
};

const deleteGalleryImages = async (arrGallery = []) => {
  if (arrGallery === []) return 'Images needed';
  for (const file of arrGallery) {
    await cloudDinary.v2.api.delete_resources(
      file.publicID,
      (Option = {})
    );
  }
  return true;
};
module.exports = {
  uploadImageToCloud,
  deleteImageCloud,
  updatedCloud,
  uploadMultiImages,
  deleteGalleryImages,
};
