import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getSpaceDetails } from "../../api/user/spacesApi";
import {
  getSpaceReservations,
  createReservation,
} from "../../api/user/reservationsApi";
import ReservationForm from "../../components/user/ReservationForm";
import ReservationCalendar from "../../components/shared/ReservationCalendar";

const SpaceDetail = () => {
  const { id } = useParams();
  const [space, setSpace] = useState(null);
  const [desks, setDesks] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [events, setEvents] = useState([]);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDeskId, setSelectedDeskId] = useState(null);
  const [deskAvailability, setDeskAvailability] = useState({}); // {deskId: true/false}
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSpaceDetails(id);
        setSpace(response.space);
        setDesks(response.desks || []);
        setEquipments(response.equipments || []);
      } catch (err) {
        console.error("Failed to fetch space:", err);
      }
    };
    fetchData();
  }, [id]);

  const fetchReservations = async () => {
    if (!space) return;
    try {
      const res = await getSpaceReservations(space.id);
      const formatted = res.data.map((r) => ({
        title: r.title || "Reserved",
        start: new Date(r.start_at),
        end: new Date(r.end_at),
        deskId: r.desk_id,
      }));
      setEvents(formatted);
      return formatted;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const handleSlotSelect = async (slot) => {
    const start = slot.start;
    const end = slot.end;

    setStartAt(start.toISOString().slice(0, 16));
    setEndAt(end.toISOString().slice(0, 16));
    setSelectedDeskId(null);

    const reservations = await fetchReservations();

    const availability = {};
    desks.forEach((desk) => {
      const isBooked = reservations.some(
        (ev) =>
          ev.deskId === desk.id &&
          ((start >= ev.start && start < ev.end) ||
            (end > ev.start && end <= ev.end) ||
            (start <= ev.start && end >= ev.end)),
      );
      availability[desk.id] = !isBooked;
    });

    setDeskAvailability(availability);
    setShowCalendar(true);
  };

  if (!space) return <p>Loading...</p>;

  const formatLocalDatetime = (date) => {
    const pad = (n) => (n < 10 ? "0" + n : n);
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  };

  return (
    <div className="space-detail">
      <h2>{space.name}</h2>

      <div style={{ marginTop: "20px" }}>
        <p>
          <b>Type:</b> {space.type}
        </p>
        <p>
          <b>Capacity:</b> {space.capacity}
        </p>
        <p>
          <b>Location:</b> {space.location_label}
        </p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Equipment</h3>
        {equipments.length === 0 && <p>No equipment</p>}
        <ul>
          {equipments.map((eq) => (
            <li key={eq.id}>
              {eq.name} (x{eq.quantity})
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: "20px" }}>
        <ReservationCalendar
          spaceId={space.id}
          events={events}
          onSelectSlot={handleSlotSelect}
        />
      </div>

      {showCalendar && (
        <>
          <h3>Pick a Desk</h3>
          <div
            ref={containerRef}
            style={{
              position: "relative",
              width: "800px",
              height: "500px",
              border: "1px solid #ccc",
              backgroundImage: `url(http://localhost:8080${space.plan_image})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          >
            {desks.map((desk) => {
              const isAvailable = deskAvailability[desk.id];
              return (
                <div
                  key={desk.id}
                  onClick={() => isAvailable && setSelectedDeskId(desk.id)}
                  style={{
                    position: "absolute",
                    left: desk.position_x,
                    top: desk.position_y,

                    width: "32px",
                    height: "32px",

                    backgroundColor: isAvailable
                      ? desk.id === selectedDeskId
                        ? "#ffc107"
                        : "rgba(40,167,69,0.85)"
                      : "rgba(220,53,69,0.85)",

                    borderRadius: "6px",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    fontSize: "10px",
                    fontWeight: "bold",
                    color: "white",

                    transform: "translate(300%, 200%)",

                    cursor: isAvailable ? "pointer" : "not-allowed",
                    border: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  {desk.name}
                </div>
              );
            })}
          </div>

          <ReservationForm
            spaceId={space.id}
            startAt={startAt}
            endAt={endAt}
            deskId={selectedDeskId}
            onReservationCreated={fetchReservations}
          />
        </>
      )}
    </div>
  );
};

export default SpaceDetail;
