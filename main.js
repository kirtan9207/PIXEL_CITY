// Main Application Entry Point
import { initChartDefaults, cities } from './config.js';
import { elements } from './dom.js';
import { fetchDashboardData } from './api.js';
import { updateTimeAndGreeting } from './ui.js';
import { ThemeManager } from './theme.js';
import { LocationManager } from './location.js';
import { VoiceCommands } from './voice-commands.js';
import { WeatherAI } from './ai-insights.js';
import { CityComparison } from './comparison.js';

// Initialize Chart.js defaults
initChartDefaults();

// Initialize Theme Manager
const themeManager = new ThemeManager();

// Initialize Location Manager
const locationManager = new LocationManager();

// Initialize AI & Voice
const weatherAI = new WeatherAI();
const cityComparison = new CityComparison();
let voiceCommands = null;
let comparisonMode = false;

// Auto-detect location on load
async function autoDetectLocation() {
    const autoLocationBtn = document.getElementById('auto-location-btn');
    
    if (autoLocationBtn) {
        autoLocationBtn.addEventListener('click', async () => {
            autoLocationBtn.disabled = true;
            autoLocationBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            `;
            
            try {
                const location = await locationManager.getCurrentLocation();
                const nearest = locationManager.findNearestCity(location.lat, location.lon, cities);
                
                // Update dropdown
                elements.citySelect.value = nearest.city;
                
                // Fetch data for detected city
                await fetchDashboardData(nearest.city);
                
                // Show success message
                showNotification(`Location detected: ${nearest.city.charAt(0).toUpperCase() + nearest.city.slice(1)}`, 'success');
                
            } catch (error) {
                console.error('Location error:', error);
                showNotification(error.message, 'error');
            } finally {
                autoLocationBtn.disabled = false;
                autoLocationBtn.innerHTML = `
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                `;
            }
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 glass-card p-4 rounded-lg shadow-lg fade-in ${
        type === 'success' ? 'border-l-4 border-green-500' : 
        type === 'error' ? 'border-l-4 border-red-500' : 
        'border-l-4 border-blue-500'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            ${type === 'success' ? `
                <svg class="w-5 h-5 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            ` : type === 'error' ? `
                <svg class="w-5 h-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
            ` : `
                <svg class="w-5 h-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
            `}
            <p class="text-white text-sm">${message}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Event Listeners
elements.citySelect.addEventListener('change', (e) => {
    fetchDashboardData(e.target.value);
});

// Initial Load
updateTimeAndGreeting();
setInterval(updateTimeAndGreeting, 1000);
fetchDashboardData(elements.citySelect.value);
autoDetectLocation();


// Voice Command Handler
function initVoiceCommands() {
    const voiceBtn = document.getElementById('voice-btn');
    const voiceStatus = document.getElementById('voice-status');
    
    if (!voiceBtn) return;

    voiceCommands = new VoiceCommands((command) => {
        console.log('Command received:', command);
        
        switch(command.type) {
            case 'weather':
                if (command.city) {
                    elements.citySelect.value = command.city;
                    fetchDashboardData(command.city);
                }
                break;
            case 'location':
                document.getElementById('auto-location-btn')?.click();
                break;
            case 'theme':
                themeManager.toggle();
                break;
            case 'forecast':
                showNotification('Showing 5-day forecast', 'info');
                break;
        }
    });

    if (voiceCommands.isSupported()) {
        voiceBtn.addEventListener('click', () => {
            if (voiceCommands.start()) {
                voiceStatus.classList.remove('hidden');
                setTimeout(() => {
                    voiceStatus.classList.add('hidden');
                }, 5000);
            } else {
                showNotification('Voice commands not supported', 'error');
            }
        });
    } else {
        voiceBtn.disabled = true;
        voiceBtn.classList.add('opacity-50');
    }
}

// AI Insights Display
function displayAIInsights(weather) {
    const insights = weatherAI.generateInsights(weather);
    const container = document.getElementById('insights-container');
    const section = document.getElementById('ai-insights');
    
    if (!container || !section) return;

    container.innerHTML = '';
    section.classList.remove('hidden');

    insights.forEach((insight, index) => {
        const card = document.createElement('div');
        card.className = `bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 fade-in`;
        card.style.animationDelay = `${index * 100}ms`;
        
        const typeColors = {
            danger: 'border-red-500',
            warning: 'border-orange-500',
            info: 'border-blue-500',
            success: 'border-green-500'
        };
        
        card.classList.add('border-l-4', typeColors[insight.type]);
        
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

// Comparison Mode Toggle
function initComparisonMode() {
    const compareBtn = document.getElementById('compare-btn');
    const comparisonSection = document.getElementById('comparison-mode');
    
    if (!compareBtn || !comparisonSection) return;

    compareBtn.addEventListener('click', () => {
        comparisonMode = !comparisonMode;
        
        if (comparisonMode) {
            comparisonSection.classList.remove('hidden');
            compareBtn.classList.add('bg-orange-500/20');
            showNotification('Comparison mode activated! Select cities to compare', 'info');
        } else {
            comparisonSection.classList.add('hidden');
            compareBtn.classList.remove('bg-orange-500/20');
            cityComparison.clear();
        }
    });
}

// Make displayAIInsights available globally
window.displayAIInsights = displayAIInsights;

// Initialize all features
initVoiceCommands();
initComparisonMode();
