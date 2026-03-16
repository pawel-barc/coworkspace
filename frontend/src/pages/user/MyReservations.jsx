import React, { useEffect, useState } from "react";
import {
  getMyReservations,
  deleteReservation,
  updateReservation,
} from "../../api/user/reservationsApi";
import { toast } from "react-toastify";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReservation, setEditingReservation] = useState(null);
  const [title, setTitle] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  const loadReservations = async () => {
    try {
      const data = await getMyReservations();
      setReservations(data);
    } catch (err) {
      console.error("Erreur lors du chargement des réservations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Voulez-vous annuler cette réservation ?",
    );

    if (!confirmDelete) return;

    try {
      await deleteReservation(id);
      setReservations((prev) =>
        prev.filter((reservation) => reservation.id !== id),
      );
    } catch (err) {
      console.error("Erreur suppression réservation", err);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <p>Chargement...</p>
      </div>
    );
  }

  const handleUpdate = async () => {
    try {
      const updated = await updateReservation(editingReservation.id, {
        title,
        start_at: new Date(startAt).toISOString(),
        end_at: new Date(endAt).toISOString(),
      });

      setReservations((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      );

      setEditingReservation(null);
      toast.success("Mis à jour effectuée avec succès");
    } catch (err) {
      console.error("Erreur update réservation", err);
    }
  };

  const openEditModal = (reservation) => {
    setEditingReservation(reservation);

    setTitle(reservation.title);
    setStartAt(reservation.start_at.slice(0, 16));
    setEndAt(reservation.end_at.slice(0, 16));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "white", textAlign: "center", marginBottom: "80px" }}>
        Mes réservations
      </h1>

      {reservations.length === 0 ? (
        <p>Aucune réservation pour le moment.</p>
      ) : (
        <table
          style={{
            width: "100%",
            marginTop: "1rem",
            borderCollapse: "collapse",
            color: "white",
            textAlign: "left",
          }}
        >
          <thead>
            <tr>
              <th>Title</th>
              <th>Desk</th>
              <th>Start</th>
              <th>End</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td>{r.title}</td>
                <td>{r.desk_id ?? "Space"}</td>
                <td>{new Date(r.start_at).toLocaleString()}</td>
                <td>{new Date(r.end_at).toLocaleString()}</td>

                <td>
                  <button onClick={() => openEditModal(r)}>Modifier</button>

                  <button
                    onClick={() => handleDelete(r.id)}
                    style={{
                      marginLeft: "8px",
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Annuler
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editingReservation && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h2>Modifier la réservation</h2>

            <div style={{ marginBottom: "1rem" }}>
              <label>Titre</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label>Start</label>
              <input
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label>End</label>
              <input
                type="datetime-local"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setEditingReservation(null)}>
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "4px",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;
