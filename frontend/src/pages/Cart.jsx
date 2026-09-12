import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setError("");

      const response = await api.get("/cart");

      setCart(response.data.cart);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to fetch cart"
      );
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);

      await fetchCart();

      setLoading(false);
    };

    loadCart();
  }, []);

  const updateQuantity = async (productId, quantity) => {
    try {
      setError("");

      await api.put(
        `/cart/items/${productId}`,
        {
          quantity
        }
      );

      await fetchCart();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to update quantity"
      );
    }
  };

  const removeItem = async (productId) => {
    try {
      setError("");

      await api.delete(
        `/cart/items/${productId}`
      );

      await fetchCart();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to remove item"
      );
    }
  };

  const clearCart = async () => {
    try {
      setError("");

      await api.delete("/cart");

      await fetchCart();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to clear cart"
      );
    }
  };

  if (loading) {
    return <h2>Loading cart...</h2>;
  }

  if (error && !cart) {
    return <h2>{error}</h2>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div>
        <h1>Your Cart</h1>

        {error && <p>{error}</p>}

        <p>Your cart is empty.</p>

        <Link to="/products">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const totalAmount = cart.items.reduce(
    (total, item) => {
      return total + item.product.price * item.quantity;
    },
    0
  );

  return (
    <div>
      <h1>Your Cart</h1>

      {error && <p>{error}</p>}

      {cart.items.map((item) => (
        <div key={item.id}>
          <h2>{item.product.name}</h2>

          <p>
            Price: ₹{item.product.price}
          </p>

          <p>
            Quantity: {item.quantity}
          </p>

          <button
            onClick={() =>
              updateQuantity(
                item.product.id,
                item.quantity - 1
              )
            }
            disabled={item.quantity <= 1}
          >
            -
          </button>

          <span> {item.quantity} </span>

          <button
            onClick={() =>
              updateQuantity(
                item.product.id,
                item.quantity + 1
              )
            }
          >
            +
          </button>

          <p>
            Subtotal: ₹
            {item.product.price * item.quantity}
          </p>

          <button
            onClick={() =>
              removeItem(item.product.id)
            }
          >
            Remove
          </button>

          <hr />
        </div>
      ))}

      <h2>Total: ₹{totalAmount}</h2>

      <button onClick={clearCart}>
        Clear Cart
      </button>

      <br />
      <br />

      <Link to="/checkout">
        Proceed to Checkout
      </Link>
    </div>
  );
}

export default Cart;