import { createI18n } from 'vue-i18n'
import type { App } from 'vue'

import zhLocale from './zh-CN'
import enLocale from './en'

import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

import { useStorage } from '@/hooks/useStorage'

const messages: Record<string, any> = {
  'zh-CN': {
    ...zhLocale,
    ...zhCn
  },
  en: {
    ...enLocale,
    ...en
  }
}

const { getStorage } = useStorage('localStorage')

const i18n: any = createI18n({
  legacy: false,
  locale: getStorage('lang') || 'en',
  messages: messages
})

export default i18n

export const setupI18n = (app: App) => {
  app.use(i18n)
}
