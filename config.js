// API Configuration
export const API_KEY = '7a2a656fd379372361359c411aea507d';

// City coordinates
export const cities = {
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

// Chart.js default configuration
export function initChartDefaults() {
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = '#404040';
    Chart.defaults.font.family = "'Inter', sans-serif";
}
