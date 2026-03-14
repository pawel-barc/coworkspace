import { Outlet } from "react-router-dom";
import HeaderLogged from "../components/shared/HeaderLogged";

const PrivateLayout = () => {
  return (
    <div className="layout-container">
      <HeaderLogged />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;
