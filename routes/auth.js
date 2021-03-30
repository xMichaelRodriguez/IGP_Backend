/*
        Router Auth
        host * api/auth

*/

import { Router } from "express";
import constroller from "../controllers/auth.js";
const router = Router();

router.post("/", constroller.login);

export default router;
