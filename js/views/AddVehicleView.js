import { View } from './View.js';

export class AddVehicleView extends View {
    constructor() {
        super();
    }

    template(catalog) {
        return `
            <div class="add-vehicle-container animate-fade-in">
                <div class="header-row">
                    <h2>Add New Vehicle</h2>
                    <a href="#/garage" class="btn btn-outline">Cancel</a>
                </div>

                <div id="step-1" class="step-container">
                    <h3>Step 1: Choose a Vehicle</h3>
                    <div class="catalog-grid">
                        ${catalog.map(item => this.catalogCard(item)).join('')}
                    </div>
                </div>

                <div id="step-2" class="step-container hidden">
                    <h3>Step 2: Confirm Details</h3>
                    <form id="add-vehicle-form" class="vehicle-form">
                        <input type="hidden" name="image" id="field-image">
                        <input type="hidden" name="type" id="field-type">
                        
                        <div class="form-group">
                            <label>Brand</label>
                            <input type="text" name="brand" id="field-brand" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Model</label>
                            <input type="text" name="model" id="field-model" required>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Year</label>
                                <input type="number" name="year" id="field-year" required>
                            </div>
                            <div class="form-group">
                                <label>Odometer (km)</label>
                                <input type="number" name="odometer" id="field-odometer" value="0" required>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="button" id="back-btn" class="btn btn-outline">Back</button>
                            <button type="submit" class="btn btn-primary">Add Vehicle</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    catalogCard(item) {
        return `
            <div class="card catalog-card" data-id="${item.id}">
                <img src="${item.image}" alt="${item.model}">
                <div class="catalog-info">
                    <h4>${item.brand} ${item.model}</h4>
                    <p>${item.type.toUpperCase()}</p>
                </div>
            </div>
        `;
    }

    render(catalog) {
        super.render(this.template(catalog));
    }

    afterRender() {
        // Step 1: Select from Catalog
        this.bindAll('.catalog-card', 'click', (e) => {
            const card = e.currentTarget;
            const id = card.dataset.id;
            this.onSelectCatalog(id);
        });

        // Step 2: Back Button
        this.bind('#back-btn', 'click', () => {
            document.getElementById('step-1').classList.remove('hidden');
            document.getElementById('step-2').classList.add('hidden');
        });

        // Step 2: Submit Form
        this.bind('#add-vehicle-form', 'submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            this.onSubmit(data);
        });
    }

    showForm(data) {
        document.getElementById('step-1').classList.add('hidden');
        document.getElementById('step-2').classList.remove('hidden');

        // Pre-fill form
        document.getElementById('field-brand').value = data.brand;
        document.getElementById('field-model').value = data.model;
        document.getElementById('field-year').value = data.year;
        document.getElementById('field-type').value = data.type;
        document.getElementById('field-image').value = data.image;
    }

    bindSelectCatalog(handler) {
        this.onSelectCatalog = handler;
    }

    bindSubmit(handler) {
        this.onSubmit = handler;
    }
}
