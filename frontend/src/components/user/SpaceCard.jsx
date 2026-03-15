import { Link } from "react-router-dom";

const SpaceCard = ({ space }) => {
  return (
    <div className="space-card">
      <img
        src={`http://localhost:8080${space.plan_image}`}
        alt={space.name}
        width="200"
      />

      <h3>{space.name}</h3>

      <p>Type: {space.type}</p>
      <p>Capacity: {space.capacity}</p>
      <p>Location: {space.location_label}</p>

      <Link to={`/spaces/${space.id}`}>
        <button>View details</button>
      </Link>
    </div>
  );
};

export default SpaceCard;
