import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout } from './helper'
import { AppRouteRecordRaw } from './types'

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/work-order',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/work-order',
    component: Layout,
    redirect: '/work-order/list',
    name: 'WorkOrderManagement',
    meta: {
      title: 'router.workOrderManagement',
      icon: 'fluent:task-list-square-16-regular'
    },
    children: [
      {
        path: 'list',
        name: 'WorkOrderList',
        component: () => import('@/views/WorkOrder/WorkOrderList.vue'),
        meta: {
          title: 'router.workOrderList'
        }
      },
      {
        path: 'handle',
        name: 'HandleWorkOrder',
        component: () => import('@/views/WorkOrder/HandleWorkOrder.vue'),
        meta: {
          title: 'router.handleWorkOrder'
        }
      },
      {
        path: 'my',
        name: 'MyWorkOrder',
        component: () => import('@/views/WorkOrder/MyWorkOrder.vue'),
        meta: {
          title: 'router.myWorkOrder'
        }
      },
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: 'router.login',
      noTagsView: true
    }
  },
  {
    path: '/403',
    component: () => import('@/views/Error/403.vue'),
    name: '403Page',
    meta: {
      hidden: true,
      title: '403',
      noTagsView: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/Error/404.vue'),
    name: '404Page',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/500',
    component: () => import('@/views/Error/500.vue'),
    name: '500Page',
    meta: {
      hidden: true,
      title: '500',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = []

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Root', 'Redirect', 'Login', '403Page', '404Page']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router