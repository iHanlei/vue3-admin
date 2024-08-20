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
import { addWorkOrder } from '@/api/work'
import { AddWorkOrderType } from '@/api/work/types'
import { computed, reactive, ref, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useValidator } from '@/hooks/useValidator'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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

const enumUrgency = [
  {
    name: t('重要'),
    code: 1
  },
  {
    name: t('紧急'),
    code: 2
  },
  {
    name: t('普通'),
    code: 3
  },
  {
    name: t('较低'),
    code: 4
  }
]

const dialogShowRef = ref<boolean>(false)

const formRef = ref<FormInstance>()

const formData = reactive<AddWorkOrderType>({
  relatedPlatforms: '',
  handleItem: '',
  userId: '',
  userEmail: '',
  urgency: '',
  handleUser: '',
  remark: ''
})

const loading = ref<boolean>(false)

const { requiredValidator } = useValidator()

const formRules: FormRules = {
  relatedPlatforms: [{ required: true, message: t('common.required') }],
  handleItem: [{ required: true, validator: requiredValidator }],
  userId: [{ required: true, validator: requiredValidator }],
  userEmail: [{ required: true, validator: requiredValidator }],
  handleUser: [{ required: true, validator: requiredValidator }],
  urgency: [{ required: true, message: t('common.required') }]
}

const closeDialog = () => {
  formRef.value?.resetFields()
  emit('close')
}

const changeRelatedPlatforms = (e) => {
  if ((e === 'merchant' || e === 'agent') && formData.handleItem === '3') {
    formData.handleItem = ''
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

const handleUserList = ref()
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
      <ElFormItem :label="t('关联平台')" prop="relatedPlatforms">
        <ElRadioGroup v-model="formData.relatedPlatforms" @change="changeRelatedPlatforms">
          <ElRadioButton label="merchant">商户端</ElRadioButton>
          <ElRadioButton label="agent">代理端</ElRadioButton>
          <ElRadioButton label="operator">运营端</ElRadioButton>
          <ElRadioButton label="platform">平台端</ElRadioButton>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="t('工单处理项')" prop="handleItem">
        <ElRadioGroup v-model="formData.handleItem">
          <ElRadio label="1" class="w-full">重置账号密码</ElRadio>
          <ElRadio label="2" class="w-full">重置账号Google</ElRadio>
          <ElRadio
            label="3"
            class="w-full"
            v-if="
              formData.relatedPlatforms === 'operator' || formData.relatedPlatforms === 'platform'
            "
          >
            开启账号绑定Google和认证使用
          </ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem :label="t('账号ID')" prop="userId">
        <ElInput v-model="formData.userId" :placeholder="t('common.inputText')" size="large" />
      </ElFormItem>
      <ElFormItem :label="t('账号邮箱')" prop="userEmail">
        <ElInput v-model="formData.userEmail" :placeholder="t('common.inputText')" size="large" />
      </ElFormItem>
      <ElFormItem :label="t('紧要程度')" prop="urgency">
        <ElSelect v-model="formData.urgency" size="large" class="w-full">
          <ElOption
            v-for="item in enumUrgency"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="t('处理人')" prop="handleUser">
        <ElSelect v-model="formData.handleUser" size="large" class="w-full">
          <ElOption
            v-for="item in handleUserList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="t('备注')" prop="remark">
        <ElInput
          v-model="formData.remark"
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
