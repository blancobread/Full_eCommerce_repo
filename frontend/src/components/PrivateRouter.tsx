import { Navigate } from 'react-router-dom';
import { JSX } from 'react';
import { useAuthStore } from '../store/auth';

interface Props {
  children: JSX.Element;
}

function PrivateRoute({ children }: Props) {
  const isAuthenticated = !!useAuthStore((state) => state.token);
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

export default PrivateRoute;
