const express = require('express');
const app = express();
const db = require("./models/db");
require('dotenv').config();

const authMiddleware = require("./middleware/AuthMiddleware");
const todoRoutes = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/user',userRoutes);

app.use('/api',authMiddleware,todoRoutes);

db.sequelize.sync();

app.listen(3000);