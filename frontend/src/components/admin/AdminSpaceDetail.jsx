import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getAdminSpaceFull } from "../../api/admin/adminSpacesApi";
import EquipmentPanel from "./EquipmentPanel";

const AdminSpaceDetail = () => {
  const { id } = useParams();
  const [space, setSpace] = useState(null);
  const [desks, setDesks] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAdminSpaceFull(id);
      setSpace(response.space);
      setDesks(response.desks || []);
      setEquipments(response.equipments || []);
    };
    fetchData();
  }, [id]);

  if (!space) return <p>Chargement...</p>;
  const offset = 89;
  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        {space.name}
      </h2>

      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "800px",
          height: "500px",
          margin: "0 auto",
          borderRadius: "10px",
          backgroundColor: "#1e1e1e",
          border: "2px solid #7BB493",
          backgroundImage: `url(http://localhost:8080${space.plan_image})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        {desks.map((desk) => (
          <div
            key={desk.id}
            style={{
              position: "absolute",
              left: desk.position_x + offset,
              top: desk.position_y + offset,
              width: "40px",
              height: "40px",
              backgroundColor: "rgba(0, 123, 255, 0.85)",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
              cursor: "default",
              fontSize: "12px",
              fontWeight: "bold",
              boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
              transition: "transform 0.2s",
            }}
          >
            {desk.name}
          </div>
        ))}
      </div>

      <EquipmentPanel
        equipments={equipments}
        spaceId={space.id}
        setEquipments={setEquipments}
      />
    </div>
  );
};

export default AdminSpaceDetail;
