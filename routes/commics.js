const { Router } = require('express');
const { check } = require('express-validator');

const controller = require('../controllers/commics');
const upload = require('../middleware/storage');
const validarJWT = require('../middleware/tovenValid');

const router = Router();

router.get('/', controller.getCommics);
router.get('/:commicId', controller.getCommicById);

router.use(validarJWT);
router.use(
  upload.fields([
    { name: 'coverPage', maxCount: 1 },
    { name: 'gallery', maxCount: 5 },
  ])
);
router.post(
  '/new',
  [
    check('title')
      .notEmpty()
      .withMessage('Titulo de commic requerido'),
  ],
  controller.newCommic
);
router.delete('/:commicId', controller.deleteCommic);

module.exports = router;
