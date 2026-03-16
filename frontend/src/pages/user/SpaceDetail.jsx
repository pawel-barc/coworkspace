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
  const [deskAvailability, setDeskAvailability] = useState({});
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

    setStartAt(formatLocalDatetime(start));
    setEndAt(formatLocalDatetime(end));
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
    <div
      className="space-detail"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        gap: "1.5rem",
      }}
    >
      <h2 style={{ color: "#fff", textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}>
        {space.name}
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        <div
          style={{
            flex: "1 1 250px",
            backgroundColor: "#1e1e1e",
            color: "white",
            padding: "1.5rem",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            minWidth: "250px",
          }}
        >
          <p>
            <b>Type:</b> {space.type}
          </p>
          <p>
            <b>Capacity:</b> {space.capacity}
          </p>
          <p>
            <b>Location:</b> {space.location_label}
          </p>

          <h4 style={{ marginTop: "1rem" }}>Equipment:</h4>
          <ul style={{ paddingLeft: "1.2rem" }}>
            {equipments.length === 0 && <li>No equipment</li>}
            {equipments.map((eq) => (
              <li key={eq.id}>
                {eq.name} (x{eq.quantity})
              </li>
            ))}
          </ul>

          <button
            onClick={() => setShowCalendar(true)}
            style={{
              marginTop: "1.5rem",
              width: "100%",
              padding: "10px 0",
              backgroundColor: "#7BB493",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Réserver
          </button>
        </div>

        <div
          ref={containerRef}
          style={{
            position: "relative",
            width: "800px",
            height: "500px",
            backgroundColor: "#000",
            backgroundImage: `url(http://localhost:8080${space.plan_image})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            borderRadius: "10px",
            border: "2px solid #7BB493",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
        >
          {desks.map((desk) => {
            const isAvailable = deskAvailability[desk.id];
            const offset = 89;
            return (
              <div
                key={desk.id}
                onClick={() => isAvailable && setSelectedDeskId(desk.id)}
                style={{
                  position: "absolute",
                  left: desk.position_x + offset,
                  top: desk.position_y + offset,
                  width: "40px",
                  height: "40px",
                  backgroundColor: isAvailable
                    ? desk.id === selectedDeskId
                      ? "#ffc107"
                      : "rgba(40,167,69,0.85)"
                    : "rgba(220,53,69,0.85)",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "white",
                  cursor: isAvailable ? "pointer" : "not-allowed",
                  border: "1px solid rgba(0,0,0,0.3)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                }}
              >
                {desk.name}
              </div>
            );
          })}
        </div>
      </div>

      {showCalendar && (
        <div style={{ width: "100%", marginTop: "2rem" }}>
          <ReservationCalendar
            spaceId={space.id}
            events={events}
            onSelectSlot={handleSlotSelect}
          />

          <ReservationForm
            spaceId={space.id}
            startAt={startAt}
            endAt={endAt}
            deskId={selectedDeskId}
            onReservationCreated={fetchReservations}
            requiresDesk={space.type === "open_space"}
          />
        </div>
      )}
    </div>
  );
};

export default SpaceDetail;
