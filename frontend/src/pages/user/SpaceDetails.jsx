import React from "react";
import { useParams } from "react-router-dom";

const SpaceDetails = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Détails de l'espace</h1>
      <p>ID de l'espace: {id}</p>
      <p>Contenu minimal pour commencer le développement.</p>
    </div>
  );
};

export default SpaceDetails;
