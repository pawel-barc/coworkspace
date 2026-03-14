import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getAdminSpaceFull } from "../../api/admin/adminSpacesApi"; // API GET /spaces/:id/full
import updateDeskPosition from "../../api/admin/adminDeskApi"; // API PATCH /desks/:id
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

  const handleDrag = (deskId, e) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newX = e.clientX - rect.left;
    const newY = e.clientY - rect.top;

    setDesks((prev) =>
      prev.map((d) =>
        d.id === deskId ? { ...d, position_x: newX, position_y: newY } : d,
      ),
    );
  };

  const handleDragEnd = async (desk) => {
    await updateDeskPosition(desk.id, {
      position_x: desk.position_x,
      position_y: desk.position_y,
    });
  };

  if (!space) return <p>Chargement...</p>;

  return (
    <>
      <div className="admin-space-full">
        <h2>{space.name}</h2>
        <div
          ref={containerRef}
          style={{
            position: "relative",
            width: "800px",
            height: "500px",
            border: "1px solid #ccc",
            backgroundImage: `url(http://localhost:8080${space.plan_image})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        >
          {desks.map((desk) => (
            <div
              key={desk.id}
              draggable
              onDrag={(e) => handleDrag(desk.id, e)}
              onDragEnd={() => handleDragEnd(desk)}
              style={{
                position: "absolute",
                left: desk.position_x,
                top: desk.position_y,
                padding: "5px 10px",
                margin: "90px",
                backgroundColor: "rgba(0, 123, 255, 0.8)",
                color: "#fff",
                cursor: "move",
                borderRadius: "4px",
              }}
            >
              {desk.name}
            </div>
          ))}
        </div>
      </div>
      <EquipmentPanel
        equipments={equipments}
        spaceId={space.id}
        setEquipments={setEquipments}
      />
    </>
  );
};
export default AdminSpaceDetail;
