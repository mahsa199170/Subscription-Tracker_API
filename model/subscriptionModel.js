const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'subscription name is required'],
      trim: true,
      minLength: 2,
      maxLength: 100,
      lowercase: true,
      unique: true,
    },
    price: {
      type: Number,
      required: [true, 'Subscription price is required'],
      min: [0, 'Price must be greater than 0'],
    },
    currency: {
      type: String,
      enum: ['CAD', 'USD'],
      default: 'USD',
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
      type: String,
      enum: [
        'sports',
        'news',
        'entertainment',
        'lifestyle',
        'technology',
        'finance',
        'politics',
        'other',
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'expired'],
      default: 'active',
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: 'start date must be in the past',
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: 'Renewal date must be after the start date',
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Auto-calculate renewal date if missing.
subscriptionSchema.pre('save', function (next) {
  if (!this.renewalDate) {
    const period = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + period[this.frequency]
    );
  }

  if (this.renewalDate < new Date()) {
    this.status = 'expired';
  }

  next();
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
