import request from '@/axios'
import { LoginType } from './types'

export const userLogin = (data: LoginType) => {
  return request.post({ url: '/login', data })
}

export const getUserInfo = () => {
  return request.get({ url: '/query/info' })
}
