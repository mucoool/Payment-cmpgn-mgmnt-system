const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  duration: { type: Number, default: 0 },
});

//// creating model of InteractionSchema 
const Interaction = mongoose.model('Interaction', InteractionSchema);

const campaignSchema = new mongoose.Schema({
  identifier: {
    type: String,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  eligibilityCriteria: {
    type: Object,
    required: true,
    validate: {
      validator: function (criteria) {
        // Ensure minimumPaymentAmount property exists and is a number greater than or equal to 0
        return criteria.minimumPaymentAmount !== undefined && typeof criteria.minimumPaymentAmount === 'number' && criteria.minimumPaymentAmount >= 0;
      },
      message: 'Invalid eligibility criteria',
    },
  },
  participants: {
    type: Number,
    default: 0,
  },
  incentives: {
    type: String,
    required: true,
  },
  totalPaymentsMade: {
    type: Number,
    default: 0,
  },
  remainingTime: {
    type: Number,
    default: 0,
  },
  payments: [
    {
      amount: {
        type: Number,
        default: 0,
      },
    },
  ],
  interactions: [InteractionSchema], 
});

campaignSchema.pre('save', function (next) {
  const currentDate = new Date();
  const endDate = new Date(this.endDate);
  this.remainingTime = endDate.getTime() - currentDate.getTime();
  next();
});

// creating model of campaignSchema
const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = { Campaign, Interaction };
