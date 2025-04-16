import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import LoadingComponent from "../../atoms/LoadingAtoms";

const PublicRoutes = () => {
  const { userLoggedIn, loading } = useContext(AuthContext);

  if (loading !== false) {
    return <LoadingComponent loading={true}/>;
  }

  return userLoggedIn ? <Navigate to="/main" /> : <Outlet />;
};

export default PublicRoutes;
