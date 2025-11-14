// AI Weather Insights Engine
export class WeatherAI {
    constructor() {
        this.insights = [];
    }

    // Generate smart insights based on weather data
    generateInsights(weather) {
        this.insights = [];
        const temp = weather.main.temp;
        const humidity = weather.main.humidity;
        const windSpeed = weather.wind.speed * 3.6; // m/s to kph
        const weatherMain = weather.weather[0].main.toLowerCase();
        const feelsLike = weather.main.feels_like;

        // Temperature insights
        if (temp > 35) {
            this.insights.push({
                icon: '🔥',
                title: 'Extreme Heat Alert',
                message: 'Stay hydrated! Drink water every 30 minutes.',
                type: 'danger',
                action: 'Avoid outdoor activities between 12-4 PM'
            });
        } else if (temp > 30) {
            this.insights.push({
                icon: '☀️',
                title: 'Hot Weather',
                message: 'Perfect for swimming or indoor activities.',
                type: 'warning',
                action: 'Wear light, breathable clothing'
            });
        } else if (temp < 10) {
            this.insights.push({
                icon: '🥶',
                title: 'Cold Weather',
                message: 'Bundle up! Layer your clothing.',
                type: 'info',
                action: 'Wear jacket and warm clothes'
            });
        } else if (temp >= 20 && temp <= 28) {
            this.insights.push({
                icon: '🌤️',
                title: 'Perfect Weather',
                message: 'Ideal conditions for outdoor activities!',
                type: 'success',
                action: 'Great time for a walk or picnic'
            });
        }

        // Rain/Weather insights
        if (weatherMain.includes('rain')) {
            this.insights.push({
                icon: '☔',
                title: 'Rain Expected',
                message: 'Don\'t forget your umbrella!',
                type: 'warning',
                action: 'Carry raincoat or umbrella'
            });
        }

        if (weatherMain.includes('storm') || weatherMain.includes('thunder')) {
            this.insights.push({
                icon: '⚡',
                title: 'Storm Warning',
                message: 'Stay indoors if possible.',
                type: 'danger',
                action: 'Avoid outdoor activities'
            });
        }

        // Humidity insights
        if (humidity > 80) {
            this.insights.push({
                icon: '💧',
                title: 'High Humidity',
                message: 'It might feel warmer than actual temperature.',
                type: 'info',
                action: 'Use AC or fan for comfort'
            });
        }

        // Wind insights
        if (windSpeed > 40) {
            this.insights.push({
                icon: '💨',
                title: 'Strong Winds',
                message: 'Secure loose objects outdoors.',
                type: 'warning',
                action: 'Be careful while driving'
            });
        }

        // Feels like difference
        const tempDiff = Math.abs(temp - feelsLike);
        if (tempDiff > 5) {
            this.insights.push({
                icon: '🌡️',
                title: 'Temperature Perception',
                message: `Feels ${feelsLike > temp ? 'warmer' : 'cooler'} than actual temperature.`,
                type: 'info',
                action: 'Dress according to feels-like temperature'
            });
        }

        // Activity suggestions
        this.insights.push(this.getActivitySuggestion(weather));

        return this.insights;
    }

    getActivitySuggestion(weather) {
        const temp = weather.main.temp;
        const weatherMain = weather.weather[0].main.toLowerCase();
        const hour = new Date().getHours();

        let activities = [];

        if (weatherMain.includes('clear') && temp >= 20 && temp <= 30) {
            activities = ['🏃 Jogging', '🚴 Cycling', '⚽ Sports', '🎨 Outdoor Photography'];
        } else if (weatherMain.includes('rain')) {
            activities = ['📚 Reading', '🎬 Movies', '☕ Cafe Visit', '🎮 Gaming'];
        } else if (temp > 30) {
            activities = ['🏊 Swimming', '🍦 Ice Cream', '🏬 Mall Visit', '🎭 Indoor Activities'];
        } else if (temp < 15) {
            activities = ['☕ Hot Drinks', '🍲 Comfort Food', '🏠 Stay Cozy', '🎥 Netflix'];
        } else {
            activities = ['🚶 Walking', '🛍️ Shopping', '🍽️ Dining Out', '📸 Photography'];
        }

        return {
            icon: '🎯',
            title: 'Activity Suggestions',
            message: `Perfect time for: ${activities.join(', ')}`,
            type: 'success',
            action: 'Choose your favorite activity'
        };
    }

    // Get outfit recommendation
    getOutfitRecommendation(temp, weather) {
        if (temp > 30) {
            return {
                icon: '👕',
                outfit: 'Light cotton clothes, shorts, sunglasses',
                accessories: ['🕶️ Sunglasses', '🧢 Cap', '🧴 Sunscreen']
            };
        } else if (temp > 20) {
            return {
                icon: '👔',
                outfit: 'T-shirt, jeans, comfortable shoes',
                accessories: ['🕶️ Sunglasses', '💼 Light bag']
            };
        } else if (temp > 10) {
            return {
                icon: '🧥',
                outfit: 'Light jacket, long pants, closed shoes',
                accessories: ['🧣 Light scarf', '🎒 Backpack']
            };
        } else {
            return {
                icon: '🧥',
                outfit: 'Heavy jacket, warm layers, boots',
                accessories: ['🧣 Scarf', '🧤 Gloves', '🎩 Warm hat']
            };
        }
    }

    // Health recommendations
    getHealthTips(weather) {
        const tips = [];
        const temp = weather.main.temp;
        const humidity = weather.main.humidity;

        if (temp > 35) {
            tips.push('💧 Drink 3-4 liters of water today');
            tips.push('🏃 Avoid strenuous exercise outdoors');
        }

        if (humidity > 70) {
            tips.push('🌬️ Use dehumidifier if indoors');
            tips.push('💦 Stay in well-ventilated areas');
        }

        if (weather.weather[0].main.toLowerCase().includes('rain')) {
            tips.push('🦠 Wash hands frequently');
            tips.push('☕ Have warm beverages');
        }

        return tips;
    }
}
