<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { RouterView } from "vue-router";

import { useAuth } from "@/composition/auth";
import { useViewError } from "@/composition/error";
import { useAuthStore } from "@/stores/auth";
import { createUseInventoryStore } from "@/stores/inventory";
import { useSupplierStore } from "@/stores/supplier";
import { useUserRolesStore } from "@/stores/userRoles";
import { useRouter } from "vue-router";

const ERROR_TIMEOUT = 2000;

const router = useRouter();
const { viewError, setError, errorMessagesFor } = useViewError();
const { user, getUser, logout } = useAuthStore();
const { clearProducts, getProducts } = createUseInventoryStore("home")();
const { populateInventory } = createUseInventoryStore("inventory")();
const { clearSuppliers } = useSupplierStore();
const { clearUserRoles } = useUserRolesStore();
const { toggleAdminMode, isToggling, isAdminMode } = useAuth({
  onAdminMode: (isAdminMode) => {
    onGetUser();
  },
});

const showDrawer = ref(false);
const showSessionError = ref(false);
const isPopulating = ref(false);

async function onPopulate() {
  isPopulating.value = true;

  try {
    await populateInventory();
  } catch (e) {
    return setError(e);
  } finally {
    isPopulating.value = false;
  }

  getProducts();
}

function onLogout() {
  logout();

  clearProducts();
  clearSuppliers();
  clearUserRoles();

  router.replace({
    name: "login",
  });
}

function onNavInventory() {
  router.replace({
    name: "inventory",
  });

  showDrawer.value = false;
}

function onNavNewProduct() {
  router.replace({
    name: "new-product",
  });

  showDrawer.value = false;
}

function onNavUserRoles() {
  router.replace({
    name: "roles",
  });

  showDrawer.value = false;
}

function onNavNewRoles() {
  router.replace({
    name: "new-roles",
  });

  showDrawer.value = false;
}

async function onGetUser() {
  try {
    await getUser();
  } catch (e) {
    showSessionError.value = true;
    setTimeout(onLogout, ERROR_TIMEOUT);
  }
}

function onToggleAdminMode() {
  toggleAdminMode();
}

onMounted(() => {
  onGetUser();
});
</script>

<template>
  <v-layout>
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

    <v-snackbar
      v-model="showSessionError"
      :timeout="ERROR_TIMEOUT"
      color="warning"
      elevation="24"
      location="top"
      min-width="0"
    >
      <span>{{ $t("error.session.expired") }}</span>
    </v-snackbar>

    <v-app-bar color="primary">
      <v-app-bar-title>
        <div class="d-flex flex-column align-start">
          <span>{{ $t("title") }}</span>
          <div v-if="user" class="text-caption text-center font-weight-thin">
            {{ user?.email }}
          </div>
        </div>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          @click="showDrawer = !showDrawer"
        ></v-app-bar-nav-icon>
      </template>
      <template v-slot:append>
        <v-switch
          :model-value="isAdminMode"
          @change="onToggleAdminMode"
          hide-details
          color="orange"
          :label="isAdminMode ? $t('label.mode.admin') : $t('label.mode.guest')"
          :loading="isToggling"
          :disabled="isToggling"
        ></v-switch>
        <v-menu :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
          </template>
          <v-list>
            <v-list-item density="compact">
              <v-list-item-title>
                <v-btn
                  size="small"
                  color="warning"
                  variant="text"
                  prepend-icon="mdi-logout"
                  @click="onLogout"
                  >{{ $t("label.logout") }}</v-btn
                >
              </v-list-item-title>
            </v-list-item>
            <v-list-item density="compact">
              <v-list-item-title>
                <v-btn
                  size="small"
                  variant="text"
                  prepend-icon="mdi-database-import"
                  :disabled="!isAdminMode"
                  :loading="isPopulating"
                  @click="onPopulate"
                  >{{ $t("label.populate") }}</v-btn
                >
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-navigation-drawer temporary v-model="showDrawer">
      <v-list density="comfortable" nav slim>
        <v-list-item
          :title="$t('label.nav.drawer.inventory')"
          prepend-icon="mdi-invoice-list-outline"
          class="drawer-item"
          @click="onNavInventory"
        ></v-list-item>

        <v-list-item
          :title="$t('label.nav.drawer.userRoles')"
          prepend-icon="mdi-account-supervisor-outline"
          class="drawer-item"
          @click="onNavUserRoles"
        ></v-list-item>

        <v-list-item
          :title="$t('label.nav.drawer.newProduct')"
          prepend-icon="mdi-plus-box-outline"
          class="drawer-item"
          @click="onNavNewProduct"
        ></v-list-item>

        <v-list-item
          :title="$t('label.nav.drawer.newUserRoles')"
          prepend-icon="mdi-shield-account-outline"
          class="drawer-item"
          @click="onNavNewRoles"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <RouterView />
    </v-main>
  </v-layout>
</template>
