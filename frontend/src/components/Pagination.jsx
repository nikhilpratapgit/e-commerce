function Pagination({
  page,
  totalPages,
  setPage
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
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
  );
}

export default Pagination;