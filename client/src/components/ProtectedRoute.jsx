import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = () => {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth", { withCredentials: true })
      .then((response) => {
        setAuth(response.data.success);
      })
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return <p>Loading...</p>;
  return auth ? <Outlet /> : <Navigate to="/" replace />;
};
export default ProtectedRoute;
