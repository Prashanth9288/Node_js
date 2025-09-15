const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
app.use(express.json());

const doctorRoutes = require("./routes/doctor.routes");
const patientRoutes = require("./routes/patient.routes");
const consultationRoutes = require("./routes/consultation.routes");

app.use("/doctors", doctorRoutes);
app.use("/patients", patientRoutes);
app.use("/consultations", consultationRoutes);

app.get("/", (req, res) => res.send("Hospital API Running"));

connectDB();
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
