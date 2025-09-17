const router = require('express').Router()
const auth = require('../middleware/auth')
const role = require('../middleware/role')
const controller = require('../controllers/contentController')
router.get('/free', auth, controller.getFree)
router.get('/premium', auth, controller.getPremium)
router.post('/', auth, role(['admin']), controller.create)
router.delete('/:id', auth, role(['admin']), controller.delete)
module.exports = router
