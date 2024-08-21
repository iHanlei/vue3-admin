<script setup lang="tsx">
import { Form, FormSchema, FormSetProps } from '@/components/Form'
import { PropType, computed, unref, ref, watch, onMounted } from 'vue'
import { useForm } from '@/hooks/useForm'
import { findIndex } from '@/utils'
import { cloneDeep, set } from 'lodash-es'
import { initModel } from '@/components/Form/src/helper'
import ActionButton from './components/ActionButton.vue'
import { SearchProps } from './types'
import { FormItemProp } from 'element-plus'
import { isObject, isEmptyVal } from '@/utils/is'

// 定义props属性
const props = defineProps({
  // 表单布局结构数组
  schema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  },
  // 是否需要栅格布局
  isCol: {
    type: Boolean,
    default: false
  },
  // 表单标签宽度
  labelWidth: {
    type: [String, Number],
    default: 'auto'
  },
  // 操作按钮风格位置
  layout: {
    validator(value: string) {
      return ['inline', 'bottom'].includes(value)
    },
    default: 'inline'
  },
  // 底部按钮对齐方式
  buttonPosition: {
    validator(value: string) {
      return ['left', 'center', 'right'].includes(value)
    },
    default: 'center'
  },
  // 是否显示搜索按钮
  showSearch: {
    type: Boolean,
    default: true
  },
  // 是否显示重置按钮
  showReset: {
    type: Boolean,
    default: true
  },
  // 是否显示伸缩按钮
  showExpand: {
    type: Boolean,
    default: false
  },
  // 伸缩的界限字段
  expandField: {
    type: String,
    default: ''
  },
  // 表单是否内联
  inline: {
    type: Boolean,
    default: true
  },
  // 是否去除空值项
  removeNoValueItem: {
    type: Boolean,
    default: true
  },
  // 表单数据对象
  model: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  },
  // 搜索按钮加载状态
  searchLoading: {
    type: Boolean,
    default: false
  },
  // 重置按钮加载状态
  resetLoading: {
    type: Boolean,
    default: false
  }
})

// 定义emit事件
const emit = defineEmits(['search', 'reset', 'register', 'validate'])

// 表单显示状态
const visible = ref(true)

// 表单数据
const formModel = ref<Recordable>(props.model)

// 计算新的schema
const newSchema = computed(() => {
  const propsComputed = unref(getProps)
  let schema: FormSchema[] = cloneDeep(propsComputed.schema)
  if (propsComputed.showExpand && propsComputed.expandField && unref(visible)) {
    const index = findIndex(schema, (v: FormSchema) => v.field === propsComputed.expandField)
    schema.map((v, i) => {
      if (i > index) {
        v.hidden = true
      } else {
        v.hidden = false
      }
      return v
    })
  }
  if (propsComputed.layout === 'inline') {
    schema = schema.concat([
      {
        field: 'action',
        formItemProps: {
          labelWidth: '0px',
          slots: {
            default: () => {
              return (
                <div>
                  <ActionButton
                    showSearch={propsComputed.showSearch}
                    showReset={propsComputed.showReset}
                    showExpand={propsComputed.showExpand}
                    searchLoading={propsComputed.searchLoading}
                    resetLoading={propsComputed.resetLoading}
                    visible={visible.value}
                    onExpand={setVisible}
                    onReset={reset}
                    onSearch={search}
                  />
                </div>
              )
            }
          }
        }
      }
    ])
  }
  return schema
})

// 使用useForm钩子函数
const { formRegister, formMethods } = useForm()
const { getElFormExpose, getFormData, getFormExpose } = formMethods

// useSearch传入的props
const outsideProps = ref<SearchProps>({})

// 合并后的属性
const mergeProps = ref<SearchProps>({})

// 计算合并属性
const getProps = computed(() => {
  const propsObj = { ...props }
  Object.assign(propsObj, unref(mergeProps))
  return propsObj
})

// 设置属性
const setProps = (props: SearchProps = {}) => {
  mergeProps.value = Object.assign(unref(mergeProps), props)
  // @ts-ignore
  outsideProps.value = props
}

// 存储schema引用
const schemaRef = ref<FormSchema[]>([])

// 监听表单结构化数组，重新生成formModel
watch(
  () => unref(newSchema),
  async (schema = []) => {
    formModel.value = initModel(schema, unref(formModel))
    schemaRef.value = schema
  },
  {
    immediate: true,
    deep: true
  }
)

// 过滤表单数据
const filterModel = async () => {
  const model = await getFormData()
  if (unref(getProps).removeNoValueItem) {
    // 使用reduce过滤空值，并返回一个新对象
    return Object.keys(model).reduce((prev, next) => {
      const value = model[next]
      if (!isEmptyVal(value)) {
        if (isObject(value)) {
          if (Object.keys(value).length > 0) {
            prev[next] = value
          }
        } else {
          prev[next] = value
        }
      }
      return prev
    }, {})
  }
  return model
}

// 搜索函数
const search = async () => {
  const elFormExpose = await getElFormExpose()
  await elFormExpose?.validate(async (isValid) => {
    if (isValid) {
      const model = await filterModel()
      emit('search', model)
    }
  })
}

// 重置函数
const reset = async () => {
  const elFormExpose = await getElFormExpose()
  elFormExpose?.resetFields()
  const model = await filterModel()
  emit('reset', model)
}

// 底部按钮样式
const bottomButtonStyle = computed(() => {
  return {
    textAlign: unref(getProps).buttonPosition as unknown as 'left' | 'center' | 'right'
  }
})

// 设置表单显示状态
const setVisible = async () => {
  visible.value = !unref(visible)
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

// 对表单赋值
const setValues = async (data: Recordable = {}) => {
  formModel.value = Object.assign(props.model, unref(formModel), data)
  const formExpose = await getFormExpose()
  formExpose?.setValues(data)
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

// 默认暴露的方法
const defaultExpose = {
  getElFormExpose,
  setProps,
  setSchema,
  setValues,
  delSchema,
  addSchema,
  getFormData
}

// 组件挂载时触发
onMounted(() => {
  emit('register', defaultExpose)
})

defineExpose(defaultExpose)

// 表单验证事件
const onFormValidate = (prop: FormItemProp, isValid: boolean, message: string) => {
  emit('validate', prop, isValid, message)
}
</script>

<template>
  <Form
    :model="formModel"
    :is-custom="false"
    :label-width="getProps.labelWidth"
    hide-required-asterisk
    :inline="getProps.inline"
    :is-col="getProps.isCol"
    :schema="schemaRef"
    @register="formRegister"
    @validate="onFormValidate"
  />

  <template v-if="layout === 'bottom'">
    <div :style="bottomButtonStyle">
      <ActionButton
        :show-reset="getProps.showReset"
        :show-search="getProps.showSearch"
        :show-expand="getProps.showExpand"
        :search-loading="getProps.searchLoading"
        :reset-loading="getProps.resetLoading"
        :visible="visible"
        @expand="setVisible"
        @reset="reset"
        @search="search"
      />
    </div>
  </template>
</template>
