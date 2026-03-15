import { useEffect, useState } from "react";
import { getSpaces } from "../../api/user/spacesApi";
import SpaceCard from "../../components/user/SpaceCard";

const UserSpaces = () => {
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await getSpaces();
        setSpaces(response.data);
      } catch (error) {
        console.error("Failed to fetch spaces:", error);
      }
    };

    fetchSpaces();
  }, []);

  return (
    <div>
      <h1>Available Spaces</h1>

      <div className="spaces-grid">
        {Array.isArray(spaces) &&
        spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </div>
    </div>
  );
};

export default UserSpaces;
