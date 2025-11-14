// Utility Functions

// Convert degrees to compass direction
export function degToCompass(num) {
    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}

// Get AQI details (text, color, gauge color)
export function getAqiDetails(aqi) {
    switch (aqi) {
        case 1: return { text: 'Good', color: 'text-green-400', gaugeColor: '#22c55e' };
        case 2: return { text: 'Fair', color: 'text-yellow-400', gaugeColor: '#eab308' };
        case 3: return { text: 'Moderate', color: 'text-orange-400', gaugeColor: '#f97316' };
        case 4: return { text: 'Poor', color: 'text-red-400', gaugeColor: '#ef4444' };
        case 5: return { text: 'Very Poor', color: 'text-purple-400', gaugeColor: '#a855f7' };
        default: return { text: 'Unknown', color: 'text-gray-400', gaugeColor: '#64748b' };
    }
}

// Format UNIX timestamp to local time
export function formatTime(unixTimestamp, timezoneOffset) {
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString('en-US', {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Show/hide loading spinner
export function showLoading(isLoading, spinner) {
    if (!spinner) {
        console.warn('Loading spinner element not found');
        return;
    }
    spinner.style.display = isLoading ? 'flex' : 'none';
    spinner.classList.toggle('opacity-0', !isLoading);
    spinner.classList.toggle('opacity-100', isLoading);
}

// Show/hide error message
export function showError(message, errorMessage, errorText) {
    if (message) {
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');
    } else {
        errorMessage.classList.add('hidden');
    }
}
