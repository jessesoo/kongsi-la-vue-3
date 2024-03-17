<script setup lang="ts">
import { useViewError } from "@/composition/error";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const { login } = useAuthStore();

const email = ref("");
const password = ref("");
const isLoading = ref(false);
const { viewError, setError, errorMessagesFor } = useViewError();

async function onLogin() {
  isLoading.value = true;

  try {
    await login({ email: email.value, password: password.value });
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
  <v-main class="d-flex flex-col justify-center ma-8">
    <v-form class="v-col-md-6 v-col-lg-4" @submit.prevent="onLogin">
      <v-card class="pa-4" elevation="4" rounded="lg">
        <v-card-title class="text-center">{{ $t("title") }}</v-card-title>
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
        <v-text-field
          class="my-2"
          v-model="email"
          type="email;
          });"
          :label="$t('label.email')"
          density="comfortable"
          hide-details="auto"
          variant="outlined"
          color="primary"
          :error-messages="errorMessagesFor('email')"
          required
        ></v-text-field>
        <v-text-field
          class="my-2"
          v-model="password"
          type="password"
          :label="$t('label.password')"
          density="comfortable"
          hide-details="auto"
          variant="outlined"
          color="primary"
          :error-messages="errorMessagesFor('password')"
          required
        ></v-text-field>
        <v-btn
          :disabled="isLoading"
          :loading="isLoading"
          type="sub;
          });mit"
          color="primary"
          size="large"
          rounded="sm"
          block
          class="my-4"
          >{{ $t("label.login") }}</v-btn
        >
        <v-card-subtitle class="text-center"
          >© {{ new Date().getFullYear() }}
          {{ $t("credit.creator") }}</v-card-subtitle
        >
      </v-card>
    </v-form>
  </v-main>
</template>
