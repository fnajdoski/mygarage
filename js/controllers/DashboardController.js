import { BaseController } from './BaseController.js';
import { DashboardView } from '../views/DashboardView.js';
import { StorageService } from '../services/StorageService.js';

export class DashboardController extends BaseController {
    constructor() {
        super();
        this.storage = new StorageService();
        this.view = new DashboardView();
    }

    async showDashboard() {
        const vehicles = await this.storage.getAll('vehicles');
        const records = await this.storage.getAll('records');
        const templates = await this.storage.getAll('templates');

        const statusData = vehicles.map(vehicle => {
            return this.calculateStatus(vehicle, records, templates);
        });

        this.view.render(statusData);
    }

    calculateStatus(vehicle, allRecords, allTemplates) {
        const vehicleTemplates = allTemplates.filter(t => t.vehicleType === vehicle.type);
        const vehicleRecords = allRecords.filter(r => r.vehicleId === vehicle.id);

        const tasks = [];
        let worstStatus = 'healthy'; // healthy, due_soon, overdue

        for (const template of vehicleTemplates) {
            // Find last record for this template
            // We match by templateId OR by name (for legacy/custom records)
            const lastRecord = vehicleRecords
                .filter(r => r.templateId === template.id || r.serviceName === template.name)
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

            let isOverdue = false;
            let message = '';

            if (lastRecord) {
                // Check Mileage
                if (template.intervalKm) {
                    const dist = vehicle.odometer - lastRecord.mileage;
                    const remaining = template.intervalKm - dist;

                    if (remaining < 0) {
                        isOverdue = true;
                        message = `${Math.abs(remaining).toLocaleString()} km overdue`;
                    } else if (remaining < 1000) {
                        if (worstStatus !== 'overdue') worstStatus = 'due_soon';
                        message = `Due in ${remaining.toLocaleString()} km`;
                    } else {
                        message = `Due in ${remaining.toLocaleString()} km`;
                    }
                }

                // Check Date (if not already overdue by mileage)
                if (!isOverdue && template.intervalMonths) {
                    const lastDate = new Date(lastRecord.date);
                    const nextDate = new Date(lastDate);
                    nextDate.setMonth(lastDate.getMonth() + template.intervalMonths);

                    const now = new Date();
                    const diffTime = nextDate - now;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays < 0) {
                        isOverdue = true;
                        message = `${Math.abs(diffDays)} days overdue`;
                    } else if (diffDays < 30) {
                        if (worstStatus !== 'overdue') worstStatus = 'due_soon';
                        message = `Due in ${diffDays} days`;
                    }
                }
            } else {
                // Never done
                isOverdue = true;
                message = 'Never performed';
            }

            if (isOverdue) worstStatus = 'overdue';

            // Only show tasks that are overdue or due soon (or if we want to show all next tasks)
            // For dashboard, let's show top 3 priority tasks
            tasks.push({
                name: template.name,
                isOverdue,
                message,
                priority: isOverdue ? 2 : (message.includes('Due in') ? 1 : 0)
            });
        }

        // Sort tasks by priority
        tasks.sort((a, b) => b.priority - a.priority);

        return {
            vehicle,
            status: worstStatus,
            tasks: tasks.slice(0, 3) // Top 3
        };
    }
}
