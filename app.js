// ===== PIXELCITY - SMART WEATHER DASHBOARD =====
// Complete JavaScript Application

// ===== CONFIGURATION =====
const API_KEY = '7a2a656fd379372361359c411aea507d';

const cities = {
    'mumbai': { lat: 19.0760, lon: 72.8777 },
    'delhi': { lat: 28.7041, lon: 77.1025 },
    'bengaluru': { lat: 12.9716, lon: 77.5946 },
    'kolkata': { lat: 22.5726, lon: 88.3639 },
    'chennai': { lat: 13.0827, lon: 80.2707 },
    'london': { lat: 51.5074, lon: -0.1278 },
    'tokyo': { lat: 35.6895, lon: 139.6917 },
    'newyork': { lat: 40.7128, lon: -74.0060 },
    'singapore': { lat: 1.3521, lon: 103.8198 },
    'berlin': { lat: 52.5200, lon: 13.4050 },
    'sydney': { lat: -33.8688, lon: 151.2093 }
};

// Chart.js Configuration
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = '#404040';
Chart.defaults.font.family = "'Inter', sans-serif";

// ===== DOM ELEMENTS =====
const elements = {
    citySelect: document.getElementById('city-select'),
    loadingSpinner: document.getElementById('loading-spinner'),
    errorMessage: document.getElementById('error-message'),
    errorText: document.getElementById('error-text'),
    lastUpdated: document.getElementById('last-updated'),
    greetingText: document.getElementById('greeting-text'),
    liveClock: document.getElementById('live-clock'),
    liveDate: document.getElementById('live-date'),
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
    aqiChartCanvas: document.getElementById('aqiChart'),
    trafficChartCanvas: document.getElementById('trafficChart'),
    aqiGaugeCanvas: document.getElementById('aqiGaugeChart'),
    forecastChartCanvas: document.getElementById('forecastChart')
};

// ===== UTILITY FUNCTIONS =====
function degToCompass(num) {
    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}

function getAqiDetails(aqi) {
    const details = {
        1: {
            text: 'Good',
            color: 'text-green-400',
            gaugeColor: '#22c55e',
            level: 'Excellent',
            range: '0-50',
            health: 'Air quality is satisfactory, and air pollution poses little or no risk.',
            recommendation: 'Perfect for all outdoor activities. Enjoy your day!',
            sensitive: 'No health implications for anyone.',
            activities: ['Running', 'Cycling', 'Outdoor Sports', 'Picnics'],
            precautions: []
        },
        2: {
            text: 'Fair',
            color: 'text-yellow-400',
            gaugeColor: '#eab308',
            level: 'Acceptable',
            range: '51-100',
            health: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.',
            recommendation: 'Generally safe for outdoor activities. Sensitive individuals should monitor symptoms.',
            sensitive: 'Unusually sensitive people should consider limiting prolonged outdoor exertion.',
            activities: ['Walking', 'Light Exercise', 'Outdoor Dining'],
            precautions: ['Monitor symptoms if sensitive', 'Stay hydrated']
        },
        3: {
            text: 'Moderate',
            color: 'text-orange-400',
            gaugeColor: '#f97316',
            level: 'Unhealthy for Sensitive Groups',
            range: '101-150',
            health: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
            recommendation: 'Sensitive groups should reduce prolonged or heavy outdoor exertion.',
            sensitive: 'Children, elderly, and people with respiratory/heart conditions should limit outdoor activities.',
            activities: ['Indoor Activities', 'Light Walking', 'Yoga'],
            precautions: ['Wear mask if sensitive', 'Limit outdoor time', 'Keep windows closed', 'Use air purifier']
        },
        4: {
            text: 'Poor',
            color: 'text-red-400',
            gaugeColor: '#ef4444',
            level: 'Unhealthy',
            range: '151-200',
            health: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.',
            recommendation: 'Everyone should reduce prolonged or heavy outdoor exertion.',
            sensitive: 'Children, elderly, and people with respiratory/heart conditions should avoid outdoor activities.',
            activities: ['Stay Indoors', 'Indoor Gym', 'Home Activities'],
            precautions: ['Wear N95 mask outdoors', 'Avoid outdoor exercise', 'Keep all windows closed', 'Use air purifier', 'Monitor health symptoms']
        },
        5: {
            text: 'Very Poor',
            color: 'text-purple-400',
            gaugeColor: '#a855f7',
            level: 'Hazardous',
            range: '201-300+',
            health: 'Health alert: The risk of health effects is increased for everyone. This is an emergency condition.',
            recommendation: 'Everyone should avoid all outdoor physical activity.',
            sensitive: 'Everyone should stay indoors and keep activity levels low.',
            activities: ['Stay Home', 'Indoor Rest', 'Minimal Movement'],
            precautions: ['Stay indoors at all times', 'Seal windows and doors', 'Use air purifier continuously', 'Wear N95/N99 mask if must go out', 'Seek medical help if symptoms occur']
        }
    };
    
    return details[aqi] || {
        text: 'Unknown',
        color: 'text-gray-400',
        gaugeColor: '#64748b',
        level: 'Data Unavailable',
        range: 'N/A',
        health: 'Unable to determine air quality.',
        recommendation: 'Check back later for updates.',
        sensitive: 'Exercise caution.',
        activities: [],
        precautions: []
    };
}

function formatTime(unixTimestamp, timezoneOffset) {
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString('en-US', {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function showLoading(isLoading) {
    if (!elements.loadingSpinner) return;
    elements.loadingSpinner.style.display = isLoading ? 'flex' : 'none';
}

function showError(message) {
    if (message) {
        elements.errorText.textContent = message;
        elements.errorMessage.classList.remove('hidden');
    } else {
        elements.errorMessage.classList.add('hidden');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 bg-slate-800/90 backdrop-blur-xl border p-4 rounded-lg shadow-lg fade-in ${
        type === 'success' ? 'border-green-500' : 
        type === 'error' ? 'border-red-500' : 
        'border-blue-500'
    }`;
    
    notification.innerHTML = `<p class="text-white text-sm">${message}</p>`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== THEME MANAGER =====
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.theme);
        this.setupToggleButtons();
    }

    applyTheme(theme) {
        const body = document.body;
        if (theme === 'light') {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
        } else {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
        }
        this.theme = theme;
        localStorage.setItem('theme', theme);
        this.updateIcons();
    }

    toggle() {
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    updateIcons() {
        const darkIcons = document.querySelectorAll('#theme-icon-dark');
        const lightIcons = document.querySelectorAll('#theme-icon-light');
        
        if (this.theme === 'light') {
            darkIcons.forEach(icon => icon.classList.remove('hidden'));
            lightIcons.forEach(icon => icon.classList.add('hidden'));
        } else {
            darkIcons.forEach(icon => icon.classList.add('hidden'));
            lightIcons.forEach(icon => icon.classList.remove('hidden'));
        }
    }

    setupToggleButtons() {
        const toggleButtons = document.querySelectorAll('#theme-toggle');
        toggleButtons.forEach(button => {
            button?.addEventListener('click', () => this.toggle());
        });
    }
}

// ===== LOCATION MANAGER =====
class LocationManager {
    constructor() {
        this.currentLocation = null;
    }

    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
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
                    reject(new Error('Location permission denied'));
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        });
    }

    findNearestCity(userLat, userLon, cities) {
        let nearestCity = null;
        let minDistance = Infinity;

        for (const [cityKey, coords] of Object.entries(cities)) {
            const distance = this.calculateDistance(userLat, userLon, coords.lat, coords.lon);
            if (distance < minDistance) {
                minDistance = distance;
                nearestCity = cityKey;
            }
        }

        return { city: nearestCity, distance: minDistance };
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
}

// ===== VOICE COMMANDS =====
class VoiceCommands {
    constructor(onCommand) {
        this.onCommand = onCommand;
        this.recognition = null;
        this.isListening = false;
        this.initSpeechRecognition();
    }

    initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                this.processCommand(transcript);
            };

            this.recognition.onend = () => {
                this.isListening = false;
            };
        }
    }

    start() {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
            this.isListening = true;
            return true;
        }
        return false;
    }

    processCommand(transcript) {
        if (transcript.includes('weather')) {
            const city = this.extractCity(transcript);
            if (city) {
                this.onCommand({ type: 'weather', city });
                this.speak(`Getting weather for ${city}`);
            }
        } else if (transcript.includes('location')) {
            this.onCommand({ type: 'location' });
        } else if (transcript.includes('theme')) {
            this.onCommand({ type: 'theme' });
        }
    }

    extractCity(transcript) {
        const cityList = ['mumbai', 'delhi', 'bengaluru', 'kolkata', 'chennai', 'london', 'tokyo', 'singapore'];
        for (const city of cityList) {
            if (transcript.includes(city)) return city;
        }
        return null;
    }

    speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        }
    }

    isSupported() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }
}

// ===== AI WEATHER INSIGHTS =====
class WeatherAI {
    generateInsights(weather) {
        const insights = [];
        const temp = weather.main.temp;
        const humidity = weather.main.humidity;
        const weatherMain = weather.weather[0].main.toLowerCase();

        if (temp > 35) {
            insights.push({
                icon: '🔥',
                title: 'Extreme Heat Alert',
                message: 'Stay hydrated! Drink water every 30 minutes.',
                type: 'danger',
                action: 'Avoid outdoor activities between 12-4 PM'
            });
        } else if (temp >= 20 && temp <= 28) {
            insights.push({
                icon: '🌤️',
                title: 'Perfect Weather',
                message: 'Ideal conditions for outdoor activities!',
                type: 'success',
                action: 'Great time for a walk or picnic'
            });
        }

        if (weatherMain.includes('rain')) {
            insights.push({
                icon: '☔',
                title: 'Rain Expected',
                message: 'Don\'t forget your umbrella!',
                type: 'warning',
                action: 'Carry raincoat or umbrella'
            });
        }

        if (humidity > 80) {
            insights.push({
                icon: '💧',
                title: 'High Humidity',
                message: 'It might feel warmer than actual temperature.',
                type: 'info',
                action: 'Use AC or fan for comfort'
            });
        }

        // Activity suggestion
        const activities = weatherMain.includes('clear') && temp >= 20 && temp <= 30
            ? ['🏃 Jogging', '🚴 Cycling', '⚽ Sports']
            : ['📚 Reading', '🎬 Movies', '☕ Cafe Visit'];

        insights.push({
            icon: '🎯',
            title: 'Activity Suggestions',
            message: `Perfect time for: ${activities.join(', ')}`,
            type: 'success',
            action: 'Choose your favorite activity'
        });

        return insights;
    }
}

// ===== CHART INSTANCES =====
let aqiChartInstance = null;
let trafficChartInstance = null;
let aqiGaugeInstance = null;
let forecastChartInstance = null;

// ===== CHART FUNCTIONS =====
function updateAqiGauge(aqi) {
    const details = getAqiDetails(aqi);
    elements.aqiValue.textContent = aqi;
    elements.aqiText.textContent = details.text;
    elements.aqiText.className = `text-lg sm:text-xl font-semibold ${details.color}`;

    // Update detailed AQI info
    updateAqiDetailedInfo(details);

    const gaugeData = {
        datasets: [{
            data: [aqi, 5 - aqi],
            backgroundColor: [details.gaugeColor, '#404040'],
            borderWidth: 0,
            circumference: 180,
            rotation: 270,
            cutout: '80%',
            borderRadius: 5
        }]
    };

    if (aqiGaugeInstance) aqiGaugeInstance.destroy();
    aqiGaugeInstance = new Chart(elements.aqiGaugeCanvas, {
        type: 'doughnut',
        data: gaugeData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
    });
}

function updateAqiDetailedInfo(details) {
    const container = document.getElementById('aqi-detailed-info');
    if (!container) return;

    container.innerHTML = `
        <div class="space-y-4 mt-6">
            <!-- Level & Range -->
            <div class="bg-slate-900/50 rounded-xl p-4 border-l-4" style="border-color: ${details.gaugeColor}">
                <div class="flex justify-between items-center mb-2">
                    <h4 class="text-white font-bold text-lg">${details.level}</h4>
                    <span class="text-slate-400 text-sm">Range: ${details.range}</span>
                </div>
                <p class="text-slate-300 text-sm">${details.health}</p>
            </div>

            <!-- Recommendations -->
            <div class="bg-slate-900/50 rounded-xl p-4">
                <h4 class="text-white font-semibold mb-2 flex items-center gap-2">
                    <span>💡</span> General Recommendation
                </h4>
                <p class="text-slate-300 text-sm">${details.recommendation}</p>
            </div>

            <!-- Sensitive Groups -->
            <div class="bg-slate-900/50 rounded-xl p-4">
                <h4 class="text-white font-semibold mb-2 flex items-center gap-2">
                    <span>⚠️</span> For Sensitive Groups
                </h4>
                <p class="text-slate-300 text-sm">${details.sensitive}</p>
            </div>

            <!-- Suggested Activities -->
            ${details.activities.length > 0 ? `
            <div class="bg-slate-900/50 rounded-xl p-4">
                <h4 class="text-white font-semibold mb-3 flex items-center gap-2">
                    <span>🎯</span> Suggested Activities
                </h4>
                <div class="flex flex-wrap gap-2">
                    ${details.activities.map(activity => `
                        <span class="px-3 py-1 bg-slate-800 rounded-full text-slate-300 text-xs">${activity}</span>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Precautions -->
            ${details.precautions.length > 0 ? `
            <div class="bg-slate-900/50 rounded-xl p-4">
                <h4 class="text-white font-semibold mb-3 flex items-center gap-2">
                    <span>🛡️</span> Safety Precautions
                </h4>
                <ul class="space-y-2">
                    ${details.precautions.map(precaution => `
                        <li class="text-slate-300 text-sm flex items-start gap-2">
                            <span class="text-red-400 mt-1">•</span>
                            <span>${precaution}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            ` : ''}

            <!-- Pollutant Info -->
            <div class="bg-slate-900/50 rounded-xl p-4">
                <h4 class="text-white font-semibold mb-3 flex items-center gap-2">
                    <span>🔬</span> What is AQI?
                </h4>
                <p class="text-slate-300 text-sm mb-3">
                    Air Quality Index (AQI) is calculated based on major pollutants:
                </p>
                <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="bg-slate-800/50 p-2 rounded">
                        <span class="text-slate-400">PM2.5:</span>
                        <span class="text-white ml-1">Fine particles</span>
                    </div>
                    <div class="bg-slate-800/50 p-2 rounded">
                        <span class="text-slate-400">PM10:</span>
                        <span class="text-white ml-1">Coarse particles</span>
                    </div>
                    <div class="bg-slate-800/50 p-2 rounded">
                        <span class="text-slate-400">NO₂:</span>
                        <span class="text-white ml-1">Nitrogen dioxide</span>
                    </div>
                    <div class="bg-slate-800/50 p-2 rounded">
                        <span class="text-slate-400">O₃:</span>
                        <span class="text-white ml-1">Ozone</span>
                    </div>
                    <div class="bg-slate-800/50 p-2 rounded">
                        <span class="text-slate-400">SO₂:</span>
                        <span class="text-white ml-1">Sulfur dioxide</span>
                    </div>
                    <div class="bg-slate-800/50 p-2 rounded">
                        <span class="text-slate-400">CO:</span>
                        <span class="text-white ml-1">Carbon monoxide</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updateAqiChart(components) {
    const chartData = {
        labels: ['PM2.5', 'CO', 'NO₂', 'O₃', 'SO₂', 'PM10', 'NH₃'],
        datasets: [{
            label: 'Concentration (μg/m³)',
            data: [components.pm2_5, components.co, components.no2, components.o3, components.so2, components.pm10, components.nh3],
            backgroundColor: ['rgba(239, 68, 68, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(168, 85, 247, 0.7)', 'rgba(59, 130, 246, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(236, 72, 153, 0.7)', 'rgba(132, 204, 22, 0.7)'],
            borderWidth: 0
        }]
    };

    if (aqiChartInstance) aqiChartInstance.destroy();
    aqiChartInstance = new Chart(elements.aqiChartCanvas, {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            cutout: '60%'
        }
    });
}

function updateTrafficChart() {
    const mockData = [Math.floor(Math.random() * 80) + 20, Math.floor(Math.random() * 70) + 10, Math.floor(Math.random() * 90) + 10, Math.floor(Math.random() * 80) + 15];
    
    if (trafficChartInstance) trafficChartInstance.destroy();
    trafficChartInstance = new Chart(elements.trafficChartCanvas, {
        type: 'bar',
        data: {
            labels: ['Downtown', 'North Bridge', 'West Highway', 'City Center'],
            datasets: [{
                label: 'Traffic Congestion (%)',
                data: mockData,
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 100 } },
            plugins: { legend: { display: false } }
        }
    });
}

function updateForecastChart(forecastList) {
    const labels = forecastList.slice(0, 16).map(item => {
        const date = new Date(item.dt * 1000);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    });
    const dataPoints = forecastList.slice(0, 16).map(item => item.main.temp);

    if (forecastChartInstance) forecastChartInstance.destroy();
    forecastChartInstance = new Chart(elements.forecastChartCanvas, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: dataPoints,
                borderColor: 'rgba(96, 165, 250, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

// ===== UI UPDATE FUNCTIONS =====
function updateKpiCards(weather) {
    elements.tempValue.textContent = `${Math.round(weather.main.temp)}°`;
    elements.weatherDesc.textContent = weather.weather[0].description;
    elements.weatherIcon.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
    elements.tempMax.textContent = Math.round(weather.main.temp_max);
    elements.tempMin.textContent = Math.round(weather.main.temp_min);
    elements.humidityValue.textContent = `${weather.main.humidity}%`;
    elements.windValue.textContent = `${(weather.wind.speed * 3.6).toFixed(1)} kph`;
    elements.windDirection.textContent = degToCompass(weather.wind.deg);
    elements.feelsLike.textContent = `${Math.round(weather.main.feels_like)}°`;
    elements.sunriseTime.textContent = formatTime(weather.sys.sunrise, weather.timezone);
    elements.sunsetTime.textContent = formatTime(weather.sys.sunset, weather.timezone);
    elements.pressureValue.textContent = `${weather.main.pressure} hPa`;
    elements.visibilityValue.textContent = `${(weather.visibility / 1000).toFixed(1)} km`;
}

function updateTimeAndGreeting() {
    const now = new Date();
    const hours = now.getHours();

    if (elements.greetingText) {
        elements.greetingText.textContent = hours < 12 ? 'Good Morning!' : hours < 18 ? 'Good Afternoon!' : 'Good Evening!';
    }

    if (elements.liveClock) {
        elements.liveClock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
}

// ===== API FUNCTIONS =====
async function fetchDashboardData(cityKey) {
    showLoading(true);
    showError(false);

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

        const weatherData = await weatherResponse.json();
        const airQualityData = await airQualityResponse.json();
        const forecastData = await forecastResponse.json();

        updateKpiCards(weatherData);
        updateAqiGauge(airQualityData.list[0].main.aqi);
        updateAqiChart(airQualityData.list[0].components);
        updateTrafficChart();
        updateForecastChart(forecastData.list);
        displayAIInsights(weatherData);

        elements.lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// ===== AI INSIGHTS DISPLAY =====
function displayAIInsights(weather) {
    const insights = weatherAI.generateInsights(weather);
    const container = document.getElementById('insights-container');
    const section = document.getElementById('ai-insights');
    
    if (!container || !section) return;

    container.innerHTML = '';
    section.classList.remove('hidden');

    insights.forEach((insight, index) => {
        const card = document.createElement('div');
        card.className = `bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 fade-in border-l-4`;
        card.style.animationDelay = `${index * 100}ms`;
        
        const typeColors = {
            danger: 'border-red-500',
            warning: 'border-orange-500',
            info: 'border-blue-500',
            success: 'border-green-500'
        };
        
        card.classList.add(typeColors[insight.type]);
        
        card.innerHTML = `
            <div class="flex items-start gap-3">
                <span class="text-3xl">${insight.icon}</span>
                <div class="flex-1">
                    <h4 class="text-white font-bold mb-1">${insight.title}</h4>
                    <p class="text-slate-300 text-sm mb-2">${insight.message}</p>
                    <p class="text-slate-400 text-xs">💡 ${insight.action}</p>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// ===== INITIALIZATION =====
const themeManager = new ThemeManager();
const locationManager = new LocationManager();
const weatherAI = new WeatherAI();
let voiceCommands = null;

// Auto Location
document.getElementById('auto-location-btn')?.addEventListener('click', async () => {
    try {
        const location = await locationManager.getCurrentLocation();
        const nearest = locationManager.findNearestCity(location.lat, location.lon, cities);
        elements.citySelect.value = nearest.city;
        await fetchDashboardData(nearest.city);
        showNotification(`Location detected: ${nearest.city}`, 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
});

// Voice Commands
document.getElementById('voice-btn')?.addEventListener('click', () => {
    if (!voiceCommands) {
        voiceCommands = new VoiceCommands((command) => {
            if (command.type === 'weather' && command.city) {
                elements.citySelect.value = command.city;
                fetchDashboardData(command.city);
            } else if (command.type === 'location') {
                document.getElementById('auto-location-btn')?.click();
            } else if (command.type === 'theme') {
                themeManager.toggle();
            }
        });
    }
    
    if (voiceCommands.start()) {
        const voiceStatus = document.getElementById('voice-status');
        voiceStatus?.classList.remove('hidden');
        setTimeout(() => voiceStatus?.classList.add('hidden'), 5000);
    }
});

// City Selection
elements.citySelect?.addEventListener('change', (e) => {
    fetchDashboardData(e.target.value);
});

// Initial Load
updateTimeAndGreeting();
setInterval(updateTimeAndGreeting, 1000);
fetchDashboardData(elements.citySelect.value);
