import { ElSubMenu, ElMenuItem } from "element-plus"
import { hasOneShowingChild } from "./helper"
import { isUrl } from "@/utils/is"
import { useRenderMenuTitle } from "./useRenderMenuTitle"
import { pathResolve } from "@/router/helper"
import { AppRouteRecordRaw } from "@/router/types"

const { renderMenuTitle } = useRenderMenuTitle()

export const useRenderMenuItem = () => {
  const renderMenuItem = (routers: AppRouteRecordRaw[], parentPath = "/") => {
    return routers
      .filter(v => !v.meta?.hidden)
      .map(v => {
        const meta = v.meta ?? {}
        const { oneShowingChild, onlyOneChild } = hasOneShowingChild(v.children, v)
        const fullPath = isUrl(v.path) ? v.path : pathResolve(parentPath, v.path)

        if (oneShowingChild && (!onlyOneChild?.children || onlyOneChild?.noShowingChildren) && !meta?.alwaysShow) {
          return (
            <ElMenuItem index={onlyOneChild ? pathResolve(fullPath, onlyOneChild.path) : fullPath}>
              {{
                default: () => renderMenuTitle(onlyOneChild ? onlyOneChild?.meta : meta),
              }}
            </ElMenuItem>
          )
        } else {
          return (
            <ElSubMenu index={fullPath}>
              {{
                title: () => renderMenuTitle(meta),
                default: () => renderMenuItem(v.children!, fullPath),
              }}
            </ElSubMenu>
          )
        }
      })
  }

  return {
    renderMenuItem,
  }
}
