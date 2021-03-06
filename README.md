# vf-modal  
![CircleCI](https://img.shields.io/circleci/build/gh/odex21/vf-modal/next?style=for-the-badge)
![npm (tag)](https://img.shields.io/npm/v/vf-modal/next?color=blue&style=for-the-badge) 
![Codecov](https://img.shields.io/codecov/c/github/odex21/vf-modal?style=for-the-badge&token=XI749WLGTF)
![npm bundle size (version)](https://img.shields.io/bundlephobia/minzip/vf-modal/0.2.0-next?style=for-the-badge)

## A simple modal framework for vue3.
> only 3KB gzip size

## Todo 
- [x] add tests  
- [ ] build a docs  
- [ ] more demos  

### Install

```bash
$ npm install vf-modal@next
$ yarn add vf-modal@next

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
     * @param opt {
     *   props: {Record<string, any>} props of the modal component
     *   zIndex: {number} default is 1
     *   on: {EventMap} event listener
     * }
     * @return {
     *   renderList: RenderList
     *   isClosed: () => Promise<void>
     *   close: () => void
     * }
     */
    Controller.open('net')
    const { close, isClosed } = Controller.open('hello', {
      props: {
        msg: 'haha'
      },
      on: {
        // like <Component @xxx="function" />
        xxx: (...args) => {
          // do something
        }
      },
      // maybe useful when stacking multiple modals
      zIndex: 10
    })

    // ```only``` close the 'hello' modal
    close()
    // ```only``` await the 'hello' modal closed
    isClosed()
      .then(() => {
        // do something
      }) 

    
    /**
    * close a modal
    * @param key  key of modal that you would close , if not provided, will close modal directly
    */
    Controller.close()
    Controller.close('hello')

    /**
    * returns a promise that will be resolved when the ```VFModal``` component is invisible
    * that means it will be resolved on the ```onAfterEnter``` hook is triggered.
    */
    Controller.isClosed()
      .then(() => {
        // do something
      })
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
- ```emitter```: a emitter create by [mitt](https://www.npmjs.com/package/mitt)