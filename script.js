// Main Script - Initialize all modules

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM CONTENT LOADED ===');
    console.log('Chat by Fan initializing...');

    // Wait for all scripts to load
    setTimeout(() => {
        console.log('Initializing modules after timeout...');

        // Initialize all modules in correct order
        if (typeof window.initAuth === 'function') {
            console.log('Calling initAuth...');
            window.initAuth();
            console.log('✅ Auth module initialized');
        } else {
            console.error('❌ initAuth function not found');
        }

        if (typeof window.initUI === 'function') {
            console.log('Calling initUI...');
            window.initUI();
            console.log('✅ UI module initialized');
        } else {
            console.error('❌ initUI function not found');
        }

        // Chat will be initialized after authentication
        console.log('✅ All modules loaded successfully');
    }, 1000); // Wait 1 second for all scripts to load
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // You could send error reports to a service here
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // You could send error reports to a service here
});

// Service worker for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Register service worker for offline functionality
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Prevent context menu on mobile
document.addEventListener('contextmenu', (e) => {
    if (window.innerWidth <= 768) {
        e.preventDefault();
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('Connection restored');
    window.showNotification('Соединение восстановлено', 'success');
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
    window.showNotification('Соединение потеряно', 'error');
});

// Performance monitoring (optional)
if ('performance' in window && 'getEntriesByType' in performance) {
    window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', navigation.loadEventEnd - navigation.fetchStart, 'ms');
    });
}