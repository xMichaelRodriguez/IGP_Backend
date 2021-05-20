const { response, json } = require("express");
const Story = require("../models/stories");

const socket = require("../socket").socket;

const getStoriesPagination = async (req, res) => {
  try {
    let { page } = req.query;

    //Recoger Pagina actual
    if (!page || page === "0" || page === null || page === undefined) {
      page = 1;
    } else {
      page = parseInt(page);
    }

    //indicar las opciones de paginacion
    const options = {
      sort: { date: -1 },
      limit: 6,
      page,
    };

    //find Paginado
    const stories = await Story.paginate({}, options);

    if (!stories) {
      return res.status(404).json({ ok: false, msg: "No hay historias" });
    }
    
    return res.status(200).json({
      ok: true,
      stories: stories.docs,
      total_docs: stories.totalDocs,
      total_page: stories.totalPages,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ ok: false, err });
  }
};

const newStorie = async (req, res = response) => {
  const story = new Story(req.body);
  try {
    story.user = req.uid;
    const storySaved = await story.save();

    return res.json({
      ok: true,
      story: storySaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "something went wrong",
    });
  }
};

const editStorie = async (req, res = response) => {
  const storyId = req.params.id;
  const uid = req.uid;

  try {
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        ok: false,
        msg: "This story does not exist with that ID",
      });
    }

    if (story.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "You do not have the privilege to edit this story",
      });
    }

    const newStory = {
      ...req.body,
      user: uid,
    };

    const StoryUpdated = await Story.findByIdAndUpdate(storyId, newStory, {
      new: true,
    });

    res.json({
      ok: true,
      story: StoryUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Something went wrong",
    });
  }
};

const deleteStorie = async (req, res = response) => {
  const storyId = req.params.id;
  const uid = req.uid;

  try {
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        ok: false,
        msg: "This story does not exist with that ID",
      });
    }

    if (story.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "You do not have the privilege to edit this story",
      });
    }

    await Story.findByIdAndDelete(storyId);

    res.json({
      ok: true,
      msg: "Story Deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Something went wrong",
    });
  }
};

module.exports = {
  newStorie,
  editStorie,
  deleteStorie,
  getStoriesPagination,
};
