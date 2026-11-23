// Money text for a price that may be missing from the API.
// Returns "N/A" instead of throwing on null, undefined or a string.
export const formatPrice = (price) =>
  typeof price === "number" && Number.isFinite(price)
    ? price.toLocaleString()
    : "N/A";
