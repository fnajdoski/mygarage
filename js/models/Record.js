/**
 * Maintenance Record Model
 * Represents a completed service log.
 */
export class Record {
    constructor({
        id = null,
        vehicleId = '',
        templateId = null, // Optional link to a template
        serviceName = '', // Copied from template or custom
        date = new Date().toISOString().split('T')[0],
        mileage = 0,
        cost = 0,
        notes = ''
    }) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.templateId = templateId;
        this.serviceName = serviceName;
        this.date = date;
        this.mileage = parseInt(mileage);
        this.cost = parseFloat(cost);
        this.notes = notes;
    }

    validate() {
        const errors = [];
        if (!this.vehicleId) errors.push('Vehicle ID is required');
        if (!this.serviceName) errors.push('Service name is required');
        if (!this.date) errors.push('Date is required');
        if (this.mileage < 0) errors.push('Mileage cannot be negative');
        return errors;
    }
}
