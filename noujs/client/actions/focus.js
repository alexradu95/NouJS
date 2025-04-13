// focus.js - Focus on a particular form field
import { ActionWebComponent } from './action-web-component.js';

export function registerFocus() {
  customElements.define('ac-focus', class extends ActionWebComponent {
    constructor() {
      super();
    }
    
    connectedCallback() {
      const target = this.getTargetElement();
      if (!target) {
        console.error('Target element not found for ac-focus');
        this.remove();
        return;
      }
      
      if (!(target instanceof HTMLElement)) {
        console.error('Target element cannot be focused for ac-focus');
        this.remove();
        return;
      }
      
      const delay = parseInt(this.getAttribute('delay') || '0', 10);
      const select = this.getAttribute('select') === 'true';
      
      setTimeout(() => {
        target.focus();
        
        // If target is an input or textarea and select is true, select all text
        if (select && (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
          target.select();
        }
        
        // Remove self after focusing
        this.remove();
      }, delay);
    }
  });
} 