export const DOTS = "...";

export function totalPages(total: number, limit: number) {
  if (!limit || limit <= 0) return 1;
  return Math.max(1, Math.ceil(total / limit));
}

export function getPagination(currentPage: number, totalPages: number) {
  // If the total number of pages is 7 or less,
  // display all page numbers without any dots.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, DOTS, totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, DOTS, totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    DOTS,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    DOTS,
    totalPages,
  ];
}
