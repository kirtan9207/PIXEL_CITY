// City Comparison System
export class CityComparison {
    constructor() {
        this.cities = [];
        this.maxCities = 3;
    }

    addCity(cityData) {
        if (this.cities.length < this.maxCities) {
            this.cities.push(cityData);
            return true;
        }
        return false;
    }

    removeCity(cityName) {
        this.cities = this.cities.filter(city => city.name !== cityName);
    }

    clear() {
        this.cities = [];
    }

    getCities() {
        return this.cities;
    }

    compare() {
        if (this.cities.length < 2) {
            return null;
        }

        const comparison = {
            temperature: this.compareTemperature(),
            humidity: this.compareHumidity(),
            windSpeed: this.compareWindSpeed(),
            airQuality: this.compareAirQuality(),
            bestCity: this.findBestCity()
        };

        return comparison;
    }

    compareTemperature() {
        const temps = this.cities.map(city => ({
            name: city.name,
            temp: city.weather.main.temp,
            feelsLike: city.weather.main.feels_like
        }));

        const hottest = temps.reduce((max, city) => city.temp > max.temp ? city : max);
        const coldest = temps.reduce((min, city) => city.temp < min.temp ? city : min);

        return { temps, hottest, coldest };
    }

    compareHumidity() {
        return this.cities.map(city => ({
            name: city.name,
            humidity: city.weather.main.humidity
        }));
    }

    compareWindSpeed() {
        return this.cities.map(city => ({
            name: city.name,
            windSpeed: (city.weather.wind.speed * 3.6).toFixed(1)
        }));
    }

    compareAirQuality() {
        return this.cities.map(city => ({
            name: city.name,
            aqi: city.airQuality?.list[0]?.main?.aqi || 'N/A'
        }));
    }

    findBestCity() {
        // Score based on multiple factors
        const scores = this.cities.map(city => {
            let score = 0;
            const temp = city.weather.main.temp;
            const humidity = city.weather.main.humidity;
            const aqi = city.airQuality?.list[0]?.main?.aqi || 3;

            // Temperature score (20-28°C is ideal)
            if (temp >= 20 && temp <= 28) score += 40;
            else if (temp >= 15 && temp <= 32) score += 20;

            // Humidity score (40-60% is ideal)
            if (humidity >= 40 && humidity <= 60) score += 30;
            else if (humidity >= 30 && humidity <= 70) score += 15;

            // Air quality score
            if (aqi === 1) score += 30;
            else if (aqi === 2) score += 20;
            else if (aqi === 3) score += 10;

            return {
                name: city.name,
                score,
                reasons: this.getScoreReasons(temp, humidity, aqi)
            };
        });

        return scores.reduce((best, city) => city.score > best.score ? city : best);
    }

    getScoreReasons(temp, humidity, aqi) {
        const reasons = [];
        
        if (temp >= 20 && temp <= 28) reasons.push('Perfect temperature');
        if (humidity >= 40 && humidity <= 60) reasons.push('Comfortable humidity');
        if (aqi === 1) reasons.push('Excellent air quality');
        
        return reasons;
    }
}
