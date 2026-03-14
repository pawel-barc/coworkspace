import { Link } from "react-router-dom";
import { deleteAdminSpace } from "../../api/admin/adminSpacesApi";
const AdminSpaceCard = ({ space }) => {
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${space.name}?`)) {
      try {
        await deleteAdminSpace(space.id);
        alert("Space deleted successfully");
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert("Failed to delete space");
      }
    }
  };
  return (
    <div className="admin-space-card">
      <img
        src={`http://localhost:8080${space.plan_image}`}
        alt={space.name}
        width="200"
      />

      <h3>{space.name}</h3>

      <p>Type: {space.type}</p>
      <p>Capacité: {space.capacity}</p>
      <p>Location: {space.location_label}</p>

      <div className="card-actions">
        <div className="card-actions">
          <Link to={`/admin/spaces/${space.id}/edit`}>
            <button>Edit</button>
          </Link>
          <Link to={`/admin/spaces/${space.id}/full`}>
            <button>View Full</button>
          </Link>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSpaceCard;
