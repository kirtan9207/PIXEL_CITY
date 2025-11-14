// Chart Functions
import { elements } from './dom.js';
import { getAqiDetails } from './utils.js';

// Chart instances
let aqiChartInstance = null;
let trafficChartInstance = null;
let aqiGaugeInstance = null;
let forecastChartInstance = null;

// Update AQI Gauge Chart
export function updateAqiGauge(aqi) {
    const { text, color, gaugeColor } = getAqiDetails(aqi);

    elements.aqiValue.textContent = aqi;
    elements.aqiText.textContent = text;
    elements.aqiText.className = `text-lg sm:text-xl font-semibold ${color}`;

    const gaugeData = {
        datasets: [{
            data: [aqi, 5 - aqi],
            backgroundColor: [gaugeColor, '#404040'],
            borderWidth: 0,
            circumference: 180,
            rotation: 270,
            cutout: '80%',
            borderRadius: 5,
        }]
    };

    if (aqiGaugeInstance) {
        aqiGaugeInstance.destroy();
    }

    aqiGaugeInstance = new Chart(elements.aqiGaugeCanvas, {
        type: 'doughnut',
        data: gaugeData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        }
    });
}

// Update AQI Pollutant Chart
export function updateAqiChart(components) {
    const chartData = {
        labels: ['PM2.5', 'CO', 'NO₂', 'O₃', 'SO₂', 'PM10', 'NH₃'],
        datasets: [{
            label: 'Concentration (μg/m³)',
            data: [
                components.pm2_5,
                components.co,
                components.no2,
                components.o3,
                components.so2,
                components.pm10,
                components.nh3
            ],
            backgroundColor: [
                'rgba(239, 68, 68, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(168, 85, 247, 0.7)',
                'rgba(59, 130, 246, 0.7)',
                'rgba(16, 185, 129, 0.7)',
                'rgba(236, 72, 153, 0.7)',
                'rgba(132, 204, 22, 0.7)'
            ],
            borderColor: '#000',
            borderWidth: 2,
            hoverOffset: 4
        }]
    };

    if (aqiChartInstance) {
        aqiChartInstance.destroy();
    }

    aqiChartInstance = new Chart(elements.aqiChartCanvas, {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        boxWidth: 12
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Update Traffic Chart
export function updateTrafficChart() {
    const mockTrafficData = [
        Math.floor(Math.random() * 80) + 20,
        Math.floor(Math.random() * 70) + 10,
        Math.floor(Math.random() * 90) + 10,
        Math.floor(Math.random() * 80) + 15
    ];

    const ctx = elements.trafficChartCanvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
    gradient.addColorStop(1, 'rgba(168, 85, 247, 0.6)');

    const chartData = {
        labels: ['Downtown', 'North Bridge', 'West Highway', 'City Center'],
        datasets: [{
            label: 'Traffic Congestion (%)',
            data: mockTrafficData,
            backgroundColor: gradient,
            borderColor: 'rgba(96, 165, 250, 0.5)',
            borderWidth: 1,
            borderRadius: 5,
            maxBarThickness: 40,
        }]
    };

    if (trafficChartInstance) {
        trafficChartInstance.destroy();
    }

    trafficChartInstance = new Chart(elements.trafficChartCanvas, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Congestion Level (%)'
                    },
                    grid: {
                        color: '#404040'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'City Zones'
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0a0a0a',
                    titleColor: '#e2e8f0',
                    bodyColor: '#cbd5e1',
                    callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.raw}%`
                    }
                }
            }
        }
    });
}

// Update Forecast Chart
export function updateForecastChart(forecastList) {
    const labels = forecastList.map(item => {
        const date = new Date(item.dt * 1000);
        return `${date.getDate()}/${date.getMonth() + 1} (${date.getHours()}:00)`;
    }).slice(0, 16);

    const dataPoints = forecastList.map(item => item.main.temp).slice(0, 16);

    const ctx = elements.forecastChartCanvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.7)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Temperature (°C)',
            data: dataPoints,
            fill: 'start',
            backgroundColor: gradient,
            borderColor: 'rgba(96, 165, 250, 1)',
            borderWidth: 3,
            pointBackgroundColor: '#fff',
            pointBorderColor: 'rgba(96, 165, 250, 1)',
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3
        }]
    };

    if (forecastChartInstance) {
        forecastChartInstance.destroy();
    }

    forecastChartInstance = new Chart(elements.forecastChartCanvas, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    },
                    grid: {
                        color: '#404040'
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0a0a0a',
                    titleColor: '#e2e8f0',
                    bodyColor: '#cbd5e1',
                    callbacks: {
                        label: (context) => `Temp: ${context.raw.toFixed(1)}°C`
                    }
                }
            }
        }
    });
}
