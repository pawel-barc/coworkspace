import { useState } from "react";
import { createReservation } from "../../api/user/reservationsApi";
import { toast } from "react-toastify";

const ReservationForm = ({
  spaceId,
  startAt,
  endAt,
  deskId,
  requiresDesk,
  onReservationCreated,
}) => {
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (requiresDesk && !deskId) {
      alert("Please select a desk first!");
      return;
    }

    const reservationData = {
      space_id: parseInt(spaceId),
      desk_id: deskId || null,
      start_at: new Date(startAt).toISOString(),
      end_at: new Date(endAt).toISOString(),
      title,
      visibility,
      notes,
    };

    try {
      await createReservation(reservationData);
      toast.success("Réservation crée avec succès");
      onReservationCreated();
    } catch (err) {
      console.error(err);
      toast.error("Réservation a echoué");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Reservation</h3>
      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Start</label>
        <input type="datetime-local" value={startAt} readOnly />
      </div>
      <div>
        <label>End</label>
        <input type="datetime-local" value={endAt} readOnly />
      </div>
      <div>
        <label>Visibility</label>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </div>
      <div>
        <label>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <button type="submit">Reserve</button>
    </form>
  );
};

export default ReservationForm;
