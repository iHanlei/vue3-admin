<script lang="tsx">
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ComponentSize,
  ElTooltipProps,
  ElImage,
  ElEmpty,
  ElCard,
} from "element-plus"
import { defineComponent, PropType, ref, computed, unref, watch, onMounted } from "vue"
import { setIndex } from "./helper"
import type { TableProps, TableColumn, Pagination, TableSetProps } from "./types"
import { set, get } from "lodash-es"
import { CSSProperties } from "vue"
import { getSlot } from "@/utils/tsxHelper"
import TableActions from "./components/TableActions.vue"

export default defineComponent({
  name: "Table",
  props: {
    // 每页显示条目个数
    pageSize: {
      type: Number,
      default: 10,
    },
    // 当前页码
    currentPage: {
      type: Number,
      default: 1,
    },
    // 是否展示表格的工具栏
    showAction: {
      type: Boolean,
      default: false,
    },
    // 是否所有的超出隐藏，优先级低于schema中的showOverflowTooltip,
    showOverflowTooltip: {
      type: Boolean,
      default: true,
    },
    // 表头配置
    columns: {
      type: Array as PropType<TableColumn[]>,
      default: () => [],
    },
    // 是否展示分页
    pagination: {
      type: Object as PropType<Pagination>,
      default: (): Pagination | undefined => undefined,
    },
    // 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
    reserveSelection: {
      type: Boolean,
      default: false,
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false,
    },
    // 是否叠加索引
    reserveIndex: {
      type: Boolean,
      default: false,
    },
    // 对齐方式，可选值为 'left', 'center', 'right'
    align: {
      validator(value: string) {
        return ["left", "center", "right"].includes(value)
      },
      default: "left",
    },
    // 表头对齐方式，可选值为 'left', 'center', 'right'
    headerAlign: {
      validator(value: string) {
        return ["left", "center", "right"].includes(value)
      },
      default: "left",
    },
    // 数据源
    data: {
      type: Array as PropType<Recordable[]>,
      default: () => [],
    },
    // 图片自动预览字段数组
    imagePreview: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    // 表格高度
    height: {
      type: [Number, String],
      default: undefined,
    },
    // 表格最大高度
    maxHeight: {
      type: [Number, String],
      default: undefined,
    },
    // 是否显示斑马线条纹
    stripe: {
      type: Boolean,
      default: false,
    },
    // 是否显示边框
    border: {
      type: Boolean,
      default: false,
    },
    // 表格尺寸，可选值为 'default', 'small', 'large'
    size: {
      type: String as PropType<ComponentSize>,
      validator: (v: ComponentSize) => ["default", "small", "large"].includes(v),
    },
    // 是否自适应列宽
    fit: {
      type: Boolean,
      default: true,
    },
    // 是否显示表头
    showHeader: {
      type: Boolean,
      default: true,
    },
    // 是否高亮当前行
    highlightCurrentRow: {
      type: Boolean,
      default: false,
    },
    // 当前行的 key 值
    currentRowKey: {
      type: [Number, String],
      default: undefined,
    },
    // 行的类名
    rowClassName: {
      type: [Function, String] as PropType<(row: Recordable, rowIndex: number) => string | string>,
      default: "",
    },
    // 行的样式
    rowStyle: {
      type: [Function, Object] as PropType<(row: Recordable, rowIndex: number) => Recordable | CSSProperties>,
      default: () => undefined,
    },
    // 单元格的类名
    cellClassName: {
      type: [Function, String] as PropType<(row: Recordable, column: any, rowIndex: number) => string | string>,
      default: "",
    },
    // 单元格的样式
    cellStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, column: any, rowIndex: number) => Recordable | CSSProperties
      >,
      default: () => undefined,
    },
    // 表头行的类名
    headerRowClassName: {
      type: [Function, String] as PropType<(row: Recordable, rowIndex: number) => string | string>,
      default: "",
    },
    // 表头行的样式
    headerRowStyle: {
      type: [Function, Object] as PropType<(row: Recordable, rowIndex: number) => Recordable | CSSProperties>,
      default: () => undefined,
    },
    // 表头单元格的类名
    headerCellClassName: {
      type: [Function, String] as PropType<(row: Recordable, column: any, rowIndex: number) => string | string>,
      default: "",
    },
    // 表头单元格的样式
    headerCellStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, column: any, rowIndex: number) => Recordable | CSSProperties
      >,
      default: () => undefined,
    },
    // 行的唯一标识符
    rowKey: {
      type: String,
      default: "id",
    },
    // 数据为空时显示的文本
    emptyText: {
      type: String,
      default: "No Data",
    },
    // 默认展开所有行
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    // 默认展开的行的 key 数组
    expandRowKeys: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    // 默认排序的字段和顺序
    defaultSort: {
      type: Object as PropType<{ prop: string; order: string }>,
      default: () => ({}),
    },
    // 提示框主题效果
    tooltipEffect: {
      type: String as PropType<"dark" | "light">,
      default: "dark",
    },
    // 提示框选项配置
    tooltipOptions: {
      type: Object as PropType<
        Pick<
          ElTooltipProps,
          | "effect"
          | "enterable"
          | "hideAfter"
          | "offset"
          | "placement"
          | "popperClass"
          | "popperOptions"
          | "showAfter"
          | "showArrow"
        >
      >,
      default: () => ({
        enterable: true,
        placement: "top",
        showArrow: true,
        hideAfter: 200,
        popperOptions: { strategy: "fixed" },
      }),
    },
    // 是否显示汇总行
    showSummary: {
      type: Boolean,
      default: false,
    },
    // 汇总行文本
    sumText: {
      type: String,
      default: "Sum",
    },
    // 自定义汇总方法
    summaryMethod: {
      type: Function as PropType<(param: { columns: any[]; data: any[] }) => any[]>,
      default: () => undefined,
    },
    // 自定义合并单元格方法
    spanMethod: {
      type: Function as PropType<(param: { row: any; column: any; rowIndex: number; columnIndex: number }) => any[]>,
      default: () => undefined,
    },
    // 当有子节点并处于不确定状态时，是否选中父节点
    selectOnIndeterminate: {
      type: Boolean,
      default: true,
    },
    // 树形表格缩进宽度
    indent: {
      type: Number,
      default: 16,
    },
    // 是否懒加载
    lazy: {
      type: Boolean,
      default: false,
    },
    // 加载方法
    load: {
      type: Function as PropType<(row: Recordable, treeNode: any, resolve: Function) => void>,
      default: () => undefined,
    },
    // 树形表格配置
    treeProps: {
      type: Object as PropType<{ hasChildren?: string; children?: string; label?: string }>,
      default: () => ({ hasChildren: "hasChildren", children: "children", label: "label" }),
    },
    // 表格布局方式
    tableLayout: {
      type: String as PropType<"auto" | "fixed">,
      default: "fixed",
    },
    // 是否始终显示纵向滚动条
    scrollbarAlwaysOn: {
      type: Boolean,
      default: false,
    },
    // 是否支持自适应高度
    flexible: {
      type: Boolean,
      default: false,
    },
    // 是否自定义内容
    customContent: {
      type: Boolean,
      default: false,
    },
    // 卡片体样式
    cardBodyStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({}),
    },
    // 卡片体类名
    cardBodyClass: {
      type: String as PropType<string>,
      default: "",
    },
    // 卡片包装样式
    cardWrapStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({}),
    },
    // 卡片包装类名
    cardWrapClass: {
      type: String as PropType<string>,
      default: "",
    },
  },

  emits: ["update:pageSize", "update:currentPage", "register", "refresh"],
  setup(props, { attrs, emit, slots, expose }) {
    const elTableRef = ref<ComponentRef<typeof ElTable>>()

    // 注册
    onMounted(() => {
      const tableRef = unref(elTableRef)
      emit("register", tableRef?.$parent, elTableRef)
    })

    // 页面条目数量
    const pageSizeRef = ref(props.pageSize)

    // 当前页码
    const currentPageRef = ref(props.currentPage)

    // 外部传入的表格 props
    const outsideProps = ref<TableProps>({})

    // 合并后的表格 props
    const mergeProps = ref<TableProps>({})

    // 获取最终的表格 props
    const getProps = computed(() => {
      const propsObj = { ...props }
      Object.assign(propsObj, unref(mergeProps))
      return propsObj
    })

    // 设置表格 props
    const setProps = (props: TableProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props)
      outsideProps.value = { ...props } as any
    }

    // 设置表格列的属性
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

    // 添加表格列
    const addColumn = (column: TableColumn, index?: number) => {
      const { columns } = unref(getProps)
      if (index !== void 0) {
        columns.splice(index, 0, column)
      } else {
        columns.push(column)
      }
    }

    // 删除表格列
    const delColumn = (field: string) => {
      const { columns } = unref(getProps)
      const index = columns.findIndex(item => item.field === field)
      if (index > -1) {
        columns.splice(index, 1)
      }
    }

    // 确认设置表格列
    const confirmSetColumn = (columns: TableColumn[]) => {
      setProps({ columns })
    }

    // 暴露的方法
    expose({
      setProps,
      setColumn,
      delColumn,
      addColumn,
      elTableRef,
    })

    // 获取分页配置
    const pagination = computed(() => {
      return Object.assign(
        {
          small: false,
          background: false,
          pagerCount: 7,
          layout: "sizes, prev, pager, next, jumper, ->, total",
          pageSizes: [10, 20, 30, 40, 50, 100],
          disabled: false,
          hideOnSinglePage: false,
          total: 10,
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
        emit("update:pageSize", val)
      }
    )

    watch(
      () => currentPageRef.value,
      (val: number) => {
        emit("update:currentPage", val)
      }
    )

    const getBindValue = computed(() => {
      const bindValue: Recordable = { ...attrs, ...unref(getProps) }
      delete bindValue.columns
      delete bindValue.data
      delete bindValue.align
      return bindValue
    })

    const renderTreeTableColumn = (columnsChildren: TableColumn[]) => {
      const { align, headerAlign, showOverflowTooltip, imagePreview } = unref(getProps)
      return columnsChildren.map(v => {
        if (v.hidden) return null
        const props = { ...v } as any
        if (props.children) delete props.children

        const children = v.children

        const slots = {
          default: (...args: any[]) => {
            const data = args[0]
            let isPreview = false
            isPreview = imagePreview.some(item => (item as string) === v.field)

            return children && children.length
              ? renderTreeTableColumn(children)
              : props?.slots?.default
              ? props.slots.default(...args)
              : v?.formatter
              ? v?.formatter?.(data.row, data.column, get(data.row, v.field), data.$index)
              : isPreview
              ? renderPreview(get(data.row, v.field), v.field)
              : get(data.row, v.field)
          },
        }
        if (props?.slots?.header) {
          slots["header"] = (...args: any[]) => props.slots.header(...args)
        }

        return (
          <ElTableColumn
            showOverflowTooltip={showOverflowTooltip}
            align={align}
            headerAlign={headerAlign}
            {...props}
            prop={v.field}
          >
            {slots}
          </ElTableColumn>
        )
      })
    }

    const renderPreview = (url: string, field: string) => {
      const { imagePreview } = unref(getProps)
      return (
        <div class="flex items-center">
          {imagePreview.includes(field) ? (
            <ElImage src={url} fit="cover" class="w-[100%]" lazy preview-src-list={[url]} preview-teleported />
          ) : null}
        </div>
      )
    }

    const renderTableColumn = (columnsChildren?: TableColumn[]) => {
      const {
        columns,
        reserveIndex,
        pageSize,
        currentPage,
        align,
        headerAlign,
        showOverflowTooltip,
        reserveSelection,
        imagePreview,
      } = unref(getProps)

      return (columnsChildren || columns).map(v => {
        if (v.hidden) return null
        if (v.type === "index") {
          return (
            <ElTableColumn
              type="index"
              index={v.index ? v.index : index => setIndex(reserveIndex, index, pageSize, currentPage)}
              align={v.align || align}
              headerAlign={v.headerAlign || headerAlign}
              label={v.label}
              fixed={v.fixed}
              width="65px"
            ></ElTableColumn>
          )
        } else if (v.type === "selection") {
          return (
            <ElTableColumn
              type="selection"
              reserveSelection={reserveSelection}
              align={align}
              headerAlign={headerAlign}
              selectable={v.selectable}
              width="50"
            ></ElTableColumn>
          )
        } else {
          const props = { ...v } as any
          if (props.children) delete props.children

          const children = v.children

          const slots = {
            default: (...args: any[]) => {
              const data = args[0]

              let isPreview = false
              isPreview = imagePreview.some(item => (item as string) === v.field)

              return children && children.length
                ? renderTreeTableColumn(children)
                : props?.slots?.default
                ? props.slots.default(...args)
                : v?.formatter
                ? v?.formatter?.(data.row, data.column, get(data.row, v.field), data.$index)
                : isPreview
                ? renderPreview(get(data.row, v.field), v.field)
                : get(data.row, v.field)
            },
          }
          if (props?.slots?.header) {
            slots["header"] = (...args: any[]) => props.slots.header(...args)
          }

          return (
            <ElTableColumn
              showOverflowTooltip={showOverflowTooltip}
              align={align}
              headerAlign={headerAlign}
              {...props}
              prop={v.field}
            >
              {slots}
            </ElTableColumn>
          )
        }
      })
    }

    return () => {
      const tableSlots = {}
      if (getSlot(slots, "empty")) {
        tableSlots["empty"] = (...args: any[]) => getSlot(slots, "empty", args)
      }
      if (getSlot(slots, "append")) {
        tableSlots["append"] = (...args: any[]) => getSlot(slots, "append", args)
      }

      return (
        <div v-loading={unref(getProps).loading}>
          {unref(getProps).customContent ? (
            <div class="flex flex-wrap">
              {unref(getProps)?.data?.length ? (
                unref(getProps)?.data.map(item => {
                  const cardSlots = {
                    default: () => {
                      return getSlot(slots, "content", item)
                    },
                  }
                  if (getSlot(slots, "content-header")) {
                    cardSlots["header"] = () => {
                      return getSlot(slots, "content-header", item)
                    }
                  }
                  if (getSlot(slots, "content-footer")) {
                    cardSlots["footer"] = () => {
                      return getSlot(slots, "content-footer", item)
                    }
                  }
                  return (
                    <ElCard
                      shadow="hover"
                      class={unref(getProps).cardWrapClass}
                      style={unref(getProps).cardWrapStyle}
                      bodyClass={unref(getProps).cardBodyClass}
                      bodyStyle={unref(getProps).cardBodyStyle}
                    >
                      {cardSlots}
                    </ElCard>
                  )
                })
              ) : (
                <div class="flex flex-1 justify-center">
                  <ElEmpty description="暂无数据" />
                </div>
              )}
            </div>
          ) : (
            <>
              {unref(getProps).showAction && !unref(getProps).customContent ? (
                <TableActions columns={unref(getProps).columns} onConfirm={confirmSetColumn} />
              ) : null}
              <ElTable ref={elTableRef} data={unref(getProps).data} {...unref(getBindValue)}>
                {{
                  default: () => renderTableColumn(),
                  ...tableSlots,
                }}
              </ElTable>
            </>
          )}
          {unref(getProps).pagination ? (
            <ElPagination
              v-model:pageSize={pageSizeRef.value}
              v-model:currentPage={currentPageRef.value}
              class="mt-10px"
              {...unref(pagination)}
            ></ElPagination>
          ) : undefined}
        </div>
      )
    }
  },
})
</script>
