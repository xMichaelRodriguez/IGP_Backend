import { response } from "express";
import { Story } from "../models/stories.js";

export const getStories = async (req, res = response) => {
  const stories = await Story.find()

  res.json({
    ok: true,
    stories,
  });
};

export const newStorie = async (req, res = response) => {
  const story = new Story(req.body);
  try {
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

export const editStorie = (req, res = response) => {
  return res.status(201).json({
    ok: true,
    storie: [],
  });
};

export const deleteStorie = (req, res = response) => {
  return res.status(201).json({
    ok: true,
    storie: [],
  });
};

export default {
  getStories,
  newStorie,
  editStorie,
  deleteStorie,
};
