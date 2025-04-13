// toggle-class.js - Toggle class component
import { ActionWebComponent } from './action-web-component.js';

export function registerToggleClass() {
  customElements.define('ac-toggle-class', class extends ActionWebComponent {
    constructor() {
      super();
    }
    
    connectedCallback() {
      if (!this.target) {
        console.error('Target element not found for toggle-class');
        this.remove();
        return;
      }
      
      const className = this.getAttribute('classname');
      const force = this.getAttribute('force');
      
      if (!className) {
        console.error('Class name not specified for toggle-class');
        this.remove();
        return;
      }
      
      if (force !== null) {
        this.target.classList.toggle(className, force === 'true');
      } else {
        this.target.classList.toggle(className);
      }
      
      // Remove self after toggling
      this.remove();
    }
  });
} 