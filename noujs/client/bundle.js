// noujs/client/bundle.js - Bundled version of all NouJS client components

// Base Component
class ActionWebComponent extends HTMLElement {
  constructor() {
    super();
  }
  
  get target() {
    const targetId = this.getAttribute('target');
    return document.getElementById(targetId);
  }

  getTargetElement(selector = null) {
    const targetSelector = selector || this.getAttribute('target');
    if (!targetSelector) return null;

    if (targetSelector.includes(' ')) {
      const [parentId, childSelector] = targetSelector.split(' ', 2);
      const parent = document.getElementById(parentId);
      return parent ? parent.querySelector(childSelector) : null;
    } 
    else if (targetSelector.startsWith('#')) {
      return document.querySelector(targetSelector);
    } 
    else {
      return document.getElementById(targetSelector);
    }
  }
}

// Swap Component
class SwapComponent extends ActionWebComponent {
  connectedCallback() {
    if (!this.hasAttribute('target')) return;
    
    const target = this.getTargetElement();
    if (!target) return;
    
    const method = this.getAttribute('method') || 'innerHTML';
    const content = this.innerHTML;
    
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
    }
    
    // Remove this element after execution
    this.remove();
  }
}

// Toggle Class Component
class ToggleClassComponent extends ActionWebComponent {
  connectedCallback() {
    if (!this.hasAttribute('target')) return;
    
    const targets = document.querySelectorAll(this.getAttribute('target'));
    if (!targets.length) return;
    
    const className = this.getAttribute('classname');
    if (!className) return;
    
    targets.forEach(target => {
      target.classList.toggle(className);
    });
    
    // Remove this element after execution
    this.remove();
  }
}

// Set Content Component
class SetContentComponent extends ActionWebComponent {
  connectedCallback() {
    if (!this.hasAttribute('target')) return;
    
    const targets = document.querySelectorAll(this.getAttribute('target'));
    if (!targets.length) return;
    
    const content = this.getAttribute('content') || this.innerHTML;
    
    targets.forEach(target => {
      target.textContent = content;
    });
    
    // Remove this element after execution
    this.remove();
  }
}

// Yellow Fade Component
class YellowFadeComponent extends ActionWebComponent {
  connectedCallback() {
    if (!this.hasAttribute('target')) return;
    
    const targets = document.querySelectorAll(this.getAttribute('target'));
    if (!targets.length) return;
    
    const duration = parseInt(this.getAttribute('duration') || '1000', 10);
    
    targets.forEach(target => {
      // Add transition
      target.style.transition = `background-color ${duration}ms ease-in-out`;
      
      // Add highlight color
      target.style.backgroundColor = '#ffffa0';
      
      // Remove highlight after specified duration
      setTimeout(() => {
        target.style.backgroundColor = '';
      }, duration);
    });
    
    // Remove this element after execution
    this.remove();
  }
}

// Trigger Component
class TriggerComponent extends ActionWebComponent {
  connectedCallback() {
    if (!this.hasAttribute('target') || !this.hasAttribute('event')) return;
    
    const targets = document.querySelectorAll(this.getAttribute('target'));
    if (!targets.length) return;
    
    const eventName = this.getAttribute('event');
    const delay = parseInt(this.getAttribute('delay') || '0', 10);
    
    // Parse detail if provided
    let detail = null;
    if (this.hasAttribute('detail')) {
      try {
        detail = JSON.parse(this.getAttribute('detail'));
      } catch (e) {
        console.error('Error parsing event detail:', e);
      }
    }
    
    // Schedule event dispatch
    setTimeout(() => {
      targets.forEach(target => {
        target.dispatchEvent(new CustomEvent(eventName, { 
          bubbles: true, 
          detail 
        }));
      });
    }, delay);
    
    // Remove this element after execution
    this.remove();
  }
}

// Register all components
function registerNouJSComponents() {
  customElements.define('ac-swap', SwapComponent);
  customElements.define('ac-toggle-class', ToggleClassComponent);
  customElements.define('ac-set-content', SetContentComponent);
  customElements.define('ac-yellow-fade', YellowFadeComponent);
  customElements.define('ac-trigger', TriggerComponent);
  
  console.log('NouJS components registered');
}

// Auto-register all components
registerNouJSComponents();

// Export for module usage
export {
  ActionWebComponent,
  SwapComponent,
  ToggleClassComponent,
  SetContentComponent,
  YellowFadeComponent,
  TriggerComponent
}; 