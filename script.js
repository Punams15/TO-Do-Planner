const monthYear = document.getElementById('monthYear');
const calendar = document.getElementById('calendar');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');
const todoInput = document.getElementById('todoInput');
const addTodo = document.getElementById('addTodo');
const todoList = document.getElementById('todoList');

let currentDate = new Date();
let selectedDay = formatDate(new Date());

function formatDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
    calendar.innerHTML = '';

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = day;
        calendar.appendChild(dayDiv);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'date';
        emptyCell.style.visibility = 'hidden';
        calendar.appendChild(emptyCell);
    }

    for (let i = 1; i <= lastDate; i++) {
        const dateCell = document.createElement('div');
        dateCell.className = 'date';
        dateCell.textContent = i;
        const fullDate = `${year}-${month + 1}-${i}`;

        if (fullDate === selectedDay) {
            dateCell.classList.add('selected');
        }

        dateCell.addEventListener('click', () => {
            selectedDay = fullDate;
            renderCalendar();
            renderTodos();
        });

        calendar.appendChild(dateCell);
    }
}

prevMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    renderTodos();
});

nextMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    renderTodos();
});

function renderTodos() {
    todoList.innerHTML = '';
    const todos = getTodos();
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.textContent = todo;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'X';
        delBtn.addEventListener('click', () => {
            deleteTodo(index);
        });
        li.appendChild(delBtn);
        todoList.appendChild(li);
    });
}



function getTodos() {
    const data = JSON.parse(localStorage.getItem('todos')) || {};
    return data[selectedDay] || [];
}

function saveTodos(todos) {
    const data = JSON.parse(localStorage.getItem('todos')) || {};
    data[selectedDay] = todos;
    localStorage.setItem('todos', JSON.stringify(data));
}

function addNewTodo() {
    if (todoInput.value.trim() !== '') {
        const todos = getTodos();
        todos.push(todoInput.value.trim());
        saveTodos(todos);
        todoInput.value = '';
        renderTodos();
    }
}

function deleteTodo(index) {
    const todos = getTodos();
    todos.splice(index, 1);
    saveTodos(todos);
    renderTodos();
}

addTodo.addEventListener('click', addNewTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addNewTodo();
    }
});

renderCalendar();
renderTodos();
