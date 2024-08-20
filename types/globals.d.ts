// types/globals.d.ts

import { TableColumn as ImportedTableColumn } from "@/components/Table";
declare global {
  interface Fn<T = any> {
    (...arg: T[]): T;
  }

  declare type Nullable<T> = T | null;

  declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

  declare type Recordable<
    T = any,
    K extends string | number | symbol = string,
  > = Record<K extends null | undefined ? string : K, T>;

  declare type ComponentRef<T extends abstract new (...args: any) => any> =
    InstanceType<T>;

  declare type LayoutType = "classic";

  declare type TimeoutHandle = ReturnType<typeof setTimeout>;

  declare type IntervalHandle = ReturnType<typeof setInterval>;

  declare type TableColumn = ImportedTableColumn;
}

export {};
