const router = require('express').Router()
const auth = require('../middleware/auth')
const controller = require('../controllers/subscriptionController')
router.post('/subscribe', auth, controller.subscribe)
router.get('/subscription-status', auth, controller.status)
router.patch('/renew', auth, controller.renew)
router.post('/cancel-subscription', auth, controller.cancel)
module.exports = router
