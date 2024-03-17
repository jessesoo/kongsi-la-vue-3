<script setup lang="ts">
import { useAuth } from "@/composition/auth";
import { useViewError } from "@/composition/error";
import { createUseInventoryStore } from "@/stores/inventory";
import { useSupplierStore } from "@/stores/supplier";
import { type Product } from "@/stores/utils";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const { viewError, setError, errorMessagesFor } = useViewError();
const store = createUseInventoryStore("inventory")();
const supplierStore = useSupplierStore();
const { permissions } = useAuth({
  onAdminMode: (isAdminMode) => {
    getData();
  },
});

function onNewProduct() {
  router.push({
    name: "new-product",
  });
}

function onProduct(product: Product) {
  router.push({
    name: "product",
    params: {
      id: product.id,
    },
  });
}

function getData() {
  try {
    store.getProducts();
    supplierStore.getSuppliers();
  } catch (e) {
    return setError(e);
  }
}

onMounted(() => {
  store.handleGetProductsError = (error) => {
    setError(error);
  };

  getData();
});
</script>

<template>
  <v-container class="v-col-lg-8">
    <v-snackbar
      v-model="viewError.isShowing"
      :timeout="1500"
      color="warning"
      elevation="24"
      location="top"
      min-width="0"
    >
      <span>{{ errorMessagesFor("general")?.[0] }}</span>
    </v-snackbar>
    <v-sheet>
      <v-select
        v-model="store.sortColumnOrder"
        :label="$t('label.product.sortBy')"
        :items="store.sortColumnOrderTexts"
        item-value="key"
        item-title="value"
        density="compact"
        hide-details
        class="px-3 py-4"
      ></v-select>
      <div class="py-1 px-4 d-flex flex-row align-start">
        <v-icon class="mr-2 mt-2" icon="mdi-filter-variant"></v-icon>
        <v-chip-group v-model="store.priceFilter" column>
          <v-chip
            v-for="(filter, index) in store.priceFilterList"
            :key="index"
            color="primary"
            filter
            filter-icon="mdi-check-circle"
          >
            {{ filter[1] }}
          </v-chip>
        </v-chip-group>
      </div>
      <v-table>
        <thead>
          <tr>
            <th class="font-weight-bold">{{ $t("label.product.name") }}</th>
            <th class="font-weight-bold">{{ $t("label.product.price") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.products.length === 0">
            <td colspan="2">
              {{ $t("label.table.empty") }}
            </td>
          </tr>
          <template v-for="(product, index) in store.products" :key="index">
            <tr @click="onProduct(product)" class="cursor-pointer">
              <v-hover v-slot="{ isHovering, props }">
                <td v-bind="props" :class="{ 'bg-rowHover': isHovering }">
                  {{ product.name }}
                </td>
                <td v-bind="props" :class="{ 'bg-rowHover': isHovering }">
                  {{ product.price }}
                </td>
              </v-hover>
            </tr>
          </template>
        </tbody>
      </v-table>
      <v-pagination
        v-model="store.currentPage"
        :length="store.pagination.pages"
        rounded="0"
      ></v-pagination>
    </v-sheet>
    <v-btn
      @click="onNewProduct"
      class="mr-4 mb-4"
      position="fixed"
      location="bottom right"
      size="large"
      icon="mdi-plus"
      color="primary"
      elevation="20"
      :disabled="!permissions.canAddProduct"
    />
  </v-container>
</template>
