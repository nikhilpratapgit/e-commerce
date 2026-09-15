import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/dashboard");

        setDashboard(response.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
          "Failed to fetch dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-state">
          <h2>Loading dashboard...</h2>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-page">
        <div className="admin-state">
          <h2>{error}</h2>
        </div>
      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="admin-page">
        <div className="admin-state">
          <h2>No dashboard data available</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <span className="admin-badge">ADMIN PANEL</span>

          <h1>Admin Dashboard</h1>

          <p>
            Monitor your marketplace and manage your
            business overview.
          </p>
        </div>
        <button
          type="button"
          className="admin-add-product-button"
          onClick={() => navigate("/admin/products/add")}
        >
           Add Product
        </button>
      </div>

      <section className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">👥</div>

          <div>
            <p>Total Users</p>
            <h2>{dashboard.users.total}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">📦</div>

          <div>
            <p>Total Products</p>
            <h2>{dashboard.products.total}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">🏷️</div>

          <div>
            <p>Total Categories</p>
            <h2>{dashboard.categories.total}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">🛒</div>

          <div>
            <p>Total Orders</p>
            <h2>{dashboard.orders.total}</h2>
          </div>
        </div>
      </section>

      <div className="admin-grid">
        <section className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>Order Overview</h2>
              <p>Current order status breakdown.</p>
            </div>

            <span className="admin-card-icon">📊</span>
          </div>

          <div className="order-stats">
            <div className="order-stat">
              <span className="order-stat-dot pending" />
              <div>
                <p>Pending</p>
                <strong>{dashboard.orders.pending}</strong>
              </div>
            </div>

            <div className="order-stat">
              <span className="order-stat-dot confirmed" />
              <div>
                <p>Confirmed</p>
                <strong>{dashboard.orders.confirmed}</strong>
              </div>
            </div>

            <div className="order-stat">
              <span className="order-stat-dot shipped" />
              <div>
                <p>Shipped</p>
                <strong>{dashboard.orders.shipped}</strong>
              </div>
            </div>

            <div className="order-stat">
              <span className="order-stat-dot delivered" />
              <div>
                <p>Delivered</p>
                <strong>{dashboard.orders.delivered}</strong>
              </div>
            </div>

            <div className="order-stat">
              <span className="order-stat-dot cancelled" />
              <div>
                <p>Cancelled</p>
                <strong>{dashboard.orders.cancelled}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="admin-card revenue-card">
          <div className="admin-card-header">
            <div>
              <h2>Total Revenue</h2>
              <p>Revenue generated from orders.</p>
            </div>

            <span className="admin-card-icon">₹</span>
          </div>

          <div className="revenue-value">
            ₹{dashboard.revenue}
          </div>

          <p className="revenue-note">
            Based on completed marketplace orders.
          </p>
        </section>
      </div>

      <section className="admin-card low-stock-card">
        <div className="admin-card-header">
          <div>
            <h2>Low Stock Products</h2>
            <p>
              Products that may need inventory
              attention.
            </p>
          </div>

          <span className="admin-card-icon">⚠️</span>
        </div>

        {dashboard.products.lowStock === 0 ? (
          <div className="no-low-stock">
            <span>✓</span>

            <div>
              <strong>Inventory looks good</strong>
              <p>No low-stock products right now.</p>
            </div>
          </div>
        ) : (
          <div className="low-stock-list">
            {dashboard.products.lowStockProducts.map(
              (product) => (
                <div
                  className="low-stock-item"
                  key={product.id}
                >
                  <div>
                    <h3>{product.name}</h3>
                    <p>Product inventory</p>
                  </div>

                  <span className="stock-warning">
                    {product.stock} left
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;