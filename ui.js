// UI Update Functions
import { elements } from './dom.js';
import { degToCompass, formatTime } from './utils.js';

// Update KPI cards with weather data
export function updateKpiCards(weather, air) {
    // Weather Card
    elements.tempValue.textContent = `${Math.round(weather.main.temp)}°C`;
    elements.weatherDesc.textContent = weather.weather[0].description;
    elements.weatherIcon.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
    elements.weatherIcon.alt = weather.weather[0].description;
    elements.weatherIcon.classList.remove('opacity-70');
    elements.tempMax.textContent = `${Math.round(weather.main.temp_max)}`;
    elements.tempMin.textContent = `${Math.round(weather.main.temp_min)}`;

    // Humidity Card
    elements.humidityValue.textContent = `${weather.main.humidity}%`;

    // Wind Card
    elements.windValue.textContent = `${(weather.wind.speed * 3.6).toFixed(1)} kph`;
    elements.windDirection.textContent = degToCompass(weather.wind.deg);

    // Feels Like Card
    elements.feelsLike.textContent = `${Math.round(weather.main.feels_like)}°C`;

    // Sunrise/Sunset Card
    elements.sunriseTime.textContent = formatTime(weather.sys.sunrise, weather.timezone);
    elements.sunsetTime.textContent = formatTime(weather.sys.sunset, weather.timezone);

    // Pressure/Visibility Card
    elements.pressureValue.textContent = `${weather.main.pressure} hPa`;
    elements.visibilityValue.textContent = `${(weather.visibility / 1000).toFixed(1)} km`;
}

// Update time and greeting
export function updateTimeAndGreeting() {
    const now = new Date();
    const hours = now.getHours();

    if (elements.greetingText) {
        if (hours < 12) {
            elements.greetingText.textContent = 'Good Morning!';
        } else if (hours < 18) {
            elements.greetingText.textContent = 'Good Afternoon!';
        } else {
            elements.greetingText.textContent = 'Good Evening!';
        }
    }

    if (elements.liveClock) {
        elements.liveClock.textContent = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    }
    
    if (elements.liveDate) {
        elements.liveDate.textContent = now.toLocaleDateString([], { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
}
