const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), '/uploads'),
  filename: (req, file, cb) => {
    //le agrega la extencion al archivo

    cb(
      null,
      `${file.fieldname}__${Date.now()}${path.extname(
        file.originalname
      )}`
    );
  },
});

const upload = multer({
  storage,
});
module.exports = upload;
