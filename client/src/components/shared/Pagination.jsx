import React from "react";
import { Pagination as MuiPagination } from "@mui/material";

const Pagination = ({ totalPages, currentPage, onPageChange }) => (
  <MuiPagination
    count={totalPages}
    page={currentPage}
    onChange={(event, page) => onPageChange(page)}
    color="primary"
  />
);

export default React.memo(Pagination);
