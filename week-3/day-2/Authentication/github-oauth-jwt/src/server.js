require('dotenv').config();
const express=require('express');

const cors=require('cors');

const path=require('path');

const app=express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

app.use('/auth',require('./routes/auth'));

app.use('/api',require('./routes/protected'));

const PORT=process.env.PORT || 4000;
app.listen(PORT,()=>{
  console.log(`Server listening on http://localhost:${PORT}`);
})
