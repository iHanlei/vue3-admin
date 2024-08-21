import { defineStore } from 'pinia'
import { store } from '../index'
import { getEnumList } from '@/api/common'

export interface EnumState {
  enumList: object | any
}

export const useEnumStore = defineStore('enum', {
  persist: false,
  state: (): EnumState => {
    return {
      enumList: []
    }
  },
  actions: {
    getEnums() {
      return new Promise((resolve, reject) => {
        getEnumList()
          .then((res: any) => {
            if (res && res.code == 200) {
              this.enumList = res.data
            }
            resolve(res)
          })
          .catch((error: any) => {
            reject(error)
          })
      })
    }
  }
})

export const useEnumStoreWithOut = () => {
  return useEnumStore(store)
}
