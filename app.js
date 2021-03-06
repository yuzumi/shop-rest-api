const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');

const { database } = require('./config');

const productsRoutes = require('./src/routes/products');
const ordersRoutes = require('./src/routes/orders');
const userRoutes = require('./src/routes/user');

const app = express();

dotenv.config();

mongoose.set('useFindAndModify', false);

mongoose
  .connect(`${database.url}${database.name}`, database.options)
  .then(() => console.log('Database connection established'))
  .catch(console.error);

app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');

    return res.status(200).json({});
  }

  next();
});

app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not Found');

  error.status = 404;

  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message
    }
  });
});

module.exports = app;
