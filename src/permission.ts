import router from './router'
import type { RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/useTitle'
import { useNProgress } from '@/hooks/useNProgress'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { usePageLoading } from '@/hooks/usePageLoading'
import { useStorage } from './hooks/useStorage'
import { useEnumStoreWithOut } from './store/modules/enum'

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

const { getStorage } = useStorage('sessionStorage')

router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  const permissionStore = usePermissionStoreWithOut()
  const enumStore = useEnumStoreWithOut()

  if (getStorage('token')) {
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
      const redirectPath = from.query.redirect || to.path
      const redirect = decodeURIComponent(redirectPath as string)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
      permissionStore.setIsAddRouters(true)
      // 更新枚举
      await enumStore.getEnums()
      next(nextData)
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
