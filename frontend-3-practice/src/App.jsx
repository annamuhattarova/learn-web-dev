import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import BottomBar from './components/BottomBar';

// "Сегодня" для проверки
const TODAY = { day: 9, month: 10, year: 2026 }; // 9 ноября 2026

export default function App() {
    const [currentMonth, setCurrentMonth] = useState(9); // Октябрь
    const [currentYear, setCurrentYear] = useState(2026);
    const [selectedDay, setSelectedDay] = useState(9);
    const [selectedTime, setSelectedTime] = useState('10:00');

    const handleDayClick = (day, month, year) => {
        setSelectedDay(day);
        setCurrentMonth(month);
        setCurrentYear(year);
        setSelectedTime(null); // Сбрасываем время при смене дня!
    };

    const handleTimeClick = (time) => {
        setSelectedTime(time);
    };

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
                    <Calendar
                        currentMonth={currentMonth}
                        currentYear={currentYear}
                        selectedDay={selectedDay}
                        today={TODAY}
                        onDayClick={handleDayClick}
                        onPrevMonth={handlePrevMonth}
                        onNextMonth={handleNextMonth}
                    />
                    <TimeSlots
                        selectedTime={selectedTime}
                        onTimeClick={handleTimeClick}
                    />
                </div>

                <BottomBar
                    selectedDay={selectedDay}
                    selectedTime={selectedTime}
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                />

                <button className="btn-primary">Продолжить</button>
            </main>

            <Footer />
        </div>
    );
}