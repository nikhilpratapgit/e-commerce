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
    return (
      <main className="products-page">
        <h2>Loading products...</h2>
      </main>
    );
  }

  if (error) {
    return (
      <main className="products-page">
        <h2>{error}</h2>
      </main>
    );
  }

  return (
    <main className="products-page">

      {/* Header */}
      <div className="products-header">
        <div>
          <h1>Explore Products</h1>
          <p>
            Find the products you're looking for.
          </p>
        </div>
      </div>

      {/* Filters */}
      <section className="filters">

        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-grid">

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

          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

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

        </div>
      </section>

      {/* Products */}
      {products.length === 0 ? (
        <div className="empty-products">
          <h2>No products found</h2>
          <p>
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <section className="product-grid">

          {products.map((product) => (
            <article
              className="product-card"
              key={product.id}
            >

              {/* Product image */}
              <div className="product-image">
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </div>

              <div className="product-card-content">

                <h2>{product.name}</h2>

                <p className="product-description">
                  {product.description}
                </p>

                <div className="product-info">
                  <span className="product-price">
                    ₹{product.price}
                  </span>

                  <span className="product-rating">
                    ★{" "}
                    {product.ratingAverage
                      ? product.ratingAverage.toFixed(1)
                      : "0.0"}
                  </span>
                </div>

                <p className="product-stock">
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </p>

                <Link
                  to={`/products/${product.id}`}
                  className="view-product-button"
                >
                  View Details
                </Link>

              </div>
            </article>
          ))}

        </section>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">

          <button
            onClick={() =>
              setPage((prev) => prev - 1)
            }
            disabled={page === 1}
          >
            ← Previous
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
            Next →
          </button>

        </div>
      )}

    </main>
  );
}

export default Products;