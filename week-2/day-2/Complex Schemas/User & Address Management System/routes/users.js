const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
router.post('/', userCtrl.createUser);
router.post('/:userId/address', userCtrl.addAddress);
router.get('/summary', userCtrl.getSummary);
router.get('/:userId', userCtrl.getUser);
router.delete('/:userId/address/:addressId', userCtrl.deleteAddress);
module.exports = router;
