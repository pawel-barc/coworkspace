import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdminSpace } from "../../api/admin/adminSpacesApi";
import "../../styles/components/admin/FormStyles.css";
const AdminCreateSpace = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "meeting_room",
    capacity: 0,
    location_label: "",
    plan_image: "/assets/plans/meeting_room_small.png",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity),
      };

      const response = await createAdminSpace(payload);
      if (response.id) {
        navigate("/admin/spaces");
      } else {
        setError(response.message || "Erreur lors de lacréation de l'espace");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur serveur");
    }
  };

  return (
    <div className="admin-edit-space admin-create-space">
      <h2>Créer un nouvel espace</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom de l'espace:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Type:</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="meeting_room">Salle de réunion</option>
            <option value="open_space">Open Space</option>
          </select>
        </div>

        <div>
          <label>Capacité:</label>
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Emplacement:</label>
          <input
            type="text"
            name="location_label"
            value={form.location_label}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Plan de l'espace:</label>
          <select
            name="plan_image"
            value={form.plan_image}
            onChange={handleChange}
          >
            <option value="/assets/plans/meeting_room_small.png">
              Salle petite
            </option>
            <option value="/assets/plans/meeting_room_medium.png">
              Salle moyenne
            </option>
            <option value="/assets/plans/meeting_room_medium_screen.png">
              Salle moyenne avec écran
            </option>
            <option value="/assets/plans/meeting_room_large.png">
              Salle large
            </option>
            <option value="/assets/plans/meeting_room_large_screen.png">
              Salle large avec écran
            </option>
            <option value="/assets/plans/open_space.png">Open Space</option>
          </select>
        </div>

        <button type="submit" style={{ padding: "10px" }}>
          Créer
        </button>
      </form>
    </div>
  );
};

export default AdminCreateSpace;
