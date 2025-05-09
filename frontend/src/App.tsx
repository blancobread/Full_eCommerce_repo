import { Routes, Route, Link } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { useAuthStore } from './store/auth';
import PrivateRoute from './components/PrivateRouter';
import 'keen-slider/keen-slider.min.css';
import HomePage from './pages/HomePage';

function Layout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = !!useAuthStore((state) => state.token);

  return (
    <div className="p-4">
      <nav className="mb-4 space-x-4">
        <Link to="/" className="text-blue-500">
          Home
        </Link>
        {!isAuthenticated && (
          <Link to="/admin/login" className="text-blue-500">
            Admin Login
          </Link>
        )}
        {isAuthenticated && (
          <Link to="/admin/dashboard" className="text-blue-500">
            Admin Dashboard
          </Link>
        )}
      </nav>
      <main>{children}</main>
    </div>
  );
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomePage />
              {/* <OrderForm /> */}
            </>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
