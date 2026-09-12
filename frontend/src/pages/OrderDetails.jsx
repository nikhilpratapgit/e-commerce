import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/orders/${id}`);

        setOrder(response.data.order);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
          "Failed to fetch order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      setError("");

      const response = await api.patch(
        `/orders/${id}/cancel`
      );

      setOrder(response.data.order);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to cancel order"
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <main className="order-details-page">
        <div className="order-details-state">
          <h2>Loading order...</h2>
        </div>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="order-details-page">
        <div className="order-details-state">
          <h2>{error}</h2>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="order-details-page">
        <div className="order-details-state">
          <h2>Order not found</h2>
        </div>
      </main>
    );
  }

  const canCancel =
    order.status === "PENDING" ||
    order.status === "CONFIRMED";

  return (
    <main className="order-details-page">
      <Link to="/orders" className="order-back-link">
        ← Back to My Orders
      </Link>

      <div className="order-details-header">
        <div>
          <p className="order-label">Order Details</p>

          <h1>
            #{order.orderNumber}
          </h1>

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

      {error && (
        <div className="order-details-error">
          {error}
        </div>
      )}

      <div className="order-details-layout">
        <section className="order-details-main">
          <div className="order-details-card">
            <h2>Order Items</h2>

            <div className="order-details-items">
              {order.items?.map((item) => (
                <div
                  className="order-details-item"
                  key={item.id}
                >
                  <div>
                    <h3>
                      {item.product?.name ||
                        "Product"}
                    </h3>

                    <p>
                      Quantity: {item.quantity}
                    </p>

                    <p>
                      Price: ₹{item.price}
                    </p>
                  </div>

                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>
                </div>
              ))}
            </div>

            <div className="order-details-total">
              <span>Total</span>

              <strong>
                ₹{order.totalAmount}
              </strong>
            </div>
          </div>

          <div className="order-details-card">
            <h2>Shipping Address</h2>

            <div className="shipping-address">
              <strong>
                {order.shippingAddress?.fullName}
              </strong>

              <p>
                {order.shippingAddress?.phone}
              </p>

              <p>
                {order.shippingAddress?.address}
              </p>

              <p>
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.state}
              </p>

              <p>
                {order.shippingAddress?.pincode},{" "}
                {order.shippingAddress?.country}
              </p>
            </div>
          </div>
        </section>

        <aside className="order-details-sidebar">
          <div className="order-details-card">
            <h2>Order Status</h2>

            <div className="status-timeline">
              <div
                className={`timeline-item ${
                  order.status !== "CANCELLED"
                    ? "completed"
                    : ""
                }`}
              >
                <span className="timeline-dot" />
                <div>
                  <strong>Order Placed</strong>
                  <p>Your order has been placed.</p>
                </div>
              </div>

              {order.status !== "CANCELLED" && (
                <>
                  <div
                    className={`timeline-item ${
                      [
                        "CONFIRMED",
                        "SHIPPED",
                        "DELIVERED"
                      ].includes(order.status)
                        ? "completed"
                        : ""
                    }`}
                  >
                    <span className="timeline-dot" />
                    <div>
                      <strong>Confirmed</strong>
                      <p>Your order is confirmed.</p>
                    </div>
                  </div>

                  <div
                    className={`timeline-item ${
                      [
                        "SHIPPED",
                        "DELIVERED"
                      ].includes(order.status)
                        ? "completed"
                        : ""
                    }`}
                  >
                    <span className="timeline-dot" />
                    <div>
                      <strong>Shipped</strong>
                      <p>Your order is on its way.</p>
                    </div>
                  </div>

                  <div
                    className={`timeline-item ${
                      order.status === "DELIVERED"
                        ? "completed"
                        : ""
                    }`}
                  >
                    <span className="timeline-dot" />
                    <div>
                      <strong>Delivered</strong>
                      <p>Your order has been delivered.</p>
                    </div>
                  </div>
                </>
              )}

              {order.status === "CANCELLED" && (
                <div className="timeline-item cancelled">
                  <span className="timeline-dot" />

                  <div>
                    <strong>Cancelled</strong>
                    <p>Your order was cancelled.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {canCancel && (
            <div className="cancel-order-card">
              <h3>Cancel Order</h3>

              <p>
                You can cancel this order while it is
                pending or confirmed.
              </p>

              <button
                className="cancel-order-button"
                onClick={handleCancelOrder}
                disabled={cancelling}
              >
                {cancelling
                  ? "Cancelling..."
                  : "Cancel Order"}
              </button>
            </div>
          )}

          {order.status === "CANCELLED" && (
            <div className="cancelled-message">
              <strong>Order cancelled</strong>
              <p>
                This order has been cancelled
                successfully.
              </p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

export default OrderDetails;