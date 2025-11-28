/**
 * StorageService
 * Abstracts LocalStorage to look like an async Database API.
 */
export class StorageService {
    constructor() {
        this.prefix = 'mygarage_';
    }

    /**
     * Get all items from a collection
     * @param {string} collectionName 
     * @returns {Promise<Array>}
     */
    async getAll(collectionName) {
        return new Promise((resolve) => {
            const data = localStorage.getItem(this.prefix + collectionName);
            resolve(data ? JSON.parse(data) : []);
        });
    }

    /**
     * Get single item by ID
     * @param {string} collectionName 
     * @param {string|number} id 
     * @returns {Promise<Object|null>}
     */
    async getById(collectionName, id) {
        const items = await this.getAll(collectionName);
        // Compare as strings to avoid type mismatch
        return items.find(item => String(item.id) === String(id)) || null;
    }

    /**
     * Save an item (Create or Update)
     * @param {string} collectionName 
     * @param {Object} item 
     * @returns {Promise<Object>} The saved item
     */
    async save(collectionName, item) {
        const items = await this.getAll(collectionName);

        if (!item.id) {
            item.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        }

        // Compare as strings
        const index = items.findIndex(i => String(i.id) === String(item.id));
        if (index >= 0) {
            items[index] = item; // Update
        } else {
            items.push(item); // Create
        }

        localStorage.setItem(this.prefix + collectionName, JSON.stringify(items));
        return item;
    }

    /**
     * Delete an item by ID
     * @param {string} collectionName 
     * @param {string|number} id 
     * @returns {Promise<boolean>}
     */
    async delete(collectionName, id) {
        let items = await this.getAll(collectionName);
        const initialLength = items.length;
        // Compare as strings
        items = items.filter(i => String(i.id) !== String(id));

        localStorage.setItem(this.prefix + collectionName, JSON.stringify(items));
        return items.length !== initialLength;
    }

    /**
     * Clear all data (for testing/reset)
     */
    async clearAll() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }
}
