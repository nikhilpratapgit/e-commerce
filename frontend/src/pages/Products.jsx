import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minRating, setMinRating] = useState("");

    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("desc");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/categories");

                setCategories(response.data.categories);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategories();
    }, []);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/products", {
                    params: {
                        search,
                        categoryId,
                        minPrice,
                        maxPrice,
                        minRating,
                        sortBy,
                        order,
                        page,
                        limit: 6
                    }
                });

                setProducts(response.data.products);

                setTotalPages(
                    response.data.pagination.totalPages
                );
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to fetch products"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [
        search,
        categoryId,
        minPrice,
        maxPrice,
        minRating,
        sortBy,
        order,
        page
    ]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [
        search,
        categoryId,
        minPrice,
        maxPrice,
        minRating,
        sortBy,
        order
    ]);

    if (loading) {
        return <h2>Loading products...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>
            <h1>Products</h1>

            {/* Search */}
            <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Category */}
            <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
            >
                <option value="">All Categories</option>

                {categories.map((category) => (
                    <option
                        key={category.id}
                        value={category.id}
                    >
                        {category.name}
                    </option>
                ))}
            </select>

            {/* Minimum Price */}
            <input
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
            />

            {/* Maximum Price */}
            <input
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
            />

            {/* Minimum Rating */}
            <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
            >
                <option value="">Any Rating</option>
                <option value="1">1★ & above</option>
                <option value="2">2★ & above</option>
                <option value="3">3★ & above</option>
                <option value="4">4★ & above</option>
                <option value="5">5★</option>
            </select>

            {/* Sorting */}
            <select
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                    const [newSortBy, newOrder] =
                        e.target.value.split("-");

                    setSortBy(newSortBy);
                    setOrder(newOrder);
                }}
            >
                <option value="createdAt-desc">
                    Newest
                </option>

                <option value="createdAt-asc">
                    Oldest
                </option>

                <option value="price-asc">
                    Price: Low to High
                </option>

                <option value="price-desc">
                    Price: High to Low
                </option>

                <option value="ratingAverage-desc">
                    Rating: High to Low
                </option>

                <option value="ratingAverage-asc">
                    Rating: Low to High
                </option>

                <option value="name-asc">
                    Name: A to Z
                </option>

                <option value="name-desc">
                    Name: Z to A
                </option>
            </select>

            {/* Products */}
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div>
                    {products.map((product) => (
                        <div key={product.id}>
                            <h2>{product.name}</h2>

                            <p>{product.description}</p>

                            <p>₹{product.price}</p>

                            <p>Stock: {product.stock}</p>

                            <p>
                                Rating: {product.ratingAverage} (
                                {product.ratingCount} reviews)
                            </p>

                            <Link to={`/products/${product.id}`}>
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div>
                    <button
                        onClick={() =>
                            setPage((prev) => prev - 1)
                        }
                        disabled={page === 1}
                    >
                        Previous
                    </button>

                    <span>
                        Page {page} of {totalPages}
                    </span>

                    <button
                        onClick={() =>
                            setPage((prev) => prev + 1)
                        }
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default Products;
