import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";

import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from "./App.vue";
import router from "./router";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

import en from "./i18n/en";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(
  createI18n({
    legacy: false,
    locale: "en",
    availableLocales: ["en"],
    fallbackLocale: "en",
    messages: { en },
  })
);
app.use(router);

const themeLight = {
  dark: false,
  colors: {
    primary: "#2962FF",
    background: "#ECEFF1",
    secondaryText: "#999999",
    rowHover: "#EEEEEE",
    breadcrumb: "#333333",
    formButton: "#2962FF",
    formButtonWarning: "#D50000",
    success: "#00BFA5",
    warning: "#B71C1C",
  },
};

const themeDark = {
  dark: true,
  colors: {
    primary: "#2962FF",
    background: "#111111",
    secondaryText: "#EEEEEE",
    rowHover: "#EEEEEE",
    breadcrumb: "#FFFFFF",
    formButton: "#2962FF",
    formButtonWarning: "#D50000",
    success: "#00BFA5",
    warning: "#B71C1C",
  },
};

app.use(
  createVuetify({
    theme: {
      defaultTheme: "light",
      themes: {
        light: themeLight,
        dark: themeDark,
      },
    },
    components,
    directives,
  })
);

app.mount("#app");
