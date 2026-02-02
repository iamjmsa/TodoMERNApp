import react, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, Navigate } from "react-router-dom";

const PublicRoute = () => {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth", { withCredentials: true })
      .then((response) => {
        setAuth(response.data.success);
      })
      .catch((error) => setAuth(error.response.data.success));
  }, []);

  return auth ? <Navigate to="/home" replace /> : <Outlet />;
};
export default PublicRoute;
