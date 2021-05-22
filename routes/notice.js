const { Router } = require("express");
const { check } = require("express-validator");

const validarCampos = require("../helpers/validar-campos");
const validarJWT = require("../middleware/tovenValid");
const constroller = require("../controllers/noticies");
const { isDate } = require("../helpers/isDate");
const router = Router();

router.get("/", constroller.getNoticies);
router.get("/:noticeId", constroller.findById);

router.use(validarJWT);
router.post(
  "/newNotice",
  [
    //middleware
    check("title", "Título obligatorio y mínimo de 6 caracteres")
      .notEmpty()
      .isLength({ min: 6 }),
    check(
      "body",
      "Cuerpo obligatorio y mínimo de 50 caracteres y máximo de 2000 caracteres "
    )
      .notEmpty()
      .isLength({ min: 50, max: 2000 }),
    check("date", "Fecha es obligatoria").custom(isDate),
    validarCampos,
  ],
  constroller.newNotice
);
router.put(
  "/editNotice/:id",
  [
    //middleware
    check("title", "Título obligatorio y mínimo de 6 caracteres")
      .notEmpty()
      .isLength({ min: 6 }),
    check(
      "body",
      "Cuerpo obligatorio y mínimo de 50 caracteres y máximo de 2000 caracteres "
    )
      .notEmpty()
      .isLength({ min: 50, max: 2000 }),
    check("date", "Fecha de inicio es obligatoria").custom(isDate),
    validarCampos,
  ],
  constroller.editNotice
);

router.delete("/deleteNotice/:id", constroller.deleteNotice);

module.exports = router;
