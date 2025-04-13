// fetch.js - Fetch component (hx-get/post/put/delete equivalent)
import { ActionWebComponent } from './action-web-component.js';

export function registerFetch() {
  customElements.define('ac-fetch', class extends ActionWebComponent {
    constructor() {
      super();
    }
    
    async connectedCallback() {
      const target = this.getTargetElement();
      if (!target) {
        console.error('Target element not found for ac-fetch');
        this.remove();
        return;
      }
      
      const url = this.getAttribute('url');
      if (!url) {
        console.error('URL not specified for ac-fetch');
        this.remove();
        return;
      }
      
      const method = (this.getAttribute('method') || 'GET').toUpperCase();
      const headers = { 'Content-Type': 'application/json' };
      const swapMethod = this.getAttribute('swap') || 'innerHTML';
      
      // Show loading state
      target.classList.add('loading');
      
      try {
        const response = await fetch(url, { method, headers });
        
        if (response.ok) {
          const content = await response.text();
          
          // Apply the content to the target based on swap method
          switch(swapMethod) {
            case 'outerHTML':
              target.outerHTML = content;
              break;
            case 'beforebegin':
              target.insertAdjacentHTML('beforebegin', content);
              break;
            case 'afterbegin':
              target.insertAdjacentHTML('afterbegin', content);
              break;
            case 'beforeend':
              target.insertAdjacentHTML('beforeend', content);
              break;
            case 'afterend':
              target.insertAdjacentHTML('afterend', content);
              break;
            default:
              target.innerHTML = content;
          }
          
          // Dispatch event after content is swapped
          target.dispatchEvent(new CustomEvent('ac:afterSwap'));
        }
      } catch (error) {
        console.error('Error in ac-fetch:', error);
        
        // Dispatch error event
        target.dispatchEvent(new CustomEvent('ac:fetchError', { 
          detail: { error } 
        }));
      } finally {
        // Remove loading state if target still exists
        if (document.contains(target)) {
          target.classList.remove('loading');
        }
        
        // Remove self
        this.remove();
      }
    }
  });
} 