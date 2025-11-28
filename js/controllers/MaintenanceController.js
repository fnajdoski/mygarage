import { BaseController } from './BaseController.js';
import { MaintenanceView } from '../views/MaintenanceView.js';
import { StorageService } from '../services/StorageService.js';
import { Record } from '../models/Record.js';

export class MaintenanceController extends BaseController {
    constructor() {
        super();
        this.storage = new StorageService();
        this.view = new MaintenanceView();
    }

    async showMaintenance(vehicleId) {
        const vehicle = await this.storage.getById('vehicles', vehicleId);
        if (!vehicle) {
            window.location.hash = '#/garage';
            return;
        }

        // Get all records for this vehicle
        const allRecords = await this.storage.getAll('records');
        const vehicleRecords = allRecords
            .filter(r => r.vehicleId === vehicleId)
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first

        // Get templates for this vehicle type
        const allTemplates = await this.storage.getAll('templates');
        const vehicleTemplates = allTemplates.filter(t => t.vehicleType === vehicle.type);

        this.view.render(vehicle, vehicleRecords, vehicleTemplates);

        this.view.bindSubmit(async (data) => {
            const record = new Record(data);
            const errors = record.validate();

            if (errors.length > 0) {
                alert(errors.join('\n'));
                return;
            }

            await this.storage.save('records', record);

            // Update vehicle odometer if new mileage is higher
            if (record.mileage > vehicle.odometer) {
                vehicle.odometer = record.mileage;
                await this.storage.save('vehicles', vehicle);
            }

            this.showMaintenance(vehicleId); // Refresh
        });

        this.view.bindDelete(async (id) => {
            await this.storage.delete('records', id);
            this.showMaintenance(vehicleId); // Refresh
        });
    }
}
