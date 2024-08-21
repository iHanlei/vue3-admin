export type QueryWorkOrderType = {
  page?: number
  size?: number
  workOrderId?: string
  workOrderLevelList?: string[]
  workOrderStatusList?: string[]
  workOrderTypeList?: string[]
  backstageTypeList?: string[]
  handlers?: string
  createUser?: string
  createTimeStart?: string
  createTimeEnd?: string
}

export type QueryWorkOrderTypeListType = {
  backstageType?: number | string
  workOrderType?: number | string
}

export type AddWorkOrderType = {
  id: string
  email: string
  backstageType: number | string
  handlers: string
  workOrderLevel: number | string
  workOrderType: number | string
  workOrderDesc?: string
}

export type UpdateReviewerType = {
  workOrderId: string
  handlers: string
  workOrderDesc?: string
}

export type CheckWorkOrderType = {
  workOrderId: string
  workOrderStatus: number
  workOrderDesc?: string
}
