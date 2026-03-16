import React from "react";
import useAuthStore from "../../store/AuthStore";

const Profile = () => {
  const { currentUser, role } = useAuthStore();

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ color: "white", textAlign: "center" }}>Profil</h1>
      {currentUser ? (
        <div style={{ color: "white" }}>
          <p>
            <strong>Nom d'utilisateur:</strong>{" "}
            {currentUser.username || currentUser.email}
          </p>
          <p>
            <strong>Email:</strong> {currentUser.email}
          </p>
          <p>
            <strong>Rôle:</strong> {role}
          </p>
        </div>
      ) : (
        <p>Aucune information utilisateur disponible.</p>
      )}
    </div>
  );
};

export default Profile;
