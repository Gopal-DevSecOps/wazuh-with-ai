class HeaderComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render() {
        this.container.innerHTML = `
            <header>
                <h1>Wazuh Security Operations Center</h1>
                <div class="status-bar">
                    <span id="connection-status" class="status-disconnected">● Connecting...</span>
                    <span id="last-updated"></span>
                </div>
            </header>
        `;
    }

    setConnectionStatus(connected) {
        const el = document.getElementById('connection-status');
        if (connected) {
            el.className = 'status-connected';
            el.textContent = '● Connected';
        } else {
            el.className = 'status-disconnected';
            el.textContent = '● Disconnected';
        }
    }

    setLastUpdated() {
        const el = document.getElementById('last-updated');
        el.textContent = `Last updated: ${Utils.formatTimestamp(new Date().toISOString())}`;
    }
}
