import type { App } from 'vue'
import Icon from './Icon.vue'

export const setupGlobCom = (app: App<Element>): void => {
  app.component('Icon', Icon)
}
