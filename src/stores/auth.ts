import { BASE_URL } from "@/i18n/api";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

type User = {
  accessToken: string;
  email: string;
  isAdmin: boolean;
  permissions: {
    canAddProduct: boolean;
    canViewProduct: boolean;
    canEditProduct: boolean;
    canDeleteProduct: boolean;
  };
};

const options = {
  persist: true,
};

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref<User | null>(null);
    const permissions = computed(() => {
      return (
        user.value?.permissions || {
          canAddProduct: false,
          canViewProduct: false,
          canEditProduct: false,
          canDeleteProduct: false,
        }
      );
    });
    const isAdminMode = computed(() => {
      return user.value?.isAdmin;
    });
    const isLoggedIn = computed(() => {
      return user.value?.accessToken != null;
    });

    function getAuthHeaders() {
      return {
        ["Authorization"]: `Bearer ${user.value!.accessToken}`,
      };
    }

    function logout() {
      user.value = null;
    }

    async function getUser() {
      const response = await fetch(`${BASE_URL}/api/v1/user/me`, {
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
          name: "error.general",
          type: "general",
          message,
        };
      }

      const data = await response.json();

      if (data) {
        user.value = {
          ...user.value,
          email: data.email,
          isAdmin: data.isAdmin,
          permissions: data.permissions,
        };
      }
    }

    async function toggleAdminMode() {
      const response = await fetch(`${BASE_URL}/api/v1/user/admin-mode`, {
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

      // Keep user data in sync
      getUser();
    }

    async function login({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) {
      const response = await fetch(`${BASE_URL}/api/v1/user/login`, {
        method: "POST",
        headers: {
          ["Content-Type"]: "application/json",
        },
        body: JSON.stringify({ email, password }),
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

      const data = await response.json();

      if (data) {
        user.value = {
          accessToken: data.accessToken,
          email: data.email,
        };
      }

      getUser();
    }

    return {
      user,
      permissions,
      isLoggedIn,
      isAdminMode,
      login,
      logout,
      getUser,
      toggleAdminMode,
      getAuthHeaders,
    };
  },
  options
);
