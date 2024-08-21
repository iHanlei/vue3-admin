<script setup lang="ts">
import { useIcon } from '@/hooks/useIcon'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['search', 'reset', 'expand'])

const { t } = useI18n()

defineProps({
  // 是否显示搜索按钮
  showSearch: {
    type: Boolean,
    default: true
  },
  // 是否显示重置按钮
  showReset: {
    type: Boolean,
    default: true
  },
  // 是否显示展开/收起按钮
  showExpand: {
    type: Boolean,
    default: false
  },
  // 展开/收起状态
  visible: {
    type: Boolean,
    default: true
  },
  // 搜索按钮加载状态
  searchLoading: {
    type: Boolean,
    default: false
  },
  // 重置按钮加载状态
  resetLoading: {
    type: Boolean,
    default: false
  }
})

const onSearch = () => {
  emit('search')
}

const onReset = () => {
  emit('reset')
}

const onExpand = () => {
  emit('expand')
}
</script>

<template>
  <ElButton
    v-if="showSearch"
    type="primary"
    :loading="searchLoading"
    :icon="useIcon({ icon: 'ep:search' })"
    @click="onSearch"
  >
    {{ t('common.search') }}
  </ElButton>
  <ElButton
    v-if="showReset"
    :loading="resetLoading"
    plain
    :icon="useIcon({ icon: 'ep:refresh-right' })"
    @click="onReset"
  >
    {{ t('common.reset') }}
  </ElButton>
  <ElButton
    v-if="showExpand"
    :icon="useIcon({ icon: visible ? 'ep:arrow-down' : 'ep:arrow-up' })"
    text
    @click="onExpand"
  >
    {{ t(visible ? 'common.expand' : 'common.shrink') }}
  </ElButton>
</template>
