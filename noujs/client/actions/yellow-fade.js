// yellow-fade.js - Yellow fade effect component
import { ActionWebComponent } from './action-web-component.js';

export function registerYellowFade() {
  customElements.define('ac-yellow-fade', class extends ActionWebComponent {
    constructor() {
      super();
    }
    
    connectedCallback() {
      if (!this.target) {
        console.error('Target element not found for yellow-fade');
        this.remove();
        return;
      }
      
      const duration = parseInt(this.getAttribute('duration') || '1000', 10);
      
      // Add highlight class
      this.target.classList.add('highlight');
      
      // Remove highlight class after duration
      setTimeout(() => {
        if (document.contains(this.target)) {
          this.target.classList.remove('highlight');
        }
        // Remove self after effect is done
        this.remove();
      }, duration);
    }
  });
} 