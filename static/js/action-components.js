// action-components.js - Defines the Action Web Components
// Base class for all action components
class ActionWebComponent extends HTMLElement {
    constructor() {
      super();
    }
    
    get target() {
      const targetId = this.getAttribute('target');
      return document.getElementById(targetId);
    }

    // Helper to get target from selector including # notation
    getTargetElement(selector = null) {
      const targetSelector = selector || this.getAttribute('target');
      if (!targetSelector) return null;

      // Handle selector with space (for class/descendants)
      if (targetSelector.includes(' ')) {
        const [parentId, childSelector] = targetSelector.split(' ', 2);
        const parent = document.getElementById(parentId);
        return parent ? parent.querySelector(childSelector) : null;
      } 
      // Handle ID selector with # notation
      else if (targetSelector.startsWith('#')) {
        return document.querySelector(targetSelector);
      } 
      // Handle by ID
      else {
        return document.getElementById(targetSelector);
      }
    }
  }
  
  // Toggle class component
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
  
  // Set content component
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

  // Swap component (hx-swap equivalent)
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

  // Fetch component (hx-get/post/put/delete equivalent)
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

  // Trigger component (hx-trigger equivalent)
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
  
  // Yellow fade effect component (kept for backward compatibility)
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