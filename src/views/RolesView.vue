<script setup lang="ts">
import { useAuth } from "@/composition/auth";
import { useViewError } from "@/composition/error";
import { useUserRolesStore, type UserRoles } from "@/stores/userRoles";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useUserRolesStore();
const { viewError, setError, errorMessagesFor } = useViewError();
const { isAdminMode } = useAuth({
  onAdminMode: (isAdminMode) => {
    getData();
  },
});

const isUpdating = ref(false);

async function onToggleProductRoles(roles: UserRoles, email: string) {
  isUpdating.value = true;

  try {
    await store.toggleUserRoles({ roles, email });
  } catch (e) {
    return setError(e);
  } finally {
    isUpdating.value = false;
  }
}

async function onUpdateProductRoles(
  roles: UserRoles,
  key: "canAdd" | "canView" | "canEdit" | "canDelete"
) {
  const newRoles = {
    ...roles,
    permissions: {
      ...roles.permissions,
      product: {
        ...roles.permissions.product,
        [key]: !roles.permissions.product[key],
      },
    },
  };

  isUpdating.value = true;

  try {
    await store.updateUserRoles(newRoles);
  } catch (e) {
    return setError(e);
  } finally {
    isUpdating.value = false;
  }
}

function onNewRoles() {
  router.push({
    name: "new-roles",
  });
}

async function getData() {
  try {
    await store.getUserRoles();
  } catch (e) {
    return setError(e);
  }
}

onMounted(() => {
  getData();
});
</script>

<template>
  <v-container class="v-col-lg-8">
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
    <v-sheet class="pa-4">
      <v-table>
        <thead>
          <tr>
            <th class="font-weight-bold">{{ $t("label.userRoles.name") }}</th>
            <th class="font-weight-bold">
              {{ $t("label.userRoles.permissions") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.userRoles.length === 0">
            <td colspan="2">
              {{ $t("label.table.empty") }}
            </td>
          </tr>
          <template
            v-for="(roles, index) in store.userRoles"
            :key="index"
            v-else
          >
            <tr class="cursor-pointer">
              <td>{{ roles.name }}</td>
              <td>
                <template v-if="roles.permissions.product">
                  <div class="d-flex flex-row align-center">
                    <div class="text-caption text-grey">
                      {{ $t("label.userRoles.product.title") }}:
                    </div>
                    <v-checkbox
                      :label="$t('label.userRoles.product.canAdd')"
                      :model-value="roles.permissions.product.canAdd"
                      :disabled="isUpdating || !isAdminMode"
                      color="primary"
                      hide-details
                      @change="onUpdateProductRoles(roles, 'canAdd')"
                    ></v-checkbox>
                    <v-checkbox
                      :label="$t('label.userRoles.product.canView')"
                      :model-value="roles.permissions.product.canView"
                      :disabled="isUpdating || !isAdminMode"
                      color="primary"
                      hide-details
                      @change="onUpdateProductRoles(roles, 'canView')"
                    ></v-checkbox>
                    <v-checkbox
                      :label="$t('label.userRoles.product.canEdit')"
                      :model-value="roles.permissions.product.canEdit"
                      :disabled="isUpdating || !isAdminMode"
                      color="primary"
                      hide-details
                      @change="onUpdateProductRoles(roles, 'canEdit')"
                    ></v-checkbox>
                    <v-checkbox
                      :label="$t('label.userRoles.product.canDelete')"
                      :model-value="roles.permissions.product.canDelete"
                      :disabled="isUpdating || !isAdminMode"
                      color="primary"
                      hide-details
                      @change="onUpdateProductRoles(roles, 'canDelete')"
                    ></v-checkbox>
                  </div>
                  <div class="d-flex flex-column align-start">
                    <div class="text-caption text-grey">
                      {{ $t("label.userRoles.target") }}:
                    </div>
                    <v-checkbox
                      v-for="(target, index) in roles.targets"
                      :key="index"
                      :label="target.email"
                      :model-value="target.applied"
                      :disabled="isUpdating || !isAdminMode"
                      color="primary"
                      density="compact"
                      hide-details
                      @change="onToggleProductRoles(roles, target.email)"
                    ></v-checkbox>
                  </div>
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </v-sheet>
    <v-btn
      @click="onNewRoles"
      class="mr-4 mb-4"
      position="fixed"
      location="bottom right"
      size="large"
      icon="mdi-plus"
      color="primary"
      elevation="20"
      :disabled="!isAdminMode"
    />
  </v-container>
</template>
