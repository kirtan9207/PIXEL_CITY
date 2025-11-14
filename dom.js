// DOM Element References - Updated for new UI
export const elements = {
    // Controls
    citySelect: document.getElementById('city-select'),
    loadingSpinner: document.getElementById('loading-spinner'),
    errorMessage: document.getElementById('error-message'),
    errorText: document.getElementById('error-text'),
    lastUpdated: document.getElementById('last-updated'),
    
    // Header
    greetingText: document.getElementById('greeting-text'),
    liveClock: document.getElementById('live-clock'),
    liveDate: document.getElementById('live-date'),
    
    // KPI Cards
    tempValue: document.getElementById('temp-value'),
    weatherDesc: document.getElementById('weather-desc'),
    weatherIcon: document.getElementById('weather-icon'),
    aqiValue: document.getElementById('aqi-value'),
    aqiText: document.getElementById('aqi-text'),
    humidityValue: document.getElementById('humidity-value'),
    feelsLike: document.getElementById('feels-like'),
    windValue: document.getElementById('wind-value'),
    windDirection: document.getElementById('wind-direction'),
    tempMax: document.getElementById('temp-max'),
    tempMin: document.getElementById('temp-min'),
    sunriseTime: document.getElementById('sunrise-time'),
    sunsetTime: document.getElementById('sunset-time'),
    pressureValue: document.getElementById('pressure-value'),
    visibilityValue: document.getElementById('visibility-value'),
    
    // Canvas Elements
    aqiChartCanvas: document.getElementById('aqiChart'),
    trafficChartCanvas: document.getElementById('trafficChart'),
    aqiGaugeCanvas: document.getElementById('aqiGaugeChart'),
    forecastChartCanvas: document.getElementById('forecastChart')
};

// Log missing elements for debugging
Object.entries(elements).forEach(([key, value]) => {
    if (!value) {
        console.warn(`Missing element: ${key}`);
    }
});
