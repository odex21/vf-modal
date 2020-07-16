export type Writeable<T> = { -readonly [ P in keyof T ]: T[ P ] }; let modalContainerElem: HTMLElement

export type BaseProps = Record<string, any>

export interface SetupOption {
  setup: ((this: void, props: BaseProps, ctx: any) => any) | undefined
}

export type ComponentProps<T extends (SetupOption | any)> = Writeable<
  T extends SetupOption ?
  T[ 'setup' ] extends ((this: void, props: (infer U), ctx: any) => any) | undefined ?
  U : BaseProps
  : BaseProps>