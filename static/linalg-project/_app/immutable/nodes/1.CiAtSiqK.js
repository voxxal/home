import{a as d,t as v}from"../chunks/disclose-version.DC_-aIS6.js";import{aa as h,ab as p,D as $,R as x,ac as k,ad as u,M as _,ae as y,a4 as j,af as D,p as E,f as M,ag as R,e as S,ah as q,ai as l,aj as g}from"../chunks/runtime.Vh-rwUBt.js";import{s as b}from"../chunks/render.B-VWbujB.js";import{s as w,a as z}from"../chunks/store.DFgw8K9C.js";import{s as A}from"../chunks/entry.CvmNyOrp.js";function B(s=!1){const e=$,t=e.l.u;if(!t)return;let n=()=>y(e.s);if(s){let r=0,a={};const c=j(()=>{let f=!1;const i=e.s;for(const o in i)i[o]!==a[o]&&(a[o]=i[o],f=!0);return f&&r++,r});n=()=>_(c)}t.b.length&&h(()=>{m(e,n),u(t.b)}),p(()=>{const r=x(()=>t.m.map(k));return()=>{for(const a of r)typeof a=="function"&&a()}}),t.a.length&&p(()=>{m(e,n),u(t.a)})}function m(s,e){if(s.l.s)for(const t of s.l.s)_(t);e()}D();const C=()=>{const s=A;return{page:{subscribe:s.page.subscribe},navigating:{subscribe:s.navigating.subscribe},updated:s.updated}},F={subscribe(s){return C().page.subscribe(s)}};var G=v("<h1> </h1> <p> </p>",1);function N(s,e){E(e,!1);const t=w(),n=()=>z(F,"$page",t);B();var r=G(),a=M(r),c=l(a,!0);g(a);var f=q(a,2),i=l(f,!0);g(f),R(()=>{var o;b(c,n().status),b(i,(o=n().error)==null?void 0:o.message)}),d(s,r),S()}export{N as component};