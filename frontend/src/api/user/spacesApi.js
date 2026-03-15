import fetchWithRefresh from "../shared/fetchWithRefresh";

const getSpaces = async () => {
  const response = await fetchWithRefresh("http://localhost:8080/spaces", {
    method: "GET",
  });

  return response.json();
};

const getSpaceDetails = async (id) => {
  const response = await fetchWithRefresh(
    `http://localhost:8080/spaces/${id}/full`,
    {
      method: "GET",
    },
  );

  return response.json();
};

export { getSpaces, getSpaceDetails };
