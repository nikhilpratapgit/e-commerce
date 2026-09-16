import { useEffect, useState } from "react";
import api from "../services/api";

import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search input = what user is currently typing
  const [searchInput, setSearchInput] = useState("");

  // Search = value actually used for API request
  const [search, setSearch] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [debouncedMinPrice, setDebouncedMinPrice] = useState("");
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState("");
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 800);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  //debounce minPrice and maxPrice
  // Debounce price filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMinPrice(minPrice);
      setDebouncedMaxPrice(maxPrice);
      setPage(1);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [minPrice, maxPrice]);

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
            minPrice : debouncedMinPrice,
            maxPrice : debouncedMaxPrice,
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
    debouncedMinPrice,
    debouncedMaxPrice,
    minRating,
    sortBy,
    order,
    page
  ]);

  // Reset page when non-search filters change
  useEffect(() => {
    setPage(1);
  }, [
    categoryId,
    minRating,
    sortBy,
    order
  ]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");

    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");

    setSortBy("createdAt");
    setOrder("desc");

    setPage(1);
  };

  if (loading) {
    return (
      <main className="products-page">
        <div className="products-state">
          <h2>Loading products...</h2>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="products-page">
        <div className="products-state">
          <h2>{error}</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="products-page">

      {/* Header */}
      <header className="products-header">

        <span className="products-eyebrow">
          OUR COLLECTION
        </span>

        <h1>
          Explore Products
        </h1>

        <p>
          Discover products you'll love
        </p>

      </header>

      {/* Filters */}
      <ProductFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}

        categoryId={categoryId}
        setCategoryId={setCategoryId}

        categories={categories}

        minPrice={minPrice}
        setMinPrice={setMinPrice}

        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}

        minRating={minRating}
        setMinRating={setMinRating}

        sortBy={sortBy}
        order={order}
        setSortBy={setSortBy}
        setOrder={setOrder}

        onClear={handleClearFilters}
      />

      {/* Products */}
      {products.length === 0 ? (
        <div className="empty-products">

          <h2>
            No products found
          </h2>

          <p>
            Try changing your search or filters.
          </p>

        </div>
      ) : (
        <ProductGrid products={products} />
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />

    </main>
  );
}

export default Products;