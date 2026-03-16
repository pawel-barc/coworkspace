import React from "react";
import useAuthStore from "../../store/AuthStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const name = useAuthStore((state) => state.name);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        padding: "2rem",
        minWidth: "80%",
        minHeight: "80%",
      }}
    >
      <div
        style={{
          flex: 2,
          background: "white",
          padding: "2rem",
        }}
      >
        <h2 style={{ color: "black", marginBottom: "5px" }}>Cowork'Space</h2>

        <h4 style={{ color: "gray", marginBottom: "2rem" }}>{today}</h4>

        {/* prochaine réservation */}
        <h3 style={{ marginBottom: "10px" }}>Ma prochaine réservation</h3>

        <div
          style={{
            border: "2px solid #7BB493",
            borderRadius: "8px",
            padding: "12px",
            width: "280px",
            marginBottom: "25px",
          }}
        >
          Salle Open Space — 20 Mars 09:00
        </div>

        {/* autres réservations */}
        <h3 style={{ marginBottom: "10px" }}>Mes autres réservations</h3>

        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              background: "#7BB493",
              color: "white",
              borderRadius: "8px",
              padding: "12px",
              width: "280px",
              marginBottom: "10px",
            }}
          >
            Desk 3 — 21 Mars 14:00
          </div>

          <div
            style={{
              background: "#7BB493",
              color: "white",
              borderRadius: "8px",
              padding: "12px",
              width: "280px",
              marginBottom: "10px",
            }}
          >
            Desk 5 — 22 Mars 10:00
          </div>

          <div
            style={{
              background: "#7BB493",
              color: "white",
              borderRadius: "8px",
              padding: "12px",
              width: "280px",
              marginBottom: "10px",
            }}
          >
            Salle réunion — 24 Mars 11:00
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          background: "#EEFFF4",
          padding: "2rem",
          borderRadius: "10px",
        }}
      >
        <h3 style={{ color: "black", marginBottom: "20px" }}>
          Les disponibilités du jour
        </h3>

        <p style={{ color: "#7BB493", fontWeight: "bold" }}>
          Salles disponibles
        </p>

        <p style={{ color: "#7BB493", marginBottom: "20px" }}>
          Postes disponibles
        </p>

        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <FontAwesomeIcon
            icon={faBuilding}
            size="3x"
            style={{ color: "#7BB493", marginBottom: "10px" }}
          />

          <Link
            to="/spaces"
            style={{
              color: "#7BB493",
              cursor: "pointer",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Voir les espaces
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
