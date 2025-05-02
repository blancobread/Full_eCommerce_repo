import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { JSX } from "react";

interface Props {
  children: JSX.Element;
}

function PrivateRoute({ children }: Props) {
  if (!isLoggedIn()) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

export default PrivateRoute;