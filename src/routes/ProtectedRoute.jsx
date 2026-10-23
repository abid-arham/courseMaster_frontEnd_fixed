import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import { getMe } from "../services/auth.api";

export default function ProtectedRoute({ children }) {
  const token = getToken();
  // null = still verifying with the server
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    // the server is the only authority on whether the token is usable
    getMe()
      .then(() => {
        if (!cancelled) setIsValid(true);
      })
      .catch(() => {
        if (!cancelled) setIsValid(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  // no token at all: nothing to verify
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
