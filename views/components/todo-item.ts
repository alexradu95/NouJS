// views/components/todo-item.ts - Todo item component

export function renderTodoItem(todo: { id: string; text: string; completed: boolean }): string {
    return `
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