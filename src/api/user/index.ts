import request from '@/axios'
import type { LoginType } from './types'
import { IResponse } from '@/axios/types'

export const loginApi = (data: LoginType): Promise<IResponse<LoginType>> => {
  return request.post({ url: '/login', data })
}