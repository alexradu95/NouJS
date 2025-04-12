// app.js - Main client-side application code

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTodoApp();
    initStatusPanel();
  });
  
  function initTodoApp() {
    const todoForm = document.getElementById('new-todo-form');
    const todoList = document.getElementById('todo-list');
    const todoFilters = document.getElementById('todo-filters');
    
    if (!todoForm || !todoList) return;
    
    // Handle form submission to add new todo
    todoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const inputField = document.getElementById('new-todo-text');
      if (!inputField) return;
      
      const todoText = inputField.value.trim();
      if (!todoText) return;
      
      // Add loading class
      todoForm.classList.add('loading');
      
      try {
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: todoText })
        });
        
        if (response.ok) {
          // Get the HTML fragment with Action Web Components
          const htmlFragment = await response.text();
          
          // Apply the actions by adding them to the DOM
          document.body.insertAdjacentHTML('beforeend', htmlFragment);
          
          // Clear the input field
          inputField.value = '';
        }
      } catch (error) {
        console.error('Error adding todo:', error);
      } finally {
        // Remove loading class
        todoForm.classList.remove('loading');
      }
    });
    
    // Handle clicks on todo items (delegation)
    todoList.addEventListener('click', async (e) => {
      // Find closest button with toggle action
      const toggleButton = e.target.closest('button[data-action="toggle"]');
      if (toggleButton) {
        const todoId = toggleButton.getAttribute('data-id');
        if (!todoId) return;
        
        try {
          const response = await fetch(`/api/todos/${todoId}/toggle`, {
            method: 'POST'
          });
          
          if (response.ok) {
            // Get the HTML fragment with Action Web Components
            const htmlFragment = await response.text();
            
            // Apply the actions by adding them to the DOM
            document.body.insertAdjacentHTML('beforeend', htmlFragment);
          }
        } catch (error) {
          console.error('Error toggling todo:', error);
        }
        return;
      }
      
      // Handle delete button clicks
      const deleteButton = e.target.closest('button[data-action="delete"]');
      if (deleteButton) {
        const todoId = deleteButton.getAttribute('data-id');
        if (!todoId) return;
        
        // Confirm deletion
        if (!confirm('Are you sure you want to delete this todo?')) {
          return;
        }
        
        try {
          const response = await fetch(`/api/todos/${todoId}/delete`, {
            method: 'POST'
          });
          
          if (response.ok) {
            // Get the HTML fragment with Action Web Components
            const htmlFragment = await response.text();
            
            // Apply the actions by adding them to the DOM
            document.body.insertAdjacentHTML('beforeend', htmlFragment);
          }
        } catch (error) {
          console.error('Error deleting todo:', error);
        }
      }
    });
    
    // Handle todo events (from action components)
    todoList.addEventListener('todo:added', (e) => {
      console.log('Todo added:', e.detail);
    });
    
    todoList.addEventListener('todo:toggled', (e) => {
      console.log('Todo toggled:', e.detail);
    });
    
    todoList.addEventListener('todo:deleted', (e) => {
      console.log('Todo deleted:', e.detail);
    });
    
    // Handle filter clicks
    if (todoFilters) {
      todoFilters.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const filterLink = e.target.closest('.filter');
        if (!filterLink) return;
        
        const filterType = filterLink.getAttribute('data-filter');
        if (!filterType) return;
        
        // Update active filter visually
        todoFilters.querySelectorAll('.filter').forEach(link => {
          link.classList.remove('active');
        });
        filterLink.classList.add('active');
        
        try {
          const response = await fetch(`/api/todos/filter?type=${filterType}`, {
            method: 'GET'
          });
          
          if (response.ok) {
            // Get the HTML fragment with Action Web Components
            const htmlFragment = await response.text();
            
            // Apply the actions by adding them to the DOM
            document.body.insertAdjacentHTML('beforeend', htmlFragment);
            
            // Update URL
            window.history.pushState({}, '', `/todos?filter=${filterType}`);
          }
        } catch (error) {
          console.error('Error filtering todos:', error);
        }
      });
      
      // Handle filter change events
      todoFilters.addEventListener('filter:changed', (e) => {
        console.log('Filter changed:', e.detail);
        
        // Update active filter visually based on event detail
        if (e.detail && e.detail.filter) {
          todoFilters.querySelectorAll('.filter').forEach(link => {
            const filterType = link.getAttribute('data-filter');
            link.classList.toggle('active', filterType === e.detail.filter);
          });
        }
      });
    }
  }
  
  function initStatusPanel() {
    const fetchStatusButton = document.getElementById('fetch-status');
    const statusContent = document.getElementById('status-content');
    
    if (!fetchStatusButton || !statusContent) return;
    
    fetchStatusButton.addEventListener('click', async () => {
      // Create fetch component manually
      statusContent.textContent = 'Loading...';
      statusContent.classList.add('loading');
      
      try {
        const response = await fetch('/api/todos?format=json');
        if (response.ok) {
          const data = await response.json();
          
          // Format the content as JSON with syntax highlighting
          statusContent.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
          
          // Trigger event for any listeners
          statusContent.dispatchEvent(new CustomEvent('ac:afterSwap'));
        }
      } catch (e) {
        console.error('Failed to fetch status:', e);
        statusContent.textContent = 'Error loading status.';
      } finally {
        statusContent.classList.remove('loading');
      }
    });
  }