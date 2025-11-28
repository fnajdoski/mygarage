import { View } from './View.js';

export class DashboardView extends View {
    constructor() {
        super();
    }

    template(statusData) {
        // Calculate Global Status
        const hasOverdue = statusData.some(item => item.status === 'overdue');
        const hasDueSoon = statusData.some(item => item.status === 'due_soon');

        let heroClass = 'hero-all-good';
        let heroTitle = 'ALL GOOD';
        let heroMessage = 'All systems operational. Enjoy the ride.';

        if (hasOverdue) {
            heroClass = 'hero-attention';
            heroTitle = 'ATTENTION';
            heroMessage = 'Maintenance required for one or more vehicles.';
        } else if (hasDueSoon) {
            heroClass = 'hero-attention'; // Use attention color for due soon as well to be safe, or maybe warning
            heroTitle = 'CHECK STATUS';
            heroMessage = 'Upcoming maintenance due soon.';
        }

        return `
            <div class="dashboard-container animate-fade-in">
                <!-- Global Status Hero -->
                <div class="global-status-hero ${heroClass} animate-slide-up">
                    <h2>${heroTitle}</h2>
                    <p>${heroMessage}</p>
                </div>

                <div class="header-row">
                    <h2>My Vehicles</h2>
                    <a href="#/add-vehicle" class="btn btn-primary">+ Add Vehicle</a>
                </div>

                ${statusData.length === 0 ? this.emptyState() : this.statusGrid(statusData)}
            </div>
        `;
    }

    emptyState() {
        return `
            <div class="empty-state">
                <p>No vehicles tracked yet.</p>
                <a href="#/add-vehicle" class="btn btn-outline">Add your first vehicle</a>
            </div>
        `;
    }

    statusGrid(statusData) {
        return `
            <div class="dashboard-grid">
                ${statusData.map(item => this.vehicleStatusCard(item)).join('')}
            </div>
        `;
    }

    vehicleStatusCard(item) {
        const statusClass = item.status === 'overdue' ? 'status-danger' :
            item.status === 'due_soon' ? 'status-warning' : 'status-success';

        const statusLabel = item.status === 'overdue' ? 'Attention Needed' :
            item.status === 'due_soon' ? 'Maintenance Due Soon' : 'All Systems Go';

        // Hero Image Style
        const imageStyle = item.vehicle.image ?
            `background-image: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(30,41,59,1)), url('${item.vehicle.image}');` :
            'background-color: var(--bg-input);';

        return `
            <div class="card dashboard-card">
                <div class="card-hero" style="height: 200px; background-size: cover; background-position: center; ${imageStyle} position: relative;">
                    <div style="position: absolute; bottom: 1rem; left: 1rem; right: 1rem;">
                        <h3 style="color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.8); margin-bottom: 0.5rem;">${item.vehicle.brand} ${item.vehicle.model}</h3>
                        <span class="badge ${statusClass}" style="box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${statusLabel}</span>
                    </div>
                </div>
                
                <div class="card-body">
                    <div class="stat-row">
                        <span class="label">Odometer</span>
                        <span class="value">${item.vehicle.odometer.toLocaleString()} km</span>
                    </div>

                    <div class="upcoming-tasks">
                        <h4>Upcoming Tasks</h4>
                        ${item.tasks.length === 0 ? '<p class="text-muted text-sm">No scheduled tasks.</p>' :
                '<ul>' + item.tasks.map(t => `
                            <li class="${t.isOverdue ? 'text-danger' : ''}">
                                ${t.name}: ${t.message}
                            </li>
                          `).join('') + '</ul>'}
                    </div>
                </div>

                <div class="card-footer">
                    <a href="#/maintenance/${item.vehicle.id}" class="btn btn-sm btn-outline full-width">View Details</a>
                </div>
            </div>
        `;
    }

    render(statusData) {
        super.render(this.template(statusData));
    }
}
