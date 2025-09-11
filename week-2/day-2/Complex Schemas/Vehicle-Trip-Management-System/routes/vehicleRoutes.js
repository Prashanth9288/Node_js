const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

router.get('/queries/longer-than/:km', vehicleController.getVehiclesLongerThan);
router.get('/queries/start-from', vehicleController.getVehiclesStartFrom);
router.get('/queries/starting-after/:date', vehicleController.getVehiclesStartingAfter);
router.get('/queries/type', vehicleController.getVehiclesByType);

router.post('/', vehicleController.createVehicle);
router.get('/', vehicleController.getAllVehicles);

router.post('/:id/trips', vehicleController.addTrip);
router.put('/:id/trips/:tripId', vehicleController.updateTripById);
router.put('/:id/trips/index/:index', vehicleController.updateTripByIndex);
router.delete('/:id/trips/:tripId', vehicleController.deleteTripById);
router.delete('/:id/trips/index/:index', vehicleController.deleteTripByIndex);

router.get('/:id/total-distance', vehicleController.getTotalDistance);

router.get('/:id', vehicleController.getVehicleById);
router.put('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;
