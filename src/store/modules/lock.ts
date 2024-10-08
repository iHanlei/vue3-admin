import { defineStore } from 'pinia'
import { store } from '../index'

interface lockInfo {
  isLock?: boolean
  lockPassword?: string
}

interface LockState {
  lockInfo: lockInfo
}

export const useLockStore = defineStore('lock', {
  persist: false,
  state: (): LockState => {
    return {
      lockInfo: {
        isLock: false, // 是否锁定屏幕
        lockPassword: '' // 锁屏密码
      }
    }
  },
  getters: {
    getLockInfo(): lockInfo {
      return this.lockInfo
    }
  },
  actions: {
    setLockInfo(lockInfo: lockInfo) {
      this.lockInfo = lockInfo
    },
    resetLockInfo() {
      this.lockInfo = {}
    },
    unLock(password: string) {
      if (this.lockInfo?.lockPassword === password) {
        this.resetLockInfo()
        return true
      } else {
        return false
      }
    }
  }
})

export const useLockStoreWithOut = () => {
  return useLockStore(store)
}
