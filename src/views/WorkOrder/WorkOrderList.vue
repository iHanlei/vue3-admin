<script setup lang="ts">
import { computed, h, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/modules/app'
import { getWorkOrderList } from '@/api/work'
import { QueryWorkOrderType } from '@/api/work/types'
import { ElButton, ElTag } from 'element-plus'
import WorkOrderDetail from './components/WorkOrderDetail.vue'

const { t } = useI18n()

const appStore = useAppStore()
const mobile = computed(() => appStore.getMobile)

const queryParams = ref<QueryWorkOrderType>({
  page: 1,
  size: 10
})

const tableTotal = ref<number>(0)
const tableData = ref<object[]>([])

const loading = ref(false)

const enumStatus = [
  {
    name: t('待处理'),
    code: 1
  },
  {
    name: t('已完结'),
    code: 2
  },
  {
    name: t('已退回'),
    code: 3
  },
  {
    name: t('已撤销'),
    code: 4
  }
]

const enumStatusTag = {
  1: '',
  2: 'success',
  3: 'error',
  4: 'warning'
}

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

const columns: TableColumn[] = [
  {
    field: '工单编号',
    label: t('工单编号'),
    minWidth: '150'
  },
  {
    field: '关联平台',
    label: t('关联平台'),
    minWidth: '150'
  },
  {
    field: '工单处理项',
    label: t('工单处理项'),
    minWidth: '150'
  },
  {
    field: '处理人员',
    label: t('处理人员'),
    minWidth: '220'
  },
  {
    field: 'status',
    label: t('工单状态'),
    minWidth: '150',
    formatter: (_: Recordable, __: TableColumn, status: number) => {
      return h(
        ElTag,
        {
          type: enumStatusTag[status]
        },
        () => enumStatus.find((et) => et.code === status)?.name
      )
    }
  },
  {
    field: '紧要程度',
    label: t('紧要程度'),
    minWidth: '150'
  },
  {
    field: '发起人',
    label: t('发起人'),
    minWidth: '220'
  },
  {
    field: '提交时间',
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
    field: '搜索关键词',
    label: t('搜索关键词'),
    component: 'Input'
  },
  {
    field: '工单状态',
    label: t('工单状态'),
    component: 'Select',
    componentProps: {
      options: enumStatus.map((item) => {
        return {
          value: item.code,
          label: item.name
        }
      })
    }
  },
  {
    field: '紧要程度',
    label: t('紧要程度'),
    component: 'Select',
    componentProps: {
      options: enumUrgency.map((item) => {
        return {
          value: item.code,
          label: item.name
        }
      })
    }
  }
])

const searchLoading = ref<boolean>(false)
const search = (val) => {
  if (!val) return

  queryParams.value = Object.assign(queryParams.value, val)
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

const showDetail = ref<boolean>(false)
const detailId = ref<any>()

const openDetail = (row) => {
  showDetail.value = true
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
  <template v-if="showDetail">
    <WorkOrderDetail :detailId="detailId" @update="getList" @close="showDetail = false" />
  </template>
  <ContentWrap :breads="[t('router.workOrderManagement'), t('router.workOrderList')]" v-else>
    <Search
      :schema="schema"
      :expand="false"
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
        <ElButton type="primary" size="small" @click="openDetail(scope.row)">
          {{ t('common.details') }}
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
</template>
