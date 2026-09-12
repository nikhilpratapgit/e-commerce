import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">
            Welcome to Marketplace
          </span>

          <h1>
            Find products you'll
            <span> love.</span>
          </h1>

          <p>
            Discover great products, add them to your cart,
            and enjoy a simple shopping experience.
          </p>

          <div className="hero-actions">
            <Link
              to="/products"
              className="primary-button"
            >
              Shop Now
            </Link>

            <Link
              to="/register"
              className="secondary-button"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="feature-card">
          <div className="feature-icon">🛍️</div>
          <h3>Wide Selection</h3>
          <p>
            Explore products across different categories.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Secure Shopping</h3>
          <p>
            Your account and orders are securely managed.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📦</div>
          <h3>Easy Orders</h3>
          <p>
            Track your orders and manage them easily.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;