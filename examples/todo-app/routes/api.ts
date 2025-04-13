// examples/todo-app/routes/api.ts - Handles API endpoints for the todo app

import { html } from '../../../noujs/utils/html.ts';
import { renderTodoItem } from '../views/components/todo-item.ts';

// In-memory todo store for the example
const todos: { id: string; text: string; completed: boolean }[] = [
  { id: "1", text: "Learn Deno", completed: true },
  { id: "2", text: "Build with NouJS", completed: false },
];

export async function apiRoutes(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  // Add a new todo
  if (path === "/api/todos" && req.method === "POST") {
    try {
      const body = await req.json();
      const id = crypto.randomUUID();
      const newTodo = {
        id,
        text: body.text,
        completed: false,
      };
      
      todos.push(newTodo);
      
      // Return HTML fragment with Action Web Components
      const todoHtml = renderTodoItem(newTodo);
      const actionHtml = html`
        <ac-swap target="todo-list" method="beforeend">
          ${todoHtml}
        </ac-swap>
        <ac-yellow-fade target="todo-${id}" duration="1500"></ac-yellow-fade>
        <ac-set-content target="todo-count" content="${todos.length} items"></ac-set-content>
        <ac-trigger target="todo-list" event="todo:added" delay="100"></ac-trigger>
      `;
      
      return new Response(actionHtml, {
        headers: { "Content-Type": "text/html" },
      });
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Toggle todo completion
  if (path.startsWith("/api/todos/") && path.includes("/toggle") && req.method === "POST") {
    const id = path.split("/")[3];
    const todo = todos.find(t => t.id === id);
    
    if (todo) {
      todo.completed = !todo.completed;
      
      // Return action web components for toggling and updating UI
      const actionHtml = html`
        <ac-toggle-class target="todo-${id}" classname="completed"></ac-toggle-class>
        <ac-yellow-fade target="todo-${id}" duration="1000"></ac-yellow-fade>
        <ac-set-content target="todo-${id} .todo-toggle" content="${todo.completed ? '✓' : '○'}"></ac-set-content>
        <ac-trigger target="todo-list" event="todo:toggled" delay="100"></ac-trigger>
      `;
      
      return new Response(actionHtml, {
        headers: { "Content-Type": "text/html" },
      });
    }
  }

  // Delete a todo
  if (path.startsWith("/api/todos/") && path.includes("/delete") && req.method === "POST") {
    const id = path.split("/")[3];
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex !== -1) {
      todos.splice(todoIndex, 1);
      
      // Return action web components for removal and updating counts
      const actionHtml = html`
        <ac-yellow-fade target="todo-${id}" duration="500"></ac-yellow-fade>
        <ac-swap target="todo-${id}" method="outerHTML"></ac-swap>
        <ac-set-content target="todo-count" content="${todos.length} items"></ac-set-content>
        <ac-trigger target="todo-list" event="todo:deleted" delay="600"></ac-trigger>
      `;
      
      return new Response(actionHtml, {
        headers: { "Content-Type": "text/html" },
      });
    }
  }

  // Get all todos
  if (path === "/api/todos" && req.method === "GET") {
    // Return todos as JSON
    if (url.searchParams.get('format') === 'json') {
      return new Response(JSON.stringify(todos), {
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Return todos as HTML fragments
    const todoHtml = todos.map(todo => renderTodoItem(todo)).join('');
    return new Response(todoHtml, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Get filtered todos (active or completed)
  if (path === "/api/todos/filter" && req.method === "GET") {
    const filter = url.searchParams.get('type') || 'all';
    let filteredTodos = todos;
    
    if (filter === 'active') {
      filteredTodos = todos.filter(t => !t.completed);
    } else if (filter === 'completed') {
      filteredTodos = todos.filter(t => t.completed);
    }
    
    const todoHtml = filteredTodos.map(todo => renderTodoItem(todo)).join('');
    
    // Return action web component to swap todos and update active filter
    const actionHtml = html`
      <ac-swap target="todo-list">
        ${todoHtml}
      </ac-swap>
      <ac-set-content target="todo-filters .filter[data-filter='${filter}']" content="${filter}"></ac-set-content>
      <ac-trigger target="todo-filters" event="filter:changed" detail='{"filter":"${filter}"}'></ac-trigger>
    `;
    
    return new Response(actionHtml, {
      headers: { "Content-Type": "text/html" },
    });
  }

  return new Response("Not Found", {
    status: 404,
    headers: { "Content-Type": "text/plain" },
  });
} 