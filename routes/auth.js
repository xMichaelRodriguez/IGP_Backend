/*
        Router Auth
        host * api/auth

*/

const { Router } = require("express");
const constroller = require("../controllers/auth.js");
const validarCampos = require("../helpers/validar-campos");
const { check } = require("express-validator");
const { validarJWT } = require("../middleware/validar-jwt.js");
const router = Router();
router.post('/subscription',constroller.subscription)
router.post(
  "/",
  [
    check("email", "Email is Required").isEmail(),
    check("password", "Password Is Required")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long")
      .matches(/\d/)
      .withMessage("must contain a number"),

    validarCampos,
  ],
  constroller.login
);
router.get("/renew", validarJWT, constroller.revalidarToken);

module.exports = router;
