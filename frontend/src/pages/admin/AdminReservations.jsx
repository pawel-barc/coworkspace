import { useEffect, useState } from "react";
import {
  getAdminReservations,
  deleteAdminReservation,
} from "../../api/admin/adminReservationsApi";
import AdminReservationCard from "../../components/admin/AdminReservationCard";

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getAdminReservations();
        setReservations(data);
      } catch (err) {
        console.error("Erreur lors du chargement des réservations admin", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous supprimer cette réservation ?")) return;
    try {
      await deleteAdminReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (reservations.length === 0)
    return <p>Aucune réservation pour le moment.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Gestion des réservations</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {reservations.map((res) => (
          <AdminReservationCard
            key={res.id}
            reservation={res}
            onDelete={() => handleDelete(res.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminReservations;
