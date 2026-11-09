// === ДАННЫЕ ===

// Названия месяцев и дней
const MONTHS_NOMINATIVE = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const MONTHS_GENITIVE = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

const DAYS_OF_WEEK = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

// Все возможные слоты времени
const ALL_TIME_SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// Занятые слоты (для примера)
const OCCUPIED_SLOTS = ['11:00', '13:00'];

// === СОСТОЯНИЕ ПРИЛОЖЕНИЯ ===

const state = {
    currentMonth: 9, // Октябрь (0-индексный: 0=январь, 9=октябрь)
    currentYear: 2026,
    selectedDay: 9, // Выбранный день по умолчанию
    selectedTime: '10:00' // Выбранное время по умолчанию
};

// "Сегодня" для проверки (фиксированная дата для удобства)
const TODAY = new Date(2026, 10, 9); // 9 ноября 2026

// === ЧИСТЫЕ ФУНКЦИИ ===

// Построение сетки календаря
function buildCalendarGrid(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let dayOfWeek = firstDay.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7; // Воскресенье = 7 (Пн=1)
    
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const grid = [];
    
    // Дни предыдущего месяца
    for (let i = dayOfWeek - 1; i > 0; i--) {
        grid.push({
            day: daysInPrevMonth - i + 1,
            month: month - 1,
            year: year,
            isCurrentMonth: false
        });
    }
    
    // Дни текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
        grid.push({
            day: i,
            month: month,
            year: year,
            isCurrentMonth: true
        });
    }
    
    // Дни следующего месяца (чтобы заполнить сетку до конца недели)
    const totalCells = grid.length;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
        grid.push({
            day: i,
            month: month + 1,
            year: year,
            isCurrentMonth: false
        });
    }
    
    return grid;
}

// Проверка, можно ли выбрать день (не раньше "сегодня")
function isDateSelectable(day, month, year) {
    const selectedDate = new Date(year, month, day);
    const today = new Date(TODAY);
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    return selectedDate >= today;
}

// Генерация слотов времени для выбранного дня
function generateSlots() {
    return ALL_TIME_SLOTS.map(time => ({
        time: time,
        occupied: OCCUPIED_SLOTS.includes(time)
    }));
}

// === РЕНДЕР (ОТРИСОВКА) ===

// Отрисовка календаря
function renderCalendar() {
    const calendarGrid = document.querySelector('.calendar-grid');
    const monthTitle = document.querySelector('.calendar-month');
    
    // Обновляем заголовок месяца
    monthTitle.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;
    
    // Строим сетку
    const grid = buildCalendarGrid(state.currentYear, state.currentMonth);
    
    let html = `
        <div class="day-name">Пн</div>
        <div class="day-name">Вт</div>
        <div class="day-name">Ср</div>
        <div class="day-name">Чт</div>
        <div class="day-name">Пт</div>
        <div class="day-name">Сб</div>
        <div class="day-name">Вс</div>
    `;
    
    grid.forEach(item => {
        const isSelectable = item.isCurrentMonth && isDateSelectable(item.day, item.month, item.year);
        const isSelected = item.isCurrentMonth && 
                          item.day === state.selectedDay && 
                          item.month === state.currentMonth && 
                          item.year === state.currentYear;
        
        let classes = 'day';
        if (!item.isCurrentMonth) classes += ' other-month';
        if (isSelected) classes += ' active';
        if (!isSelectable && item.isCurrentMonth) classes += ' disabled';
        
        html += `<div class="${classes}" 
                    data-day="${item.day}" 
                    data-month="${item.month}" 
                    data-year="${item.year}">
                    ${item.day}
                 </div>`;
    });
    
    calendarGrid.innerHTML = html;
    
    // Навешиваем обработчики клика на дни
    document.querySelectorAll('.day:not(.other-month):not(.disabled)').forEach(dayEl => {
        dayEl.addEventListener('click', onDayClick);
    });
}

// Отрисовка слотов времени
function renderTimeSlots() {
    const slotsGrid = document.querySelector('.slots-grid');
    const slots = generateSlots();
    
    let html = '';
    slots.forEach(slot => {
        const isActive = slot.time === state.selectedTime;
        let classes = 'slot';
        if (isActive) classes += ' active';
        if (slot.occupied) classes += ' occupied';
        
        html += `<button class="${classes}" data-time="${slot.time}">
                    ${slot.time}
                    ${slot.occupied ? '<br><small>Занято</small>' : ''}
                 </button>`;
    });
    
    slotsGrid.innerHTML = html;
    
    // Навешиваем обработчики клика на свободные слоты
    document.querySelectorAll('.slot:not(.occupied)').forEach(slotEl => {
        slotEl.addEventListener('click', onTimeSlotClick);
    });
}

// Обновление нижней панели
function updateBottomBar() {
    const dateEl = document.getElementById('selected-date');
    const timeEl = document.getElementById('selected-time');
    
    if (state.selectedDay && state.selectedTime) {
        const selectedDate = new Date(state.currentYear, state.currentMonth, state.selectedDay);
        const dayOfWeek = DAYS_OF_WEEK[selectedDate.getDay()];
        const day = state.selectedDay;
        const month = MONTHS_GENITIVE[state.currentMonth];
        const year = state.currentYear;
        
        dateEl.textContent = `${dayOfWeek}, ${day} ${month} ${year}`;
        timeEl.textContent = `• ${state.selectedTime}`;
    } else {
        dateEl.textContent = 'Выберите дату';
        timeEl.textContent = 'и время';
    }
}

// === ОБРАБОТЧИКИ СОБЫТИЙ ===

// Клик по дню
function onDayClick(event) {
    const dayEl = event.currentTarget;
    const day = parseInt(dayEl.dataset.day);
    const month = parseInt(dayEl.dataset.month);
    const year = parseInt(dayEl.dataset.year);
    
    if (!isDateSelectable(day, month, year)) return;
    
    state.selectedDay = day;
    state.currentMonth = month;
    state.currentYear = year;
    state.selectedTime = null; // Сбрасываем время при смене дня!
    
    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
}

// Клик по слоту времени
function onTimeSlotClick(event) {
    const slotEl = event.currentTarget;
    const time = slotEl.dataset.time;
    
    state.selectedTime = time;
    
    renderTimeSlots();
    updateBottomBar();
}

// Навигация по месяцам
function setupMonthNavigation() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    prevBtn.addEventListener('click', () => {
        state.currentMonth--;
        if (state.currentMonth < 0) {
            state.currentMonth = 11;
            state.currentYear--;
        }
        state.selectedDay = null;
        state.selectedTime = null;
        renderCalendar();
        renderTimeSlots();
        updateBottomBar();
    });
    
    nextBtn.addEventListener('click', () => {
        state.currentMonth++;
        if (state.currentMonth > 11) {
            state.currentMonth = 0;
            state.currentYear++;
        }
        state.selectedDay = null;
        state.selectedTime = null;
        renderCalendar();
        renderTimeSlots();
        updateBottomBar();
    });
}

// === ИНИЦИАЛИЗАЦИЯ ===

function init() {
    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
    setupMonthNavigation();
}

// Запуск после загрузки страницы
document.addEventListener('DOMContentLoaded', init);