import React from "react";
import { formatFrenchDatetime } from "../../utils/dateUtils";

const AdminReservationCard = ({ reservation, onDelete }) => {
  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        color: "white",
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
      }}
    >
      <p>
        <strong>Utilisateur:</strong>{" "}
        {reservation.user_name ?? reservation.user_id}
      </p>
      <p>
        <strong>Salle:</strong> {reservation.space_name ?? reservation.space_id}
      </p>
      <p>
        <strong>Start:</strong> {formatFrenchDatetime(reservation.start_at)}
      </p>
      <p>
        <strong>End:</strong> {formatFrenchDatetime(reservation.end_at)}
      </p>
      <p>
        <strong>Status:</strong> {reservation.status}
      </p>
      <button
        onClick={onDelete}
        style={{
          marginTop: "0.5rem",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          padding: "6px 10px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Supprimer
      </button>
    </div>
  );
};

export default AdminReservationCard;
