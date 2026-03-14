import { Outlet } from "react-router-dom";
import HeaderUnlogged from "../components/shared/HeaderUnlogged";
// import "../styles/layouts/PublicLayout.css";

const PublicLayout = () => {
  return (
    <div className="layout-container">
      <HeaderUnlogged />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
