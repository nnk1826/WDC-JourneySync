const express = require('express');
const router = express.Router();
const { amadeus } = require('../utils/amadeus');

router.get('/api/hotels', async (req, res) => {
  const { cityCode } = req.query;
  try {
    if (!cityCode) {
      return res.status(400).json({ error: 'cityCode is required' });
    }
    const response = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: cityCode
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;