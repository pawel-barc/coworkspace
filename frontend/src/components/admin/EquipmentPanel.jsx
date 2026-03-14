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
    <div className="equipment-panel">
      <h3>Équipements</h3>
      <ul>
        {equipments.map((eq) => (
          <li key={eq.id}>
            {eq.name} (Quantité: {eq.quantity} {eq.description})
            <button onClick={() => handleEdit(eq)}>Edit</button>
            <button onClick={() => handleDelete(eq.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd}>
        <input
          type="text"
          name="name"
          value={newEq.name}
          onChange={handleChange}
          placeholder="Nom"
          required
        />
        <input
          type="number"
          name="quantity"
          value={newEq.quantity}
          onChange={handleChange}
          placeholder="Quantité"
          required
        />
        <input
          type="text"
          name="description"
          value={newEq.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default EquipmentPanel;
