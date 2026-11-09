// Базовый URL API
const API_BASE = '/api';

// Получить "сегодня" с сервера
export async function fetchToday() {
    const response = await fetch(`${API_BASE}/booking/today`);
    
    if (!response.ok) {
        throw new Error('Не удалось получить дату "сегодня"');
    }
    
    return response.json();
}

// Получить слоты для выбранной даты
export async function fetchSlots(day, month, year) {
    const response = await fetch(
        `${API_BASE}/slots?day=${day}&month=${month}&year=${year}`
    );
    
    if (!response.ok) {
        throw new Error('Не удалось получить слоты');
    }
    
    return response.json();
}