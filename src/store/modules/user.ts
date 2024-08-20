import { defineStore } from "pinia"
import { store } from "../index"
import { ElMessageBox } from "element-plus"
import i18n from '@/locales'
import { useTagsViewStore } from "./tagsView"
import router from "@/router"
import { AppCustomRouteRecordRaw } from "@/router/types"
import { useStorage } from "@/hooks/useStorage"

interface UserState {
  userInfo?: any
  tokenKey: string
  token: string
  roleRouters?: string[] | AppCustomRouteRecordRaw[]
  rememberMe: boolean
}

const { setStorage } = useStorage('sessionStorage')

export const useUserStore = defineStore("user", {
  state: (): UserState => {
    return {
      userInfo: undefined,
      tokenKey: "Authorization",
      token: "",
      roleRouters: undefined,
      // 记住我
      rememberMe: true,
    }
  },
  getters: {
    getTokenKey(): string {
      return this.tokenKey
    },
    getToken(): string {
      return this.token
    },
    getUserInfo(): any | undefined {
      return this.userInfo
    },
    getRoleRouters(): string[] | AppCustomRouteRecordRaw[] | undefined {
      return this.roleRouters
    },
    getRememberMe(): boolean {
      return this.rememberMe
    },
  },
  actions: {
    setTokenKey(tokenKey: string) {
      this.tokenKey = tokenKey
    },
    setToken(token: string) {
      this.token = token
    },
    setUserInfo(userInfo?: any) {
      this.userInfo = userInfo
      setStorage('user', userInfo)
    },
    setRoleRouters(roleRouters: string[] | AppCustomRouteRecordRaw[]) {
      this.roleRouters = roleRouters
    },
    logoutConfirm() {
      const { t } = i18n.global
      ElMessageBox.confirm(t("common.loginOutMessage"), t("common.reminder"), {
        confirmButtonText: t("common.ok"),
        cancelButtonText: t("common.cancel"),
        type: "warning",
      })
        .then(() => {
          this.reset()
        })
        .catch(() => {})
    },
    reset() {
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews()
      this.setToken("")
      this.setUserInfo(undefined)
      this.setRoleRouters([])
      router.replace("/login")
    },
    logout() {
      this.reset()
    },
    setRememberMe(rememberMe: boolean) {
      this.rememberMe = rememberMe
    },
  },
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
