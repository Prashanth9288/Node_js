const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

router.post('/add-user', userCtrl.addUser);
router.post('/add-profile/:userId', userCtrl.addProfile);
router.get('/get-users', userCtrl.getUsers);
router.get('/search', userCtrl.searchUser);
router.put('/update-profile/:userId/:profileName', userCtrl.updateProfile);
router.delete('/delete-profile/:userId/:profileName', userCtrl.deleteProfile);

module.exports = router;
