import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { auth, loading } = useAuth();

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (auth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;