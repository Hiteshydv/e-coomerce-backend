const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const authRoutes=require('./routes/authRoutes')
const buyersRoutes=require('./routes/buyersRoutes');
const sellersRoutes=require('./routes/sellersRoutes');


const app = express();
const PORT = 3000;
const JWT_SECRET = 'hitesh';


const { User, Catalog, Order } = require('./models/models'); 


mongoose.connect('mongodb+srv://yadavhitesh160:eZ5dCFbOJPS21kFg@cluster0.tt8hte3.mongodb.net/?retryWrites=true&w=majority');

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

app.use(bodyParser.json());
app.use("/api/auth",authRoutes)
app.use("/api/buyers",buyersRoutes)
app.use("/api/sellers",sellersRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
