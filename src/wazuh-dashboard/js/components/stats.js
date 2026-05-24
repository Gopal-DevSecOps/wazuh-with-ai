class StatsComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render() {
        this.container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value" id="total-alerts">0</div>
                    <div class="stat-label">Total Alerts</div>
                </div>
                <div class="stat-card critical">
                    <div class="stat-value" id="critical-alerts">0</div>
                    <div class="stat-label">Critical (12-15)</div>
                </div>
                <div class="stat-card warning">
                    <div class="stat-value" id="warning-alerts">0</div>
                    <div class="stat-label">Warning (7-11)</div>
                </div>
                <div class="stat-card info">
                    <div class="stat-value" id="info-alerts">0</div>
                    <div class="stat-label">Info (1-6)</div>
                </div>
            </div>
        `;
    }

    update(alerts) {
        if (!alerts || !Array.isArray(alerts)) {
            this.reset();
            return;
        }

        document.getElementById('total-alerts').textContent = alerts.length;
        document.getElementById('critical-alerts').textContent = alerts.filter(a => a.rule?.level >= 12).length;
        document.getElementById('warning-alerts').textContent = alerts.filter(a => a.rule?.level >= 7 && a.rule?.level < 12).length;
        document.getElementById('info-alerts').textContent = alerts.filter(a => a.rule?.level < 7).length;
    }

    reset() {
        ['total-alerts', 'critical-alerts', 'warning-alerts', 'info-alerts'].forEach(id => {
            document.getElementById(id).textContent = '0';
        });
    }
}
