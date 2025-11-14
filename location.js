// Location Management
export class LocationManager {
    constructor() {
        this.currentLocation = null;
    }

    // Get user's current location
    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    resolve(this.currentLocation);
                },
                (error) => {
                    let errorMessage = 'Unable to retrieve your location';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location permission denied';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out';
                            break;
                    }
                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }

    // Find nearest city from predefined list
    findNearestCity(userLat, userLon, cities) {
        let nearestCity = null;
        let minDistance = Infinity;

        for (const [cityKey, coords] of Object.entries(cities)) {
            const distance = this.calculateDistance(
                userLat, 
                userLon, 
                coords.lat, 
                coords.lon
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearestCity = cityKey;
            }
        }

        return { city: nearestCity, distance: minDistance };
    }

    // Calculate distance between two coordinates (Haversine formula)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        
        return distance;
    }

    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Get city name from coordinates using reverse geocoding
    async getCityNameFromCoords(lat, lon, apiKey) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
            );
            
            if (!response.ok) {
                throw new Error('Geocoding failed');
            }

            const data = await response.json();
            if (data && data.length > 0) {
                return {
                    name: data[0].name,
                    country: data[0].country,
                    state: data[0].state
                };
            }
            
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    }
}
