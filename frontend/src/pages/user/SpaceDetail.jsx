import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpaceDetails } from "../../api/user/spacesApi";

const SpaceDetail = () => {
  const { id } = useParams();

  const [space, setSpace] = useState(null);
  const [desks, setDesks] = useState([]);
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const response = await getSpaceDetails(id);

        setSpace(response.space);
        setDesks(response.desks || []);
        setEquipments(response.equipments || []);
      } catch (error) {
        console.error("Failed to fetch space details:", error);
      }
    };

    fetchSpace();
  }, [id]);

  if (!space) return <p>Loading...</p>;

  return (
    <div>
      <h1>{space.name}</h1>

      <img
        src={`http://localhost:8080${space.plan_image}`}
        alt={space.name}
        width="400"
      />

      <p>Type: {space.type}</p>
      <p>Capacity: {space.capacity}</p>
      <p>Location: {space.location_label}</p>

      <h2>Equipments</h2>

      {equipments.length === 0 && <p>No equipment available</p>}

      <ul>
        {equipments.map((eq) => (
          <li key={eq.id}>
            {eq.name} (x{eq.quantity})
          </li>
        ))}
      </ul>

      {space.type === "open_space" && (
        <>
          <h2>Desks</h2>

          {desks.length === 0 && <p>No desks</p>}

          <ul>
            {desks.map((desk) => (
              <li key={desk.id}>{desk.name}</li>
            ))}
          </ul>
        </>
      )}

      <button>Reserve this space</button>
    </div>
  );
};

export default SpaceDetail;
