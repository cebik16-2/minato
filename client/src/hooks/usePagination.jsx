import { useState } from "react";

const usePagination = (itemsPerPage, totalItems) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentItems = (items) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    return items.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
  };

  return { currentPage, setCurrentPage, totalPages, currentItems };
};

export default usePagination;
