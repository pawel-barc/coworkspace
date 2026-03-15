import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getSpaceDetails } from "../../api/user/spacesApi";
import { getSpaceReservations } from "../../api/user/reservationsApi";
import ReservationForm from "../../components/user/ReservationForm";
import ReservationCalendar from "../../components/shared/ReservationCalendar";

const SpaceDetail = () => {
  const { id } = useParams();
  const [space, setSpace] = useState(null);
  const [desks, setDesks] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [events, setEvents] = useState([]);

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
    try {
      const res = await getSpaceReservations(space.id);
      const formatted = res.data.map((r) => ({
        title: r.title || "Reserved",
        start: new Date(r.start_at),
        end: new Date(r.end_at),
      }));
      setEvents(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (space) fetchReservations();
  }, [space]);

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
        {desks.map((desk) => (
          <div
            key={desk.id}
            style={{
              position: "absolute",
              left: desk.position_x,
              top: desk.position_y,
              padding: "5px 10px",
              backgroundColor: "rgba(40,167,69,0.85)",
              color: "#fff",
              borderRadius: "4px",
            }}
          >
            {desk.name}
          </div>
        ))}
      </div>

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
        <button onClick={() => setShowCalendar((prev) => !prev)}>
          Reserve this space
        </button>

        {showCalendar && (
          <>
            <ReservationCalendar
              spaceId={space.id}
              events={events}
              onSelectSlot={(slot) => {
                setStartAt(formatLocalDatetime(slot.start));
                setEndAt(formatLocalDatetime(slot.end));
              }}
            />

            <ReservationForm
              spaceId={space.id}
              startAt={startAt}
              endAt={endAt}
              onReservationCreated={fetchReservations}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SpaceDetail;
