// Названия месяцев и дней
export const MONTHS_NOMINATIVE = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export const MONTHS_GENITIVE = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

export const DAYS_OF_WEEK = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

// Все возможные слоты времени
export const ALL_TIME_SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// Занятые слоты (для примера)
export const OCCUPIED_SLOTS = ['11:00', '13:00'];

// Построение сетки календаря
export function buildCalendarGrid(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let dayOfWeek = firstDay.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;
    
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
    
    // Дни следующего месяца
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

// Проверка, можно ли выбрать день
export function isDateSelectable(day, month, year, today) {
    const selectedDate = new Date(year, month, day);
    const todayDate = new Date(today.year, today.month, today.day);
    todayDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    return selectedDate >= todayDate;
}

// Генерация слотов времени
export function generateSlots() {
    return ALL_TIME_SLOTS.map(time => ({
        time: time,
        occupied: OCCUPIED_SLOTS.includes(time)
    }));
}