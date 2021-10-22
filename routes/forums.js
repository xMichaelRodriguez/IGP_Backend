const { Router } = require('express');
const { check } = require('express-validator');

const controller = require('../controllers/forums');

const router = Router()

router.get('/create', controller.createForum)


module.exports = router