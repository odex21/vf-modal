declare module '*.vue' {
  import { defineComponent } from 'vue'
  const componentOptions: ReturnType<typeof defineComponent>
  export default componentOptions
}
