const cloudDinary = require('cloudinary')

cloudDinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CD,
  api_secret: process.env.API_SECRET_CD,
})

const uploadImageToCloud = async (path) => {
  const resp = await cloudDinary.v2.uploader.upload(path)
  if (!resp) {
    return { error: true, resp }
  }

  return { error: false, resp }
}
const deleteImageCloud = async (publicId) => {
  const resp = await cloudDinary.v2.api.delete_resources(
    publicId,
    (Option = {})
  )

  if (!resp) {
    return { error: true, resp }
  }
  return { error: false, resp }
}
const updatedCloud = async (path, publicId) => {
  const resp = await cloudDinary.v2.uploader.upload(path)
  if (!resp) {
    return { error: true, resp }
  }

  await deleteImageCloud(publicId)
  return { error: false, resp }
}
module.exports = {
  uploadImageToCloud,
  deleteImageCloud,
  updatedCloud,
}
