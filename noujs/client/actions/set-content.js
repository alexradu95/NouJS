// set-content.js - Set content component
import { ActionWebComponent } from './action-web-component.js';

export function registerSetContent() {
  customElements.define('ac-set-content', class extends ActionWebComponent {
    constructor() {
      super();
    }
    
    connectedCallback() {
      const targetSelector = this.getAttribute('target');
      const content = this.getAttribute('content');
      
      if (!targetSelector || !content) {
        console.error('Missing target or content for ac-set-content');
        this.remove();
        return;
      }
      
      // Handle selector with space (for class/descendants)
      let target;
      if (targetSelector.includes(' ')) {
        const [parentId, childSelector] = targetSelector.split(' ', 2);
        const parent = document.getElementById(parentId);
        if (parent) {
          target = parent.querySelector(childSelector);
        }
      } else {
        target = document.getElementById(targetSelector);
      }
      
      if (!target) {
        console.error('Target element not found for ac-set-content:', targetSelector);
        this.remove();
        return;
      }
      
      // Set the target's content
      target.innerHTML = content;
      
      // Remove self after setting content
      this.remove();
    }
  });
} 