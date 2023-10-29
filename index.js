const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
//const path = require('path')
require('dotenv').config()
const MONGO_URl =process.env.MONGO_URl
const CLIENT_URL  = process.env.CLIENT_URL
// Middleware

const corsOptions = {
    origin: `${CLIENT_URL}`, 
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  };
  
  // Enable CORS with the defined options
  app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/files", express.static("files"));
// // Routes
app.use('/api/auth', require('./routes/Auth.js')); 
app.use('/api/products', require('./routes/Products.js')); 
// Connect to MongoDB
mongoose.connect(`${MONGO_URl}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
