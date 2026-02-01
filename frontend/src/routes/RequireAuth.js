import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = () => {
  const { auth, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;