import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, isLoggedIn }) {
  // If user is not logged in, redirect to home page
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // If user is logged in, render the children (the protected component)
  return children;
}

export default ProtectedRoute;
