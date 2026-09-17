import { useEffect, useState } from "react";
import api from "../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/allOrders");

        setOrders(response.data.orders);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
          "Failed to fetch orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  if (loading) {
    return (
      <main className="admin-orders-page">
        <div className="orders-state">
          <h2>Loading orders...</h2>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-orders-page">
        <div className="orders-state">
          <h2>{error}</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-orders-page">
      <header className="admin-orders-header">
        <span className="admin-orders-eyebrow">
          ADMINISTRATION
        </span>

        <h1>All Orders</h1>

        <p>
          View and manage orders placed by all customers.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="orders-state">
          <h2>No orders found</h2>
          <p>There are currently no customer orders.</p>
        </div>
      ) : (
        <div className="admin-orders-list">
          {orders.map((order) => (
            <div className="admin-order-card" key={order.id}>

              {/* Order Header */}
              <div className="admin-order-header">
                <div>
                  <span className="order-label">
                    Order
                  </span>

                  <h2>{order.orderNumber}</h2>
                </div>

                <span className="order-status">
                  {order.status}
                </span>
              </div>

              {/* Customer Information */}
              <div className="admin-order-section">
                <h3>Customer Information</h3>

                <div className="order-info-grid">
                  <div>
                    <span>Name</span>
                    <strong>{order.user?.name}</strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>{order.user?.email}</strong>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="admin-order-section">
                <h3>Shipping Address</h3>

                <div className="shipping-address">
                  <strong>
                    {order.shippingAddress?.fullName}
                  </strong>

                  <p>
                    {order.shippingAddress?.address}
                  </p>

                  <p>
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.state}{" "}
                    {order.shippingAddress?.pincode}
                  </p>

                  <p>
                    {order.shippingAddress?.country}
                  </p>

                  <p>
                    Phone: {order.shippingAddress?.phone}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div className="admin-order-section">
                <h3>Products</h3>

                <div className="admin-order-items">
                  {order.items?.map((item) => (
                    <div
                      className="admin-order-item"
                      key={item.id}
                    >
                      <div>
                        <strong>
                          {item.product?.name}
                        </strong>

                        <span>
                          Quantity: {item.quantity}
                        </span>
                      </div>

                      <div>
                        ₹{item.price} × {item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="admin-order-total">
                <span>Total Amount</span>

                <strong>
                  ₹{order.totalAmount}
                </strong>
              </div>

            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default AdminOrders;