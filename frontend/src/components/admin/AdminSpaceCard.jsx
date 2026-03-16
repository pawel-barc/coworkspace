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
    <div
      style={{
        background: "white",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
    >
      <div
        style={{ backgroundColor: "#7BB493", padding: "1rem", color: "white" }}
      >
        <h3 style={{ margin: 0 }}>{space.name}</h3>
      </div>

      <div style={{ padding: "1rem", color: "#444", fontSize: "14px" }}>
        <p>
          <strong>Type:</strong> {space.type}
        </p>
        <p>
          <strong>Capacité:</strong> {space.capacity}
        </p>
        <p>
          <strong>Location:</strong> {space.location_label}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "0.5rem 0 1rem 0",
        }}
      >
        <Link to={`/admin/spaces/${space.id}/edit`}>
          <button
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#ffc107",
              color: "#000",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Edit
          </button>
        </Link>

        <Link to={`/admin/spaces/${space.id}/full`}>
          <button
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#17a2b8",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            View Full
          </button>
        </Link>

        <button
          onClick={handleDelete}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#dc3545",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminSpaceCard;
