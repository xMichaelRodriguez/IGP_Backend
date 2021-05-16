const { Router } = require("express");
const { check } = require("express-validator");

const validarCampos = require("../helpers/validar-campos");
const validarJWT = require("../middleware/tovenValid");
const constroller = require("../controllers/noticies");
const router = Router();

router.get("/", constroller.getNoticies);
router.get("/lastest", constroller.getLastedNoticies);

router.use(validarJWT);
router.post(
  "/newNotice",
  [
    //middleware
    check("title", "Mandatory title and minimum of 6 characters")
      .notEmpty()
      .isLength({ min: 6 }),
    check(
      "body",
      "Mandatory body and minimum of 50 characters and maximum of 2000 characters "
    )
      .notEmpty()
      .isLength({ min: 50, max: 2000 }),
    validarCampos,
  ],
  constroller.newNotice
);
router.put(
  "/editNotice/:id",
  [
    //middleware
    check("title", "Mandatory title and minimum of 6 characters")
      .notEmpty()
      .isLength({ min: 6 }),
    check(
      "body",
      "Mandatory body and minimum of 50 characters and maximum of 2000 characters "
    )
      .notEmpty()
      .isLength({ min: 50, max: 2000 }),
    validarCampos,
  ],
  constroller.editNotice
);

router.delete("/deleteNotice/:id", constroller.deleteNotice);

module.exports = router;
