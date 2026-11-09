import { DAYS_OF_WEEK, MONTHS_GENITIVE } from '../data/date';

export default function BottomBar({ selectedDay, selectedTime, currentMonth, currentYear }) {
    if (!selectedDay || !selectedTime) {
        return (
            <div className="bottom-bar">
                <span>Выберите дату</span>
                <span>и время</span>
            </div>
        );
    }

    const selectedDate = new Date(currentYear, currentMonth, selectedDay);
    const dayOfWeek = DAYS_OF_WEEK[selectedDate.getDay()];
    const month = MONTHS_GENITIVE[currentMonth];

    return (
        <div className="bottom-bar">
            <span>{dayOfWeek}, {selectedDay} {month} {currentYear}</span>
            <span>• {selectedTime}</span>
        </div>
    );
}