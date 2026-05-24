const Utils = {
    formatTimestamp(ts) {
        if (!ts) return '-';
        const d = new Date(ts);
        return d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    },

    getLevelClass(level) {
        if (level >= 12) return 'level-critical';
        if (level >= 7) return 'level-warning';
        return 'level-info';
    },

    getLevelLabel(level) {
        if (level >= 12) return 'Critical';
        if (level >= 7) return 'Warning';
        return 'Info';
    },

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str || '';
        return div.innerHTML;
    },

    debounce(fn, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    },

    getAgentName(alert) {
        return alert?.agent?.name || alert?.agent?.id || 'N/A';
    }
};
