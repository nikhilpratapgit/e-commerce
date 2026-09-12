import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [editingReviewId, setEditingReviewId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/products/${id}`);

        setProduct(response.data.product);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
          "Failed to fetch product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);

      const response = await api.get(
        `/products/${id}/reviews`
      );

      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to fetch reviews"
      );
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // Add to cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      setMessage("");
      setError("");

      const response = await api.post("/cart/items", {
        productId: product.id,
        quantity: 1
      });

      setMessage(
        response.data.message ||
        "Product added to cart"
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to add product to cart"
      );
    } finally {
      setAddingToCart(false);
    }
  };

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setMessage("");
      setError("");

      if (editingReviewId) {
        const response = await api.put(
          `/products/${id}/reviews/${editingReviewId}`,
          {
            rating,
            comment
          }
        );

        setMessage(
          response.data.message ||
          "Review updated successfully"
        );
      } else {
        const response = await api.post(
          `/products/${id}/reviews`,
          {
            rating,
            comment
          }
        );

        setMessage(
          response.data.message ||
          "Review added successfully"
        );
      }

      setRating(5);
      setComment("");
      setEditingReviewId(null);

      await fetchReviews();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to submit review"
      );
    }
  };

  // Edit review
  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setRating(review.rating);
    setComment(review.comment || "");

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setRating(5);
    setComment("");
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await api.delete(
        `/products/${id}/reviews/${reviewId}`
      );

      setMessage(
        response.data.message ||
        "Review deleted successfully"
      );

      await fetchReviews();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to delete review"
      );
    }
  };

  if (loading) {
    return (
      <main className="product-details-page">
        <h2>Loading product...</h2>
      </main>
    );
  }

  if (error && !product) {
    return (
      <main className="product-details-page">
        <h2>{error}</h2>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-details-page">
        <h2>Product not found</h2>
      </main>
    );
  }

  return (
    <main className="product-details-page">

      <Link
        to="/products"
        className="back-link"
      >
        ← Back to Products
      </Link>

      {/* Product section */}
      <section className="product-details-card">

        <div className="product-details-image">
          {product.images?.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
            />
          ) : (
            <span>No Image Available</span>
          )}
        </div>

        <div className="product-details-info">

          <p className="product-category-label">
            Product
          </p>

          <h1>{product.name}</h1>

          <div className="details-rating">
            <span>★</span>

            <strong>
              {product.ratingAverage?.toFixed(1) || "0.0"}
            </strong>

            <span>
              ({product.ratingCount || 0} reviews)
            </span>
          </div>

          <p className="details-description">
            {product.description}
          </p>

          <div className="details-price">
            ₹{product.price}
          </div>

          <p
            className={
              product.stock > 0
                ? "details-stock available"
                : "details-stock unavailable"
            }
          >
            {product.stock > 0
              ? `${product.stock} items available`
              : "Out of Stock"}
          </p>

          <div className="details-actions">

            <button
              className="add-cart-button"
              onClick={handleAddToCart}
              disabled={
                product.stock === 0 ||
                addingToCart
              }
            >
              {product.stock === 0
                ? "Out of Stock"
                : addingToCart
                ? "Adding..."
                : "Add to Cart"}
            </button>

            <Link
              to="/cart"
              className="cart-link-button"
            >
              Go to Cart
            </Link>

          </div>

          {message && (
            <p className="success-message">
              {message}
            </p>
          )}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

        </div>
      </section>

      {/* Reviews */}
      <section className="reviews-section">

        <div className="reviews-header">
          <div>
            <h2>Customer Reviews</h2>

            <p>
              See what other customers think about this
              product.
            </p>
          </div>

          <div className="reviews-summary">
            <strong>
              ★ {product.ratingAverage?.toFixed(1) || "0.0"}
            </strong>

            <span>
              {product.ratingCount || 0} reviews
            </span>
          </div>
        </div>

        {reviewsLoading ? (
          <div className="review-state">
            <p>Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="review-state">
            <h3>No reviews yet</h3>
            <p>
              Be the first person to review this product.
            </p>
          </div>
        ) : (
          <div className="reviews-list">

            {reviews.map((review) => (
              <article
                className="review-card"
                key={review.id}
              >

                <div className="review-top">

                  <div className="review-user">
                    <div className="review-avatar">
                      {(
                        review.user?.name ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h3>
                        {review.user?.name || "User"}
                      </h3>

                      <p>
                        {new Date(
                          review.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="review-rating">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>

                </div>

                <p className="review-comment">
                  {review.comment || "No comment"}
                </p>

                {isAuthenticated &&
                  review.userId === user?.id && (
                    <div className="review-actions">

                      <button
                        className="edit-review-button"
                        onClick={() =>
                          handleEditReview(review)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-review-button"
                        onClick={() =>
                          handleDeleteReview(review.id)
                        }
                      >
                        Delete
                      </button>

                    </div>
                  )}

              </article>
            ))}

          </div>
        )}

        {/* Review form */}
        <div className="review-form-card">

          {isAuthenticated ? (
            <>
              <h2>
                {editingReviewId
                  ? "Edit Your Review"
                  : "Write a Review"}
              </h2>

              <p>
                Share your experience with this product.
              </p>

              <form onSubmit={handleSubmitReview}>

                <div className="review-form-field">

                  <label>Rating</label>

                  <select
                    value={rating}
                    onChange={(e) =>
                      setRating(Number(e.target.value))
                    }
                  >
                    <option value={5}>
                      5 - Excellent
                    </option>

                    <option value={4}>
                      4 - Good
                    </option>

                    <option value={3}>
                      3 - Average
                    </option>

                    <option value={2}>
                      2 - Poor
                    </option>

                    <option value={1}>
                      1 - Very Poor
                    </option>
                  </select>

                </div>

                <div className="review-form-field">

                  <label>Comment</label>

                  <textarea
                    value={comment}
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                    placeholder="Write your review..."
                    rows="5"
                  />

                </div>

                <div className="review-form-actions">

                  <button type="submit">
                    {editingReviewId
                      ? "Update Review"
                      : "Submit Review"}
                  </button>

                  {editingReviewId && (
                    <button
                      type="button"
                      className="cancel-review-button"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  )}

                </div>

              </form>
            </>
          ) : (
            <div className="login-review">

              <h2>Want to review this product?</h2>

              <p>
                Login to share your experience.
              </p>

              <Link
                to="/login"
                className="primary-button"
              >
                Login to Review
              </Link>

            </div>
          )}

        </div>

      </section>

    </main>
  );
}

export default ProductDetails;