
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', password: hashed });
    console.log('Usuario creado');
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
