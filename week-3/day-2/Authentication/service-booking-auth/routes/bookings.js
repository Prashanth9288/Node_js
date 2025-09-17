const express = require('express');
const router = express.Router();

const {
  createBooking,
  getBookings,
  updateBooking,
  cancelBooking,
  approveBooking,
  rejectBooking,
  adminDeleteBooking
} = require('../controllers/bookingController');

const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(authenticateToken);

router.post('/', authorizeRoles('user','admin'), createBooking);
router.get('/', getBookings);
router.put('/:id', authorizeRoles('user','admin'), updateBooking);
router.delete('/:id', authorizeRoles('user','admin'), cancelBooking);
router.patch('/:id/approve', authorizeRoles('admin'), approveBooking);
router.patch('/:id/reject', authorizeRoles('admin'), rejectBooking);
router.delete('/:id/admin', authorizeRoles('admin'), adminDeleteBooking);

module.exports = router;
