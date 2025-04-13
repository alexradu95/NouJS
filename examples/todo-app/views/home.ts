// examples/todo-app/views/home.ts - Home page template for the todo app

import { html } from '../../../noujs/utils/html.ts';
import { renderTodoItem } from './components/todo-item.ts';

// Using the same todos data from API (in a real app, this would be fetched)
const todos = [
  { id: "1", text: "Learn Deno", completed: true },
  { id: "2", text: "Build with NouJS", completed: false },
];

export function renderHomePage(): string {
  return html`
  <section class="intro">
    <h2>Todo App Example</h2>
    <p>This example demonstrates NouJS Framework capabilities with Deno.</p>
  </section>

  <section class="todos">
    <div class="todo-header">
      <h3>My Todos</h3>
      <span id="todo-count" class="todo-count">${todos.length} items</span>
    </div>
    
    <form id="new-todo-form" class="todo-form">
      <input type="text" id="new-todo-text" placeholder="Add a new todo..." required>
      <button type="submit">Add</button>
    </form>

    <div id="todo-container">
      <nav id="todo-filters" class="todo-filters">
        <a href="#" class="filter active" data-filter="all">All</a>
        <a href="#" class="filter" data-filter="active">Active</a>
        <a href="#" class="filter" data-filter="completed">Completed</a>
      </nav>
      
      <ul id="todo-list" class="todo-list">
        ${todos.map(todo => renderTodoItem(todo)).join('')}
      </ul>
    </div>
  </section>

  <section class="updates">
    <h3>Real-time Status</h3>
    <div id="status-panel" class="status-panel">
      <div class="status-info">
        <p>Click button to fetch status:</p>
        <button id="fetch-status" class="status-button">Fetch Status</button>
      </div>
      <div id="status-content" class="status-content">
        <p>Status will appear here...</p>
      </div>
    </div>
  </section>
  `;
} 