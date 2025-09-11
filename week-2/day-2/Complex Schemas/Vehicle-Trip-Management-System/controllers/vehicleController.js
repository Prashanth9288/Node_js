const Vehicle = require('../models/Vehicle');

exports.createVehicle = async (req, res, next) => {
  try {
    const { registrationNumber, type, model, isActive } = req.body;
    const vehicle = await Vehicle.create({ registrationNumber, type, model, isActive });
    res.status(201).json({ message: 'Vehicle created', vehicle });
  } catch (err) {
    next(err);
  }
};

exports.getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find();
    res.json({ count: vehicles.length, vehicles });
  } catch (err) {
    next(err);
  }
};

exports.getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ vehicle });
  } catch (err) {
    next(err);
  }
};

exports.updateVehicle = async (req, res, next) => {
  try {
    const updates = (({ registrationNumber, type, model, isActive }) => ({ registrationNumber, type, model, isActive }))(req.body);
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle updated', vehicle });
  } catch (err) {
    next(err);
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle deleted', vehicle });
  } catch (err) {
    next(err);
  }
};

exports.addTrip = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    vehicle.trips.push(req.body);
    await vehicle.save();
    res.status(201).json({ message: 'Trip added', trips: vehicle.trips });
  } catch (err) {
    next(err);
  }
};

exports.updateTripById = async (req, res, next) => {
  try {
    const { id, tripId } = req.params;
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    const trip = vehicle.trips.id(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    const allowed = ['startLocation','endLocation','distance','startTime','endTime'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) trip[field] = req.body[field];
    });
    await vehicle.save();
    res.json({ message: 'Trip updated', trip });
  } catch (err) {
    next(err);
  }
};

exports.updateTripByIndex = async (req, res, next) => {
  try {
    const { id, index } = req.params;
    const idx = parseInt(index, 10);
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    if (isNaN(idx) || idx < 0 || idx >= vehicle.trips.length) {
      return res.status(400).json({ message: 'Invalid trip index' });
    }
    const trip = vehicle.trips[idx];
    const allowed = ['startLocation','endLocation','distance','startTime','endTime'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) trip[field] = req.body[field];
    });
    await vehicle.save();
    res.json({ message: 'Trip updated', trip });
  } catch (err) {
    next(err);
  }
};

exports.deleteTripById = async (req, res, next) => {
  try {
    const { id, tripId } = req.params;
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    const trip = vehicle.trips.id(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    trip.remove();
    await vehicle.save();
    res.json({ message: 'Trip deleted', trips: vehicle.trips });
  } catch (err) {
    next(err);
  }
};

exports.deleteTripByIndex = async (req, res, next) => {
  try {
    const { id, index } = req.params;
    const idx = parseInt(index, 10);
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    if (isNaN(idx) || idx < 0 || idx >= vehicle.trips.length) {
      return res.status(400).json({ message: 'Invalid trip index' });
    }
    vehicle.trips.splice(idx, 1);
    await vehicle.save();
    res.json({ message: 'Trip deleted', trips: vehicle.trips });
  } catch (err) {
    next(err);
  }
};

exports.getTotalDistance = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    const total = vehicle.totalDistance();
    res.json({ vehicleId: vehicle._id, totalDistance: total });
  } catch (err) {
    next(err);
  }
};

exports.getVehiclesLongerThan = async (req, res, next) => {
  try {
    const km = parseFloat(req.params.km);
    if (isNaN(km)) return res.status(400).json({ message: 'Invalid km' });
    const vehicles = await Vehicle.find({
      trips: { $elemMatch: { distance: { $gt: km } } }
    });
    res.json({ count: vehicles.length, vehicles });
  } catch (err) {
    next(err);
  }
};

exports.getVehiclesStartFrom = async (req, res, next) => {
  try {
    const citiesParam = req.query.cities;
    const cities = citiesParam ? citiesParam.split(',').map(s => s.trim()) : ['Delhi', 'Mumbai', 'Bangalore'];
    const vehicles = await Vehicle.find({
      trips: { $elemMatch: { startLocation: { $in: cities } } }
    });
    res.json({ count: vehicles.length, vehicles });
  } catch (err) {
    next(err);
  }
};

exports.getVehiclesStartingAfter = async (req, res, next) => {
  try {
    const date = new Date(req.params.date);
    if (isNaN(date.getTime())) return res.status(400).json({ message: 'Invalid date' });
    const vehicles = await Vehicle.find({
      trips: { $elemMatch: { startTime: { $gte: date } } }
    });
    res.json({ count: vehicles.length, vehicles });
  } catch (err) {
    next(err);
  }
};

exports.getVehiclesByType = async (req, res, next) => {
  try {
    const typesParam = req.query.types;
    const types = typesParam ? typesParam.split(',').map(s => s.trim()) : ['car', 'truck'];
    const vehicles = await Vehicle.find({ type: { $in: types } });
    res.json({ count: vehicles.length, vehicles });
  } catch (err) {
    next(err);
  }
};
