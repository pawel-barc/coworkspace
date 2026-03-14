import React from "react";
import useAuthStore from "../../store/AuthStore";
const UserDashboard = () => {
  const name = useAuthStore((state) => state.name);
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bienvenue, {name || "Utilisateur"}!</h1>
      <p>Ceci est le tableau de bord de l'utilisateur.</p>
    </div>
  );
};

export default UserDashboard;
