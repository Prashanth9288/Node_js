const Patient = require("../models/patient.model");
const Consultation = require("../models/consultation.model");

exports.createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPatientDoctors = async (req, res) => {
  try {
    const doctors = await Consultation.find({
      patientId: req.params.id,
      isActive: true
    }).populate("doctorId", "name specialization");

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMalePatients = async (req, res) => {
  try {
    const { gender } = req.query;
    const patients = await Patient.find({ gender, isActive: true });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndUpdate(req.params.id, { isActive: false });
    await Consultation.updateMany({ patientId: req.params.id }, { isActive: false });
    res.json({ message: "Patient and related consultations deactivated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
