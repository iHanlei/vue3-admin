import type { RouteRecordRaw } from 'vue-router'
import { defineComponent } from 'vue'

interface RouteMetaType extends Record<string | number | symbol, unknown> {
  hidden?: boolean // 当设置 true 的时候该路由不会再侧边栏出现 如404，login等页面(默认 false)
  alwaysShow?: boolean // 当一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式，设置为 true 时，一直显示根路由(默认 false)
  title?: string // 设置该路由在侧边栏和面包屑中展示的名字
  icon?: string // 设置该路由的图标
  noCache?: boolean // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
  breadcrumb?: boolean // 如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
  affix?: boolean //如果设置为true，则会一直固定在tag项中(默认 false)
  activeMenu?: string // 显示高亮的路由路径
  noTagsView?: boolean // 如果设置为true，则不会出现在tag中(默认 false)
  canTo?: boolean // 设置为true即使hidden为true，也依然可以进行路由跳转(默认 false)
}

declare module 'vue-router' {
  interface RouteMeta extends RouteMetaType {}
}

type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  name: string // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
  meta: RouteMetaType
  component?: Component | string
  children?: AppRouteRecordRaw[]
  props?: any
  fullPath?: string
}

export interface AppCustomRouteRecordRaw
  extends Omit<RouteRecordRaw, 'meta' | 'component' | 'children'> {
  permId: string
  permVal: string
  parentId: string
  child?: AppCustomRouteRecordRaw[]
}
