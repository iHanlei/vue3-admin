<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { computed } from 'vue'
import { useDesign } from '@/hooks/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('footer')

const appStore = useAppStore()

const title = computed(() => appStore.getTitle)
</script>

<template>
  <div
    :class="prefixCls"
    class="shrink-0 text-center text-[var(--el-text-color-placeholder)] bg-[var(--app-content-bg-color)] h-[var(--app-footer-height)] leading-[var(--app-footer-height)] dark:bg-[var(--el-bg-color)]"
  >
    Copyright ©2022-present {{ title }}
  </div>
</template>
