import request from '@/axios'
import type {
  QueryWorkOrderType,
  QueryWorkOrderTypeListType,
  AddWorkOrderType,
  UpdateReviewerType,
  CheckWorkOrderType
} from './types'

export const getWorkOrderList = (params: QueryWorkOrderType) => {
  return request.get({ url: '/query/getList', params })
}

export const getWorkOrderTypeList = (params: QueryWorkOrderTypeListType) => {
  return request.get({ url: '/query/orderTypeList', params })
}

export const addWorkOrder = (data: AddWorkOrderType) => {
  return request.post({ url: '/submit/add', data })
}

export const updateReviewer = (data: UpdateReviewerType) => {
  return request.post({ url: '/audit/designatedReviewer', data })
}

export const checkWorkOrder = (data: CheckWorkOrderType) => {
  return request.post({ url: '/audit/reviewTickets', data })
}
