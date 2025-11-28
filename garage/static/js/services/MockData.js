import { StorageService } from './StorageService.js';
import { Template } from '../models/Template.js';

export class MockData {
    constructor() {
        this.storage = new StorageService();
    }

    async seed() {
        const existing = await this.storage.getAll('templates');
        if (existing.length > 0) return; // Already seeded

        console.log('Seeding default templates...');

        const templates = [
            // Car Templates
            new Template({ id: 't_oil_car', vehicleType: 'car', name: 'Oil Change', intervalKm: 10000, intervalMonths: 12 }),
            new Template({ id: 't_filter_car', vehicleType: 'car', name: 'Air Filter', intervalKm: 20000, intervalMonths: 24 }),
            new Template({ id: 't_tires_car', vehicleType: 'car', name: 'Tire Rotation', intervalKm: 15000, intervalMonths: null }),

            // Bike Templates
            new Template({ id: 't_oil_bike', vehicleType: 'bike', name: 'Oil Change', intervalKm: 5000, intervalMonths: 6 }),
            new Template({ id: 't_chain_bike', vehicleType: 'bike', name: 'Chain Lube', intervalKm: 1000, intervalMonths: null }),

            // Truck Templates
            new Template({ id: 't_oil_truck', vehicleType: 'truck', name: 'Oil Change', intervalKm: 15000, intervalMonths: 6 }),
            new Template({ id: 't_tires_truck', vehicleType: 'truck', name: 'Tire Inspection', intervalKm: 10000, intervalMonths: 3 })
        ];

        for (const t of templates) {
            await this.storage.save('templates', t);
        }
    }
}
