import type { RouteMeta } from "vue-router"
import i18n from '@/locales'
import Icon from "@/components/Icon.vue"

export const useRenderMenuTitle = () => {
  const renderMenuTitle = (meta: RouteMeta) => {
    const { t } = i18n.global
    const { title = "Please set title", icon } = meta

    return icon ? (
      <>
        <Icon icon={meta.icon}></Icon>
        <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">{t(title as string)}</span>
      </>
    ) : (
      <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">{t(title as string)}</span>
    )
  }

  return {
    renderMenuTitle,
  }
}
