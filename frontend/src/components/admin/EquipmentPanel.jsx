import { useState } from "react";
import {
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from "../../api/admin/adminEquipmentApi";

const EquipmentPanel = ({ equipments, spaceId, setEquipments }) => {
  const [newEq, setNewEq] = useState({
    name: "",
    quantity: 1,
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEq((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const data = { ...newEq, space_id: spaceId };
    const res = await createEquipment(data);
    setEquipments((prev) => [...prev, res]);
    setNewEq({ name: "", quantity: 1, description: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet équipement ?")) return;
    await deleteEquipment(id);
    setEquipments((prev) => prev.filter((eq) => eq.id !== id));
  };

  const handleEdit = async (eq) => {
    const newName = prompt("Nom:", eq.name);
    if (!newName) return;
    const res = await updateEquipment(eq.id, { ...eq, name: newName });
    setEquipments((prev) => prev.map((e) => (e.id === eq.id ? res : e)));
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1rem",
        borderRadius: "10px",
        backgroundColor: "#1e1e1e",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        color: "white",
      }}
    >
      <h3 style={{ marginBottom: "1rem" }}>Équipements</h3>

      <ul style={{ listStyle: "none", padding: 0, marginBottom: "1rem" }}>
        {equipments.map((eq) => (
          <li
            key={eq.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem",
              marginBottom: "0.5rem",
              borderRadius: "6px",
              backgroundColor: "rgba(0, 123, 255, 0.15)",
            }}
          >
            <span>
              {eq.name} (Quantité: {eq.quantity} {eq.description})
            </span>
            <div>
              <button
                onClick={() => handleEdit(eq)}
                style={{
                  marginRight: "0.5rem",
                  backgroundColor: "#ffc107",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: "#000",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(eq.id)}
                style={{
                  backgroundColor: "#dc3545",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form
        onSubmit={handleAdd}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          backgroundColor: "#2a2a2a",
          padding: "1rem",
          borderRadius: "10px",
        }}
      >
        <input
          type="text"
          name="name"
          value={newEq.name}
          onChange={handleChange}
          placeholder="Nom"
          required
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #7BB493",
            backgroundColor: "#1e1e1e",
            color: "white",
          }}
        />
        <input
          type="number"
          name="quantity"
          value={newEq.quantity}
          onChange={handleChange}
          placeholder="Quantité"
          required
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #7BB493",
            backgroundColor: "#1e1e1e",
            color: "white",
          }}
        />
        <input
          type="text"
          name="description"
          value={newEq.description}
          onChange={handleChange}
          placeholder="Description"
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #7BB493",
            backgroundColor: "#1e1e1e",
            color: "white",
          }}
        />
        <button
          type="submit"
          style={{
            marginTop: "0.5rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "6px 10px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default EquipmentPanel;
