const Story = require('../models/stories')
const fs = require('fs-extra')
const { response } = require('express')
const moment = require('moment')

const {
  deleteImageCloud,
  uploadImageToCloud,
  updatedCloud,
} = require('../helpers/uploadImages')

const getStoriesPagination = async (req, res) => {
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
      limit: 6,
      page,
    }

    //find Paginado
    let stories = null
    if (
      (!startDate && !endDate) ||
      (startDate === '0' && endDate === '0') ||
      (startDate === null && endDate === null) ||
      (startDate === undefined && endDate === undefined)
    ) {
      const query = {}

      stories = await Story.paginate(query, options)
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

      stories = await Story.paginate(query, options)
    }

    if (!stories) {
      return res
        .status(404)
        .json({ ok: false, msg: 'No hay historias' })
    }

    if (stories.docs.length < 6) {
      return res.status(200).json({
        ok: true,
        stories: stories.docs,
        total_docs: stories.totalDocs,
        total_page: 1,
      })
    } else {
      return res.status(200).json({
        ok: true,
        stories: stories.docs,
        total_docs: stories.totalDocs,
        total_page: stories.totalPages,
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(200).json({ ok: false, err })
  }
}

const findOneStory = async (req, res) => {
  try {
    //storyId
    const { storyId } = req.params
    //find ONee
    const stories = await Story.findById(storyId)

    if (!stories) {
      return res
        .status(404)
        .json({ ok: false, msg: 'No hay historias' })
    }

    return res.status(200).json({
      ok: true,
      stories,
    })
  } catch (err) {
    console.log(err)
    return res.status(200).json({ ok: false, err })
  }
}

const newStorie = async (req, res = response) => {
  let path = ''
  console.log(req.file)
  if (req.file) {
    path = req.file.path
  }
  try {
    const { error, resp } = await uploadImageToCloud(path)
    if (error) {
      return res
        .status(404)
        .json({ ok: false, msg: resp, error })
    }

    const story = new Story({
      ...req.body,
      imageUrl: resp.secure_url,
      publicImg_id: resp.public_id,
    })
    story.user = req.uid
    const storySaved = await story.save()

    await fs.unlink(path)

    return res.json({
      ok: true,
      story: storySaved,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'something went wrong',
    })
  }
}

const editStorie = async (req, res = response) => {
  const storyId = req.params.id
  const uid = req.uid

  try {
    const story = await Story.findById(storyId)
    if (!story) {
      return res.status(404).json({
        ok: false,
        msg: 'This story does not exist with that ID',
      })
    }

    if (story.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'You do not have the privilege to edit this story',
      })
    }

    if (req.file && !req.body.imageUrl) {
      console.log('sin https')
      const { error, resp } = await updatedCloud(
        req.file.path,
        req.body.publicImg_id
      )

      if (error) {
        return res.status(400).json({
          ok: false,
          msg: resp,
          error,
        })
      }

      const newStory = {
        ...req.body,
        imageUrl: resp.secure_url,
        publicImg_id: resp.public_id,
        user: uid,
      }

      const StoryUpdated = await Story.findByIdAndUpdate(
        storyId,
        newStory,
        {
          new: true,
        }
      )

      await fs.unlink(req.file.path)
      res.json({
        ok: true,
        story: StoryUpdated,
      })
    } else if (
      !req.file &&
      req.body.imageUrl.includes('https')
    ) {
      console.log('con https')
      const newStory = {
        ...req.body,
        user: uid,
      }
      const StoryUpdated = await Story.findByIdAndUpdate(
        storyId,
        newStory,
        {
          new: true,
        }
      )
      return res.json({
        ok: true,
        story: StoryUpdated,
      })
    } else {
      console.log('sin https ni file')
      console.log(req.body)
      return res.status(400).json({
        ok: false,
        msg: 'File not found',
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Something went wrong',
    })
  }
}

const deleteStorie = async (req, res = response) => {
  const storyId = req.params.id
  const uid = req.uid

  try {
    const story = await Story.findById(storyId)
    if (!story) {
      return res.status(404).json({
        ok: false,
        msg: 'This story does not exist with that ID',
      })
    }

    if (story.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'You do not have the privilege to edit this story',
      })
    }
    await deleteImageCloud(story.publicImg_id)
    await Story.findByIdAndDelete(storyId)

    res.json({
      ok: true,
      msg: 'Story Deleted',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Something went wrong',
    })
  }
}

module.exports = {
  newStorie,
  editStorie,
  deleteStorie,
  getStoriesPagination,
  findOneStory,
}
