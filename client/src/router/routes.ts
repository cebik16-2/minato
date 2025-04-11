// src/router/routes.ts
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
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
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
