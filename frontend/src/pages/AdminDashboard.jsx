import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    return <h2>Loading dashboard...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!dashboard) {
    return <h2>No dashboard data available</h2>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <hr />

      <h2>Overview</h2>

      <div>
        <div>
          <h3>Total Users</h3>
          <p>{dashboard.users.total}</p>
        </div>

        <div>
          <h3>Total Products</h3>
          <p>{dashboard.products.total}</p>
        </div>

        <div>
          <h3>Total Categories</h3>
          <p>{dashboard.categories.total}</p>
        </div>

        <div>
          <h3>Total Orders</h3>
          <p>{dashboard.orders.total}</p>
        </div>
      </div>

      <hr />

      <h2>Orders</h2>

      <p>
        Pending: {dashboard.orders.pending}
      </p>

      <p>
        Confirmed: {dashboard.orders.confirmed}
      </p>

      <p>
        Shipped: {dashboard.orders.shipped}
      </p>

      <p>
        Delivered: {dashboard.orders.delivered}
      </p>

      <p>
        Cancelled: {dashboard.orders.cancelled}
      </p>

      <hr />

      <h2>Revenue</h2>

      <h3>
        ₹{dashboard.revenue}
      </h3>

      <hr />

      <h2>Low Stock Products</h2>

      {dashboard.products.lowStock === 0 ? (
        <p>No low-stock products.</p>
      ) : (
        <div>
          {dashboard.products.lowStockProducts.map((product) => (
            <div key={product.id}>
              <h3>{product.name}</h3>
              <p>Stock: {product.stock}</p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;