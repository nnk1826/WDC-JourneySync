const express = require('express');
const router = express.Router();
const Amadeus = require('amadeus');

router.get('/', async (req, res) => {
  try {
    const { cityCode } = req.query;
    
    if (!cityCode) {
      return res.status(400).json({ error: 'City code is required' });
    }

    if (!/^[A-Z]{3}$/i.test(cityCode)) {
      return res.status(400).json({ error: 'Invalid city code format (use 3 letters)' });
    }

    const response = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: cityCode.toUpperCase()
    });

    res.json(response.data || []);
    
  } catch (error) {
    console.error('Hotel API Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.statusCode
    });
    res.status(500).json({ 
      error: 'Failed to fetch hotels',
      details: error.message 
    });
  }
});

module.exports = router;
