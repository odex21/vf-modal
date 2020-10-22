# vf-modal [![beta](https://img.shields.io/npm/v/vf-modal/beta.svg)](https://www.npmjs.com/package/vf-modal/v/beta) [![CircleCI](https://circleci.com/gh/odex21/vf-modal/tree/next.svg?style=svg)](https://circleci.com/gh/odex21/vf-modal) [![codecov](https://codecov.io/gh/odex21/vf-modal/branch/next/graph/badge.svg?token=XI749WLGTF)](https://codecov.io/gh/odex21/vf-modal/branch/next)

## A simple modal framework for vue3.

## Todo 
- [x] add tests  
- [ ] build a docs  
- [ ] more demos  

### Install

```bash
$ npm install vf-modal
$ yarn add vf-modal

```
### Start 

>  It is compiled to es6 by default. If you need compatibility with lower versions of browsers, you can refer to the following configuration.

1. Config Webpack or Vue CLI
   - Vue CLI
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
            },
            include: [/vf-modal/]
          ]
        }
      }
      ```

## Usage 

### Create a VfModal

1. create a file like ```modal.js```
    ```js
    import { createVfModal, } from 'vf-modal/index'
    import NetError from './modals/NetError.vue'
    import 'vf-modal/dist/index.css'

    const { VfModal, Controller } = createVfModal({
      // define some modals
      modals: {
        net: {
          component: NetError
        },
        hello: {
          component: defineComponent({
            props: {
              msg: {
                default: 'hello',
                required: true,
                type: String
              },
              no: {
                default: 1,
                required: true,
                type: Number
              }
            },
            setup (props) {
              const { msg } = toRefs(props)
              return <>
                <p>Hello World</p>
                <p> msg:{msg.value}</p>
              </>
            }
          })
        }
      }
    })

    export {
      VfModal,
      Controller
    }
    ```

2. import ```VfModal``` in ```App.vue```
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


3. Open a modal anywhere
    ```js
    import { Controller } from './modal'

    /**
     * open a modal with key
     * @param key {ModalKey}
     * @param props {Record<string, any>} props of the modal component
     * @param zIndex {number}
     */
    Controller.open('net')
    Controller.open('hello')
    
    /**
    * close a modal
    * @param key modal key, if not provided, will close modal directly
    */
    Controller.close()

    /**
    * returns a promise that will be resolved when the modal is closed
    */
    Controller.isClosed()
    ```


## More Optiions

### create config

- ```modals```: The map object of modal.
  - ```type```:  
   
     ```ts
     interface ModalObj {
      component: any
      zIndex?: number
      props?: Record<string, any>,
      on?: EventMap
    }
     ```

  - ```component```: vue componet
  - ```zIndex```: style z-index, which can be overridden on open 
  - ```props```: props of component, which can be overridden on open 
  - ```on```: listener of component, which can be overridden on open     
     
     ```ts
     type Handler<T = any> = (event?: T) => void;
     interface EventMap {
       [ x: string ]: Handler
     }
     ``` 

- ```provide```: the function called in setup
- ```mask```: mask of modal
  - ```clickHandler```: the function called when mask is clicked  
     
     ```ts
     type clickHandler = (controller: Controller, emiiter: Emitter, instance: VfModal) => void
     ``` 

    The ```emitter``` can also be obtained in modal through the injection
  - ```autoCloseModal```: if true modal will be closed when clicking mask, default is false
  - ```classname```: classname for mask, default is 'vf-modal-mask-wrapper'
- ```transition```: Vue's transition for modal
  - ```name```: Vue's transition name, default is 'vf-modal-fade'
  - ```type```: Vue's transition name, default is 'transition'
- ```on```: modal open/close hooks  
   
   ```ts 
   interface on {
     modalOpen?: Function
     modalClose?: Function
   }
   ``` 

- ```multipleModal```: control whether the same modal can open multiple
- ```closeWhenRouteChanges```: close modal when route changed.
- ```container```: the component that wrap the modal, it's classname is 'vf-modal-container-wrapper', default is 'div'

### OpenOptions
- ```type```:  
   
   ```ts
   interface ModalObj {
    props?: Record<string, any>
    on?: EventMap
    zIndex?: number
  }
   ```
  
  Same type as above

### Injections
You can provide your own injection using the ```provide``` property  in createConfig, but vf-modal also provides an injection with the basic state of current context.
- ```type```  
  
   ```ts
   interface VfModalInstanceState {
     renderList: RenderList
     close: (key?: string) => void
     emitter: Emitter
   }
   ```

- ```renderList```: list of currently rendered modal
- ```close```: same close method as provided by the ```Controller```
- ```emitter```: a emiiter create by [mitt](https://www.npmjs.com/package/mitt)