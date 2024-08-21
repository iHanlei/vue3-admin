<script setup lang="ts">
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
  ElSelect,
  ElOption,
  ElRadioGroup,
  ElRadio,
  ElRadioButton,
  FormRules,
  FormInstance
} from 'element-plus'
import { addWorkOrder, getWorkOrderTypeList } from '@/api/work'
import { AddWorkOrderType } from '@/api/work/types'
import { computed, reactive, ref, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useEnumStore } from '@/store/modules/enum'
import { useValidator } from '@/hooks/useValidator'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const localeSuffix = computed(() => (locale.value === 'zh-CN' ? '' : 'En'))

const emit = defineEmits(['close', 'update'])

const appStore = useAppStore()
const mobile = computed(() => appStore.getMobile)

const props = defineProps({
  dialogShow: {
    type: Boolean,
    default: () => false
  }
})

watch(
  () => props.dialogShow,
  (val: boolean) => {
    dialogShowRef.value = val
  }
)

const enumStore = useEnumStore()
const enumWorkOrderLevel = computed(() => enumStore.enumList.EnumWorkOrderLevel)
const enumWorkOrderType = computed(() => enumStore.enumList.EnumWorkOrderType)
const enumBackstageType = computed(() => enumStore.enumList.EnumBackstageType)

const dynamicWorkOrderType = computed(() =>
  formData.backstageType
    ? enumWorkOrderType.value.filter((item) =>
        serverBackstageType.value
          .filter((itemServer) => itemServer.backstageType === formData.backstageType)
          .map((item2) => item2.workOrderType)
          .includes(item.code)
      )
    : []
)

const dynamicApproveUserList = computed(() =>
  formData.backstageType && formData.workOrderType
    ? serverBackstageType.value.find(
        (item) =>
          item.backstageType === formData.backstageType &&
          item.workOrderType === formData.workOrderType
      ).approveUserList
    : []
)

const dialogShowRef = ref<boolean>(false)

const formRef = ref<FormInstance>()

const formData = reactive<AddWorkOrderType>({
  id: '',
  email: '',
  backstageType: '',
  handlers: '',
  workOrderLevel: '',
  workOrderType: '',
  workOrderDesc: ''
})

const loading = ref<boolean>(false)

const { requiredValidator } = useValidator()

const formRules: FormRules = {
  id: [{ required: true, validator: requiredValidator }],
  email: [{ required: true, validator: requiredValidator }],
  backstageType: [{ required: true, message: t('common.required') }],
  handlers: [{ required: true, validator: requiredValidator }],
  workOrderType: [{ required: true, validator: requiredValidator }],
  workOrderLevel: [{ required: true, message: t('common.required') }]
}

const closeDialog = () => {
  formRef.value?.resetFields()
  emit('close')
}

const changeBackstageType = (e) => {
  if (
    !serverBackstageType.value
      .filter((itemServer) => itemServer.backstageType === e)
      .map((item2) => item2.workOrderType)
      .includes(formData.workOrderType)
  ) {
    formData.workOrderType = ''
    formData.handlers = ''
  }
}

const add = () => {
  formRef.value?.validate((isValid) => {
    if (isValid) {
      loading.value = true
      addWorkOrder(formData)
        .then((res) => {
          if (res && res.data) {
            ElMessage.success(t('common.addSuccess'))
            emit('update')
            closeDialog()
          }
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}

const serverBackstageType = ref()
const getList = () => {
  getWorkOrderTypeList({
    backstageType: formData.backstageType,
    workOrderType: formData.workOrderType
  }).then((res) => {
    if (res && res.data) {
      serverBackstageType.value = res.data
    }
  })
}

getList()
</script>

<template>
  <ElDialog
    v-model="dialogShowRef"
    :title="t('新建工单')"
    :width="mobile ? '90%' : '500'"
    :close-on-click-modal="false"
    destroy-on-close
    @close="closeDialog"
  >
    <ElForm ref="formRef" :model="formData" :rules="formRules" label-position="top">
      <ElFormItem :label="t('关联平台')" prop="backstageType">
        <ElRadioGroup v-model="formData.backstageType" @change="changeBackstageType">
          <ElRadioButton
            v-for="item in enumBackstageType"
            :key="item.code"
            :label="item[`name${localeSuffix}`]"
            :value="item.code"
          />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="t('工单类型')" prop="workOrderType">
        <ElRadioGroup v-model="formData.workOrderType">
          <ElRadio
            class="w-full"
            v-for="item in dynamicWorkOrderType"
            :key="item.code"
            :label="item[`name${localeSuffix}`]"
            :value="item.code"
          />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="t('账号ID')" prop="id">
        <ElInput v-model="formData.id" :placeholder="t('common.inputText')" size="large" />
      </ElFormItem>
      <ElFormItem :label="t('账号邮箱')" prop="email">
        <ElInput v-model="formData.email" :placeholder="t('common.inputText')" size="large" />
      </ElFormItem>
      <ElFormItem :label="t('紧要程度')" prop="workOrderLevel">
        <ElSelect v-model="formData.workOrderLevel" size="large" class="w-full">
          <ElOption
            v-for="item in enumWorkOrderLevel"
            :key="item.code"
            :label="item[`name${localeSuffix}`]"
            :value="item.code"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="t('处理人')" prop="handlers">
        <ElSelect v-model="formData.handlers" size="large" class="w-full">
          <ElOption
            v-for="item in dynamicApproveUserList"
            :key="item.approveUserId"
            :label="item.approveUserEmail"
            :value="item.approveUserId"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="t('备注')" prop="workOrderDesc">
        <ElInput
          v-model="formData.workOrderDesc"
          type="textarea"
          resize="none"
          :autosize="{ minRows: 3 }"
          :placeholder="t('common.inputText')"
          size="large"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="flex">
        <ElButton size="large" class="flex-1" @click="closeDialog">
          {{ t('common.cancel') }}
        </ElButton>
        <ElButton type="primary" :loading="loading" class="flex-1" size="large" @click="add">
          {{ t('common.ok') }}
        </ElButton>
      </div>
    </template>
  </ElDialog>
</template>
