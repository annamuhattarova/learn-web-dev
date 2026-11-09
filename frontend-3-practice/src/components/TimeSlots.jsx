import { generateSlots } from '../data/date';

export default function TimeSlots({ selectedTime, onTimeClick }) {
    const slots = generateSlots();

    return (
        <section className="time-slots">
            <h3 className="time-title">Доступное время</h3>
            <div className="slots-grid">
                {slots.map((slot) => {
                    const isActive = slot.time === selectedTime;
                    let classes = 'slot';
                    if (isActive) classes += ' active';
                    if (slot.occupied) classes += ' occupied';

                    return (
                        <button
                            key={slot.time}
                            className={classes}
                            onClick={() => !slot.occupied && onTimeClick(slot.time)}
                            disabled={slot.occupied}
                        >
                            {slot.time}
                            {slot.occupied && <><br /><small>Занято</small></>}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}