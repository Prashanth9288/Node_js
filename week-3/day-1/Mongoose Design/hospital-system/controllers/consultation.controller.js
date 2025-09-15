const Consultation = require("../models/consultation.model");
const Doctor = require("../models/doctor.model");
const Patient = require("../models/patient.model");

exports.createConsultation = async (req, res) => {
  try {
    const { doctorId, patientId, notes } = req.body;
    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);
    if (!doctor?.isActive || !patient?.isActive) {
      return res.status(400).json({ message: "Doctor or Patient is inactive" });
    }
    const consultation = new Consultation({ doctorId, patientId, notes });
    await consultation.save();
    res.status(201).json(consultation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecentConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ isActive: true })
      .sort({ consultedAt: -1 })
      .limit(5)
      .populate("doctorId", "name specialization")
      .populate("patientId", "name age gender");
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
