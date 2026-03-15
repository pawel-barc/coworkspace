import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const ReservationCalendar = ({ events, onSelectSlot }) => {
  const localizer = momentLocalizer(moment);

  const handleSelectSlot = (slot) => {
    const hasConflict = events.some(
      (ev) => slot.start < ev.end && slot.end > ev.start,
    );
    if (hasConflict) {
      alert("Selected time slot is already booked!");
      return;
    }
    onSelectSlot(slot);
  };

  return (
    <div style={{ height: 500, backgroundColor: "#d4edda" }}>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        step={30}
        timeslots={2}
        selectable
        onSelectSlot={handleSelectSlot}
        min={new Date(0, 0, 0, 8, 0, 0)}
        max={new Date(0, 0, 0, 22, 0, 0)}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: "#d9534f",
            color: "white",
            fontSize: "12px",
            borderRadius: "4px",
            border: "none",
            display: "block",
            height: "100%",
            width: "100%",
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
          },
        })}
        slotPropGetter={() => ({
          style: {
            backgroundColor: "#d4edda",
          },
        })}
      />
    </div>
  );
};

export default ReservationCalendar;
