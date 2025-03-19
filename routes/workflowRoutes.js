const express = require('express');

const sendReminder = require('../controllers/workflowController');
const workFlowRouter = express.Router();

workFlowRouter.post('/subscriptions/reminder', sendReminder);

module.exports = workFlowRouter;
