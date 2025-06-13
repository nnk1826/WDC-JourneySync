window.initMap = function () {
    try {
        const mapElement = document.getElementById("destinations-map");
        if (!mapElement) {
            console.error("Map container 'destinations-map' not found.");
            return;
        }

        const map = new google.maps.Map(mapElement, {
            zoom: 2,
            center: { lat: 0, lng: 0 },
            zoomControl: true,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true
        });

        const destinations = [
            {
                name: "Paris, France",
                position: { lat: 48.8566, lng: 2.3522 },
                description: "Experience the city of lights with its iconic landmarks."
            },
            {
                name: "Bali, Indonesia",
                position: { lat: -8.3405, lng: 115.0920 },
                description: "Discover tropical paradise with stunning beaches."
            },
            {
                name: "Tokyo, Japan",
                position: { lat: 35.6762, lng: 139.6503 },
                description: "A blend of traditional culture and futuristic technology."
            },
            {
                name: "New York, USA",
                position: { lat: 40.7128, lng: -74.0060 },
                description: "The vibrant energy of the city that never sleeps."
            }
        ];

        destinations.forEach(destination => {
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

            marker.addListener("click", () => {
                infoWindow.open(map, marker);
                map.panTo(destination.position);
            });

            const card = document.querySelector(`.destination-card[data-destination="${destination.name}"] .explore-btn`);
            if (card) {
                card.addEventListener("click", () => {
                    map.panTo(destination.position);
                    map.setZoom(10);
                    infoWindow.open(map, marker);
                });
            }
        });

        console.log("Map initialized successfully.");
    } catch (error) {
        console.error("Error initializing Google Map:", error);
    }
};