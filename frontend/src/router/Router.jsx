import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";

import Register from "../pages/user/Register";
import Login from "../pages/shared/Login";
import UserDashboard from "../pages/user/UserDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Profile from "../pages/shared/Profile";
import UserSpaces from "../pages/user/UserSpaces";
import SpaceDetail from "../pages/user/SpaceDetail";
import MyReservations from "../pages/user/MyReservations";
import Logout from "../components/shared/Logout";
import AdminSpaces from "../pages/admin/AdminSpaces";
import AdminUsers from "../pages/admin/AdminUsers";
import PublicLayout from "../layout/PublicLayout";
import PrivateLayout from "../layout/PrivateLayout";
import AdminLayout from "../layout/AdminLayout";
import AdminEditSpace from "../pages/admin/AdminEditSpace";
import AdminSpaceFull from "../pages/admin/AdminSpaceFull";
import AdminCreateSpace from "../pages/admin/AdminCreateSpace";
import AdminReservations from "../pages/admin/AdminReservations";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuthStore();
  if (!isAuthenticated) return children;

  if (role === "admin") return <Navigate to="/admin" replace />;
  return <Navigate to="/" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (role !== "admin") return <Navigate to="/" replace />;

  return children;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route
          element={
            <PublicRoute>
              <PublicLayout />
            </PublicRoute>
          }
        >
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* PRIVATE */}
        <Route
          element={
            <PrivateRoute>
              <PrivateLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<UserDashboard />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/spaces" element={<UserSpaces />} />
          <Route path="/spaces/:id" element={<SpaceDetail />} />

          <Route path="/my-reservations" element={<MyReservations />} />

          <Route path="/logout" element={<Logout />} />
        </Route>

        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/admin/spaces" element={<AdminSpaces />} />

          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/spaces/create" element={<AdminCreateSpace />} />
          <Route path="/admin/spaces/:id/edit" element={<AdminEditSpace />} />
          <Route path="/admin/spaces/:id/full" element={<AdminSpaceFull />} />
          <Route path="/admin/reservations" element={<AdminReservations />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
