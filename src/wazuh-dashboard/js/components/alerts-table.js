class AlertsTableComponent {
    constructor(containerId, onViewDetails) {
        this.container = document.getElementById(containerId);
        this.onViewDetails = onViewDetails;
    }

    render() {
        this.container.innerHTML = `
            <div class="card table-card">
                <h2>Security Alerts</h2>
                <div class="table-container">
                    <table id="alerts-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Level</th>
                                <th>Rule ID</th>
                                <th>Description</th>
                                <th>Agent</th>
                                <th>Source IP</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="alerts-body">
                            <tr><td colspan="7" class="loading-row">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="table-footer">
                    <span id="alerts-count"></span>
                </div>
            </div>
        `;
    }

    update(alerts) {
        const tbody = document.getElementById('alerts-body');
        if (!alerts || !Array.isArray(alerts) || alerts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading-row">No alerts found</td></tr>';
            document.getElementById('alerts-count').textContent = '0 alerts';
            return;
        }

        tbody.innerHTML = alerts.map(alert => {
            const level = alert.rule?.level || 0;
            const levelClass = Utils.getLevelClass(level);
            return `
                <tr class="${levelClass}-row">
                    <td>${Utils.formatTimestamp(alert.timestamp)}</td>
                    <td><span class="level-badge ${levelClass}">${level}</span></td>
                    <td>${Utils.escapeHtml(alert.rule?.id)}</td>
                    <td class="desc-cell">${Utils.escapeHtml(alert.rule?.description)}</td>
                    <td>${Utils.escapeHtml(Utils.getAgentName(alert))}</td>
                    <td>${Utils.escapeHtml(alert.data?.srcip || '-')}</td>
                    <td>
                        <button class="btn-view" data-index="${alerts.indexOf(alert)}">View</button>
                    </td>
                </tr>
            `;
        }).join('');

        document.getElementById('alerts-count').textContent = `${alerts.length} alerts`;

        tbody.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                if (this.onViewDetails) this.onViewDetails(alerts[idx]);
            });
        });
    }

    showLoading() {
        document.getElementById('alerts-body').innerHTML = '<tr><td colspan="7" class="loading-row">Loading...</td></tr>';
    }

    showError(msg) {
        document.getElementById('alerts-body').innerHTML = `<tr><td colspan="7" class="loading-row error">${Utils.escapeHtml(msg)}</td></tr>`;
    }
}
