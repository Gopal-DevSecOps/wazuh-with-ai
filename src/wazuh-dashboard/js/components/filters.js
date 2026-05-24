class FiltersComponent {
    constructor(containerId, onSearch) {
        this.container = document.getElementById(containerId);
        this.onSearch = onSearch;
        this.filters = {};
    }

    render() {
        this.container.innerHTML = `
            <div class="card filters-card">
                <h2>Search Filters</h2>
                <div class="filter-group">
                    <label for="min-level">Minimum Level: <span id="min-level-value">${CONFIG.DEFAULTS.MIN_LEVEL}</span></label>
                    <input type="range" id="min-level" min="0" max="15" value="${CONFIG.DEFAULTS.MIN_LEVEL}">
                </div>
                <div class="filter-group">
                    <label for="max-level">Maximum Level: <span id="max-level-value">${CONFIG.DEFAULTS.MAX_LEVEL}</span></label>
                    <input type="range" id="max-level" min="0" max="15" value="${CONFIG.DEFAULTS.MAX_LEVEL}">
                </div>
                <div class="filter-group">
                    <label for="rule-id">Rule ID</label>
                    <input type="text" id="rule-id" placeholder="e.g., 5710">
                </div>
                <div class="filter-group">
                    <label for="event-id">Event ID</label>
                    <input type="text" id="event-id" placeholder="e.g., 4624">
                </div>
                <div class="filter-group">
                    <label for="description">Description</label>
                    <input type="text" id="description" placeholder="Search in description...">
                </div>
                <div class="filter-group">
                    <label for="start-date">Start Date</label>
                    <input type="datetime-local" id="start-date">
                </div>
                <div class="filter-group">
                    <label for="end-date">End Date</label>
                    <input type="datetime-local" id="end-date">
                </div>
                <button id="search-btn" class="btn-primary">Search Alerts</button>
                <button id="refresh-btn" class="btn-secondary">Auto Refresh</button>
            </div>
        `;
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('search-btn').addEventListener('click', () => this.triggerSearch());
        document.getElementById('refresh-btn').addEventListener('click', () => this.toggleAutoRefresh());

        document.getElementById('min-level').addEventListener('input', (e) => {
            document.getElementById('min-level-value').textContent = e.target.value;
        });
        document.getElementById('max-level').addEventListener('input', (e) => {
            document.getElementById('max-level-value').textContent = e.target.value;
        });
    }

    getFilters() {
        return {
            minLevel: parseInt(document.getElementById('min-level').value),
            maxLevel: parseInt(document.getElementById('max-level').value),
            ruleId: document.getElementById('rule-id').value.trim() || null,
            eventId: document.getElementById('event-id').value.trim() || null,
            description: document.getElementById('description').value.trim() || null,
            startDate: document.getElementById('start-date').value || null,
            endDate: document.getElementById('end-date').value || null
        };
    }

    triggerSearch() {
        if (this.onSearch) this.onSearch(this.getFilters());
    }

    toggleAutoRefresh() {
        const btn = document.getElementById('refresh-btn');
        if (window.autoRefreshInterval) {
            clearInterval(window.autoRefreshInterval);
            window.autoRefreshInterval = null;
            btn.textContent = 'Auto Refresh';
            btn.className = 'btn-secondary';
        } else {
            window.autoRefreshInterval = setInterval(
                () => this.triggerSearch(),
                CONFIG.DEFAULTS.REFRESH_INTERVAL
            );
            btn.textContent = 'Stop Refresh';
            btn.className = 'btn-primary';
        }
    }
}
