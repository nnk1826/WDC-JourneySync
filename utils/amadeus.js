const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const searchHotels = async (params) => {
  try {
    const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode', {
      params: {
        latitude: params.latitude,
        longitude: params.longitude,
        radius: params.radius || 5,
      },
      headers: {
        Authorization: `Bearer ${process.env.AMADEUS_API_KEY}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch hotels');
  }
};

module.exports = { searchHotels };