import fetchWithRefresh from "../shared/fetchWithRefresh";

const getAdminReservations = async () => {
  const response = await fetchWithRefresh(
    "http://localhost:8080/admin/reservations",
    {
      method: "GET",
    },
  );

  return response.json();
};

const updateReservationStatus = async (id, status) => {
  const response = await fetchWithRefresh(
    `http://localhost:8080/admin/reservations/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    },
  );

  return response.json();
};

const deleteAdminReservation = async (id) => {
  const response = await fetchWithRefresh(
    `http://localhost:8080/admin/reservations/${id}`,
    {
      method: "DELETE",
    },
  );

  return response.json();
};

export {
  getAdminReservations,
  updateReservationStatus,
  deleteAdminReservation,
};
