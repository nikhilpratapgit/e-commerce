import { Link, useNavigate } from "react-router-dom";
import noImage from "../assets/no-image.png";
import api from "../services/api";

function ProductCard({ product }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const rating = product.ratingAverage
        ? product.ratingAverage.toFixed(1)
        : "0.0";

    const ratingCount = product.ratingCount || 0;

    const isInStock = product.stock > 0;
    const handleEdit = () => {
        console.log("Edit clicked", product.id);
        navigate(`/admin/products/edit/${product.id}`);
    };
    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/products/${product.id}`);

            alert("Product deleted successfully.");

            // Refresh the page for now
            window.location.reload();

        } catch (error) {
            console.error("Delete product error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete product."
            );
        }
    };
    return (
        <article className="product-card">

            {/* Image */}
            <Link
                to={`/products/${product.id}`}
                className="product-image-link"
            >
                <div className="product-image">

                    <img
                        src={
                            product.images?.length > 0
                                ? product.images[0]
                                : noImage
                        }
                        alt={product.name}
                        onError={(e) => {
                            e.currentTarget.src = noImage;
                        }}
                    />

                </div>
            </Link>

            {/* Content */}
            <div className="product-card-content">

                <Link to={`/products/${product.id}`}>
                    <h2 className="product-name">
                        {product.name}
                    </h2>
                </Link>

                <p className="product-description">
                    {product.description}
                </p>

                {/* Rating */}
                <div className="product-rating-row">

                    <span className="product-rating">
                        ★ {rating}
                    </span>

                    <span className="rating-count">
                        ({ratingCount})
                    </span>

                </div>

                {/* Price + Stock */}
                <div className="product-bottom">

                    <span className="product-price">
                        ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    <span
                        className={
                            isInStock
                                ? "product-stock"
                                : "product-stock out-of-stock"
                        }
                    >
                        {isInStock
                            ? `${product.stock} left`
                            : "Out of stock"}
                    </span>

                </div>

                {/* Button */}
                <Link
                    to={`/products/${product.id}`}
                    className="view-product-button"
                >
                    View Details
                </Link>
                {user?.role === "ADMIN" && (
                    <div className="product-update-button">
                        <button onClick={handleEdit}>Edit</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                )}

            </div>

        </article>
    );
}

export default ProductCard;