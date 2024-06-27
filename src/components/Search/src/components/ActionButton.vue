<script setup lang="ts">
import { useIcon } from "@/hooks/useIcon"
import { useI18n } from "vue-i18n"

const emit = defineEmits(["search", "reset", "expand"])

const { t } = useI18n()

defineProps({
  showSearch: {
    type: Boolean,
    default: true,
  },
  showReset: {
    type: Boolean,
    default: true,
  },
  showExpand: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  searchLoading: {
    type: Boolean,
    default: false,
  },
  resetLoading: {
    type: Boolean,
    default: false,
  },
})

const onSearch = () => {
  emit("search")
}

const onReset = () => {
  emit("reset")
}

const onExpand = () => {
  emit("expand")
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
    {{ t("common.search") }}
  </ElButton>
  <ElButton
    v-if="showReset"
    :loading="resetLoading"
    plain
    :icon="useIcon({ icon: 'ep:refresh-right' })"
    @click="onReset"
  >
    {{ t("common.reset") }}
  </ElButton>
  <ElButton
    v-if="showExpand"
    :icon="useIcon({ icon: visible ? 'ep:arrow-up' : 'ep:arrow-down' })"
    text
    @click="onExpand"
  >
    {{ t(visible ? "common.shrink" : "common.expand") }}
  </ElButton>
</template>
