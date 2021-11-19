const { response } = require('express');
const Notice = require('../models/notice');
const webPush=require('../helpers/webPush');
const getNoticies = async (req, res = response) => {
  
  try {
    let { page, startDate, endDate } = req.query;

    //Recoger Pagina actual
    if (
      !page ||
      page === '0' ||
      page === null ||
      page === undefined
    ) {
      page = 1;
    } else {
      page = parseInt(page);
    }

    //indicar las opciones de paginacion
    const options = {
      sort: { date: -1 },
      limit: 8,
      page,
    };
    //find Paginado

    let noticies = null;
    if (
      (!startDate && !endDate) ||
      (startDate === '0' && endDate === '0') ||
      (startDate === null && endDate === null) ||
      (startDate === undefined && endDate === undefined)
    ) {
      const query = {};

      noticies = await Notice.paginate(query, options);
    } else {
      const query = {};
      const startFormatDate = new Date(startDate).toISOString()
      const endFormatDate = new Date(endDate).toISOString()


      noticies = await Notice.find()
      noticies = await Notice.paginate(query, options);
      const filtered = noticies.docs.filter(notice => {
        const dates = new Date(notice.date).toISOString().split('T')[0]
        const startDate = startFormatDate.split('T')[0];
        const endDate = endFormatDate.split('T')[0]


        return dates >= startDate && dates <= endDate
      })

      noticies = {
        docs: [...filtered],
        todalDocs: noticies.totalDocs, totalPages: noticies.totalPages, nextPage: noticies.nextPage, prevPage: noticies.prevPage
      }
    }

    if (!noticies) {
      return res
        .status(404)
        .json({ ok: false, msg: 'No hay noticias' });
    }
  // Payload Notification
  const payload = JSON.stringify({
    title: "Nueva Notificación de Una Vida Segura!",
    message:"Hay una nueva noticia, puede que te interese!" 
  });
    if (req.app.locals.pushSubscripton) {
     return  await webPush.sendNotification(req.app.locals?.pushSubscripton,payload)
    }
  
    return res.status(200).json({
      ok: true,

      noticies: noticies.docs.sort(),
      totalDocs: noticies.totalDocs,
      totalPages: noticies.totalPages,
      prevPage: noticies.prevPage,
      nextPage: noticies.nextPage,
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Algo salio mal',
    });
  }
};
const findById = async (req, res = response) => {
  try {
    const noticies = await Notice.findById(
      req.params.noticeId
    );
    if (!noticies) {
      return res.status(404).json({
        ok: false,
        msg: 'Noticia no encontrada con este id'
      })
    }
    res.json({
      ok: true,
      noticies,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: 'Algo Salio Mal :(' });
  }
};

const newNotice = async (req, res = response) => {
  try {
    const newNotices = new Notice({ ...req.body });
    newNotices.user = req.uid;
    const resp = await newNotices.save();

    if (resp) {
      return res.status(200).json({
        ok: true,
        noticies: resp,
        msg: 'Noticia guardada',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      ok: false,
      msg: 'Algo Salio Mal :(',
    });
  }
};
const editNotice = async (req, res = response) => {
  const noticeId = req.params.id;
  const uid = req.uid;

  try {
    const EditedNotice = await Notice.findById(noticeId);

    if (!EditedNotice) {
      return res.status(404).json({
        ok: false,
        msg: 'This notice does not exist with that ID',
      });
    }

    if (EditedNotice.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'You do not have the privilege to edit this notice',
      });
    }

    const newNotice = {
      ...req.body,
      date: new Date(),
      user: uid,
    };

    const noticeUpdated = await Notice.findByIdAndUpdate(
      noticeId,
      newNotice,
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      noticies: noticeUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Something went wrong',
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
        msg: 'This notice does not exist with that ID',
      });
    }

    if (notice.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'You do not have the privilege to edit this notice',
      });
    }

    await Notice.findByIdAndDelete(noticeId);

    res.json({
      ok: true,
      msg: 'notice Deleted',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Something went wrong',
    });
  }
};

module.exports = {
  getNoticies,
  newNotice,
  editNotice,
  deleteNotice,
  findById,
};
