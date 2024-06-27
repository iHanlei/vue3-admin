<script lang="tsx">
import { defineComponent, PropType, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { TableColumn } from '../types'
import ColumnSetting from './ColumnSetting.vue'

export default defineComponent({
  name: 'TableActions',
  components: {
    ColumnSetting
  },
  props: {
    columns: {
      type: Array as PropType<TableColumn[]>,
      default: () => []
    }
  },
  emits: ['confirm'],
  setup(props, { emit }) {
    const showSetting = ref(false)

    const confirm = (columns: TableColumn[]) => {
      emit('confirm', columns)
    }

    const showColumnSetting = () => {
      showSetting.value = true
    }

    return () => (
      <>
        <div class="text-right h-28px flex items-center justify-end">
          <div
            title="列设置"
            class="w-30px h-20px flex items-center justify-end"
            onClick={showColumnSetting}
          >
            <Icon
              icon="ant-design:setting-outlined"
              class="cursor-pointer"
              hover-color="var(--el-color-primary)"
            />
          </div>
        </div>
        <ColumnSetting v-model={showSetting.value} columns={props.columns} onConfirm={confirm} />
      </>
    )
  }
})
</script>
