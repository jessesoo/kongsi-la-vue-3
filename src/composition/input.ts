import { computed } from "vue";
import { useI18n } from "vue-i18n";

export function useInput() {
  const { t } = useI18n();

  const ruleIfNull = computed(() => {
    return <T>(errorName: string) => {
      return (val: T | null) => {
        return val == null ? t(errorName) : true;
      };
    };
  });

  return { ruleIfNull };
}
