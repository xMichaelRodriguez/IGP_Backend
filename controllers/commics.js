const { response, request } = require('express')
const fs = require('fs-extra')
const {
  uploadMultiImages,
  deleteGalleryImages,
  deleteImageCloud,
} = require('../helpers/uploadImages')
const Commics = require('../models/Commics')

const getCommics = async (
  req = request,
  res = response
) => {
  try {
    let { page, startDate, endDate } = req.query

    //Recoger Pagina actual
    if (
      !page ||
      page === '0' ||
      page === null ||
      page === undefined
    ) {
      page = 1
    } else {
      page = parseInt(page)
    }

    //indicar las opciones de paginacion
    const options = {
      sort: { date: -1 },
      limit: 10,
      page,
    }
    //find Paginado

    let commicsFound = null
    if (
      (!startDate && !endDate) ||
      (startDate === '0' && endDate === '0') ||
      (startDate === null && endDate === null) ||
      (startDate === undefined && endDate === undefined)
    ) {
      const query = {}

      commicsFound = await Commics.paginate(query, options)
    } else {
      const start = moment(startDate)
        .toISOString()
        .toString()

      const end = moment(endDate).toISOString().toString()

      const query = {
        date: {
          $gte: start,
          $lte: end,
        },
      }
      commicsFound = await Commics.paginate(query, options)
    }

    if (!commicsFound)
      return res.status(200).json({
        ok: true,
        msg: 'No hay commics',
      })


    return res.json({
      ok: true,
      commicsFound: commicsFound.docs,
      totalDocs: commicsFound.totalDocs,
      totalPage: commicsFound.totalPages,
      prevPage: commicsFound.prevPage,
      nextPage: commicsFound.nextPage,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'something wen wrong',
    })
  }
}
const getCommicById = async (
  req = request,
  res = response
) => {
  try {
    const commicsFound = await Commics.findById(
      req.params.commicId
    )
    if (!commicsFound)
      return res.status(404).json({
        ok: false,
        msg: 'Commic no existe',
      })

    return res.status(200).json({
      ok: true,
      commics: commicsFound,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'something wen wrong',
    })
  }
}

const newCommic = async (req = request, res = response) => {
  try {

    const path = {
      coverPage: req.files?.coverPage,
      gallery: req.files?.gallery,
    }

    const { error, commicResult } = await uploadMultiImages(
      path
    )

    if (error !== false) {
      return res.status(400).json({
        ok: false,
        msg: error,
        commicResult,
      })
    }

    const { coverPage, gallery } = commicResult

    const commicToSave = new Commics({
      ...req.body,
      coverPage,
      gallery,
    })
    commicToSave.user = req.uid
    const commicSaved = await commicToSave.save()
    return res.status(200).json({
      ok: true,
      msg: 'Commic Guardado',
      commics: commicSaved,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Something wen wrong',
      error,
    })
  }
}

const deleteCommic = async (
  req = request,
  res = response
) => {
  const uid = req.uid
  try {
    const commic = await Commics.findById(
      req.params.commicId
    )
    if (!commic) {
      return res.status(404).json({
        ok: false,
        msg: 'Commic no encontrado',
      })
    }

    if (commic.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'You do not have the privilege to edit this Commic',
      })
    }

    const galleryDeleted = await deleteGalleryImages(
      commic.gallery
    )

    const coverPageDeleted = await deleteImageCloud(
      commic.coverPage?.publicId
    )

    if (!galleryDeleted || coverPageDeleted.error) {
      return res.status(400).json({
        ok: false,
        msg: 'Algo salio mal al intentar eliminar el commic',
        galleryDeleted,
        coverPageDeleted,
      })
    }
    await Commics.findByIdAndDelete(req.params.commicId)

    return res.status(200).json({
      ok: true,
      msg: 'Commic Eliminado',
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      error,
      msg: 'Something wen wrong',
    })
  }
}

module.exports = {
  getCommics,
  getCommicById,
  newCommic,

  deleteCommic,
}
