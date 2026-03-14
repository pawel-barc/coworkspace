import { Outlet } from "react-router-dom";
import HeaderLogged from "../components/shared/HeaderLogged";
const AdminLayout = () => {
  return (
    <>
      <div className="admin-layout">
        <HeaderLogged />
        <header>
          <h1>Admin Panel</h1>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
