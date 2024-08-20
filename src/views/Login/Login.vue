<script setup lang="ts">
import { reactive, ref, watch } from "vue"
import type { FormInstance, FormRules } from "element-plus"
import { useStorage } from "@/hooks/useStorage"
import { RouteLocationNormalizedLoaded, useRouter } from "vue-router"
import { useUserStore } from "@/store/modules/user"
import { useValidator } from "@/hooks/useValidator"
import { useI18n } from "vue-i18n"
import CryptoJS from 'crypto-js'

const { t } = useI18n()

const { currentRoute, push } = useRouter()

const userStore = useUserStore()

const formRef = ref<FormInstance>()

const passphrase = 'PlanX-Party'
const { setStorage, getStorage, removeStorage } = useStorage('localStorage')
const localUsername = ref<string>(
  getStorage('lu')
    ? CryptoJS.AES.decrypt(getStorage('lu'), passphrase).toString(CryptoJS.enc.Utf8)
    : ''
)
const localPassword = ref<string>(
  getStorage('lp')
    ? CryptoJS.AES.decrypt(getStorage('lp'), passphrase).toString(CryptoJS.enc.Utf8)
    : ''
)

const formData = reactive<any>({
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
            setStorage('lu', CryptoJS.AES.encrypt(formData.username, passphrase).toString())
            setStorage('lp', CryptoJS.AES.encrypt(formData.password, passphrase).toString())
          } else {
            removeStorage('lu')
            removeStorage('lp')
          }

        userStore.setUserInfo({
          userId: '1001',
          username: 'Evan'
        })

        push({ path: redirect.value || '/' })
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
