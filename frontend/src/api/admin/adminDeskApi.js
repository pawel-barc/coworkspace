// adminDeskApi.js
import fetchWithRefresh from "../shared/fetchWithRefresh";

const updateDeskPosition = async (deskId, payload) => {
  const res = await fetchWithRefresh(
    `http://localhost:8080/admin/desks/${deskId}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  return res.json();
};

export default updateDeskPosition;
