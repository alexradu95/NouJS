// index.js - Main entry point for action components
import { registerToggleClass } from './toggle-class.js';
import { registerSetContent } from './set-content.js';
import { registerSwap } from './swap.js';
import { registerFetch } from './fetch.js';
import { registerTrigger } from './trigger.js';
import { registerYellowFade } from './yellow-fade.js';
import { registerScrollTo } from './scroll-to.js';
import { registerFocus } from './focus.js';
import { registerRedirectTo } from './redirect-to.js';
import { registerMessageDialog } from './message-dialog.js';

// Register all components
export function registerAllComponents() {
  registerToggleClass();
  registerSetContent();
  registerSwap();
  registerFetch();
  registerTrigger();
  registerYellowFade();
  registerScrollTo();
  registerFocus();
  registerRedirectTo();
  registerMessageDialog();
}

// Auto-register components when this module is loaded
registerAllComponents(); 