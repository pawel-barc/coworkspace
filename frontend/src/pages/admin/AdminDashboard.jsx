import { useEffect, useState } from "react";
import { getAdminSpaces } from "../../api/admin/adminSpacesApi";
import { getAdminReservations } from "../../api/admin/adminReservationsApi";

const AdminDashboard = () => {
  const [spacesCount, setSpacesCount] = useState(0);
  const [todaysReservations, setTodaysReservations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const spacesResponse = await getAdminSpaces();
        setSpacesCount((spacesResponse.data || []).length);

        const reservationsResponse = await getAdminReservations();
        const todayReservations = reservationsResponse.filter((res) => {
          const today = new Date();
          const start = new Date(res.start_at);
          return (
            start.getDate() === today.getDate() &&
            start.getMonth() === today.getMonth() &&
            start.getFullYear() === today.getFullYear()
          );
        });
        setTodaysReservations(todayReservations);
      } catch (err) {
        console.error(
          "Erreur lors du chargement des données du dashboard",
          err,
        );
      }
    };

    fetchData();
  }, []);

  const today = new Date();

  <p>Aujourd'hui : {today.toLocaleDateString("fr-FR")}</p>;

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h1>Bienvenue, Admin !</h1>
      <p style={{ marginBottom: "1rem" }}>
        Aujourd'hui : {today.toLocaleDateString("fr-FR")}
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: "1 1 100px",
            padding: "1rem",
            backgroundColor: "#1e1e1e",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            width: "300px",
            height: "120px",
          }}
        >
          <h3>Salles disponibles</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {spacesCount}
          </p>
        </div>
        <div
          style={{
            flex: "1 1 100px",
            padding: "1rem",
            backgroundColor: "#1e1e1e",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            width: "300px",
            height: "120px",
          }}
        >
          <h3>Réservations aujourd'hui</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {todaysReservations.length}
          </p>
        </div>

        {todaysReservations.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h3>Prochaines réservations :</h3>
            <ul style={{listStyle: "none"}}>
              {todaysReservations.slice(0, 5).map((r) => (
                <li key={r.id}>
                  {r.user_name ?? r.user_id} - {r.space_name ?? r.space_id} :{" "}
                  {new Date(r.start_at).toLocaleTimeString("fr-FR")} -{" "}
                  {new Date(r.end_at).toLocaleTimeString("fr-FR")}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <button
          style={{
            padding: "10px 15px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => (window.location.href = "/admin/spaces")}
        >
          Gérer les salles
        </button>
        <button
          style={{
            padding: "10px 15px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#28a745",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => (window.location.href = "/admin/users")}
        >
          Gérer les utilisateurs
        </button>
        <button
          style={{
            padding: "10px 15px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#ffc107",
            color: "#000",
            cursor: "pointer",
          }}
          onClick={() => (window.location.href = "/admin/reservations")}
        >
          Gérer les réservations
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
