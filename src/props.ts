export type Writeable<T> = { -readonly [ P in keyof T ]: T[ P ] }; let modalContainerElem: HTMLElement

type BaseProps = Record<string, any>

export type ComponentProps<T extends { setup?: any }> = Writeable<
  T[ 'setup' ] extends
  (((this: void, props: (infer U), ctx: any) => any) | undefined) ?
  U : never>