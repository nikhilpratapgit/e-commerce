import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Checkout() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/orders", {
        shippingAddress: formData
      });

      console.log("ORDER RESPONSE:", response.data);

      navigate("/orders");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="checkout-page">

      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>
          Enter your shipping details to place your order.
        </p>
      </div>

      {error && (
        <div className="checkout-error">
          {error}
        </div>
      )}

      <div className="checkout-layout">

        <section className="checkout-card">

          <h2>Shipping Information</h2>

          <form onSubmit={handleSubmit}>

            <div className="checkout-form-grid">

              <div className="checkout-field">
                <label>Full Name</label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="checkout-field">
                <label>Phone</label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="checkout-field checkout-full-width">
                <label>Address</label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  rows="4"
                  required
                />
              </div>

              <div className="checkout-field">
                <label>City</label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  required
                />
              </div>

              <div className="checkout-field">
                <label>State</label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter your state"
                  required
                />
              </div>

              <div className="checkout-field">
                <label>Pincode</label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  required
                />
              </div>

              <div className="checkout-field">
                <label>Country</label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="checkout-form-actions">

              <button
                type="submit"
                className="place-order-button"
                disabled={loading}
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </div>

          </form>

        </section>

        <aside className="checkout-info-card">

          <div className="checkout-info-icon">
            📦
          </div>

          <h2>Ready to order?</h2>

          <p>
            Make sure your shipping information is correct
            before placing your order.
          </p>

          <div className="checkout-info-list">
            <div>
              <span>✓</span>
              Secure order placement
            </div>

            <div>
              <span>✓</span>
              Easy order tracking
            </div>

            <div>
              <span>✓</span>
              Manage orders from your account
            </div>
          </div>

        </aside>

      </div>

    </main>
  );
}

export default Checkout;
