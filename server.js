const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const errorMiddleWare = require('./middleware/errorHandlingMiddleware');
const arcjetMIddleware = require('./middleware/arcjetMiddleware');
const app = express();

const mongoose = require('mongoose');

const db = mongoose.connection;
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log('connected to DB');
  } catch (err) {
    console.log('not connecting to DB', err.message);
  }
};
connectDB();

app.use(express.json());
const PORT = process.env.PORT || 3500;

app.use(arcjetMIddleware);

app.use('/users', require('./routes/userRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/workflows', require('./routes/workflowRoutes'));

app.use(cookieParser());

app.use(errorMiddleWare);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`App is listening on posrt ${PORT}`);
  });
});
db.on('error', (err) => {
  console.log('i ma test', err);
});

db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});
