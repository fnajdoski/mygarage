/**
 * Vehicle Model
 * Represents a single vehicle in the garage.
 */
export class Vehicle {
    constructor({
        id = null,
        type = 'car', // car, bike, truck, suv
        brand = '',
        model = '',
        year = new Date().getFullYear(),
        vin = '',
        odometer = 0,
        fuelType = 'petrol',
        image = '', // URL to image
        notes = ''
    }) {
        this.id = id;
        this.type = type;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.vin = vin;
        this.odometer = parseInt(odometer);
        this.fuelType = fuelType;
        this.image = image;
        this.notes = notes;
    }

    /**
     * Validate the vehicle data
     * @returns {Array} List of error messages (empty if valid)
     */
    validate() {
        const errors = [];
        if (!this.brand) errors.push('Brand is required');
        if (!this.model) errors.push('Model is required');
        if (!this.year || this.year < 1900 || this.year > new Date().getFullYear() + 1) {
            errors.push('Invalid year');
        }
        if (this.odometer < 0) errors.push('Odometer cannot be negative');
        return errors;
    }
}
