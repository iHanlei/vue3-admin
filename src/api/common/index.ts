import request from '@/axios'
import { UploadType } from './types'

export const getEnumList = () => {
  return request.get({ url: '/enums' })
}

export const upload = (data: UploadType) => {
  return request.post({ url: '/upload', data })
}
