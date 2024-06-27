<script setup lang="ts">
import { reactive, ref, watch } from "vue"
import type { FormInstance, FormRules } from "element-plus"
import type { LoginType } from "@/api/user/types"
import { useStorage } from "@/hooks/useStorage"
import { usePermissionStore } from "@/store/modules/permission"
import { RouteLocationNormalizedLoaded, RouteRecordRaw, useRouter } from "vue-router"
import { useAppStore } from "@/store/modules/app"
import { useUserStore } from "@/store/modules/user"
import { useValidator } from "@/hooks/useValidator"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const permissionStore = usePermissionStore()

const { currentRoute, addRoute, push } = useRouter()

const appStore = useAppStore()

const userStore = useUserStore()

const formRef = ref<FormInstance>()

const { setStorage, getStorage, removeStorage } = useStorage("localStorage")
const localUsername = ref<string>(getStorage("lu") || "")
const localPassword = ref<string>(getStorage("lp") || "")

const formData = reactive<LoginType>({
  username: localUsername.value,
  password: localPassword.value,
})

const { requiredValidator } = useValidator()

const formRules: FormRules = {
  username: [{ validator: requiredValidator }],
  password: [{ validator: requiredValidator }],
}

const remember = ref(getStorage("lu") ? true : false)

const redirect = ref<string>("")

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true,
  }
)

const loading = ref(false)

// 登录
const signIn = () => {
  formRef.value?.validate(async isValid => {
    if (isValid) {
      loading.value = true
      try {
        // 记住密码
        if (remember.value) {
          setStorage("lu", formData.username)
          setStorage("lp", formData.password)
        } else {
          removeStorage("lu")
          removeStorage("lp")
        }

        userStore.setUserInfo({
          userId: '1001',
          username: 'Evan'
        })

        // 是否使用动态路由
        if (appStore.getDynamicRouter) {
          //...
        } else {
          await permissionStore.generateRoutes("static").catch(() => {})
          // 动态添加可访问路由表
          permissionStore.getAddRouters.forEach(route => {
            addRoute(route as RouteRecordRaw)
          })
          permissionStore.setIsAddRouters(true)
          push({ path: redirect.value || permissionStore.addRouters[0].path })
        }
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="m-auto w-[100%] max-w-500px relative top-1/2 transform -translate-y-1/2">
    <h2 class="text-2xl font-bold text-center w-[100%]">{{ t("login.login") }}</h2>
    <ElForm ref="formRef" size="large" :model="formData" :rules="formRules" label-position="top">
      <ElFormItem :label="t('login.account')" prop="username">
        <ElInput v-model.trim="formData.username" :placeholder="t('common.inputText')" size="large" />
      </ElFormItem>

      <ElFormItem :label="t('login.password')" prop="password">
        <ElInput
          v-model.trim="formData.password"
          :placeholder="t('common.inputText')"
          :show-password="true"
          type="password"
          size="large"
          autocomplete="new-password"
        />
      </ElFormItem>

      <ElFormItem>
        <div class="flex justify-between items-center w-[100%]">
          <ElCheckbox v-model="remember" :label="t('login.remember')" size="small" />
        </div>
      </ElFormItem>

      <ElFormItem>
        <ElButton :loading="loading" type="primary" class="w-[100%]" @click="signIn">
          {{ t("login.login") }}
        </ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style lang="less" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
</style>
