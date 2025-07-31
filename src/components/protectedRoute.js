import React, { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import authservice from "./authservice";

const ProtectedRoute = ({ children }) => {
  const [redirect, setRedirect] = useState(false);
  const hasRun = useRef(false); // prevents double alert

  useEffect(() => {
    if (hasRun.current) return; // skip if already run
    hasRun.current = true;      // mark as run

    const user = authservice.getUser();
    if (!user) {
      alert("Login First");
      setRedirect(true);
    }
  }, []);

  if (redirect) {
    return <Navigate to="/Login" replace />;
  }

  return children;
};

export default ProtectedRoute;
