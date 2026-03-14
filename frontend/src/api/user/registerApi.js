// Fonction qui envoie les données d'inscription à l'API
const registerUser = async (values) => {
  const request = await fetch("http://localhost:8080/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(values),
  });

  const response = await request.json();

  return response;
};

export default registerUser;
