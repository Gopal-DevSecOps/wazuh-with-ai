const CONFIG = {
    API: {
        BASE_URL: 'http://192.168.1.77:9999',
        ENDPOINTS: {
            HEALTH: '/health',
            SCAN: '/scan'
        },
        TIMEOUT: 10000
    },
    DEFAULTS: {
        MIN_LEVEL: 5,
        MAX_LEVEL: 15,
        LIMIT: 500,
        REFRESH_INTERVAL: 30000
    },
    COLORS: {
        CRITICAL: '#e74c3c',
        WARNING: '#f39c12',
        INFO: '#27ae60',
        PRIMARY: '#3498db',
        DARK: '#1a1a2e',
        CARD_BG: 'rgba(15, 52, 96, 0.9)'
    }
};
