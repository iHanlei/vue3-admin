<script setup lang="ts">
import { ElDescriptions, ElDescriptionsItem, ElButton, ElSteps, ElStep, ElCard } from 'element-plus'
import { useWindowSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { getWorkOrderDetails } from '@/api/work'
import { ref } from 'vue'

const { t } = useI18n()

const emit = defineEmits(['close'])

const { width } = useWindowSize()

const props = defineProps({
  detailId: {
    type: String,
    required: true
  }
})

const workData = ref()

const loading = ref<boolean>(false)
const getDetails = () => {
  loading.value = true
  getWorkOrderDetails({
    orderId: props.detailId
  })
    .then((res) => {
      if (res && res.data) {
        workData.value = res.data
      }
    })
    .finally(() => {
      loading.value = false
    })
}

getDetails()
</script>

<template>
  <ContentWrap
    :breads="[t('router.workOrderManagement'), t('router.workOrderList'), t('common.details')]"
  >
    <ElButton class="mb-[20px]" @click="emit('close')">
      <Icon icon="material-symbols:arrow-back-ios-new-rounded" class="mr-[5px]" />
      {{ t('common.back') }}
    </ElButton>
    <ElDescriptions
      :title="t('工单信息')"
      border
      :column="width < 768 ? 2 : 4"
      direction="vertical"
    >
      <ElDescriptionsItem :label="t('工单编号')">
        {{ '工单编号' }}
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="t('关联平台')">
        {{ '关联平台' }}
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="t('工单处理项')">
        {{ '工单处理项' }}
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="t('处理人员')">
        {{ '处理人员' }}
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="t('工单状态')">
        {{ '工单状态' }}
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="t('紧要程度')">
        {{ '紧要程度' }}
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="t('发起人')">
        {{ '发起人' }}
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="t('账户ID')">
        {{ '账户ID' }}
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="t('账号邮箱')">
        {{ '账号邮箱' }}
      </ElDescriptionsItem>
      <ElDescriptionsItem :label="t('提交时间')">
        {{ '提交时间' }}
      </ElDescriptionsItem>
    </ElDescriptions>
    <div class="text-base font-bold mt-8 mb-4"> {{ t('操作记录') }} </div>
    <ElSteps direction="vertical">
      <ElStep status="wait">
        <template #title>
          <span class="text-sm text-[#909399]">2024-08-23 08：30：00</span>
        </template>
        <template #description>
          <ElCard class="mb-5">
            <div>Morty</div>
            <div>提交工单</div>
            <div>备注：客户着急使用，麻烦加急处理</div>
          </ElCard>
        </template>
      </ElStep>
      <ElStep status="wait">
        <template #title>
          <span class="text-sm text-[#909399]">2024-08-23 09：30：00</span>
        </template>
        <template #description>
          <ElCard class="mb-5">
            <div>Terry</div>
            <div>完成工单</div>
            <div>备注：已修改</div>
          </ElCard>
        </template>
      </ElStep>
    </ElSteps>
  </ContentWrap>
</template>
