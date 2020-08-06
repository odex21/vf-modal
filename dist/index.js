import Vue from 'vue';
import { curry, find, memoizeWith, identity, merge, filter } from 'ramda';
import compositionApi, { onUnmounted } from '@vue/composition-api';

function _extends(){return _extends=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},_extends.apply(this,arguments)}var normalMerge=["attrs","props","domProps"],toArrayMerge=["class","style","directives"],functionalMerge=["on","nativeOn"],mergeJsxProps=function(a){return a.reduce(function(c,a){for(var b in a)if(!c[b])c[b]=a[b];else if(-1!==normalMerge.indexOf(b))c[b]=_extends({},c[b],a[b]);else if(-1!==toArrayMerge.indexOf(b)){var d=c[b]instanceof Array?c[b]:[c[b]],e=a[b]instanceof Array?a[b]:[a[b]];c[b]=d.concat(e);}else if(-1!==functionalMerge.indexOf(b)){for(var f in a[b])if(c[b][f]){var g=c[b][f]instanceof Array?c[b][f]:[c[b][f]],h=a[b][f]instanceof Array?a[b][f]:[a[b][f]];c[b][f]=g.concat(h);}else c[b][f]=a[b][f];}else if("hook"==b)for(var i in a[b])c[b][i]=c[b][i]?mergeFn(c[b][i],a[b][i]):a[b][i];else c[b]=a[b];return c},{})},mergeFn=function(a,b){return function(){a&&a.apply(this,arguments),b&&b.apply(this,arguments);}};var helper=mergeJsxProps;

const findKey = curry((arr, key) => !!find(e => e === key, arr));
const prevent = e => e.preventDefault();
const generateClass = list => list.reduce((res, cur) => {
  res += ' ' + cur;
  return res;
}, '');
const camelizeRE = /-(\w)/g;
const camelize = memoizeWith(identity, str => {
  return str.replace(camelizeRE, (_, c) => c.toUpperCase());
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = memoizeWith(identity, str => {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
});

Vue.use(compositionApi);
const defaultBaseConfig = {
  container: 'div',
  containerClass: 'dialog-wrapper',
  maskWrapperClass: 'mask-wrapper',
  transitionName: 'fade',
  containerStyle: {
    zIndex: 999
  },
  closeButtonClass: 'close-btn'
};
const defaultRunConfig = {
  awaitClose: true
};
const Component = Vue.extend({
  name: 'abc',

  data() {
    return {
      visible: true,
      id: '',
      closed: false,
      onClose: (instance, type, ...args) => {}
    };
  },

  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false;
      }
    }

  },
  methods: {
    /**
     * close modal
     */
    close(type, ...args) {
      this.closed = true;

      if (this.onClose && typeof this.onClose === 'function') {
        this.onClose(this, type, ...args);
      }
    },

    handleAfterLeave() {
      this.$destroy();
      if (this.$el && this.$el.parentNode) this.$el.parentNode.removeChild(this.$el);
    }

  }
});
const zIndex = 0;
const createVfModal = (modalTypesGroup, createConfig) => config => {
  return new Promise((resolve, reject) => {
    const {
      type,
      props = {},
      awaitClose,
      containerStyle: runContainerStyle = {},
      maskClosable: runMaskClosalbe,
      containerClass: runContainerClass
    } = merge(defaultRunConfig, config);
    const onClose = awaitClose ? (instance, type) => {
      resolve({
        instance,
        type
      });
    } : config.onClose;
    const customList = modalTypesGroup[type];
    if (!customList) throw Error(`not has modal of this type, ${type}`);
    const checkType = findKey(customList);
    const instance = new Component({
      data() {
        return {
          onClose
        };
      },

      render: function (h) {
        const temp = filter(e => !!(typeof e !== 'string' && e.component), customList);
        const customNode = temp.map(el => {
          const {
            component,
            on: elOn,
            slot,
            className,
            ref
          } = el;
          const {
            on: runOn
          } = config;
          const on = runOn ? merge(elOn || {}, runOn) : elOn;
          const defaultL = {
            // 监听组件中调用的`close`事件，关闭modal
            close: (type, ...args) => this.close(type, ...args)
          }; // 传入instance

          const l = on ? Object.keys(on).reduce((res, cur) => {
            const listener = on[cur];

            if (typeof listener === 'function') {
              res[cur] = (type, ...args) => {
                listener(this, type, ...args);
              };
            } else if (component !== 'div' && component.name === listener.name || component === 'div' && listener.name === className) {
              res[cur] = (type, ...args) => {
                listener.fn(this, type, ...args);
              };
            }

            return res; // todo fix type
          }, {}) : {};
          const ll = merge(defaultL, l);
          const attrs = merge(el.defaultProps || {}, props);
          return h(component, helper([{
            "attrs": { ...attrs
            },
            "style": runContainerStyle,
            "ref": ref
          }, {
            "on": ll
          }, {
            "class": className
          }]), [slot]);
        });
        const {
          container,
          containerClass,
          conatainerProps: baseAttrs,
          transitionName,
          containerStyle,
          closeButtonClass,
          maskClosable,
          maskWrapperClass
        } = merge(defaultBaseConfig, createConfig || {});
        const defaultNode = [];

        if (checkType('close')) {
          defaultNode.push(h("div", {
            "ref": "closeButton",
            "style": {
              zIndex: zIndex + 2
            },
            "class": closeButtonClass,
            "on": {
              "click": () => this.close('close')
            }
          }));
        }

        const maskClickHandler = () => {
          if (runMaskClosalbe || maskClosable) {
            this.close('close');
          }
        };

        const containerClassList = [hyphenate(type)];
        if (containerClass) containerClassList.push(containerClass);
        if (runContainerClass) containerClassList.push(runContainerClass);
        return h("transition", {
          "attrs": {
            "name": transitionName
          },
          "on": {
            "afterLeave": this.handleAfterLeave
          }
        }, [h("div", {
          "directives": [{
            name: "show",
            value: this.visible
          }],
          "class": "fixed-wrapper",
          "on": {
            "touchmove": prevent
          },
          "attrs": { ...baseAttrs
          },
          "style": containerStyle
        }, [h(container, {
          "ref": 'body',
          "style": {
            zIndex: zIndex + 1
          },
          "class": generateClass(containerClassList)
        }, [defaultNode, customNode]), h("div", {
          "style": {
            zIndex
          },
          "on": {
            "click": maskClickHandler
          },
          "class": maskWrapperClass
        })])]);
      }
    });
    instance.$mount();
    document.body.appendChild(instance.$el);

    if (!awaitClose) {
      resolve({
        instance,
        type: 'instance'
      });
    }
  });
};
/**
 * get a modal that will be closed when component unmounted
 */

const createUseModal = Modal => () => {
  let modal;

  const openModal = async data => {
    modal = await Modal({ ...data,
      awaitClose: false
    });
  };

  onUnmounted(() => {
    if (modal && modal.instance) {
      modal.instance.close('close');
    }
  });
  return {
    openModal
  };
};

export { createUseModal, createVfModal };
