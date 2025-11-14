// API Functions
import { API_KEY, cities } from './config.js';
import { showLoading, showError } from './utils.js';
import { elements } from './dom.js';
import { updateKpiCards } from './ui.js';
import { updateAqiGauge, updateAqiChart, updateTrafficChart, updateForecastChart } from './charts.js';

// Fetch all dashboard data
export async function fetchDashboardData(cityKey) {
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        showError("Please add your OpenWeatherMap API key in config.js", elements.errorMessage, elements.errorText);
        showLoading(false, elements.loadingSpinner);
        return;
    }

    showLoading(true, elements.loadingSpinner);
    showError(false, elements.errorMessage, elements.errorText);
    elements.lastUpdated.textContent = 'Fetching new data...';
    elements.lastUpdated.classList.add('animate-pulse');

    const { lat, lon } = cities[cityKey];
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
        const [weatherResponse, airQualityResponse, forecastResponse] = await Promise.all([
            fetch(weatherUrl),
            fetch(airQualityUrl),
            fetch(forecastUrl)
        ]);

        if (weatherResponse.status === 401 || airQualityResponse.status === 401 || forecastResponse.status === 401) {
            throw new Error("401 Unauthorized. Please check your API key.");
        }

        if (!weatherResponse.ok || !airQualityResponse.ok || !forecastResponse.ok) {
            throw new Error(`API Error: ${weatherResponse.statusText} / ${airQualityResponse.statusText} / ${forecastResponse.statusText}`);
        }

        const weatherData = await weatherResponse.json();
        const airQualityData = await airQualityResponse.json();
        const forecastData = await forecastResponse.json();

        // Update all UI components
        updateKpiCards(weatherData, airQualityData);
        updateAqiGauge(airQualityData.list[0].main.aqi);
        updateAqiChart(airQualityData.list[0].components);
        updateTrafficChart();
        updateForecastChart(forecastData.list);

        // Trigger AI insights display (if function exists)
        if (typeof window.displayAIInsights === 'function') {
            window.displayAIInsights(weatherData);
        }

        elements.lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    } catch (error) {
        console.error("Failed to fetch data:", error);
        showError(error.message, elements.errorMessage, elements.errorText);
        elements.lastUpdated.textContent = 'Data update failed.';
    } finally {
        showLoading(false, elements.loadingSpinner);
        elements.lastUpdated.classList.remove('animate-pulse');
    }
}
