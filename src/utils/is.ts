const toString = Object.prototype.toString

export const is = (val: unknown, type: string) => {
  return toString.call(val) === `[object ${type}]`
}

export const isNumber = (val: unknown): val is number => {
  return is(val, 'Number')
}

export const isString = (val: unknown): val is string => {
  return is(val, 'String')
}

export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, 'Object')
}

export const isFunction = (val: unknown): val is Function => {
  return typeof val === 'function'
}

export const isUrl = (url: string): boolean => {
  const reg = /^http:\/\/|^https:\/\//
  return reg.test(url)
}

export const isEmptyVal = (val: any): boolean => {
  return val === '' || val === null || val === undefined
}
