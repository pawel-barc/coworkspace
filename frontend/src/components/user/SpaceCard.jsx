import { Link } from "react-router-dom";
import "../../styles/components/user/SpaceCard.css";

const SpaceCard = ({ space }) => {
  return (
    <Link to={`/spaces/${space.id}`} className="space-card-link">
      <div className="space-card">
        <div className="space-card-header">
          <h3>{space.name}</h3>
        </div>

        <div className="space-card-body">
          <p>
            <strong>Type:</strong> {space.type}
          </p>
          <p>
            <strong>Capacity:</strong> {space.capacity}
          </p>
          <p>
            <strong>Location:</strong> {space.location_label}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default SpaceCard;
