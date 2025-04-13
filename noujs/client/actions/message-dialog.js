// message-dialog.js - Display a message in a dialog
import { ActionWebComponent } from './action-web-component.js';

export function registerMessageDialog() {
  customElements.define('ac-message-dialog', class extends ActionWebComponent {
    constructor() {
      super();
    }
    
    connectedCallback() {
      const message = this.getAttribute('message') || this.innerHTML.trim();
      if (!message) {
        console.error('No message specified for ac-message-dialog');
        this.remove();
        return;
      }
      
      const title = this.getAttribute('title') || 'Message';
      const type = this.getAttribute('type') || 'info'; // info, success, warning, error
      const autoClose = parseInt(this.getAttribute('auto-close') || '0', 10);
      
      // Create or get existing dialog container
      let dialogContainer = document.getElementById('ac-dialog-container');
      if (!dialogContainer) {
        dialogContainer = document.createElement('div');
        dialogContainer.id = 'ac-dialog-container';
        document.body.appendChild(dialogContainer);
        
        // Add basic styles if not already in document
        if (!document.getElementById('ac-dialog-styles')) {
          const style = document.createElement('style');
          style.id = 'ac-dialog-styles';
          style.textContent = `
            #ac-dialog-container { position: fixed; z-index: 9999; }
            .ac-dialog {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
              max-width: 500px;
              padding: 1rem;
              border-radius: 0.5rem;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
              background: white;
              margin: 1rem;
            }
            .ac-dialog-title {
              font-weight: bold;
              margin-bottom: 0.5rem;
            }
            .ac-dialog.info { border-left: 4px solid #3b82f6; }
            .ac-dialog.success { border-left: 4px solid #10b981; }
            .ac-dialog.warning { border-left: 4px solid #f59e0b; }
            .ac-dialog.error { border-left: 4px solid #ef4444; }
            .ac-dialog-close {
              float: right;
              cursor: pointer;
              background: none;
              border: none;
              font-size: 1.25rem;
              color: #6b7280;
            }
          `;
          document.head.appendChild(style);
        }
      }
      
      // Create the dialog
      const dialog = document.createElement('dialog');
      dialog.className = `ac-dialog ${type}`;
      
      // Create the close button
      const closeButton = document.createElement('button');
      closeButton.className = 'ac-dialog-close';
      closeButton.innerHTML = '&times;';
      closeButton.onclick = () => dialog.close();
      
      // Create the title element
      const titleElement = document.createElement('div');
      titleElement.className = 'ac-dialog-title';
      titleElement.textContent = title;
      
      // Create the message element
      const messageElement = document.createElement('div');
      messageElement.className = 'ac-dialog-message';
      messageElement.innerHTML = message;
      
      // Assemble the dialog
      dialog.appendChild(closeButton);
      dialog.appendChild(titleElement);
      dialog.appendChild(messageElement);
      
      // Add to container
      dialogContainer.appendChild(dialog);
      
      // Show the dialog
      dialog.showModal();
      
      // Auto-close if specified
      if (autoClose > 0) {
        setTimeout(() => {
          dialog.close();
        }, autoClose);
      }
      
      // Clean up when dialog is closed
      dialog.addEventListener('close', () => {
        dialog.remove();
        this.remove();
        
        // Remove container if empty
        if (dialogContainer.children.length === 0) {
          dialogContainer.remove();
        }
      });
    }
  });
} 