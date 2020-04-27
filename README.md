# vf-modal
## 基于Vue的模态对话框函数包装器
使用 tsx 开发，提供完善的类型支持

### Install

```bash
$ npm install vf-modal
$ yarn add vf-modal
```

### Example:

```html
  <button onclick="openModal()">open modal</button>
```

```js

import { createVfModal } from 'vf-mdodal'
// 引入默认样式
import 'vf-modal/dist/index.min.css'

const Dialog = createVfModal(
  // modal 配置对象
  // key 会当作调用的时的type来调用对应的modal,
  // value:接受一个组件数组，数组的非自带组件（例如close）会被依次渲染进modal的body中
  {
  net: [
    'close', //自带的关闭按钮
    {
      component: "div",//可以是div，或者vue组件（*.vue）
      ref: 'name', // 组件别名， instance.$ref.name
      slot: 'hello vfModal',//标签内的内容
      className: 'component',
      defaultProps: {//传给组件的预设props，在调用的时候可以覆盖掉
        any: 'any'
      },
      // 监听组件的事件
      on: { 
        click: () => { },
        custom: (instance, type, ...args) => {
          instance.close()
        }
      }
    }
  ]
},
// 创建配置
// **非必要选项
{
  closeButtonClass: 'abc', //关闭按钮的className，会替换掉默认的.close-btn
  awaitClose: false, // 是否等待modal 关闭之后resolve
  container: 'div', // modal 容器 可以是div 或者 Vue 组件
  containerClass: 'class', // 会和原来的.dialog-wrapper**合并**
  containerStyle: { // 容器的 style
    zIndex: 100
  },
  maskClosable: true, // 是否点击蒙版关闭modal
  transitionName: 'fade' // transition 组件的name
})

window.openModal = () => {
  Dialog({
    type: 'net', // 唯一的必填项，调用的modal的类型
    awaitClose: false,
    containerClass: 'any',
    containerStyle: {
      zIndex: 200
    },
    //会通过attrs传进所有组件
    props: {
      any: 'any'
    },
    maskClosable: true,
    // 和创建配置不同，这里可以的事件可以根据name 分别监听，如果是 div 标签，则根据class name 判断
    on: {
      click: {
        name: 'Vue Component name',
        fn: () => { }
      },
      custom: (instance, type, ...args) => {

      }
    },
    // 在 awaitClose 为 false 时，  modal 关闭时调用的函数
    // 默认的onClose 方法为在modal 关闭时，返回 instance 和 关闭类型
    // 而立刻 awaitClose 为 false 时，因为立刻返回了 instance 和 type，所以默认的就没用了，于是可以配置自定义的回调函数
    onClose: (instance, type, ...args) => {
    }
  })
}



```
 
### Modal 实例可以接受的事件|方法

1. close
     - 在子组件中 ``` this.$emit('close', type, ...args) ``` 或者 ```instance.close(type, ...args)```
     - 参数 type: 'close' | 'custom' | 'instance' | string 
       - ‘custom’ | string  为调用实例```close()``方法，或者$emit('close', type)时，传递的值。当然也可以传 close ， 但建议区分对待关闭事件
       - 'close' 为普通的关闭
       - ‘instance' 为’awaitClose‘ 为 false 时 返回的值
     - ...args 自定义参数，组件关闭后，会被传出来
       - ```js
          const { instance, type, ...args} = await Dialog({type: 'net'})  
         ``` 

### 

### 当前拥有的自带组件

   - close
     - 一个简单的关闭按钮，点击会调用实例的```close('close')```方法
     - 可以更改```closeButtonClass```或者覆盖样式，来变更外观或位置
