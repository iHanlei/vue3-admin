// types/globals.d.ts
declare global {
  interface Fn<T = any> {
    (...arg: T[]): T
  }

  type Nullable<T> = T | null

  type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

  type Recordable<T = any, K extends string | number | symbol = string> = Record<
    K extends null | undefined ? string : K,
    T
  >

  type ComponentRef<T extends abstract new (...args: any) => any> = InstanceType<T>

  type LayoutType = "classic"

  type TimeoutHandle = ReturnType<typeof setTimeout>
  
  type IntervalHandle = ReturnType<typeof setInterval>
}

export {}
