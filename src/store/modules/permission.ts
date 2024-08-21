import { defineStore } from 'pinia'
import { constantRouterMap } from '@/router'
import { generateRoutesByServer, flatMultiLevelRoutes } from '@/router/helper'
import { store } from '../index'
import { cloneDeep } from 'lodash-es'
import { AppCustomRouteRecordRaw, AppRouteRecordRaw } from '@/router/types'

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  menuTabRouters: AppRouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  persist: {
    paths: ['routers', 'addRouters', 'menuTabRouters']
  },
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: []
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {
    generateRoutes(
      type: 'server' | 'static',
      routers?: AppCustomRouteRecordRaw[] | string[]
    ): Promise<unknown> {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = []
        if (type === 'server') {
          // 模拟后端过滤菜单
          routerMap = generateRoutesByServer(routers as AppCustomRouteRecordRaw[])
        } else {
          // 直接读取静态路由表
          routerMap = cloneDeep(constantRouterMap)
        }
        // 动态路由，404一定要放到最后面
        this.addRouters = cloneDeep(routerMap)
        // 渲染菜单的所有路由
        this.routers = cloneDeep(routerMap)
        resolve()
      })
    },
    setIsAddRouters(state: boolean): void {
      this.isAddRouters = state
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    }
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
