// redirect-to.js - Redirect to another URL after a short delay
import { ActionWebComponent } from './action-web-component.js';

export function registerRedirectTo() {
  customElements.define('ac-redirect-to', class extends ActionWebComponent {
    constructor() {
      super();
    }
    
    connectedCallback() {
      const url = this.getAttribute('url');
      if (!url) {
        console.error('URL not specified for ac-redirect-to');
        this.remove();
        return;
      }
      
      const delay = parseInt(this.getAttribute('delay') || '0', 10);
      const replace = this.getAttribute('replace') === 'true';
      
      // Add a visual indicator if delay is significant
      if (delay > 500) {
        const message = this.getAttribute('message') || `Redirecting in ${Math.round(delay/1000)} seconds...`;
        const redirectElement = document.createElement('div');
        redirectElement.className = 'redirect-message';
        redirectElement.textContent = message;
        this.appendChild(redirectElement);
      }
      
      setTimeout(() => {
        if (replace) {
          window.location.replace(url);
        } else {
          window.location.href = url;
        }
        // Remove self after redirect initiated
        this.remove();
      }, delay);
    }
  });
} 