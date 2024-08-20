<script lang="tsx">
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElScrollbar,
  ElTooltipProps,
  ComponentSize
} from 'element-plus'
import {
  defineComponent,
  ref,
  computed,
  unref,
  watch,
  onMounted,
  PropType,
  CSSProperties
} from 'vue'
import { setIndex } from './helper'
import { getSlot } from '@/utils/tsxHelper'
import type { TableProps, TableSlotDefault, TableSetProps, Pagination } from './types'
import { set } from 'lodash-es'

export default defineComponent({
  name: 'Table',
  props: {
    // 每页显示条目个数
    pageSize: {
      type: Number,
      default: 10
    },
    // 当前页码
    currentPage: {
      type: Number,
      default: 1
    },
    // 是否展示表格的工具栏
    showAction: {
      type: Boolean,
      default: false
    },
    // 是否所有的超出隐藏，优先级低于schema中的showOverflowTooltip,
    showOverflowTooltip: {
      type: Boolean,
      default: true
    },
    // 表头配置
    columns: {
      type: Array as PropType<TableColumn[]>,
      default: () => []
    },
    // 是否展示分页
    pagination: {
      type: Object as PropType<Pagination>,
      default: (): Pagination | undefined => undefined
    },
    // 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据(需指定 row-key)
    reserveSelection: {
      type: Boolean,
      default: false
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 是否叠加索引
    reserveIndex: {
      type: Boolean,
      default: false
    },
    // 对齐方式，可选值为 'left', 'center', 'right'
    align: {
      validator(value: string) {
        return ['left', 'center', 'right'].includes(value)
      },
      default: 'left'
    },
    // 表头对齐方式，可选值为 'left', 'center', 'right'
    headerAlign: {
      validator(value: string) {
        return ['left', 'center', 'right'].includes(value)
      },
      default: 'left'
    },
    // 数据源
    data: {
      type: Array as PropType<Recordable[]>,
      default: () => []
    },
    // 图片自动预览字段数组
    imagePreview: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    // 表格高度
    height: {
      type: [Number, String],
      default: undefined
    },
    // 表格最大高度
    maxHeight: {
      type: [Number, String],
      default: undefined
    },
    // 是否显示斑马线条纹
    stripe: {
      type: Boolean,
      default: false
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default: false
    },
    // 表格尺寸，可选值为 'default', 'small', 'large'
    size: {
      type: String as PropType<ComponentSize>,
      validator: (v: ComponentSize) => ['default', 'small', 'large'].includes(v)
    },
    // 是否多选
    selection: {
      type: Boolean,
      default: false
    },
    // 展开行
    expand: {
      type: Boolean,
      default: false
    },
    // 是否自适应列宽
    fit: {
      type: Boolean,
      default: true
    },
    // 是否显示表头
    showHeader: {
      type: Boolean,
      default: true
    },
    // 是否高亮当前行
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    // 当前行的 key 值
    currentRowKey: {
      type: [Number, String],
      default: undefined
    },
    // 行的类名
    rowClassName: {
      type: [Function, String] as PropType<(row: Recordable, rowIndex: number) => string | string>,
      default: ''
    },
    // 行的样式
    rowStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, rowIndex: number) => Recordable | CSSProperties
      >,
      default: () => undefined
    },
    // 单元格的类名
    cellClassName: {
      type: [Function, String] as PropType<
        (row: Recordable, column: any, rowIndex: number) => string | string
      >,
      default: ''
    },
    // 单元格的样式
    cellStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, column: any, rowIndex: number) => Recordable | CSSProperties
      >,
      default: () => undefined
    },
    // 表头行的类名
    headerRowClassName: {
      type: [Function, String] as PropType<(row: Recordable, rowIndex: number) => string | string>,
      default: ''
    },
    // 表头行的样式
    headerRowStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, rowIndex: number) => Recordable | CSSProperties
      >,
      default: () => undefined
    },
    // 表头单元格的类名
    headerCellClassName: {
      type: [Function, String] as PropType<
        (row: Recordable, column: any, rowIndex: number) => string | string
      >,
      default: ''
    },
    // 表头单元格的样式
    headerCellStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, column: any, rowIndex: number) => Recordable | CSSProperties
      >,
      default: () => undefined
    },
    // 行的唯一标识符
    rowKey: {
      type: String,
      default: 'id'
    },
    // 数据为空时显示的文本
    emptyText: {
      type: String,
      default: 'No Data'
    },
    // 默认展开所有行
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    // 默认展开的行的 key 数组
    expandRowKeys: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    // 默认排序的字段和顺序
    defaultSort: {
      type: Object as PropType<{ prop: string; order: string }>,
      default: () => ({})
    },
    // 提示框主题效果
    tooltipEffect: {
      type: String as PropType<'dark' | 'light'>,
      default: 'dark'
    },
    // 提示框选项配置
    tooltipOptions: {
      type: Object as PropType<
        Pick<
          ElTooltipProps,
          | 'effect'
          | 'enterable'
          | 'hideAfter'
          | 'offset'
          | 'placement'
          | 'popperClass'
          | 'popperOptions'
          | 'showAfter'
          | 'showArrow'
        >
      >,
      default: () => ({
        enterable: true,
        placement: 'top',
        showArrow: true,
        hideAfter: 200,
        popperOptions: { strategy: 'fixed' }
      })
    },
    // 是否显示汇总行
    showSummary: {
      type: Boolean,
      default: false
    },
    // 汇总行文本
    sumText: {
      type: String,
      default: 'Sum'
    },
    // 自定义汇总方法
    summaryMethod: {
      type: Function as PropType<(param: { columns: any[]; data: any[] }) => any[]>,
      default: () => undefined
    },
    // 自定义合并单元格方法
    spanMethod: {
      type: Function as PropType<
        (param: { row: any; column: any; rowIndex: number; columnIndex: number }) => any[]
      >,
      default: () => undefined
    },
    // 当有子节点并处于不确定状态时，是否选中父节点
    selectOnIndeterminate: {
      type: Boolean,
      default: true
    },
    // 树形表格缩进宽度
    indent: {
      type: Number,
      default: 16
    },
    // 是否懒加载
    lazy: {
      type: Boolean,
      default: false
    },
    // 加载方法
    load: {
      type: Function as PropType<(row: Recordable, treeNode: any, resolve: Function) => void>,
      default: () => undefined
    },
    // 树形表格配置
    treeProps: {
      type: Object as PropType<{ hasChildren?: string; children?: string; label?: string }>,
      default: () => ({ hasChildren: 'hasChildren', children: 'children', label: 'label' })
    },
    // 表格布局方式
    tableLayout: {
      type: String as PropType<'auto' | 'fixed'>,
      default: 'fixed'
    },
    // 是否始终显示纵向滚动条
    scrollbarAlwaysOn: {
      type: Boolean,
      default: false
    },
    // 是否支持自适应高度
    flexible: {
      type: Boolean,
      default: false
    },
    // 是否自定义内容
    customContent: {
      type: Boolean,
      default: false
    },
    // 卡片体样式
    cardBodyStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
    // 卡片体类名
    cardBodyClass: {
      type: String as PropType<string>,
      default: ''
    },
    // 卡片包装样式
    cardWrapStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
    // 卡片包装类名
    cardWrapClass: {
      type: String as PropType<string>,
      default: ''
    }
  },

  emits: [
    'update:pageSize',
    'update:currentPage',
    'update:selectionList',
    'change',
    'register',
    'selection-change',
    'sort-change'
  ],
  setup(props, { attrs, slots, emit, expose }) {
    const elTableRef = ref<ComponentRef<typeof ElTable>>()

    // 注册
    onMounted(() => {
      const tableRef = unref(elTableRef)
      emit('register', tableRef?.$parent, elTableRef)
    })

    const pageSizeRef = ref(props.pageSize)

    const currentPageRef = ref(props.currentPage)

    const mergeProps = ref<TableProps>({})

    const getProps = computed(() => {
      const propsObj = { ...props }
      Object.assign(propsObj, unref(mergeProps))
      return propsObj
    })

    const setProps = (props: TableProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props)
    }

    const setColumn = (columnProps: TableSetProps[], columnsChildren?: TableColumn[]) => {
      const { columns } = unref(getProps)
      for (const v of columnsChildren || columns) {
        for (const item of columnProps) {
          if (v.field === item.field) {
            set(v, item.path, item.value)
          } else if (v.children?.length) {
            setColumn(columnProps, v.children)
          }
        }
      }
    }

    const selections = ref<Recordable[]>([])

    const selectionChange = (selection: Recordable[]) => {
      emit('selection-change', selection)
      emit('update:selectionList', selection)
      selections.value = selection
    }

    const sortChange = (sortEvent) => {
      emit('sort-change', sortEvent)
    }

    const handleSizeChange = (size: number) => {
      emit('update:pageSize', size)
      emit('change')
    }

    const handleCurrentChange = (page: number) => {
      emit('update:currentPage', page)
      emit('change')
    }

    expose({
      setProps,
      setColumn,
      selections,
      elTableRef
    })

    const pagination = computed(() => {
      return Object.assign(
        {
          small: false,
          background: true,
          pagerCount: 5,
          layout: 'sizes, prev, pager, next, jumper, ->, total',
          pageSizes: [10, 20, 30, 50, 100, 200, 500],
          disabled: false,
          hideOnSinglePage: false,
          total: 10
        },
        unref(getProps).pagination
      )
    })

    watch(
      () => unref(getProps).pageSize,
      (val: number) => {
        pageSizeRef.value = val
      }
    )

    watch(
      () => unref(getProps).currentPage,
      (val: number) => {
        currentPageRef.value = val
      }
    )

    watch(
      () => pageSizeRef.value,
      (val: number) => {
        emit('update:pageSize', val)
      }
    )

    watch(
      () => currentPageRef.value,
      (val: number) => {
        emit('update:currentPage', val)
      }
    )

    const getBindValue = computed(() => {
      const bindValue: Recordable = { ...attrs, ...props }
      delete bindValue.columns
      delete bindValue.data
      return bindValue
    })

    const renderTableSelection = () => {
      const { selection, reserveSelection, align, headerAlign } = unref(getProps)
      // 渲染多选
      return selection ? (
        <ElTableColumn
          type="selection"
          reserveSelection={reserveSelection}
          align={align}
          headerAlign={headerAlign}
          width="50"
        ></ElTableColumn>
      ) : undefined
    }

    const renderTableExpand = () => {
      const { align, headerAlign, expand } = unref(getProps)
      // 渲染展开行
      return expand ? (
        <ElTableColumn type="expand" align={align} headerAlign={headerAlign}>
          {{
            // @ts-ignore
            default: (data: TableSlotDefault) => getSlot(slots, 'expand', data)
          }}
        </ElTableColumn>
      ) : undefined
    }

    const renderTreeTableColumn = (columnsChildren: TableColumn[]) => {
      const { align, headerAlign, showOverflowTooltip } = unref(getProps)
      return columnsChildren.map((v) => {
        const props = { ...v }
        if (props.children) delete props.children
        return (
          // @ts-ignore
          <ElTableColumn
            showOverflowTooltip={showOverflowTooltip}
            align={align}
            headerAlign={headerAlign}
            {...props}
            prop={v.field}
          >
            {{
              default: (data: TableSlotDefault) =>
                v.children && v.children.length
                  ? renderTableColumn(v.children)
                  : // @ts-ignore
                    getSlot(slots, v.field, data) ||
                    v?.formatter?.(data.row, data.column, data.row[v.field], data.$index) ||
                    data.row[v.field],
              // @ts-ignore
              header: getSlot(slots, `${v.field}-header`)
            }}
          </ElTableColumn>
        )
      })
    }

    const renderTableColumn = (columnsChildren?: TableColumn[]) => {
      const {
        columns,
        reserveIndex,
        pageSize,
        currentPage,
        align,
        headerAlign,
        showOverflowTooltip
      } = unref(getProps)
      return [...[renderTableExpand()], ...[renderTableSelection()]].concat(
        (columnsChildren || columns).map((v) => {
          // 自定生成序号
          if (v.type === 'index') {
            return (
              <ElTableColumn
                type="index"
                index={
                  v.index
                    ? v.index
                    : (index) => setIndex(reserveIndex, index, pageSize, currentPage)
                }
                align={v.align || align}
                headerAlign={v.headerAlign || headerAlign}
                label={v.label}
                width="65px"
              ></ElTableColumn>
            )
          } else {
            const props = { ...v }
            if (props.children) delete props.children
            return (
              // @ts-ignore
              <ElTableColumn
                showOverflowTooltip={showOverflowTooltip}
                align={align}
                headerAlign={headerAlign}
                {...props}
                prop={v.field}
              >
                {{
                  default: (data: TableSlotDefault) =>
                    v.children && v.children.length
                      ? renderTreeTableColumn(v.children)
                      : // @ts-ignore
                        getSlot(slots, v.field, data) ||
                        v?.formatter?.(data.row, data.column, data.row[v.field], data.$index) ||
                        data.row[v.field],
                  // @ts-ignore
                  header: () => getSlot(slots, `${v.field}-header`) || v.label
                }}
              </ElTableColumn>
            )
          }
        })
      )
    }

    return () => (
      <div v-loading={unref(getProps).loading}>
        <ElTable
          // @ts-ignore
          ref={elTableRef}
          height={pageSizeRef.value > 10 ? 500 : 'auto'}
          data={unref(getProps).data}
          onSelection-change={selectionChange}
          onSort-change={sortChange}
          {...unref(getBindValue)}
        >
          {{
            default: () => renderTableColumn(),
            // @ts-ignore
            append: () => getSlot(slots, 'append')
          }}
        </ElTable>
        {unref(getProps).pagination ? (
          <ElScrollbar>
            <ElPagination
              v-model:pageSize={pageSizeRef.value}
              v-model:currentPage={currentPageRef.value}
              onCurrent-change={handleCurrentChange}
              onSize-change={handleSizeChange}
              class="mt-20px"
              {...unref(pagination)}
            ></ElPagination>
          </ElScrollbar>
        ) : undefined}
      </div>
    )
  }
})
</script>
