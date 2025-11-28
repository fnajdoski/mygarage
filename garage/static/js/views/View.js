/**
 * Base View Class
 * Handles common DOM operations and rendering logic.
 */
export class View {
    constructor() {
        this.app = document.getElementById('main-content');
    }

    /**
     * Render HTML content to the main app container
     * @param {string} html 
     */
    render(html) {
        this.app.innerHTML = html;
        this.afterRender();
    }

    /**
     * Hook called after render is complete.
     * Override this to bind events.
     */
    afterRender() { }

    /**
     * Helper to bind an event listener
     * @param {string} selector 
     * @param {string} event 
     * @param {Function} handler 
     */
    bind(selector, event, handler) {
        const element = document.querySelector(selector);
        if (element) {
            element.addEventListener(event, handler);
        }
    }

    /**
     * Helper to bind multiple elements
     * @param {string} selector 
     * @param {string} event 
     * @param {Function} handler 
     */
    bindAll(selector, event, handler) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.addEventListener(event, handler);
        });
    }
}
