require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routes = require('./routes');
app.use(express.json());
app.use('/api', routes);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'server error' });
});
const PORT = process.env.PORT || 3000;
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(PORT, () => console.log('Server listening on', PORT));
})();
