import { useState, useEffect } from 'react';
import { fetchToday, fetchSlots } from './api';

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

// Построение сетки календаря
function buildCalendarGrid(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let dayOfWeek = firstDay.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;
    
    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const grid = [];
    
    for (let i = dayOfWeek - 1; i > 0; i--) {
        grid.push({
            day: daysInPrevMonth - i + 1,
            month: month - 1,
            year: year,
            isCurrentMonth: false
        });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
        grid.push({
            day: i,
            month: month,
            year: year,
            isCurrentMonth: true
        });
    }
    
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
function isDateSelectable(day, month, year, today) {
    const selectedDate = new Date(year, month, day);
    const todayDate = new Date(today.year, today.month, today.day);
    todayDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    return selectedDate >= todayDate;
}

export default function App() {
    // Состояние для "сегодня"
    const [today, setToday] = useState(null);
    const [todayLoading, setTodayLoading] = useState(true);
    const [todayError, setTodayError] = useState(null);

    // Состояние для календаря
    const [currentMonth, setCurrentMonth] = useState(null);
    const [currentYear, setCurrentYear] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    // Состояние для слотов
    const [slots, setSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsError, setSlotsError] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    // Загрузка "сегодня" при открытии страницы
    useEffect(() => {
        async function loadToday() {
            try {
                setTodayLoading(true);
                setTodayError(null);
                
                const todayData = await fetchToday();
                
                setToday(todayData);
                setCurrentMonth(todayData.month);
                setCurrentYear(todayData.year);
                setSelectedDay(todayData.day);
                
                setTodayLoading(false);
            } catch (error) {
                setTodayError(error.message);
                setTodayLoading(false);
            }
        }
        
        loadToday();
    }, []);

    // Загрузка слотов при изменении выбранного дня
    useEffect(() => {
        if (!selectedDay || currentMonth === null || currentYear === null) {
            return;
        }

        async function loadSlots() {
            try {
                setSlotsLoading(true);
                setSlotsError(null);
                
                const slotsData = await fetchSlots(selectedDay, currentMonth, currentYear);
                
                // Защита от гонок: проверяем, что день не изменился
                if (slotsData.date.day === selectedDay && 
                    slotsData.date.month === currentMonth && 
                    slotsData.date.year === currentYear) {
                    setSlots(slotsData.slots);
                    setSelectedTime(null); // Сбрасываем время при смене дня
                }
                
                setSlotsLoading(false);
            } catch (error) {
                setSlotsError(error.message);
                setSlotsLoading(false);
            }
        }
        
        loadSlots();
    }, [selectedDay, currentMonth, currentYear]);

    // Обработчик клика по дню
    const handleDayClick = (day, month, year) => {
        if (!isDateSelectable(day, month, year, today)) return;
        
        setSelectedDay(day);
        setCurrentMonth(month);
        setCurrentYear(year);
    };

    // Обработчик клика по слоту
    const handleTimeClick = (time) => {
        setSelectedTime(time);
    };

    // Навигация по месяцам
    const handlePrevMonth = () => {
        let newMonth = currentMonth - 1;
        let newYear = currentYear;
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        setSelectedDay(null);
        setSelectedTime(null);
    };

    const handleNextMonth = () => {
        let newMonth = currentMonth + 1;
        let newYear = currentYear;
        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        setSelectedDay(null);
        setSelectedTime(null);
    };

    // Если "сегодня" загружается
    if (todayLoading) {
        return (
            <div className="page">
                <Header />
                <main className="main">
                    <div className="loading-message">Загрузка...</div>
                </main>
                <Footer />
            </div>
        );
    }

    // Если ошибка при загрузке "сегодня"
    if (todayError) {
        return (
            <div className="page">
                <Header />
                <main className="main">
                    <div className="error-message">Ошибка: {todayError}</div>
                </main>
                <Footer />
            </div>
        );
    }

    // Построение сетки календаря
    const grid = buildCalendarGrid(currentYear, currentMonth);

    return (
        <div className="page">
            <Header />

            <div className="steps">
                <div className="step done">
                    <span className="step-number">1</span>
                    <span className="step-label">Выбор парикмахера</span>
                </div>
                <div className="step done">
                    <span className="step-number">2</span>
                    <span className="step-label">Выбор услуги</span>
                </div>
                <div className="step active">
                    <span className="step-number">3</span>
                    <span className="step-label">Выбор даты и время</span>
                </div>
                <div className="step">
                    <span className="step-number">4</span>
                    <span className="step-label">Ваши контакты</span>
                </div>
                <div className="step">
                    <span className="step-number">5</span>
                    <span className="step-label">Подтверждение записи</span>
                </div>
            </div>

            <main className="main">
                <div className="back-link">
                    <a href="#">← Назад</a>
                </div>
                <h1 className="title">Выберите дату и время</h1>

                <div className="booking-container">
                    {/* Календарь */}
                    <section className="calendar">
                        <div className="calendar-header">
                            <h2 className="calendar-month">
                                {MONTHS_NOMINATIVE[currentMonth]} {currentYear}
                            </h2>
                            <div className="calendar-nav">
                                <button className="calendar-btn" onClick={handlePrevMonth}>&lt;</button>
                                <button className="calendar-btn" onClick={handleNextMonth}>&gt;</button>
                            </div>
                        </div>
                        <div className="calendar-grid">
                            <div className="day-name">Пн</div>
                            <div className="day-name">Вт</div>
                            <div className="day-name">Ср</div>
                            <div className="day-name">Чт</div>
                            <div className="day-name">Пт</div>
                            <div className="day-name">Сб</div>
                            <div className="day-name">Вс</div>

                            {grid.map((item, index) => {
                                const isSelectable = item.isCurrentMonth && isDateSelectable(item.day, item.month, item.year, today);
                                const isSelected = item.isCurrentMonth &&
                                    item.day === selectedDay &&
                                    item.month === currentMonth &&
                                    item.year === currentYear;

                                let classes = 'day';
                                if (!item.isCurrentMonth) classes += ' other-month';
                                if (isSelected) classes += ' active';
                                if (!isSelectable && item.isCurrentMonth) classes += ' disabled';

                                return (
                                    <div
                                        key={index}
                                        className={classes}
                                        onClick={() => handleDayClick(item.day, item.month, item.year)}
                                    >
                                        {item.day}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Слоты времени */}
                    <section className="time-slots">
                        <h3 className="time-title">Доступное время</h3>
                        
                        {slotsLoading && (
                            <div className="loading-message">Загрузка слотов...</div>
                        )}
                        
                        {slotsError && (
                            <div className="error-message">Ошибка: {slotsError}</div>
                        )}
                        
                        {!slotsLoading && !slotsError && (
                            <div className="slots-grid">
                                {slots.map((slot) => {
                                    const isActive = slot.time === selectedTime;
                                    let classes = 'slot';
                                    if (isActive) classes += ' active';
                                    if (!slot.available) classes += ' occupied';

                                    return (
                                        <button
                                            key={slot.time}
                                            className={classes}
                                            onClick={() => slot.available && handleTimeClick(slot.time)}
                                            disabled={!slot.available}
                                        >
                                            {slot.time}
                                            {!slot.available && <><br /><small>Занято</small></>}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>

                {/* Нижняя панель */}
                {selectedDay && selectedTime ? (
                    <div className="bottom-bar">
                        <span>
                            {DAYS_OF_WEEK[new Date(currentYear, currentMonth, selectedDay).getDay()]}, 
                            {selectedDay} {MONTHS_GENITIVE[currentMonth]} {currentYear}
                        </span>
                        <span>• {selectedTime}</span>
                    </div>
                ) : (
                    <div className="bottom-bar">
                        <span>Выберите дату</span>
                        <span>и время</span>
                    </div>
                )}

                <button className="btn-primary">Продолжить</button>
            </main>

            <Footer />
        </div>
    );
}

// Компонент Header
function Header() {
    return (
        <header className="header">
            <nav className="nav">
                <div className="logo">ПАРИКМАХЕРСКАЯ</div>
                <ul className="nav-links">
                    <li><a href="#">Услуги</a></li>
                    <li><a href="#">Галерея</a></li>
                    <li><a href="#">Команда</a></li>
                    <li><a href="#">Отзывы</a></li>
                    <li><a href="#">Контакты</a></li>
                </ul>
            </nav>
        </header>
    );
}

// Компонент Footer
function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-block">
                    <h4 className="footer-logo">ПАРИКМАХЕРСКАЯ</h4>
                    <p className="footer-desc">Дружелюбное описание услуг</p>
                </div>
                <div className="footer-block">
                    <h4 className="footer-title">КОНТАКТЫ</h4>
                    <p>📍 ул. Садовая, 15, Москва</p>
                    <p>📞 +7 (495) 123-45-67</p>
                </div>
                <div className="footer-block">
                    <h4 className="footer-title">РЕЖИМ РАБОТЫ</h4>
                    <p>Пн–Пт: 9:00 – 21:00</p>
                    <p>Сб–Вс: 10:00 – 19:00</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2026. Все права защищены.</p>
                <a href="#">Политика конфиденциальности</a>
            </div>
        </footer>
    );
}