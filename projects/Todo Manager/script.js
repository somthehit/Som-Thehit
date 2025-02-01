class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.filter = 'all';
        this.draggedItem = null;
        this.is24Hour = localStorage.getItem('is24Hour') === 'true';
        this.currentTimezone = localStorage.getItem('timezone') || 'local';

        // DOM Elements
        this.todoForm = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.todoDate = document.getElementById('todo-date');
        this.todoTime = document.getElementById('todo-time');
        this.reminderSelect = document.getElementById('reminder-select');
        this.todoList = document.getElementById('todo-list');
        this.tasksCounter = document.getElementById('tasks-counter');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.timeElement = document.getElementById('current-time');
        this.dateElement = document.getElementById('current-date');
        this.totalTasksElement = document.getElementById('total-tasks');
        this.completedTasksElement = document.getElementById('completed-tasks');
        this.pendingTasksElement = document.getElementById('pending-tasks');
        this.dueTodayElement = document.getElementById('due-today');
        this.toggleFormatBtn = document.getElementById('toggle-format');
        this.timezoneSelect = document.getElementById('timezone-select');

        this.initializeEventListeners();
        this.startClock();
        this.render();
        this.checkReminders();
        
        // Check for reminders every minute
        setInterval(() => this.checkReminders(), 60000);
    }

    startClock() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }

    updateDateTime() {
        const now = this.getCurrentDate();
        
        // Update time based on format
        this.timeElement.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: !this.is24Hour
        });

        // Update date
        this.dateElement.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getCurrentDate() {
        const now = new Date();
        if (this.currentTimezone === 'local') return now;

        const timezones = {
            'UTC': 0,
            'EST': -5,
            'PST': -8
        };

        const offset = timezones[this.currentTimezone];
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000 * offset));
    }

    initializeEventListeners() {
        // Form submission
        this.todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filter = btn.dataset.filter;
                this.render();
            });
        });

        // Clear completed
        this.clearCompletedBtn.addEventListener('click', () => {
            this.clearCompleted();
        });

        // Drag and drop
        this.todoList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('todo-item')) {
                this.draggedItem = e.target;
                e.target.classList.add('dragging');
            }
        });

        this.todoList.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('todo-item')) {
                e.target.classList.remove('dragging');
            }
        });

        this.todoList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(this.todoList, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                this.todoList.appendChild(draggable);
            } else {
                this.todoList.insertBefore(draggable, afterElement);
            }
        });

        // Time format toggle
        this.toggleFormatBtn.addEventListener('click', () => {
            this.is24Hour = !this.is24Hour;
            localStorage.setItem('is24Hour', this.is24Hour);
            this.updateDateTime();
        });

        // Timezone change
        this.timezoneSelect.addEventListener('change', (e) => {
            this.currentTimezone = e.target.value;
            localStorage.setItem('timezone', this.currentTimezone);
            this.updateDateTime();
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    checkReminders() {
        const now = this.getCurrentDate();
        this.todos.forEach(todo => {
            if (todo.deadline && todo.reminder && !todo.reminded && !todo.completed) {
                const deadline = new Date(todo.deadline);
                const reminderTime = new Date(deadline.getTime() - (todo.reminder * 60000));
                
                if (now >= reminderTime && now < deadline) {
                    this.showNotification(todo);
                    todo.reminded = true;
                    this.saveToLocalStorage();
                }
            }
        });
    }

    showNotification(todo) {
        if (Notification.permission === "granted") {
            new Notification("Task Reminder", {
                body: `Task "${todo.text}" is due in ${todo.reminder} minutes!`,
                icon: "https://example.com/icon.png"
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    this.showNotification(todo);
                }
            });
        }
    }

    addTodo() {
        const todoText = this.todoInput.value.trim();
        const date = this.todoDate.value;
        const time = this.todoTime.value;
        const reminder = this.reminderSelect.value;
        
        if (todoText) {
            const deadline = date && time ? new Date(date + 'T' + time) : null;
            
            const todo = {
                id: Date.now(),
                text: todoText,
                completed: false,
                deadline: deadline ? deadline.toISOString() : null,
                reminder: reminder ? parseInt(reminder) : null,
                reminded: false,
                createdAt: new Date().toISOString()
            };
            
            this.todos.push(todo);
            this.saveToLocalStorage();
            this.todoInput.value = '';
            this.todoDate.value = '';
            this.todoTime.value = '';
            this.reminderSelect.value = '';
            this.render();
        }
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        this.saveToLocalStorage();
        this.render();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveToLocalStorage();
        this.render();
    }

    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.saveToLocalStorage();
        this.render();
    }

    getFilteredTodos() {
        const now = this.getCurrentDate();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        switch (this.filter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            case 'today':
                return this.todos.filter(todo => {
                    if (!todo.deadline || todo.completed) return false;
                    const deadline = new Date(todo.deadline);
                    return deadline >= today && deadline < tomorrow;
                });
            case 'upcoming':
                return this.todos.filter(todo => {
                    if (!todo.deadline || todo.completed) return false;
                    return new Date(todo.deadline) >= tomorrow;
                }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
            case 'overdue':
                return this.todos.filter(todo => {
                    if (!todo.deadline || todo.completed) return false;
                    return new Date(todo.deadline) < today;
                });
            default:
                return this.todos;
        }
    }

    updateStatistics() {
        const now = this.getCurrentDate();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const pending = total - completed;
        const dueToday = this.todos.filter(todo => {
            if (!todo.deadline || todo.completed) return false;
            const deadline = new Date(todo.deadline);
            return deadline >= today && deadline < tomorrow;
        }).length;

        this.totalTasksElement.textContent = total;
        this.completedTasksElement.textContent = completed;
        this.pendingTasksElement.textContent = pending;
        this.dueTodayElement.textContent = dueToday;
    }

    saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        this.todoList.innerHTML = '';
        
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.draggable = true;
            
            const deadlineText = todo.deadline ? `<div class="todo-deadline">Due: ${this.formatDeadline(todo.deadline)}</div>` : '';
            
            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <div class="todo-content">
                    <div class="todo-text">${todo.text}</div>
                    ${deadlineText}
                </div>
                <button><i class="fas fa-trash"></i></button>
            `;

            const checkbox = li.querySelector('input');
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

            const deleteBtn = li.querySelector('button');
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

            this.todoList.appendChild(li);
        });

        const activeTodos = this.todos.filter(todo => !todo.completed);
        this.tasksCounter.textContent = `${activeTodos.length} items left`;
        this.updateStatistics();
    }

    formatDeadline(deadline) {
        if (!deadline) return '';
        const date = new Date(deadline);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
