const express = require('express');
const { Campaign, Interaction } = require('../models/campaign');
const router = express.Router();

const Joi = require('joi');

const campaignSchemaValidation = Joi.object({
  identifier: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  eligibilityCriteria: Joi.object().required(),
  incentives: Joi.string().required(),
});

router.post('/campaigns', async (req, res) => {
  try {
    const { error } = campaignSchemaValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const campaign = new Campaign(req.body);
    campaign.participants = 0;
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/campaigns/:id/participate', async (req, res) => {
    try { 
        console.log("inside try")
      const campaignId = req.params.id;
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      campaign.participants += 1; // Increment participants count
      await campaign.save();
      res.json({ message: 'Successfully participated in the campaign' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  router.post('/campaigns/:id/payments', async (req, res) => {
    try {
      const campaignId = req.params.id;
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      const { amount } = req.body;
      
      const eligibilityCriteria = campaign.eligibilityCriteria;

      if (eligibilityCriteria && eligibilityCriteria.minimumPaymentAmount && amount < eligibilityCriteria.minimumPaymentAmount) {
        return res.status(400).json({ error: 'Payment amount is less than the minimum required amount' });
      }
      campaign.totalPaymentsMade += amount;
  
      campaign.payments.push({ amount }); // Record payment amount
      campaign.participants++;
      await campaign.save();
      res.json({ message: 'Payment recorded successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/interactions', async (req, res) => {
    try {
      // Extract the interaction data from the request body
      const { campaignId, userId, duration } = req.body;
  
      // Create a new interaction document
      const interaction = new Interaction({
        campaign: campaignId,
        user: userId,
        duration,
      });
  
      // Save the interaction to the database
      await interaction.save();
  
      res.status(201).json(interaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.get('/campaigns/:id', async (req, res) => {
    try {
      const campaignId = req.params.id;
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      res.json(campaign);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  
  
  

  router.get('/campaigns/:id/tracking', async (req, res) => {
    try {
      const campaignId = req.params.id;
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      const { participants, totalPaymentsMade, remainingTime } = campaign;
      res.json({ participants, totalPaymentsMade, remainingTime });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  router.get('/campaigns/:id/analytics', async (req, res) => {
    try {
      const campaignId = req.params.id;
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
  
      const totalParticipants = campaign.participants;
  
      // Calculate totalCompletedParticipants based on your criteria
      const totalCompletedParticipants = campaign.payments.reduce((count, payment) => {
        if (payment.amount >= campaign.eligibilityCriteria.minimumPaymentAmount) {
          return count + 1;
        }
        return count;
      }, 0);
  
      const conversionRate = (totalCompletedParticipants / totalParticipants) * 100;
  
      const totalRevenueGenerated = campaign.payments.reduce((total, payment) => {
        return total + payment.amount;
      }, 0);

    // Customer Engagement Metrics
    const totalInteractions = await calculateTotalInteractions(campaignId);
    const averageTimeSpent = await calculateAverageTimeSpent(campaignId);
  
      const analyticsData = {
        totalParticipants,
        conversionRate,
        totalCompletedParticipants,
        totalRevenueGenerated,
        totalInteractions,
        averageTimeSpent,

      };
      res.json(analyticsData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  // Function to calculate the total number of interactions
async function calculateTotalInteractions(campaignId) {
    try {
      const campaign = await Campaign.findById(campaignId).populate('interactions');
      if (!campaign) {
        throw new Error('Campaign not found');
      }
  
      const totalInteractions = campaign.interactions.length;
      return totalInteractions;
    } catch (error) {
      throw new Error('Failed to calculate total interactions');
    }
  }
  
  // Function to calculate the average time spent
  async function calculateAverageTimeSpent(campaignId) {
    try {
      const campaign = await Campaign.findById(campaignId).populate('interactions');
      if (!campaign) {
        throw new Error('Campaign not found');
      }
  
      const interactions = campaign.interactions;
      const totalInteractions = interactions.length;
  
      if (totalInteractions === 0) {
        return 0;
      }
  
      let totalDuration = 0;
      interactions.forEach((interaction) => {
        totalDuration += interaction.duration; // Assuming a "duration" field in the Interaction schema
      });
  
      const averageTimeSpent = totalDuration / totalInteractions;
      return averageTimeSpent;
    } catch (error) {
      throw new Error('Failed to calculate average time spent');
    }
  }
  
  
  
  
  

module.exports = router;
