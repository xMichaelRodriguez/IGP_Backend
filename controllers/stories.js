import { response } from "express";
import { Story } from "../models/stories.js";

export const getStories = async (req, res = response) => {
  const stories = await Story.find();

  res.json({
    ok: true,
    stories,
  });
};

export const newStorie = async (req, res = response) => {
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

export const editStorie = async (req, res = response) => {
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

export const deleteStorie = async (req, res = response) => {
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

export default {
  getStories,
  newStorie,
  editStorie,
  deleteStorie,
};
