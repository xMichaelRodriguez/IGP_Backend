/*
        Router Auth
        host * api/stories

*/
const { Router } = require('express')
const { check } = require('express-validator')
const constroller = require('../controllers/stories')
const validarCampos = require('../helpers/validar-campos')
const validarJWT = require('../middleware/tovenValid')
const { isDate } = require('../helpers/isDate')
const router = Router()

router.get('/', constroller.getStoriesPagination)
router.get('/:storyId', constroller.findOneStory)

router.use(validarJWT)

router.post(
  '/new',
  [
    //middleware
    check(
      'title',
      'Título obligatorio y mínimo de 6 caracteres'
    )
      .notEmpty()
      .isLength({ min: 6 }),
    check(
      'body',
      'Cuerpo obligatorio y mínimo de 50 caracteres y máximo de 2000 caracteres '
    )
      .notEmpty()
      .isLength({ min: 50, max: 2000 }),
    check('date', 'Fecha  es obligatoria').custom(isDate),
    validarCampos,
  ],
  constroller.newStorie
)
router.put(
  '/:id', //middleware
  [
    //middleware
    check(
      'title',
      'Título obligatorio y mínimo de 6 caracteres'
    )
      .notEmpty()
      .isLength({ min: 6 }),
    check(
      'body',
      'Cuerpo obligatorio y mínimo de 50 caracteres y máximo de 2000 caracteres '
    )
      .notEmpty()
      .isLength({ min: 50, max: 2000 }),
    check('date', 'Fecha de inicio es obligatoria').custom(
      isDate
    ),
    validarCampos,
  ],
  constroller.editStorie
)
router.delete('/:id', constroller.deleteStorie)
module.exports = router
