// Analytics Page Script
import { ThemeManager } from './theme.js';

// Initialize theme
const themeManager = new ThemeManager();

// Chart.js defaults
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = '#404040';
Chart.defaults.font.family = "'Inter', sans-serif";

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
});

function initCharts() {
    // Sample data for charts
    const weeklyTempData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Temperature (°C)',
            data: [22, 24, 23, 25, 26, 24, 23],
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2
        }]
    };

    const cityComparisonData = {
        labels: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata'],
        datasets: [{
            label: 'Average Temperature (°C)',
            data: [28, 32, 25, 30, 29],
            backgroundColor: [
                'rgba(59, 130, 246, 0.7)',
                'rgba(168, 85, 247, 0.7)',
                'rgba(16, 185, 129, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(239, 68, 68, 0.7)'
            ],
            borderWidth: 0,
            borderRadius: 8
        }]
    };

    // Create charts with proper configuration
    const weeklyTempChart = new Chart(document.getElementById('weeklyTempChart'), {
        type: 'line',
        data: weeklyTempData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: { 
                    display: false 
                },
                tooltip: {
                    backgroundColor: '#0a0a0a',
                    titleColor: '#e2e8f0',
                    bodyColor: '#cbd5e1'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { 
                        color: '#404040',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '°C';
                        }
                    }
                },
                x: {
                    grid: { 
                        display: false 
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    const cityComparisonChart = new Chart(document.getElementById('cityComparisonChart'), {
        type: 'bar',
        data: cityComparisonData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: { 
                    display: false 
                },
                tooltip: {
                    backgroundColor: '#0a0a0a',
                    titleColor: '#e2e8f0',
                    bodyColor: '#cbd5e1',
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + '°C';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { 
                        color: '#404040',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '°C';
                        }
                    }
                },
                x: {
                    grid: { 
                        display: false 
                    }
                }
            }
        }
    });
}
