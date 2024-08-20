<script setup lang="ts">
import { ref } from "vue"
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from "element-plus"
import { useStorage } from "@/hooks/useStorage"
import { useI18n } from "vue-i18n"
import { useDesign } from "@/hooks/useDesign"

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls("locale-dropdown")

defineProps({
  color: {
    type: String,
    default: "",
  },
})

const { locale } = useI18n()

const { setStorage, getStorage } = useStorage("localStorage")

const language = ref<string>(getStorage("lang") === "zh-CN" ? "简体中文" : "English")

const setLang = (lang: "zh-CN" | "en") => {
  if (locale.value === lang) return
  locale.value = lang
  language.value = lang === "zh-CN" ? "简体中文" : "English"
  setStorage("lang", lang)
  // 需要重新加载页面让整个系统都初始化
  // window.location.reload()
}
</script>

<template>
  <ElDropdown :class="prefixCls" trigger="click" @command="setLang">
    <div class="flex items-center cursor-pointer">
      <Icon :size="18" icon="mdi:language" class="mr-1" :color="color" />
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem command="en">English</ElDropdownItem>
        <ElDropdownItem command="zh-CN">简体中文</ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
