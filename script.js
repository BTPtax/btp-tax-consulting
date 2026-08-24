// To-Do List Application with Local Storage

class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.currentFilter = 'all';
        this.initializeElements();
        this.setupEventListeners();
        this.render();
    }

    // Initialize DOM elements
    initializeElements() {
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        this.clearAllBtn = document.getElementById('clearAll');
        this.totalCount = document.getElementById('totalCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
    }

    // Set up event listeners
    setupEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });

        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.clearAllBtn.addEventListener('click', () => this.clearAll());
    }

    // Add a new todo
    addTodo() {
        const text = this.todoInput.value.trim();
        
        if (text === '') {
            this.showNotification('Please enter a task!');
            return;
        }

        if (text.length > 200) {
            this.showNotification('Task is too long (max 200 characters)!');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        this.todos.unshift(todo);
        this.saveTodos();
        this.todoInput.value = '';
        this.todoInput.focus();
        this.render();
        this.showNotification('Task added!', 'success');
    }

    // Toggle todo completion status
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    // Delete a todo
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
        this.showNotification('Task deleted!', 'success');
    }

    // Clear all completed todos
    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        if (completedCount === 0) {
            this.showNotification('No completed tasks to clear!');
            return;
        }

        if (confirm(`Delete ${completedCount} completed task(s)?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveTodos();
            this.render();
            this.showNotification('Completed tasks cleared!', 'success');
        }
    }

    // Clear all todos
    clearAll() {
        if (this.todos.length === 0) {
            this.showNotification('No tasks to clear!');
            return;
        }

        if (confirm(`Delete all ${this.todos.length} task(s)? This cannot be undone.`)) {
            this.todos = [];
            this.saveTodos();
            this.render();
            this.showNotification('All tasks cleared!', 'success');
        }
    }

    // Filter todos based on current filter
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    // Update statistics
    updateStats() {
        const total = this.todos.length;
        const active = this.todos.filter(t => !t.completed).length;
        const completed = this.todos.filter(t => t.completed).length;

        this.totalCount.textContent = `Total: ${total}`;
        this.activeCount.textContent = `Active: ${active}`;
        this.completedCount.textContent = `Completed: ${completed}`;
    }

    // Render the todo list
    render() {
        const filteredTodos = this.getFilteredTodos();
        this.todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = `
                <div class="empty-state">
                    <p>📋 No tasks yet. Add one to get started!</p>
                </div>
            `;
        } else {
            filteredTodos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <input 
                        type="checkbox" 
                        class="checkbox" 
                        ${todo.completed ? 'checked' : ''}
                        aria-label="Mark task as ${todo.completed ? 'incomplete' : 'complete'}"
                    >
                    <span class="todo-text" title="${todo.text}">${this.escapeHtml(todo.text)}</span>
                    <button class="delete-btn" aria-label="Delete task">Delete</button>
                `;

                const checkbox = li.querySelector('.checkbox');
                const deleteBtn = li.querySelector('.delete-btn');

                checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
                deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

                this.todoList.appendChild(li);
            });
        }

        this.updateStats();
    }

    // Save todos to local storage
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    // Load todos from local storage
    loadTodos() {
        const stored = localStorage.getItem('todos');
        return stored ? JSON.parse(stored) : [];
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create a simple notification (you can enhance this)
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
