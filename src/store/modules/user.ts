import { defineStore } from 'pinia'
import { store } from '../index'
import { ElMessageBox } from 'element-plus'
import i18n from '@/locales'
import router from '@/router'
import { getUserInfo } from '@/api/user'
import type { UserInfoType } from '@/api/user/types'
import { useTagsViewStore } from './tagsView'
import { useStorage } from '@/hooks/useStorage'

interface UserState {
  userInfo?: UserInfoType
  rememberMe: boolean
}

const { setStorage, getStorage, removeStorage } = useStorage('sessionStorage')

export const useUserStore = defineStore('user', {
  persist: false,
  state: (): UserState => {
    return {
      userInfo: getStorage('user') || undefined,
      // 记住我
      rememberMe: true
    }
  },
  getters: {
    getUserInfo(): any | undefined {
      return this.userInfo
    },
    getRememberMe(): boolean {
      return this.rememberMe
    }
  },
  actions: {
    setToken(token: string) {
      setStorage('token', token)
    },
    setUserInfo() {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res: any) => {
            this.userInfo = res.data
            setStorage('user', res.data)
            resolve(res)
          })
          .catch((error: any) => {
            reject(error)
          })
      })
    },
    logoutConfirm() {
      const { t } = i18n.global
      ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.reset()
        })
        .catch(() => {})
    },
    reset() {
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews()
      removeStorage('token')
      removeStorage('user')
      router.replace('/login')
    },
    logout() {
      this.reset()
    },
    setRememberMe(rememberMe: boolean) {
      this.rememberMe = rememberMe
    }
  }
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
