import router from './router'
import type { RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/useTitle'
import { useNProgress } from '@/hooks/useNProgress'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { usePageLoading } from '@/hooks/usePageLoading'
import { useStorage } from './hooks/useStorage'

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

const { getStorage } = useStorage('sessionStorage')

router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  const permissionStore = usePermissionStoreWithOut()
  if (getStorage('user')) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (permissionStore.getIsAddRouters) {
        next()
        return
      }

      await permissionStore.generateRoutes('static')

      permissionStore.getAddRouters.forEach((route) => {
        router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
      })
      permissionStore.setIsAddRouters(true)
      const redirectPath = from.query.redirect || to.path
      const redirect = decodeURIComponent(redirectPath as string)
      // 避免重定向回当前路径，只有在路径确实不同的情况下才重定向
      if (to.fullPath === redirect) {
        next()
      } else {
        next({ path: redirect, replace: true }) // 添加 replace:true，避免在历史记录中重复
      }
    }
  } else {
    const noRedirectWhiteList = ['/login']
    if (noRedirectWhiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
})
