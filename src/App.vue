<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useI18n } from 'vue-i18n'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { useWindowSize } from '@vueuse/core'
import { useDesign } from '@/hooks/useDesign'
import { setCssVar } from './utils'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('app')

// 多语言相关
const { locale } = useI18n()

const appStore = useAppStore()

const greyMode = computed(() => appStore.getGreyMode)

appStore.initTheme()

const { width } = useWindowSize()

// 初始化所有主题色
onMounted(() => {
  appStore.setCssVarTheme()
})

// 监听窗口变化
watch(
  () => width.value,
  (width: number) => {
    if (width < 768) {
      !appStore.getMobile ? appStore.setMobile(true) : undefined
      setCssVar('--left-menu-min-width', '0')
      appStore.setCollapse(true)
      appStore.getLayout !== 'classic' ? appStore.setLayout('classic') : undefined
    } else {
      appStore.getMobile ? appStore.setMobile(false) : undefined
      setCssVar('--left-menu-min-width', '64px')
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <ElConfigProvider :locale="locale === 'zh-CN' ? zhCn : en">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
  </ElConfigProvider>
</template>

<style lang="less">
@prefix-cls: ~'@{adminNamespace}-app';
html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;

  #app {
    width: 100%;
    height: 100%;
  }
}

.@{prefix-cls}-grey-mode {
  filter: grayscale(100%);
}
</style>
