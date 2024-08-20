import request from '@/axios'
import type { QueryWorkOrderType, OrderByIdType, AddWorkOrderType, UpdateWorkOrderType } from './types'

export const getWorkOrderList = (params: QueryWorkOrderType) => {
  return request.get({ url: '/work/order/list', params })
}

export const getWorkOrderDetails = (params: OrderByIdType) => {
  return request.get({ url: '/work/order/details', params })
}

export const addWorkOrder = (data: AddWorkOrderType) => {
  return request.post({ url: '/add/work/order', data })
}

export const updateWorkOrder = (data: UpdateWorkOrderType) => {
  return request.post({ url: '/update/work/order', data })
}