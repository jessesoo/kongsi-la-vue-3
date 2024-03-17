import { useAuthStore } from "@/stores/auth";
import { computed, ref, watch } from "vue";

export function useAuth({
  onAdminMode,
}: { onAdminMode?: (isAdminMode: boolean) => void } = {}) {
  const authStore = useAuthStore();
  const isAdminMode = ref(authStore.isAdminMode);
  const isToggling = ref(false);

  const permissions = computed(() => {
    return authStore.permissions;
  });

  async function toggleAdminMode() {
    isToggling.value = true;

    try {
      await authStore.toggleAdminMode();
    } catch (e) {
      return;
    } finally {
      isToggling.value = false;
    }
  }

  watch(
    () => authStore.isAdminMode,
    (val) => {
      isAdminMode.value = val;

      if (val != null) {
        onAdminMode?.(val);
      }
    }
  );

  return {
    isToggling,
    isAdminMode,
    toggleAdminMode,
    permissions,
  };
}
