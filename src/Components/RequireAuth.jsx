import { Navigate, useLocation } from "react-router-dom";

/**
 * Gate a route on authentication and (optionally) role.
 *
 *   <RequireAuth><Dashboard /></RequireAuth>             // any logged-in user
 *   <RequireAuth roles={["admin"]}><RequestPage /></RequireAuth>
 *   <RequireAuth roles={["society", "admin"]}>...</RequireAuth>
 *
 * No token → bounce to /Login with ?from= so the user lands back here on
 * successful login. Wrong role → bounce to /Dashboard (avoids leaking which
 * routes exist).
 */
const RequireAuth = ({ roles, children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    const from = location.pathname + location.search;
    return <Navigate to={`/Login?from=${encodeURIComponent(from)}`} replace />;
  }

  if (roles && roles.length > 0) {
    const role = localStorage.getItem("role");
    if (!roles.includes(role)) {
      return <Navigate to="/Dashboard" replace />;
    }
  }

  return children;
};

export default RequireAuth;
