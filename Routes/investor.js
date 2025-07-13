const express = require('express');
const router = express.Router();

module.exports = (collections) => {
  const { InvestorRegister, UserType } = collections;

  router.post('/InvestorRegister', async (req, res) => {
    const {
      id,
      investorType,
      investmentRange,
      industries,
      location,
      linkedinProfile,
      otherlinks,
      accreditation,
      termsAccepted,
      investmentExperience,
      email,
      name,
      about,
      Portfolio,
      investments,
      connections,
      join_month,
      join_year
    } = req.body;

    try {
      await UserType.insertOne({ id,email, type: "Investor" });
      await InvestorRegister.insertOne({
        id,
        investorType,
        investmentRange,
        industries,
        location,
        linkedinProfile,
        accreditation,
        termsAccepted,
        investmentExperience,
        otherlinks,
        email,
        name,
        about,
        Portfolio,
        investments,
        connections,
        join_month,
        join_year
      });

      res.status(200).json({ message: "Successfully registered" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  router.get('/Investor', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const investor = await InvestorRegister.findOne({ id });

    if (!investor) {
      return res.status(404).json({ error: 'Investor not found' });
    }

    res.status(200).json(investor);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } 
  });

  router.put('/Investor_update', async (req, res) => {
  const { id, key, data } = req.body;

  if (!id || !key || typeof data === 'undefined') {
    return res.status(400).json({ error: 'Missing required fields: id, key, or data' });
  }

  try {
    // Get the current document
    const investor = await InvestorRegister.findOne({ id });
    console.log(id);
    if (!investor) {
      return res.status(404).json({ error: 'Investor not found' });
    }

    // Check if the field exists and is an array
    const isArrayField = Array.isArray(investor[key]);
    console.log(isArrayField);
    let updateOp;
    if (isArrayField) {
      updateOp = { $push: { [key]: data } };
    } else {
      updateOp = { $set: { [key]: data } };
    }

    const result = await InvestorRegister.updateOne({ id }, updateOp);

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'No changes were made' });
    }

    res.status(200).json({ message: `Investor ${isArrayField ? 'updated (array appended)' : 'updated'}` });
  } catch (error) {
    console.error('Error updating investor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  return router;
};
