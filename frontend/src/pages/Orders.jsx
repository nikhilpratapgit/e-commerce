import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders");

      console.log("ORDERS RESPONSE:", response.data);

      setOrders(response.data.orders || []);
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

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="orders-page">
        <div className="orders-state">
          <h2>Loading orders...</h2>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-page">
        <div className="orders-state">
          <h2>{error}</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-header">
        <div>
          <h1>My Orders</h1>
          <p>View and track your orders.</p>
        </div>

        <Link to="/products" className="orders-shop-button">
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-orders-icon">📦</div>

          <h2>You have no orders yet</h2>

          <p>
            Your placed orders will appear here.
          </p>

          <Link to="/products" className="primary-button">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <p className="order-label">Order</p>

                  <h2>
                    #{order.orderNumber}
                  </h2>

                  <p className="order-date">
                    Ordered on{" "}
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`order-status status-${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-card-body">
                <section className="order-items-section">
                  <h3>Items</h3>

                  <div className="order-items">
                    {order.items?.map((item) => (
                      <div
                        className="order-item"
                        key={item.id}
                      >
                        <div className="order-item-info">
                          <h4>
                            {item.product?.name ||
                              "Product"}
                          </h4>

                          <p>
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <div className="order-item-pricing">
                          <span>
                            ₹{item.price} × {item.quantity}
                          </span>

                          <strong>
                            ₹{item.price * item.quantity}
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="order-address-section">
                  <h3>Shipping Address</h3>

                  {order.shippingAddress && (
                    <div className="order-address">
                      <strong>
                        {order.shippingAddress.fullName}
                      </strong>

                      <p>
                        {order.shippingAddress.phone}
                      </p>

                      <p>
                        {order.shippingAddress.address}
                      </p>

                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}
                      </p>

                      <p>
                        {order.shippingAddress.pincode},{" "}
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  )}
                </section>
              </div>

              <div className="order-card-footer">
                <div className="order-total">
                  <span>Total</span>
                  <strong>₹{order.totalAmount}</strong>
                </div>

                <Link
                  to={`/orders/${order.id}`}
                  className="order-details-button"
                >
                  View Details →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Orders;