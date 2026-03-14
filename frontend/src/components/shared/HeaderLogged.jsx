import { NavLink } from "react-router-dom";
import useAuthStore from "../../store/AuthStore";
import Logout from "./Logout";

import "../../styles/components/shared/HeaderLogged.css";

const HeaderLogged = () => {
  const role = useAuthStore((state) => state.role);

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/" end>
          Accueil
        </NavLink>
        {/* Liens visible uniquement pour admin */}
        {role === "user" && (
          <>
            <NavLink to="/spaces">Espaces</NavLink>

            <NavLink to="/my-reservations">Mes réservations</NavLink>

            <NavLink to="/profile">Profil</NavLink>
          </>
        )}

        {/* Liens visibles uniquement pour admin */}
        {role === "admin" && (
          <>
            <NavLink to="/admin">Admin Accueil</NavLink>

            <NavLink to="/admin/spaces">Gestion Spaces</NavLink>

            <NavLink to="/admin/users">Gestion Membres</NavLink>
          </>
        )}

        <Logout />
      </nav>
    </aside>
  );
};

export default HeaderLogged;
