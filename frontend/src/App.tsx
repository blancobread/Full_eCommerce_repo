import { Routes, Route, Link } from "react-router-dom";
import GarlandList from "./pages/GarlandList";
import OrderForm from "./pages/OrderForm";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRouter";
import { isLoggedIn } from "./utils/auth";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/admin/login">Admin Login</Link>{" "}
        {isLoggedIn() && <>| <Link to="/admin/dashboard">Admin Dashboard</Link></>}
      </nav>

      <Routes>
        <Route path="/" element={
          <>
            <GarlandList />
            <OrderForm />
          </>
        } />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;