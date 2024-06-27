<script lang="tsx">
import { defineComponent, computed } from "vue"
import { useAppStore } from "@/store/modules/app"
import { useDesign } from "@/hooks/useDesign"
import Collapse from "./ToolHeader/Collapse.vue"
import LocaleDropdown from "./ToolHeader/LocaleDropdown.vue"
import UserInfo from "./ToolHeader/UserInfo.vue"
import ScreenFull from "./ToolHeader/ScreenFull.vue"
import Breadcrumb from "./ToolHeader/Breadcrumb.vue"

const { getPrefixCls, variables } = useDesign()

const prefixCls = getPrefixCls("tool-header")

const appStore = useAppStore()

// 面包屑
const breadcrumb = computed(() => appStore.getBreadcrumb)

// 折叠图标
const hamburger = computed(() => appStore.getHamburger)

// 全屏图标
const screenFull = computed(() => appStore.getScreenFull)

// 多语言图标
const locale = computed(() => appStore.getLocale)

export default defineComponent({
  name: "ToolHeader",
  setup() {
    return () => (
      <div
        id={`${variables.namespace}-tool-header`}
        class={[
          prefixCls,
          "h-[var(--top-tool-height)] relative px-0 flex items-center justify-between",
        ]}
      >
        <div class="h-full flex items-center">
          {hamburger.value ? (
            <Collapse class="custom-hover" color="var(--top-header-text-color)"></Collapse>
          ) : undefined}
          {breadcrumb.value ? <Breadcrumb class="<md:hidden"></Breadcrumb> : undefined}
        </div>
        <div class="h-full flex items-center">
          {screenFull.value ? (
            <ScreenFull class="custom-hover" color="var(--top-header-text-color)"></ScreenFull>
          ) : undefined}
          {locale.value ? (
            <LocaleDropdown class="custom-hover" color="var(--top-header-text-color)"></LocaleDropdown>
          ) : undefined}
          <UserInfo></UserInfo>
        </div>
      </div>
    )
  },
})
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{adminNamespace}-tool-header";

.@{prefix-cls} {
  transition: left 0.2s;
}

.custom-hover {
  display: flex;
  height: 100%;
  padding: 1px 10px 0;
  cursor: pointer;
  align-items: center;
  transition: background 0.2s;
  &:hover {
    background-color: var(--top-header-hover-color);
  }
}
</style>
