import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAdminSpaceFull,
  updateAdminSpace,
} from "../../api/admin/adminSpacesApi";

const AdminEditSpace = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "meeting_room",
    capacity: 0,
    location_label: "",
    plan_image: "/assets/plans/meeting_room_small.png",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSpace = async () => {
      try {
        const response = await getAdminSpaceFull(id);
        if (response.space) {
          setForm({
            name: response.space.name,
            type: response.space.type,
            capacity: response.space.capacity,
            location_label: response.space.location_label,
            plan_image: response.space.plan_image,
          });
        } else {
          setError("Space not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load space");
      } finally {
        setLoading(false);
      }
    };

    loadSpace();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateAdminSpace(id, form);
      if (response.id) {
        navigate("/admin/spaces");
      } else {
        setError(response.message || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="admin-edit-space">
      <h2>Edit Space</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Type:</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="meeting_room">Meeting Room</option>
            <option value="open_space">Open Space</option>
          </select>
        </div>
        <div>
          <label>Capacity:</label>
          <input
            name="capacity"
            type="number"
            value={form.capacity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            name="location_label"
            value={form.location_label}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Plan:</label>
          <select
            name="plan_image"
            value={form.plan_image}
            onChange={handleChange}
          >
            <option value="/assets/plans/meeting_room_small.png">Small</option>
            <option value="/assets/plans/meeting_room_medium.png">
              Medium
            </option>
            <option value="/assets/plans/meeting_room_medium_screen.png">
              Medium + Screen
            </option>
            <option value="/assets/plans/meeting_room_large.png">Large</option>
            <option value="/assets/plans/meeting_room_large_screen.png">
              Large + Screen
            </option>
            <option value="/assets/plans/open_space.png">Open Space</option>
          </select>
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default AdminEditSpace;
