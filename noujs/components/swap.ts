// noujs/components/swap.ts - HTML content swap component

import { ActionWebComponent } from '../core/action-web-component.ts';

/**
 * Client-side implementation of the ac-swap component
 * This class allows swapping HTML content in an element
 */
export class SwapComponent extends ActionWebComponent {
  static tagName = 'ac-swap';
  
  // Method to use for swapping content (innerHTML, outerHTML, beforeend, etc.)
  get method(): string {
    return this.getAttribute('method') || 'innerHTML';
  }
  
  // Connect component when added to DOM
  connectedCallback() {
    this.performSwap();
  }
  
  // Perform the content swap operation
  performSwap() {
    if (!this.hasValidTarget()) return;
    
    const target = this.getTarget();
    if (!target) return;
    
    const content = this.innerHTML;
    const method = this.method;
    
    // Apply the content based on the specified method
    switch (method) {
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
        console.error(`Unknown swap method: ${method}`);
    }
    
    // Remove this element after swap is performed
    this.remove();
  }
} 