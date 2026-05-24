(function () {
    let header, filters, stats, alertsTable;

    function init() {
        header = new HeaderComponent('header-container');
        filters = new FiltersComponent('filters-container', handleSearch);
        stats = new StatsComponent('stats-container');
        alertsTable = new AlertsTableComponent('alerts-container', showAlertDetails);

        header.render();
        filters.render();
        stats.render();
        alertsTable.render();

        checkConnection();
        handleSearch();
    }

    async function checkConnection() {
        try {
            const result = await WazuhAPI.checkHealth();
            header.setConnectionStatus(result?.status === 'ok');
        } catch {
            header.setConnectionStatus(false);
        }
        header.setLastUpdated();
    }

    async function handleSearch(customFilters) {
        const filtersData = customFilters || filters.getFilters();
        alertsTable.showLoading();

        try {
            const result = await WazuhAPI.scanAlerts(filtersData);
            const alerts = result?.results || [];
            stats.update(alerts);
            alertsTable.update(alerts);
            header.setConnectionStatus(true);
        } catch (err) {
            header.setConnectionStatus(false);
            alertsTable.showError(`API Error: ${err.message}`);
            stats.reset();
        }
        header.setLastUpdated();
    }

    function showAlertDetails(alert) {
        const modal = document.getElementById('modal-container');
        const content = document.getElementById('modal-content');

        content.innerHTML = `
            <h2>Alert Details</h2>
            <div class="detail-grid">
                <div class="detail-item">
                    <strong>Timestamp:</strong> ${Utils.formatTimestamp(alert.timestamp)}
                </div>
                <div class="detail-item">
                    <strong>Rule ID:</strong> ${Utils.escapeHtml(alert.rule?.id)}
                </div>
                <div class="detail-item">
                    <strong>Level:</strong> <span class="level-badge ${Utils.getLevelClass(alert.rule?.level)}">${alert.rule?.level}</span>
                </div>
                <div class="detail-item">
                    <strong>Description:</strong> ${Utils.escapeHtml(alert.rule?.description)}
                </div>
                <div class="detail-item">
                    <strong>Agent:</strong> ${Utils.escapeHtml(Utils.getAgentName(alert))}
                </div>
                <div class="detail-item">
                    <strong>Source IP:</strong> ${Utils.escapeHtml(alert.data?.srcip || '-')}
                </div>
                <div class="detail-item">
                    <strong>Destination IP:</strong> ${Utils.escapeHtml(alert.data?.dstip || '-')}
                </div>
                <div class="detail-item">
                    <strong>Destination Port:</strong> ${Utils.escapeHtml(alert.data?.dstport || '-')}
                </div>
                <div class="detail-item">
                    <strong>Protocol:</strong> ${Utils.escapeHtml(alert.data?.protocol || '-')}
                </div>
                <div class="detail-item">
                    <strong>Action:</strong> ${Utils.escapeHtml(alert.data?.action || '-')}
                </div>
            </div>
            <div class="detail-item full-width">
                <strong>Full Data:</strong>
                <pre>${Utils.escapeHtml(JSON.stringify(alert, null, 2))}</pre>
            </div>
            <button id="close-modal" class="btn-primary">Close</button>
        `;
        modal.style.display = 'flex';

        document.getElementById('close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
