import t from"https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js";function n(){return(n=Object.assign||function(t){for(var n,r=1;r<arguments.length;r++)for(var e in n=arguments[r])Object.prototype.hasOwnProperty.call(n,e)&&(t[e]=n[e]);return t}).apply(this,arguments)}var r=["attrs","props","domProps"],e=["class","style","directives"],o=["on","nativeOn"],u=function(t,n){return function(){t&&t.apply(this,arguments),n&&n.apply(this,arguments)}},i=function(t){return t.reduce((function(t,i){for(var c in i)if(t[c])if(-1!==r.indexOf(c))t[c]=n({},t[c],i[c]);else if(-1!==e.indexOf(c)){var a=t[c]instanceof Array?t[c]:[t[c]],s=i[c]instanceof Array?i[c]:[i[c]];t[c]=a.concat(s)}else if(-1!==o.indexOf(c))for(var f in i[c])if(t[c][f]){var l=t[c][f]instanceof Array?t[c][f]:[t[c][f]],p=i[c][f]instanceof Array?i[c][f]:[i[c][f]];t[c][f]=l.concat(p)}else t[c][f]=i[c][f];else if("hook"==c)for(var h in i[c])t[c][h]=t[c][h]?u(t[c][h],i[c][h]):i[c][h];else t[c]=i[c];else t[c]=i[c];return t}),{})};
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
function c(){for(var t=0,n=0,r=arguments.length;n<r;n++)t+=arguments[n].length;var e=Array(t),o=0;for(n=0;n<r;n++)for(var u=arguments[n],i=0,c=u.length;i<c;i++,o++)e[o]=u[i];return e}function a(t){return null!=t&&"object"==typeof t&&!0===t["@@functional/placeholder"]}function s(t){return function n(r){return 0===arguments.length||a(r)?n:t.apply(this,arguments)}}function f(t){return function n(r,e){switch(arguments.length){case 0:return n;case 1:return a(r)?n:s((function(n){return t(r,n)}));default:return a(r)&&a(e)?n:a(r)?s((function(n){return t(n,e)})):a(e)?s((function(n){return t(r,n)})):t(r,e)}}}function l(t,n){switch(t){case 0:return function(){return n.apply(this,arguments)};case 1:return function(t){return n.apply(this,arguments)};case 2:return function(t,r){return n.apply(this,arguments)};case 3:return function(t,r,e){return n.apply(this,arguments)};case 4:return function(t,r,e,o){return n.apply(this,arguments)};case 5:return function(t,r,e,o,u){return n.apply(this,arguments)};case 6:return function(t,r,e,o,u,i){return n.apply(this,arguments)};case 7:return function(t,r,e,o,u,i,c){return n.apply(this,arguments)};case 8:return function(t,r,e,o,u,i,c,a){return n.apply(this,arguments)};case 9:return function(t,r,e,o,u,i,c,a,s){return n.apply(this,arguments)};case 10:return function(t,r,e,o,u,i,c,a,s,f){return n.apply(this,arguments)};default:throw new Error("First argument to _arity must be a non-negative integer no greater than ten")}}var p=f((function(t,n){return 1===t?s(n):l(t,function t(n,r,e){return function(){for(var o=[],u=0,i=n,c=0;c<r.length||u<arguments.length;){var s;c<r.length&&(!a(r[c])||u>=arguments.length)?s=r[c]:(s=arguments[u],u+=1),o[c]=s,a(s)||(i-=1),c+=1}return i<=0?e.apply(this,o):l(i,t(n,o,e))}}(t,[],n))})),h=Array.isArray||function(t){return null!=t&&t.length>=0&&"[object Array]"===Object.prototype.toString.call(t)};function d(t){return"function"==typeof t["@@transducer/step"]}function y(t,n,r){return function(){if(0===arguments.length)return r();var e=Array.prototype.slice.call(arguments,0),o=e.pop();if(!h(o)){for(var u=0;u<t.length;){if("function"==typeof o[t[u]])return o[t[u]].apply(o,e);u+=1}if(d(o)){var i=n.apply(null,e);return i(o)}}return r.apply(this,arguments)}}var v=function(){return this.xf["@@transducer/init"]()},g=function(t){return this.xf["@@transducer/result"](t)};var b=s((function(t){return!!h(t)||!!t&&("object"==typeof t&&(!function(t){return"[object String]"===Object.prototype.toString.call(t)}(t)&&(1===t.nodeType?!!t.length:0===t.length||t.length>0&&(t.hasOwnProperty(0)&&t.hasOwnProperty(t.length-1)))))})),m=function(){function t(t){this.f=t}return t.prototype["@@transducer/init"]=function(){throw new Error("init not implemented on XWrap")},t.prototype["@@transducer/result"]=function(t){return t},t.prototype["@@transducer/step"]=function(t,n){return this.f(t,n)},t}();var w=f((function(t,n){return l(t.length,(function(){return t.apply(n,arguments)}))}));function O(t,n,r){for(var e=r.next();!e.done;){if((n=t["@@transducer/step"](n,e.value))&&n["@@transducer/reduced"]){n=n["@@transducer/value"];break}e=r.next()}return t["@@transducer/result"](n)}function j(t,n,r,e){return t["@@transducer/result"](r[e](w(t["@@transducer/step"],t),n))}var x="undefined"!=typeof Symbol?Symbol.iterator:"@@iterator";function C(t,n,r){if("function"==typeof t&&(t=function(t){return new m(t)}(t)),b(r))return function(t,n,r){for(var e=0,o=r.length;e<o;){if((n=t["@@transducer/step"](n,r[e]))&&n["@@transducer/reduced"]){n=n["@@transducer/value"];break}e+=1}return t["@@transducer/result"](n)}(t,n,r);if("function"==typeof r["fantasy-land/reduce"])return j(t,n,r,"fantasy-land/reduce");if(null!=r[x])return O(t,n,r[x]());if("function"==typeof r.next)return O(t,n,r);if("function"==typeof r.reduce)return j(t,n,r,"reduce");throw new TypeError("reduce: list must be array or iterable")}function S(t,n){return Object.prototype.hasOwnProperty.call(n,t)}var A=Object.prototype.toString,k=!{toString:null}.propertyIsEnumerable("toString"),P=["constructor","valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"],E=function(){return arguments.propertyIsEnumerable("length")}(),I=function(t,n){for(var r=0;r<t.length;){if(t[r]===n)return!0;r+=1}return!1},$=s("function"!=typeof Object.keys||E?function(t){if(Object(t)!==t)return[];var n,r,e=[],o=E&&function(){return"[object Arguments]"===A.call(arguments)?function(t){return"[object Arguments]"===A.call(t)}:function(t){return S("callee",t)}}(t);for(n in t)!S(n,t)||o&&"length"===n||(e[e.length]=n);if(k)for(r=P.length-1;r>=0;)S(n=P[r],t)&&!I(e,n)&&(e[e.length]=n),r-=1;return e}:function(t){return Object(t)!==t?[]:Object.keys(t)}),N=s((function(t){return p(t.length,t)}));var z=function(){function t(t,n){this.xf=n,this.f=t}return t.prototype["@@transducer/init"]=v,t.prototype["@@transducer/result"]=g,t.prototype["@@transducer/step"]=function(t,n){return this.f(n)?this.xf["@@transducer/step"](t,n):t},t}(),L=f(y(["filter"],f((function(t,n){return new z(t,n)})),(function(t,n){return r=n,"[object Object]"===Object.prototype.toString.call(r)?C((function(r,e){return t(n[e])&&(r[e]=n[e]),r}),{},$(n)):function(t,n){for(var r=0,e=n.length,o=[];r<e;)t(n[r])&&(o[o.length]=n[r]),r+=1;return o}(t,n);var r}))),T=function(){function t(t,n){this.xf=n,this.f=t,this.found=!1}return t.prototype["@@transducer/init"]=v,t.prototype["@@transducer/result"]=function(t){return this.found||(t=this.xf["@@transducer/step"](t,void 0)),this.xf["@@transducer/result"](t)},t.prototype["@@transducer/step"]=function(t,n){var r;return this.f(n)&&(this.found=!0,t=(r=this.xf["@@transducer/step"](t,n))&&r["@@transducer/reduced"]?r:{"@@transducer/value":r,"@@transducer/reduced":!0}),t},t}(),B=f(y(["find"],f((function(t,n){return new T(t,n)})),(function(t,n){for(var r=0,e=n.length;r<e;){if(t(n[r]))return n[r];r+=1}})));var D="function"==typeof Object.assign?Object.assign:function(t){if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var n=Object(t),r=1,e=arguments.length;r<e;){var o=arguments[r];if(null!=o)for(var u in o)S(u,o)&&(n[u]=o[u]);r+=1}return n},F=f((function(t,n){return D({},t,n)})),W=N((function(t,n){return!!B((function(t){return t===n}),t)})),X=function(t){return t.preventDefault()},_={container:"div",containerClass:"dialog-wrapper",transitionName:"fade",containerStyle:{zIndex:999},closeButtonClass:"close-btn"},q={awaitClose:!0},G=t.extend({name:"abc",data:function(){return{visible:!0,id:"",closed:!1,onClose:function(t,n){for(var r=[],e=2;e<arguments.length;e++)r[e-2]=arguments[e]}}},watch:{closed:function(t){t&&(this.visible=!1)}},methods:{close:function(t){for(var n=[],r=1;r<arguments.length;r++)n[r-1]=arguments[r];this.closed=!0,this.onClose&&"function"==typeof this.onClose&&this.onClose.apply(this,c([this,t],n))},handleAfterLeave:function(){this.$destroy(),this.$el&&this.$el.parentNode&&this.$el.parentNode.removeChild(this.$el)}}}),H=function(t,n){return function(r){return new Promise((function(e,o){var u=F(q,r),a=u.type,s=u.props,f=void 0===s?{text:"hi father",a:"s"}:s,l=u.awaitClose,p=(u.containerStyle,u.maskClosable),h=u.containerClass,d=l?function(t,n){e({instance:t,type:n})}:r.onClose,y=t[a]||[],v=W(y),g=new G({data:function(){return{onClose:d}},render:function(t){var e=this,o=L((function(t){return!("string"==typeof t||!t.component)}),y).map((function(n){var o=n.component,u=n.on,a=n.slot,s=n.className,l=n.ref,p=r.on,h=p?F(u||{},p):u,d={close:function(t){void 0===t&&(t="close");for(var n=[],r=1;r<arguments.length;r++)n[r-1]=arguments[r];return e.close.apply(e,c([t],n))}},y=h?Object.keys(h).reduce((function(t,n){var r=h[n];return"function"==typeof r?t[n]=function(t){for(var n=[],o=1;o<arguments.length;o++)n[o-1]=arguments[o];r.apply(void 0,c([e,t],n))}:("div"!==o&&o.name===r.name||"div"===o&&r.name===s)&&(t[n]=function(t){for(var n=[],o=1;o<arguments.length;o++)n[o-1]=arguments[o];r.fn.apply(r,c([e,t],n))}),t}),{}):{},v=F(d,y),g=F(n.defaultProps||{},f);return t(o,i([{attrs:{...g},ref:l},{on:v},{class:s}]),[a])})),u=F(_,n||{}),s=u.container,l=u.containerClass,d=u.conatainerProps,g=u.transitionName,b=u.containerStyle,m=u.closeButtonClass,w=u.maskClosable,O=[];v("close")&&O.push(t("div",{style:{zIndex:2},class:m,on:{click:function(){return e.close("close")}}}));var j,x=[a];return l&&x.push(l),h&&x.push(h),t("transition",{attrs:{name:g},on:{afterLeave:this.handleAfterLeave}},[t("div",{directives:[{name:"show",value:this.visible}],class:"fixed-wrapper",on:{touchmove:X},attrs:{...d},style:b},[t(s,{ref:"body",style:{zIndex:1},class:(j=x,j.reduce((function(t,n){return t+=" "+n}),""))},[O,o]),t("div",{style:{zIndex:0},on:{click:function(){(p||w)&&e.close("close")}},class:"mask-wrapper"})])])}});g.$mount(),document.body.appendChild(g.$el),l||e({instance:g,type:"instance"})}))}};export{H as createVfModal};