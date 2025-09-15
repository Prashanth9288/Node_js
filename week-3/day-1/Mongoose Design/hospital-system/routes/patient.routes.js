const express = require("express");
const router = express.Router();
const {
  createPatient,
  getPatientDoctors,
  getMalePatients,
  deletePatient
} = require("../controllers/patient.controller");

router.post("/", createPatient);
router.get("/:id/doctors", getPatientDoctors);
router.get("/", getMalePatients);
router.delete("/:id", deletePatient);

module.exports = router;
