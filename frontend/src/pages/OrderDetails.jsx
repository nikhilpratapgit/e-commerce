import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

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
    return <h2>Loading order...</h2>;
  }

  if (error && !order) {
    return <h2>{error}</h2>;
  }

  if (!order) {
    return <h2>Order not found</h2>;
  }

  const canCancel =
    order.status === "PENDING" ||
    order.status === "CONFIRMED";

  return (
    <div>
      <Link to="/orders">
        ← Back to My Orders
      </Link>

      <h1>
        Order #{order.orderNumber}
      </h1>

      {error && <p>{error}</p>}

      <p>
        Status: {order.status}
      </p>

      <p>
        Ordered on:{" "}
        {new Date(order.createdAt).toLocaleDateString()}
      </p>

      <hr />

      <h2>Items</h2>

      {order.items?.map((item) => (
        <div key={item.id}>
          <h3>
            {item.product?.name || "Product"}
          </h3>

          <p>
            Quantity: {item.quantity}
          </p>

          <p>
            Price: ₹{item.price}
          </p>

          <p>
            Subtotal: ₹
            {item.price * item.quantity}
          </p>

          <hr />
        </div>
      ))}

      <h2>
        Total: ₹{order.totalAmount}
      </h2>

      <hr />

      <h2>Shipping Address</h2>

      <p>
        {order.shippingAddress?.fullName}
      </p>

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

      <hr />

      {canCancel && (
        <button
          onClick={handleCancelOrder}
          disabled={cancelling}
        >
          {cancelling
            ? "Cancelling..."
            : "Cancel Order"}
        </button>
      )}

      {order.status === "CANCELLED" && (
        <p>Order cancelled successfully.</p>
      )}
    </div>
  );
}

export default OrderDetails;