// swap.js - Swap component (hx-swap equivalent)
import { ActionWebComponent } from './action-web-component.js';

export function registerSwap() {
  customElements.define('ac-swap', class extends ActionWebComponent {
    constructor() {
      super();
    }
    
    connectedCallback() {
      const target = this.getTargetElement();
      if (!target) {
        console.error('Target element not found for ac-swap');
        this.remove();
        return;
      }
      
      const content = this.innerHTML;
      const method = this.getAttribute('method') || 'innerHTML';
      
      switch(method) {
        case 'innerHTML':
          target.innerHTML = content;
          break;
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
      
      this.remove();
    }
  });
} 