import { buildCalendarGrid, isDateSelectable, MONTHS_NOMINATIVE } from '../data/date';

export default function Calendar({ currentMonth, currentYear, selectedDay, today, onDayClick, onPrevMonth, onNextMonth }) {
    const grid = buildCalendarGrid(currentYear, currentMonth);

    return (
        <section className="calendar">
            <div className="calendar-header">
                <h2 className="calendar-month">
                    {MONTHS_NOMINATIVE[currentMonth]} {currentYear}
                </h2>
                <div className="calendar-nav">
                    <button className="calendar-btn" onClick={onPrevMonth}>&lt;</button>
                    <button className="calendar-btn" onClick={onNextMonth}>&gt;</button>
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
                            onClick={() => isSelectable && onDayClick(item.day, item.month, item.year)}
                        >
                            {item.day}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}