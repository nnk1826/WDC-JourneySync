const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getRecommendations = async (location) => {
  try {
    if (!location) return [];
    const response = await axios.get('https://www.triposo.com/api/20210317/local_highlights.json', {
      params: {
        location_id: location,
        account: process.env.TRIPOSO_ACCOUNT,
        token: process.env.TRIPOSO_API_KEY,
      },
    });
    return response.data.results.map(item => ({
      name: item.name,
      location: item.location_id || 'Unknown',
    }));
  } catch (error) {
    console.error('Triposo API error:', error);
    // Mock data fallback
    return [
      { name: `${location} Landmark`, location: location },
      { name: `${location} Museum`, location: location },
    ];
  }
};

module.exports = { getRecommendations };