import { View } from './View.js';

export class MaintenanceView extends View {
    constructor() {
        super();
    }

    template(vehicle, records, templates) {
        return `
            <div class="maintenance-container animate-fade-in">
                <div class="header-row">
                    <div>
                        <h2>Maintenance History</h2>
                        <p class="subtitle">${vehicle.brand} ${vehicle.model} (${vehicle.year})</p>
                    </div>
                    <a href="#/garage" class="btn btn-outline">Back to Garage</a>
                </div>

                <div class="grid-layout">
                    <!-- Left: Log New Service -->
                    <div class="card">
                        <h3>Log Service</h3>
                        <form id="log-service-form">
                            <input type="hidden" name="vehicleId" value="${vehicle.id}">
                            
                            <div class="form-group">
                                <label>Service Type</label>
                                <select name="templateId" id="template-select" required>
                                    <option value="">Select a service...</option>
                                    ${templates.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                                    <option value="custom">Other / Custom</option>
                                </select>
                            </div>

                            <div class="form-group hidden" id="custom-name-group">
                                <label>Service Name</label>
                                <input type="text" name="customName" id="custom-name">
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label>Date</label>
                                    <input type="date" name="date" value="${new Date().toISOString().split('T')[0]}" required>
                                </div>
                                <div class="form-group">
                                    <label>Mileage (km)</label>
                                    <input type="number" name="mileage" value="${vehicle.odometer}" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Cost</label>
                                <input type="number" name="cost" step="0.01" placeholder="0.00">
                            </div>

                            <div class="form-group">
                                <label>Notes</label>
                                <textarea name="notes" rows="3"></textarea>
                            </div>

                            <button type="submit" class="btn btn-primary full-width">Log Service</button>
                        </form>
                    </div>

                    <!-- Right: History -->
                    <div class="history-list">
                        ${records.length === 0 ? '<p class="text-muted">No service history yet.</p>' : this.historyTable(records)}
                    </div>
                </div>
            </div>
        `;
    }

    historyTable(records) {
        return `
            <table class="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Service</th>
                        <th>Mileage</th>
                        <th>Cost</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${records.map(r => `
                        <tr>
                            <td>${r.date}</td>
                            <td>${r.serviceName}</td>
                            <td>${r.mileage.toLocaleString()} km</td>
                            <td>$${r.cost.toFixed(2)}</td>
                            <td>
                                <button class="btn-icon text-danger" data-action="delete" data-id="${r.id}">&times;</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    render(vehicle, records, templates) {
        super.render(this.template(vehicle, records, templates));
    }

    afterRender() {
        // Toggle custom name input
        this.bind('#template-select', 'change', (e) => {
            const isCustom = e.target.value === 'custom';
            const customGroup = document.getElementById('custom-name-group');
            const customInput = document.getElementById('custom-name');

            if (isCustom) {
                customGroup.classList.remove('hidden');
                customInput.required = true;
            } else {
                customGroup.classList.add('hidden');
                customInput.required = false;
            }
        });

        // Submit Form
        this.bind('#log-service-form', 'submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            // Handle custom name logic
            if (data.templateId === 'custom') {
                data.serviceName = data.customName;
                data.templateId = null;
            } else {
                const select = document.getElementById('template-select');
                data.serviceName = select.options[select.selectedIndex].text;
            }

            this.onSubmit(data);
        });

        // Delete Record
        this.bindAll('[data-action="delete"]', 'click', (e) => {
            const id = e.target.dataset.id;
            if (confirm('Delete this record?')) {
                this.onDelete(id);
            }
        });
    }

    bindSubmit(handler) {
        this.onSubmit = handler;
    }

    bindDelete(handler) {
        this.onDelete = handler;
    }
}
