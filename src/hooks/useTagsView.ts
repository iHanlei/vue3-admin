import { useTagsViewStoreWithOut } from '@/store/modules/tagsView'
import { RouteLocationNormalizedLoaded, useRouter } from 'vue-router'
import { computed, nextTick, unref } from 'vue'
import { pathResolve } from '@/router/helper'
import { AppRouteRecordRaw } from '@/router/types'

export const useTagsView = () => {
  const tagsViewStore = useTagsViewStoreWithOut()

  const { replace, currentRoute } = useRouter()

  const selectedTag = computed(() => tagsViewStore.getSelectedTag)

  const closeAll = (callback?: Fn) => {
    tagsViewStore.delAllViews()
    callback?.()
  }

  const closeLeft = (callback?: Fn) => {
    tagsViewStore.delLeftViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
    callback?.()
  }

  const closeRight = (callback?: Fn) => {
    tagsViewStore.delRightViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
    callback?.()
  }

  const closeOther = (callback?: Fn) => {
    tagsViewStore.delOthersViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
    callback?.()
  }

  const closeCurrent = (view?: RouteLocationNormalizedLoaded, callback?: Fn) => {
    if (view?.meta?.affix) return
    tagsViewStore.delView(view || unref(currentRoute))

    callback?.()
  }

  const refreshPage = async (view?: RouteLocationNormalizedLoaded, callback?: Fn) => {
    tagsViewStore.delCachedView()
    const { path, query } = view || unref(currentRoute)
    await nextTick()
    replace({
      path: '/redirect' + path,
      query: query
    })
    callback?.()
  }

  const setTitle = (title: string, path?: string) => {
    tagsViewStore.setTitle(title, path)
  }

 const filterAffixTags = (routes: AppRouteRecordRaw[], parentPath = '') => {
    let tags: RouteLocationNormalizedLoaded[] = []
    routes.forEach((route) => {
      const meta = route.meta ?? {}
      const tagPath = pathResolve(parentPath, route.path)
      if (meta?.affix) {
        tags.push({ ...route, path: tagPath, fullPath: tagPath } as RouteLocationNormalizedLoaded)
      }
      if (route.children) {
        const tempTags: RouteLocationNormalizedLoaded[] = filterAffixTags(route.children, tagPath)
        if (tempTags.length >= 1) {
          tags = [...tags, ...tempTags]
        }
      }
    })
  
    return tags
  }

  return {
    closeAll,
    closeLeft,
    closeRight,
    closeOther,
    closeCurrent,
    refreshPage,
    setTitle,
    filterAffixTags
  }
}
