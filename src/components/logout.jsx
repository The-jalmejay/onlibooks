import { useNavigate } from "react-router-dom";
import auth from "./authservice";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    auth.removeToken();
    // Optional: Notify other components that user has logged out
    window.dispatchEvent(new Event("userChanged"));
    navigate("/");
  }, [navigate]);

  return null;
}

export default Logout;
