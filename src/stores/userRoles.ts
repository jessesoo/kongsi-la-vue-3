import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth";
import { BASE_URL } from "@/i18n/api";

export type UserRoles = {
  id: number;
  name: string;
  permissions: {
    product: {
      canAdd: boolean;
      canView: boolean;
      canEdit: boolean;
      canDelete: boolean;
    };
  };
  targets: { email: string; applied: boolean }[];
};

const options = {
  persist: true,
};

export const useUserRolesStore = defineStore(
  "userRoles",
  () => {
    const { getAuthHeaders, getUser } = useAuthStore();
    const userRoles = ref<UserRoles[]>([]);

    async function getUserRoles() {
      const response = await fetch(`${BASE_URL}/api/v1/user-roles`, {
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

      if (data.userRoles) {
        userRoles.value = data.userRoles;
      }
    }

    async function toggleUserRoles({
      roles,
      email,
    }: {
      roles: UserRoles;
      email: string;
    }) {
      const response = await fetch(
        `${BASE_URL}/api/v1/user-roles/${roles.id}/toggle`,
        {
          method: "POST",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
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
          type: "error.general",
          name: "general",
          message,
        };
      }

      // Keep roles in sync
      getUserRoles();

      // Sync user permissions
      getUser();
    }

    async function updateUserRoles(roles: UserRoles) {
      const response = await fetch(
        `${BASE_URL}/api/v1/user-roles/${roles.id}`,
        {
          method: "PATCH",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: roles.name,
            permissions: roles.permissions,
          }),
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
          type: "error.general",
          name: "general",
          message,
        };
      }

      // Keep roles in sync
      getUserRoles();
    }

    async function addUserRoles({ name }: { name: string }) {
      const response = await fetch(`${BASE_URL}/api/v1/user-roles`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const { errors, message } = await response.json();

        // Map backend error messages

        if (Array.isArray(errors) && errors.length > 0) {
          const error = errors[0];

          if (error.name.startsWith("error.insufficientPrivilege")) {
            clearUserRoles();
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

      // Keep roles in sync
      getUserRoles();
    }

    function clearUserRoles() {
      userRoles.value = [];
    }

    return {
      userRoles,
      addUserRoles,
      getUserRoles,
      updateUserRoles,
      toggleUserRoles,
      clearUserRoles,
    };
  },
  options
);
