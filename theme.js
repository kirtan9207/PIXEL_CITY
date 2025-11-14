// Theme Management
export class ThemeManager {
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
        const themeText = document.getElementById('theme-text');
        
        if (this.theme === 'light') {
            darkIcons.forEach(icon => icon.classList.remove('hidden'));
            lightIcons.forEach(icon => icon.classList.add('hidden'));
            if (themeText) themeText.textContent = 'Light Mode';
        } else {
            darkIcons.forEach(icon => icon.classList.add('hidden'));
            lightIcons.forEach(icon => icon.classList.remove('hidden'));
            if (themeText) themeText.textContent = 'Dark Mode';
        }
    }

    setupToggleButtons() {
        const toggleButtons = document.querySelectorAll('#theme-toggle, #theme-toggle-settings');
        toggleButtons.forEach(button => {
            button?.addEventListener('click', () => this.toggle());
        });
    }
}
