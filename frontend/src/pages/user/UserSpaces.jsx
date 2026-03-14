import React from "react";
import { Link } from "react-router-dom";

const UserSpaces = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Espaces disponibles</h1>
      <ul>
        <li>
          <Link to="/spaces/1">Espace 1</Link>
        </li>
        <li>
          <Link to="/spaces/2">Espace 2</Link>
        </li>
      </ul>
    </div>
  );
};

export default UserSpaces;
