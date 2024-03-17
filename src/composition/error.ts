import type { ServerError } from "@/stores/utils";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

type ViewError = {
  type: string;
  name: string | null;
  isShowing: boolean;
};

export function useViewError() {
  const { t } = useI18n();

  const viewError = ref<ViewError>({
    name: null,
    type: "general",
    isShowing: false,
  });

  const errorMessagesFor = computed(() => {
    return (type: string) => {
      if (viewError.value.type === type) {
        return viewError.value.name ? [t(viewError.value.name)] : null;
      }

      return null;
    };
  });

  function setError(error: ServerError) {
    viewError.value = {
      name: error.name,
      type: error.type,
      isShowing: error.type === "general",
    };
  }

  return { viewError, errorMessagesFor, setError };
}
