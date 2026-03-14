import { useParams } from "react-router-dom";
import AdminSpaceDetail from "../../components/admin/AdminSpaceDetail";

const AdminSpaceFull = () => {
  const { id } = useParams();
  return <AdminSpaceDetail spaceId={id} />;
};

export default AdminSpaceFull;
