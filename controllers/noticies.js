const { response } = require("express");
const Notice = require("../models/notice");
const getNoticies = async (req, res = response) => {
  const noticies = await Notice.find();
  res.json({
    ok: true,
    noticies,
  });
};

const newNotice = async (req, res = response) => {
  try {
    const EditedNotice = new Notice(req.body);
    EditedNotice.user = req.uid;
    const resp = await EditedNotice.save();

    if (resp) {
      return res.status(200).json({
        ok: true,
        msg: resp,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: error,
    });
  }
};
const editNotice = async (req, res = response) => {
  const noticeId = req.params.id;
  const uid = req.uid;

  try {
    const EditedNotice = await Notice.findById(noticeId);
    console.log(EditedNotice);
    if (!EditedNotice) {
      return res.status(404).json({
        ok: false,
        msg: "This notice does not exist with that ID",
      });
    }

    if (EditedNotice.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "You do not have the privilege to edit this notice",
      });
    }

    const newNotice = {
      ...req.body,
      user: uid,
    };

    const noticeUpdated = await Notice.findByIdAndUpdate(noticeId, newNotice, {
      new: true,
    });

    res.json({
      ok: true,
      notice: noticeUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Something went wrong",
    });
  }
};

const deleteNotice = async (req, res = response) => {
  const noticeId = req.params.id;
  const uid = req.uid;

  try {
    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return res.status(404).json({
        ok: false,
        msg: "This notice does not exist with that ID",
      });
    }

    if (notice.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "You do not have the privilege to edit this notice",
      });
    }

    await Notice.findByIdAndDelete(noticeId);

    res.json({
      ok: true,
      msg: "notice Deleted",
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
  getNoticies,
  newNotice,
  editNotice,
  deleteNotice,
};
