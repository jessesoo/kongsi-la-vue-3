import { useAuthStore } from "@/stores/auth";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import InventoryView from "../views/InventoryView.vue";
import LoginView from "../views/LoginView.vue";
import NewProductView from "../views/NewProductView.vue";
import NewRolesView from "../views/NewRolesView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import ProductView from "../views/ProductView.vue";
import RolesView from "../views/RolesView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      children: [
        {
          path: "/inventory",
          name: "inventory",
          component: InventoryView,
          meta: {
            auth: true,
          },
        },
        {
          path: "/new-product",
          name: "new-product",
          component: NewProductView,
          meta: {
            auth: true,
          },
        },
        {
          path: "/new-roles",
          name: "new-roles",
          component: NewRolesView,
          meta: {
            auth: true,
          },
        },
        {
          path: "/product/:id",
          name: "product",
          component: ProductView,
          meta: {
            auth: true,
          },
        },
        {
          path: "/roles",
          name: "roles",
          component: RolesView,
          meta: {
            auth: true,
          },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/404",
      name: "notFound",
      component: NotFoundView,
    },
    {
      path: "/:pathMatch(.*)*",
      component: NotFoundView,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const { isLoggedIn } = useAuthStore();
  const isAuthRequired = to.matched.some((record) => record.meta.auth);

  if (isAuthRequired && !isLoggedIn) {
    next({ name: "login" });
    return;
  }

  if (isLoggedIn && to.name === "login") {
    next({ name: "inventory" });
    return;
  }

  if (to.path === "/") {
    next({ name: "inventory" });
    return;
  }

  next();
});

export default router;
