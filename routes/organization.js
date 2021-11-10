const { Router } = require('express')
const controller = require('../controllers/organization')
const router = Router()

router.get('/', controller.getAllOrganizations)
router.get('/:orgId', controller.findByIdOrg)

module.exports = router
