const express = require('express');
const { getRecommendations } = require('../utils/triposo');
const Itinerary = require('../models/Itinerary');
const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.user) return res.redirect('/login');
    try {
        const itineraries = await Itinerary.findAll({ where: { userId: req.user.id } });
        let recommendations = [];
        if (itineraries.length > 0 && itineraries[0].destinations?.length > 0) {
            const firstDestination = itineraries[0].destinations[0].name;
            recommendations = await getRecommendations(firstDestination);
        }
        res.render('itinerary', {
            user: req.user,
            itineraries,
            recommendations,
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        });
    } catch (err) {
        console.error('Error fetching itineraries or recommendations:', err);
        res.status(500).send('Server error');
    }
});

router.post('/create', async (req, res) => {
    if (!req.user) return res.redirect('/login');
    const { tripName, startDate, endDate, destinations } = req.body;
    try {
        const destinationList = destinations.split(',').map(name => ({
            name: name.trim(),
            lat: 0, // Replace with actual lat/lng if available
            lng: 0,
        }));
        const itinerary = await Itinerary.create({
            userId: req.user.id,
            tripName,
            startDate,
            endDate,
            destinations: destinationList,
            dailyPlans: [],
        });
        const recommendations = await getRecommendations(destinationList[0]?.name || '');
        res.render('itinerary', {
            user: req.user,
            itineraries: [itinerary],
            recommendations,
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        });
    } catch (err) {
        console.error('Error creating itinerary:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;