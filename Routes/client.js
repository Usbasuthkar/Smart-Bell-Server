const express = require('express');
const router = express.Router();

module.exports = (collections) => {
  const { ClientRegister, UserType } = collections;

  router.post('/ClientRegister', async (req, res) => {
    const {
      id,
      role,
      companyName,
      industry,
      experienceLevel,
      linkedinProfile,
      otherIndustry,
      location,
      referralCode,
      otherlinks,
      name,
      email,
      about,
      Portfolio,
      investments,
      connections,
      join_month,
      join_year
    } = req.body;

    try {
      await UserType.insertOne({ id,email, type: "Client" });
      await ClientRegister.insertOne({
        id,
        role,
        companyName,
        industry,
        experienceLevel,
        linkedinProfile,
        location,
        referralCode,
        otherIndustry,
        otherlinks,
        email,
        about,
        name,
        Portfolio,
        investments,
        connections,
        join_month,
        join_year
      });

      return res.status(200).json({ message: "Successfully registered" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
  router.get('/Client', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }

    const client = await ClientRegister.findOne({ id });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    return res.status(200).json(client);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    } 
  });
  
  router.put('/Client_update', async (req, res) => {
  const { id, key, data } = req.body;

  if (!id || !key || typeof data === 'undefined') {
    return res.status(400).json({ error: 'Missing required fields: id, key, or data' });
  }

  try {
    // Get the current document
    const client = await ClientRegister.findOne({ id });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Check if the field exists and is an array
    const isArrayField = Array.isArray(client[key]);
    console.log(client[key]);
    let updateOp;
    if (isArrayField) {
      updateOp = { $push: { [key]: data } };
    } else {
      updateOp = { $set: { [key]: data } };
    }

    const result = await ClientRegister.updateOne({ id }, updateOp);

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'No changes were made' });
    }

    res.status(200).json({ message: `Client ${isArrayField ? 'updated (array appended)' : 'updated'}` });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  return router;
};
