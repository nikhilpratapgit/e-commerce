function ProductFilters({
  searchInput,
  setSearchInput,
  categoryId,
  setCategoryId,
  categories,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  sortBy,
  order,
  setSortBy,
  setOrder,
  onClear
}) {
  const hasFilters =
    searchInput ||
    categoryId ||
    minPrice ||
    maxPrice ||
    minRating ||
    sortBy !== "createdAt" ||
    order !== "desc";

  return (
    <section className="product-filters">

      {/* Search */}
      <div className="product-search">
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) =>
            setSearchInput(e.target.value)}
        />

        {searchInput && (
          <button
            type="button"
            className="clear-search"
            onClick={() => setSearchInput("")}
          >
            ×
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="product-filter-grid">

        {/* Category */}
        <div className="filter-field">
          <label>Category</label>

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
        </div>

        {/* Minimum price */}
        <div className="filter-field">
          <label>Min Price</label>

          <input
            type="number"
            placeholder="₹ Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        {/* Maximum price */}
        <div className="filter-field">
          <label>Max Price</label>

          <input
            type="number"
            placeholder="₹ Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {/* Rating */}
        <div className="filter-field">
          <label>Rating</label>

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
        </div>

        {/* Sort */}
        <div className="filter-field">
          <label>Sort</label>

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

      </div>

      {/* Filter footer */}
      <div>

        {hasFilters && (
          <button
            type="button"
            className="clear-filters"
            onClick={onClear}
          >
            Clear Filters
          </button>
        )}

      </div>

    </section>
  );
}

export default ProductFilters;