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
        // Update review
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
        // Create review
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

      // Reset form
      setRating(5);
      setComment("");
      setEditingReviewId(null);

      // Reload reviews
      await fetchReviews();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to submit review"
      );
    }
  };

  // Start editing review
  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setRating(review.rating);
    setComment(review.comment || "");

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  };

  // Cancel editing
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
    return <h2>Loading product...</h2>;
  }

  if (error && !product) {
    return <h2>{error}</h2>;
  }

  if (!product) {
    return <h2>Product not found</h2>;
  }

  return (
    <div>
      {/* Product Details */}
      <Link to="/products">
        ← Back to Products
      </Link>

      <h1>{product.name}</h1>

      <p>{product.description}</p>

      <p>
        Price: ₹{product.price}
      </p>

      <p>
        Stock: {product.stock}
      </p>

      <p>
        Rating: {product.ratingAverage?.toFixed(1) || "0.0"} / 5
        {" "}
        ({product.ratingCount || 0} reviews)
      </p>

      <button
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

      {" "}

      <Link to="/cart">
        Go to Cart
      </Link>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <hr />

      {/* Reviews */}
      <h2>Customer Reviews</h2>

      {reviewsLoading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id}>
            <h3>
              {review.user?.name || "User"}
            </h3>

            <p>
              Rating: {review.rating} / 5
            </p>

            <p>
              {review.comment || "No comment"}
            </p>

            <p>
              {new Date(
                review.createdAt
              ).toLocaleDateString()}
            </p>

            {/* Only show edit/delete for current user's review */}
            {isAuthenticated &&
              review.userId === user?.id && (
                <div>
                  <button
                    onClick={() =>
                      handleEditReview(review)
                    }
                  >
                    Edit
                  </button>

                  {" "}

                  <button
                    onClick={() =>
                      handleDeleteReview(review.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              )}

            <hr />
          </div>
        ))
      )}

      {/* Add/Edit Review */}
      {isAuthenticated ? (
        <div>
          <h2>
            {editingReviewId
              ? "Edit Your Review"
              : "Write a Review"}
          </h2>

          <form onSubmit={handleSubmitReview}>
            <div>
              <label>Rating</label>

              <select
                value={rating}
                onChange={(e) =>
                  setRating(Number(e.target.value))
                }
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Average</option>
                <option value={2}>2 - Poor</option>
                <option value={1}>1 - Very Poor</option>
              </select>
            </div>

            <br />

            <div>
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

            <br />

            <button type="submit">
              {editingReviewId
                ? "Update Review"
                : "Submit Review"}
            </button>

            {editingReviewId && (
              <>
                {" "}

                <button
                  type="button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </>
            )}
          </form>
        </div>
      ) : (
        <p>
          Please{" "}
          <Link to="/login">login</Link>{" "}
          to write a review.
        </p>
      )}
    </div>
  );
}

export default ProductDetails;