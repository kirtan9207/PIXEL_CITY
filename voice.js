// Voice Command System
export class VoiceCommands {
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
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                this.processCommand(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
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

    stop() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    processCommand(transcript) {
        console.log('Voice command:', transcript);

        // Weather query
        if (transcript.includes('weather')) {
            const city = this.extractCity(transcript);
            if (city) {
                this.onCommand({ type: 'weather', city });
                this.speak(`Getting weather for ${city}`);
            } else {
                this.speak('Which city would you like to check?');
            }
        }
        
        // Temperature query
        else if (transcript.includes('temperature') || transcript.includes('temp')) {
            this.onCommand({ type: 'temperature' });
            this.speak('Checking current temperature');
        }
        
        // Rain query
        else if (transcript.includes('rain')) {
            this.onCommand({ type: 'rain' });
        }
        
        // Forecast query
        else if (transcript.includes('forecast') || transcript.includes('tomorrow')) {
            this.onCommand({ type: 'forecast' });
            this.speak('Showing forecast');
        }
        
        // Location detection
        else if (transcript.includes('my location') || transcript.includes('detect location')) {
            this.onCommand({ type: 'location' });
            this.speak('Detecting your location');
        }
        
        // Theme change
        else if (transcript.includes('dark mode') || transcript.includes('light mode')) {
            this.onCommand({ type: 'theme' });
            this.speak('Changing theme');
        }
        
        else {
            this.speak('Sorry, I didn\'t understand that command');
        }
    }

    extractCity(transcript) {
        const cities = ['mumbai', 'delhi', 'bengaluru', 'bangalore', 'kolkata', 'chennai', 
                       'london', 'tokyo', 'new york', 'singapore', 'berlin', 'sydney'];
        
        for (const city of cities) {
            if (transcript.includes(city)) {
                return city === 'bangalore' ? 'bengaluru' : city.replace(' ', '');
            }
        }
        return null;
    }

    speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    }

    isSupported() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }
}
