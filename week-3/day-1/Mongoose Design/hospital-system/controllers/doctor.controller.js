const Doctor = require("../models/doctor.model");
const Consultation = require("../models/consultation.model");

exports.createDoctor = async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctorPatients = async (req, res) => {
  try {
    const patients = await Consultation.find({
      doctorId: req.params.id,
      isActive: true
    })
      .populate("patientId", "name age gender")
      .sort({ consultedAt: -1 })
      .limit(10);

    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctorConsultationCount = async (req, res) => {
  try {
    const count = await Consultation.countDocuments({
      doctorId: req.params.id,
      isActive: true
    });
    res.json({ doctorId: req.params.id, totalConsultations: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.id, { isActive: false });
    await Consultation.updateMany({ doctorId: req.params.id }, { isActive: false });
    res.json({ message: "Doctor and related consultations deactivated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
