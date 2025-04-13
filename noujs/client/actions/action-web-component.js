// action-web-component.js - Base class for all action components

export class ActionWebComponent extends HTMLElement {
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