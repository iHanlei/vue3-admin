<script lang="tsx">
import { computed, defineComponent, unref } from "vue"
import { useAppStore } from "@/store/modules/app"
import { useRenderLayout } from "./useRenderLayout"
import { useDesign } from "@/hooks/useDesign"
import { ElBacktop } from "element-plus"

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls("layout")

const appStore = useAppStore()

// 是否是移动端
const mobile = computed(() => appStore.getMobile)

// 菜单折叠
const collapse = computed(() => appStore.getCollapse)

const layout = computed(() => appStore.getLayout)

const handleClickOutside = () => {
  appStore.setCollapse(true)
}

const renderLayout = () => {
  // 暂时先只写一种布局模式, 后面空了有需求再补充其它布局
  switch (unref(layout)) {
    case "classic":
      const { renderClassic } = useRenderLayout()
      return renderClassic()
    default:
      break
  }
}

export default defineComponent({
  name: "Layout",
  setup() {
    return () => (
      <section class={[prefixCls, `${prefixCls}__${layout.value}`, "w-[100%] h-[100%] relative"]}>
        {mobile.value && !collapse.value ? (
          <div
            class="absolute top-0 left-0 w-full h-full opacity-30 z-99 bg-[var(--el-color-black)]"
            onClick={handleClickOutside}
          ></div>
        ) : undefined}

        {renderLayout()}

        <ElBacktop class={prefixCls} target={`.${prefixCls}-content-scrollbar .el-scrollbar__wrap`} />
      </section>
    )
  },
})
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{adminNamespace}-layout";

.@{prefix-cls} {
  background-color: var(--app-content-bg-color);
  .@{prefix-cls}-content-scrollbar {
    & > :deep(.el-scrollbar__wrap) {
      & > .@{elNamespace}-scrollbar__view {
        display: flex;
        height: 100% !important;
        flex-direction: column;
      }
    }
  }

  .layout-border__right::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background-color: var(--el-border-color);
    z-index: 3;
  }
}
</style>
