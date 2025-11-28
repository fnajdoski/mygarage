/**
 * MyGarage Application Entry Point
 */

import { GarageController } from './controllers/GarageController.js';
import { MaintenanceController } from './controllers/MaintenanceController.js';
import { DashboardController } from './controllers/DashboardController.js';
import { MockData } from './services/MockData.js';

class App {
    constructor() {
        this.garageController = new GarageController();
        this.maintenanceController = new MaintenanceController();
        this.dashboardController = new DashboardController();
        this.mockData = new MockData();
        this.init();
    }

    async init() {
        console.log('MyGarage Initializing...');
        await this.mockData.seed();

        // Simple Router
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    handleRoute() {
        const hash = window.location.hash || '#/';
        const content = document.getElementById('main-content');

        console.log(`Navigating to: ${hash}`);

        // Basic Routing Logic
        if (hash === '#/') {
            this.dashboardController.showDashboard();
        } else if (hash === '#/garage') {
            this.garageController.showGarage();
        } else if (hash === '#/add-vehicle') {
            this.garageController.showAddVehicle();
        } else if (hash.startsWith('#/maintenance/')) {
            const vehicleId = hash.split('/')[2];
            this.maintenanceController.showMaintenance(vehicleId);
        } else {
            content.innerHTML = '<h2>404 Not Found</h2>';
        }

        // Update Nav State
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === hash);
        });
    }
}

// Start the App
const app = new App();
