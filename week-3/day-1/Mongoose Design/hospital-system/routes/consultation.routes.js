const express = require("express");
const router = express.Router();
const {
  createConsultation,
  getRecentConsultations
} = require("../controllers/consultation.controller");

router.post("/", createConsultation);
router.get("/recent", getRecentConsultations);

module.exports = router;
