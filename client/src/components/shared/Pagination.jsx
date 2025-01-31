import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => (
  <div className="pagination">
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        className={`button pagination-button ${
          currentPage === index + 1 ? "active" : ""
        }`}
        onClick={() => onPageChange(index + 1)}
      >
        {index + 1}
      </button>
    ))}
  </div>
);

export default React.memo(Pagination);
