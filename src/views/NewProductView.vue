<script setup lang="ts">
import { useAuth } from "@/composition/auth";
import { useViewError } from "@/composition/error";
import { useInput } from "@/composition/input";
import { createUseInventoryStore } from "@/stores/inventory";
import { useSupplierStore } from "@/stores/supplier";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const { viewError, setError, errorMessagesFor } = useViewError();
const { ruleIfNull } = useInput();
const { suppliersSelection } = useSupplierStore();
const { addProduct } = createUseInventoryStore("new-product")();
const { permissions } = useAuth();

const isLoading = ref(false);
const data = reactive<{
  name: string | null;
  price: number | null;
  supplier: number | null;
}>({
  name: null,
  price: null,
  supplier: null,
});

async function onAddProduct() {
  if (data.name == null || data.price == null || data.supplier == null) {
    return;
  }

  isLoading.value = true;

  try {
    await addProduct({
      name: data.name,
      price: data.price,
      supplier: data.supplier,
    });
  } catch (e) {
    return setError(e);
  } finally {
    isLoading.value = false;
  }

  router.replace({
    name: "inventory",
  });
}
</script>

<template>
  <v-container class="v-col-md-8 v-col-lg-6">
    <v-snackbar
      v-model="viewError.isShowing"
      :timeout="1500"
      color="snackbar"
      elevation="24"
      location="top"
      min-width="0"
    >
      <span>{{ errorMessagesFor("general")?.[0] }}</span>
    </v-snackbar>
    <v-breadcrumbs
      :items="[
        {
          title: $t('label.nav.breadcrumb.inventory'),
          disabled: false,
          href: '/inventory',
        },
        {
          title: $t('label.nav.breadcrumb.newProduct'),
          disabled: true,
          href: '',
        },
      ]"
    >
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>
    <v-sheet class="px-4 pt-1 pb-6">
      <v-form
        @submit.prevent="onAddProduct"
        :disabled="!permissions.canAddProduct"
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
        <v-btn
          :loading="isLoading"
          :text="$t('label.done')"
          :disabled="!permissions.canAddProduct"
          class="mt-6 mb-2"
          type="submit"
          color="formButton"
          size="x-large"
          block
        ></v-btn>
      </v-form>
    </v-sheet>
  </v-container>
</template>
