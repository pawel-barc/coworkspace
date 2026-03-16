import { Outlet } from "react-router-dom";
import HeaderLogged from "../components/shared/HeaderLogged";
import "../styles/layout/Layout.css";

const AdminLayout = () => {
  return (
    <div className="layout-container">
      <HeaderLogged />

      <main className="main-content">
        <header style={{ padding: "2rem", color: "white" }}></header>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
