import { View } from './View.js';

export class GarageView extends View {
    constructor() {
        super();
    }

    template(vehicles) {
        return `
            <div class="garage-container animate-fade-in">
                <div class="garage-header header-row">
                    <h2>My Garage</h2>
                    <a href="#/add-vehicle" class="btn btn-primary">
                        + Add Vehicle
                    </a>
                </div>

                ${vehicles.length === 0 ? this.emptyState() : this.grid(vehicles)}
            </div>
        `;
    }

    emptyState() {
        return `
            <div class="empty-state">
                <p>Your garage is empty.</p>
                <p>Add your first vehicle to start tracking maintenance.</p>
            </div>
        `;
    }

    grid(vehicles) {
        return `
            <div class="vehicle-grid">
                ${vehicles.map(v => this.card(v)).join('')}
            </div>
        `;
    }

    card(vehicle) {
        const imageStyle = vehicle.image ?
            `background-image: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(30,41,59,1)), url('${vehicle.image}');` :
            'background-color: var(--bg-input);';

        return `
            <div class="card vehicle-card">
                <div class="vehicle-image" style="height: 200px; background-size: cover; background-position: center; ${imageStyle} position: relative;">
                    <div style="position: absolute; bottom: 1rem; left: 1rem; right: 1rem;">
                        <h3 style="color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.5); margin-bottom: 0.25rem;">${vehicle.brand} ${vehicle.model}</h3>
                        <p class="vehicle-type" style="color: rgba(255,255,255,0.9); margin: 0; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${vehicle.year} • ${vehicle.type.toUpperCase()}</p>
                    </div>
                </div>
                <div class="vehicle-info">
                    <div class="vehicle-stats">
                        <span>${vehicle.odometer.toLocaleString()} km</span>
                    </div>
                    <div class="vehicle-actions">
                        <a href="#/maintenance/${vehicle.id}" class="btn btn-sm btn-primary">Maintenance</a>
                        <button class="btn btn-sm btn-outline" data-id="${vehicle.id}" data-action="delete">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }

    render(vehicles) {
        super.render(this.template(vehicles));
    }

    afterRender() {
        // Bind delete buttons
        this.bindAll('[data-action="delete"]', 'click', (e) => {
            const id = e.target.dataset.id;
            if (confirm('Are you sure you want to remove this vehicle?')) {
                this.onDelete(id);
            }
        });
    }

    bindDelete(handler) {
        this.onDelete = handler;
    }
}
