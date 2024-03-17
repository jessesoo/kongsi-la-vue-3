<script setup lang="ts">
import { useAuth } from "@/composition/auth";
import { useViewError } from "@/composition/error";
import { useInput } from "@/composition/input";
import { createUseInventoryStore } from "@/stores/inventory";
import { useSupplierStore } from "@/stores/supplier";
import { type Product } from "@/stores/utils";
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const { viewError, setError, errorMessagesFor } = useViewError();
const { suppliersSelection } = useSupplierStore();
const { getProduct, updateProduct, deleteProduct } =
  createUseInventoryStore("product")();
const { ruleIfNull } = useInput();
const { permissions } = useAuth({
  onAdminMode: (isAdminMode) => {
    onGetProduct();
  },
});

const currentProduct = ref<Product | null>(null);
const isLoading = ref(false);
const isUpdated = ref(false);
const showDeleteConfirmation = ref(false);
const data = reactive<{
  name: string | null;
  price: number | null;
  supplier: number | null;
}>({
  name: null,
  price: null,
  supplier: null,
});

async function onDeleteProduct(product: Product) {
  isLoading.value = true;

  try {
    await deleteProduct(product.id);
  } catch (e) {
    return setError(e);
  } finally {
    isLoading.value = false;
  }

  router.replace({
    name: "inventory",
  });
}

async function onUpdateProduct() {
  const product = currentProduct.value;

  if (product == null) {
    return;
  }

  isLoading.value = true;

  try {
    await updateProduct(product.id, {
      name: data.name,
      price: data.price,
      supplier: data.supplier,
    });
  } catch (e) {
    return setError(e);
  } finally {
    isLoading.value = false;
  }

  onUpdated();
}

async function onUpdated() {
  isUpdated.value = true;

  setTimeout(() => {
    isUpdated.value = false;
  }, 1200);

  onGetProduct();
}

async function onGetProduct() {
  isLoading.value = true;

  const { id } = route.params;

  try {
    const product = await getProduct(id as string);

    if (product) {
      currentProduct.value = product;

      data.name = product.name;
      data.price = product.price;
      data.supplier = product.supplier.id;
    }
  } catch (e) {
    currentProduct.value = null;
    return setError(e);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  onGetProduct();
});
</script>

<template>
  <v-container class="v-col-md-8 v-col-lg-6">
    <v-snackbar
      v-model="viewError.isShowing"
      :timeout="2000"
      color="warning"
      elevation="24"
      location="top"
      min-width="0"
    >
      <span>{{ errorMessagesFor("general")?.[0] }}</span>
    </v-snackbar>
    <v-breadcrumbs
      color="breadcrumb"
      :items="[
        {
          title: $t('label.nav.breadcrumb.inventory'),
          disabled: false,
          href: '/inventory',
        },
        {
          title: currentProduct?.name || $t('label.nav.breadcrumb.product'),
          disabled: true,
          href: '',
        },
      ]"
    >
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right" color="breadcrumb"></v-icon>
      </template>
    </v-breadcrumbs>
    <v-sheet class="pa-4" v-if="currentProduct">
      <v-img
        :src="`https://placehold.co/600x400/?text=${currentProduct.name.split(/\s+/)[0]}`"
      >
      </v-img>
      <v-form
        class="mt-3"
        @submit.prevent="onUpdateProduct"
        :disabled="!permissions.canEditProduct"
      >
        <v-text-field
          class="mt-6"
          v-model="data.name"
          type="text"
          :label="$t('label.product.name')"
          density="comfortable"
          variant="outlined"
          hide-details="auto"
          color="primary"
          :rules="[ruleIfNull('error.input.addProduct.nameRequired')]"
          :error-messages="errorMessagesFor('name')"
          required
        ></v-text-field>
        <v-text-field
          class="mt-6"
          v-model="data.price"
          :step="0.01"
          type="number"
          :label="$t('label.product.price')"
          density="comfortable"
          variant="outlined"
          hide-details="auto"
          color="primary"
          :rules="[ruleIfNull('error.input.addProduct.priceRequired')]"
          :error-messages="errorMessagesFor('name')"
          required
        ></v-text-field>
        <v-select
          class="mt-5"
          v-model="data.supplier"
          :label="$t('label.product.supplier')"
          :items="suppliersSelection"
          item-value="key"
          item-title="value"
          density="comfortable"
          variant="outlined"
          hide-details="auto"
          color="primary"
          :rules="[ruleIfNull('error.input.addProduct.supplierRequired')]"
          :error-messages="errorMessagesFor('name')"
          required
        ></v-select>
        {{ permissions.canEditProduct }}
        <v-btn
          class="mt-6"
          type="submit"
          color="formButton"
          size="x-large"
          block
          :loading="!isUpdated && isLoading"
          :text="isUpdated ? $t('label.done') : $t('label.update')"
          :prepend-icon="isUpdated ? 'mdi-check-circle' : ''"
          :disabled="isUpdated || !permissions.canEditProduct"
        ></v-btn>
      </v-form>
      <v-btn
        class="mt-4 mb-2"
        type="submit"
        color="formButtonWarning"
        size="x-large"
        variant="outlined"
        block
        :loading="!isUpdated && isLoading"
        :text="$t('label.delete')"
        :disabled="isUpdated || !permissions.canDeleteProduct"
        @click="showDeleteConfirmation = true"
      ></v-btn>
    </v-sheet>
    <v-dialog v-model="showDeleteConfirmation" max-width="240">
      <v-card>
        <template v-slot:text>
          {{ $t("label.dialog.confirmDelete") }}
        </template>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :text="$t('label.dialog.yes')"
            color="warning"
            variant="text"
            @click="onDeleteProduct(currentProduct!)"
          ></v-btn>
          <v-btn
            :text="$t('label.dialog.no')"
            variant="text"
            @click="showDeleteConfirmation = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
