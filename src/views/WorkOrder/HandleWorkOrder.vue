<script setup lang="ts">
import { computed, h, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/modules/app'
import { useEnumStore } from '@/store/modules/enum'
import { getWorkOrderList } from '@/api/work'
import { QueryWorkOrderType } from '@/api/work/types'
import { ElButton, ElTag } from 'element-plus'
import HandleDetail from './components/HandleDetail.vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const { t, locale } = useI18n()
const localeSuffix = computed(() => (locale.value === 'zh-CN' ? '' : 'En'))

const appStore = useAppStore()
const mobile = computed(() => appStore.getMobile)

const queryParams = ref<QueryWorkOrderType>({
  page: 1,
  size: 10
})

const tableTotal = ref<number>(0)
const tableData = ref<object[]>([])

const loading = ref(false)

const enumStore = useEnumStore()
const enumWorkOrderStatus = computed(() => enumStore.enumList.EnumWorkOrderStatus)
const enumWorkOrderLevel = computed(() => enumStore.enumList.EnumWorkOrderLevel)
const enumWorkOrderType = computed(() => enumStore.enumList.EnumWorkOrderType)
const enumBackstageType = computed(() => enumStore.enumList.EnumBackstageType)

const enumWorkOrderStatusTag = {
  1: 'info', // 待审核
  2: 'info', // 已撤回
  4: 'danger', // 审核退回
  8: '', // 处理中
  16: 'success', // 处理完成
  32: 'warning', // 重开工单
  64: 'warning', // 补充数据
  128: 'success' // 关闭工单
}

const columns: TableColumn[] = [
  {
    field: 'workOrderId',
    label: t('工单编号'),
    minWidth: '150'
  },
  {
    field: 'backstageType',
    label: t('关联平台'),
    minWidth: '150'
  },
  {
    field: 'workOrderType',
    label: t('工单类型'),
    minWidth: '150'
  },
  {
    field: 'handlersEmail',
    label: t('处理人员'),
    minWidth: '220'
  },
  {
    field: 'workOrderStatus',
    label: t('工单状态'),
    minWidth: '150',
    formatter: (_: Recordable, __: TableColumn, workOrderStatus: number) => {
      return h(
        ElTag,
        {
          type: enumWorkOrderStatusTag[workOrderStatus]
        },
        () =>
          enumWorkOrderStatus.value.find((et) => et.code === workOrderStatus)?.[
            `name${localeSuffix.value}`
          ]
      )
    }
  },
  {
    field: 'workOrderLevel',
    label: t('紧要程度'),
    minWidth: '150'
  },
  {
    field: 'createUserEmail',
    label: t('发起人'),
    minWidth: '220'
  },
  {
    field: 'createTime',
    label: t('提交时间'),
    minWidth: '180'
  },
  {
    field: 'operate',
    label: t('common.operate'),
    minWidth: '120',
    fixed: mobile.value ? false : 'right'
  }
]

const schema = reactive<FormSchema[]>([
  {
    field: 'backstageTypeList',
    label: t('关联平台'),
    component: 'Select',
    componentProps: {
      options: enumBackstageType.value.map((item) => {
        return {
          value: item.code,
          label: item[`name${localeSuffix.value}`]
        }
      })
    }
  },
  {
    field: 'workOrderTypeList',
    label: t('工单类型'),
    component: 'Select',
    componentProps: {
      options: enumWorkOrderType.value.map((item) => {
        return {
          value: item.code,
          label: item[`name${localeSuffix.value}`]
        }
      })
    }
  },
  {
    field: 'workOrderStatusList',
    label: t('工单状态'),
    component: 'Select',
    componentProps: {
      options: enumWorkOrderStatus.value.map((item) => {
        return {
          value: item.code,
          label: item[`name${localeSuffix.value}`]
        }
      })
    }
  },
  {
    field: 'workOrderLevelList',
    label: t('紧要程度'),
    component: 'Select',
    componentProps: {
      options: enumWorkOrderLevel.value.map((item) => {
        return {
          value: item.code,
          label: item[`name${localeSuffix.value}`]
        }
      })
    }
  },
  {
    field: 'createTime',
    label: t('创建时间'),
    component: 'DatePicker',
    componentProps: {
      type: 'datetimerange',
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      defaultTime: [new Date(2023, 1, 1, 0, 0, 0), new Date(2023, 1, 1, 23, 59, 59)]
    }
  }
])

const searchLoading = ref<boolean>(false)
const search = (val) => {
  if (!val) return

  if (val.createTime) {
    queryParams.value.createTimeStart = dayjs(val.createTime[0]).startOf('day').utc().format()
    queryParams.value.createTimeEnd = dayjs(val.createTime[1]).endOf('day').utc().format()
  } else {
    queryParams.value.createTimeStart = undefined
    queryParams.value.createTimeEnd = undefined
  }

  const newVal = Object.assign({}, val)
  delete newVal.createTime

  queryParams.value = Object.assign(queryParams.value, newVal)
  queryParams.value.page = 1

  searchLoading.value = true
  getList()
}

const resetLoading = ref<boolean>(false)
const reset = () => {
  queryParams.value = {
    page: 1,
    size: 10
  }

  resetLoading.value = true
  getList()
}

const showHandleDetail = ref<boolean>(true)
const detailId = ref<any>()

const openHandleDetail = (row) => {
  showHandleDetail.value = true
  detailId.value = row.id
}

const getList = () => {
  loading.value = true
  getWorkOrderList(queryParams.value)
    .then((res) => {
      if (res && res.data) {
        tableData.value = res.data.items
        tableTotal.value = res.data.total
      }
    })
    .finally(() => {
      searchLoading.value = false
      resetLoading.value = false
      loading.value = false
    })
}

getList()
</script>
<template>
  <template v-if="showHandleDetail">
    <HandleDetail :detailId="detailId" @update="getList" @close="showHandleDetail = false" />
  </template>
  <div v-else>
    <Search
      :schema="schema"
      :showExpand="true"
      expandField="workOrderTypeList"
      :searchLoading="searchLoading"
      :resetLoading="resetLoading"
      @search="search"
      @reset="reset"
    />
    <Table
      :columns="columns"
      :data="tableData"
      :loading="loading"
      :pagination="{ total: tableTotal }"
      v-model:currentPage="queryParams.page"
      v-model:pageSize="queryParams.size"
      @change="getList"
    >
      <template #operate="scope">
        <ElButton type="primary" size="small" @click="openHandleDetail(scope.row)">
          {{ t('处理') }}
        </ElButton>
      </template>
    </Table>
  </div>
</template>
