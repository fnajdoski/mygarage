/**
 * Maintenance Template Model
 * Defines a standard service interval (e.g., Oil Change every 10,000km).
 */
export class Template {
    constructor({
        id = null,
        vehicleType = 'car', // car, bike, truck
        name = '',
        intervalKm = null,
        intervalMonths = null
    }) {
        this.id = id;
        this.vehicleType = vehicleType;
        this.name = name;
        this.intervalKm = intervalKm;
        this.intervalMonths = intervalMonths;
    }
}
