import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import LoadingComponent from "../../atoms/LoadingAtoms";

const PrivateRoutes = () => {
  const { userLoggedIn, loading } = useContext(AuthContext);

  if (loading !== false) {
    return <LoadingComponent loading={true}/>;
  }

  return userLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
