import { useState } from "react";
import { createReservation } from "../../api/user/reservationsApi";
import { toast } from "react-toastify";
const ReservationForm = ({ spaceId, startAt, endAt, onReservationCreated }) => {
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startAtRFC = new Date(startAt).toISOString();
    const endAtRFC = new Date(endAt).toISOString();

    const reservationData = {
      space_id: parseInt(spaceId),
      start_at: startAtRFC,
      end_at: endAtRFC,
      title,
      visibility,
      notes,
    };

    try {
      await createReservation(reservationData);
      toast.success("La réservation a réussie");
      if (onReservationCreated) onReservationCreated();
    } catch (err) {
      console.error(err);
      toast.error("La connexion a échouée");
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
