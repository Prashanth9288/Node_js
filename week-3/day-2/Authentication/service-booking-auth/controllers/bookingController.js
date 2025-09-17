const Booking = require('../models/Booking');

async function createBooking(req, res, next) {
  try {
    const { serviceName, requestedAt } = req.body;
    if (!serviceName || !requestedAt) return res.status(400).json({ message: 'Missing fields' });
    const booking = new Booking({
      user: req.user.id,
      serviceName,
      requestedAt: new Date(requestedAt),
      status: 'pending'
    });
    await booking.save();
    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    next(err);
  }
}

async function getBookings(req, res, next) {
  try {
    if (req.user.role === 'admin') {
      const all = await Booking.find().populate('user', 'username email').sort({ createdAt: -1 });
      return res.json({ bookings: all });
    }
    const mine = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ bookings: mine });
  } catch (err) {
    next(err);
  }
}

async function updateBooking(req, res, next) {
  try {
    const { id } = req.params;
    const { serviceName, requestedAt } = req.body;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not yours' });
    if (booking.status !== 'pending') return res.status(400).json({ message: 'Can only update pending bookings' });
    if (serviceName) booking.serviceName = serviceName;
    if (requestedAt) booking.requestedAt = new Date(requestedAt);
    await booking.save();
    res.json({ message: 'Booking updated', booking });
  } catch (err) {
    next(err);
  }
}

async function cancelBooking(req, res, next) {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not yours' });
    if (booking.status !== 'pending') return res.status(400).json({ message: 'Can only cancel pending bookings' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    next(err);
  }
}

async function approveBooking(req, res, next) {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'approved';
    await booking.save();
    res.json({ message: 'Booking approved', booking });
  } catch (err) {
    next(err);
  }
}

async function rejectBooking(req, res, next) {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'rejected';
    await booking.save();
    res.json({ message: 'Booking rejected', booking });
  } catch (err) {
    next(err);
  }
}

async function adminDeleteBooking(req, res, next) {
  try {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createBooking,
  getBookings,
  updateBooking,
  cancelBooking,
  approveBooking,
  rejectBooking,
  adminDeleteBooking
};
