import logoutUser from "../../api/shared/logoutApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../store/AuthStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
// Après avoir cliqué sur le boutton Déconnexion, fonction Logout met à jour l'etat isAuthenticated( stocké dans auth-storage) à false
// Envoie une requête pour supprimer les cookies, puis l'utilisateur est informé et redirigé vers la page non protégée 'Home'
const Logout = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // handleLogout vérifie la réponse du backend.
  const handleLogout = async () => {
    try {
      const response = await logoutUser(); // POST /logout

      if (response.success) {
        logout(); // zustand
        toast.success("Logged out successfully");
        navigate("/login");
      } else {
        toast.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout error");
    }
  };

  return (
    <button
      onClick={handleLogout}
      aria-label="Logout"
      title="Logout"
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "#7BB493",
        fontSize: "40px",
        marginTop: "20px",
        textAlign: "left",
      }}
    >
      <FontAwesomeIcon icon={faRightFromBracket} size="xl" />
    </button>
  );
};

export default Logout;
