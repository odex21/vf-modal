# vf-modal [![beta](https://img.shields.io/npm/v/vf-modal/beta.svg)](https://www.npmjs.com/package/vf-modal/v/beta) [![CircleCI](https://circleci.com/gh/odex21/vf-modal/tree/next.svg?style=svg)](https://circleci.com/gh/odex21/vf-modal) [![codecov](https://codecov.io/gh/odex21/vf-modal/branch/next/graph/badge.svg?token=XI749WLGTF)](undefined)

## A simple modal framework for vue3.

## Todo 
1. add tests
2. build a docs
3. more demos

### Install

```bash
$ npm install vf-modal
$ yarn add vf-modal

```
### Start 

>  为了 vf-modal 更轻量，它被简单的编译为es6，这样可以去除可能和项目中重复的polyfill

1. Config Webpack or Vue Cli
    将vf-modal加入项目的babel编译
   - Vue Cli
      ```js
      module.exports = {
        transpileDependencies: ['vf-modal']
      }
      ```
   - Webpack
      ```js
      module.exports = {
        modules: {
          rules: [
            test: /\.m?js$/,
            use: {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true
              },
            },
            include: [
             path.resolve(__dirname, '../src'),
              /vf-modal/
            ]
          ]
        }
      }
      ```

### Usage 

#### Create a VfModal

1. create a file like ```modal.js```
  ```js
  import { createVfModal, } from 'vf-modal/index'
  import { ApiError } from './modals/ApiError'
  import NetError from './modals/NetError.vue'
  import 'vf-modal/dist/index.css'

  /** 
   * import { provide } from 'vue'
   * const provideStore = () => provide('key', store)  
  */
  import { provideStore } from './modalShare'

  const { VfModal, Controller } = createVfModal({
    modals: {
      net: {
        component: NetError
      },
      api: {
        component: ApiError
      }
    },
    provide: provideStore,
  })


  export {
    VfModal,
    Controller
  }
  ```

2. import ```VfModal``` to ```App.vue```
  ```html
  <template>
    <router-view />
    <vf-modal />
  </template>

  <script>
  import {VfModal} from './modal'

  export default {
    name: 'App',
    components: {
      VfModal
    }
  }
  </script>
  ```


#### Open a modal in anywhere

```js
import { Controller } from './modal'

/**
 * open a modal with key
 * @param key {ModalKey}
 * @param props {Record<string, any>} props of the modal component
 * @param zIndex {number}
 */
Controller.open('net')
```

#### Share Data 

Because the responsive system is separated in ```Vue 3.0```, and we can't get the type of the ".vue" file because of ts. 
So, we can share the data using "provide/inject", of course, because the ```<vf-modal />``` is mounted in ```App.vue```, sharing data using "vuex" is also possible.

```js
import { provide, inject, reactive, InjectionKey } from 'vue'

const store = reactive({
  state: {
    n: 1,
  },
  inc () {
    store.state.n++
  },
})

const Store: InjectionKey<typeof store> = Symbol()

export const provideStore = () => {
  provide(Store, store)
}

export const useStore = () => {
  const data = inject(Store)
  if (!data) throw new Error('no data')
  return data
}


```

### Docs

Soon.
