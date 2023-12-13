const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'hitesh';


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
