const Subscription = require('../model/subscriptionModel');
const workflowClient = require('../config/upstash');
const mongoose = require('mongoose');

//getting all subscriptions
const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();
    if (!subscriptions) {
      return res
        .status(404)
        .json({ success: false, message: 'No subscription found!' });
    }

    res.status(200).json({
      success: true,
      message: 'all subscriptions retreieved successfully',
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

//getting a subscription
const getSubscription = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid subscription ID' });
    }
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: 'No subscription found!' });
    }
    res.status(200).json({
      success: true,
      message: 'subscription retreieved successfully',
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

// getting subscriptions of a user
const getUserSubscriptions = async (req, res, next) => {
  // console.log(req.params.id);
  // console.log(req.user._id);
  try {
    if (req.params.id !== req.user._id.toString()) {
      const error = new Error(
        'you are not the authorized to access this resource!'
      );
      error.statusCode = 401;
      throw error;
    }
    const userSubscriptions = await Subscription.find({
      user: req.params.id,
    });
    res.status(200).json({
      success: true,
      message: 'all user subscriptions retrieved successfully',
      data: userSubscriptions,
    });
  } catch (error) {
    next(error);
  }
};

//creating subscription
const createSubscription = async (req, res, next) => {
  try {
    const existingSubscription = await Subscription.findOne({
      name: req.body.name.trim().toLowerCase(),
    });

    if (existingSubscription) {
      const error = new Error('Subscription already exists');
      error.statusCode = 409;
      throw error;
    }
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${process.env.SERVER_URL}/workflows/subscriptions/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        'content-type': 'application/json',
      },
      retries: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: { subscription, workflowRunId },
    });
  } catch (error) {
    next(error);
  }
};

//updating subscription

const updateSubscription = async (req, res, next) => {
  try {
    const { name, price, frequency, currency, category, paymentMethod } =
      req.body;

    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid subscription ID' });
    }

    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: 'Subscription not found!' });
    }

    if (name) subscription.name = name;
    if (price) subscription.price = price;
    if (frequency) subscription.frequency = frequency;
    if (category) subscription.category = category;
    if (currency) subscription.currency = currency;
    if (paymentMethod) subscription.paymentMethod = paymentMethod;

    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'subscription updated successfully',
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

//deleting subscription
const deleteSubscription = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid subscription ID' });
    }

    const deletedSubscription = await Subscription.findByIdAndDelete(id);

    if (!deletedSubscription) {
      return res
        .status(404)
        .json({ success: false, message: 'No subscription found!' });
    }

    res.status(200).json({
      success: true,
      message: 'subscription removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubscription,
  getSubscriptions,
  getUserSubscriptions,
  updateSubscription,
  deleteSubscription,
  createSubscription,
};
