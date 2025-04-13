// trigger.js - Trigger component (hx-trigger equivalent)
import { ActionWebComponent } from './action-web-component.js';

export function registerTrigger() {
  customElements.define('ac-trigger', class extends ActionWebComponent {
    constructor() {
      super();
    }
    
    connectedCallback() {
      const target = this.getTargetElement();
      if (!target) {
        console.error('Target element not found for ac-trigger');
        this.remove();
        return;
      }
      
      const event = this.getAttribute('event');
      if (!event) {
        console.error('Event not specified for ac-trigger');
        this.remove();
        return;
      }
      
      const delay = parseInt(this.getAttribute('delay') || '0', 10);
      const detail = this.getAttribute('detail') ? JSON.parse(this.getAttribute('detail')) : {};
      
      // Trigger event after delay
      setTimeout(() => {
        target.dispatchEvent(new CustomEvent(event, { 
          bubbles: true,
          detail
        }));
        this.remove();
      }, delay);
    }
  });
} 