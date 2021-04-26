const { Router } = require("express");
const { check } = require("express-validator");

const validarCampos = require("../helpers/validar-campos");
const validarJWT = require("../middleware/tovenValid");
const constroller = require("../controllers/noticies");
const router = Router();

router.get("/", constroller.getNoticies);

router.use(validarJWT);
router.post(
  "/newNotice",
  [
    check("title", "The title is required").notEmpty(),
    check("body", "The body is required"),
    validarCampos,
  ],
  constroller.newNotice
);
router.put(
  "/editNotice/:id",
  [
    check("title", "The title is required").notEmpty(),
    check("body", "The body is required"),
    validarCampos,
  ],
  constroller.editNotice
);

router.delete(
  "/deleteNotice/:id",
  constroller.deleteNotice
);

module.exports = router;
