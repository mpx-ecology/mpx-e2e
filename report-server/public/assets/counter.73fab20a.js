var ie=Object.defineProperty,re=Object.defineProperties;var de=Object.getOwnPropertyDescriptors;var T=Object.getOwnPropertySymbols;var ce=Object.prototype.hasOwnProperty,be=Object.prototype.propertyIsEnumerable;var O=(a,t,o)=>t in a?ie(a,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):a[t]=o,S=(a,t)=>{for(var o in t||(t={}))ce.call(t,o)&&O(a,o,t[o]);if(T)for(var o of T(t))be.call(t,o)&&O(a,o,t[o]);return a},I=(a,t)=>re(a,de(t));import{N as W,O as $,P as me,Q as ve,k as y,R as Q,U as z,S as U,T as M,V as P,y as V,W as E,X as fe,Y as X,z as Y,Z,$ as q,a as w,a0 as H,u as N,o as g,D as J,s as _,h as j,a1 as L,a2 as G,e,c as C,I as B,n as k,r as D,F as pe,f as ee,t as ae,g as F,a3 as le,_ as A,i as he,a4 as ke,a5 as ge,w as ye,a6 as te,a7 as Ce,a8 as K}from"./index.b6f87bf2.js";const xe={modelValue:{type:Array,default:()=>[]},disabled:Boolean,min:{type:Number,default:void 0},max:{type:Number,default:void 0},size:W,id:{type:String,default:void 0},label:{type:String,default:void 0},fill:{type:String,default:void 0},textColor:{type:String,default:void 0},tag:{type:String,default:"div"}},ne={modelValue:{type:[Number,String,Boolean],default:()=>{}},label:{type:[String,Boolean,Number,Object]},indeterminate:Boolean,disabled:Boolean,checked:Boolean,name:{type:String,default:void 0},trueLabel:{type:[String,Number],default:void 0},falseLabel:{type:[String,Number],default:void 0},id:{type:String,default:void 0},controls:{type:String,default:void 0},border:Boolean,size:W,tabindex:[String,Number]},x=()=>{const a=$(me,{}),t=$(ve,{}),o=$("CheckboxGroup",{}),r=y(()=>o&&(o==null?void 0:o.name)==="ElCheckboxGroup"),c=y(()=>t.size);return{isGroup:r,checkboxGroup:o,elForm:a,elFormItemSize:c,elFormItem:t}},Se=(a,{elFormItem:t})=>{const{inputId:o,isLabeledByFormItem:r}=Q(a,{formItemContext:t});return{isLabeledByFormItem:r,groupId:o}},Ie=a=>{const t=V(!1),{emit:o}=q(),{isGroup:r,checkboxGroup:c,elFormItem:m}=x(),b=V(!1);return{model:y({get(){var i,d;return r.value?(i=c.modelValue)==null?void 0:i.value:(d=a.modelValue)!=null?d:t.value},set(i){var d;r.value&&Array.isArray(i)?(b.value=c.max!==void 0&&i.length>c.max.value,b.value===!1&&((d=c==null?void 0:c.changeEvent)==null||d.call(c,i))):(o(z,i),t.value=i)}}),isGroup:r,isLimitExceeded:b,elFormItem:m}},Le=(a,t,{model:o})=>{const{isGroup:r,checkboxGroup:c}=x(),m=V(!1),b=E(c==null?void 0:c.checkboxGroupSize,{prop:!0}),f=y(()=>{const l=o.value;return fe(l)==="[object Boolean]"?l:Array.isArray(l)?l.includes(a.label):l!=null?l===a.trueLabel:!!l}),i=E(y(()=>{var l;return r.value?(l=c==null?void 0:c.checkboxGroupSize)==null?void 0:l.value:void 0})),d=y(()=>!!(t.default||a.label));return{isChecked:f,focus:m,size:b,checkboxSize:i,hasOwnLabel:d}},Ge=(a,{model:t,isChecked:o})=>{const{elForm:r,isGroup:c,checkboxGroup:m}=x(),b=y(()=>{var i,d;const l=(i=m.max)==null?void 0:i.value,h=(d=m.min)==null?void 0:d.value;return!!(l||h)&&t.value.length>=l&&!o.value||t.value.length<=h&&o.value});return{isDisabled:y(()=>{var i,d;const l=a.disabled||(r==null?void 0:r.disabled);return(d=c.value?((i=m.disabled)==null?void 0:i.value)||l||b.value:l)!=null?d:!1}),isLimitDisabled:b}},Be=(a,{model:t})=>{function o(){Array.isArray(t.value)&&!t.value.includes(a.label)?t.value.push(a.label):t.value=a.trueLabel||!0}a.checked&&o()},$e=(a,{model:t,isLimitExceeded:o,hasOwnLabel:r,isDisabled:c,isLabeledByFormItem:m})=>{const{elFormItem:b}=x(),{emit:f}=q();function i(u){var n,s;return u===a.trueLabel||u===!0?(n=a.trueLabel)!=null?n:!0:(s=a.falseLabel)!=null?s:!1}function d(u,n){f("change",i(u),n)}function l(u){if(o.value)return;const n=u.target;f("change",i(n.checked),u)}async function h(u){o.value||!r.value&&!c.value&&m.value&&(t.value=i([!1,a.falseLabel].includes(t.value)),await X(),d(t.value,u))}return Y(()=>a.modelValue,()=>{var u;(u=b==null?void 0:b.validate)==null||u.call(b,"change").catch(n=>Z())}),{handleChange:l,onClickRoot:h}},R={[z]:a=>U(a)||M(a)||P(a),change:a=>U(a)||M(a)||P(a)},oe=(a,t)=>{const{model:o,isGroup:r,isLimitExceeded:c,elFormItem:m}=Ie(a),{focus:b,size:f,isChecked:i,checkboxSize:d,hasOwnLabel:l}=Le(a,t,{model:o}),{isDisabled:h}=Ge(a,{model:o,isChecked:i}),{inputId:u,isLabeledByFormItem:n}=Q(a,{formItemContext:m,disableIdGeneration:l,disableIdManagement:r}),{handleChange:s,onClickRoot:v}=$e(a,{model:o,isLimitExceeded:c,hasOwnLabel:l,isDisabled:h,isLabeledByFormItem:n});return Be(a,{model:o}),{elFormItem:m,inputId:u,isLabeledByFormItem:n,isChecked:i,isDisabled:h,isGroup:r,checkboxSize:d,hasOwnLabel:l,model:o,handleChange:s,onClickRoot:v,focus:b,size:f}},Ve=["tabindex","role","aria-checked"],Ee=["id","aria-hidden","name","tabindex","disabled","true-value","false-value"],Fe=["id","aria-hidden","disabled","value","name","tabindex"],ze={name:"ElCheckbox"},we=w(I(S({},ze),{props:ne,emits:R,setup(a){const t=a,o=H(),{inputId:r,isLabeledByFormItem:c,isChecked:m,isDisabled:b,checkboxSize:f,hasOwnLabel:i,model:d,handleChange:l,onClickRoot:h,focus:u}=oe(t,o),n=N("checkbox");return(s,v)=>(g(),J(le(!e(i)&&e(c)?"span":"label"),{class:k([e(n).b(),e(n).m(e(f)),e(n).is("disabled",e(b)),e(n).is("bordered",s.border),e(n).is("checked",e(m))]),"aria-controls":s.indeterminate?s.controls:null,onClick:e(h)},{default:_(()=>[j("span",{class:k([e(n).e("input"),e(n).is("disabled",e(b)),e(n).is("checked",e(m)),e(n).is("indeterminate",s.indeterminate),e(n).is("focus",e(u))]),tabindex:s.indeterminate?0:void 0,role:s.indeterminate?"checkbox":void 0,"aria-checked":s.indeterminate?"mixed":void 0},[s.trueLabel||s.falseLabel?L((g(),C("input",{key:0,id:e(r),"onUpdate:modelValue":v[0]||(v[0]=p=>B(d)?d.value=p:null),class:k(e(n).e("original")),type:"checkbox","aria-hidden":s.indeterminate?"true":"false",name:s.name,tabindex:s.tabindex,disabled:e(b),"true-value":s.trueLabel,"false-value":s.falseLabel,onChange:v[1]||(v[1]=(...p)=>e(l)&&e(l)(...p)),onFocus:v[2]||(v[2]=p=>u.value=!0),onBlur:v[3]||(v[3]=p=>u.value=!1)},null,42,Ee)),[[G,e(d)]]):L((g(),C("input",{key:1,id:e(r),"onUpdate:modelValue":v[4]||(v[4]=p=>B(d)?d.value=p:null),class:k(e(n).e("original")),type:"checkbox","aria-hidden":s.indeterminate?"true":"false",disabled:e(b),value:s.label,name:s.name,tabindex:s.tabindex,onChange:v[5]||(v[5]=(...p)=>e(l)&&e(l)(...p)),onFocus:v[6]||(v[6]=p=>u.value=!0),onBlur:v[7]||(v[7]=p=>u.value=!1)},null,42,Fe)),[[G,e(d)]]),j("span",{class:k(e(n).e("inner"))},null,2)],10,Ve),e(i)?(g(),C("span",{key:0,class:k(e(n).e("label"))},[D(s.$slots,"default"),s.$slots.default?F("v-if",!0):(g(),C(pe,{key:0},[ee(ae(s.label),1)],2112))],2)):F("v-if",!0)]),_:3},8,["class","aria-controls","onClick"]))}}));var Ne=A(we,[["__file","/home/runner/work/element-plus/element-plus/packages/components/checkbox/src/checkbox.vue"]]);const De=["name","tabindex","disabled","true-value","false-value"],Ae=["name","tabindex","disabled","value"],Re={name:"ElCheckboxButton"},Te=w(I(S({},Re),{props:ne,emits:R,setup(a){const t=a,o=H(),{focus:r,isChecked:c,isDisabled:m,size:b,model:f,handleChange:i}=oe(t,o),{checkboxGroup:d}=x(),l=N("checkbox"),h=y(()=>{var u,n,s,v;const p=(n=(u=d==null?void 0:d.fill)==null?void 0:u.value)!=null?n:"";return{backgroundColor:p,borderColor:p,color:(v=(s=d==null?void 0:d.textColor)==null?void 0:s.value)!=null?v:"",boxShadow:p?`-1px 0 0 0 ${p}`:void 0}});return(u,n)=>(g(),C("label",{class:k([e(l).b("button"),e(l).bm("button",e(b)),e(l).is("disabled",e(m)),e(l).is("checked",e(c)),e(l).is("focus",e(r))])},[u.trueLabel||u.falseLabel?L((g(),C("input",{key:0,"onUpdate:modelValue":n[0]||(n[0]=s=>B(f)?f.value=s:null),class:k(e(l).be("button","original")),type:"checkbox",name:u.name,tabindex:u.tabindex,disabled:e(m),"true-value":u.trueLabel,"false-value":u.falseLabel,onChange:n[1]||(n[1]=(...s)=>e(i)&&e(i)(...s)),onFocus:n[2]||(n[2]=s=>r.value=!0),onBlur:n[3]||(n[3]=s=>r.value=!1)},null,42,De)),[[G,e(f)]]):L((g(),C("input",{key:1,"onUpdate:modelValue":n[4]||(n[4]=s=>B(f)?f.value=s:null),class:k(e(l).be("button","original")),type:"checkbox",name:u.name,tabindex:u.tabindex,disabled:e(m),value:u.label,onChange:n[5]||(n[5]=(...s)=>e(i)&&e(i)(...s)),onFocus:n[6]||(n[6]=s=>r.value=!0),onBlur:n[7]||(n[7]=s=>r.value=!1)},null,42,Ae)),[[G,e(f)]]),u.$slots.default||u.label?(g(),C("span",{key:2,class:k(e(l).be("button","inner")),style:he(e(c)?e(h):void 0)},[D(u.$slots,"default",{},()=>[ee(ae(u.label),1)])],6)):F("v-if",!0)],2))}}));var se=A(Te,[["__file","/home/runner/work/element-plus/element-plus/packages/components/checkbox/src/checkbox-button.vue"]]);const Oe={name:"ElCheckboxGroup"},Ue=w(I(S({},Oe),{props:xe,emits:R,setup(a,{emit:t}){const o=a,{elFormItem:r}=x(),{groupId:c,isLabeledByFormItem:m}=Se(o,{elFormItem:r}),b=E(),f=N("checkbox"),i=l=>{t(z,l),X(()=>{t("change",l)})},d=y({get(){return o.modelValue},set(l){i(l)}});return ke("CheckboxGroup",I(S({name:"ElCheckboxGroup",modelValue:d},ge(o)),{checkboxGroupSize:b,changeEvent:i})),Y(()=>o.modelValue,()=>{var l;(l=r.validate)==null||l.call(r,"change").catch(h=>Z())}),(l,h)=>(g(),J(le(l.tag),{id:e(c),class:k(e(f).b("group")),role:"group","aria-label":e(m)?void 0:l.label||"checkbox-group","aria-labelledby":e(m)?e(r).labelId:void 0},{default:_(()=>[D(l.$slots,"default")]),_:3},8,["id","class","aria-label","aria-labelledby"]))}}));var ue=A(Ue,[["__file","/home/runner/work/element-plus/element-plus/packages/components/checkbox/src/checkbox-group.vue"]]);const je=ye(Ne,{CheckboxButton:se,CheckboxGroup:ue});te(se);const Ke=te(ue),We=Ce({id:"counter",state:()=>({reportList:[],counter:0,systemInfo:{}}),getters:{doubleCount:a=>a.counter*2},actions:{increment(){this.counter++},async getData(){const a=location.origin,t=await K.get(`${a}/common/testResult`);this.reportList=t.data.data.reportList},async getSystemInfo(){const a=location.origin,t=await K.get(`${a}/common/systemInfo`);this.systemInfo=t.data.data}}});export{je as E,Ke as a,We as u};