export type SortColumnOrder =
  | "idAsc"
  | "idDesc"
  | "nameAsc"
  | "nameDesc"
  | "priceAsc"
  | "priceDesc";
export type SortColumnOrderValues = Record<
  SortColumnOrder,
  { sortBy: SortByColumn; sortOrder: SortOrder }
>;
export type SortByColumn = "id" | "name" | "price";
export type SortOrder = "asc" | "desc";
export type PriceFilter = `${"lt" | "lte" | "gt" | "gte"}:${number}` | null;
export type PriceFilterList = [PriceFilter, string][];

export type SortFilter = {
  sortBy: SortByColumn;
  sortOrder: SortOrder;
  priceFilter: PriceFilter;
};

export type ListArguments = {
  next: boolean;
  prev: boolean;
  pages: number;
};

export type Supplier = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  supplier: Supplier;
};

export type ServerError = {
  name: string;
  type: string;
  message: string;
};

export function createListParams(
  arg: ListArguments & SortFilter & { currentPage: number }
) {
  const params = new URLSearchParams();

  params.append("page", `${arg.currentPage}`);
  params.append("sortBy", arg.sortBy);
  params.append("sortOrder", arg.sortOrder);

  if (arg.priceFilter) {
    params.append("price", arg.priceFilter);
  }

  return params.toString();
}
