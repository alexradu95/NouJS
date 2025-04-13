// scroll-to.js - Scroll the viewport to an element
import { ActionWebComponent } from './action-web-component.js';

export function registerScrollTo() {
  customElements.define('ac-scroll-to', class extends ActionWebComponent {
    constructor() {
      super();
    }
    
    connectedCallback() {
      const target = this.getTargetElement();
      if (!target) {
        console.error('Target element not found for ac-scroll-to');
        this.remove();
        return;
      }
      
      const behavior = this.getAttribute('behavior') || 'smooth';
      const block = this.getAttribute('block') || 'start';
      const inline = this.getAttribute('inline') || 'nearest';
      const delay = parseInt(this.getAttribute('delay') || '0', 10);
      
      setTimeout(() => {
        target.scrollIntoView({
          behavior: behavior,
          block: block,
          inline: inline
        });
        
        // Remove self after scrolling
        this.remove();
      }, delay);
    }
  });
} 