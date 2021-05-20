/*
        Router Auth
        host * api/stories

*/
const { Router } = require("express");
const { check } = require("express-validator");
const constroller = require("../controllers/stories");
const validarCampos = require("../helpers/validar-campos");
const validarJWT = require("../middleware/tovenValid");
const router = Router();

router.use(validarJWT);

router.get("/", constroller.getStoriesPagination);
router.post(
  "/new",
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
  constroller.newStorie
);
router.put(
  "/:id", //middleware
  [
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
  constroller.editStorie
);
router.delete("/:id", constroller.deleteStorie);
module.exports = router;
