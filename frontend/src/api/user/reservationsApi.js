import fetchWithRefresh from "../shared/fetchWithRefresh";

const createReservation = async (reservationData) => {
  const response = await fetchWithRefresh(
    "http://localhost:8080/reservations",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    },
  );

  return response.json();
};

const getMyReservations = async () => {
  const response = await fetchWithRefresh(
    "http://localhost:8080/reservations",
    {
      method: "GET",
    },
  );

  return response.json();
};

const updateReservation = async (id, data) => {
  const response = await fetchWithRefresh(
    `http://localhost:8080/reservations/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  return response.json();
};

const deleteReservation = async (id) => {
  const response = await fetchWithRefresh(
    `http://localhost:8080/reservations/${id}`,
    {
      method: "DELETE",
    },
  );

  return response;
};

export {
  createReservation,
  getMyReservations,
  updateReservation,
  deleteReservation,
};
