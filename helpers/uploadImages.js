const cloudDinary = require('cloudinary')

cloudDinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CD,
  api_secret: process.env.API_SECRET_CD,
})

const uploadImageToCloud = async (path) => {
  try {
    const resp = await cloudDinary.v2.uploader.upload(path)
    if (!resp) {
      return { error: true, resp }
    }

    return { error: false, resp }
  } catch (err) {
    throw Error(err)
  }
}
const deleteImageCloud = async (publicId) => {
  try {
    const resp = await cloudDinary.v2.api.delete_resources(
      publicId,
      (Option = {})
    )

    if (!resp) {
      return { error: true, resp }
    }
    return { error: false, resp }
  } catch (error) {
    throw Error(error)
  }
}
const updatedCloud = async (path, publicId) => {
  try {
    const resp = await cloudDinary.v2.uploader.upload(path)
    if (!resp) {
      return { error: true, resp }
    }

    await deleteImageCloud(publicId)
    return { error: false, resp }
  } catch (error) {
    throw Error(error)
  }
}
module.exports = {
  uploadImageToCloud,
  deleteImageCloud,
  updatedCloud,
}
