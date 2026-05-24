const WazuhAPI = {
    async request(endpoint, params = {}) {
        const url = new URL(CONFIG.API.BASE_URL + endpoint);
        Object.keys(params).forEach(k => {
            if (params[k] !== null && params[k] !== undefined && params[k] !== '') {
                url.searchParams.set(k, params[k]);
            }
        });

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), CONFIG.API.TIMEOUT);

        try {
            const res = await fetch(url.toString(), { signal: controller.signal });
            if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            return await res.json();
        } catch (err) {
            if (err.name === 'AbortError') throw new Error('Request timeout');
            throw err;
        } finally {
            clearTimeout(timeout);
        }
    },

    async checkHealth() {
        return this.request(CONFIG.API.ENDPOINTS.HEALTH);
    },

    async scanAlerts(filters = {}) {
        return this.request(CONFIG.API.ENDPOINTS.SCAN, {
            min_level: filters.minLevel ?? CONFIG.DEFAULTS.MIN_LEVEL,
            max_level: filters.maxLevel ?? CONFIG.DEFAULTS.MAX_LEVEL,
            limit: filters.limit ?? CONFIG.DEFAULTS.LIMIT,
            start_date: filters.startDate || null,
            end_date: filters.endDate || null,
            rule_id: filters.ruleId || null,
            event_id: filters.eventId || null,
            description: filters.description || null
        });
    }
};
