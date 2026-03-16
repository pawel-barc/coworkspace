import { useEffect, useState } from "react";
import { getAdminSpaces } from "../../api/admin/adminSpacesApi";
import AdminSpaceCard from "../../components/admin/AdminSpaceCard";
import { Link } from "react-router-dom";

const AdminSpaces = () => {
  const [spaces, setSpaces] = useState([]);

  const loadSpaces = async () => {
    try {
      const response = await getAdminSpaces();
      setSpaces(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadSpaces();
  }, []);

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Gestion des espaces
      </h2>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Link to="/admin/spaces/create">
          <button
            style={{
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#7BB493",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Créer un espace
          </button>
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {Array.isArray(spaces) &&
          spaces.map((space) => (
            <AdminSpaceCard key={space.id} space={space} />
          ))}
      </div>
    </div>
  );
};

export default AdminSpaces;
