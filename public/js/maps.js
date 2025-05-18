function initDestinationsMap() {
    // 1. Fetch destination images using Places API
    const placesService = new google.maps.places.PlacesService(document.createElement('div'));
    document.querySelectorAll('.destination-img').forEach(img => {
        const placeName = img.getAttribute('data-place');
        const request = {
            query: placeName,
            fields: ['photos']
        };
        placesService.textSearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results[0].photos) {
                const photoUrl = results[0].photos[0].getUrl({ maxWidth: 400, maxHeight: 200 });
                img.src = photoUrl;
                img.onerror = () => { img.src = '/api/placeholder/400/200'; };
            }
        });
    });

    // 2. Initialize the interactive map
    const map = new google.maps.Map(document.getElementById('destinations-map'), {
        zoom: 2,
        center: { lat: 0, lng: 0 },
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true
    });

    const destinations = [
        { 
            name: 'Paris, France', 
            query: 'Paris, France', 
            position: { lat: 48.8566, lng: 2.3522 },
            description: 'Experience the city of lights with its iconic landmarks and romantic atmosphere.'
        },
        { 
            name: 'Bali, Indonesia', 
            query: 'Bali, Indonesia', 
            position: { lat: -8.3405, lng: 115.0920 },
            description: 'Discover tropical paradise with stunning beaches and rich cultural heritage.'
        },
        { 
            name: 'Tokyo, Japan', 
            query: 'Tokyo, Japan', 
            position: { lat: 35.6762, lng: 139.6503 },
            description: 'Immerse yourself in a blend of traditional culture and futuristic technology.'
        },
        { 
            name: 'New York, USA', 
            query: 'New York, NY, USA', 
            position: { lat: 40.7128, lng: -74.0060 },
            description: 'Experience the vibrant energy of the city that never sleeps.'
        }
    ];

    destinations.forEach(destination => {
        placesService.textSearch({ query: destination.query }, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                const marker = new google.maps.Marker({
                    position: destination.position,
                    map: map,
                    title: destination.name,
                    animation: google.maps.Animation.DROP
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `
                        <div style="max-width: 200px;">
                            <h3>${destination.name}</h3>
                            <p>${destination.description}</p>
                            <a href="#search-form" style="color: #1a73e8;">Plan Your Trip</a>
                        </div>
                    `
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                    map.panTo(destination.position);
                });

                // Pan to marker and open info window on card click
                const card = document.querySelector(`.destination-card[data-destination="${destination.name}"]`);
                if (card) {
                    card.addEventListener('click', () => {
                        map.panTo(destination.position);
                        map.setZoom(10);
                        infoWindow.open(map, marker);
                    });
                }
            }
        });
    });
}
