<script setup lang="ts">
import { computed, unref } from "vue"
import { ElIcon } from "element-plus"
import { Icon } from "@iconify/vue"
import { useDesign } from '@/hooks/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('icon')

const props = defineProps({
  // icon标识
  icon: {
    type: String,
    required: true,
    default: "",
  },
  // icon颜色
  color: {
    type: String,
  },
  // hover颜色
  hoverColor: {
    type: String,
    default: "",
  },
  // icon大小
  size: {
    type: Number,
    default: 16,
  }
})

const isLocal = computed(() => props.icon.startsWith("svg:"))

const symbolId = computed(() => {
  return unref(isLocal) ? `#icon-${props.icon.split("svg:")[1]}` : props.icon
})

// 是否使用在线图标
const isUseOnline = computed(() => {
  return import.meta.env.VITE_USE_ONLINE_ICON === "true"
})

const getIconifyStyle = computed(() => {
  const { color, size } = props
  return {
    fontSize: `${size}px`,
    color,
  }
})
</script>

<template>
  <ElIcon :class="prefixCls" :size="size" :color="color">
    <svg v-if="isLocal" aria-hidden="true">
      <use :xlink:href="symbolId" />
    </svg>

    <template v-else>
      <Icon v-if="isUseOnline" :icon="icon" :style="getIconifyStyle" />
      <div v-else :class="`${icon} iconify`" :style="getIconifyStyle"></div>
    </template>
  </ElIcon>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-icon';

.@{prefix-cls},
.iconify {
  :deep(svg) {
    &:hover {
      // stylelint-disable-next-line
      color: v-bind(hoverColor) !important;
    }
  }
}

.iconify {
  &:hover {
    // stylelint-disable-next-line
    color: v-bind(hoverColor) !important;
  }
}
</style>
