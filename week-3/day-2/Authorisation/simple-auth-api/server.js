require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI);

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/protected', require('./routes/protected'));

app.get('/', (req, res) => res.send('Simple Auth API is running'));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
