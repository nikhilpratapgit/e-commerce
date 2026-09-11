import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
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

  if (loading) {
    return <h2>Loading product...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!product) {
    return <h2>Product not found</h2>;
  }

  return (
    <div>
      <Link to="/products">← Back to Products</Link>

      <h1>{product.name}</h1>

      <p>{product.description}</p>

      <p>Price: ₹{product.price}</p>

      <p>Stock: {product.stock}</p>

      <p>
        Rating: {product.ratingAverage} (
        {product.ratingCount} reviews)
      </p>

      {product.images && product.images.length > 0 && (
        <div>
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={product.name}
              width="200"
            />
          ))}
        </div>
      )}

      <button disabled={product.stock === 0}>
        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}

export default ProductDetails;