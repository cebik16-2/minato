// src/router/routes.ts
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'landing',
        component: () => import('pages/LandingPage.vue')
      },
      {
        path: 'my-account',
        name: 'marketplace',
        component: () => import('pages/MarketplacePage.vue')
      },
      {
        path: 'product/:id',
        name: 'product-detail',
        component: () => import('pages/ProductDetailPage.vue'),
        props: true
      },
      {
        path: 'products/new',
        name: 'product-create',
        component: () => import('pages/ProductCreatePage.vue'),
        meta: { requiresAuth: true } // Only authenticated users can create products
      },
      {
        path: 'account',
        name: 'account',
        component: () => import('pages/AccountPage.vue'),
        meta: { requiresAuth: true } // Only authenticated users can access account page
      },
      {
        path: '/auth/callback',
        component: () => import('pages/AuthCallback.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
