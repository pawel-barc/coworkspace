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
    <div className="admin-spaces-page">
      <h2>Gestion des espaces</h2>

      <Link to="/admin/spaces/create">
        <button>Créer un espace</button>
      </Link>

      <div className="spaces-grid">
        {Array.isArray(spaces) &&
          spaces.map((space) => (
            <AdminSpaceCard key={space.id} space={space} />
          ))}
      </div>
    </div>
  );
};

export default AdminSpaces;
