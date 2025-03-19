const Subscription = require('../model/subscriptionModel');
const { serve } = require('@upstash/workflow/express');
const dayjs = require('dayjs');
const sendReminderEmail = require('../utils/send-email');
const { now } = require('mongoose');

const REMINDERS = [7, 5, 2, 1];

const sendReminder = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;

  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== 'active') return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for subscription ${subscriptionId}, stopping workflow`
    );
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');
    console.log(reminderDate);

    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(
        context,
        `Reminder ${daysBefore} days before`,
        reminderDate
      );
    }
    console.log('hi after sleeping');

    if (dayjs().isSame(reminderDate, 'day')) {
      await triggerReminder(
        context,
        `${daysBefore} days before reminder`,
        subscription
      );
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    return Subscription.findById(subscriptionId).populate(
      'user',
      'username email'
    );
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);
    console.log('this is user name', subscription.user.username);
    console.log('this is user email', subscription.user.email);

    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    });
  });
};

module.exports = sendReminder;
