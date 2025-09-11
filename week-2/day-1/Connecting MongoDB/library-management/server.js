const express = require("express");
const connetTodb = require("./config/db");
const dotenv = require("dotenv");
const bookRoutes = require("./routes/bookRoutes");


dotenv.config();
connetTodb()

const app = express();

// Middleware
app.use(express.json());

app.use("/", bookRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);