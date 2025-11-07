export function buildPagination(
  currentPage: number,
  totalPages: number
): Array<number | "ellipsis"> {
  if (totalPages <= 1) {
    return [];
  }

  const pages = new Set<number>([
    1,
    2,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  const filteredPages = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const items: Array<number | "ellipsis"> = [];

  filteredPages.forEach((page, index) => {
    if (index > 0 && page - filteredPages[index - 1] > 1) {
      items.push("ellipsis");
    }
    items.push(page);
  });

  return items;
}
