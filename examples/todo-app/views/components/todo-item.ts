// examples/todo-app/views/components/todo-item.ts - Todo item component

import { html } from '../../../../noujs/utils/html.ts';

/**
 * Renders a todo item
 * @param todo The todo item
 * @returns HTML for the todo item
 */
export function renderTodoItem(todo: { id: string; text: string; completed: boolean }): string {
  return html`
    <li id="todo-${todo.id}" class="todo-item ${todo.completed ? 'completed' : ''}">
      <div class="todo-content">
        <button class="todo-toggle" data-id="${todo.id}" data-action="toggle">
          ${todo.completed ? '✓' : '○'}
        </button>
        <span class="todo-text">${todo.text}</span>
      </div>
      <div class="todo-actions">
        <button class="todo-delete" data-id="${todo.id}" data-action="delete">
          ×
        </button>
      </div>
    </li>
  `;
} 