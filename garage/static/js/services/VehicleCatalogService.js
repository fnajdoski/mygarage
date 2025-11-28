/**
 * Vehicle Catalog Service
 * Provides preloaded vehicle options for the "Add Vehicle" flow.
 */
export class VehicleCatalogService {
    constructor() {
        this.catalog = [
            {
                id: 'toyota_corolla',
                type: 'car',
                brand: 'Toyota',
                model: 'Corolla',
                image: 'assets/vehicles/corolla.jpg',
                year: 2023,
                fuelType: 'hybrid'
            },
            {
                id: 'toyota_camry',
                type: 'car',
                brand: 'Toyota',
                model: 'Camry',
                image: 'assets/vehicles/camry.jpg',
                year: 2024,
                fuelType: 'hybrid'
            },
            {
                id: 'toyota_lc',
                type: 'suv',
                brand: 'Toyota',
                model: 'Land Cruiser',
                image: 'assets/vehicles/land_cruiser.jpg',
                year: 2022,
                fuelType: 'diesel'
            },
            {
                id: 'bmw_r1250gs',
                type: 'bike',
                brand: 'BMW',
                model: 'R1250GS Adventure',
                image: 'assets/vehicles/r1250gs.jpg',
                year: 2023,
                fuelType: 'petrol'
            },
            {
                id: 'bmw_r1300gs',
                type: 'bike',
                brand: 'BMW',
                model: 'R1300GS Adventure',
                image: 'assets/vehicles/r1300gs.jpg',
                year: 2024,
                fuelType: 'petrol'
            },
            {
                id: 'honda_africa',
                type: 'bike',
                brand: 'Honda',
                model: 'Africa Twin',
                image: 'assets/vehicles/africa_twin.jpg',
                year: 2022,
                fuelType: 'petrol'
            },
            {
                id: 'ford_f150',
                type: 'truck',
                brand: 'Ford',
                model: 'F-150',
                image: 'assets/vehicles/f150.jpg',
                year: 2020,
                fuelType: 'diesel'
            }
        ];
    }

    /**
     * Get all catalog options
     * @returns {Array}
     */
    getCatalog() {
        return this.catalog;
    }

    /**
     * Get a specific catalog item
     * @param {string} id 
     * @returns {Object}
     */
    getItem(id) {
        return this.catalog.find(i => i.id === id);
    }
}
