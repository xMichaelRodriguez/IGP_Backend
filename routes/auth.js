/*
        Router Auth
        host * api/auth

*/

const { Router } = require("express");
const constroller = require("../controllers/auth.js");
const router = Router();

router.post("/", constroller.login);

module.exports = router;
