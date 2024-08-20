export type QueryWorkOrderType = {
  page: number
  size: number
}

export type OrderByIdType = {
  orderId: string
}

export type AddWorkOrderType = {
  relatedPlatforms: string
  handleItem: string
  urgency: string
  handleUser: string
  userId: string
  userEmail: string
  remark?: string
}

export type UpdateWorkOrderType = {}
