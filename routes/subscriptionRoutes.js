const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const {
  getSubscription,
  getSubscriptions,
  getUserSubscriptions,
  updateSubscription,
  deleteSubscription,
  createSubscription,
} = require('../controllers/subscriptionController');

const subscriptionRouter = express.Router();

subscriptionRouter.get('/', getSubscriptions);

subscriptionRouter.get('/:id', getSubscription);

subscriptionRouter.get('/user/:id', authMiddleware, getUserSubscriptions);

subscriptionRouter.post('/', authMiddleware, createSubscription);

subscriptionRouter.put('/:id', updateSubscription);

subscriptionRouter.delete('/:id', deleteSubscription);

module.exports = subscriptionRouter;
