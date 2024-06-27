<script setup lang="ts">
import { useFullscreen } from "@vueuse/core"
import { useDesign } from "@/hooks/useDesign"

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls("screenfull")

defineProps({
  color: {
    type: String,
    default: "",
  },
})

const { toggle, isFullscreen } = useFullscreen()

const toggleFullscreen = () => {
  toggle()
}
</script>

<template>
  <div :class="prefixCls" @click="toggleFullscreen">
    <Icon :size="18" :icon="isFullscreen ? 'zmdi:fullscreen-exit' : 'zmdi:fullscreen'" :color="color" />
  </div>
</template>
