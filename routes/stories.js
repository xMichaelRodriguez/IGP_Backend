/*
        Router Auth
        host * api/stories

*/

import { Router } from "express";
import { check } from "express-validator";
import constroller from "../controllers/stories.js";
import { validarCampos } from "../helpers/validar-campos.js";
import { validarJWT } from "../middleware/tovenValid.js";
const router = Router();

router.use(validarJWT);

router.get("/", constroller.getStories);
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

export default router;
