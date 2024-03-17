import { BASE_URL } from "@/i18n/api";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { type Supplier } from "./utils";

const options = {
  persist: true,
};

export const useSupplierStore = defineStore(
  "supplier",
  () => {
    const { t } = useI18n();

    const suppliers = ref<Supplier[]>([]);
    const suppliersSelection = computed<{ key: Number; value: string }[]>(
      () => {
        return suppliers.value.map((supplier) => ({
          key: supplier.id,
          value: supplier.name,
        }));
      }
    );

    async function getSuppliers() {
      const response = await fetch(`${BASE_URL}/api/v1/inventory/suppliers`, {
        method: "GET",
      });

      if (!response.ok) {
        const { errors, message } = await response.json();

        // Map backend error messages

        if (Array.isArray(errors) && errors.length > 0) {
          const error = errors[0];

          if (error.name.startsWith("error.insufficientPrivilege")) {
            clearSuppliers();
          }

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

      if (data.suppliers) {
        suppliers.value = data.suppliers;
      }
    }

    function clearSuppliers() {
      suppliers.value = [];
    }

    return { suppliers, suppliersSelection, getSuppliers, clearSuppliers };
  },
  options
);
