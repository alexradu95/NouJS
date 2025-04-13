// noujs/core/action-web-component.ts - Base class for all Action Web Components

// This file is meant to be used in the browser, but we're defining it in a Deno context
// These type definitions are for development only and will be ignored at runtime

/**
 * Base class for all Action Web Components
 * Note: This is only used as a reference for the browser implementation
 * in the actual browser context, it will extend the real HTMLElement.
 */
export class ActionWebComponent {
  // Simulate DOM methods for TypeScript validation
  getAttribute(name: string): string | null {
    return null; // This is just for TypeScript, not actually used
  }

  /**
   * Checks if the element has a valid target
   * @returns {boolean} True if target is valid
   */
  protected hasValidTarget(): boolean {
    return !!this.getAttribute('target');
  }

  /**
   * Gets the target element based on the 'target' attribute
   * @returns {any} The target element or null if not found
   */
  protected getTarget(): any {
    const targetSelector = this.getAttribute('target');
    if (!targetSelector) return null;
    
    // In browser context, this will use the actual document object
    // This is just a placeholder for TypeScript
    return null;
  }

  /**
   * Gets multiple target elements based on the 'target' attribute
   * @returns {any[]} Array of matching elements
   */
  protected getTargets(): any[] {
    const targetSelector = this.getAttribute('target');
    if (!targetSelector) return [];
    
    // In browser context, this will use the actual document object
    // This is just a placeholder for TypeScript
    return [];
  }
} 