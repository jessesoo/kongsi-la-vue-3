import { BASE_URL } from "@/i18n/api";
import {
  createListParams,
  type ListArguments,
  type PriceFilterList,
  type Product,
  type ServerError,
  type SortColumnOrder,
  type SortColumnOrderValues,
  type SortFilter,
} from "@/stores/utils";
import { defineStore } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "./auth";

const options = {
  persist: true,
};

const sortColumnOrderValues: SortColumnOrderValues = {
  ["idAsc"]: {
    sortBy: "id",
    sortOrder: "asc",
  },
  ["idDesc"]: {
    sortBy: "id",
    sortOrder: "desc",
  },
  ["nameAsc"]: {
    sortBy: "name",
    sortOrder: "asc",
  },
  ["nameDesc"]: {
    sortBy: "name",
    sortOrder: "desc",
  },
  ["priceAsc"]: {
    sortBy: "price",
    sortOrder: "asc",
  },
  ["priceDesc"]: {
    sortBy: "price",
    sortOrder: "desc",
  },
};

const priceFilterList: PriceFilterList = [
  ["lt:10", "< $10"],
  ["lt:20", "< $20"],
  ["lt:30", "< $30"],
  ["lt:40", "< $40"],
  ["lt:50", "< $50"],
  ["lt:60", "< $60"],
  ["lt:70", "< $70"],
  ["lt:80", "< $80"],
  ["lt:90", "< $90"],
  ["lt:100", "< $100"],
];

export function createUseInventoryStore(
  name: string
  // {
  //   handleGetProductsError,
  // }: { handleGetProductsError?: (error: ServerError) => void } = {}
) {
  return defineStore(
    name || "inventory",
    () => {
      const { t } = useI18n();
      const { getAuthHeaders } = useAuthStore();
      const handleGetProductsError = ref<(error: ServerError) => void | null>(
        (error) => {
          // Expose this handler to handle get products error
        }
      );
      // User selection
      const sortColumnOrder = ref<SortColumnOrder>("idDesc");
      const sortColumnOrderTexts = computed<
        { key: SortColumnOrder; value: string }[]
      >(() => {
        return [
          { key: "idAsc", value: t("label.product.sortByList.idAsc") },
          { key: "idDesc", value: t("label.product.sortByList.idDesc") },
          { key: "nameAsc", value: t("label.product.sortByList.nameAsc") },
          {
            key: "nameDesc",
            value: t("label.product.sortByList.nameDesc"),
          },
          {
            key: "priceAsc",
            value: t("label.product.sortByList.priceAsc"),
          },
          {
            key: "priceDesc",
            value: t("label.product.sortByList.priceDesc"),
          },
        ];
      });

      const products = ref<Product[]>([]);
      // The index of the selected filter
      const priceFilter = ref<number | null>(null);
      // The current page selected by the user
      const currentPage = ref<number>(1);
      // Pages information
      const pagination = reactive<ListArguments>({
        next: false,
        prev: false,
        pages: 1,
      });
      // The criteria for filtering and sorting
      const sortFilter = reactive<SortFilter>({
        sortBy: "id",
        sortOrder: "desc",
        priceFilter: null,
      });

      async function deleteProduct(id: number) {
        const response = await fetch(
          `${BASE_URL}/api/v1/inventory/delete/${id}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          const { errors, message } = await response.json();

          // Map backend error messages

          if (Array.isArray(errors) && errors.length > 0) {
            const error = errors[0];

            throw {
              name: error.name,
              type: error.type,
              message: error.message,
            };
          }

          throw {
            name: "error.general",
            type: "general",
            message,
          };
        }

        // Refresh the inventory list
        getProducts();
      }

      async function updateProduct(
        id: number,
        {
          name,
          price,
          supplier,
        }: {
          name: string | null;
          price: number | null;
          supplier: number | null;
        }
      ) {
        const data: {
          name?: string;
          price?: number;
          supplier?: number;
        } = {};

        if (name) {
          data.name = name;
        }

        if (price) {
          data.price = price;
        }

        if (supplier) {
          data.supplier = supplier;
        }

        const response = await fetch(
          `${BASE_URL}/api/v1/inventory/update/${id}`,
          {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: {
              ...getAuthHeaders(),
              ["Content-Type"]: "application/json",
            },
          }
        );

        if (!response.ok) {
          const { errors, message } = await response.json();

          // Map backend error messages

          if (Array.isArray(errors) && errors.length > 0) {
            const error = errors[0];

            throw {
              name: error.name,
              type: error.type,
              message: error.message,
            };
          }

          throw {
            name: "error.general",
            type: "general",
            message,
          };
        }

        // Refresh the inventory list
        getProducts();
      }

      async function addProduct({
        name,
        price,
        supplier,
      }: {
        name: string;
        price: number;
        supplier: number;
      }) {
        const response = await fetch(`${BASE_URL}/api/v1/inventory/add`, {
          method: "POST",
          body: JSON.stringify({
            name,
            price,
            supplier,
          }),
          headers: {
            ...getAuthHeaders(),
            ["Content-Type"]: "application/json",
          },
        });

        if (!response.ok) {
          const { errors, message } = await response.json();

          // Map backend error messages

          if (Array.isArray(errors) && errors.length > 0) {
            const error = errors[0];

            throw {
              name: error.name,
              type: error.type,
              message: error.message,
            };
          }

          throw {
            name: "error.general",
            type: "general",
            message,
          };
        }

        // Shoe the latest product on inventory page
        sortColumnOrder.value = "idDesc";

        // Refresh the inventory list
        getProducts();
      }

      async function getProduct(id: number | string): Promise<Product | null> {
        const response = await fetch(`${BASE_URL}/api/v1/inventory/${id}`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          const { errors, message } = await response.json();

          // Map backend error messages

          if (Array.isArray(errors) && errors.length > 0) {
            const error = errors[0];

            throw {
              name: error.name,
              type: error.type,
              message: error.message,
            };
          }

          throw {
            type: "error.general",
            name: "general",
            message,
          };
        }

        const data = await response.json();

        return {
          id: data.product.id,
          name: data.product.name,
          price: data.product.price,
          supplier: {
            id: data.product.supplier.id,
            name: data.product.supplier.name,
          },
        };
      }

      async function getProducts() {
        const response = await fetch(
          `${BASE_URL}/api/v1/inventory?${createListParams({
            ...pagination,
            ...sortFilter,
            currentPage: currentPage.value,
          })}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          const { errors, message } = await response.json();

          // Map backend error messages

          if (Array.isArray(errors) && errors.length > 0) {
            const error = errors[0];

            if (error.name.startsWith("error.insufficientPrivilege")) {
              clearProducts();
            }

            return handleGetProductsError.value({
              name: error.name,
              type: error.type,
              message: error.message,
            });
          }

          return handleGetProductsError.value({
            type: "error.general",
            name: "general",
            message,
          });
        }

        const data = await response.json();

        if (data.products) {
          products.value = data.products;
        }

        if (data.pagination) {
          pagination.prev = data.pagination.prev;
          pagination.next = data.pagination.next;
          pagination.pages = data.pagination.pages;
        }
      }

      function clearProducts() {
        products.value = [];
      }

      async function populateInventory() {
        const response = await fetch(`${BASE_URL}/api/v1/inventory/populate`, {
          method: "POST",
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          const { errors, message } = await response.json();

          // Map backend error messages

          if (Array.isArray(errors) && errors.length > 0) {
            const error = errors[0];

            throw {
              name: error.name,
              type: error.type,
              message: error.message,
            };
          }

          throw {
            name: "error.general",
            type: "general",
            message,
          };
        }

        // Refresh the inventory list
        getProducts();
      }

      function resetPagination() {
        currentPage.value = 1;
        pagination.prev = false;
        pagination.next = false;
        pagination.pages = 1;
      }

      watch(sortFilter, (val) => {
        getProducts();
      });

      watch(sortColumnOrder, (val) => {
        resetPagination();

        const value = sortColumnOrderValues[val];
        sortFilter.sortBy = value.sortBy;
        sortFilter.sortOrder = value.sortOrder;
      });

      watch(currentPage, (val) => {
        getProducts();
      });

      watch(priceFilter, (val) => {
        resetPagination();

        sortFilter.priceFilter = val != null ? priceFilterList[val][0] : null;
      });

      return {
        products,
        priceFilter,
        priceFilterList,
        sortFilter,
        sortColumnOrder,
        sortColumnOrderTexts,
        sortColumnOrderValues,
        getProduct,
        getProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        clearProducts,
        populateInventory,
        currentPage,
        pagination,
        resetPagination,
        handleGetProductsError,
      };
    },
    options
  );
}
