<script setup lang="ts">
import { computed, unref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('collapse')

defineProps({
  color: {
    type: String,
    default: ''
  }
})

const appStore = useAppStore()

const collapse = computed(() => appStore.getCollapse)

const toggleCollapse = () => {
  const collapsed = unref(collapse)
  appStore.setCollapse(!collapsed)
}
</script>

<template>
  <div :class="prefixCls" @click="toggleCollapse">
    <Icon
      :size="18"
      :icon="collapse ? 'ant-design:menu-unfold-outlined' : 'ant-design:menu-fold-outlined'"
      :color="color"
      class="cursor-pointer"
    />
  </div>
</template>
