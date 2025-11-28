import { BaseController } from './BaseController.js';
import { GarageView } from '../views/GarageView.js';
import { AddVehicleView } from '../views/AddVehicleView.js';
import { StorageService } from '../services/StorageService.js';
import { VehicleCatalogService } from '../services/VehicleCatalogService.js';
import { Vehicle } from '../models/Vehicle.js';

export class GarageController extends BaseController {
    constructor() {
        super();
        this.storage = new StorageService();
        this.catalogService = new VehicleCatalogService();
        this.garageView = new GarageView();
        this.addView = new AddVehicleView();
    }

    async showGarage() {
        const vehicles = await this.storage.getAll('vehicles');
        this.garageView.render(vehicles);

        this.garageView.bindDelete(async (id) => {
            await this.storage.delete('vehicles', id);
            this.showGarage(); // Refresh
        });
    }

    showAddVehicle() {
        const catalog = this.catalogService.getCatalog();
        this.addView.render(catalog);

        this.addView.bindSelectCatalog((id) => {
            const item = this.catalogService.getItem(id);
            this.addView.showForm(item);
        });

        this.addView.bindSubmit(async (data) => {
            const vehicle = new Vehicle(data);
            const errors = vehicle.validate();

            if (errors.length > 0) {
                alert(errors.join('\n'));
                return;
            }

            await this.storage.save('vehicles', vehicle);
            window.location.hash = '#/garage';
        });
    }
}
