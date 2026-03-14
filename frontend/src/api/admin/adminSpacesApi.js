import fetchWithRefresh from "../shared/fetchWithRefresh";

const createAdminSpace = async (spaceData) => {
  const request = await fetchWithRefresh("http://localhost:8080/admin/spaces", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(spaceData),
  });
  return request.json();
};

const getAdminSpaces = async () => {
  const request = await fetchWithRefresh("http://localhost:8080/admin/spaces", {
    method: "GET",
    credentials: "include",
  });

  const response = await request.json();
  return response;
};

// api/admin/adminSpacesApi.js
const deleteAdminSpace = async (id) => {
  const request = await fetchWithRefresh(
    `http://localhost:8080/admin/spaces/${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    },
  );
  const responseText = await request.text();
  return responseText;
};

const API_URL = "http://localhost:8080/spaces";

const getAdminSpaceFull = async (id) => {
  const response = await fetchWithRefresh(`${API_URL}/${id}/full`, {
    method: "GET",
    credentials: "include",
  });
  return response.json(); // { space, desks, equipments }
};

const updateAdminSpace = async (id, data) => {
  const request = await fetchWithRefresh(
    `http://localhost:8080/admin/spaces/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    },
  );
  return request.json();
};

export {
  createAdminSpace,
  getAdminSpaces,
  deleteAdminSpace,
  getAdminSpaceFull,
  updateAdminSpace,
};
