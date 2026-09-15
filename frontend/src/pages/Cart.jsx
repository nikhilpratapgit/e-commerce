import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    return (
      <main className="cart-page">
        <div className="cart-state">
          <h2>Loading cart...</h2>
        </div>
      </main>
    );
  }

  if (error && !cart) {
    return (
      <main className="cart-page">
        <div className="cart-state">
          <h2>{error}</h2>
        </div>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="cart-page">

        <div className="cart-header">
          <h1>Your Cart</h1>
          <p>Review your items before checkout.</p>
        </div>

        {error && (
          <p className="cart-error">
            {error}
          </p>
        )}

        <div className="empty-cart">
          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>Your cart is empty</h2>

          <p>
            Looks like you haven't added anything to
            your cart yet.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>

      </main>
    );
  }

  const totalAmount = cart.items.reduce(
    (total, item) => {
      return total + item.product.price * item.quantity;
    },
    0
  );

  return (
    <main className="cart-page">

      <div className="cart-header">
        <h1>Your Cart</h1>
        <p>
          {cart.items.length}{" "}
          {cart.items.length === 1 ? "item" : "items"}{" "}
          in your cart.
        </p>
      </div>

      {error && (
        <p className="cart-error">
          {error}
        </p>
      )}

      <div className="cart-layout">

        {/* Cart Items */}
        <section className="cart-items">

          {cart.items.map((item) => (
            <article
              className="cart-item"
              key={item.id}
            >

              <div className="cart-item-image">
                {item.product.images?.length > 0 ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </div>

              <div className="cart-item-content">

                <div className="cart-item-main">

                  <h2>
                    {item.product.name}
                  </h2>

                  <p className="cart-item-price">
                    ₹{item.product.price}
                  </p>

                  <p className="cart-item-stock">
                    {item.product.stock > 0
                      ? `${item.product.stock} available`
                      : "Out of stock"}
                  </p>

                </div>

                <div className="cart-item-bottom">

                  <div className="quantity-control">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity + 1
                        )
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>

                  </div>

                  <div className="cart-item-subtotal">
                    <span>Subtotal</span>

                    <strong>
                      ₹{item.product.price * item.quantity}
                    </strong>
                  </div>

                  <button
                    className="remove-item-button"
                    onClick={() =>
                      removeItem(item.product.id)
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>

            </article>
          ))}

          <div className="cart-actions">

            <button
              type="button"
              className="continue-shopping"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>


            <button
              className="clear-cart-button"
              onClick={clearCart}
            >
              Clear Cart
            </button>

          </div>

        </section>

        {/* Order Summary */}
        <aside className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>
            <span>{cart.items.length}</span>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalAmount}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>Free</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{totalAmount}</strong>
          </div>

          <Link
            to="/checkout"
            className="checkout-button"
          >
            Proceed to Checkout
          </Link>

        </aside>

      </div>

    </main>
  );
}

export default Cart;

