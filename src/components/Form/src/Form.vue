<script lang="tsx">
import { PropType, defineComponent, ref, computed, unref, watch, onMounted } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  FormRules,
  ComponentSize
  // FormItemProp
} from 'element-plus'
import { componentMap } from './helper/componentMap'
import { getSlot } from '@/utils/tsxHelper'
import {
  setTextPlaceholder,
  setGridProp,
  setComponentProps,
  setItemComponentSlots,
  initModel
} from './helper'
import { useRenderSelect } from './components/useRenderSelect'
import { useRenderRadio } from './components/useRenderRadio'
import { useRenderCheckbox } from './components/useRenderCheckbox'
import { useDesign } from '@/hooks/useDesign'
import { findIndex } from '@/utils'
import { get, set } from 'lodash-es'
import { FormProps } from './types'
import {
  FormSchema,
  FormSetProps,
  ComponentNameEnum,
  SelectComponentProps,
  RadioGroupComponentProps,
  CheckboxGroupComponentProps
} from './types'

const { renderSelectOptions } = useRenderSelect()
const { renderRadioOptions } = useRenderRadio()
const { renderCheckboxOptions } = useRenderCheckbox()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('form')

export default defineComponent({
  name: 'Form',
  props: {
    // 生成Form的布局结构数组
    schema: {
      type: Array as PropType<FormSchema[]>,
      default: () => []
    },
    // 是否需要栅格布局
    isCol: {
      type: Boolean,
      default: true
    },
    // 表单数据对象
    model: {
      type: Object as PropType<any>,
      default: () => ({})
    },
    // 是否自动设置placeholder
    autoSetPlaceholder: {
      type: Boolean,
      default: true
    },
    // 是否自定义内容
    isCustom: {
      type: Boolean,
      default: false
    },
    // 表单label宽度
    labelWidth: {
      type: [String, Number],
      default: 'auto'
    },
    // 表单验证规则
    rules: {
      type: Object as PropType<FormRules>,
      default: () => ({})
    },
    // 表单标签位置
    labelPosition: {
      validator(value: string) {
        return ['left', 'right', 'top'].includes(value)
      },
      default: 'right'
    },
    // 表单标签后缀
    labelSuffix: {
      type: String,
      default: ''
    },
    // 是否隐藏必填星号
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    },
    // 必填星号位置
    requireAsteriskPosition: {
      validator(value: string) {
        return ['left', 'right'].includes(value)
      },
      default: 'left'
    },
    // 是否显示验证信息
    showMessage: {
      type: Boolean,
      default: true
    },
    // 是否显示内联验证信息
    inlineMessage: {
      type: Boolean,
      default: false
    },
    // 是否显示验证状态图标
    statusIcon: {
      type: Boolean,
      default: false
    },
    // 规则变化时是否立即验证
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    // 组件尺寸
    size: {
      type: String as PropType<ComponentSize>,
      default: undefined
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否在验证失败时滚动到错误位置
    scrollToError: {
      type: Boolean,
      default: false
    },
    // 滚动到错误位置的偏移量
    scrollToErrorOffset: {
      type: [Boolean, Object],
      default: undefined
    }
  },
  emits: ['register'],
  setup(props, { slots, expose, emit }) {
    // element form 实例
    const elFormRef = ref<ComponentRef<typeof ElForm>>()

    // 合并后的属性
    const mergeProps = ref<FormProps>({})

    // 计算属性
    const getProps = computed(() => {
      const propsObj = { ...props }
      Object.assign(propsObj, unref(mergeProps))
      return propsObj
    })

    // 存储表单组件实例
    const formComponents = ref({})

    // 存储form-item组件实例
    const formItemComponents = ref({})

    // 表单数据
    const formModel = ref<Recordable>(props.model)

    // 组件挂载时触发
    onMounted(() => {
      emit('register', unref(elFormRef)?.$parent, unref(elFormRef))
    })

    // 对表单赋值
    const setValues = (data: Recordable = {}) => {
      formModel.value = Object.assign(unref(formModel), data)
    }

    // 设置表单属性
    const setProps = (props: FormProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props)
    }

    // 删除schema
    const delSchema = (field: string) => {
      const { schema } = unref(getProps)
      const index = findIndex(schema, (v: FormSchema) => v.field === field)
      if (index > -1) {
        schema.splice(index, 1)
      }
    }

    // 添加schema
    const addSchema = (formSchema: FormSchema, index?: number) => {
      const { schema } = unref(getProps)
      if (index !== void 0) {
        schema.splice(index, 0, formSchema)
        return
      }
      schema.push(formSchema)
    }

    // 设置schema
    const setSchema = (schemaProps: FormSetProps[]) => {
      const { schema } = unref(getProps)
      for (const v of schema) {
        for (const item of schemaProps) {
          if (v.field === item.field) {
            set(v, item.path, item.value)
          }
        }
      }
    }

    // 获取表单组件实例
    const getComponentExpose = (filed: string) => {
      return unref(formComponents)[filed]
    }

    // 获取formItem组件实例
    const getFormItemExpose = (filed: string) => {
      return unref(formItemComponents)[filed]
    }

    // 设置组件引用映射
    const setComponentRefMap = (ref: any, filed: string) => {
      formComponents.value[filed] = ref
    }

    // 设置表单项引用映射
    const setFormItemRefMap = (ref: any, filed: string) => {
      formItemComponents.value[filed] = ref
    }

    // 暴露的方法
    expose({
      setValues,
      formModel,
      setProps,
      delSchema,
      addSchema,
      setSchema,
      getComponentExpose,
      getFormItemExpose
    })

    // 监听表单结构化数组，重新生成formModel
    watch(
      () => unref(getProps).schema,
      (schema = []) => {
        formModel.value = initModel(schema, unref(formModel))
      },
      {
        immediate: true,
        deep: true
      }
    )

    // 渲染包裹标签，是否使用栅格布局
    const renderWrap = () => {
      const { isCol } = unref(getProps)
      const content = isCol ? (
        <ElRow gutter={20}>{renderFormItemWrap()}</ElRow>
      ) : (
        renderFormItemWrap()
      )
      return content
    }

    // 是否要渲染el-col
    const renderFormItemWrap = () => {
      // hidden属性表示隐藏，不做渲染
      const { schema = [], isCol } = unref(getProps)

      return schema
        .filter((v) => !v.remove && !v.hidden)
        .map((item) => {
          // 如果是 Divider 组件，需要自己占用一行
          const isDivider = item.component === 'Divider'
          const Com = componentMap['Divider'] as ReturnType<typeof defineComponent>
          return isDivider ? (
            <Com {...{ contentPosition: 'left', ...item.componentProps }}>{item?.label}</Com>
          ) : isCol ? (
            // 如果需要栅格，需要包裹 ElCol
            <ElCol {...setGridProp(item.colProps)}>{renderFormItem(item)}</ElCol>
          ) : (
            renderFormItem(item)
          )
        })
    }

    // 获取选项方法
    const getOptions = async (fn: Function, item: FormSchema) => {
      const options = await fn()
      setSchema([
        {
          field: item.field,
          path:
            item.component === ComponentNameEnum.TREE_SELECT ||
            item.component === ComponentNameEnum.TRANSFER
              ? 'componentProps.data'
              : 'componentProps.options',
          value: options
        }
      ])
    }

    // 渲染formItem
    const renderFormItem = (item: FormSchema) => {
      // 如果有optionApi，优先使用optionApi
      if (item.optionApi) {
        // 内部自动调用接口，不影响其它渲染
        getOptions(item.optionApi, item)
      }
      const formItemSlots: Recordable = {
        default: () => {
          if (item?.formItemProps?.slots?.default) {
            return item?.formItemProps?.slots?.default(formModel.value)
          } else {
            const Com = componentMap[item.component as string] as ReturnType<typeof defineComponent>

            const { autoSetPlaceholder } = unref(getProps)

            const componentSlots = (item?.componentProps as any)?.slots || {}
            const slotsMap: Recordable = {
              ...setItemComponentSlots(componentSlots)
            }
            // // 如果是select组件，并且没有自定义模板，自动渲染options
            if (item.component === ComponentNameEnum.SELECT) {
              slotsMap.default = !componentSlots.default
                ? () => renderSelectOptions(item)
                : () => {
                    return componentSlots.default(
                      unref((item?.componentProps as SelectComponentProps)?.options)
                    )
                  }
            }

            // 虚拟列表
            if (item.component === ComponentNameEnum.SELECT_V2 && componentSlots.default) {
              slotsMap.default = ({ item }) => {
                return componentSlots.default(item)
              }
            }

            // 单选框组和按钮样式
            if (
              item.component === ComponentNameEnum.RADIO_GROUP ||
              item.component === ComponentNameEnum.RADIO_BUTTON
            ) {
              slotsMap.default = !componentSlots.default
                ? () => renderRadioOptions(item)
                : () => {
                    return componentSlots.default(
                      unref((item?.componentProps as CheckboxGroupComponentProps)?.options)
                    )
                  }
            }

            // 多选框组和按钮样式
            if (
              item.component === ComponentNameEnum.CHECKBOX_GROUP ||
              item.component === ComponentNameEnum.CHECKBOX_BUTTON
            ) {
              slotsMap.default = !componentSlots.default
                ? () => renderCheckboxOptions(item)
                : () => {
                    return componentSlots.default(
                      unref((item?.componentProps as RadioGroupComponentProps)?.options)
                    )
                  }
            }

            const Comp = () => {
              // 如果field是多层路径，需要转换成对象
              const itemVal = computed({
                get: () => {
                  return get(formModel.value, item.field)
                },
                set: (val) => {
                  set(formModel.value, item.field, val)
                }
              })

              return item.component === ComponentNameEnum.UPLOAD ? (
                <Com
                  vModel:file-list={itemVal.value}
                  ref={(el: any) => setComponentRefMap(el, item.field)}
                  {...(autoSetPlaceholder && setTextPlaceholder(item))}
                  {...setComponentProps(item)}
                  style={
                    item.componentProps?.style || {
                      width: '100%'
                    }
                  }
                >
                  {{ ...slotsMap }}
                </Com>
              ) : (
                <Com
                  vModel={itemVal.value}
                  ref={(el: any) => setComponentRefMap(el, item.field)}
                  {...(autoSetPlaceholder && setTextPlaceholder(item))}
                  {...setComponentProps(item)}
                  style={
                    item.componentProps?.style || {
                      width: '100%'
                    }
                  }
                >
                  {{ ...slotsMap }}
                </Com>
              )
            }

            return <>{Comp()}</>
          }
        }
      }
      if (item?.formItemProps?.slots?.label) {
        formItemSlots.label = (...args: any[]) => {
          return (item?.formItemProps?.slots as any)?.label(...args)
        }
      }
      if (item?.formItemProps?.slots?.error) {
        formItemSlots.error = (...args: any[]) => {
          return (item?.formItemProps?.slots as any)?.error(...args)
        }
      }
      return (
        <ElFormItem
          v-show={!item.hidden}
          ref={(el: any) => setFormItemRefMap(el, item.field)}
          {...(item.formItemProps || {})}
          prop={item.field}
          label={item.label || ''}
        >
          {formItemSlots}
        </ElFormItem>
      )
    }

    // 过滤传入Form组件的属性
    const getFormBindValue = () => {
      // 避免在标签上出现多余的属性
      const delKeys = ['schema', 'isCol', 'autoSetPlaceholder', 'isCustom', 'model']
      const props = { ...unref(getProps) }
      for (const key in props) {
        if (delKeys.indexOf(key) !== -1) {
          delete props[key]
        }
      }
      return props as FormProps
    }

    return () => (
      <ElForm
        ref={elFormRef}
        {...getFormBindValue()}
        model={unref(getProps).isCustom ? unref(getProps).model : formModel}
        class={prefixCls}
        // @ts-ignore
        onSubmit={(e: Event) => {
          e.preventDefault()
        }}
      >
        {{
          // 如果需要自定义，就什么都不渲染，而是提供默认插槽
          default: () => {
            const { isCustom } = unref(getProps)
            return isCustom ? getSlot(slots, 'default') : renderWrap()
          }
        }}
      </ElForm>
    )
  }
})
</script>

<style lang="less" scoped>
.@{elNamespace}-form.@{adminNamespace}-form .@{elNamespace}-row {
  margin-right: 0 !important;
  margin-left: 0 !important;
}

.@{elNamespace}-form--inline {
  :deep(.el-form-item__content) {
    & > :first-child {
      min-width: 229.5px;
    }
  }
  .@{elNamespace}-input-number {
    // 229.5px是兼容el-input-number的最小宽度,
    min-width: 229.5px;
  }
}
</style>
