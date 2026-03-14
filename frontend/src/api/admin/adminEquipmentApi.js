// src/api/admin/adminEquipmentApi.js

import fetchWithRefresh from "../shared/fetchWithRefresh";

// GET all equipment for a space
const getEquipmentBySpace = async (spaceId) => {
  const request = await fetchWithRefresh(
    `http://localhost:8080/admin/spaces/${spaceId}/equipments`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
  );
  return request.json();
};

// CREATE new equipment
const createEquipment = async (data) => {
  const request = await fetchWithRefresh(
    `http://localhost:8080/admin/equipments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    },
  );
  return request.json();
};

// UPDATE existing equipment
const updateEquipment = async (id, data) => {
  const request = await fetchWithRefresh(
    `http://localhost:8080/admin/equipments/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    },
  );
  return request.json();
};

// DELETE equipment
const deleteEquipment = async (id) => {
  const request = await fetchWithRefresh(
    `http://localhost:8080/admin/equipments/${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
  );

  if (!request.ok) {
    throw new Error("Failed to delete equipment");
  }

  return true;
};

export {
  getEquipmentBySpace,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};
