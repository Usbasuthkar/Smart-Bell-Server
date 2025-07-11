const express = require('express');
const router = express.Router();

module.exports = (collections) => {
  const { InvestorRegister, ClientRegister } = collections;

  // Fetch data based on userType (investor/client)
  router.get('/dashboard', async (req, res) => {
    try {
        console.log('req : ', req.query);
      const { userType } = req.query; // e.g., /dashboard/data?userType=client

      if (!userType) {
        return res.status(400).json({ error: "userType is required (investor/client)" });
      }

      let data;
      if (userType === 'Investor') {
        data = await ClientRegister.find({}).toArray(); // Investors see clients
      } else if (userType === 'Client') {
        data = await InvestorRegister.find({}).toArray(); // Clients see investors
      } else {
        return res.status(400).json({ error: "Invalid userType" });
      }

      res.json({ success: true, data });
    } catch (err) {
      console.err("Dashboard error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  return router;
};