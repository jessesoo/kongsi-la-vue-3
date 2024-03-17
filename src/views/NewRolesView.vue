<script setup lang="ts">
import { useAuth } from "@/composition/auth";
import { useViewError } from "@/composition/error";
import { useInput } from "@/composition/input";
import { useUserRolesStore } from "@/stores/userRoles";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const { viewError, setError, errorMessagesFor } = useViewError();
const { ruleIfNull } = useInput();
const { isAdminMode } = useAuth();
const { addUserRoles } = useUserRolesStore();

const isLoading = ref(false);
const data = reactive<{
  name: string | null;
}>({
  name: null,
});

async function onAddUserRoles() {
  isLoading.value = true;

  try {
    await addUserRoles({
      name: data.name!,
    });
  } catch (e) {
    return setError(e);
  } finally {
    isLoading.value = false;
  }

  router.replace({
    name: "roles",
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
          title: $t('label.nav.breadcrumb.roles'),
          disabled: false,
          href: '/roles',
        },
        {
          title: $t('label.nav.breadcrumb.newRoles'),
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
      <v-form @submit.prevent="onAddUserRoles" :disabled="!isAdminMode">
        <v-text-field
          class="mt-6"
          v-model="data.name"
          type="text"
          :label="$t('label.userRoles.name')"
          density="comfortable"
          variant="outlined"
          hide-details="auto"
          color="primary"
          :rules="[ruleIfNull('error.input.addUserRoles.nameRequired')]"
          :error-messages="errorMessagesFor('name')"
          required
        ></v-text-field>
        <v-btn
          :loading="isLoading"
          :text="$t('label.done')"
          :disabled="!isAdminMode"
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
