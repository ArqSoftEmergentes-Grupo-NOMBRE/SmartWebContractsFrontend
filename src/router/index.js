import { createRouter, createWebHistory } from 'vue-router'
import loginView from "@/views/login.view.vue";
import registerView from "@/views/register.view.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: loginView,
    },
    {
      path: '/register',
      name: 'register',
      component: registerView,
    },


    {
      path: '/clients/dashboard',
      name: 'clients dashboard',
      component: () => import('@/views/clients/dashboard.view.vue'),
    },
    {
      path: "/clients/profile",
      name: "clients profile",
      component: () => import('@/views/clients/profile.view.vue'),
    },


    {
      path: "/developers/dashboard",
      name: "developers dashboard",
      component: () => import('@/views/developers/dashboard.view.vue'),
    },
    {
      path: "/developers/profile",
      name: "developers profile",
      component: () => import('@/views/developers/profile.view.vue'),
    }
  ],
})

export default router
