import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Marketplace
        </Link>

        <div className="navbar-links">
          <Link to="/products">Products</Link>

          {isAuthenticated && (
            <>
              <Link to="/profile">Profile</Link>
            </>
          )}

          {user?.role === "USER" && (
            <>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
            <Link to="/admin/dashboard">
              Admin Dashboard
            </Link>
            <Link to="/admin/orders">
              All orders
            </Link>
            </>
          )}

          {!isAuthenticated ? (
            <>
              <Link to="/login">Login</Link>

              <Link
                to="/register"
                className="navbar-register"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="navbar-user">
                Hello, {user.name}
              </span>

              <button
                className="navbar-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;