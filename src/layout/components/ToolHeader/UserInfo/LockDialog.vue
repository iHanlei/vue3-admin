<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { ref } from "vue"
import { useValidator } from "@/hooks/useValidator"
import { reactive, computed } from "vue"
import { useDesign } from "@/hooks/useDesign"
import { useLockStore } from "@/store/modules/lock"
import Dialog from "@/components/Dialog.vue"

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls("lock-dialog")

const { requiredValidator } = useValidator()

const { t } = useI18n()

const lockStore = useLockStore()

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
})

const emit = defineEmits(["update:modelValue"])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: val => {
    emit("update:modelValue", val)
  },
})

const dialogTitle = ref(t("lock.lockScreen"))

const formRef = ref()

const formData = reactive({
  lockPassword: "",
})

const formRules = reactive({
  lockPassword: [{ required: true, validator: requiredValidator }],
})

const handleLock = async () => {
  formRef.value?.validate((isValid) => {
    if (isValid) {
      dialogVisible.value = false
      lockStore.setLockInfo({
        isLock: true,
        ...formData,
      })
    }
  })
}
</script>

<template>
  <Dialog v-model="dialogVisible" width="500px" max-height="170px" :class="prefixCls" :title="dialogTitle">
    <div class="flex flex-col items-center">
      <img src="@/assets/svgs/avatar.svg" alt="" class="w-70px h-70px rounded-[50%]" />
      <span class="text-14px my-10px text-[var(--top-header-text-color)]">Evan</span>
    </div>
    <ElForm ref="formRef" :model="formData" :rules="formRules">
      <ElFormItem :label="t('lock.lockPassword')" prop="lockPassword">
        <ElInput
          v-model.trim="formData.lockPassword"
          v-input="'Z+'"
          :placeholder="t('common.inputText')"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton type="primary" @click="handleLock">{{ t("lock.lock") }}</ElButton>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
:global(.v-lock-dialog) {
  @media (width <= 767px) {
    max-width: calc(100vw - 16px);
  }
}
</style>
