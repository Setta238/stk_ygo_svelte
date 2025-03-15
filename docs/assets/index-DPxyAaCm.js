var La=Object.defineProperty;var Ra=(n,e,t)=>e in n?La(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var d=(n,e,t)=>Ra(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();const On=!1;var ti=Array.isArray,Oa=Array.prototype.indexOf,ni=Array.from,Gi=Object.defineProperty,qt=Object.getOwnPropertyDescriptor,ji=Object.getOwnPropertyDescriptors,Za=Object.prototype,Ia=Array.prototype,ii=Object.getPrototypeOf;function $a(n){return typeof n=="function"}const ze=()=>{};function Ua(n){return typeof(n==null?void 0:n.then)=="function"}function Ga(n){return n()}function Zn(n){for(var e=0;e<n.length;e++)n[e]()}const $e=2,Yi=4,gn=8,Bn=16,dt=32,en=64,un=128,Ie=256,hn=512,Ke=1024,pt=2048,It=4096,ot=8192,En=16384,zi=32768,Tn=65536,Vi=1<<17,ja=1<<19,Qi=1<<20,lt=Symbol("$state"),Ya=Symbol("legacy props"),za=Symbol("");function Ji(n){return n===this.v}function Xi(n,e){return n!=n?e==e:n!==e||n!==null&&typeof n=="object"||typeof n=="function"}function ai(n){return!Xi(n,this.v)}function Va(n){throw new Error("https://svelte.dev/e/effect_in_teardown")}function Qa(){throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function Ja(n){throw new Error("https://svelte.dev/e/effect_orphan")}function Xa(){throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function er(n){throw new Error("https://svelte.dev/e/props_invalid_value")}function tr(){throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function nr(){throw new Error("https://svelte.dev/e/state_prototype_fixed")}function ir(){throw new Error("https://svelte.dev/e/state_unsafe_local_read")}function ar(){throw new Error("https://svelte.dev/e/state_unsafe_mutation")}let tn=!1,rr=!1;function sr(){tn=!0}const ri=1,si=2,ea=4,or=8,lr=16,Ar=1,dr=2,pr=4,cr=8,kr=16,mr=1,ur=2,hr=4,fr=1,wr=2,xe=Symbol();let De=null;function fn(n){De=n}function be(n,e=!1,t){De={p:De,c:null,e:null,m:!1,s:n,x:null,l:null},tn&&!e&&(De.l={s:null,u:null,r1:[],r2:Fe(!1)})}function _e(n){const e=De;if(e!==null){const o=e.e;if(o!==null){var t=de,i=ke;e.e=null;try{for(var a=0;a<o.length;a++){var r=o[a];Ge(r.effect),Ue(r.reaction),Gt(r.fn)}}finally{Ge(t),Ue(i)}}De=e.p,e.m=!0}return{}}function $t(){return!tn||De!==null&&De.l===null}function Fe(n,e){var t={f:0,v:n,reactions:null,equals:Ji,rv:0,wv:0};return t}function Cr(n){return ta(Fe(n))}function Rt(n,e=!1){var i;const t=Fe(n);return e||(t.equals=ai),tn&&De!==null&&De.l!==null&&((i=De.l).s??(i.s=[])).push(t),t}function Ce(n,e=!1){return ta(Rt(n,e))}function ta(n){return ke!==null&&!Je&&ke.f&$e&&(Xe===null?br([n]):Xe.push(n)),n}function Le(n,e){return te(n,et(()=>A(n))),e}function te(n,e){return ke!==null&&!Je&&$t()&&ke.f&($e|Bn)&&(Xe===null||!Xe.includes(n))&&ar(),ht(n,e)}function ht(n,e){return n.equals(e)||(n.v,n.v=e,n.wv=Ca(),na(n,pt),$t()&&de!==null&&de.f&Ke&&!(de.f&(dt|en))&&(at===null?_r([n]):at.push(n))),e}function na(n,e){var t=n.reactions;if(t!==null)for(var i=$t(),a=t.length,r=0;r<a;r++){var o=t[r],k=o.f;k&pt||!i&&o===de||(tt(o,e),k&(Ke|Ie)&&(k&$e?na(o,It):Fn(o)))}}let ia=!1;function kt(n,e=null,t){if(typeof n!="object"||n===null||lt in n)return n;const i=ii(n);if(i!==Za&&i!==Ia)return n;var a=new Map,r=ti(n),o=Fe(0);r&&a.set("length",Fe(n.length));var k;return new Proxy(n,{defineProperty(m,c,u){(!("value"in u)||u.configurable===!1||u.enumerable===!1||u.writable===!1)&&tr();var C=a.get(c);return C===void 0?(C=Fe(u.value),a.set(c,C)):te(C,kt(u.value,k)),!0},deleteProperty(m,c){var u=a.get(c);if(u===void 0)c in m&&a.set(c,Fe(xe));else{if(r&&typeof c=="string"){var C=a.get("length"),s=Number(c);Number.isInteger(s)&&s<C.v&&te(C,s)}te(u,xe),Ci(o)}return!0},get(m,c,u){var f;if(c===lt)return n;var C=a.get(c),s=c in m;if(C===void 0&&(!s||(f=qt(m,c))!=null&&f.writable)&&(C=Fe(kt(s?m[c]:xe,k)),a.set(c,C)),C!==void 0){var p=A(C);return p===xe?void 0:p}return Reflect.get(m,c,u)},getOwnPropertyDescriptor(m,c){var u=Reflect.getOwnPropertyDescriptor(m,c);if(u&&"value"in u){var C=a.get(c);C&&(u.value=A(C))}else if(u===void 0){var s=a.get(c),p=s==null?void 0:s.v;if(s!==void 0&&p!==xe)return{enumerable:!0,configurable:!0,value:p,writable:!0}}return u},has(m,c){var p;if(c===lt)return!0;var u=a.get(c),C=u!==void 0&&u.v!==xe||Reflect.has(m,c);if(u!==void 0||de!==null&&(!C||(p=qt(m,c))!=null&&p.writable)){u===void 0&&(u=Fe(C?kt(m[c],k):xe),a.set(c,u));var s=A(u);if(s===xe)return!1}return C},set(m,c,u,C){var T;var s=a.get(c),p=c in m;if(r&&c==="length")for(var f=u;f<s.v;f+=1){var y=a.get(f+"");y!==void 0?te(y,xe):f in m&&(y=Fe(xe),a.set(f+"",y))}s===void 0?(!p||(T=qt(m,c))!=null&&T.writable)&&(s=Fe(void 0),te(s,kt(u,k)),a.set(c,s)):(p=s.v!==xe,te(s,kt(u,k)));var l=Reflect.getOwnPropertyDescriptor(m,c);if(l!=null&&l.set&&l.set.call(C,u),!p){if(r&&typeof c=="string"){var w=a.get("length"),D=Number(c);Number.isInteger(D)&&D>=w.v&&te(w,D+1)}Ci(o)}return!0},ownKeys(m){A(o);var c=Reflect.ownKeys(m).filter(s=>{var p=a.get(s);return p===void 0||p.v!==xe});for(var[u,C]of a)C.v!==xe&&!(u in m)&&c.push(u);return c},setPrototypeOf(){nr()}})}function Ci(n,e=1){te(n,n.v+e)}function Di(n){return n!==null&&typeof n=="object"&&lt in n?n[lt]:n}function aa(n,e){return Object.is(Di(n),Di(e))}var yi,ra,sa,oa;function Dr(){if(yi===void 0){yi=window,ra=/Firefox/.test(navigator.userAgent);var n=Element.prototype,e=Node.prototype;sa=qt(e,"firstChild").get,oa=qt(e,"nextSibling").get,n.__click=void 0,n.__className="",n.__attributes=null,n.__styles=null,n.__e=void 0,Text.prototype.__t=void 0}}function xn(n=""){return document.createTextNode(n)}function wn(n){return sa.call(n)}function Mn(n){return oa.call(n)}function h(n,e){return wn(n)}function ne(n,e){{var t=wn(n);return t instanceof Comment&&t.data===""?Mn(t):t}}function v(n,e=1,t=!1){let i=n;for(;e--;)i=Mn(i);return i}function yr(n){n.textContent=""}function Bt(n){var e=$e|pt,t=ke!==null&&ke.f&$e?ke:null;return de===null||t!==null&&t.f&Ie?e|=Ie:de.f|=Qi,{ctx:De,deps:null,effects:null,equals:Ji,f:e,fn:n,reactions:null,rv:0,v:null,wv:0,parent:t??de}}function ye(n){const e=Bt(n);return e.equals=ai,e}function la(n){var e=n.effects;if(e!==null){n.effects=null;for(var t=0;t<e.length;t+=1)ft(e[t])}}function vr(n){for(var e=n.parent;e!==null;){if(!(e.f&$e))return e;e=e.parent}return null}function gr(n){var e,t=de;Ge(vr(n));try{la(n),e=ya(n)}finally{Ge(t)}return e}function Aa(n){var e=gr(n),t=(ut||n.f&Ie)&&n.deps!==null?It:Ke;tt(n,t),n.equals(e)||(n.v=e,n.wv=Ca())}function da(n){de===null&&ke===null&&Ja(),ke!==null&&ke.f&Ie&&de===null&&Qa(),Ai&&Va()}function Br(n,e){var t=e.last;t===null?e.last=e.first=n:(t.next=n,n.prev=t,e.last=n)}function Ut(n,e,t,i=!0){var a=(n&en)!==0,r=de,o={ctx:De,deps:null,nodes_start:null,nodes_end:null,f:n|pt,first:null,fn:e,last:null,next:null,parent:a?null:r,prev:null,teardown:null,transitions:null,wv:0};if(t){var k=Wt;try{gi(!0),di(o),o.f|=zi}catch(u){throw ft(o),u}finally{gi(k)}}else e!==null&&Fn(o);var m=t&&o.deps===null&&o.first===null&&o.nodes_start===null&&o.teardown===null&&(o.f&(Qi|un))===0;if(!m&&!a&&i&&(r!==null&&Br(o,r),ke!==null&&ke.f&$e)){var c=ke;(c.effects??(c.effects=[])).push(o)}return o}function oi(n){const e=Ut(gn,null,!1);return tt(e,Ke),e.teardown=n,e}function vi(n){da();var e=de!==null&&(de.f&dt)!==0&&De!==null&&!De.m;if(e){var t=De;(t.e??(t.e=[])).push({fn:n,effect:de,reaction:ke})}else{var i=Gt(n);return i}}function Er(n){return da(),Nn(n)}function Tr(n){const e=Ut(en,n,!0);return(t={})=>new Promise(i=>{t.outro?Dt(e,()=>{ft(e),i(void 0)}):(ft(e),i(void 0))})}function Gt(n){return Ut(Yi,n,!1)}function Nn(n){return Ut(gn,n,!0)}function L(n,e=[],t=Bt){const i=e.map(t);return bn(()=>n(...i.map(A)))}function bn(n,e=0){return Ut(gn|Bn|e,n,!0)}function Et(n,e=!0){return Ut(gn|dt,n,!0,e)}function pa(n){var e=n.teardown;if(e!==null){const t=Ai,i=ke;Bi(!0),Ue(null);try{e.call(null)}finally{Bi(t),Ue(i)}}}function ca(n,e=!1){var t=n.first;for(n.first=n.last=null;t!==null;){var i=t.next;ft(t,e),t=i}}function xr(n){for(var e=n.first;e!==null;){var t=e.next;e.f&dt||ft(e),e=t}}function ft(n,e=!0){var t=!1;if((e||n.f&ja)&&n.nodes_start!==null){for(var i=n.nodes_start,a=n.nodes_end;i!==null;){var r=i===a?null:Mn(i);i.remove(),i=r}t=!0}ca(n,e&&!t),yn(n,0),tt(n,En);var o=n.transitions;if(o!==null)for(const m of o)m.stop();pa(n);var k=n.parent;k!==null&&k.first!==null&&ka(n),n.next=n.prev=n.teardown=n.ctx=n.deps=n.fn=n.nodes_start=n.nodes_end=null}function ka(n){var e=n.parent,t=n.prev,i=n.next;t!==null&&(t.next=i),i!==null&&(i.prev=t),e!==null&&(e.first===n&&(e.first=i),e.last===n&&(e.last=t))}function Dt(n,e){var t=[];li(n,t,!0),ma(t,()=>{ft(n),e&&e()})}function ma(n,e){var t=n.length;if(t>0){var i=()=>--t||e();for(var a of n)a.out(i)}else e()}function li(n,e,t){if(!(n.f&ot)){if(n.f^=ot,n.transitions!==null)for(const o of n.transitions)(o.is_global||t)&&e.push(o);for(var i=n.first;i!==null;){var a=i.next,r=(i.f&Tn)!==0||(i.f&dt)!==0;li(i,e,r?t:!1),i=a}}}function Ot(n){ua(n,!0)}function ua(n,e){if(n.f&ot){n.f^=ot,n.f&Ke||(n.f^=Ke),nn(n)&&(tt(n,pt),Fn(n));for(var t=n.first;t!==null;){var i=t.next,a=(t.f&Tn)!==0||(t.f&dt)!==0;ua(t,a?e:!1),t=i}if(n.transitions!==null)for(const r of n.transitions)(r.is_global||e)&&r.in()}}let Cn=!1,In=[];function ha(){Cn=!1;const n=In.slice();In=[],Zn(n)}function Tt(n){Cn||(Cn=!0,queueMicrotask(ha)),In.push(n)}function Mr(){Cn&&ha()}const fa=0,Nr=1;let pn=!1,cn=fa,Jt=!1,Xt=null,Wt=!1,Ai=!1;function gi(n){Wt=n}function Bi(n){Ai=n}let Ct=[],Lt=0;let ke=null,Je=!1;function Ue(n){ke=n}let de=null;function Ge(n){de=n}let Xe=null;function br(n){Xe=n}let He=null,We=0,at=null;function _r(n){at=n}let wa=1,Dn=0,ut=!1,mt=null;function Ca(){return++wa}function nn(n){var C;var e=n.f;if(e&pt)return!0;if(e&It){var t=n.deps,i=(e&Ie)!==0;if(t!==null){var a,r,o=(e&hn)!==0,k=i&&de!==null&&!ut,m=t.length;if(o||k){var c=n,u=c.parent;for(a=0;a<m;a++)r=t[a],(o||!((C=r==null?void 0:r.reactions)!=null&&C.includes(c)))&&(r.reactions??(r.reactions=[])).push(c);o&&(c.f^=hn),k&&u!==null&&!(u.f&Ie)&&(c.f^=Ie)}for(a=0;a<m;a++)if(r=t[a],nn(r)&&Aa(r),r.wv>n.wv)return!0}(!i||de!==null&&!ut)&&tt(n,Ke)}return!1}function Fr(n,e){for(var t=e;t!==null;){if(t.f&un)try{t.fn(n);return}catch{t.f^=un}t=t.parent}throw pn=!1,n}function Hr(n){return(n.f&En)===0&&(n.parent===null||(n.parent.f&un)===0)}function _n(n,e,t,i){if(pn){if(t===null&&(pn=!1),Hr(e))throw n;return}t!==null&&(pn=!0);{Fr(n,e);return}}function Da(n,e,t=!0){var i=n.reactions;if(i!==null)for(var a=0;a<i.length;a++){var r=i[a];r.f&$e?Da(r,e,!1):e===r&&(t?tt(r,pt):r.f&Ke&&tt(r,It),Fn(r))}}function ya(n){var p;var e=He,t=We,i=at,a=ke,r=ut,o=Xe,k=De,m=Je,c=n.f;He=null,We=0,at=null,ke=c&(dt|en)?null:n,ut=(c&Ie)!==0&&(!Wt||a===null||m),Xe=null,fn(n.ctx),Je=!1,Dn++;try{var u=(0,n.fn)(),C=n.deps;if(He!==null){var s;if(yn(n,We),C!==null&&We>0)for(C.length=We+He.length,s=0;s<He.length;s++)C[We+s]=He[s];else n.deps=C=He;if(!ut)for(s=We;s<C.length;s++)((p=C[s]).reactions??(p.reactions=[])).push(n)}else C!==null&&We<C.length&&(yn(n,We),C.length=We);if($t()&&at!==null&&!Je&&C!==null&&!(n.f&($e|It|pt)))for(s=0;s<at.length;s++)Da(at[s],n);return a!==null&&Dn++,u}finally{He=e,We=t,at=i,ke=a,ut=r,Xe=o,fn(k),Je=m}}function Sr(n,e){let t=e.reactions;if(t!==null){var i=Oa.call(t,n);if(i!==-1){var a=t.length-1;a===0?t=e.reactions=null:(t[i]=t[a],t.pop())}}t===null&&e.f&$e&&(He===null||!He.includes(e))&&(tt(e,It),e.f&(Ie|hn)||(e.f^=hn),la(e),yn(e,0))}function yn(n,e){var t=n.deps;if(t!==null)for(var i=e;i<t.length;i++)Sr(n,t[i])}function di(n){var e=n.f;if(!(e&En)){tt(n,Ke);var t=de,i=De;de=n;try{e&Bn?xr(n):ca(n),pa(n);var a=ya(n);n.teardown=typeof a=="function"?a:null,n.wv=wa;var r=n.deps,o;On&&rr&&n.f&pt}catch(k){_n(k,n,t,i||n.ctx)}finally{de=t}}}function va(){if(Lt>1e3){Lt=0;try{Xa()}catch(n){if(Xt!==null)_n(n,Xt,null);else throw n}}Lt++}function ga(n){var e=n.length;if(e!==0){va();var t=Wt;Wt=!0;try{for(var i=0;i<e;i++){var a=n[i];a.f&Ke||(a.f^=Ke);var r=qr(a);Kr(r)}}finally{Wt=t}}}function Kr(n){var e=n.length;if(e!==0)for(var t=0;t<e;t++){var i=n[t];if(!(i.f&(En|ot)))try{nn(i)&&(di(i),i.deps===null&&i.first===null&&i.nodes_start===null&&(i.teardown===null?ka(i):i.fn=null))}catch(a){_n(a,i,null,i.ctx)}}}function Pr(){if(Jt=!1,Lt>1001)return;const n=Ct;Ct=[],ga(n),Jt||(Lt=0,Xt=null)}function Fn(n){cn===fa&&(Jt||(Jt=!0,queueMicrotask(Pr))),Xt=n;for(var e=n;e.parent!==null;){e=e.parent;var t=e.f;if(t&(en|dt)){if(!(t&Ke))return;e.f^=Ke}}Ct.push(e)}function qr(n){var e=[],t=n.first;e:for(;t!==null;){var i=t.f,a=(i&dt)!==0,r=a&&(i&Ke)!==0,o=t.next;if(!r&&!(i&ot)){if(i&Yi)e.push(t);else if(a)t.f^=Ke;else{var k=ke;try{ke=t,nn(t)&&di(t)}catch(u){_n(u,t,null,t.ctx)}finally{ke=k}}var m=t.first;if(m!==null){t=m;continue}}if(o===null){let u=t.parent;for(;u!==null;){if(n===u)break e;var c=u.next;if(c!==null){t=c;continue e}u=u.parent}}t=o}return e}function pi(n){var e=cn,t=Ct;try{va();const a=[];cn=Nr,Ct=a,Jt=!1,ga(t);var i=n==null?void 0:n();return Mr(),(Ct.length>0||a.length>0)&&pi(),Lt=0,Xt=null,i}finally{cn=e,Ct=t}}async function Wr(){await Promise.resolve(),pi()}function A(n){var e=n.f,t=(e&$e)!==0;if(mt!==null&&mt.add(n),ke!==null&&!Je){Xe!==null&&Xe.includes(n)&&ir();var i=ke.deps;n.rv<Dn&&(n.rv=Dn,He===null&&i!==null&&i[We]===n?We++:He===null?He=[n]:(!ut||!He.includes(n))&&He.push(n))}else if(t&&n.deps===null&&n.effects===null){var a=n,r=a.parent;r!==null&&!(r.f&Ie)&&(a.f^=Ie)}return t&&(a=n,nn(a)&&Aa(a)),n.v}function Lr(n){var e=mt;mt=new Set;var t=mt,i;try{if(et(n),e!==null)for(i of mt)e.add(i)}finally{mt=e}return t}function Ba(n){var e=Lr(()=>et(n));for(var t of e)if(t.f&Vi)for(const i of t.deps||[])i.f&$e||ht(i,i.v);else ht(t,t.v)}function et(n){var e=Je;try{return Je=!0,n()}finally{Je=e}}const Rr=-7169;function tt(n,e){n.f=n.f&Rr|e}function Or(n){if(!(typeof n!="object"||!n||n instanceof EventTarget)){if(lt in n)$n(n);else if(!Array.isArray(n))for(let e in n){const t=n[e];typeof t=="object"&&t&&lt in t&&$n(t)}}}function $n(n,e=new Set){if(typeof n=="object"&&n!==null&&!(n instanceof EventTarget)&&!e.has(n)){e.add(n),n instanceof Date&&n.getTime();for(let i in n)try{$n(n[i],e)}catch{}const t=ii(n);if(t!==Object.prototype&&t!==Array.prototype&&t!==Map.prototype&&t!==Set.prototype&&t!==Date.prototype){const i=ji(t);for(let a in i){const r=i[a].get;if(r)try{r.call(n)}catch{}}}}}const Zr=["touchstart","touchmove"];function Ir(n){return Zr.includes(n)}let Ei=!1;function $r(){Ei||(Ei=!0,document.addEventListener("reset",n=>{Promise.resolve().then(()=>{var e;if(!n.defaultPrevented)for(const t of n.target.elements)(e=t.__on_r)==null||e.call(t)})},{capture:!0}))}function ci(n){var e=ke,t=de;Ue(null),Ge(null);try{return n()}finally{Ue(e),Ge(t)}}function ki(n,e,t,i=t){n.addEventListener(e,()=>ci(t));const a=n.__on_r;a?n.__on_r=()=>{a(),i(!0)}:n.__on_r=()=>i(!0),$r()}const Ea=new Set,Un=new Set;function Ur(n,e,t,i={}){function a(r){if(i.capture||zt.call(e,r),!r.cancelBubble)return ci(()=>t==null?void 0:t.call(this,r))}return n.startsWith("pointer")||n.startsWith("touch")||n==="wheel"?Tt(()=>{e.addEventListener(n,a,i)}):e.addEventListener(n,a,i),a}function ve(n,e,t,i,a){var r={capture:i,passive:a},o=Ur(n,e,t,r);(e===document.body||e===window||e===document)&&oi(()=>{e.removeEventListener(n,o,r)})}function Hn(n){for(var e=0;e<n.length;e++)Ea.add(n[e]);for(var t of Un)t(n)}function zt(n){var D;var e=this,t=e.ownerDocument,i=n.type,a=((D=n.composedPath)==null?void 0:D.call(n))||[],r=a[0]||n.target,o=0,k=n.__root;if(k){var m=a.indexOf(k);if(m!==-1&&(e===document||e===window)){n.__root=e;return}var c=a.indexOf(e);if(c===-1)return;m<=c&&(o=m)}if(r=a[o]||n.target,r!==e){Gi(n,"currentTarget",{configurable:!0,get(){return r||t}});var u=ke,C=de;Ue(null),Ge(null);try{for(var s,p=[];r!==null;){var f=r.assignedSlot||r.parentNode||r.host||null;try{var y=r["__"+i];if(y!==void 0&&!r.disabled)if(ti(y)){var[l,...w]=y;l.apply(r,[n,...w])}else y.call(r,n)}catch(T){s?p.push(T):s=T}if(n.cancelBubble||f===e||f===null)break;r=f}if(s){for(let T of p)queueMicrotask(()=>{throw T});throw s}}finally{n.__root=e,delete n.currentTarget,Ue(u),Ge(C)}}}function Gr(n){var e=document.createElement("template");return e.innerHTML=n,e.content}function vn(n,e){var t=de;t.nodes_start===null&&(t.nodes_start=n,t.nodes_end=e)}function N(n,e){var t=(e&fr)!==0,i=(e&wr)!==0,a,r=!n.startsWith("<!>");return()=>{a===void 0&&(a=Gr(r?n:"<!>"+n),t||(a=wn(a)));var o=i||ra?document.importNode(a,!0):a.cloneNode(!0);if(t){var k=wn(o),m=o.lastChild;vn(k,m)}else vn(o,o);return o}}function _t(n=""){{var e=xn(n+"");return vn(e,e),e}}function he(){var n=document.createDocumentFragment(),e=document.createComment(""),t=xn();return n.append(e,t),vn(e,t),n}function g(n,e){n!==null&&n.before(e)}let Gn=!0;function F(n,e){var t=e==null?"":typeof e=="object"?e+"":e;t!==(n.__t??(n.__t=n.nodeValue))&&(n.__t=t,n.nodeValue=t+"")}function jr(n,e){return Yr(n,e)}const Ft=new Map;function Yr(n,{target:e,anchor:t,props:i={},events:a,context:r,intro:o=!0}){Dr();var k=new Set,m=C=>{for(var s=0;s<C.length;s++){var p=C[s];if(!k.has(p)){k.add(p);var f=Ir(p);e.addEventListener(p,zt,{passive:f});var y=Ft.get(p);y===void 0?(document.addEventListener(p,zt,{passive:f}),Ft.set(p,1)):Ft.set(p,y+1)}}};m(ni(Ea)),Un.add(m);var c=void 0,u=Tr(()=>{var C=t??e.appendChild(xn());return Et(()=>{if(r){be({});var s=De;s.c=r}a&&(i.$$events=a),Gn=o,c=n(C,i)||{},Gn=!0,r&&_e()}),()=>{var f;for(var s of k){e.removeEventListener(s,zt);var p=Ft.get(s);--p===0?(document.removeEventListener(s,zt),Ft.delete(s)):Ft.set(s,p)}Un.delete(m),C!==t&&((f=C.parentNode)==null||f.removeChild(C))}});return zr.set(c,u),c}let zr=new WeakMap;const Pn=0,ln=1,qn=2;function jn(n,e,t,i,a){var r=n,o=$t(),k=De,m=xe,c,u,C,s=(o?Fe:Rt)(void 0),p=(o?Fe:Rt)(void 0),f=!1;function y(w,D){f=!0,D&&(Ge(l),Ue(l),fn(k));try{w===Pn&&t&&(c?Ot(c):c=Et(()=>t(r))),w===ln&&i&&(u?Ot(u):u=Et(()=>i(r,s))),w!==Pn&&c&&Dt(c,()=>c=null),w!==ln&&u&&Dt(u,()=>u=null),w!==qn&&C&&Dt(C,()=>C=null)}finally{D&&(fn(null),Ue(null),Ge(null),pi())}}var l=bn(()=>{if(m!==(m=e())){if(Ua(m)){var w=m;f=!1,w.then(D=>{w===m&&(ht(s,D),y(ln,!0))},D=>{if(w===m)throw ht(p,D),y(qn,!0),p.v}),Tt(()=>{f||y(Pn,!0)})}else ht(s,m),y(ln,!1);return()=>m=xe}})}function R(n,e,t=!1){var i=n,a=null,r=null,o=xe,k=t?Tn:0,m=!1;const c=(C,s=!0)=>{m=!0,u(s,C)},u=(C,s)=>{o!==(o=C)&&(o?(a?Ot(a):s&&(a=Et(()=>s(i))),r&&Dt(r,()=>{r=null})):(r?Ot(r):s&&(r=Et(()=>s(i))),a&&Dt(a,()=>{a=null})))};bn(()=>{m=!1,e(c),m||u(null,null)},k)}function pe(n,e){return e}function Vr(n,e,t,i){for(var a=[],r=e.length,o=0;o<r;o++)li(e[o].e,a,!0);var k=r>0&&a.length===0&&t!==null;if(k){var m=t.parentNode;yr(m),m.append(t),i.clear(),ct(n,e[0].prev,e[r-1].next)}ma(a,()=>{for(var c=0;c<r;c++){var u=e[c];k||(i.delete(u.k),ct(n,u.prev,u.next)),ft(u.e,!k)}})}function ce(n,e,t,i,a,r=null){var o=n,k={flags:e,items:new Map,first:null},m=(e&ea)!==0;if(m){var c=n;o=c.appendChild(xn())}var u=null,C=!1,s=ye(()=>{var p=t();return ti(p)?p:p==null?[]:ni(p)});bn(()=>{var p=A(s),f=p.length;C&&f===0||(C=f===0,Qr(p,k,o,a,e,i,t),r!==null&&(f===0?u?Ot(u):u=Et(()=>r(o)):u!==null&&Dt(u,()=>{u=null})),A(s))})}function Qr(n,e,t,i,a,r,o){var X,M,O,ie;var k=(a&or)!==0,m=(a&(ri|si))!==0,c=n.length,u=e.items,C=e.first,s=C,p,f=null,y,l=[],w=[],D,T,S,W;if(k)for(W=0;W<c;W+=1)D=n[W],T=r(D,W),S=u.get(T),S!==void 0&&((X=S.a)==null||X.measure(),(y??(y=new Set)).add(S));for(W=0;W<c;W+=1){if(D=n[W],T=r(D,W),S=u.get(T),S===void 0){var _=s?s.e.nodes_start:t;f=Xr(_,e,f,f===null?e.first:f.next,D,T,W,i,a,o),u.set(T,f),l=[],w=[],s=f.next;continue}if(m&&Jr(S,D,W,a),S.e.f&ot&&(Ot(S.e),k&&((M=S.a)==null||M.unfix(),(y??(y=new Set)).delete(S))),S!==s){if(p!==void 0&&p.has(S)){if(l.length<w.length){var $=w[0],E;f=$.prev;var U=l[0],re=l[l.length-1];for(E=0;E<l.length;E+=1)Ti(l[E],$,t);for(E=0;E<w.length;E+=1)p.delete(w[E]);ct(e,U.prev,re.next),ct(e,f,U),ct(e,re,$),s=$,f=re,W-=1,l=[],w=[]}else p.delete(S),Ti(S,s,t),ct(e,S.prev,S.next),ct(e,S,f===null?e.first:f.next),ct(e,f,S),f=S;continue}for(l=[],w=[];s!==null&&s.k!==T;)s.e.f&ot||(p??(p=new Set)).add(s),w.push(s),s=s.next;if(s===null)continue;S=s}l.push(S),f=S,s=S.next}if(s!==null||p!==void 0){for(var se=p===void 0?[]:ni(p);s!==null;)s.e.f&ot||se.push(s),s=s.next;var ue=se.length;if(ue>0){var we=a&ea&&c===0?t:null;if(k){for(W=0;W<ue;W+=1)(O=se[W].a)==null||O.measure();for(W=0;W<ue;W+=1)(ie=se[W].a)==null||ie.fix()}Vr(e,se,we,u)}}k&&Tt(()=>{var I;if(y!==void 0)for(S of y)(I=S.a)==null||I.apply()}),de.first=e.first&&e.first.e,de.last=f&&f.e}function Jr(n,e,t,i){i&ri&&ht(n.v,e),i&si?ht(n.i,t):n.i=t}function Xr(n,e,t,i,a,r,o,k,m,c){var u=(m&ri)!==0,C=(m&lr)===0,s=u?C?Rt(a):Fe(a):a,p=m&si?Fe(o):o,f={i:p,v:s,k:r,a:null,e:null,prev:t,next:i};try{return f.e=Et(()=>k(n,s,p,c),ia),f.e.prev=t&&t.e,f.e.next=i&&i.e,t===null?e.first=f:(t.next=f,t.e.next=f.e),i!==null&&(i.prev=f,i.e.prev=f.e),f}finally{}}function Ti(n,e,t){for(var i=n.next?n.next.e.nodes_start:t,a=e?e.e.nodes_start:t,r=n.e.nodes_start;r!==i;){var o=Mn(r);a.before(r),r=o}}function ct(n,e,t){e===null?n.first=t:(e.next=t,e.e.next=t&&t.e),t!==null&&(t.prev=e,t.e.prev=e&&e.e)}function yt(n,e,t,i){var a=n.__attributes??(n.__attributes={});a[e]!==(a[e]=t)&&(e==="style"&&"__styles"in n&&(n.__styles={}),e==="loading"&&(n[za]=t),t==null?n.removeAttribute(e):typeof t!="string"&&es(n).includes(e)?n[e]=t:n.setAttribute(e,t))}var xi=new Map;function es(n){var e=xi.get(n.nodeName);if(e)return e;xi.set(n.nodeName,e=[]);for(var t,i=n,a=Element.prototype;a!==i;){t=ji(i);for(var r in t)t[r].set&&e.push(r);i=ii(i)}return e}function fe(n,e,t){var i=n.__className,a=ts(e);(i!==a||ia)&&(e==null?n.removeAttribute("class"):n.className=a,n.__className=a)}function ts(n,e){return(n??"")+""}const ns=()=>performance.now(),st={tick:n=>requestAnimationFrame(n),now:()=>ns(),tasks:new Set};function Ta(){const n=st.now();st.tasks.forEach(e=>{e.c(n)||(st.tasks.delete(e),e.f())}),st.tasks.size!==0&&st.tick(Ta)}function is(n){let e;return st.tasks.size===0&&st.tick(Ta),{promise:new Promise(t=>{st.tasks.add(e={c:n,f:t})}),abort(){st.tasks.delete(e)}}}function An(n,e){ci(()=>{n.dispatchEvent(new CustomEvent(e))})}function as(n){if(n==="float")return"cssFloat";if(n==="offset")return"cssOffset";if(n.startsWith("--"))return n;const e=n.split("-");return e.length===1?e[0]:e[0]+e.slice(1).map(t=>t[0].toUpperCase()+t.slice(1)).join("")}function Mi(n){const e={},t=n.split(";");for(const i of t){const[a,r]=i.split(":");if(!a||r===void 0)break;const o=as(a.trim());e[o]=r.trim()}return e}const rs=n=>n;function Ht(n,e,t,i){var a=(n&mr)!==0,r=(n&ur)!==0,o=a&&r,k=(n&hr)!==0,m=o?"both":a?"in":"out",c,u=e.inert,C=e.style.overflow,s,p;function f(){var T=ke,S=de;Ue(null),Ge(null);try{return c??(c=t()(e,(i==null?void 0:i())??{},{direction:m}))}finally{Ue(T),Ge(S)}}var y={is_global:k,in(){var T;if(e.inert=u,!a){p==null||p.abort(),(T=p==null?void 0:p.reset)==null||T.call(p);return}r||s==null||s.abort(),An(e,"introstart"),s=Yn(e,f(),p,1,()=>{An(e,"introend"),s==null||s.abort(),s=c=void 0,e.style.overflow=C})},out(T){if(!r){T==null||T(),c=void 0;return}e.inert=!0,An(e,"outrostart"),p=Yn(e,f(),s,0,()=>{An(e,"outroend"),T==null||T()})},stop:()=>{s==null||s.abort(),p==null||p.abort()}},l=de;if((l.transitions??(l.transitions=[])).push(y),a&&Gn){var w=k;if(!w){for(var D=l.parent;D&&D.f&Tn;)for(;(D=D.parent)&&!(D.f&Bn););w=!D||(D.f&zi)!==0}w&&Gt(()=>{et(()=>y.in())})}}function Yn(n,e,t,i,a){var r=i===1;if($a(e)){var o,k=!1;return Tt(()=>{if(!k){var l=e({direction:r?"in":"out"});o=Yn(n,l,t,i,a)}}),{abort:()=>{k=!0,o==null||o.abort()},deactivate:()=>o.deactivate(),reset:()=>o.reset(),t:()=>o.t()}}if(t==null||t.deactivate(),!(e!=null&&e.duration))return a(),{abort:ze,deactivate:ze,reset:ze,t:()=>i};const{delay:m=0,css:c,tick:u,easing:C=rs}=e;var s=[];if(r&&t===void 0&&(u&&u(0,1),c)){var p=Mi(c(0,1));s.push(p,p)}var f=()=>1-i,y=n.animate(s,{duration:m});return y.onfinish=()=>{var l=(t==null?void 0:t.t())??1-i;t==null||t.abort();var w=i-l,D=e.duration*Math.abs(w),T=[];if(D>0){var S=!1;if(c)for(var W=Math.ceil(D/16.666666666666668),_=0;_<=W;_+=1){var $=l+w*C(_/W),E=Mi(c($,1-$));T.push(E),S||(S=E.overflow==="hidden")}S&&(n.style.overflow="hidden"),f=()=>{var U=y.currentTime;return l+w*C(U/D)},u&&is(()=>{if(y.playState!=="running")return!1;var U=f();return u(U,1-U),!0})}y=n.animate(T,{duration:D,fill:"forwards"}),y.onfinish=()=>{f=()=>i,u==null||u(i,1-i),a()}},{abort:()=>{y&&(y.cancel(),y.effect=null,y.onfinish=ze)},deactivate:()=>{a=ze},reset:()=>{i===0&&(u==null||u(1,0))},t:()=>f()}}function zn(n,e,t=e){var i=$t();ki(n,"input",a=>{var r=a?n.defaultValue:n.value;if(r=Ln(n)?Rn(r):r,t(r),i&&r!==(r=e())){var o=n.selectionStart,k=n.selectionEnd;n.value=r??"",k!==null&&(n.selectionStart=o,n.selectionEnd=Math.min(k,n.value.length))}}),et(e)==null&&n.value&&t(Ln(n)?Rn(n.value):n.value),Nn(()=>{var a=e();Ln(n)&&a===Rn(n.value)||n.type==="date"&&!a&&!n.value||a!==n.value&&(n.value=a??"")})}const Wn=new Set;function St(n,e,t,i,a=i){var r=t.getAttribute("type")==="checkbox",o=n;if(e!==null)for(var k of e)o=o[k]??(o[k]=[]);o.push(t),ki(t,"change",()=>{var m=t.__value;r&&(m=ss(o,m,t.checked)),a(m)},()=>a(r?[]:null)),Nn(()=>{var m=i();r?(m=m||[],t.checked=m.includes(t.__value)):t.checked=aa(t.__value,m)}),oi(()=>{var m=o.indexOf(t);m!==-1&&o.splice(m,1)}),Wn.has(o)||(Wn.add(o),Tt(()=>{o.sort((m,c)=>m.compareDocumentPosition(c)===4?-1:1),Wn.delete(o)})),Tt(()=>{})}function ss(n,e,t){for(var i=new Set,a=0;a<n.length;a+=1)n[a].checked&&i.add(n[a].__value);return t||i.delete(e),Array.from(i)}function Ln(n){var e=n.type;return e==="number"||e==="range"}function Rn(n){return n===""?null:+n}function xa(n,e,t){if(n.multiple)return ls(n,e);for(var i of n.options){var a=Qt(i);if(aa(a,e)){i.selected=!0;return}}(!t||e!==void 0)&&(n.selectedIndex=-1)}function os(n,e){Gt(()=>{var t=new MutationObserver(()=>{var i=n.__value;xa(n,i)});return t.observe(n,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),()=>{t.disconnect()}})}function Ma(n,e,t=e){var i=!0;ki(n,"change",a=>{var r=a?"[selected]":":checked",o;if(n.multiple)o=[].map.call(n.querySelectorAll(r),Qt);else{var k=n.querySelector(r)??n.querySelector("option:not([disabled])");o=k&&Qt(k)}t(o)}),Gt(()=>{var a=e();if(xa(n,a,i),i&&a===void 0){var r=n.querySelector(":checked");r!==null&&(a=Qt(r),t(a))}n.__value=a,i=!1}),os(n)}function ls(n,e){for(var t of n.options)t.selected=~e.indexOf(Qt(t))}function Qt(n){return"__value"in n?n.__value:n.value}function Ni(n,e){return n===e||(n==null?void 0:n[lt])===e}function As(n={},e,t,i){return Gt(()=>{var a,r;return Nn(()=>{a=r,r=[],et(()=>{n!==t(...r)&&(e(n,...r),a&&Ni(t(...a),n)&&e(null,...a))})}),()=>{Tt(()=>{r&&Ni(t(...r),n)&&e(null,...r)})}}),n}function Oe(n=!1){const e=De,t=e.l.u;if(!t)return;let i=()=>Or(e.s);if(n){let a=0,r={};const o=Bt(()=>{let k=!1;const m=e.s;for(const c in m)m[c]!==r[c]&&(r[c]=m[c],k=!0);return k&&a++,a});i=()=>A(o)}t.b.length&&Er(()=>{bi(e,i),Zn(t.b)}),vi(()=>{const a=et(()=>t.m.map(Ga));return()=>{for(const r of a)typeof r=="function"&&r()}}),t.a.length&&vi(()=>{bi(e,i),Zn(t.a)})}function bi(n,e){if(n.l.s)for(const t of n.l.s)A(t);e()}function Na(n,e,t){if(n==null)return e(void 0),ze;const i=et(()=>n.subscribe(e,t));return i.unsubscribe?()=>i.unsubscribe():i}const Kt=[];function ds(n,e=ze){let t=null;const i=new Set;function a(k){if(Xi(n,k)&&(n=k,t)){const m=!Kt.length;for(const c of i)c[1](),Kt.push(c,n);if(m){for(let c=0;c<Kt.length;c+=2)Kt[c][0](Kt[c+1]);Kt.length=0}}}function r(k){a(k(n))}function o(k,m=ze){const c=[k,m];return i.add(c),i.size===1&&(t=e(a,r)||ze),k(n),()=>{i.delete(c),i.size===0&&t&&(t(),t=null)}}return{set:a,update:r,subscribe:o}}function ps(n){let e;return Na(n,t=>e=t)(),e}let dn=!1,Vn=Symbol();function cs(n,e,t){const i=t[e]??(t[e]={store:null,source:Rt(void 0),unsubscribe:ze});if(i.store!==n&&!(Vn in t))if(i.unsubscribe(),i.store=n??null,n==null)i.source.v=void 0,i.unsubscribe=ze;else{var a=!0;i.unsubscribe=Na(n,r=>{a?i.source.v=r:te(i.source,r)}),a=!1}return n&&Vn in t?ps(n):A(i.source)}function ks(){const n={};function e(){oi(()=>{for(var t in n)n[t].unsubscribe();Gi(n,Vn,{enumerable:!1,value:!0})})}return[n,e]}function ms(n){var e=dn;try{return dn=!1,[n(),dn]}finally{dn=e}}function me(n,e,t,i){var $;var a=(t&Ar)!==0,r=!tn||(t&dr)!==0,o=(t&cr)!==0,k=(t&kr)!==0,m=!1,c;o?[c,m]=ms(()=>n[e]):c=n[e];var u=lt in n||Ya in n,C=o&&((($=qt(n,e))==null?void 0:$.set)??(u&&e in n&&(E=>n[e]=E)))||void 0,s=i,p=!0,f=!1,y=()=>(f=!0,p&&(p=!1,k?s=et(i):s=i),s);c===void 0&&i!==void 0&&(C&&r&&er(),c=y(),C&&C(c));var l;if(r)l=()=>{var E=n[e];return E===void 0?y():(p=!0,f=!1,E)};else{var w=(a?Bt:ye)(()=>n[e]);w.f|=Vi,l=()=>{var E=A(w);return E!==void 0&&(s=void 0),E===void 0?s:E}}if(!(t&pr))return l;if(C){var D=n.$$legacy;return function(E,U){return arguments.length>0?((!r||!U||D||m)&&C(U?l():E),E):l()}}var T=!1,S=!1,W=Rt(c),_=Bt(()=>{var E=l(),U=A(W);return T?(T=!1,S=!0,U):(S=!1,W.v=E)});return a||(_.equals=ai),function(E,U){if(mt!==null&&(T=S,l(),A(W)),arguments.length>0){const re=U?A(_):r&&o?kt(E):E;return _.equals(re)||(T=!0,te(W,re),f&&s!==void 0&&(s=re),et(()=>A(_))),E}return A(_)}}const us="5";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(us);sr();class hs{constructor(e,t,i){d(this,"_dbname");d(this,"_dbversion");d(this,"dbPromise");d(this,"getTran",async(e,t)=>(await this.dbPromise).transaction(e,t));d(this,"reset",async()=>(await indexedDB.databases().then(e=>{console.log(e)}),await new Promise((e,t)=>{const i=indexedDB.deleteDatabase(this._dbname);i.onsuccess=()=>{console.log("onsuccess"),e()},i.onerror=a=>{console.log("onerror"),t(a)}})));d(this,"getAll",async e=>{const t=await this.dbPromise;return new Promise((i,a)=>{const k=t.transaction([e],"readonly").objectStore(e).getAll();k.onsuccess=()=>{i(k.result)},k.onerror=m=>{a(m)}})});d(this,"get",async(e,t)=>{const i=await this.dbPromise;return new Promise((a,r)=>{const m=i.transaction([e],"readonly").objectStore(e).get(t);m.onsuccess=()=>{a(m.result)},m.onerror=c=>{r(c)}})});d(this,"getMany",async(e,t)=>{const r=(await this.dbPromise).transaction([e],"readonly").objectStore(e),o=t.map(k=>new Promise((m,c)=>{const u=r.get(k);u.onsuccess=()=>{m(u.result)},u.onerror=C=>{c(C)}}));return await Promise.all(o)});d(this,"putRecords",async(e,t)=>{const a=(await this.dbPromise).transaction([e],"readwrite"),r=a.objectStore(e),o=t.map(k=>({record:k,request:r.put(k)}));return new Promise((k,m)=>{a.oncomplete=()=>k(o.map(c=>Object.assign({id:c.request.result},c.record))),a.onerror=c=>m(c)})});d(this,"deleteRecords",async(e,t)=>{const a=(await this.dbPromise).transaction([e],"readwrite"),r=a.objectStore(e),o=t.map(k=>({key:k,request:r.delete(k)}));return new Promise((k,m)=>{a.oncomplete=()=>{console.log(o.map(c=>c.request.result)),k()},a.onerror=c=>m(c)})});this._dbname=e,this._dbversion=t,this.dbPromise=new Promise((a,r)=>{const o=indexedDB.open(e,t);o.onsuccess=k=>{if(console.log(k),!k.target){console.log("event.target is undefined"),r("event.target is undefined");return}const m=k.target.result;if(!m){console.log("event.target.result is undefined"),r("event.target.result is undefined");return}m.onversionchange=c=>{console.log(c),m.close()},a(m)},o.onupgradeneeded=k=>{console.log("onupgradeneeded");const m=k.target.result;i.filter(c=>!m.objectStoreNames.contains(c)).map(c=>m.createObjectStore(c,{keyPath:"id",autoIncrement:!0}))},o.onerror=k=>{console.log(k),r(k)},o.onblocked=k=>{console.log(k),r(k)}}),console.log(this.dbPromise)}get dbversion(){return this._dbversion}}class Re{constructor(){d(this,"handlers",[])}append(e){this.handlers.push(e)}remove(e){this.handlers=this.handlers.filter(t=>t!==e)}trigger(e){this.handlers.slice(0).forEach(t=>t(e))}clear(){this.handlers.splice(0)}expose(){return this}}class _i{constructor(){d(this,"handler")}set(e){this.handler=e}async call(e){if(!this.handler)throw Error("illegal state error");return await this.handler(e)}expose(){return this}}class mi{constructor(e,t,i,a){d(this,"_name");d(this,"_createVersion");d(this,"mountResolver",()=>{});d(this,"_indexedDb");d(this,"onInsertEvent",new Re);d(this,"onBeforeInsertEvent",new _i);d(this,"onUpdateEvent",new Re);d(this,"onBeforeUpdateEvent",new _i);d(this,"onDeleteEvent",new Re);d(this,"prepareInitialRecords",()=>{const e=new Date;return this._prepareInitialRecords().map(t=>Object.assign(t,{createdAt:e,updatedAt:e,dbVersion:this._createVersion}))});d(this,"resolveMount",()=>this.mountResolver());d(this,"patchForInsert",(e,t)=>{e.newRecords.forEach(i=>{console.log(i),t[i.id]=i})});d(this,"patchForUpdate",(e,t)=>{e.recordPairs.forEach(i=>{console.log(t[i.newRecord.id],i.newRecord),t[i.newRecord.id]={...i.newRecord}})});d(this,"patchForDelete",(e,t)=>{e.oldRecords.forEach(i=>{console.log(i),delete t[i.id]})});this._indexedDb=e,this._name=t,this._createVersion=e.dbversion,this.getAll().then(r=>r.reduce((o,k)=>(o[k.id]=k,o),{})).then(r=>{console.log(this.name,r),this.onBeforeInsertEvent.set(i??(()=>Promise.resolve())),this.onBeforeUpdateEvent.set(a??(()=>Promise.resolve()))})}get name(){return this._name}get createVersion(){return this._createVersion}get oninsert(){return this.onInsertEvent.expose()}get onbeforeinsert(){return this.onBeforeInsertEvent.expose()}get onupdate(){return this.onUpdateEvent.expose()}get onbeforeupdate(){return this.onBeforeUpdateEvent.expose()}get ondelete(){return this.onDeleteEvent.expose()}getAll(){return this._indexedDb.getAll(this.name)}get(e){return this._indexedDb.get(this.name,e)}async insertMany(e){const t=new Date,i=e.map(r=>{const o={createdAt:t,updatedAt:t,dbVersion:this._createVersion};return Object.assign(r,o)});await this.onBeforeInsertEvent.call({sender:this,newRecords:i,timestamp:t});const a=await this._indexedDb.putRecords(this.name,i);return this.onInsertEvent.trigger({sender:this,newRecords:a,timestamp:t}),a}async insert(e){return(await this.insertMany([e]))[0]}async updateMany(e,t){const i=new Date,a=[];return(await this._indexedDb.getMany(this.name,e)).forEach(o=>{const k={...o},m={...k};a.push({newRecord:Object.assign(t(m),{updatedAt:i,dbVersion:this._createVersion}),oldRecord:k})}),await this.onBeforeUpdateEvent.call({sender:this,recordPairs:a,timestamp:i}),await this._indexedDb.putRecords(this.name,a.map(o=>o.newRecord)),this.onUpdateEvent.trigger({sender:this,recordPairs:a,timestamp:i}),a.map(o=>o.newRecord)}async update(e,t){return(await this.updateMany([e],t))[0]}async delete(e){const t=new Date,i=await this._indexedDb.getMany(this.name,e);await this._indexedDb.deleteRecords(this.name,e),this.onDeleteEvent.trigger({sender:this,oldRecords:i,timestamp:t})}}const fs={"１３人目の埋葬者":{name:"１３人目の埋葬者",nameKana:"",description:"誰もいないはずの１３番目の墓から突然現れたゾンビ。",pendulumDescription:"誰もいないはずの１３番目の墓から突然現れたゾンビ。",kind:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:900,attribute:"Dark",type:"Zombie",wikiName:"《１３人目の埋葬者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%B1%A3%B3%BF%CD%CC%DC%A4%CE%CB%E4%C1%F2%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/アンデット族/攻1200/守 900
誰もいないはずの１３番目の墓から突然現れたゾンビ。`},"２人３脚ゾンビ":{name:"２人３脚ゾンビ",nameKana:"",description:"ほそっちょとでぶっちょの、仲良しガイコツ二人組。歩きにくそう。",pendulumDescription:"ほそっちょとでぶっちょの、仲良しガイコツ二人組。歩きにくそう。",kind:"Monster",monsterCategories:["Normal"],level:3,attack:1100,defense:800,attribute:"Dark",type:"Zombie",wikiName:"《２人３脚ゾンビ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%B2%BF%CD%A3%B3%B5%D3%A5%BE%A5%F3%A5%D3%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/アンデット族/攻1100/守 800
ほそっちょとでぶっちょの、仲良しガイコツ二人組。歩きにくそう。`},"３万年の白亀":{name:"３万年の白亀",nameKana:"",description:`３万年も生きつづけている巨大カメ。
守備力が高い。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1250,defense:2100,attribute:"Water",type:"Aqua",wikiName:"《３万年の白亀》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%B3%CB%FC%C7%AF%A4%CE%C7%F2%B5%B5%A1%D5",wikiTextAll:`通常モンスター
星５/水属性/水族/攻1250/守2100
３万年も生きつづけている巨大カメ。
守備力が高い。`,kind:"Monster"},"Ａ・Ｏ・Ｊ クラウソラス":{name:"Ａ・Ｏ・Ｊ クラウソラス",nameKana:"",description:`霞の谷に生息するモンスター、クラウソラスをモチーフに開発された対外敵用戦闘兵器。
上空からの奇襲で敵を翻弄する。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2300,defense:1200,attribute:"Dark",type:"Machine",wikiName:"《Ａ・Ｏ・Ｊ クラウソラス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%C1%A1%A6%A3%CF%A1%A6%A3%CA%20%A5%AF%A5%E9%A5%A6%A5%BD%A5%E9%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星６/闇属性/機械族/攻2300/守1200
霞の谷に生息するモンスター、クラウソラスをモチーフに開発された対外敵用戦闘兵器。
上空からの奇襲で敵を翻弄する。`,kind:"Monster"},"Ａ・マインド":{name:"Ａ・マインド",nameKana:"",description:`Ａ・Ｏ・Ｊの思考回路を強化するために開発された高性能ユニット。
ワーム星雲より飛来した隕石から採取された物質が埋め込まれており、
高いチューニング能力を誇る。
その未知なるパワーの謎は未だ解明されていない。`,cardType:"Monster",monsterCategories:["Normal","Tuner"],level:5,attack:1800,defense:1400,attribute:"Dark",type:"Machine",wikiName:"《Ａ・マインド》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%C1%A1%A6%A5%DE%A5%A4%A5%F3%A5%C9%A1%D5",wikiTextAll:`チューナー（通常モンスター）
星５/闇属性/機械族/攻1800/守1400
Ａ・Ｏ・Ｊの思考回路を強化するために開発された高性能ユニット。
ワーム星雲より飛来した隕石から採取された物質が埋め込まれており、
高いチューニング能力を誇る。
その未知なるパワーの謎は未だ解明されていない。`,kind:"Monster"},"Ｂ・プラント":{name:"Ｂ・プラント",nameKana:"",description:"地下研究所での実験で大失敗して生まれたばけもの。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:600,defense:1300,attribute:"Dark",type:"Fiend",wikiName:"《Ｂ・プラント》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%C2%A1%A6%A5%D7%A5%E9%A5%F3%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/悪魔族/攻 600/守1300
地下研究所での実験で大失敗して生まれたばけもの。`,kind:"Monster"},"Ｄ・ナポレオン":{name:"Ｄ・ナポレオン",nameKana:"",description:"心の悪しき者がつくった目玉の悪魔。ダークボムで爆破攻撃。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:800,defense:400,attribute:"Dark",type:"Fiend",wikiName:"《Ｄ・ナポレオン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%C4%A1%A6%A5%CA%A5%DD%A5%EC%A5%AA%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/悪魔族/攻 800/守 400
心の悪しき者がつくった目玉の悪魔。ダークボムで爆破攻撃。`,kind:"Monster"},"Ｅ・ＨＥＲＯ クレイマン":{name:"Ｅ・ＨＥＲＯ クレイマン",nameKana:"",description:`粘土でできた頑丈な体を持つＥ・ＨＥＲＯ。
体をはって、仲間のＥ・ＨＥＲＯを守り抜く。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:800,defense:2e3,attribute:"Earth",type:"Warrior",wikiName:"《Ｅ・ＨＥＲＯ クレイマン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%C5%A1%A6%A3%C8%A3%C5%A3%D2%A3%CF%20%A5%AF%A5%EC%A5%A4%A5%DE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/戦士族/攻 800/守2000
粘土でできた頑丈な体を持つＥ・ＨＥＲＯ。
体をはって、仲間のＥ・ＨＥＲＯを守り抜く。`,kind:"Monster",cardId:6312,nameTags:["Ｅ・ＨＥＲＯ","ＨＥＲＯ"]},"Ｅ・ＨＥＲＯ スパークマン":{name:"Ｅ・ＨＥＲＯ スパークマン",nameKana:"",description:`様々な武器を使いこなす、光の戦士のＥ・ＨＥＲＯ。
聖なる輝きスパークフラッシュが悪の退路を断つ。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1400,attribute:"Light",type:"Warrior",wikiName:"《Ｅ・ＨＥＲＯ スパークマン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%C5%A1%A6%A3%C8%A3%C5%A3%D2%A3%CF%20%A5%B9%A5%D1%A1%BC%A5%AF%A5%DE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/戦士族/攻1600/守1400
様々な武器を使いこなす、光の戦士のＥ・ＨＥＲＯ。
聖なる輝きスパークフラッシュが悪の退路を断つ。`,kind:"Monster",nameTags:["Ｅ・ＨＥＲＯ","ＨＥＲＯ"]},"Ｅ・ＨＥＲＯ ネオス":{name:"Ｅ・ＨＥＲＯ ネオス",nameKana:"",description:`ネオスペースからやってきた新たなるＥ・ＨＥＲＯ。
ネオスペーシアンとコンタクト融合する事で、未知なる力を発揮する！`,cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2500,defense:2e3,attribute:"Light",type:"Warrior",wikiName:"《Ｅ・ＨＥＲＯ ネオス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%C5%A1%A6%A3%C8%A3%C5%A3%D2%A3%CF%20%A5%CD%A5%AA%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星７/光属性/戦士族/攻2500/守2000
ネオスペースからやってきた新たなるＥ・ＨＥＲＯ。
ネオスペーシアンとコンタクト融合する事で、未知なる力を発揮する！`,kind:"Monster",nameTags:["Ｅ・ＨＥＲＯ","ＨＥＲＯ"]},"Ｅ・ＨＥＲＯ バーストレディ":{name:"Ｅ・ＨＥＲＯ バーストレディ",nameKana:"",description:`炎を操るＥ・ＨＥＲＯの紅一点。
紅蓮の炎、バーストファイヤーが悪を焼き尽くす。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:800,attribute:"Fire",type:"Warrior",wikiName:"《Ｅ・ＨＥＲＯ バーストレディ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%C5%A1%A6%A3%C8%A3%C5%A3%D2%A3%CF%20%A5%D0%A1%BC%A5%B9%A5%C8%A5%EC%A5%C7%A5%A3%A1%D5",wikiTextAll:`通常モンスター
星３/炎属性/戦士族/攻1200/守 800
炎を操るＥ・ＨＥＲＯの紅一点。
紅蓮の炎、バーストファイヤーが悪を焼き尽くす。`,kind:"Monster",nameTags:["Ｅ・ＨＥＲＯ","ＨＥＲＯ"]},"Ｅ・ＨＥＲＯ フェザーマン":{name:"Ｅ・ＨＥＲＯ フェザーマン",nameKana:"",description:`風を操り空を舞う翼を持ったＥ・ＨＥＲＯ。
天空からの一撃、フェザーブレイクで悪を裁く。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:1e3,attribute:"Wind",type:"Warrior",wikiName:"《Ｅ・ＨＥＲＯ フェザーマン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%C5%A1%A6%A3%C8%A3%C5%A3%D2%A3%CF%20%A5%D5%A5%A7%A5%B6%A1%BC%A5%DE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星３/風属性/戦士族/攻1000/守1000
風を操り空を舞う翼を持ったＥ・ＨＥＲＯ。
天空からの一撃、フェザーブレイクで悪を裁く。`,kind:"Monster",nameTags:["Ｅ・ＨＥＲＯ","ＨＥＲＯ"]},"Ｇ戦隊 シャインブラック":{name:"Ｇ戦隊 シャインブラック",nameKana:"",description:`黒光りするスーツを身にまとい、戦場を駆け回る"黒の閃光"・・・。
影あるところにＧ戦隊あり！
隠された飛行能力を駆使して巨大なモンスターにも立ち向かうぞ！！`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:2e3,attribute:"Earth",type:"Insect",wikiName:"《Ｇ戦隊 シャインブラック》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%C7%C0%EF%C2%E2%20%A5%B7%A5%E3%A5%A4%A5%F3%A5%D6%A5%E9%A5%C3%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/昆虫族/攻2000/守   0
黒光りするスーツを身にまとい、戦場を駆け回る"黒の閃光"・・・。
影あるところにＧ戦隊あり！
隠された飛行能力を駆使して巨大なモンスターにも立ち向かうぞ！！`,kind:"Monster",defense:0},"ＰＳＹフレーム・ドライバー":{name:"ＰＳＹフレーム・ドライバー",nameKana:"",description:`電撃を操るサイキック戦士。
自律型増幅器「ＰＳＹフレーム」を駆り、セキュリティ・フォースに強襲を仕掛ける。
その姿は、正に電光石火の如し。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2500,attribute:"Light",type:"Psychic",wikiName:"《ＰＳＹフレーム・ドライバー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%D0%A3%D3%A3%D9%A5%D5%A5%EC%A1%BC%A5%E0%A1%A6%A5%C9%A5%E9%A5%A4%A5%D0%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星６/光属性/サイキック族/攻2500/守   0
電撃を操るサイキック戦士。
自律型増幅器「ＰＳＹフレーム」を駆り、セキュリティ・フォースに強襲を仕掛ける。
その姿は、正に電光石火の如し。`,kind:"Monster",defense:0},"ＴＭ－１ランチャースパイダー":{name:"ＴＭ－１ランチャースパイダー",nameKana:"",description:"ロケットランチャーを乱射して、相手を爆殺する機械グモ。",cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2200,defense:2500,attribute:"Fire",type:"Machine",wikiName:"《ＴＭ－１ランチャースパイダー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%D4%A3%CD%A1%DD%A3%B1%A5%E9%A5%F3%A5%C1%A5%E3%A1%BC%A5%B9%A5%D1%A5%A4%A5%C0%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星７/炎属性/機械族/攻2200/守2500
ロケットランチャーを乱射して、相手を爆殺する機械グモ。`,kind:"Monster"},"Ｖ－タイガー・ジェット":{name:"Ｖ－タイガー・ジェット",nameKana:"",description:`空中戦を得意とする、合体能力を持つモンスター。
合体と分離を駆使して立体的な攻撃を繰り出す。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1800,attribute:"Light",type:"Machine",wikiName:"《Ｖ－タイガー・ジェット》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%D6%A1%DD%A5%BF%A5%A4%A5%AC%A1%BC%A1%A6%A5%B8%A5%A7%A5%C3%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/機械族/攻1600/守1800
空中戦を得意とする、合体能力を持つモンスター。
合体と分離を駆使して立体的な攻撃を繰り出す。`,kind:"Monster"},"Ｘ－セイバー アナペレラ":{name:"Ｘ－セイバー アナペレラ",nameKana:"",description:`華麗な攻撃と冷静な判断で戦場を舞う、Ｘ－セイバーの女戦士。
時に冷酷なその攻撃は敵に恐れられている。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,defense:1100,attribute:"Earth",type:"Warrior",wikiName:"《Ｘ－セイバー アナペレラ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%D8%A1%DD%A5%BB%A5%A4%A5%D0%A1%BC%20%A5%A2%A5%CA%A5%DA%A5%EC%A5%E9%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/戦士族/攻1800/守1100
華麗な攻撃と冷静な判断で戦場を舞う、Ｘ－セイバーの女戦士。
時に冷酷なその攻撃は敵に恐れられている。`,kind:"Monster",nameTags:["Ｘ－セイバー"]},"Ｘ－ヘッド・キャノン":{name:"Ｘ－ヘッド・キャノン",nameKana:"",description:`強力なキャノン砲を装備した、合体能力を持つモンスター。
合体と分離を駆使して様々な攻撃を繰り出す。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,defense:1500,attribute:"Light",type:"Machine",wikiName:"《Ｘ－ヘッド・キャノン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%D8%A1%DD%A5%D8%A5%C3%A5%C9%A1%A6%A5%AD%A5%E3%A5%CE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/機械族/攻1800/守1500
強力なキャノン砲を装備した、合体能力を持つモンスター。
合体と分離を駆使して様々な攻撃を繰り出す。`,kind:"Monster"},"おジャマ・イエロー":{name:"おジャマ・イエロー",nameKana:"",description:`あらゆる手段を使ってジャマをすると言われているおジャマトリオの一員。
三人揃うと何かが起こると言われている。`,cardType:"Monster",monsterCategories:["Normal"],level:2,defense:1e3,attribute:"Light",type:"Beast",wikiName:"《おジャマ・イエロー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%AA%A5%B8%A5%E3%A5%DE%A1%A6%A5%A4%A5%A8%A5%ED%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星２/光属性/獣族/攻   0/守1000
あらゆる手段を使ってジャマをすると言われているおジャマトリオの一員。
三人揃うと何かが起こると言われている。`,kind:"Monster",attack:0},"おジャマ・グリーン":{name:"おジャマ・グリーン",nameKana:"",description:`あらゆる手段を使ってジャマをすると言われているおジャマトリオの一員。
三人揃うと何かが起こると言われている。`,cardType:"Monster",monsterCategories:["Normal"],level:2,defense:1e3,attribute:"Light",type:"Beast",wikiName:"《おジャマ・グリーン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%AA%A5%B8%A5%E3%A5%DE%A1%A6%A5%B0%A5%EA%A1%BC%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星２/光属性/獣族/攻   0/守1000
あらゆる手段を使ってジャマをすると言われているおジャマトリオの一員。
三人揃うと何かが起こると言われている。`,kind:"Monster",attack:0},"おジャマ・ブラック":{name:"おジャマ・ブラック",nameKana:"",description:`あらゆる手段を使ってジャマをすると言われているおジャマトリオの一員。
三人揃うと何かが起こると言われている。`,cardType:"Monster",monsterCategories:["Normal"],level:2,defense:1e3,attribute:"Light",type:"Beast",wikiName:"《おジャマ・ブラック》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%AA%A5%B8%A5%E3%A5%DE%A1%A6%A5%D6%A5%E9%A5%C3%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星２/光属性/獣族/攻   0/守1000
あらゆる手段を使ってジャマをすると言われているおジャマトリオの一員。
三人揃うと何かが起こると言われている。`,kind:"Monster",attack:0},きのこマン:{name:"きのこマン",nameKana:"",description:"ジメジメした所で力を発揮！かさから菌糸を振りまき攻撃！",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:800,defense:600,attribute:"Earth",type:"Plant",wikiName:"《きのこマン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%AD%A4%CE%A4%B3%A5%DE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/植物族/攻 800/守 600
ジメジメした所で力を発揮！かさから菌糸を振りまき攻撃！`,kind:"Monster"},くいぐるみ:{name:"くいぐるみ",nameKana:"",description:"かわいらしいぬいぐるみと思わせ、チャックの口でガブリとかみつく。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:900,attribute:"Earth",type:"Warrior",wikiName:"《くいぐるみ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%AF%A4%A4%A4%B0%A4%EB%A4%DF%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/戦士族/攻1200/守 900
かわいらしいぬいぐるみと思わせ、チャックの口でガブリとかみつく。`,kind:"Monster"},くちばしヘビ:{name:"くちばしヘビ",nameKana:"",description:"相手を長い体で締め上げ、大きなくちばしでつついて攻撃。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:900,attribute:"Earth",type:"Reptile",wikiName:"《くちばしヘビ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%AF%A4%C1%A4%D0%A4%B7%A5%D8%A5%D3%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/爬虫類族/攻 800/守 900
相手を長い体で締め上げ、大きなくちばしでつついて攻撃。`,kind:"Monster"},さまよえる亡者:{name:"さまよえる亡者",nameKana:"",description:"成仏できず、行くあてもなくフラフラとしているモンスター。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:800,defense:600,attribute:"Dark",type:"Zombie",wikiName:"《さまよえる亡者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%B5%A4%DE%A4%E8%A4%A8%A4%EB%CB%B4%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/アンデット族/攻 800/守 600
成仏できず、行くあてもなくフラフラとしているモンスター。`,kind:"Monster"},しゃりの軍貫:{name:"しゃりの軍貫",nameKana:"",description:`以前から気になっていた軍貫一筋の軍港に。
ここのしゃりは年間二千隻しか製造されておらず、独自開発した粘り気の少ない古米によって
他港には無い重厚感が愉しめる事もあり、数多の通を唸らせてきた逸品。
港内の雰囲気も格式高く胸が高鳴ります。
念願の軍貫は、お酢比率、握り加減、造形が正に職人技で流石の一言。
店主曰く「円みと芳醇な香りを備えたＥＤＯ－ＦＲＯＮＴ製の赤酢も近日入港予定」との事で調和が大変楽しみです。
周辺海域が若干騒がしかったのが残念でした・・・。
今後の期待も込めて今回は星４とさせていただきます！`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:2e3,attribute:"Fire",type:"Aqua",wikiName:"《しゃりの軍貫》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%B7%A4%E3%A4%EA%A4%CE%B7%B3%B4%D3%A1%D5",wikiTextAll:`通常モンスター
星４/炎属性/水族/攻2000/守   0
以前から気になっていた軍貫一筋の軍港に。
ここのしゃりは年間二千隻しか製造されておらず、独自開発した粘り気の少ない古米によって
他港には無い重厚感が愉しめる事もあり、数多の通を唸らせてきた逸品。
港内の雰囲気も格式高く胸が高鳴ります。
念願の軍貫は、お酢比率、握り加減、造形が正に職人技で流石の一言。
店主曰く「円みと芳醇な香りを備えたＥＤＯ－ＦＲＯＮＴ製の赤酢も近日入港予定」との事で調和が大変楽しみです。
周辺海域が若干騒がしかったのが残念でした・・・。
今後の期待も込めて今回は星４とさせていただきます！`,kind:"Monster",defense:0},とろける赤き影:{name:"とろける赤き影",nameKana:"",description:"体を溶かして足もとの影にもぐり、敵の真下から攻撃する。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:500,defense:700,attribute:"Water",type:"Aqua",wikiName:"《とろける赤き影》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%C8%A4%ED%A4%B1%A4%EB%C0%D6%A4%AD%B1%C6%A1%D5",wikiTextAll:`通常モンスター
星２/水属性/水族/攻 500/守 700
体を溶かして足もとの影にもぐり、敵の真下から攻撃する。`,kind:"Monster"},なぞの手:{name:"なぞの手",nameKana:"",description:"空間をゆがませ、次元のはざまから腕をのばし攻撃をしかける。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:500,defense:500,attribute:"Dark",type:"Fiend",wikiName:"《なぞの手》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%CA%A4%BE%A4%CE%BC%EA%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/悪魔族/攻 500/守 500
空間をゆがませ、次元のはざまから腕をのばし攻撃をしかける。`,kind:"Monster"},はにわ:{name:"はにわ",nameKana:"",description:"古代王の墓の中にある宝物を守る土人形。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:500,defense:500,attribute:"Earth",type:"Rock",wikiName:"《はにわ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%CF%A4%CB%A4%EF%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/岩石族/攻 500/守 500
古代王の墓の中にある宝物を守る土人形。`,kind:"Monster"},ひょうすべ:{name:"ひょうすべ",nameKana:"",description:"カッパの親分。攻撃力は意外と高い。守備力は低め。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:900,attribute:"Water",type:"Aqua",wikiName:"《ひょうすべ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%D2%A4%E7%A4%A6%A4%B9%A4%D9%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1500/守 900
カッパの親分。攻撃力は意外と高い。守備力は低め。`,kind:"Monster"},もけもけ:{name:"もけもけ",nameKana:"",description:`何を考えているのかさっぱりわからない天使のはみだし者。
たまに怒ると怖い。`,cardType:"Monster",monsterCategories:["Normal"],level:1,attack:300,defense:100,attribute:"Light",type:"Fairy",wikiName:"《もけもけ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%E2%A4%B1%A4%E2%A4%B1%A1%D5",wikiTextAll:`通常モンスター
星１/光属性/天使族/攻 300/守 100
何を考えているのかさっぱりわからない天使のはみだし者。
たまに怒ると怖い。`,kind:"Monster"},"アーマード・スターフィッシュ":{name:"アーマード・スターフィッシュ",nameKana:"",description:"表面がかたく守備力が比較的高い、青っぽいヒトデ。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:850,defense:1400,attribute:"Water",type:"Aqua",wikiName:"《アーマード・スターフィッシュ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A2%A1%BC%A5%DE%A1%BC%A5%C9%A1%A6%A5%B9%A5%BF%A1%BC%A5%D5%A5%A3%A5%C3%A5%B7%A5%E5%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻 850/守1400
表面がかたく守備力が比較的高い、青っぽいヒトデ。`,kind:"Monster"},アーメイル:{name:"アーメイル",nameKana:"",description:`剣状の尾を持つ変わった戦士。
両手と尾で３連攻撃をする。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:700,defense:1300,attribute:"Earth",type:"Warrior",wikiName:"《アーメイル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A2%A1%BC%A5%E1%A5%A4%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/戦士族/攻 700/守1300
剣状の尾を持つ変わった戦士。
両手と尾で３連攻撃をする。`,kind:"Monster"},"アイアン・ハート":{name:"アイアン・ハート",nameKana:"",description:"古代文明の遺跡で見つかった、破壊だけを目的とした機械。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1700,defense:1400,attribute:"Dark",type:"Machine",wikiName:"《アイアン・ハート》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A2%A5%A4%A5%A2%A5%F3%A1%A6%A5%CF%A1%BC%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/機械族/攻1700/守1400
古代文明の遺跡で見つかった、破壊だけを目的とした機械。`,kind:"Monster"},アイツ:{name:"アイツ",nameKana:"",description:"非常に頼りない姿をしているが、実はとてつもない潜在能力を隠し持っているらしい。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:100,defense:100,attribute:"Fire",type:"Fairy",wikiName:"《アイツ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A2%A5%A4%A5%C4%A1%D5",wikiTextAll:`通常モンスター
星５/炎属性/天使族/攻 100/守 100
非常に頼りない姿をしているが、実はとてつもない潜在能力を隠し持っているらしい。`,kind:"Monster"},"アクア・スネーク":{name:"アクア・スネーク",nameKana:"",description:"尾の先についている玉で催眠術をかけ、相手をおぼれさせる。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1050,defense:900,attribute:"Water",type:"Aqua",wikiName:"《アクア・スネーク》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A2%A5%AF%A5%A2%A1%A6%A5%B9%A5%CD%A1%BC%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻1050/守 900
尾の先についている玉で催眠術をかけ、相手をおぼれさせる。`,kind:"Monster"},"アクア・マドール":{name:"アクア・マドール",nameKana:"",description:`水をあやつる魔法使い。
分厚い水の壁をつくり敵を押しつぶす。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:2e3,attribute:"Water",type:"Spellcaster",wikiName:"《アクア・マドール》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A2%A5%AF%A5%A2%A1%A6%A5%DE%A5%C9%A1%BC%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/魔法使い族/攻1200/守2000
水をあやつる魔法使い。
分厚い水の壁をつくり敵を押しつぶす。`,kind:"Monster"},アクロバットモンキー:{name:"アクロバットモンキー",nameKana:"",description:`超最先端技術により開発されたモンキータイプの自律型ロボット。
非常にアクロバティックな動きをする。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:1800,attribute:"Earth",type:"Machine",wikiName:"《アクロバットモンキー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A2%A5%AF%A5%ED%A5%D0%A5%C3%A5%C8%A5%E2%A5%F3%A5%AD%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/機械族/攻1000/守1800
超最先端技術により開発されたモンキータイプの自律型ロボット。
非常にアクロバティックな動きをする。`,kind:"Monster"},アサシン:{name:"アサシン",nameKana:"",description:"闇の中を音もたてず相手に忍び寄る、暗殺専門の戦士。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1700,defense:1200,attribute:"Earth",type:"Warrior",wikiName:"《アサシン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A2%A5%B5%A5%B7%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/戦士族/攻1700/守1200
闇の中を音もたてず相手に忍び寄る、暗殺専門の戦士。`,kind:"Monster"},アシッドクロウラー:{name:"アシッドクロウラー",nameKana:"",description:`巨大ないもむし。
強力な酸をはき、何でも溶かしてしまう。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:700,attribute:"Earth",type:"Insect",wikiName:"《アシッドクロウラー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A2%A5%B7%A5%C3%A5%C9%A5%AF%A5%ED%A5%A6%A5%E9%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/昆虫族/攻 900/守 700
巨大ないもむし。
強力な酸をはき、何でも溶かしてしまう。`,kind:"Monster"},"アックス・レイダー":{name:"アックス・レイダー",nameKana:"",description:`オノを持つ戦士。
片手でオノを振り回す攻撃はかなり強い。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1700,defense:1150,attribute:"Earth",type:"Warrior",wikiName:"《アックス・レイダー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A2%A5%C3%A5%AF%A5%B9%A1%A6%A5%EC%A5%A4%A5%C0%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/戦士族/攻1700/守1150
オノを持つ戦士。
片手でオノを振り回す攻撃はかなり強い。`,kind:"Monster"},"アナザー・バース・ドラゴン":{name:"アナザー・バース・ドラゴン",nameKana:"",description:`数多の次元を統べし竜。
時の覇者にのみ見えん。`,cardType:"Monster",monsterCategories:["Normal"],level:8,attack:2500,defense:2e3,attribute:"Light",type:"Dragon",wikiName:"《アナザー・バース・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A2%A5%CA%A5%B6%A1%BC%A1%A6%A5%D0%A1%BC%A5%B9%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星８/光属性/ドラゴン族/攻2500/守2000
数多の次元を統べし竜。
時の覇者にのみ見えん。`,kind:"Monster"},アブソリューター:{name:"アブソリューター",nameKana:"",description:"相手を鏡の中の世界に吸い込むことができる。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1400,attribute:"Wind",type:"WingedBeast",wikiName:"《アブソリューター》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A2%A5%D6%A5%BD%A5%EA%A5%E5%A1%BC%A5%BF%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/鳥獣族/攻1300/守1400
相手を鏡の中の世界に吸い込むことができる。`,kind:"Monster"},アルラウネ:{name:"アルラウネ",nameKana:"",description:`花の中の女性が毒花粉をまき散らす。
近づいてはいけない。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:1e3,attribute:"Earth",type:"Plant",wikiName:"《アルラウネ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A2%A5%EB%A5%E9%A5%A6%A5%CD%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/植物族/攻 800/守1000
花の中の女性が毒花粉をまき散らす。
近づいてはいけない。`,kind:"Monster"},アレキサンドライドラゴン:{name:"アレキサンドライドラゴン",nameKana:"",description:`アレキサンドライトのウロコを持った、非常に珍しいドラゴン。
その美しいウロコは古の王の名を冠し、神秘の象徴とされる。
――それを手にした者は大いなる幸運を既につかんでいる事に気づいていない。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:2e3,defense:100,attribute:"Light",type:"Dragon",wikiName:"《アレキサンドライドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A2%A5%EC%A5%AD%A5%B5%A5%F3%A5%C9%A5%E9%A5%A4%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/ドラゴン族/攻2000/守 100
アレキサンドライトのウロコを持った、非常に珍しいドラゴン。
その美しいウロコは古の王の名を冠し、神秘の象徴とされる。
――それを手にした者は大いなる幸運を既につかんでいる事に気づいていない。`,kind:"Monster"},アンサイクラー:{name:"アンサイクラー",nameKana:"",description:"トライクラー、ヴィークラーを兄に持つ三男坊のアンサイクラー。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:100,defense:100,attribute:"Earth",type:"Machine",wikiName:"《アンサイクラー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A2%A5%F3%A5%B5%A5%A4%A5%AF%A5%E9%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星１/地属性/機械族/攻 100/守 100
トライクラー、ヴィークラーを兄に持つ三男坊のアンサイクラー。`,kind:"Monster"},"アンモ・ナイト":{name:"アンモ・ナイト",nameKana:"",description:"大昔から海を外敵から守っている、アンモナイトの戦士。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1e3,defense:1200,attribute:"Water",type:"Aqua",wikiName:"《アンモ・ナイト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A2%A5%F3%A5%E2%A1%A6%A5%CA%A5%A4%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1000/守1200
大昔から海を外敵から守っている、アンモナイトの戦士。`,kind:"Monster"},イースター島のモアイ:{name:"イースター島のモアイ",nameKana:"",description:`イースター島に存在する石像。
口から丸いレーザーをはく。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1100,defense:1400,attribute:"Earth",type:"Rock",wikiName:"《イースター島のモアイ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A4%A1%BC%A5%B9%A5%BF%A1%BC%C5%E7%A4%CE%A5%E2%A5%A2%A5%A4%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/岩石族/攻1100/守1400
イースター島に存在する石像。
口から丸いレーザーをはく。`,kind:"Monster"},"イグナイト・イーグル":{name:"イグナイト・イーグル",nameKana:"",description:`とても直情的で行動派なイグナイトの戦士。
仲間たちからは「鉄砲玉のイーグル」と呼ばれ、少し距離を置かれがちである。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:3,attack:1600,defense:300,attribute:"Fire",type:"Warrior",pendulumScaleR:2,pendulumScaleL:2,wikiName:"《イグナイト・イーグル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A4%A5%B0%A5%CA%A5%A4%A5%C8%A1%A6%A5%A4%A1%BC%A5%B0%A5%EB%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星３/炎属性/戦士族/攻1600/守 300
【Ｐスケール：青２/赤２】
(1)：もう片方の自分のＰゾーンに「イグナイト」カードが存在する場合に発動できる。
自分のＰゾーンのカードを全て破壊し、
自分のデッキ・墓地から戦士族・炎属性モンスター１体を選んで手札に加える。
【モンスター情報】
とても直情的で行動派なイグナイトの戦士。
仲間たちからは「鉄砲玉のイーグル」と呼ばれ、少し距離を置かれがちである。`,kind:"Monster",pendulumDescription:`(1)：もう片方の自分のＰゾーンに「イグナイト」カードが存在する場合に発動できる。
自分のＰゾーンのカードを全て破壊し、
自分のデッキ・墓地から戦士族・炎属性モンスター１体を選んで手札に加える。`},"イグナイト・ウージー":{name:"イグナイト・ウージー",nameKana:"",description:`「デリンジャー」のお目付け役であり親衛隊長。
無鉄砲な彼女に翻弄されてばかりで、
唯一の理解者である「キャリバー」にいつもぼやいている。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:6,attack:1300,defense:2700,attribute:"Fire",type:"Warrior",pendulumScaleR:7,pendulumScaleL:7,wikiName:"《イグナイト・ウージー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A4%A5%B0%A5%CA%A5%A4%A5%C8%A1%A6%A5%A6%A1%BC%A5%B8%A1%BC%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星６/炎属性/戦士族/攻1300/守2700
【Ｐスケール：青７/赤７】
(1)：もう片方の自分のＰゾーンに「イグナイト」カードが存在する場合に発動できる。
自分のＰゾーンのカードを全て破壊し、
自分のデッキ・墓地から戦士族・炎属性モンスター１体を選んで手札に加える。
【モンスター情報】
「デリンジャー」のお目付け役であり親衛隊長。
無鉄砲な彼女に翻弄されてばかりで、
唯一の理解者である「キャリバー」にいつもぼやいている。`,kind:"Monster",pendulumDescription:`(1)：もう片方の自分のＰゾーンに「イグナイト」カードが存在する場合に発動できる。
自分のＰゾーンのカードを全て破壊し、
自分のデッキ・墓地から戦士族・炎属性モンスター１体を選んで手札に加える。`},"イグナイト・キャリバー":{name:"イグナイト・キャリバー",nameKana:"",description:`威勢の良すぎるイグナイトたちをまとめる特攻隊長。
血気盛んですぐ頭に点火してしまう部下たちにいつも悩まされている。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:6,attack:2100,defense:2200,attribute:"Fire",type:"Warrior",pendulumScaleR:2,pendulumScaleL:2,wikiName:"《イグナイト・キャリバー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A4%A5%B0%A5%CA%A5%A4%A5%C8%A1%A6%A5%AD%A5%E3%A5%EA%A5%D0%A1%BC%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星６/炎属性/戦士族/攻2100/守2200
【Ｐスケール：青２/赤２】
(1)：もう片方の自分のＰゾーンに「イグナイト」カードが存在する場合に発動できる。
自分のＰゾーンのカードを全て破壊し、
自分のデッキ・墓地から戦士族・炎属性モンスター１体を選んで手札に加える。
【モンスター情報】
威勢の良すぎるイグナイトたちをまとめる特攻隊長。
血気盛んですぐ頭に点火してしまう部下たちにいつも悩まされている。`,kind:"Monster",pendulumDescription:`(1)：もう片方の自分のＰゾーンに「イグナイト」カードが存在する場合に発動できる。
自分のＰゾーンのカードを全て破壊し、
自分のデッキ・墓地から戦士族・炎属性モンスター１体を選んで手札に加える。`},"イグナイト・デリンジャー":{name:"イグナイト・デリンジャー",nameKana:"",description:`仲間たちからちやほやされているイグナイトの紅一点。
自慢の武器は敵よりも味方を射止める事の方が多いが、
文句を言える者は誰もいない。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:5,attack:2400,defense:1200,attribute:"Fire",type:"Warrior",pendulumScaleR:2,pendulumScaleL:2,wikiName:"《イグナイト・デリンジャー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A4%A5%B0%A5%CA%A5%A4%A5%C8%A1%A6%A5%C7%A5%EA%A5%F3%A5%B8%A5%E3%A1%BC%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星５/炎属性/戦士族/攻2400/守1200
【Ｐスケール：青２/赤２】
(1)：もう片方の自分のＰゾーンに「イグナイト」カードが存在する場合に発動できる。
自分のＰゾーンのカードを全て破壊し、
自分のデッキ・墓地から戦士族・炎属性モンスター１体を選んで手札に加える。
【モンスター情報】
仲間たちからちやほやされているイグナイトの紅一点。
自慢の武器は敵よりも味方を射止める事の方が多いが、
文句を言える者は誰もいない。`,kind:"Monster",pendulumDescription:`(1)：もう片方の自分のＰゾーンに「イグナイト」カードが存在する場合に発動できる。
自分のＰゾーンのカードを全て破壊し、
自分のデッキ・墓地から戦士族・炎属性モンスター１体を選んで手札に加える。`},"イグナイト・ドラグノフ":{name:"イグナイト・ドラグノフ",nameKana:"",description:`一本気で曲がったことが嫌いなイグナイトのベテラン戦士。
その性格のせいか、近頃は自分の持つ武器に疑問を抱いているようだ。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:4,attack:1700,defense:1300,attribute:"Fire",type:"Warrior",pendulumScaleR:7,pendulumScaleL:7,wikiName:"《イグナイト・ドラグノフ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A4%A5%B0%A5%CA%A5%A4%A5%C8%A1%A6%A5%C9%A5%E9%A5%B0%A5%CE%A5%D5%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星４/炎属性/戦士族/攻1700/守1300
【Ｐスケール：青７/赤７】
(1)：もう片方の自分のＰゾーンに「イグナイト」カードが存在する場合に発動できる。
自分のＰゾーンのカードを全て破壊し、
自分のデッキ・墓地から戦士族・炎属性モンスター１体を選んで手札に加える。
【モンスター情報】
一本気で曲がったことが嫌いなイグナイトのベテラン戦士。
その性格のせいか、近頃は自分の持つ武器に疑問を抱いているようだ。`,kind:"Monster",pendulumDescription:`(1)：もう片方の自分のＰゾーンに「イグナイト」カードが存在する場合に発動できる。
自分のＰゾーンのカードを全て破壊し、
自分のデッキ・墓地から戦士族・炎属性モンスター１体を選んで手札に加える。`},"イグナイト・マグナム":{name:"イグナイト・マグナム",nameKana:"",description:`剣銃を操る炎の戦士。
冷たい鋼鉄の鎧に身を包んでいるが、
その奥には激しく燃え上がるような熱い心が秘められている。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:3,defense:2e3,attribute:"Fire",type:"Warrior",pendulumScaleR:7,pendulumScaleL:7,wikiName:"《イグナイト・マグナム》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A4%A5%B0%A5%CA%A5%A4%A5%C8%A1%A6%A5%DE%A5%B0%A5%CA%A5%E0%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星３/炎属性/戦士族/攻   0/守2000
【Ｐスケール：青７/赤７】
(1)：もう片方の自分のＰゾーンに「イグナイト」カードが存在する場合に発動できる。
自分のＰゾーンのカードを全て破壊し、
自分のデッキ・墓地から戦士族・炎属性モンスター１体を選んで手札に加える。
【モンスター情報】
剣銃を操る炎の戦士。
冷たい鋼鉄の鎧に身を包んでいるが、
その奥には激しく燃え上がるような熱い心が秘められている。`,kind:"Monster",pendulumDescription:`(1)：もう片方の自分のＰゾーンに「イグナイト」カードが存在する場合に発動できる。
自分のＰゾーンのカードを全て破壊し、
自分のデッキ・墓地から戦士族・炎属性モンスター１体を選んで手札に加える。`,attack:0},"イグナイト・マスケット":{name:"イグナイト・マスケット",nameKana:"",description:`冷静沈着で理知的と評判のイグナイトの参謀。
実は頭に血が上るのに時間がかかっているだけで、心の中ではいつもキレ気味らしい。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:4,attack:1400,defense:1900,attribute:"Fire",type:"Warrior",pendulumScaleR:2,pendulumScaleL:2,wikiName:"《イグナイト・マスケット》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A4%A5%B0%A5%CA%A5%A4%A5%C8%A1%A6%A5%DE%A5%B9%A5%B1%A5%C3%A5%C8%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星４/炎属性/戦士族/攻1400/守1900
【Ｐスケール：青２/赤２】
(1)：もう片方の自分のＰゾーンに「イグナイト」カードが存在する場合に発動できる。
自分のＰゾーンのカードを全て破壊し、
自分のデッキ・墓地から戦士族・炎属性モンスター１体を選んで手札に加える。
【モンスター情報】
冷静沈着で理知的と評判のイグナイトの参謀。
実は頭に血が上るのに時間がかかっているだけで、心の中ではいつもキレ気味らしい。`,kind:"Monster",pendulumDescription:`(1)：もう片方の自分のＰゾーンに「イグナイト」カードが存在する場合に発動できる。
自分のＰゾーンのカードを全て破壊し、
自分のデッキ・墓地から戦士族・炎属性モンスター１体を選んで手札に加える。`},"イグナイト・ライオット":{name:"イグナイト・ライオット",nameKana:"",description:`イグナイトの上級戦士。
ところ構わず広範囲をなぎ払う得意の二刀剣銃は、
敵だけでなく味方からも怖がられてしまう。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:5,attack:1500,defense:2500,attribute:"Fire",type:"Warrior",pendulumScaleR:7,pendulumScaleL:7,wikiName:"《イグナイト・ライオット》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A4%A5%B0%A5%CA%A5%A4%A5%C8%A1%A6%A5%E9%A5%A4%A5%AA%A5%C3%A5%C8%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星５/炎属性/戦士族/攻1500/守2500
【Ｐスケール：青７/赤７】
(1)：もう片方の自分のＰゾーンに「イグナイト」カードが存在する場合に発動できる。
自分のＰゾーンのカードを全て破壊し、
自分のデッキ・墓地から戦士族・炎属性モンスター１体を選んで手札に加える。
【モンスター情報】
イグナイトの上級戦士。
ところ構わず広範囲をなぎ払う得意の二刀剣銃は、
敵だけでなく味方からも怖がられてしまう。`,kind:"Monster",pendulumDescription:`(1)：もう片方の自分のＰゾーンに「イグナイト」カードが存在する場合に発動できる。
自分のＰゾーンのカードを全て破壊し、
自分のデッキ・墓地から戦士族・炎属性モンスター１体を選んで手札に加える。`},"イグニホース・ドラゴニス":{name:"イグニホース・ドラゴニス",nameKana:"",description:`煮えたぎる大海の上を、縦横無尽に駆け回る竜馬。
自らの火を絶やさぬ為、今日も水面を走り続ける。
故郷の土を踏める日を夢見て。`,cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2400,defense:1e3,attribute:"Fire",type:"SeaSerpent",wikiName:"《イグニホース・ドラゴニス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A4%A5%B0%A5%CB%A5%DB%A1%BC%A5%B9%A1%A6%A5%C9%A5%E9%A5%B4%A5%CB%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星７/炎属性/海竜族/攻2400/守1000
煮えたぎる大海の上を、縦横無尽に駆け回る竜馬。
自らの火を絶やさぬ為、今日も水面を走り続ける。
故郷の土を踏める日を夢見て。`,kind:"Monster"},"イビル・ラット":{name:"イビル・ラット",nameKana:"",description:"どんな物にでもかじりつく、行儀の悪い野ネズミ。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:750,defense:800,attribute:"Earth",type:"Beast",wikiName:"《イビル・ラット》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A4%A5%D3%A5%EB%A1%A6%A5%E9%A5%C3%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/獣族/攻 750/守 800
どんな物にでもかじりつく、行儀の悪い野ネズミ。`,kind:"Monster"},インセクション:{name:"インセクション",nameKana:"",description:"頭のノコギリの他に、腕もノコギリになっているクワガタ。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:950,defense:700,attribute:"Earth",type:"Insect",wikiName:"《インセクション》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A4%A5%F3%A5%BB%A5%AF%A5%B7%A5%E7%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/昆虫族/攻 950/守 700
頭のノコギリの他に、腕もノコギリになっているクワガタ。`,kind:"Monster"},インプ:{name:"インプ",nameKana:"",description:`闇に住む小さなオニ。
攻撃は意外に強い。ツノには注意。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1e3,attribute:"Dark",type:"Fiend",wikiName:"《インプ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A4%A5%F3%A5%D7%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1300/守1000
闇に住む小さなオニ。
攻撃は意外に強い。ツノには注意。`,kind:"Monster"},"ウィップテイル・ガーゴイル":{name:"ウィップテイル・ガーゴイル",nameKana:"",description:"ムチのように長いしっぽを使い、空中から襲いかかってくる。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1650,defense:1600,attribute:"Dark",type:"Fiend",wikiName:"《ウィップテイル・ガーゴイル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A6%A5%A3%A5%C3%A5%D7%A5%C6%A5%A4%A5%EB%A1%A6%A5%AC%A1%BC%A5%B4%A5%A4%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1650/守1600
ムチのように長いしっぽを使い、空中から襲いかかってくる。`,kind:"Monster"},ウィルミー:{name:"ウィルミー",nameKana:"",description:`かなり凶暴なウサギ。
鋭いかぎづめで、相手を血祭りにあげる。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1e3,defense:1200,attribute:"Earth",type:"Beast",wikiName:"《ウィルミー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A6%A5%A3%A5%EB%A5%DF%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣族/攻1000/守1200
かなり凶暴なウサギ。
鋭いかぎづめで、相手を血祭りにあげる。`,kind:"Monster"},"ウィング・エッグ・エルフ":{name:"ウィング・エッグ・エルフ",nameKana:"",description:"たまごのカラに身を包む天使。大きな羽で攻撃を防ぐ。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:500,defense:1300,attribute:"Light",type:"Fairy",wikiName:"《ウィング・エッグ・エルフ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A6%A5%A3%A5%F3%A5%B0%A1%A6%A5%A8%A5%C3%A5%B0%A1%A6%A5%A8%A5%EB%A5%D5%A1%D5",wikiTextAll:`通常モンスター
星３/光属性/天使族/攻 500/守1300
たまごのカラに身を包む天使。大きな羽で攻撃を防ぐ。`,kind:"Monster"},"ウイング・イーグル":{name:"ウイング・イーグル",nameKana:"",description:"はるか上空から獲物をさがし、狙った獲物は逃さない。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1800,defense:1500,attribute:"Wind",type:"WingedBeast",wikiName:"《ウイング・イーグル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A6%A5%A4%A5%F3%A5%B0%A1%A6%A5%A4%A1%BC%A5%B0%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星５/風属性/鳥獣族/攻1800/守1500
はるか上空から獲物をさがし、狙った獲物は逃さない。`,kind:"Monster"},"ウェザー・コントロール":{name:"ウェザー・コントロール",nameKana:"",description:`天気を自由にあやつれる。
山の天気が変わりやすいのはコイツのせい。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:600,defense:400,attribute:"Light",type:"Fairy",wikiName:"《ウェザー・コントロール》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A6%A5%A7%A5%B6%A1%BC%A1%A6%A5%B3%A5%F3%A5%C8%A5%ED%A1%BC%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星２/光属性/天使族/攻 600/守 400
天気を自由にあやつれる。
山の天気が変わりやすいのはコイツのせい。`,kind:"Monster"},ウェザ:{name:"ウェザ",nameKana:"",description:"雨を操る精霊。台風を呼び出し、様々なものを吹き飛ばす。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:900,attribute:"Water",type:"Aqua",wikiName:"《ウェザ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A6%A5%A7%A5%B6%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻1000/守 900
雨を操る精霊。台風を呼び出し、様々なものを吹き飛ばす。`,kind:"Monster"},"ウォー・アース":{name:"ウォー・アース",nameKana:"",description:`岩石が集まってできたゴーレム。
相手を石化して破壊する。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:700,defense:1400,attribute:"Earth",type:"Rock",wikiName:"《ウォー・アース》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A6%A5%A9%A1%BC%A1%A6%A5%A2%A1%BC%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/岩石族/攻 700/守1400
岩石が集まってできたゴーレム。
相手を石化して破壊する。`,kind:"Monster"},"ウォーター・エレメント":{name:"ウォーター・エレメント",nameKana:"",description:`水に住んでいる精霊。
まわりを霧でつつみこみ視界を奪う。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:700,attribute:"Water",type:"Aqua",wikiName:"《ウォーター・エレメント》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A6%A5%A9%A1%BC%A5%BF%A1%BC%A1%A6%A5%A8%A5%EC%A5%E1%A5%F3%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻 900/守 700
水に住んでいる精霊。
まわりを霧でつつみこみ視界を奪う。`,kind:"Monster"},"ウォーター・ガール":{name:"ウォーター・ガール",nameKana:"",description:"水を氷の矢のようにして攻撃してくるきれいなお姉さん。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1250,defense:1e3,attribute:"Water",type:"Aqua",wikiName:"《ウォーター・ガール》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A6%A5%A9%A1%BC%A5%BF%A1%BC%A1%A6%A5%AC%A1%BC%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1250/守1000
水を氷の矢のようにして攻撃してくるきれいなお姉さん。`,kind:"Monster"},"ウォーター・スピリット":{name:"ウォーター・スピリット",nameKana:"",description:`古代南極大陸の永久凍土にて生命が宿ったと言われる氷水の精霊。
様々な物質に浸透する事ができる。`,cardType:"Monster",monsterCategories:["Normal","Tuner"],level:1,attack:400,defense:1200,attribute:"Water",type:"Aqua",wikiName:"《ウォーター・スピリット》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A6%A5%A9%A1%BC%A5%BF%A1%BC%A1%A6%A5%B9%A5%D4%A5%EA%A5%C3%A5%C8%A1%D5",wikiTextAll:`チューナー・通常モンスター
星１/水属性/水族/攻 400/守1200
古代南極大陸の永久凍土にて生命が宿ったと言われる氷水の精霊。
様々な物質に浸透する事ができる。`,kind:"Monster"},"ウッド・ジョーカー":{name:"ウッド・ジョーカー",nameKana:"",description:`嫌な笑みを浮かべた悪魔。
手にするカマで、器用に攻撃をかわす。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:1200,attribute:"Earth",type:"Warrior",wikiName:"《ウッド・ジョーカー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A6%A5%C3%A5%C9%A1%A6%A5%B8%A5%E7%A1%BC%A5%AB%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/戦士族/攻 800/守1200
嫌な笑みを浮かべた悪魔。
手にするカマで、器用に攻撃をかわす。`,kind:"Monster"},ウンディーネ:{name:"ウンディーネ",nameKana:"",description:`水の中をユラユラ漂う妖精。
水龍を召喚できるらしい。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1100,defense:700,attribute:"Water",type:"Aqua",wikiName:"《ウンディーネ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A6%A5%F3%A5%C7%A5%A3%A1%BC%A5%CD%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻1100/守 700
水の中をユラユラ漂う妖精。
水龍を召喚できるらしい。`,kind:"Monster"},"エーリアン・ソルジャー":{name:"エーリアン・ソルジャー",nameKana:"",description:`謎の生命体、エーリアンの上級戦士。
比較的高い攻撃力を持つが、反面特殊な能力は身につけていない。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1900,defense:800,attribute:"Earth",type:"Reptile",wikiName:"《エーリアン・ソルジャー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A8%A1%BC%A5%EA%A5%A2%A5%F3%A1%A6%A5%BD%A5%EB%A5%B8%A5%E3%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/爬虫類族/攻1900/守 800
謎の生命体、エーリアンの上級戦士。
比較的高い攻撃力を持つが、反面特殊な能力は身につけていない。`,kind:"Monster"},"エア・イーター":{name:"エア・イーター",nameKana:"",description:"周囲の空気を食べてしまい、相手を窒息させるモンスター。",cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2100,defense:1600,attribute:"Wind",type:"Fiend",wikiName:"《エア・イーター》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A8%A5%A2%A1%A6%A5%A4%A1%BC%A5%BF%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星６/風属性/悪魔族/攻2100/守1600
周囲の空気を食べてしまい、相手を窒息させるモンスター。`,kind:"Monster"},"エビルナイト・ドラゴン":{name:"エビルナイト・ドラゴン",nameKana:"",description:"邪悪な騎士の心に宿るドラゴンが実体化したもの。",cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2350,defense:2400,attribute:"Dark",type:"Dragon",wikiName:"《エビルナイト・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A8%A5%D3%A5%EB%A5%CA%A5%A4%A5%C8%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星７/闇属性/ドラゴン族/攻2350/守2400
邪悪な騎士の心に宿るドラゴンが実体化したもの。`,kind:"Monster"},"エメラルド・ドラゴン":{name:"エメラルド・ドラゴン",nameKana:"",description:`エメラルドを喰らうドラゴン。
その美しい姿にひかれて命を落とす者は後を絶たない。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2400,defense:1400,attribute:"Wind",type:"Dragon",wikiName:"《エメラルド・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A8%A5%E1%A5%E9%A5%EB%A5%C9%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星６/風属性/ドラゴン族/攻2400/守1400
エメラルドを喰らうドラゴン。
その美しい姿にひかれて命を落とす者は後を絶たない。`,kind:"Monster"},エルディーン:{name:"エルディーン",nameKana:"",description:"手にする杖を使い、様々な魔法で攻撃してくる。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:950,defense:1e3,attribute:"Light",type:"Spellcaster",wikiName:"《エルディーン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A8%A5%EB%A5%C7%A5%A3%A1%BC%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星３/光属性/魔法使い族/攻 950/守1000
手にする杖を使い、様々な魔法で攻撃してくる。`,kind:"Monster"},エルフの剣士:{name:"エルフの剣士",nameKana:"",description:"剣術を学んだエルフ。素早い攻撃で敵を翻弄する。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1200,attribute:"Earth",type:"Warrior",wikiName:"《エルフの剣士》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A8%A5%EB%A5%D5%A4%CE%B7%F5%BB%CE%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/戦士族/攻1400/守1200
剣術を学んだエルフ。素早い攻撃で敵を翻弄する。`,kind:"Monster"},エレキッズ:{name:"エレキッズ",nameKana:"",description:"雷攻撃は意外と強い。甘く見ると感電するぞ。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:500,attribute:"Light",type:"Thunder",wikiName:"《エレキッズ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A8%A5%EC%A5%AD%A5%C3%A5%BA%A1%D5",wikiTextAll:`通常モンスター
星３/光属性/雷族/攻1000/守 500
雷攻撃は意外と強い。甘く見ると感電するぞ。`,kind:"Monster"},エレキテルドラゴン:{name:"エレキテルドラゴン",nameKana:"",description:`常に電気を纏い空中を浮遊するドラゴン。
古代より存在し、その生態には未だ謎が多いものの、
古のルールにより捕獲は禁止されている。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2500,defense:1e3,attribute:"Light",type:"Dragon",wikiName:"《エレキテルドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A8%A5%EC%A5%AD%A5%C6%A5%EB%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星６/光属性/ドラゴン族/攻2500/守1000
常に電気を纏い空中を浮遊するドラゴン。
古代より存在し、その生態には未だ謎が多いものの、
古のルールにより捕獲は禁止されている。`,kind:"Monster"},"エンシェント・エルフ":{name:"エンシェント・エルフ",nameKana:"",description:`何千年も生きているエルフ。
精霊をあやつり攻撃をする。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1450,defense:1200,attribute:"Light",type:"Spellcaster",wikiName:"《エンシェント・エルフ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A8%A5%F3%A5%B7%A5%A7%A5%F3%A5%C8%A1%A6%A5%A8%A5%EB%A5%D5%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/魔法使い族/攻1450/守1200
何千年も生きているエルフ。
精霊をあやつり攻撃をする。`,kind:"Monster"},"エンジェル・トランペッター":{name:"エンジェル・トランペッター",nameKana:"",description:`天使の様な美しい花。
絶えず侵入者を惑わす霧を生み出し、
聖なる獣たちが住まう森の最深部へ立ち入ることを許さない。`,cardType:"Monster",monsterCategories:["Normal","Tuner"],level:4,attack:1900,defense:1600,attribute:"Earth",type:"Plant",wikiName:"《エンジェル・トランペッター》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A8%A5%F3%A5%B8%A5%A7%A5%EB%A1%A6%A5%C8%A5%E9%A5%F3%A5%DA%A5%C3%A5%BF%A1%BC%A1%D5",wikiTextAll:`チューナー・通常モンスター
星４/地属性/植物族/攻1900/守1600
天使の様な美しい花。
絶えず侵入者を惑わす霧を生み出し、
聖なる獣たちが住まう森の最深部へ立ち入ることを許さない。`,kind:"Monster"},"エンジェル・魔女":{name:"エンジェル・魔女",nameKana:"",description:"天使になる運命を背負っていたが、あこがれの魔女になった天使。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:1e3,attribute:"Dark",type:"Spellcaster",wikiName:"《エンジェル・魔女》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A8%A5%F3%A5%B8%A5%A7%A5%EB%A1%A6%CB%E2%BD%F7%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/魔法使い族/攻 800/守1000
天使になる運命を背負っていたが、あこがれの魔女になった天使。`,kind:"Monster"},"エンゼル・イヤーズ":{name:"エンゼル・イヤーズ",nameKana:"",description:"大きな耳と目で周囲を監視する、恐ろしい風貌の天使。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1550,defense:1650,attribute:"Light",type:"Fairy",wikiName:"《エンゼル・イヤーズ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A8%A5%F3%A5%BC%A5%EB%A1%A6%A5%A4%A5%E4%A1%BC%A5%BA%A1%D5",wikiTextAll:`通常モンスター
星５/光属性/天使族/攻1550/守1650
大きな耳と目で周囲を監視する、恐ろしい風貌の天使。`,kind:"Monster"},オオカミ:{name:"オオカミ",nameKana:"",description:`今ではあまり見かけないオオカミ。
よくきく鼻で獲物をさがす。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:800,attribute:"Earth",type:"Beast",wikiName:"《オオカミ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AA%A5%AA%A5%AB%A5%DF%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/獣族/攻1200/守 800
今ではあまり見かけないオオカミ。
よくきく鼻で獲物をさがす。`,kind:"Monster"},オクトバーサー:{name:"オクトバーサー",nameKana:"",description:`サカナの頭、タコの足。
とっても不思議な生き物。
ヤリで攻撃する。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1600,defense:1400,attribute:"Water",type:"Aqua",wikiName:"《オクトバーサー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AA%A5%AF%A5%C8%A5%D0%A1%BC%A5%B5%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星５/水属性/水族/攻1600/守1400
サカナの頭、タコの足。
とっても不思議な生き物。
ヤリで攻撃する。`,kind:"Monster"},"オシロ・ヒーロー":{name:"オシロ・ヒーロー",nameKana:"",description:"異次元の世界からやってきた、なんだかよく分からない戦士。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1250,defense:700,attribute:"Earth",type:"Warrior",wikiName:"《オシロ・ヒーロー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AA%A5%B7%A5%ED%A1%A6%A5%D2%A1%BC%A5%ED%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/戦士族/攻1250/守 700
異次元の世界からやってきた、なんだかよく分からない戦士。`,kind:"Monster"},"オッドアイズ・アークペンデュラム・ドラゴン":{name:"オッドアイズ・アークペンデュラム・ドラゴン",nameKana:"",description:`雄々しくも美しき、神秘の眼を持つ奇跡の龍。
その二色に輝く眼は、天空に描かれし軌跡を映す。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:7,attack:2700,defense:2e3,attribute:"Dark",type:"Dragon",pendulumScaleR:8,pendulumScaleL:8,wikiName:"《オッドアイズ・アークペンデュラム・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AA%A5%C3%A5%C9%A5%A2%A5%A4%A5%BA%A1%A6%A5%A2%A1%BC%A5%AF%A5%DA%A5%F3%A5%C7%A5%E5%A5%E9%A5%E0%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星７/闇属性/ドラゴン族/攻2700/守2000
【Ｐスケール：青８/赤８】
このカード名のＰ効果は１ターンに１度しか使用できない。
(1)：自分フィールドの表側表示の「オッドアイズ」カードが戦闘・効果で破壊された場合に発動できる。
自分の手札・デッキ・墓地から「オッドアイズ」モンスター１体を特殊召喚する。
【モンスター情報】
雄々しくも美しき、神秘の眼を持つ奇跡の龍。
その二色に輝く眼は、天空に描かれし軌跡を映す。`,kind:"Monster",pendulumDescription:`このカード名のＰ効果は１ターンに１度しか使用できない。
(1)：自分フィールドの表側表示の「オッドアイズ」カードが戦闘・効果で破壊された場合に発動できる。
自分の手札・デッキ・墓地から「オッドアイズ」モンスター１体を特殊召喚する。`},"カース・オブ・ドラゴン":{name:"カース・オブ・ドラゴン",nameKana:"",description:"邪悪なドラゴン。闇の力を使った攻撃は強力だ。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:2e3,defense:1500,attribute:"Dark",type:"Dragon",wikiName:"《カース・オブ・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AB%A1%BC%A5%B9%A1%A6%A5%AA%A5%D6%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/ドラゴン族/攻2000/守1500
邪悪なドラゴン。闇の力を使った攻撃は強力だ。`,kind:"Monster"},カエルスライム:{name:"カエルスライム",nameKana:"",description:`カエルの頭の形をしたスライム。
ゲコゲコひどい歌を聴かせて攻撃。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:700,defense:500,attribute:"Water",type:"Aqua",wikiName:"《カエルスライム》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AB%A5%A8%A5%EB%A5%B9%A5%E9%A5%A4%A5%E0%A1%D5",wikiTextAll:`通常モンスター
星２/水属性/水族/攻 700/守 500
カエルの頭の形をしたスライム。
ゲコゲコひどい歌を聴かせて攻撃。`,kind:"Monster"},カクタス:{name:"カクタス",nameKana:"",description:"水中に潜んでいる、得体の知れない格好をしたばけもの。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1700,defense:1400,attribute:"Water",type:"Aqua",wikiName:"《カクタス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AB%A5%AF%A5%BF%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星５/水属性/水族/攻1700/守1400
水中に潜んでいる、得体の知れない格好をしたばけもの。`,kind:"Monster"},"カッター・ロボ":{name:"カッター・ロボ",nameKana:"",description:"四角い体に刃物を隠し持ち、なんでもかんでも切り刻む機械。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1e3,defense:1300,attribute:"Dark",type:"Machine",wikiName:"《カッター・ロボ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AB%A5%C3%A5%BF%A1%BC%A1%A6%A5%ED%A5%DC%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/機械族/攻1000/守1300
四角い体に刃物を隠し持ち、なんでもかんでも切り刻む機械。`,kind:"Monster"},カニカブト:{name:"カニカブト",nameKana:"",description:`カニのモンスター。
両手の大きなハサミで相手を切り刻む。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:650,defense:900,attribute:"Water",type:"Aqua",wikiName:"《カニカブト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AB%A5%CB%A5%AB%A5%D6%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻 650/守 900
カニのモンスター。
両手の大きなハサミで相手を切り刻む。`,kind:"Monster"},カマキラー:{name:"カマキラー",nameKana:"",description:"二本のカマで相手に襲いかかる、人型のカマキリモンスター。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1150,defense:1400,attribute:"Earth",type:"Insect",wikiName:"《カマキラー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AB%A5%DE%A5%AD%A5%E9%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/昆虫族/攻1150/守1400
二本のカマで相手に襲いかかる、人型のカマキリモンスター。`,kind:"Monster"},カラス天狗:{name:"カラス天狗",nameKana:"",description:`様々なことを知っている天狗。
神通力が使えるという。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1850,defense:1600,attribute:"Wind",type:"WingedBeast",wikiName:"《カラス天狗》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AB%A5%E9%A5%B9%C5%B7%B6%E9%A1%D5",wikiTextAll:`通常モンスター
星５/風属性/鳥獣族/攻1850/守1600
様々なことを知っている天狗。
神通力が使えるという。`,kind:"Monster"},"ガーゴイル・パワード":{name:"ガーゴイル・パワード",nameKana:"",description:`闇の力を得て強化されたガーゴイル。
かぎづめに注意！`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1200,attribute:"Dark",type:"Fiend",wikiName:"《ガーゴイル・パワード》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AC%A1%BC%A5%B4%A5%A4%A5%EB%A1%A6%A5%D1%A5%EF%A1%BC%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1600/守1200
闇の力を得て強化されたガーゴイル。
かぎづめに注意！`,kind:"Monster"},ガーゴイル:{name:"ガーゴイル",nameKana:"",description:`石像と思わせ、闇の中から攻撃をする。
逃げ足も素早い。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:500,attribute:"Dark",type:"Fiend",wikiName:"《ガーゴイル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AC%A1%BC%A5%B4%A5%A4%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/悪魔族/攻1000/守 500
石像と思わせ、闇の中から攻撃をする。
逃げ足も素早い。`,kind:"Monster"},"ガード・オブ・フレムベル":{name:"ガード・オブ・フレムベル",nameKana:"",description:`炎を自在に操る事ができる、フレムベルの護衛戦士。
灼熱のバリアを作り出して敵の攻撃を跳ね返す。`,cardType:"Monster",monsterCategories:["Normal","Tuner"],level:1,attack:100,defense:2e3,attribute:"Fire",type:"Dragon",wikiName:"《ガード・オブ・フレムベル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AC%A1%BC%A5%C9%A1%A6%A5%AA%A5%D6%A1%A6%A5%D5%A5%EC%A5%E0%A5%D9%A5%EB%A1%D5",wikiTextAll:`チューナー・通常モンスター
星１/炎属性/ドラゴン族/攻 100/守2000
炎を自在に操る事ができる、フレムベルの護衛戦士。
灼熱のバリアを作り出して敵の攻撃を跳ね返す。`,kind:"Monster"},"ガーネシア・エレファンティス":{name:"ガーネシア・エレファンティス",nameKana:"",description:`恐るべきパワーの持ち主。
あまりの体重の重さに、歩くたびに地割れが起きてしまう。`,cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2400,defense:2e3,attribute:"Earth",type:"BeastWarrior",wikiName:"《ガーネシア・エレファンティス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AC%A1%BC%A5%CD%A5%B7%A5%A2%A1%A6%A5%A8%A5%EC%A5%D5%A5%A1%A5%F3%A5%C6%A5%A3%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星７/地属性/獣戦士族/攻2400/守2000
恐るべきパワーの持ち主。
あまりの体重の重さに、歩くたびに地割れが起きてしまう。`,kind:"Monster"},ガガギゴ:{name:"ガガギゴ",nameKana:"",description:"かつては邪悪な心を持っていたが、ある人物に出会う事で正義の心に目覚めた悪魔の若者。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1850,defense:1e3,attribute:"Water",type:"Reptile",wikiName:"《ガガギゴ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AC%A5%AC%A5%AE%A5%B4%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/爬虫類族/攻1850/守1000
かつては邪悪な心を持っていたが、ある人物に出会う事で正義の心に目覚めた悪魔の若者。`,kind:"Monster"},"ガジェット・ソルジャー":{name:"ガジェット・ソルジャー",nameKana:"",description:`戦うために造られた機械の戦士。
さびない金属でできている。`,pendulumDescription:`戦うために造られた機械の戦士。
さびない金属でできている。`,kind:"Monster",monsterCategories:["Normal"],level:6,attack:1800,defense:2e3,attribute:"Fire",type:"Machine",wikiName:"《ガジェット・ソルジャー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AC%A5%B8%A5%A7%A5%C3%A5%C8%A1%A6%A5%BD%A5%EB%A5%B8%A5%E3%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星６/炎属性/機械族/攻1800/守2000
戦うために造られた機械の戦士。
さびない金属でできている。`},ガトリングバギー:{name:"ガトリングバギー",nameKana:"",description:"重機関銃装備の装甲車。どんな荒れ地も平気で走る事ができる。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1500,attribute:"Earth",type:"Machine",wikiName:"《ガトリングバギー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AC%A5%C8%A5%EA%A5%F3%A5%B0%A5%D0%A5%AE%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/機械族/攻1600/守1500
重機関銃装備の装甲車。どんな荒れ地も平気で走る事ができる。`,kind:"Monster"},ガニグモ:{name:"ガニグモ",nameKana:"",description:`はさみを持つクモ。
相手を糸で動きを封じ、カニばさみでしとめる。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:600,defense:800,attribute:"Earth",type:"Insect",wikiName:"《ガニグモ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AC%A5%CB%A5%B0%A5%E2%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/昆虫族/攻 600/守 800
はさみを持つクモ。
相手を糸で動きを封じ、カニばさみでしとめる。`,kind:"Monster"},ガルーザス:{name:"ガルーザス",nameKana:"",description:"竜の頭を持つ獣戦士。オノの攻撃はかなり強力。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1800,defense:1500,attribute:"Fire",type:"BeastWarrior",wikiName:"《ガルーザス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AC%A5%EB%A1%BC%A5%B6%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星５/炎属性/獣戦士族/攻1800/守1500
竜の頭を持つ獣戦士。オノの攻撃はかなり強力。`,kind:"Monster"},ガルヴァス:{name:"ガルヴァス",nameKana:"",description:"ライオンに羽の生えた、獣のような姿をした悪の化身。",cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2e3,defense:1700,attribute:"Earth",type:"Beast",wikiName:"《ガルヴァス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AC%A5%EB%A5%F4%A5%A1%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星６/地属性/獣族/攻2000/守1700
ライオンに羽の生えた、獣のような姿をした悪の化身。`,kind:"Monster"},ガンロック:{name:"ガンロック",nameKana:"",description:"両肩についているマシンガンを乱射しながら体当たりをする。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1e3,defense:1300,attribute:"Earth",type:"Rock",wikiName:"《ガンロック》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AC%A5%F3%A5%ED%A5%C3%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/岩石族/攻1000/守1300
両肩についているマシンガンを乱射しながら体当たりをする。`,kind:"Monster"},キーメイス:{name:"キーメイス",nameKana:"",description:`とても小さな天使。
かわいらしさに負け、誰でも心を開いてしまう。`,cardType:"Monster",monsterCategories:["Normal"],level:1,attack:400,defense:300,attribute:"Light",type:"Fairy",wikiName:"《キーメイス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AD%A1%BC%A5%E1%A5%A4%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星１/光属性/天使族/攻 400/守 300
とても小さな天使。
かわいらしさに負け、誰でも心を開いてしまう。`,kind:"Monster"},"キャッツ・フェアリー":{name:"キャッツ・フェアリー",nameKana:"",description:`ネコの妖精。
愛らしい姿とはうらはらに、素早く敵をひっかく。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1100,defense:900,attribute:"Earth",type:"Beast",wikiName:"《キャッツ・フェアリー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AD%A5%E3%A5%C3%A5%C4%A1%A6%A5%D5%A5%A7%A5%A2%A5%EA%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/獣族/攻1100/守 900
ネコの妖精。
愛らしい姿とはうらはらに、素早く敵をひっかく。`,kind:"Monster"},"キャット・レディ":{name:"キャット・レディ",nameKana:"",description:"素早い動きで攻撃をかわし、鋭いかぎづめで襲いかかる。",cardType:"Monster",monsterCategories:["Normal"],level:6,attack:1900,defense:2e3,attribute:"Earth",type:"BeastWarrior",wikiName:"《キャット・レディ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AD%A5%E3%A5%C3%A5%C8%A1%A6%A5%EC%A5%C7%A5%A3%A1%D5",wikiTextAll:`通常モンスター
星６/地属性/獣戦士族/攻1900/守2000
素早い動きで攻撃をかわし、鋭いかぎづめで襲いかかる。`,kind:"Monster"},"キラー・ザ・クロー":{name:"キラー・ザ・クロー",nameKana:"",description:"腕を自由に伸ばし、鋭い爪で相手を串刺しにすることができる。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:800,attribute:"Dark",type:"Fiend",wikiName:"《キラー・ザ・クロー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AD%A5%E9%A1%BC%A1%A6%A5%B6%A1%A6%A5%AF%A5%ED%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/悪魔族/攻1000/守 800
腕を自由に伸ばし、鋭い爪で相手を串刺しにすることができる。`,kind:"Monster"},"キラー・ビー":{name:"キラー・ビー",nameKana:"",description:`大きなハチ。
意外に強い攻撃をする。
群で襲われると大変。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1e3,attribute:"Wind",type:"Insect",wikiName:"《キラー・ビー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AD%A5%E9%A1%BC%A1%A6%A5%D3%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/昆虫族/攻1200/守1000
大きなハチ。
意外に強い攻撃をする。
群で襲われると大変。`,kind:"Monster"},"キラー・ブロッブ":{name:"キラー・ブロッブ",nameKana:"",description:"スライムの親分。見た目は同じだが、なめてかかると痛い目にあうぞ。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1300,defense:700,attribute:"Water",type:"Aqua",wikiName:"《キラー・ブロッブ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AD%A5%E9%A1%BC%A1%A6%A5%D6%A5%ED%A5%C3%A5%D6%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻1300/守 700
スライムの親分。見た目は同じだが、なめてかかると痛い目にあうぞ。`,kind:"Monster"},"キラー・マシーン":{name:"キラー・マシーン",nameKana:"",description:"大きく反った剣を振りかざし暴れ回る、殺人マシン。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1450,defense:1500,attribute:"Dark",type:"Machine",wikiName:"《キラー・マシーン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AD%A5%E9%A1%BC%A1%A6%A5%DE%A5%B7%A1%BC%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/機械族/攻1450/守1500
大きく反った剣を振りかざし暴れ回る、殺人マシン。`,kind:"Monster"},キラーパンダ:{name:"キラーパンダ",nameKana:"",description:"常に太い竹を一本持っており、性格は非常に凶暴である。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1e3,attribute:"Earth",type:"Beast",wikiName:"《キラーパンダ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AD%A5%E9%A1%BC%A5%D1%A5%F3%A5%C0%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣族/攻1200/守1000
常に太い竹を一本持っており、性格は非常に凶暴である。`,kind:"Monster"},"キング・スモーク":{name:"キング・スモーク",nameKana:"",description:"煙の中にひそむ悪魔。まわりを煙でおおい、見えなくしてしまう。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:900,attribute:"Dark",type:"Fiend",wikiName:"《キング・スモーク》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AD%A5%F3%A5%B0%A1%A6%A5%B9%A5%E2%A1%BC%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/悪魔族/攻1000/守 900
煙の中にひそむ悪魔。まわりを煙でおおい、見えなくしてしまう。`,kind:"Monster"},"ギガ・ガガギゴ":{name:"ギガ・ガガギゴ",nameKana:"",description:`強大な悪に立ち向かうため、様々な肉体改造をほどこした結果
恐るべきパワーを手に入れたが、その代償として正義の心を失ってしまった。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:2450,defense:1500,attribute:"Water",type:"Reptile",wikiName:"《ギガ・ガガギゴ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AE%A5%AC%A1%A6%A5%AC%A5%AC%A5%AE%A5%B4%A1%D5",wikiTextAll:`通常モンスター
星５/水属性/爬虫類族/攻2450/守1500
強大な悪に立ち向かうため、様々な肉体改造をほどこした結果
恐るべきパワーを手に入れたが、その代償として正義の心を失ってしまった。`,kind:"Monster"},"ギガテック・ウルフ":{name:"ギガテック・ウルフ",nameKana:"",description:`全身が鋼鉄でできたオオカミ。
鋭くとがったキバでかみついてくる。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1400,attribute:"Fire",type:"Machine",wikiName:"《ギガテック・ウルフ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AE%A5%AC%A5%C6%A5%C3%A5%AF%A1%A6%A5%A6%A5%EB%A5%D5%A1%D5",wikiTextAll:`通常モンスター
星４/炎属性/機械族/攻1200/守1400
全身が鋼鉄でできたオオカミ。
鋭くとがったキバでかみついてくる。`,kind:"Monster"},ギガント:{name:"ギガント",nameKana:"",description:"スパイクのついた大きな鉄球を振り回し襲いかかってくる。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1700,defense:1800,attribute:"Dark",type:"Machine",wikiName:"《ギガント》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AE%A5%AC%A5%F3%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/機械族/攻1700/守1800
スパイクのついた大きな鉄球を振り回し襲いかかってくる。`,kind:"Monster"},ギゴバイト:{name:"ギゴバイト",nameKana:"",description:"今はまだおだやかな心を持っているが、邪悪な心に染まる運命を背負っている・・・。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:350,defense:300,attribute:"Water",type:"Reptile",wikiName:"《ギゴバイト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AE%A5%B4%A5%D0%A5%A4%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星１/水属性/爬虫類族/攻 350/守 300
今はまだおだやかな心を持っているが、邪悪な心に染まる運命を背負っている・・・。`,kind:"Monster"},ギャラクシーサーペント:{name:"ギャラクシーサーペント",nameKana:"",description:`宵闇に紛れて姿を現わすと言われるドラゴン。
星の海を泳ぐように飛ぶ神秘的な姿からその名が付けられた。
その姿を見た者は数えるほどしかないと伝えられるが、見た者は新たな力を得られるという。`,cardType:"Monster",monsterCategories:["Normal","Tuner"],level:2,attack:1e3,attribute:"Light",type:"Dragon",wikiName:"《ギャラクシーサーペント》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AE%A5%E3%A5%E9%A5%AF%A5%B7%A1%BC%A5%B5%A1%BC%A5%DA%A5%F3%A5%C8%A1%D5",wikiTextAll:`チューナー・通常モンスター
星２/光属性/ドラゴン族/攻1000/守   0
宵闇に紛れて姿を現わすと言われるドラゴン。
星の海を泳ぐように飛ぶ神秘的な姿からその名が付けられた。
その姿を見た者は数えるほどしかないと伝えられるが、見た者は新たな力を得られるという。`,kind:"Monster",defense:0},"ギル・ガース":{name:"ギル・ガース",nameKana:"",description:`鋼鉄の鎧を身にまとった殺戮マシーン。
巨大なカタナで容赦なく攻撃をする。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,defense:1200,attribute:"Dark",type:"Fiend",wikiName:"《ギル・ガース》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AE%A5%EB%A1%A6%A5%AC%A1%BC%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1800/守1200
鋼鉄の鎧を身にまとった殺戮マシーン。
巨大なカタナで容赦なく攻撃をする。`,kind:"Monster"},"ギロチン・クワガタ":{name:"ギロチン・クワガタ",nameKana:"",description:`ハイエルフの森に生息するクワガタ。
人の親指ほどの大きさしかないが、鋼鉄をも切り裂く強力な顎をもつ。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1700,defense:1e3,attribute:"Wind",type:"Insect",wikiName:"《ギロチン・クワガタ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AE%A5%ED%A5%C1%A5%F3%A1%A6%A5%AF%A5%EF%A5%AC%A5%BF%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/昆虫族/攻1700/守1000
ハイエルフの森に生息するクワガタ。
人の親指ほどの大きさしかないが、鋼鉄をも切り裂く強力な顎をもつ。`,kind:"Monster"},"クィーンズ・ナイト":{name:"クィーンズ・ナイト",nameKana:"",description:`しなやかな動きで敵を翻弄し、
相手のスキを突いて素早い攻撃を繰り出す。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1600,attribute:"Light",type:"Warrior",wikiName:"《クィーンズ・ナイト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AF%A5%A3%A1%BC%A5%F3%A5%BA%A1%A6%A5%CA%A5%A4%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/戦士族/攻1500/守1600
しなやかな動きで敵を翻弄し、
相手のスキを突いて素早い攻撃を繰り出す。`,kind:"Monster"},"クイーン・バード":{name:"クイーン・バード",nameKana:"",description:`大きなくちばしで相手をつついて攻撃する。
守備力が高い。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1200,defense:2e3,attribute:"Wind",type:"WingedBeast",wikiName:"《クイーン・バード》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AF%A5%A4%A1%BC%A5%F3%A1%A6%A5%D0%A1%BC%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星５/風属性/鳥獣族/攻1200/守2000
大きなくちばしで相手をつついて攻撃する。
守備力が高い。`,kind:"Monster"},クジャック:{name:"クジャック",nameKana:"",description:`美しい羽根を広げる大きなクジャク。
その羽根を飛ばして攻撃！`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1700,defense:1500,attribute:"Wind",type:"WingedBeast",wikiName:"《クジャック》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AF%A5%B8%A5%E3%A5%C3%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星５/風属性/鳥獣族/攻1700/守1500
美しい羽根を広げる大きなクジャク。
その羽根を飛ばして攻撃！`,kind:"Monster"},クラッシュマン:{name:"クラッシュマン",nameKana:"",description:"意外に素早く動き回り、丸まって体当たりをしてくる。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1600,defense:1800,attribute:"Earth",type:"Beast",wikiName:"《クラッシュマン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AF%A5%E9%A5%C3%A5%B7%A5%E5%A5%DE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/獣族/攻1600/守1800
意外に素早く動き回り、丸まって体当たりをしてくる。`,kind:"Monster"},"クリフォート・アセンブラ":{name:"クリフォート・アセンブラ",nameKana:"",description:`qliphoth.exe の 0x1i-666 でハンドルされていない例外を確認。
場所 0x00-000 に書き込み中にアクセス違反が発生しました。
このエラーを無視し、続行しますか？ 〈Y/N〉...[ ]
===CARNAGE===
たッgなnトiのoモdる知rヲu悪o善yりナnにoウよyノrりgトnひaノれsワiれワdはo人Gヨ見
イdなoレo知lもfカるeキr生iにf久永gベn食iてrッb取もoラtか木tノn命aベw伸ヲd手nはa彼`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:5,attack:2400,defense:1e3,attribute:"Earth",type:"Machine",pendulumScaleR:1,pendulumScaleL:1,wikiName:"《クリフォート・アセンブラ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AF%A5%EA%A5%D5%A5%A9%A1%BC%A5%C8%A1%A6%A5%A2%A5%BB%A5%F3%A5%D6%A5%E9%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星５/地属性/機械族/攻2400/守1000
【Ｐスケール：青１/赤１】
(1)：自分は「クリフォート」モンスターしか特殊召喚できない。
この効果は無効化されない。
(2)：自分がアドバンス召喚に成功したターンのエンドフェイズに発動できる。
このターン自分がアドバンス召喚のためにリリースした「クリフォート」モンスターの数だけ、
自分はデッキからドローする。
【モンスター情報】
qliphoth.exe の 0x1i-666 でハンドルされていない例外を確認。
場所 0x00-000 に書き込み中にアクセス違反が発生しました。
このエラーを無視し、続行しますか？ 〈Y/N〉...[ ]
===CARNAGE===
たッgなnトiのoモdる知rヲu悪o善yりナnにoウよyノrりgトnひaノれsワiれワdはo人Gヨ見
イdなoレo知lもfカるeキr生iにf久永gベn食iてrッb取もoラtか木tノn命aベw伸ヲd手nはa彼`,kind:"Monster",pendulumDescription:`(1)：自分は「クリフォート」モンスターしか特殊召喚できない。
この効果は無効化されない。
(2)：自分がアドバンス召喚に成功したターンのエンドフェイズに発動できる。
このターン自分がアドバンス召喚のためにリリースした「クリフォート」モンスターの数だけ、
自分はデッキからドローする。`},"クリフォート・ツール":{name:"クリフォート・ツール",nameKana:"",description:`システムをレプリカモードで起動する準備をしています...
C:¥sophia¥sefiroth.exe 実行中にエラーが発生しました。
次の不明な発行元からのプログラムを実行しようとしています。
C:¥tierra¥qliphoth.exe の実行を許可しますか？ ...[Y]
システムを自律モードで起動します。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:5,attack:1e3,defense:2800,attribute:"Earth",type:"Machine",pendulumScaleR:9,pendulumScaleL:9,wikiName:"《クリフォート・ツール》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AF%A5%EA%A5%D5%A5%A9%A1%BC%A5%C8%A1%A6%A5%C4%A1%BC%A5%EB%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星５/地属性/機械族/攻1000/守2800
【Ｐスケール：青９/赤９】
(1)：自分は「クリフォート」モンスターしか特殊召喚できない。
この効果は無効化されない。
(2)：１ターンに１度、８００ＬＰを払って発動できる。
デッキから「クリフォート・ツール」以外の「クリフォート」カード１枚を手札に加える。
【モンスター情報】
システムをレプリカモードで起動する準備をしています...
C:¥sophia¥sefiroth.exe 実行中にエラーが発生しました。
次の不明な発行元からのプログラムを実行しようとしています。
C:¥tierra¥qliphoth.exe の実行を許可しますか？ ...[Y]
システムを自律モードで起動します。`,kind:"Monster",pendulumDescription:`(1)：自分は「クリフォート」モンスターしか特殊召喚できない。
この効果は無効化されない。
(2)：１ターンに１度、８００ＬＰを払って発動できる。
デッキから「クリフォート・ツール」以外の「クリフォート」カード１枚を手札に加える。`},"クレイジー・フィッシュ":{name:"クレイジー・フィッシュ",nameKana:"",description:"鋭くとがっている頭の先を突き出して、攻撃してくるトビウオ。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1200,attribute:"Water",type:"Fish",wikiName:"《クレイジー・フィッシュ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AF%A5%EC%A5%A4%A5%B8%A1%BC%A1%A6%A5%D5%A5%A3%A5%C3%A5%B7%A5%E5%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/魚族/攻1600/守1200
鋭くとがっている頭の先を突き出して、攻撃してくるトビウオ。`,kind:"Monster"},"クレセント・ドラゴン":{name:"クレセント・ドラゴン",nameKana:"",description:"月から来たといわれている、三日月状の刀を持つドラゴン戦士。",cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2200,defense:2350,attribute:"Dark",type:"Dragon",wikiName:"《クレセント・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AF%A5%EC%A5%BB%A5%F3%A5%C8%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星７/闇属性/ドラゴン族/攻2200/守2350
月から来たといわれている、三日月状の刀を持つドラゴン戦士。`,kind:"Monster"},クロコダイラス:{name:"クロコダイラス",nameKana:"",description:`知恵を持ちさらに狂暴化したワニ。
かたいうろこで攻撃をはじく。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1100,defense:1200,attribute:"Water",type:"Reptile",wikiName:"《クロコダイラス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AF%A5%ED%A5%B3%A5%C0%A5%A4%A5%E9%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/爬虫類族/攻1100/守1200
知恵を持ちさらに狂暴化したワニ。
かたいうろこで攻撃をはじく。`,kind:"Monster"},"クワガタ・アルファ":{name:"クワガタ・アルファ",nameKana:"",description:`凶暴なクワガタ。
相手の首を狙うギロチンカッターに注意。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1250,defense:1e3,attribute:"Earth",type:"Insect",wikiName:"《クワガタ・アルファ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AF%A5%EF%A5%AC%A5%BF%A1%A6%A5%A2%A5%EB%A5%D5%A5%A1%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/昆虫族/攻1250/守1000
凶暴なクワガタ。
相手の首を狙うギロチンカッターに注意。`,kind:"Monster"},グラップラー:{name:"グラップラー",nameKana:"",description:`ずるがしこいヘビ。
太くて長い身体で締め付ける攻撃に注意！`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1200,attribute:"Water",type:"Reptile",wikiName:"《グラップラー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B0%A5%E9%A5%C3%A5%D7%A5%E9%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/爬虫類族/攻1300/守1200
ずるがしこいヘビ。
太くて長い身体で締め付ける攻撃に注意！`,kind:"Monster"},グリフォール:{name:"グリフォール",nameKana:"",description:"かたい体で守ることが得意。半端な攻撃は、はじき返す。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1500,attribute:"Earth",type:"Beast",wikiName:"《グリフォール》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B0%A5%EA%A5%D5%A5%A9%A1%BC%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣族/攻1200/守1500
かたい体で守ることが得意。半端な攻撃は、はじき返す。`,kind:"Monster"},"グレート・アンガス":{name:"グレート・アンガス",nameKana:"",description:`狂ったように暴れ続けている、非常に凶暴な獣。
おとなしい姿を見た者はいないと言う。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,defense:600,attribute:"Fire",type:"Beast",wikiName:"《グレート・アンガス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B0%A5%EC%A1%BC%A5%C8%A1%A6%A5%A2%A5%F3%A5%AC%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/炎属性/獣族/攻1800/守 600
狂ったように暴れ続けている、非常に凶暴な獣。
おとなしい姿を見た者はいないと言う。`,kind:"Monster"},"グレート・ホワイト":{name:"グレート・ホワイト",nameKana:"",description:`巨大な白いサメ。
大きな口で噛みつかれたら逃れられない。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:800,attribute:"Water",type:"Fish",wikiName:"《グレート・ホワイト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B0%A5%EC%A1%BC%A5%C8%A1%A6%A5%DB%A5%EF%A5%A4%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/魚族/攻1600/守 800
巨大な白いサメ。
大きな口で噛みつかれたら逃れられない。`,kind:"Monster"},"グレード・ビル":{name:"グレード・ビル",nameKana:"",description:"どんなものでも丸飲みできる大きな口を持っている。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1250,defense:1300,attribute:"Earth",type:"Beast",wikiName:"《グレード・ビル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B0%A5%EC%A1%BC%A5%C9%A1%A6%A5%D3%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣族/攻1250/守1300
どんなものでも丸飲みできる大きな口を持っている。`,kind:"Monster"},グレムリン:{name:"グレムリン",nameKana:"",description:`いたずら好きの小さな悪魔。
暗闇から襲ってくる。気をつけろ！`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1400,attribute:"Dark",type:"Fiend",wikiName:"《グレムリン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B0%A5%EC%A5%E0%A5%EA%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1300/守1400
いたずら好きの小さな悪魔。
暗闇から襲ってくる。気をつけろ！`,kind:"Monster"},グロス:{name:"グロス",nameKana:"",description:"ムチのように長い腕で、少し離れたところでも攻撃できる。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:700,attribute:"Water",type:"Aqua",wikiName:"《グロス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B0%A5%ED%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻 900/守 700
ムチのように長い腕で、少し離れたところでも攻撃できる。`,kind:"Monster"},ケンタウロス:{name:"ケンタウロス",nameKana:"",description:`人とウマがひとつになった化け物。
走るのが速く、誰も追いつけない。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1550,attribute:"Earth",type:"Beast",wikiName:"《ケンタウロス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B1%A5%F3%A5%BF%A5%A6%A5%ED%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣族/攻1300/守1550
人とウマがひとつになった化け物。
走るのが速く、誰も追いつけない。`,kind:"Monster"},"ゲート・キーパー":{name:"ゲート・キーパー",nameKana:"",description:`入り口を守るために造られた機械。
壊すのは大変だ！`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1500,defense:1800,attribute:"Dark",type:"Machine",wikiName:"《ゲート・キーパー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B2%A1%BC%A5%C8%A1%A6%A5%AD%A1%BC%A5%D1%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/機械族/攻1500/守1800
入り口を守るために造られた機械。
壊すのは大変だ！`,kind:"Monster"},コケ:{name:"コケ",nameKana:"",description:"相手を丸飲みにして、自分のエネルギーとして取り込んでしまう。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:800,attribute:"Earth",type:"WingedBeast",wikiName:"《コケ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B3%A5%B1%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/鳥獣族/攻 900/守 800
相手を丸飲みにして、自分のエネルギーとして取り込んでしまう。`,kind:"Monster"},コザッキー:{name:"コザッキー",nameKana:"",description:`魔界言語の研究に全てを捧げているモーレツ悪魔。
働きすぎで精神が崩壊している。`,cardType:"Monster",monsterCategories:["Normal"],level:1,attack:400,defense:400,attribute:"Dark",type:"Fiend",wikiName:"《コザッキー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B3%A5%B6%A5%C3%A5%AD%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星１/闇属性/悪魔族/攻 400/守 400
魔界言語の研究に全てを捧げているモーレツ悪魔。
働きすぎで精神が崩壊している。`,kind:"Monster"},コスモクイーン:{name:"コスモクイーン",nameKana:"",description:"宇宙に存在する、全ての星を統治しているという女王。",cardType:"Monster",monsterCategories:["Normal"],level:8,attack:2900,defense:2450,attribute:"Dark",type:"Spellcaster",wikiName:"《コスモクイーン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B3%A5%B9%A5%E2%A5%AF%A5%A4%A1%BC%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星８/闇属性/魔法使い族/攻2900/守2450
宇宙に存在する、全ての星を統治しているという女王。`,kind:"Monster"},コピックス:{name:"コピックス",nameKana:"",description:"いろんな奴に変身して、相手をだましながら戦う戦士。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:600,defense:500,attribute:"Earth",type:"Warrior",wikiName:"《コピックス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B3%A5%D4%A5%C3%A5%AF%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/戦士族/攻 600/守 500
いろんな奴に変身して、相手をだましながら戦う戦士。`,kind:"Monster"},コマンダー:{name:"コマンダー",nameKana:"",description:"ロケットランチャーとバズーカ砲を装備した実戦部隊。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:750,defense:700,attribute:"Dark",type:"Machine",wikiName:"《コマンダー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B3%A5%DE%A5%F3%A5%C0%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/機械族/攻 750/守 700
ロケットランチャーとバズーカ砲を装備した実戦部隊。`,kind:"Monster"},コロガーシ:{name:"コロガーシ",nameKana:"",description:"自分の体の何倍も大きなフンを転がし、相手を押しつぶす。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:550,defense:400,attribute:"Earth",type:"Insect",wikiName:"《コロガーシ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B3%A5%ED%A5%AC%A1%BC%A5%B7%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/昆虫族/攻 550/守 400
自分の体の何倍も大きなフンを転がし、相手を押しつぶす。`,kind:"Monster"},"ゴーゴン・エッグ":{name:"ゴーゴン・エッグ",nameKana:"",description:`ゴーゴンが産んだ卵。
大きな目に映ったものが産まれると言われている。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:300,defense:1300,attribute:"Dark",type:"Fiend",wikiName:"《ゴーゴン・エッグ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B4%A1%BC%A5%B4%A5%F3%A1%A6%A5%A8%A5%C3%A5%B0%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/悪魔族/攻 300/守1300
ゴーゴンが産んだ卵。
大きな目に映ったものが産まれると言われている。`,kind:"Monster"},"ゴースト・ビーフ":{name:"ゴースト・ビーフ",nameKana:"",description:`グルメな牛の幽霊。
特に大好物のロースト・ビーフには目がなく、
今日も新たな味との出会いに心を躍らせながら現世を彷徨っている。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:7,attack:2e3,defense:1e3,attribute:"Dark",type:"Beast",pendulumScaleR:4,pendulumScaleL:4,wikiName:"《ゴースト・ビーフ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B4%A1%BC%A5%B9%A5%C8%A1%A6%A5%D3%A1%BC%A5%D5%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星７/闇属性/獣族/攻2000/守1000
【Ｐスケール：青４/赤４】
(1)：１ターンに１度、自分メインフェイズに発動できる。
サイコロを１回振る。
ターン終了時まで、このカードのＰスケールを出た目の数だけ上げる（最大１０まで）。
【モンスター情報】
グルメな牛の幽霊。
特に大好物のロースト・ビーフには目がなく、
今日も新たな味との出会いに心を躍らせながら現世を彷徨っている。`,kind:"Monster",pendulumDescription:`(1)：１ターンに１度、自分メインフェイズに発動できる。
サイコロを１回振る。
ターン終了時まで、このカードのＰスケールを出た目の数だけ上げる（最大１０まで）。`},ゴースト:{name:"ゴースト",nameKana:"",description:"この世の成仏できない霊が集まってできた怨霊。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:600,defense:800,attribute:"Dark",type:"Zombie",wikiName:"《ゴースト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B4%A1%BC%A5%B9%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/アンデット族/攻 600/守 800
この世の成仏できない霊が集まってできた怨霊。`,kind:"Monster"},ゴキボール:{name:"ゴキボール",nameKana:"",description:`丸いゴキブリ。
ゴロゴロ転がって攻撃。
守備が意外と高いぞ。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1400,attribute:"Earth",type:"Insect",wikiName:"《ゴキボール》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B4%A5%AD%A5%DC%A1%BC%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/昆虫族/攻1200/守1400
丸いゴキブリ。
ゴロゴロ転がって攻撃。
守備が意外と高いぞ。`,kind:"Monster"},"ゴギガ・ガガギゴ":{name:"ゴギガ・ガガギゴ",nameKana:"",description:`既に精神は崩壊し、肉体は更なるパワーを求めて暴走する。
その姿にかつての面影はない・・・。`,cardType:"Monster",monsterCategories:["Normal"],level:8,attack:2950,defense:2800,attribute:"Water",type:"Reptile",wikiName:"《ゴギガ・ガガギゴ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B4%A5%AE%A5%AC%A1%A6%A5%AC%A5%AC%A5%AE%A5%B4%A1%D5",wikiTextAll:`通常モンスター
星８/水属性/爬虫類族/攻2950/守2800
既に精神は崩壊し、肉体は更なるパワーを求めて暴走する。
その姿にかつての面影はない・・・。`,kind:"Monster"},ゴルゴイル:{name:"ゴルゴイル",nameKana:"",description:"異次元に通じる穴から出てくる、大きな鋼鉄の魔人。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:900,defense:1600,attribute:"Earth",type:"Machine",wikiName:"《ゴルゴイル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B4%A5%EB%A5%B4%A5%A4%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/機械族/攻 900/守1600
異次元に通じる穴から出てくる、大きな鋼鉄の魔人。`,kind:"Monster"},サイガー:{name:"サイガー",nameKana:"",description:"守備は見た目ほど高くないが、ツノによる攻撃は強力だ。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:600,attribute:"Earth",type:"Beast",wikiName:"《サイガー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%A4%A5%AC%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/獣族/攻1200/守 600
守備は見た目ほど高くないが、ツノによる攻撃は強力だ。`,kind:"Monster"},サイクロイド:{name:"サイクロイド",nameKana:"",description:`数あるビークロイドの中で、最も親しみ深く愛されるビークロイド。
補助輪を装備する事もできるぞ！`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:1e3,attribute:"Earth",type:"Machine",wikiName:"《サイクロイド》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%A4%A5%AF%A5%ED%A5%A4%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/機械族/攻 800/守1000
数あるビークロイドの中で、最も親しみ深く愛されるビークロイド。
補助輪を装備する事もできるぞ！`,kind:"Monster"},サイクロプス:{name:"サイクロプス",nameKana:"",description:`一つ目の巨人。
太い腕で殴りかかってくる。要注意。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1e3,attribute:"Earth",type:"BeastWarrior",wikiName:"《サイクロプス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%A4%A5%AF%A5%ED%A5%D7%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣戦士族/攻1200/守1000
一つ目の巨人。
太い腕で殴りかかってくる。要注意。`,kind:"Monster"},"サイコ・カッパー":{name:"サイコ・カッパー",nameKana:"",description:"いろいろな超能力を使い、攻撃のダメージを防ぐカッパ。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:400,defense:1e3,attribute:"Water",type:"Aqua",wikiName:"《サイコ・カッパー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%A4%A5%B3%A1%A6%A5%AB%A5%C3%A5%D1%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星２/水属性/水族/攻 400/守1000
いろいろな超能力を使い、攻撃のダメージを防ぐカッパ。`,kind:"Monster"},"サイバティック・ワイバーン":{name:"サイバティック・ワイバーン",nameKana:"",description:`メカで強化された翼竜。
ドラゴンにやられ死にかけた所を、飼い主にサイボーグ化された。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:2500,defense:1600,attribute:"Wind",type:"Machine",wikiName:"《サイバティック・ワイバーン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%A4%A5%D0%A5%C6%A5%A3%A5%C3%A5%AF%A1%A6%A5%EF%A5%A4%A5%D0%A1%BC%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星５/風属性/機械族/攻2500/守1600
メカで強化された翼竜。
ドラゴンにやられ死にかけた所を、飼い主にサイボーグ化された。`,kind:"Monster"},"サイボーグ・バス":{name:"サイボーグ・バス",nameKana:"",description:"背中に付いている砲台から、閃光のプラズマキャノンを打ち出す。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1800,defense:1500,attribute:"Water",type:"Machine",wikiName:"《サイボーグ・バス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%A4%A5%DC%A1%BC%A5%B0%A1%A6%A5%D0%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星５/水属性/機械族/攻1800/守1500
背中に付いている砲台から、閃光のプラズマキャノンを打ち出す。`,kind:"Monster"},"サキュバス・ナイト":{name:"サキュバス・ナイト",nameKana:"",description:"魔法を唱え、相手を血祭りにあげる悪魔の魔法戦士。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1650,defense:1300,attribute:"Dark",type:"Warrior",wikiName:"《サキュバス・ナイト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%AD%A5%E5%A5%D0%A5%B9%A1%A6%A5%CA%A5%A4%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/戦士族/攻1650/守1300
魔法を唱え、相手を血祭りにあげる悪魔の魔法戦士。`,kind:"Monster"},サターナ:{name:"サターナ",nameKana:"",description:"敵を呪い、動きを止めることができる魔法使い。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:700,defense:600,attribute:"Dark",type:"Spellcaster",wikiName:"《サターナ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%BF%A1%BC%A5%CA%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/魔法使い族/攻 700/守 600
敵を呪い、動きを止めることができる魔法使い。`,kind:"Monster"},サファイアドラゴン:{name:"サファイアドラゴン",nameKana:"",description:`全身がサファイアに覆われた、非常に美しい姿をしたドラゴン。
争いは好まないが、とても高い攻撃力を備えている。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1900,defense:1600,attribute:"Wind",type:"Dragon",wikiName:"《サファイアドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%D5%A5%A1%A5%A4%A5%A2%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/ドラゴン族/攻1900/守1600
全身がサファイアに覆われた、非常に美しい姿をしたドラゴン。
争いは好まないが、とても高い攻撃力を備えている。`,kind:"Monster"},"サファイヤ・リサーク":{name:"サファイヤ・リサーク",nameKana:"",description:`サファイヤの眼を持つけもの。
幻影を見せ、混乱したところを攻撃。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1300,attribute:"Earth",type:"Beast",wikiName:"《サファイヤ・リサーク》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%D5%A5%A1%A5%A4%A5%E4%A1%A6%A5%EA%A5%B5%A1%BC%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣族/攻1300/守1300
サファイヤの眼を持つけもの。
幻影を見せ、混乱したところを攻撃。`,kind:"Monster"},"サプレス・コライダー":{name:"サプレス・コライダー",nameKana:"",description:`ネットワーク世界の巨悪と戦う熟練の闘士。
その鉄槌に圧縮されたデータは、誰にも復元できない。`,cardType:"Monster",monsterCategories:["Normal"],level:8,attack:2800,defense:2600,attribute:"Dark",type:"Cyberse",wikiName:"《サプレス・コライダー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%D7%A5%EC%A5%B9%A1%A6%A5%B3%A5%E9%A5%A4%A5%C0%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星８/闇属性/サイバース族/攻2800/守2600
ネットワーク世界の巨悪と戦う熟練の闘士。
その鉄槌に圧縮されたデータは、誰にも復元できない。`,kind:"Monster"},"サンダー・キッズ":{name:"サンダー・キッズ",nameKana:"",description:`雷をからだの中に蓄電させている。
泣かせたときは危険。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:700,defense:600,attribute:"Wind",type:"Thunder",wikiName:"《サンダー・キッズ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%F3%A5%C0%A1%BC%A1%A6%A5%AD%A5%C3%A5%BA%A1%D5",wikiTextAll:`通常モンスター
星２/風属性/雷族/攻 700/守 600
雷をからだの中に蓄電させている。
泣かせたときは危険。`,kind:"Monster"},"サンド・ストーン":{name:"サンド・ストーン",nameKana:"",description:"地下から突然目の前に現れ、触手で攻撃してくる。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1300,defense:1600,attribute:"Earth",type:"Rock",wikiName:"《サンド・ストーン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%F3%A5%C9%A1%A6%A5%B9%A5%C8%A1%BC%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/岩石族/攻1300/守1600
地下から突然目の前に現れ、触手で攻撃してくる。`,kind:"Monster"},ザリガン:{name:"ザリガン",nameKana:"",description:`ザリガニが進化したモンスター。
大きなハサミで相手の首を狙う。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:600,defense:700,attribute:"Water",type:"Aqua",wikiName:"《ザリガン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B6%A5%EA%A5%AC%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星２/水属性/水族/攻 600/守 700
ザリガニが進化したモンスター。
大きなハサミで相手の首を狙う。`,kind:"Monster"},シーカーメン:{name:"シーカーメン",nameKana:"",description:"鋭いかぎづめで相手を切り裂く、残忍なモンスター。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1100,defense:1300,attribute:"Water",type:"Aqua",wikiName:"《シーカーメン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B7%A1%BC%A5%AB%A1%BC%A5%E1%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1100/守1300
鋭いかぎづめで相手を切り裂く、残忍なモンスター。`,kind:"Monster"},シーザリオン:{name:"シーザリオン",nameKana:"",description:`海中に住むヘビのモンスター。
近づくものに噛みついてくる。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,defense:800,attribute:"Water",type:"Aqua",wikiName:"《シーザリオン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B7%A1%BC%A5%B6%A5%EA%A5%AA%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1800/守 800
海中に住むヘビのモンスター。
近づくものに噛みついてくる。`,kind:"Monster"},シーホース:{name:"シーホース",nameKana:"",description:`ウマとサカナの体を持つモンスター。
海中を風のように駆け抜ける。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1350,defense:1600,attribute:"Earth",type:"Beast",wikiName:"《シーホース》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B7%A1%BC%A5%DB%A1%BC%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/獣族/攻1350/守1600
ウマとサカナの体を持つモンスター。
海中を風のように駆け抜ける。`,kind:"Monster"},"シェイプ・スナッチ":{name:"シェイプ・スナッチ",nameKana:"",description:`恐ろしい力を持つ蝶ネクタイ。
何者かの身体を支配して襲いかかる。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1200,defense:1700,attribute:"Dark",type:"Machine",wikiName:"《シェイプ・スナッチ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B7%A5%A7%A5%A4%A5%D7%A1%A6%A5%B9%A5%CA%A5%C3%A5%C1%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/機械族/攻1200/守1700
恐ろしい力を持つ蝶ネクタイ。
何者かの身体を支配して襲いかかる。`,kind:"Monster"},"シャイン・アビス":{name:"シャイン・アビス",nameKana:"",description:"光の力と闇の力を兼ね備えているモンスター。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1800,attribute:"Light",type:"Fairy",wikiName:"《シャイン・アビス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B7%A5%E3%A5%A4%A5%F3%A1%A6%A5%A2%A5%D3%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/天使族/攻1600/守1800 
光の力と闇の力を兼ね備えているモンスター。`,kind:"Monster"},"シャドウ・ファイター":{name:"シャドウ・ファイター",nameKana:"",description:`実体と影に分かれて襲ってくる。
油断すると挟まれるぞ。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:800,defense:600,attribute:"Dark",type:"Warrior",wikiName:"《シャドウ・ファイター》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B7%A5%E3%A5%C9%A5%A6%A1%A6%A5%D5%A5%A1%A5%A4%A5%BF%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/戦士族/攻 800/守 600
実体と影に分かれて襲ってくる。
油断すると挟まれるぞ。`,kind:"Monster"},"シャベル・クラッシャー":{name:"シャベル・クラッシャー",nameKana:"",description:"何でも破壊してしまう、両手の大きなシャベルには要注意。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:1200,attribute:"Earth",type:"Machine",wikiName:"《シャベル・クラッシャー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B7%A5%E3%A5%D9%A5%EB%A1%A6%A5%AF%A5%E9%A5%C3%A5%B7%A5%E3%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/機械族/攻 900/守1200
何でも破壊してしまう、両手の大きなシャベルには要注意。`,kind:"Monster"},"シルバー・フォング":{name:"シルバー・フォング",nameKana:"",description:`白銀に輝くオオカミ。
見た目は美しいが、性格は凶暴。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:800,attribute:"Earth",type:"Beast",wikiName:"《シルバー・フォング》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B7%A5%EB%A5%D0%A1%BC%A1%A6%A5%D5%A5%A9%A5%F3%A5%B0%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/獣族/攻1200/守 800
白銀に輝くオオカミ。
見た目は美しいが、性格は凶暴。`,kind:"Monster"},"ジェネクス・コントローラー":{name:"ジェネクス・コントローラー",nameKana:"",description:`仲間達と心を通わせる事ができる、数少ないジェネクスのひとり。
様々なエレメントの力をコントロールできるぞ。`,cardType:"Monster",monsterCategories:["Normal","Tuner"],level:3,attack:1400,defense:1200,attribute:"Dark",type:"Machine",wikiName:"《ジェネクス・コントローラー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B8%A5%A7%A5%CD%A5%AF%A5%B9%A1%A6%A5%B3%A5%F3%A5%C8%A5%ED%A1%BC%A5%E9%A1%BC%A1%D5",wikiTextAll:`チューナー・通常モンスター
星３/闇属性/機械族/攻1400/守1200
仲間達と心を通わせる事ができる、数少ないジェネクスのひとり。
様々なエレメントの力をコントロールできるぞ。`,kind:"Monster",nameTags:["ジェネクス"]},"ジェネティック・ワーウルフ":{name:"ジェネティック・ワーウルフ",nameKana:"",description:`遺伝子操作により強化された人狼。
本来の優しき心は完全に破壊され、
闘う事でしか生きる事ができない体になってしまった。
その破壊力は計り知れない。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:2e3,defense:100,attribute:"Earth",type:"BeastWarrior",wikiName:"《ジェネティック・ワーウルフ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B8%A5%A7%A5%CD%A5%C6%A5%A3%A5%C3%A5%AF%A1%A6%A5%EF%A1%BC%A5%A6%A5%EB%A5%D5%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣戦士族/攻2000/守 100
遺伝子操作により強化された人狼。
本来の優しき心は完全に破壊され、
闘う事でしか生きる事ができない体になってしまった。
その破壊力は計り知れない。`,kind:"Monster"},ジェノサイドキングサーモン:{name:"ジェノサイドキングサーモン",nameKana:"",description:`暗黒海の主として恐れられている巨大なシャケ。
その卵は暗黒界一の美味として知られている。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:2400,defense:1e3,attribute:"Water",type:"Fish",wikiName:"《ジェノサイドキングサーモン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B8%A5%A7%A5%CE%A5%B5%A5%A4%A5%C9%A5%AD%A5%F3%A5%B0%A5%B5%A1%BC%A5%E2%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星５/水属性/魚族/攻2400/守1000
暗黒海の主として恐れられている巨大なシャケ。
その卵は暗黒界一の美味として知られている。`,kind:"Monster"},"ジェムナイト・ガネット":{name:"ジェムナイト・ガネット",nameKana:"",description:`ガーネットの力を宿すジェムナイトの戦士。
炎の鉄拳はあらゆる敵を粉砕するぞ。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1900,attribute:"Earth",type:"Pyro",wikiName:"《ジェムナイト・ガネット》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B8%A5%A7%A5%E0%A5%CA%A5%A4%A5%C8%A1%A6%A5%AC%A5%CD%A5%C3%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/炎族/攻1900/守   0
ガーネットの力を宿すジェムナイトの戦士。
炎の鉄拳はあらゆる敵を粉砕するぞ。`,kind:"Monster",defense:0},"ジェムナイト・クリスタ":{name:"ジェムナイト・クリスタ",nameKana:"",description:`クリスタルパワーを最適化し、戦闘力に変えて戦うジェムナイトの上級戦士。
その高い攻撃力で敵を圧倒するぞ。
しかし、その最適化には限界を感じる事も多く、仲間たちとの結束を大切にしている。`,cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2450,defense:1950,attribute:"Earth",type:"Rock",wikiName:"《ジェムナイト・クリスタ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B8%A5%A7%A5%E0%A5%CA%A5%A4%A5%C8%A1%A6%A5%AF%A5%EA%A5%B9%A5%BF%A1%D5",wikiTextAll:`通常モンスター
星７/地属性/岩石族/攻2450/守1950
クリスタルパワーを最適化し、戦闘力に変えて戦うジェムナイトの上級戦士。
その高い攻撃力で敵を圧倒するぞ。
しかし、その最適化には限界を感じる事も多く、仲間たちとの結束を大切にしている。`,kind:"Monster"},"ジェムナイト・サフィア":{name:"ジェムナイト・サフィア",nameKana:"",description:`サファイアのパワーで水を自在に操り、
敵からの攻撃をやさしく包み込んでしまう。
その静かなる守りは仲間から信頼されているらしい。`,cardType:"Monster",monsterCategories:["Normal"],level:4,defense:2100,attribute:"Earth",type:"Aqua",wikiName:"《ジェムナイト・サフィア》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B8%A5%A7%A5%E0%A5%CA%A5%A4%A5%C8%A1%A6%A5%B5%A5%D5%A5%A3%A5%A2%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/水族/攻   0/守2100
サファイアのパワーで水を自在に操り、
敵からの攻撃をやさしく包み込んでしまう。
その静かなる守りは仲間から信頼されているらしい。`,kind:"Monster",attack:0},"ジェムナイト・ラピス":{name:"ジェムナイト・ラピス",nameKana:"",description:`仲間の健康を常に気づかう癒しの戦士。
ラズリーとは大の仲良しだ。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:100,attribute:"Earth",type:"Rock",wikiName:"《ジェムナイト・ラピス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B8%A5%A7%A5%E0%A5%CA%A5%A4%A5%C8%A1%A6%A5%E9%A5%D4%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/岩石族/攻1200/守 100
仲間の健康を常に気づかう癒しの戦士。
ラズリーとは大の仲良しだ。`,kind:"Monster"},"ジェムナイト・ルマリン":{name:"ジェムナイト・ルマリン",nameKana:"",description:`イエロートルマリンの力で不思議なエナジーを創りだし、
戦力に変えて闘うぞ。
彼の刺激的な生き方に共感するジェムは多い。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1800,attribute:"Earth",type:"Thunder",wikiName:"《ジェムナイト・ルマリン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B8%A5%A7%A5%E0%A5%CA%A5%A4%A5%C8%A1%A6%A5%EB%A5%DE%A5%EA%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/雷族/攻1600/守1800
イエロートルマリンの力で不思議なエナジーを創りだし、
戦力に変えて闘うぞ。
彼の刺激的な生き方に共感するジェムは多い。`,kind:"Monster"},ジェリービーンズマン:{name:"ジェリービーンズマン",nameKana:"",description:`ジェリーという名の豆戦士。
自分が世界最強の戦士だと信じ込んでいるが、その実力は定かではない。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1750,attribute:"Earth",type:"Plant",wikiName:"《ジェリービーンズマン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B8%A5%A7%A5%EA%A1%BC%A5%D3%A1%BC%A5%F3%A5%BA%A5%DE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/植物族/攻1750/守   0
ジェリーという名の豆戦士。
自分が世界最強の戦士だと信じ込んでいるが、その実力は定かではない。`,kind:"Monster",defense:0},ジャグラー:{name:"ジャグラー",nameKana:"",description:"手品のような魔法で敵を倒す。ハトを出して攻撃もする。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:600,defense:900,attribute:"Light",type:"Spellcaster",wikiName:"《ジャグラー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B8%A5%E3%A5%B0%A5%E9%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/光属性/魔法使い族/攻 600/守 900
手品のような魔法で敵を倒す。ハトを出して攻撃もする。`,kind:"Monster"},"ジャジメント・ザ・ハンド":{name:"ジャジメント・ザ・ハンド",nameKana:"",description:"神が宿った手で最後の審判を下し、激しい攻撃を加える。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1400,defense:700,attribute:"Earth",type:"Warrior",wikiName:"《ジャジメント・ザ・ハンド》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B8%A5%E3%A5%B8%A5%E1%A5%F3%A5%C8%A1%A6%A5%B6%A1%A6%A5%CF%A5%F3%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/戦士族/攻1400/守 700
神が宿った手で最後の審判を下し、激しい攻撃を加える。`,kind:"Monster"},"ジャックス・ナイト":{name:"ジャックス・ナイト",nameKana:"",description:`あらゆる剣術に精通した戦士。
とても正義感が強く、弱き者を守るために闘っている。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1900,defense:1e3,attribute:"Light",type:"Warrior",wikiName:"《ジャックス・ナイト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B8%A5%E3%A5%C3%A5%AF%A5%B9%A1%A6%A5%CA%A5%A4%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星５/光属性/戦士族/攻1900/守1000
あらゆる剣術に精通した戦士。
とても正義感が強く、弱き者を守るために闘っている。`,kind:"Monster"},"ジャッジ・マン":{name:"ジャッジ・マン",nameKana:"",description:`勝ち負けのない勝負が嫌いな戦士。
こん棒の攻撃は強いぞ！`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2200,defense:1500,attribute:"Earth",type:"Warrior",wikiName:"《ジャッジ・マン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B8%A5%E3%A5%C3%A5%B8%A1%A6%A5%DE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星６/地属性/戦士族/攻2200/守1500
勝ち負けのない勝負が嫌いな戦士。
こん棒の攻撃は強いぞ！`,kind:"Monster"},ジョングルグールの幻術師:{name:"ジョングルグールの幻術師",nameKana:"",description:`もりあげじょうずなだいどうげいにん
うたやおどりでゆだんをさそい
おかしなじゅつでこうげきしてくる
そのめがまわればきけんなあいず
いそいでにげよう！`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:2e3,attribute:"Dark",type:"Illusion",wikiName:"《ジョングルグールの幻術師》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B8%A5%E7%A5%F3%A5%B0%A5%EB%A5%B0%A1%BC%A5%EB%A4%CE%B8%B8%BD%D1%BB%D5%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/幻想魔族/攻2000/守   0
もりあげじょうずなだいどうげいにん
うたやおどりでゆだんをさそい
おかしなじゅつでこうげきしてくる
そのめがまわればきけんなあいず
いそいでにげよう！`,kind:"Monster",defense:0},"スカイ・ハンター":{name:"スカイ・ハンター",nameKana:"",description:"羽に隠し持っているナイフを空から降らせて攻撃する。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1550,defense:1200,attribute:"Wind",type:"WingedBeast",wikiName:"《スカイ・ハンター》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%AB%A5%A4%A1%A6%A5%CF%A5%F3%A5%BF%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/鳥獣族/攻1550/守1200
羽に隠し持っているナイフを空から降らせて攻撃する。`,kind:"Monster"},スカゴブリン:{name:"スカゴブリン",nameKana:"",description:`完璧な「スカ」の文字を極めるため、日々精進するゴブリン。
その全てを一筆に注ぐ。`,cardType:"Monster",monsterCategories:["Normal"],level:1,attack:400,defense:400,attribute:"Dark",type:"Fiend",wikiName:"《スカゴブリン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%AB%A5%B4%A5%D6%A5%EA%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星１/闇属性/悪魔族/攻 400/守 400
完璧な「スカ」の文字を極めるため、日々精進するゴブリン。
その全てを一筆に注ぐ。`,kind:"Monster"},スコール:{name:"スコール",nameKana:"",description:"バケツをひっくり返したような大雨を、突然降らすモンスター。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1550,defense:800,attribute:"Water",type:"Aqua",wikiName:"《スコール》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%B3%A1%BC%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1550/守 800
バケツをひっくり返したような大雨を、突然降らすモンスター。`,kind:"Monster"},スティング:{name:"スティング",nameKana:"",description:"ものすごく熱い炎のかたまり。その体で体当たりしてくる。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:600,defense:500,attribute:"Fire",type:"Pyro",wikiName:"《スティング》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%C6%A5%A3%A5%F3%A5%B0%A1%D5",wikiTextAll:`通常モンスター
星２/炎属性/炎族/攻 600/守 500
ものすごく熱い炎のかたまり。その体で体当たりしてくる。`,kind:"Monster"},"ストーン・アルマジラー":{name:"ストーン・アルマジラー",nameKana:"",description:"体が石のように堅い毛で覆われており、守りがかたい。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:1200,attribute:"Earth",type:"Rock",wikiName:"《ストーン・アルマジラー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%C8%A1%BC%A5%F3%A1%A6%A5%A2%A5%EB%A5%DE%A5%B8%A5%E9%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/岩石族/攻 800/守1200
体が石のように堅い毛で覆われており、守りがかたい。`,kind:"Monster"},"ストーン・ゴースト":{name:"ストーン・ゴースト",nameKana:"",description:`怒らせると、おつむが大噴火。
岩がゴロゴロ降ってくるぞ。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1e3,attribute:"Earth",type:"Rock",wikiName:"《ストーン・ゴースト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%C8%A1%BC%A5%F3%A1%A6%A5%B4%A1%BC%A5%B9%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/岩石族/攻1200/守1000
怒らせると、おつむが大噴火。
岩がゴロゴロ降ってくるぞ。`,kind:"Monster"},"ストーン・ドラゴン":{name:"ストーン・ドラゴン",nameKana:"",description:"全身が岩でできているドラゴン。岩石の攻撃は強力だ。",cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2e3,defense:2300,attribute:"Earth",type:"Rock",wikiName:"《ストーン・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%C8%A1%BC%A5%F3%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星７/地属性/岩石族/攻2000/守2300
全身が岩でできているドラゴン。岩石の攻撃は強力だ。`,kind:"Monster"},ストーンジャイアント:{name:"ストーンジャイアント",nameKana:"",description:"巨大な岩が積み重なってできている、岩石の巨人。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1600,defense:1500,attribute:"Earth",type:"Rock",wikiName:"《ストーンジャイアント》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%C8%A1%BC%A5%F3%A5%B8%A5%E3%A5%A4%A5%A2%A5%F3%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/岩石族/攻1600/守1500
巨大な岩が積み重なってできている、岩石の巨人。`,kind:"Monster"},"スネーク・パーム":{name:"スネーク・パーム",nameKana:"",description:`多くのヘビが集まり擬態している。
近づくとバラバラになり襲いかかる。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1e3,defense:1200,attribute:"Earth",type:"Plant",wikiName:"《スネーク・パーム》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%CD%A1%BC%A5%AF%A1%A6%A5%D1%A1%BC%A5%E0%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/植物族/攻1000/守1200
多くのヘビが集まり擬態している。
近づくとバラバラになり襲いかかる。`,kind:"Monster"},"スパイク・ヘッド":{name:"スパイク・ヘッド",nameKana:"",description:`地獄の魔術師が生み出した機械兵。
両腕の鉄球で敵味方関係なしに攻撃を繰り返す。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1800,defense:1700,attribute:"Dark",type:"Machine",wikiName:"《スパイク・ヘッド》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%D1%A5%A4%A5%AF%A1%A6%A5%D8%A5%C3%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/機械族/攻1800/守1700
地獄の魔術師が生み出した機械兵。
両腕の鉄球で敵味方関係なしに攻撃を繰り返す。`,kind:"Monster"},スパイクシードラ:{name:"スパイクシードラ",nameKana:"",description:"体のトゲを相手に突き刺し、電流を流して攻撃する。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1600,defense:1300,attribute:"Water",type:"SeaSerpent",wikiName:"《スパイクシードラ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%D1%A5%A4%A5%AF%A5%B7%A1%BC%A5%C9%A5%E9%A1%D5",wikiTextAll:`通常モンスター
星５/水属性/海竜族/攻1600/守1300
体のトゲを相手に突き刺し、電流を流して攻撃する。`,kind:"Monster"},スパイラルドラゴン:{name:"スパイラルドラゴン",nameKana:"",description:`海流の渦をつくり出し人々を襲うと伝えられる海竜。
巨大なヒレから放たれるスパイラルウェーブは全てを飲み込む。`,cardType:"Monster",monsterCategories:["Normal"],level:8,attack:2900,defense:2900,attribute:"Water",type:"SeaSerpent",wikiName:"《スパイラルドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%D1%A5%A4%A5%E9%A5%EB%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星８/水属性/海竜族/攻2900/守2900
海流の渦をつくり出し人々を襲うと伝えられる海竜。
巨大なヒレから放たれるスパイラルウェーブは全てを飲み込む。`,kind:"Monster"},スピック:{name:"スピック",nameKana:"",description:"くちばしがとても大きく、大声で鳴き気の弱い相手を驚かせる。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:600,defense:500,attribute:"Wind",type:"WingedBeast",wikiName:"《スピック》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%D4%A5%C3%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星２/風属性/鳥獣族/攻 600/守 500
くちばしがとても大きく、大声で鳴き気の弱い相手を驚かせる。`,kind:"Monster"},スフィラスレディ:{name:"スフィラスレディ",nameKana:"",description:"美女と思い近づくと、首筋を噛まれ全身の血を吸われてしまう。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:400,defense:1400,attribute:"Earth",type:"Rock",wikiName:"《スフィラスレディ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%D5%A5%A3%A5%E9%A5%B9%A5%EC%A5%C7%A5%A3%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/岩石族/攻 400/守1400
美女と思い近づくと、首筋を噛まれ全身の血を吸われてしまう。`,kind:"Monster"},"スペース・オマジナイ・ウサギ":{name:"スペース・オマジナイ・ウサギ",nameKana:"",description:`天より降り立った謎の来訪者。
痛覚を信号に変換して宇宙へ送っているが、その目的は未だ不明。
――いたいのいたいのとんでけとんでけ。`,cardType:"Monster",monsterCategories:["Normal","Tuner"],level:1,defense:1500,attribute:"Light",type:"Spellcaster",wikiName:"《スペース・オマジナイ・ウサギ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%DA%A1%BC%A5%B9%A1%A6%A5%AA%A5%DE%A5%B8%A5%CA%A5%A4%A1%A6%A5%A6%A5%B5%A5%AE%A1%D5",wikiTextAll:`チューナー・通常モンスター
星１/光属性/魔法使い族/攻   0/守1500
天より降り立った謎の来訪者。
痛覚を信号に変換して宇宙へ送っているが、その目的は未だ不明。
――いたいのいたいのとんでけとんでけ。`,kind:"Monster",attack:0},スペースマンボウ:{name:"スペースマンボウ",nameKana:"",description:`広大な銀河を漂う宇宙マンボウ。
アルファード４の超文明遺跡から発見されたという生きた化石。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1700,defense:1e3,attribute:"Water",type:"Fish",wikiName:"《スペースマンボウ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%DA%A1%BC%A5%B9%A5%DE%A5%F3%A5%DC%A5%A6%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/魚族/攻1700/守1000
広大な銀河を漂う宇宙マンボウ。
アルファード４の超文明遺跡から発見されたという生きた化石。`,kind:"Monster"},スリーピィ:{name:"スリーピィ",nameKana:"",description:"しっぽの長いひつじ。しっぽを使い催眠術をかけ、睡魔を誘う。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:1e3,attribute:"Earth",type:"Beast",wikiName:"《スリーピィ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%EA%A1%BC%A5%D4%A5%A3%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/獣族/攻 800/守1000
しっぽの長いひつじ。しっぽを使い催眠術をかけ、睡魔を誘う。`,kind:"Monster"},"スロットマシーンＡＭ－７":{name:"スロットマシーンＡＭ－７",nameKana:"",description:"スロットに揃う数で能力を変化させる事ができるという機械。",cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2e3,defense:2300,attribute:"Dark",type:"Machine",wikiName:"《スロットマシーンＡＭ－７》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%ED%A5%C3%A5%C8%A5%DE%A5%B7%A1%BC%A5%F3%A3%C1%A3%CD%A1%DD%A3%B7%A1%D5",wikiTextAll:`通常モンスター
星７/闇属性/機械族/攻2000/守2300
スロットに揃う数で能力を変化させる事ができるという機械。`,kind:"Monster"},セイバーザウルス:{name:"セイバーザウルス",nameKana:"",description:`おとなしい性格で有名な恐竜。
大草原の小さな巣でのんびりと過ごすのが好きという。怒ると怖い。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1900,defense:500,attribute:"Earth",type:"Dinosaur",wikiName:"《セイバーザウルス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BB%A5%A4%A5%D0%A1%BC%A5%B6%A5%A6%A5%EB%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/恐竜族/攻1900/守 500
おとなしい性格で有名な恐竜。
大草原の小さな巣でのんびりと過ごすのが好きという。怒ると怖い。`,kind:"Monster"},セイレーン:{name:"セイレーン",nameKana:"",description:"風を操り突風をまきおこし、ありとあらゆる物を吹き飛ばす。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1600,defense:1500,attribute:"Light",type:"Spellcaster",wikiName:"《セイレーン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BB%A5%A4%A5%EC%A1%BC%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星５/光属性/魔法使い族/攻1600/守1500
風を操り突風をまきおこし、ありとあらゆる物を吹き飛ばす。`,kind:"Monster"},"セイント・バード":{name:"セイント・バード",nameKana:"",description:"非常に尾の長い鳥。全身から聖なる光を発する。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1100,attribute:"Wind",type:"WingedBeast",wikiName:"《セイント・バード》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BB%A5%A4%A5%F3%A5%C8%A1%A6%A5%D0%A1%BC%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/鳥獣族/攻1500/守1100
非常に尾の長い鳥。全身から聖なる光を発する。`,kind:"Monster"},ゼミアの神:{name:"ゼミアの神",nameKana:"",description:"相手をだまして、破滅の道へと誘うことを得意とする邪神。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1e3,attribute:"Dark",type:"Fiend",wikiName:"《ゼミアの神》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BC%A5%DF%A5%A2%A4%CE%BF%C0%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1300/守1000
相手をだまして、破滅の道へと誘うことを得意とする邪神。`,kind:"Monster"},ゼラの戦士:{name:"ゼラの戦士",nameKana:"",description:`大天使の力を手に入れる事ができるという聖域を探し求める戦士。
邪悪な魔族からの誘惑から逃れるため、孤独な闘いの日々を送る。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1600,attribute:"Earth",type:"Warrior",wikiName:"《ゼラの戦士》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BC%A5%E9%A4%CE%C0%EF%BB%CE%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/戦士族/攻1600/守1600
大天使の力を手に入れる事ができるという聖域を探し求める戦士。
邪悪な魔族からの誘惑から逃れるため、孤独な闘いの日々を送る。`,kind:"Monster"},ソイツ:{name:"ソイツ",nameKana:"",description:"かなり頼りない姿をしているが、実はとてつもない潜在能力を隠し持っていると思っているらしい。",cardType:"Monster",monsterCategories:["Normal"],level:3,attribute:"Wind",type:"Fairy",wikiName:"《ソイツ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BD%A5%A4%A5%C4%A1%D5",wikiTextAll:`通常モンスター
星３/風属性/天使族/攻   0/守   0
かなり頼りない姿をしているが、実はとてつもない潜在能力を隠し持っていると思っているらしい。`,kind:"Monster",defense:0,attack:0},ソリテュード:{name:"ソリテュード",nameKana:"",description:"下半身がシカで、魂を吸うという大カマを持った獣戦士。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1050,defense:1e3,attribute:"Earth",type:"BeastWarrior",wikiName:"《ソリテュード》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BD%A5%EA%A5%C6%A5%E5%A1%BC%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/獣戦士族/攻1050/守1000
下半身がシカで、魂を吸うという大カマを持った獣戦士。`,kind:"Monster"},ゾンビーノ:{name:"ゾンビーノ",nameKana:"",description:`ふたりは　とってもなかよし
しんでもいっしょ　よみがえってもいっしょ
はなれることはない

だから　ふたりがであうことは　もうにどとない`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:2e3,attribute:"Earth",type:"Zombie",wikiName:"《ゾンビーノ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BE%A5%F3%A5%D3%A1%BC%A5%CE%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/アンデット族/攻2000/守   0
ふたりは　とってもなかよし
しんでもいっしょ　よみがえってもいっしょ
はなれることはない

だから　ふたりがであうことは　もうにどとない`,kind:"Monster",defense:0},ゾンビランプ:{name:"ゾンビランプ",nameKana:"",description:"腕をロケットのように飛ばして攻撃する、アンデットモンスター。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:500,defense:400,attribute:"Dark",type:"Zombie",wikiName:"《ゾンビランプ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BE%A5%F3%A5%D3%A5%E9%A5%F3%A5%D7%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/アンデット族/攻 500/守 400
腕をロケットのように飛ばして攻撃する、アンデットモンスター。`,kind:"Monster"},"タートル・タイガー":{name:"タートル・タイガー",nameKana:"",description:`甲羅を持ったトラ。
堅い甲羅で身を守り、鋭いキバで攻撃する。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1e3,defense:1500,attribute:"Water",type:"Aqua",wikiName:"《タートル・タイガー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BF%A1%BC%A5%C8%A5%EB%A1%A6%A5%BF%A5%A4%A5%AC%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1000/守1500
甲羅を持ったトラ。
堅い甲羅で身を守り、鋭いキバで攻撃する。`,kind:"Monster"},"タートル・バード":{name:"タートル・バード",nameKana:"",description:"主に水中に生息しているが、空を飛ぶこともできる珍しいカメ。",cardType:"Monster",monsterCategories:["Normal"],level:6,attack:1900,defense:1700,attribute:"Water",type:"Aqua",wikiName:"《タートル・バード》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BF%A1%BC%A5%C8%A5%EB%A1%A6%A5%D0%A1%BC%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星６/水属性/水族/攻1900/守1700
主に水中に生息しているが、空を飛ぶこともできる珍しいカメ。`,kind:"Monster"},"タートル・狸":{name:"タートル・狸",nameKana:"",description:"カメの甲羅を背負ったタヌキ。相手を化かして攻撃する。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:700,defense:900,attribute:"Water",type:"Aqua",wikiName:"《タートル・狸》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BF%A1%BC%A5%C8%A5%EB%A1%A6%C3%AC%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻 700/守 900
カメの甲羅を背負ったタヌキ。相手を化かして攻撃する。`,kind:"Monster"},"タイガー・アックス":{name:"タイガー・アックス",nameKana:"",description:`オノを手にした獣戦士。
素早い動きからくり出す攻撃は強い。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1100,attribute:"Earth",type:"BeastWarrior",wikiName:"《タイガー・アックス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BF%A5%A4%A5%AC%A1%BC%A1%A6%A5%A2%A5%C3%A5%AF%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣戦士族/攻1300/守1100
オノを手にした獣戦士。
素早い動きからくり出す攻撃は強い。`,kind:"Monster"},タイホーン:{name:"タイホーン",nameKana:"",description:"口から砲弾を撃ちだし遠くを攻撃。山での砲撃は強い。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1400,attribute:"Wind",type:"WingedBeast",wikiName:"《タイホーン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BF%A5%A4%A5%DB%A1%BC%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/鳥獣族/攻1200/守1400
口から砲弾を撃ちだし遠くを攻撃。山での砲撃は強い。`,kind:"Monster"},タクヒ:{name:"タクヒ",nameKana:"",description:"このトリが現れた時は、何か不吉な事が起こる前ぶれ。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1450,defense:1e3,attribute:"Wind",type:"WingedBeast",wikiName:"《タクヒ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BF%A5%AF%A5%D2%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/鳥獣族/攻1450/守1000
このトリが現れた時は、何か不吉な事が起こる前ぶれ。`,kind:"Monster"},タクリミノス:{name:"タクリミノス",nameKana:"",description:"体にヒレを持ち、水中でも自由に動ける海竜の仲間。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1200,attribute:"Water",type:"SeaSerpent",wikiName:"《タクリミノス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BF%A5%AF%A5%EA%A5%DF%A5%CE%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/海竜族/攻1500/守1200
体にヒレを持ち、水中でも自由に動ける海竜の仲間。`,kind:"Monster"},"タルワール・デーモン":{name:"タルワール・デーモン",nameKana:"",description:"そのタルワールは、悪魔族でも剣術の達人しか持つ事を許されていない。",cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2400,defense:2150,attribute:"Dark",type:"Fiend",wikiName:"《タルワール・デーモン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BF%A5%EB%A5%EF%A1%BC%A5%EB%A1%A6%A5%C7%A1%BC%A5%E2%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星６/闇属性/悪魔族/攻2400/守2150
そのタルワールは、悪魔族でも剣術の達人しか持つ事を許されていない。`,kind:"Monster"},"ダーク・キメラ":{name:"ダーク・キメラ",nameKana:"",description:`魔界に生息するモンスター。
闇の炎をはき攻撃する。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1610,defense:1460,attribute:"Dark",type:"Fiend",wikiName:"《ダーク・キメラ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C0%A1%BC%A5%AF%A1%A6%A5%AD%A5%E1%A5%E9%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/悪魔族/攻1610/守1460
魔界に生息するモンスター。
闇の炎をはき攻撃する。`,kind:"Monster"},"ダーク・グレイ":{name:"ダーク・グレイ",nameKana:"",description:`からだが灰色のけもの。
あまり見かけない貴重ないきもの。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:900,attribute:"Earth",type:"Beast",wikiName:"《ダーク・グレイ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C0%A1%BC%A5%AF%A1%A6%A5%B0%A5%EC%A5%A4%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/獣族/攻 800/守 900
からだが灰色のけもの。
あまり見かけない貴重ないきもの。`,kind:"Monster"},"ダーク・プラント":{name:"ダーク・プラント",nameKana:"",description:"汚染された土と闇の力で育てられた花。とても凶暴。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:300,defense:400,attribute:"Dark",type:"Plant",wikiName:"《ダーク・プラント》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C0%A1%BC%A5%AF%A1%A6%A5%D7%A5%E9%A5%F3%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星１/闇属性/植物族/攻 300/守 400
汚染された土と闇の力で育てられた花。とても凶暴。`,kind:"Monster"},"ダーク・プリズナー":{name:"ダーク・プリズナー",nameKana:"",description:"光の反射を巧みに操り、自分の姿を隠すことができる。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:600,defense:1e3,attribute:"Dark",type:"Fiend",wikiName:"《ダーク・プリズナー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C0%A1%BC%A5%AF%A1%A6%A5%D7%A5%EA%A5%BA%A5%CA%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/悪魔族/攻 600/守1000
光の反射を巧みに操り、自分の姿を隠すことができる。`,kind:"Monster"},"ダーク・ラビット":{name:"ダーク・ラビット",nameKana:"",description:`アメリカンコミックの世界のウサギ。
とても素早くちょこまかと動く。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1100,defense:1500,attribute:"Dark",type:"Beast",wikiName:"《ダーク・ラビット》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C0%A1%BC%A5%AF%A1%A6%A5%E9%A5%D3%A5%C3%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/獣族/攻1100/守1500
アメリカンコミックの世界のウサギ。
とても素早くちょこまかと動く。`,kind:"Monster"},ダークキラー:{name:"ダークキラー",nameKana:"",description:"カマのように発達した腕を振り回し攻撃してくる。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:700,defense:700,attribute:"Earth",type:"Insect",wikiName:"《ダークキラー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C0%A1%BC%A5%AF%A5%AD%A5%E9%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/昆虫族/攻 700/守 700
カマのように発達した腕を振り回し攻撃してくる。`,kind:"Monster"},ダークシェイド:{name:"ダークシェイド",nameKana:"",description:"クリスタルから強烈な光を発して攻撃する。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:1e3,attribute:"Wind",type:"Fiend",wikiName:"《ダークシェイド》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C0%A1%BC%A5%AF%A5%B7%A5%A7%A5%A4%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星３/風属性/悪魔族/攻1000/守1000
クリスタルから強烈な光を発して攻撃する。`,kind:"Monster"},ダークバット:{name:"ダークバット",nameKana:"",description:"念波で敵を探し出す闇世界のコウモリ。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:1e3,attribute:"Wind",type:"WingedBeast",wikiName:"《ダークバット》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C0%A1%BC%A5%AF%A5%D0%A5%C3%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星３/風属性/鳥獣族/攻1000/守1000
念波で敵を探し出す闇世界のコウモリ。`,kind:"Monster"},"ダイス・アルマジロ":{name:"ダイス・アルマジロ",nameKana:"",description:"体を丸めると、サイコロのような形になるアルマジロ。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1650,defense:1800,attribute:"Earth",type:"Machine",wikiName:"《ダイス・アルマジロ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C0%A5%A4%A5%B9%A1%A6%A5%A2%A5%EB%A5%DE%A5%B8%A5%ED%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/機械族/攻1650/守1800
体を丸めると、サイコロのような形になるアルマジロ。`,kind:"Monster"},"ダイヤモンド・ドラゴン":{name:"ダイヤモンド・ドラゴン",nameKana:"",description:`全身がダイヤモンドでできたドラゴン。
まばゆい光で敵の目をくらませる。`,cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2100,defense:2800,attribute:"Light",type:"Dragon",wikiName:"《ダイヤモンド・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C0%A5%A4%A5%E4%A5%E2%A5%F3%A5%C9%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星７/光属性/ドラゴン族/攻2100/守2800
全身がダイヤモンドでできたドラゴン。
まばゆい光で敵の目をくらませる。`,kind:"Monster"},"ダンシング・エルフ":{name:"ダンシング・エルフ",nameKana:"",description:`音楽に合わせ天を舞うエルフ。
体の羽は、鋭利な刃物。`,cardType:"Monster",monsterCategories:["Normal"],level:1,attack:300,defense:200,attribute:"Wind",type:"Fairy",wikiName:"《ダンシング・エルフ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C0%A5%F3%A5%B7%A5%F3%A5%B0%A1%A6%A5%A8%A5%EB%A5%D5%A1%D5",wikiTextAll:`通常モンスター
星１/風属性/天使族/攻 300/守 200
音楽に合わせ天を舞うエルフ。
体の羽は、鋭利な刃物。`,kind:"Monster"},"ダンジョン・ワーム":{name:"ダンジョン・ワーム",nameKana:"",description:"迷路の地下に潜み、上を通る者を大きな口で丸飲みにする。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1800,defense:1500,attribute:"Earth",type:"Insect",wikiName:"《ダンジョン・ワーム》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C0%A5%F3%A5%B8%A5%E7%A5%F3%A1%A6%A5%EF%A1%BC%A5%E0%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/昆虫族/攻1800/守1500
迷路の地下に潜み、上を通る者を大きな口で丸飲みにする。`,kind:"Monster"},"チェンジ・スライム":{name:"チェンジ・スライム",nameKana:"",description:"形を自由に変え、様々なものに変身するスライム。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:400,defense:300,attribute:"Water",type:"Aqua",wikiName:"《チェンジ・スライム》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C1%A5%A7%A5%F3%A5%B8%A1%A6%A5%B9%A5%E9%A5%A4%A5%E0%A1%D5",wikiTextAll:`通常モンスター
星１/水属性/水族/攻 400/守 300
形を自由に変え、様々なものに変身するスライム。`,kind:"Monster"},"チューン・ウォリアー":{name:"チューン・ウォリアー",nameKana:"",description:`あらゆるものをチューニングしてしまう電波系戦士。
常にアンテナを張ってはいるものの、感度はそう高くない。`,cardType:"Monster",monsterCategories:["Normal","Tuner"],level:3,attack:1600,defense:200,attribute:"Earth",type:"Warrior",wikiName:"《チューン・ウォリアー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C1%A5%E5%A1%BC%A5%F3%A1%A6%A5%A6%A5%A9%A5%EA%A5%A2%A1%BC%A1%D5",wikiTextAll:`チューナー（通常モンスター）
星３/地属性/戦士族/攻1600/守 200
あらゆるものをチューニングしてしまう電波系戦士。
常にアンテナを張ってはいるものの、感度はそう高くない。`,kind:"Monster"},"ヂェミナイ・エルフ":{name:"ヂェミナイ・エルフ",nameKana:"",description:"交互に攻撃を仕掛けてくる、エルフの双子姉妹。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1900,defense:900,attribute:"Earth",type:"Spellcaster",wikiName:"《ヂェミナイ・エルフ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C2%A5%A7%A5%DF%A5%CA%A5%A4%A1%A6%A5%A8%A5%EB%A5%D5%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/魔法使い族/攻1900/守 900
交互に攻撃を仕掛けてくる、エルフの双子姉妹。`,kind:"Monster"},ツインテール:{name:"ツインテール",nameKana:"",description:"ムチのようなしっぽ２本を振り回し攻撃する、水中生物。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:850,defense:700,attribute:"Water",type:"Aqua",wikiName:"《ツインテール》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C4%A5%A4%A5%F3%A5%C6%A1%BC%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻 850/守 700
ムチのようなしっぽ２本を振り回し攻撃する、水中生物。`,kind:"Monster"},ツルプルン:{name:"ツルプルン",nameKana:"",description:`一つ目の奇妙なモンスター。
手にするもりで、相手をひと突き。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:450,defense:500,attribute:"Water",type:"Aqua",wikiName:"《ツルプルン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C4%A5%EB%A5%D7%A5%EB%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星２/水属性/水族/攻 450/守 500
一つ目の奇妙なモンスター。
手にするもりで、相手をひと突き。`,kind:"Monster"},ツンドラの大蠍:{name:"ツンドラの大蠍",nameKana:"",description:"砂漠ではなく、ツンドラに分布する珍しい真っ青なサソリ。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1100,defense:1e3,attribute:"Earth",type:"Insect",wikiName:"《ツンドラの大蠍》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C4%A5%F3%A5%C9%A5%E9%A4%CE%C2%E7%EA%B8%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/昆虫族/攻1100/守1000
砂漠ではなく、ツンドラに分布する珍しい真っ青なサソリ。`,kind:"Monster"},"テンタクル・プラント":{name:"テンタクル・プラント",nameKana:"",description:"近くに動く者がいると、青いつるを伸ばして攻撃してくる。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:500,defense:600,attribute:"Water",type:"Plant",wikiName:"《テンタクル・プラント》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C6%A5%F3%A5%BF%A5%AF%A5%EB%A1%A6%A5%D7%A5%E9%A5%F3%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星２/水属性/植物族/攻 500/守 600
近くに動く者がいると、青いつるを伸ばして攻撃してくる。`,kind:"Monster"},テンダネス:{name:"テンダネス",nameKana:"",description:"恋人たちの永遠を祝福する、かわいらしい天使。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:700,defense:1400,attribute:"Light",type:"Fairy",wikiName:"《テンダネス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C6%A5%F3%A5%C0%A5%CD%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星３/光属性/天使族/攻 700/守1400
恋人たちの永遠を祝福する、かわいらしい天使。`,kind:"Monster"},"デーモン・ソルジャー":{name:"デーモン・ソルジャー",nameKana:"",description:`デーモンの中でも精鋭だけを集めた部隊に所属する戦闘のエキスパート。
与えられた任務を確実にこなす事で有名。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1900,defense:1500,attribute:"Dark",type:"Fiend",wikiName:"《デーモン・ソルジャー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A1%BC%A5%E2%A5%F3%A1%A6%A5%BD%A5%EB%A5%B8%A5%E3%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1900/守1500
デーモンの中でも精鋭だけを集めた部隊に所属する戦闘のエキスパート。
与えられた任務を確実にこなす事で有名。`,kind:"Monster"},"デーモン・ビーバー":{name:"デーモン・ビーバー",nameKana:"",description:`悪魔のツノと翼を持つビーバー。
どんぐりを投げつけて攻撃する。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:400,defense:600,attribute:"Earth",type:"Beast",wikiName:"《デーモン・ビーバー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A1%BC%A5%E2%A5%F3%A1%A6%A5%D3%A1%BC%A5%D0%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/獣族/攻 400/守 600
悪魔のツノと翼を持つビーバー。
どんぐりを投げつけて攻撃する。`,kind:"Monster"},デーモンの召喚:{name:"デーモンの召喚",nameKana:"",description:`闇の力を使い、人の心を惑わすデーモン。
悪魔族ではかなり強力な力を誇る。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2500,defense:1200,attribute:"Dark",type:"Fiend",wikiName:"《デーモンの召喚》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A1%BC%A5%E2%A5%F3%A4%CE%BE%A4%B4%AD%A1%D5",wikiTextAll:`通常モンスター
星６/闇属性/悪魔族/攻2500/守1200
闇の力を使い、人の心を惑わすデーモン。
悪魔族ではかなり強力な力を誇る。`,kind:"Monster"},"ディスク・マジシャン":{name:"ディスク・マジシャン",nameKana:"",description:"自らを円盤の中に封印し、攻撃をするとき実体を出す。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1350,defense:1e3,attribute:"Dark",type:"Machine",wikiName:"《ディスク・マジシャン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A5%A3%A5%B9%A5%AF%A1%A6%A5%DE%A5%B8%A5%B7%A5%E3%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/機械族/攻1350/守1000
自らを円盤の中に封印し、攻撃をするとき実体を出す。`,kind:"Monster"},"ディッグ・ビーク":{name:"ディッグ・ビーク",nameKana:"",description:"ヘビのように長い体をまるめ、回転しながらくちばしで攻撃。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:500,defense:800,attribute:"Earth",type:"Beast",wikiName:"《ディッグ・ビーク》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A5%A3%A5%C3%A5%B0%A1%A6%A5%D3%A1%BC%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/獣族/攻 500/守 800
ヘビのように長い体をまるめ、回転しながらくちばしで攻撃。`,kind:"Monster"},デジトロン:{name:"デジトロン",nameKana:"",description:`電子空間で見つけた亜種。
その情報量は心なしか少し多い。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:1500,attribute:"Earth",type:"Cyberse",wikiName:"《デジトロン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A5%B8%A5%C8%A5%ED%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/サイバース族/攻1500/守   0 
電子空間で見つけた亜種。
その情報量は心なしか少し多い。`,kind:"Monster",defense:0},"デス・ストーカー":{name:"デス・ストーカー",nameKana:"",description:"素早く動き、相手をはさみで捕らえ毒針を刺すサソリ戦士。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:800,attribute:"Dark",type:"Warrior",wikiName:"《デス・ストーカー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A5%B9%A1%A6%A5%B9%A5%C8%A1%BC%A5%AB%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/戦士族/攻 900/守 800
素早く動き、相手をはさみで捕らえ毒針を刺すサソリ戦士。`,kind:"Monster"},"デス・ソーサラー":{name:"デス・ソーサラー",nameKana:"",description:`死の魔法が得意な魔法使い。
闇と契約している。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1450,defense:1200,attribute:"Dark",type:"Spellcaster",wikiName:"《デス・ソーサラー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A5%B9%A1%A6%A5%BD%A1%BC%A5%B5%A5%E9%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/魔法使い族/攻1450/守1200
死の魔法が得意な魔法使い。
闇と契約している。`,kind:"Monster"},"デス・フット":{name:"デス・フット",nameKana:"",description:`目玉に足の生えた化け物。
高くジャンプしてかぎづめで攻撃する。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:700,defense:800,attribute:"Dark",type:"Fiend",wikiName:"《デス・フット》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A5%B9%A1%A6%A5%D5%A5%C3%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/悪魔族/攻 700/守 800
目玉に足の生えた化け物。
高くジャンプしてかぎづめで攻撃する。`,kind:"Monster"},"デッド・シャーク":{name:"デッド・シャーク",nameKana:"",description:`海をさまようアンデットのサメ。
出会った者に死の呪いをかける。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1100,defense:700,attribute:"Dark",type:"Zombie",wikiName:"《デッド・シャーク》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A5%C3%A5%C9%A1%A6%A5%B7%A5%E3%A1%BC%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/アンデット族/攻1100/守 700
海をさまようアンデットのサメ。
出会った者に死の呪いをかける。`,kind:"Monster"},"デビル・クラーケン":{name:"デビル・クラーケン",nameKana:"",description:`海に潜む巨大イカ。
海中から突然あらわれ攻撃をする。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1400,attribute:"Water",type:"Aqua",wikiName:"《デビル・クラーケン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A5%D3%A5%EB%A1%A6%A5%AF%A5%E9%A1%BC%A5%B1%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1200/守1400
海に潜む巨大イカ。
海中から突然あらわれ攻撃をする。`,kind:"Monster"},"デビル・スネーク":{name:"デビル・スネーク",nameKana:"",description:`目が一つしかないヘビ。
冷気をはき出し、相手を氷づけにする。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:700,defense:600,attribute:"Earth",type:"Reptile",wikiName:"《デビル・スネーク》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A5%D3%A5%EB%A1%A6%A5%B9%A5%CD%A1%BC%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/爬虫類族/攻 700/守 600
目が一つしかないヘビ。
冷気をはき出し、相手を氷づけにする。`,kind:"Monster"},"デビル・ドラゴン":{name:"デビル・ドラゴン",nameKana:"",description:`凶悪なドラゴン。
邪悪な炎をはき、心を邪悪にする。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1200,attribute:"Dark",type:"Dragon",wikiName:"《デビル・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A5%D3%A5%EB%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/ドラゴン族/攻1500/守1200
凶悪なドラゴン。
邪悪な炎をはき、心を邪悪にする。`,kind:"Monster"},デビルスコーピオン:{name:"デビルスコーピオン",nameKana:"",description:`悪魔の魂が宿る巨大なサソリ。
普段は力を温存しているが、潜在能力は高い。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:900,defense:200,attribute:"Earth",type:"Insect",wikiName:"《デビルスコーピオン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A5%D3%A5%EB%A5%B9%A5%B3%A1%BC%A5%D4%A5%AA%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/昆虫族/攻 900/守 200
悪魔の魂が宿る巨大なサソリ。
普段は力を温存しているが、潜在能力は高い。`,kind:"Monster"},デビルゾア:{name:"デビルゾア",nameKana:"",description:"真の力をメタル化によって発揮すると言われているモンスター。",cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2600,defense:1900,attribute:"Dark",type:"Fiend",wikiName:"《デビルゾア》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A5%D3%A5%EB%A5%BE%A5%A2%A1%D5",wikiTextAll:`通常モンスター
星７/闇属性/悪魔族/攻2600/守1900
真の力をメタル化によって発揮すると言われているモンスター。`,kind:"Monster"},デビルツムリ:{name:"デビルツムリ",nameKana:"",description:`闇の力で進化したカタツムリ。
手や足があり、速く動ける。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:700,defense:1300,attribute:"Dark",type:"Insect",wikiName:"《デビルツムリ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A5%D3%A5%EB%A5%C4%A5%E0%A5%EA%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/昆虫族/攻 700/守1300
闇の力で進化したカタツムリ。
手や足があり、速く動ける。`,kind:"Monster"},"デュナミス・ヴァルキリア":{name:"デュナミス・ヴァルキリア",nameKana:"",description:`勇敢なる光の天使。その強い正義感ゆえ、
負けるとわかっている悪との戦いでも決して逃げない。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,defense:1050,attribute:"Light",type:"Fairy",wikiName:"《デュナミス・ヴァルキリア》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A5%E5%A5%CA%A5%DF%A5%B9%A1%A6%A5%F4%A5%A1%A5%EB%A5%AD%A5%EA%A5%A2%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/天使族/攻1800/守1050
勇敢なる光の天使。その強い正義感ゆえ、
負けるとわかっている悪との戦いでも決して逃げない。`,kind:"Monster"},トードマスター:{name:"トードマスター",nameKana:"",description:`何千年も生きているカエルの仙人。
おたまじゃくしで攻撃。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:1e3,attribute:"Water",type:"Aqua",wikiName:"《トードマスター》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A1%BC%A5%C9%A5%DE%A5%B9%A5%BF%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻1000/守1000
何千年も生きているカエルの仙人。
おたまじゃくしで攻撃。`,kind:"Monster"},"トゥーン・アリゲーター":{name:"トゥーン・アリゲーター",nameKana:"",description:"アメリカンコミックの世界から現れた、ワニのモンスター。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:800,defense:1600,attribute:"Water",type:"Reptile",wikiName:"《トゥーン・アリゲーター》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A5%A5%A1%BC%A5%F3%A1%A6%A5%A2%A5%EA%A5%B2%A1%BC%A5%BF%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/爬虫類族/攻 800/守1600
アメリカンコミックの世界から現れた、ワニのモンスター。`,kind:"Monster",nameTags:["トゥーン"]},トビペンギン:{name:"トビペンギン",nameKana:"",description:"耳のようにも見える頭についた羽で空を飛ぶ、珍しいペンギン。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1e3,attribute:"Water",type:"Aqua",wikiName:"《トビペンギン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A5%D3%A5%DA%A5%F3%A5%AE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1200/守1000
耳のようにも見える頭についた羽で空を飛ぶ、珍しいペンギン。`,kind:"Monster"},トモザウルス:{name:"トモザウルス",nameKana:"",description:"小さいが性格は凶暴。仲間同士で争いだす。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:500,defense:400,attribute:"Earth",type:"Dinosaur",wikiName:"《トモザウルス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A5%E2%A5%B6%A5%A6%A5%EB%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/恐竜族/攻 500/守 400
小さいが性格は凶暴。仲間同士で争いだす。`,kind:"Monster"},"トライホーン・ドラゴン":{name:"トライホーン・ドラゴン",nameKana:"",description:"頭に生えている３本のツノが特徴的な悪魔竜。",cardType:"Monster",monsterCategories:["Normal"],level:8,attack:2850,defense:2350,attribute:"Dark",type:"Dragon",wikiName:"《トライホーン・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A5%E9%A5%A4%A5%DB%A1%BC%A5%F3%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星８/闇属性/ドラゴン族/攻2850/守2350
頭に生えている３本のツノが特徴的な悪魔竜。`,kind:"Monster"},トラコドン:{name:"トラコドン",nameKana:"",description:"トラ柄の恐竜。荒野を駆け抜けるスピードはかなり速い。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1300,defense:800,attribute:"Earth",type:"Dinosaur",wikiName:"《トラコドン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A5%E9%A5%B3%A5%C9%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/恐竜族/攻1300/守 800
トラ柄の恐竜。荒野を駆け抜けるスピードはかなり速い。`,kind:"Monster"},トレント:{name:"トレント",nameKana:"",description:"まだまだ成長し続けている森の大木。森の守り神。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1500,defense:1800,attribute:"Earth",type:"Plant",wikiName:"《トレント》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A5%EC%A5%F3%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/植物族/攻1500/守1800
まだまだ成長し続けている森の大木。森の守り神。`,kind:"Monster"},"ドール・モンスター ガールちゃん":{name:"ドール・モンスター ガールちゃん",nameKana:"",description:`わたしたちのお家にようこそ！
コロンちゃんやデメット爺さん、たくさんのお人形たちと暮らしているの！`,cardType:"Monster",monsterCategories:["Normal"],level:4,attribute:"Light",type:"Fairy",wikiName:"《ドール・モンスター ガールちゃん》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C9%A1%BC%A5%EB%A1%A6%A5%E2%A5%F3%A5%B9%A5%BF%A1%BC%20%A5%AC%A1%BC%A5%EB%A4%C1%A4%E3%A4%F3%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/天使族/攻   0/守   0
わたしたちのお家にようこそ！
コロンちゃんやデメット爺さん、たくさんのお人形たちと暮らしているの！`,kind:"Monster",defense:0,attack:0},"ドール・モンスター 熊っち":{name:"ドール・モンスター 熊っち",nameKana:"",description:`ぼくたちが壊れちゃうようなケガをしてもだいじょうぶ。
デメット爺さんが直してくれるんだ！`,cardType:"Monster",monsterCategories:["Normal"],level:4,attribute:"Wind",type:"Beast",wikiName:"《ドール・モンスター 熊っち》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C9%A1%BC%A5%EB%A1%A6%A5%E2%A5%F3%A5%B9%A5%BF%A1%BC%20%B7%A7%A4%C3%A4%C1%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/獣族/攻   0/守   0
ぼくたちが壊れちゃうようなケガをしてもだいじょうぶ。
デメット爺さんが直してくれるんだ！`,kind:"Monster",defense:0,attack:0},ドラコニアの海竜騎兵:{name:"ドラコニアの海竜騎兵",nameKana:"",description:`龍人族の国、ドラコニア帝国が有する竜騎士団の海兵部隊。
深海から音も無く忍び寄る隠密作戦に長けている。
対岸のディノン公国兵とは、領海を巡り小競り合いが続いている状態である。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:3,attack:200,defense:2100,attribute:"Water",type:"SeaSerpent",pendulumScaleR:7,pendulumScaleL:7,wikiName:"《ドラコニアの海竜騎兵》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C9%A5%E9%A5%B3%A5%CB%A5%A2%A4%CE%B3%A4%CE%B5%B5%B3%CA%BC%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星３/水属性/海竜族/攻 200/守2100
【Ｐスケール：青７/赤７】
「ドラコニアの海竜騎兵」のＰ効果は１ターンに１度しか使用できない。
(1)：自分または相手のモンスターが戦闘で破壊された時に発動できる。
手札から通常モンスター１体を特殊召喚する。
【モンスター情報】
龍人族の国、ドラコニア帝国が有する竜騎士団の海兵部隊。
深海から音も無く忍び寄る隠密作戦に長けている。
対岸のディノン公国兵とは、領海を巡り小競り合いが続いている状態である。`,kind:"Monster",pendulumDescription:`「ドラコニアの海竜騎兵」のＰ効果は１ターンに１度しか使用できない。
(1)：自分または相手のモンスターが戦闘で破壊された時に発動できる。
手札から通常モンスター１体を特殊召喚する。`},ドラコニアの獣竜騎兵:{name:"ドラコニアの獣竜騎兵",nameKana:"",description:`龍人族の国、ドラコニア帝国が有する竜騎士団の陸兵部隊。
鳥銃と鉄槍によるコンビネーション攻撃には隙が無く、
レプティア皇国などの周辺国から恐れられている。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:4,attack:1800,defense:200,attribute:"Fire",type:"BeastWarrior",pendulumScaleR:2,pendulumScaleL:2,wikiName:"《ドラコニアの獣竜騎兵》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C9%A5%E9%A5%B3%A5%CB%A5%A2%A4%CE%BD%C3%CE%B5%B5%B3%CA%BC%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星４/炎属性/獣戦士族/攻1800/守 200
【Ｐスケール：青２/赤２】
(1)：１ターンに１度、自分の通常モンスターが
戦闘で相手モンスターを破壊したダメージ計算後に発動できる。
デッキからレベル４以上の通常モンスター１体を手札に加える。
【モンスター情報】
龍人族の国、ドラコニア帝国が有する竜騎士団の陸兵部隊。
鳥銃と鉄槍によるコンビネーション攻撃には隙が無く、
レプティア皇国などの周辺国から恐れられている。`,kind:"Monster",pendulumDescription:`(1)：１ターンに１度、自分の通常モンスターが
戦闘で相手モンスターを破壊したダメージ計算後に発動できる。
デッキからレベル４以上の通常モンスター１体を手札に加える。`},ドラコニアの翼竜騎兵:{name:"ドラコニアの翼竜騎兵",nameKana:"",description:`龍人族の国、ドラコニア帝国が有する竜騎士団の空兵部隊。
中立国である空中都市国家シュルブへ侵攻するために結成されたとの噂があり、
周辺国は警戒を強めている。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:5,attack:2200,defense:200,attribute:"Wind",type:"WingedBeast",pendulumScaleR:7,pendulumScaleL:7,wikiName:"《ドラコニアの翼竜騎兵》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C9%A5%E9%A5%B3%A5%CB%A5%A2%A4%CE%CD%E3%CE%B5%B5%B3%CA%BC%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星５/風属性/鳥獣族/攻2200/守 200
【Ｐスケール：青７/赤７】
(1)：１ターンに１度、自分の通常モンスターが相手に戦闘ダメージを与えた時、
フィールドのカード１枚を対象として発動できる。
そのカードを破壊する。
【モンスター情報】
龍人族の国、ドラコニア帝国が有する竜騎士団の空兵部隊。
中立国である空中都市国家シュルブへ侵攻するために結成されたとの噂があり、
周辺国は警戒を強めている。`,kind:"Monster",pendulumDescription:`(1)：１ターンに１度、自分の通常モンスターが相手に戦闘ダメージを与えた時、
フィールドのカード１枚を対象として発動できる。
そのカードを破壊する。`},ドラゴヒューマン:{name:"ドラゴヒューマン",nameKana:"",description:"ドラゴンのキバで作った剣を振るう、ドラゴンの力を持つ戦士。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1100,attribute:"Earth",type:"Warrior",wikiName:"《ドラゴヒューマン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C9%A5%E9%A5%B4%A5%D2%A5%E5%A1%BC%A5%DE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/戦士族/攻1300/守1100
ドラゴンのキバで作った剣を振るう、ドラゴンの力を持つ戦士。`,kind:"Monster"},"ドラゴン・エッガー":{name:"ドラゴン・エッガー",nameKana:"",description:"卵のカラをかぶっているドラゴン。子供と間違えると痛い目にあうぞ！",cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2200,defense:2600,attribute:"Fire",type:"Dragon",wikiName:"《ドラゴン・エッガー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C9%A5%E9%A5%B4%A5%F3%A1%A6%A5%A8%A5%C3%A5%AC%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星７/炎属性/ドラゴン族/攻2200/守2600
卵のカラをかぶっているドラゴン。子供と間違えると痛い目にあうぞ！`,kind:"Monster"},"ドラゴン・ゾンビ":{name:"ドラゴン・ゾンビ",nameKana:"",description:`魔力により蘇ったドラゴン。
はく息は触れるものを腐食させる。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1600,attribute:"Dark",type:"Zombie",wikiName:"《ドラゴン・ゾンビ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C9%A5%E9%A5%B4%A5%F3%A1%A6%A5%BE%A5%F3%A5%D3%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/アンデット族/攻1600/守   0
魔力により蘇ったドラゴン。
はく息は触れるものを腐食させる。`,kind:"Monster",defense:0},ドリアード:{name:"ドリアード",nameKana:"",description:`森の精霊。
草木の力を借りて相手の動きを封じる。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1400,attribute:"Earth",type:"Spellcaster",wikiName:"《ドリアード》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C9%A5%EA%A5%A2%A1%BC%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/魔法使い族/攻1200/守1400
森の精霊。
草木の力を借りて相手の動きを封じる。`,kind:"Monster"},ドレイク:{name:"ドレイク",nameKana:"",description:"しっぽが長い鳥。そのしっぽで空中から攻撃する。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:800,attribute:"Wind",type:"WingedBeast",wikiName:"《ドレイク》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C9%A5%EC%A5%A4%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星３/風属性/鳥獣族/攻 800/守 800
しっぽが長い鳥。そのしっぽで空中から攻撃する。`,kind:"Monster"},ドローバ:{name:"ドローバ",nameKana:"",description:`ドロドロした、気持ち悪いモンスター。
猛毒ガスを吐き、攻撃をする。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:800,attribute:"Water",type:"Aqua",wikiName:"《ドローバ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C9%A5%ED%A1%BC%A5%D0%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻 900/守 800
ドロドロした、気持ち悪いモンスター。
猛毒ガスを吐き、攻撃をする。`,kind:"Monster"},ドローン:{name:"ドローン",nameKana:"",description:`ドロローンと分身して、はさみ撃ち攻撃をしかけてくる。
油断するな！`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:900,defense:500,attribute:"Earth",type:"Warrior",wikiName:"《ドローン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C9%A5%ED%A1%BC%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/戦士族/攻 900/守 500
ドロローンと分身して、はさみ撃ち攻撃をしかけてくる。
油断するな！`,kind:"Monster"},"ナイト・リザード":{name:"ナイト・リザード",nameKana:"",description:"海を守る、緑のウロコに身を包むリザードマンの戦士。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1150,defense:1300,attribute:"Water",type:"Aqua",wikiName:"《ナイト・リザード》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%CA%A5%A4%A5%C8%A1%A6%A5%EA%A5%B6%A1%BC%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1150/守1300
海を守る、緑のウロコに身を包むリザードマンの戦士。`,kind:"Monster"},"ナイトメア・スコーピオン":{name:"ナイトメア・スコーピオン",nameKana:"",description:"悪夢を見せ、うなされている間に四本もある毒のしっぽを刺す。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:800,attribute:"Earth",type:"Insect",wikiName:"《ナイトメア・スコーピオン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%CA%A5%A4%A5%C8%A5%E1%A5%A2%A1%A6%A5%B9%A5%B3%A1%BC%A5%D4%A5%AA%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/昆虫族/攻 900/守 800
悪夢を見せ、うなされている間に四本もある毒のしっぽを刺す。`,kind:"Monster"},ナイル:{name:"ナイル",nameKana:"",description:"全身にハリが生えている魚。腹の下からミサイルを発射。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1400,defense:1600,attribute:"Water",type:"Fish",wikiName:"《ナイル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%CA%A5%A4%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星５/水属性/魚族/攻1400/守1600
全身にハリが生えている魚。腹の下からミサイルを発射。`,kind:"Monster"},"ネオアクア・マドール":{name:"ネオアクア・マドール",nameKana:"",description:`水を支配する魔法使いの真の姿。
絶対に破る事のできないと言われる巨大な氷の壁をつくり攻撃を防ぐ。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:1200,defense:3e3,attribute:"Water",type:"Spellcaster",wikiName:"《ネオアクア・マドール》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%CD%A5%AA%A5%A2%A5%AF%A5%A2%A1%A6%A5%DE%A5%C9%A1%BC%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星６/水属性/魔法使い族/攻1200/守3000
水を支配する魔法使いの真の姿。
絶対に破る事のできないと言われる巨大な氷の壁をつくり攻撃を防ぐ。`,kind:"Monster"},ネオバグ:{name:"ネオバグ",nameKana:"",description:`異星から来たと言われる巨大な昆虫タイプのモンスター。
集団で行動してターゲットをとらえる。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,defense:1700,attribute:"Earth",type:"Insect",wikiName:"《ネオバグ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%CD%A5%AA%A5%D0%A5%B0%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/昆虫族/攻1800/守1700
異星から来たと言われる巨大な昆虫タイプのモンスター。
集団で行動してターゲットをとらえる。`,kind:"Monster"},ハードアーマー:{name:"ハードアーマー",nameKana:"",description:`心のある鎧。
堅い体でソルジャータックルをしかけてくる。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:300,defense:1200,attribute:"Earth",type:"Warrior",wikiName:"《ハードアーマー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%CF%A1%BC%A5%C9%A5%A2%A1%BC%A5%DE%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/戦士族/攻 300/守1200
心のある鎧。
堅い体でソルジャータックルをしかけてくる。`,kind:"Monster"},"ハーピィ・ガール":{name:"ハーピィ・ガール",nameKana:"",description:"美しく華麗に舞い、鋭く攻撃する事ができるようになりたいと願っているハーピィの女の子。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:500,defense:500,attribute:"Wind",type:"WingedBeast",wikiName:"《ハーピィ・ガール》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%CF%A1%BC%A5%D4%A5%A3%A1%A6%A5%AC%A1%BC%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星２/風属性/鳥獣族/攻 500/守 500
美しく華麗に舞い、鋭く攻撃する事ができるようになりたいと願っているハーピィの女の子。`,kind:"Monster"},"ハーピィ・レディ":{name:"ハーピィ・レディ",nameKana:"",description:`人に羽のはえたけもの。
美しく華麗に舞い、鋭く攻撃する。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1400,attribute:"Wind",type:"WingedBeast",wikiName:"《ハーピィ・レディ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%CF%A1%BC%A5%D4%A5%A3%A1%A6%A5%EC%A5%C7%A5%A3%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/鳥獣族/攻1300/守1400
人に羽のはえたけもの。
美しく華麗に舞い、鋭く攻撃する。`,kind:"Monster"},ハープの精:{name:"ハープの精",nameKana:"",description:`天界でハープをかなでる精霊。
その音色はまわりの心をなごます。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:800,defense:2e3,attribute:"Light",type:"Fairy",wikiName:"《ハープの精》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%CF%A1%BC%A5%D7%A4%CE%C0%BA%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/天使族/攻 800/守2000
天界でハープをかなでる精霊。
その音色はまわりの心をなごます。`,kind:"Monster"},"ハイ・プリーステス":{name:"ハイ・プリーステス",nameKana:"",description:"聞いたことのない呪文を唱え、あらぶる心をしずめてくれる。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1100,defense:800,attribute:"Light",type:"Spellcaster",wikiName:"《ハイ・プリーステス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%CF%A5%A4%A1%A6%A5%D7%A5%EA%A1%BC%A5%B9%A5%C6%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星３/光属性/魔法使い族/攻1100/守 800
聞いたことのない呪文を唱え、あらぶる心をしずめてくれる。`,kind:"Monster"},"ハウンド・ドラゴン":{name:"ハウンド・ドラゴン",nameKana:"",description:`鋭い牙で獲物を仕留めるドラゴン。
鋭く素早い動きで攻撃を繰り出すが、守備能力は持ち合わせていない。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1700,defense:100,attribute:"Dark",type:"Dragon",wikiName:"《ハウンド・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%CF%A5%A6%A5%F3%A5%C9%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/ドラゴン族/攻1700/守 100
鋭い牙で獲物を仕留めるドラゴン。
鋭く素早い動きで攻撃を繰り出すが、守備能力は持ち合わせていない。`,kind:"Monster"},"ハッピー・ラヴァー":{name:"ハッピー・ラヴァー",nameKana:"",description:"頭からハートビームを出し敵をしあわせにする、小さな天使。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:800,defense:500,attribute:"Light",type:"Fairy",wikiName:"《ハッピー・ラヴァー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%CF%A5%C3%A5%D4%A1%BC%A1%A6%A5%E9%A5%F4%A5%A1%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星２/光属性/天使族/攻 800/守 500
頭からハートビームを出し敵をしあわせにする、小さな天使。`,kind:"Monster"},ハリケル:{name:"ハリケル",nameKana:"",description:"荒野で荒れ狂う竜巻。風の刃で相手を切り刻む。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:900,defense:200,attribute:"Wind",type:"Spellcaster",wikiName:"《ハリケル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%CF%A5%EA%A5%B1%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星２/風属性/魔法使い族/攻 900/守 200
荒野で荒れ狂う竜巻。風の刃で相手を切り刻む。`,kind:"Monster"},ハロハロ:{name:"ハロハロ",nameKana:"",description:`ハロハロはあまいおかしにメロメロ。
おかしをさがしてあっちへウロウロ、こっちをキョロキョロ。
おかしをくれないとイロイロないたずらでヘロヘロにしちゃうぞ。
 
オロオロしたってもうおそいよ。
なにがでるかはおたのしみ。`,cardType:"Monster",monsterCategories:["Normal","Tuner","Pendulum"],level:3,attack:800,defense:600,attribute:"Dark",type:"Fiend",pendulumScaleR:2,pendulumScaleL:2,wikiName:"《ハロハロ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%CF%A5%ED%A5%CF%A5%ED%A1%D5",wikiTextAll:`ペンデュラム・チューナー・通常モンスター
星３/闇属性/悪魔族/攻 800/守 600
【Ｐスケール：青２/赤２】
(1)：１ターンに１度、フィールドの表側表示モンスター１体を対象として発動できる。
サイコロを１回振る。
そのモンスターのレベルはターン終了時まで、出た目と同じレベルになる。
【モンスター情報】
ハロハロはあまいおかしにメロメロ。
おかしをさがしてあっちへウロウロ、こっちをキョロキョロ。
おかしをくれないとイロイロないたずらでヘロヘロにしちゃうぞ。
 
オロオロしたってもうおそいよ。
なにがでるかはおたのしみ。`,kind:"Monster",pendulumDescription:`(1)：１ターンに１度、フィールドの表側表示モンスター１体を対象として発動できる。
サイコロを１回振る。
そのモンスターのレベルはターン終了時まで、出た目と同じレベルになる。`},"ハンター・スパイダー":{name:"ハンター・スパイダー",nameKana:"",description:"クモの巣の罠を仕掛け狩りをする。罠にかかったものは食べてしまう。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1600,defense:1400,attribute:"Earth",type:"Insect",wikiName:"《ハンター・スパイダー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%CF%A5%F3%A5%BF%A1%BC%A1%A6%A5%B9%A5%D1%A5%A4%A5%C0%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/昆虫族/攻1600/守1400
クモの巣の罠を仕掛け狩りをする。罠にかかったものは食べてしまう。`,kind:"Monster"},バーグラー:{name:"バーグラー",nameKana:"",description:`ずるがしこいネズミ。
左手の大きなかぎづめで攻撃してくる。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:850,defense:800,attribute:"Earth",type:"Beast",wikiName:"《バーグラー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D0%A1%BC%A5%B0%A5%E9%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/獣族/攻 850/守 800
ずるがしこいネズミ。
左手の大きなかぎづめで攻撃してくる。`,kind:"Monster"},バーサーカー:{name:"バーサーカー",nameKana:"",description:`狂った力を使い攻撃する。
その暴走は誰にも止められない。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1e3,attribute:"Dark",type:"Fiend",wikiName:"《バーサーカー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D0%A1%BC%A5%B5%A1%BC%A5%AB%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1500/守1000
狂った力を使い攻撃する。
その暴走は誰にも止められない。`,kind:"Monster"},バードマン:{name:"バードマン",nameKana:"",description:`マッハ５で飛行する鳥人。
その眼光は鷹より鋭い。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,defense:600,attribute:"Wind",type:"WingedBeast",wikiName:"《バードマン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D0%A1%BC%A5%C9%A5%DE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/鳥獣族/攻1800/守 600
マッハ５で飛行する鳥人。
その眼光は鷹より鋭い。`,kind:"Monster"},バーニングソルジャー:{name:"バーニングソルジャー",nameKana:"",description:"熱く燃える特殊部隊工作員。火薬のエキスパート。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1700,defense:1150,attribute:"Fire",type:"Pyro",wikiName:"《バーニングソルジャー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D0%A1%BC%A5%CB%A5%F3%A5%B0%A5%BD%A5%EB%A5%B8%A5%E3%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/炎属性/炎族/攻1700/守1150
熱く燃える特殊部隊工作員。火薬のエキスパート。`,kind:"Monster"},バイオ僧侶:{name:"バイオ僧侶",nameKana:"",description:"最新のバイオテクノロジーによって生み出された僧侶。数々の謎を秘めている。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1150,defense:1e3,attribute:"Light",type:"Fairy",wikiName:"《バイオ僧侶》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D0%A5%A4%A5%AA%C1%CE%CE%B7%A1%D5",wikiTextAll:`通常モンスター
星３/光属性/天使族/攻1150/守1000
最新のバイオテクノロジーによって生み出された僧侶。数々の謎を秘めている。`,kind:"Monster"},バット:{name:"バット",nameKana:"",description:"左右のハネに搭載された爆弾を落としてくるメカコウモリ。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:300,defense:350,attribute:"Wind",type:"Machine",wikiName:"《バット》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D0%A5%C3%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星１/風属性/機械族/攻 300/守 350
左右のハネに搭載された爆弾を落としてくるメカコウモリ。`,kind:"Monster"},バトルフットボーラー:{name:"バトルフットボーラー",nameKana:"",description:`高い守備能力を誇るサイボーグ。
元々はフットボールマシンとして開発されたという。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1e3,defense:2100,attribute:"Fire",type:"Machine",wikiName:"《バトルフットボーラー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D0%A5%C8%A5%EB%A5%D5%A5%C3%A5%C8%A5%DC%A1%BC%A5%E9%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/炎属性/機械族/攻1000/守2100
高い守備能力を誇るサイボーグ。
元々はフットボールマシンとして開発されたという。`,kind:"Monster"},バニーラ:{name:"バニーラ",nameKana:"",description:`甘いものがとっても大好きな甘党うさぎ。
世界一甘いと言われる甘糖人参を探し求め、
今日も明日もニンジンをかじりたい。`,cardType:"Monster",monsterCategories:["Normal"],level:1,attack:150,defense:2050,attribute:"Earth",type:"Beast",wikiName:"《バニーラ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D0%A5%CB%A1%BC%A5%E9%A1%D5",wikiTextAll:`通常モンスター
星１/地属性/獣族/攻 150/守2050
甘いものがとっても大好きな甘党うさぎ。
世界一甘いと言われる甘糖人参を探し求め、
今日も明日もニンジンをかじりたい。`,kind:"Monster"},バビロン:{name:"バビロン",nameKana:"",description:`一つ目の巨大な怪物。
目玉からビームを発射して攻撃する。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:700,defense:600,attribute:"Earth",type:"Beast",wikiName:"《バビロン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D0%A5%D3%A5%ED%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/獣族/攻 700/守 600
一つ目の巨大な怪物。
目玉からビームを発射して攻撃する。`,kind:"Monster"},"パロット・ドラゴン":{name:"パロット・ドラゴン",nameKana:"",description:`アメリカンコミックの世界のドラゴン。
かわいらしい風貌にだまされるな。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:2e3,defense:1300,attribute:"Wind",type:"Dragon",wikiName:"《パロット・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D1%A5%ED%A5%C3%A5%C8%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星５/風属性/ドラゴン族/攻2000/守1300
アメリカンコミックの世界のドラゴン。
かわいらしい風貌にだまされるな。`,kind:"Monster"},"パワプロ・レディ三姉妹":{name:"パワプロ・レディ三姉妹",nameKana:"",description:`仲良しパワプロ三人娘。野球にかける情熱が華麗にフィールドを舞う！
早川 あおい：シリーズ初の女子選手。アンダースローの投手で、決め球は『マリンボール』。橘みずきの先輩。
橘 みずき：おてんばで勝ち気な投手。決め球は『クレッセントムーン』。パワ堂の「プリン」が好き。
六道 聖：類いまれな野球センスを持つ捕手。橘みずきとは中学時代からの親友。好物はパワ堂の「きんつば」。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:1950,defense:2100,attribute:"Wind",type:"WingedBeast",wikiName:"《パワプロ・レディ三姉妹》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D1%A5%EF%A5%D7%A5%ED%A1%A6%A5%EC%A5%C7%A5%A3%BB%B0%BB%D0%CB%E5%A1%D5",wikiTextAll:`通常モンスター
星６/風属性/鳥獣族/攻1950/守2100
仲良しパワプロ三人娘。野球にかける情熱が華麗にフィールドを舞う！
早川 あおい：シリーズ初の女子選手。アンダースローの投手で、決め球は『マリンボール』。橘みずきの先輩。
橘 みずき：おてんばで勝ち気な投手。決め球は『クレッセントムーン』。パワ堂の「プリン」が好き。
六道 聖：類いまれな野球センスを持つ捕手。橘みずきとは中学時代からの親友。好物はパワ堂の「きんつば」。`,kind:"Monster"},ヒトデンチャク:{name:"ヒトデンチャク",nameKana:"",description:`汚染された水で狂暴化したヒトデ。
口から溶解液をはく。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:600,defense:700,attribute:"Water",type:"Aqua",wikiName:"《ヒトデンチャク》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D2%A5%C8%A5%C7%A5%F3%A5%C1%A5%E3%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星２/水属性/水族/攻 600/守 700
汚染された水で狂暴化したヒトデ。
口から溶解液をはく。`,kind:"Monster"},"ヒューマノイド・スライム":{name:"ヒューマノイド・スライム",nameKana:"",description:`人間の形をしたスライム。
人間の遺伝子が組み込まれている。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:800,defense:2e3,attribute:"Water",type:"Aqua",wikiName:"《ヒューマノイド・スライム》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D2%A5%E5%A1%BC%A5%DE%A5%CE%A5%A4%A5%C9%A1%A6%A5%B9%A5%E9%A5%A4%A5%E0%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻 800/守2000
人間の形をしたスライム。
人間の遺伝子が組み込まれている。`,kind:"Monster"},"ビーン・ソルジャー":{name:"ビーン・ソルジャー",nameKana:"",description:`剣やマメを使って攻撃してくる植物戦士。
意外と強いぞ。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1300,attribute:"Earth",type:"Plant",wikiName:"《ビーン・ソルジャー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D3%A1%BC%A5%F3%A1%A6%A5%BD%A5%EB%A5%B8%A5%E3%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/植物族/攻1400/守1300
剣やマメを使って攻撃してくる植物戦士。
意外と強いぞ。`,kind:"Monster"},"ビック・アント":{name:"ビック・アント",nameKana:"",description:`密林に住む巨大アリ。
攻撃・守備ともに意外と強い。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1500,attribute:"Earth",type:"Insect",wikiName:"《ビック・アント》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D3%A5%C3%A5%AF%A1%A6%A5%A2%A5%F3%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/昆虫族/攻1200/守1500
密林に住む巨大アリ。
攻撃・守備ともに意外と強い。`,kind:"Monster"},"ビッグ・コアラ":{name:"ビッグ・コアラ",nameKana:"",description:`とても巨大なデス・コアラの一種。
おとなしい性格だが、非常に強力なパワーを持っているため恐れられている。`,cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2700,defense:2e3,attribute:"Earth",type:"Beast",wikiName:"《ビッグ・コアラ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D3%A5%C3%A5%B0%A1%A6%A5%B3%A5%A2%A5%E9%A1%D5",wikiTextAll:`通常モンスター
星７/地属性/獣族/攻2700/守2000
とても巨大なデス・コアラの一種。
おとなしい性格だが、非常に強力なパワーを持っているため恐れられている。`,kind:"Monster"},ビッグバンドラゴン:{name:"ビッグバンドラゴン",nameKana:"",description:`宇宙ができた時に生まれた竜。
その衝撃で双子の竜が合体して１つの体になってしまった。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2200,defense:1700,attribute:"Fire",type:"Pyro",wikiName:"《ビッグバンドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D3%A5%C3%A5%B0%A5%D0%A5%F3%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星６/炎属性/炎族/攻2200/守1700
宇宙ができた時に生まれた竜。
その衝撃で双子の竜が合体して１つの体になってしまった。`,kind:"Monster"},ビットロン:{name:"ビットロン",nameKana:"",description:`電子空間で見つけた新種。
その情報量は少ない。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:200,defense:2e3,attribute:"Earth",type:"Cyberse",wikiName:"《ビットロン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D3%A5%C3%A5%C8%A5%ED%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/サイバース族/攻 200/守2000
電子空間で見つけた新種。
その情報量は少ない。`,kind:"Monster"},ピティ:{name:"ピティ",nameKana:"",description:`契約者に幸運をもたらすとされる、ガラス瓶に宿るカワイイ奴。
その蓋は絶対に開けてはならない。
どんな事が起ころうと絶対に・・・。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attribute:"Light",type:"Fiend",wikiName:"《ピティ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D4%A5%C6%A5%A3%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/悪魔族/攻   0/守   0
契約者に幸運をもたらすとされる、ガラス瓶に宿るカワイイ奴。
その蓋は絶対に開けてはならない。
どんな事が起ころうと絶対に・・・。`,kind:"Monster",defense:0,attack:0},フーコーの魔砲石:{name:"フーコーの魔砲石",nameKana:"",description:`夢幻の空間を彷徨う機械仕掛けの生命体、だったはずである。
一番の謎は、過去の記録が殆ど残ってい・・事だ。
その理由・・・なのか、・・・・・干渉・・・て拒・・・ている・・？
・・・消去・・・`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:5,attack:2200,defense:1200,attribute:"Dark",type:"Spellcaster",pendulumScaleR:2,pendulumScaleL:2,wikiName:"《フーコーの魔砲石》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A1%BC%A5%B3%A1%BC%A4%CE%CB%E2%CB%A4%C0%D0%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星５/闇属性/魔法使い族/攻2200/守1200
【Ｐスケール：青２/赤２】
(1)：このカードを発動したターンのエンドフェイズに、
フィールドの表側表示の魔法・罠カード１枚を対象として発動できる。
そのカードを破壊する。
【モンスター情報】
夢幻の空間を彷徨う機械仕掛けの生命体、だったはずである。
一番の謎は、過去の記録が殆ど残ってい・・事だ。
その理由・・・なのか、・・・・・干渉・・・て拒・・・ている・・？
・・・消去・・・`,kind:"Monster",pendulumDescription:`(1)：このカードを発動したターンのエンドフェイズに、
フィールドの表側表示の魔法・罠カード１枚を対象として発動できる。
そのカードを破壊する。`},"ファイヤー・アイ":{name:"ファイヤー・アイ",nameKana:"",description:`炎につつまれた目玉。
羽をはばたかせ、炎の風をおこす。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:800,defense:600,attribute:"Fire",type:"Pyro",wikiName:"《ファイヤー・アイ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A5%A1%A5%A4%A5%E4%A1%BC%A1%A6%A5%A2%A5%A4%A1%D5",wikiTextAll:`通常モンスター
星２/炎属性/炎族/攻 800/守 600
炎につつまれた目玉。
羽をはばたかせ、炎の風をおこす。`,kind:"Monster"},"ファイヤー・ウイング・ペガサス":{name:"ファイヤー・ウイング・ペガサス",nameKana:"",description:"色鮮やかな真紅の翼をはばたかせ、天を駆け抜ける天馬。",cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2250,defense:1800,attribute:"Fire",type:"Beast",wikiName:"《ファイヤー・ウイング・ペガサス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A5%A1%A5%A4%A5%E4%A1%BC%A1%A6%A5%A6%A5%A4%A5%F3%A5%B0%A1%A6%A5%DA%A5%AC%A5%B5%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星６/炎属性/獣族/攻2250/守1800
色鮮やかな真紅の翼をはばたかせ、天を駆け抜ける天馬。`,kind:"Monster"},"ファイヤー・クラーケン":{name:"ファイヤー・クラーケン",nameKana:"",description:"水の中でもボウボウと燃え盛る炎に包まれたイカ。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1500,attribute:"Fire",type:"Aqua",wikiName:"《ファイヤー・クラーケン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A5%A1%A5%A4%A5%E4%A1%BC%A1%A6%A5%AF%A5%E9%A1%BC%A5%B1%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/炎属性/水族/攻1600/守1500 
水の中でもボウボウと燃え盛る炎に包まれたイカ。`,kind:"Monster"},"ファイヤー・デビル":{name:"ファイヤー・デビル",nameKana:"",description:`炎の矢を手にする死神。
その矢にあたると火だるまになる。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:700,defense:500,attribute:"Dark",type:"Zombie",wikiName:"《ファイヤー・デビル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A5%A1%A5%A4%A5%E4%A1%BC%A1%A6%A5%C7%A5%D3%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/アンデット族/攻 700/守 500
炎の矢を手にする死神。
その矢にあたると火だるまになる。`,kind:"Monster"},ファイヤーオパールヘッド:{name:"ファイヤーオパールヘッド",nameKana:"",description:`熱く燃えたぎる石頭の恐竜番長。
ダイナミックな動きと炎で敵を翻弄し、必殺のファイヤーオパールヘッドをお見舞いする。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:6,attack:2500,defense:1e3,attribute:"Fire",type:"Dinosaur",pendulumScaleR:0,pendulumScaleL:0,wikiName:"《ファイヤーオパールヘッド》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A5%A1%A5%A4%A5%E4%A1%BC%A5%AA%A5%D1%A1%BC%A5%EB%A5%D8%A5%C3%A5%C9%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星６/炎属性/恐竜族/攻2500/守1000
【Ｐスケール：青０/赤０】
【モンスター情報】
熱く燃えたぎる石頭の恐竜番長。
ダイナミックな動きと炎で敵を翻弄し、必殺のファイヤーオパールヘッドをお見舞いする。`,kind:"Monster",pendulumDescription:""},ファラオのしもべ:{name:"ファラオのしもべ",nameKana:"",description:`かつてファラオに仕えたといわれている者たちの亡霊。
揺らぐ事のない忠誠心を持っている。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:900,attribute:"Dark",type:"Zombie",wikiName:"《ファラオのしもべ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A5%A1%A5%E9%A5%AA%A4%CE%A4%B7%A4%E2%A4%D9%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/アンデット族/攻 900/守   0
かつてファラオに仕えたといわれている者たちの亡霊。
揺らぐ事のない忠誠心を持っている。`,kind:"Monster",defense:0},ファランクス:{name:"ファランクス",nameKana:"",description:`上にも下にも頭がある、気持ち悪いヤツ。
口からはレーザーを吐く。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:900,attribute:"Earth",type:"Beast",wikiName:"《ファランクス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A5%A1%A5%E9%A5%F3%A5%AF%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/獣族/攻 800/守 900
上にも下にも頭がある、気持ち悪いヤツ。
口からはレーザーを吐く。`,kind:"Monster"},"フェアリー・ドラゴン":{name:"フェアリー・ドラゴン",nameKana:"",description:"妖精の中では意外と強い、とてもきれいなドラゴンの妖精。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1100,defense:1200,attribute:"Wind",type:"Dragon",wikiName:"《フェアリー・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A5%A7%A5%A2%A5%EA%A1%BC%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/ドラゴン族/攻1100/守1200
妖精の中では意外と強い、とてもきれいなドラゴンの妖精。`,kind:"Monster"},"フライング・フィッシュ":{name:"フライング・フィッシュ",nameKana:"",description:"空を飛ぶ姿を見ると、３つの願い事がかなうと言われている。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:800,defense:500,attribute:"Wind",type:"Fish",wikiName:"《フライング・フィッシュ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A5%E9%A5%A4%A5%F3%A5%B0%A1%A6%A5%D5%A5%A3%A5%C3%A5%B7%A5%E5%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/魚族/攻 800/守 500 
空を飛ぶ姿を見ると、３つの願い事がかなうと言われている。`,kind:"Monster"},フライングマンティス:{name:"フライングマンティス",nameKana:"",description:"飛行能力を持ったカマキリ。昆虫が大好物。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:800,attribute:"Wind",type:"Insect",wikiName:"《フライングマンティス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A5%E9%A5%A4%A5%F3%A5%B0%A5%DE%A5%F3%A5%C6%A5%A3%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/昆虫族/攻1500/守 800
飛行能力を持ったカマキリ。昆虫が大好物。`,kind:"Monster"},"フレイム・ケルベロス":{name:"フレイム・ケルベロス",nameKana:"",description:`全身が炎に包まれた魔獣。
相手を地獄の炎で処刑する。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2100,defense:1800,attribute:"Fire",type:"Pyro",wikiName:"《フレイム・ケルベロス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A5%EC%A5%A4%A5%E0%A1%A6%A5%B1%A5%EB%A5%D9%A5%ED%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星６/炎属性/炎族/攻2100/守1800
全身が炎に包まれた魔獣。
相手を地獄の炎で処刑する。`,kind:"Monster"},"フレイム・ヴァイパー":{name:"フレイム・ヴァイパー",nameKana:"",description:"シュルシュルと素早く動き、口から火炎をはくマムシ。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:400,defense:450,attribute:"Earth",type:"Pyro",wikiName:"《フレイム・ヴァイパー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A5%EC%A5%A4%A5%E0%A1%A6%A5%F4%A5%A1%A5%A4%A5%D1%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/炎族/攻 400/守 450
シュルシュルと素早く動き、口から火炎をはくマムシ。`,kind:"Monster"},フレイムキラー:{name:"フレイムキラー",nameKana:"",description:`炎の盾を使う剣士。
その盾はどんな攻撃でも無効化してしまう。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1900,defense:1300,attribute:"Fire",type:"Pyro",wikiName:"《フレイムキラー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A5%EC%A5%A4%A5%E0%A5%AD%A5%E9%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星５/炎属性/炎族/攻1900/守1300
炎の盾を使う剣士。
その盾はどんな攻撃でも無効化してしまう。`,kind:"Monster"},フレイムダンサー:{name:"フレイムダンサー",nameKana:"",description:`燃えたぎるロープを振り回し近づいてくる。
目を合わせたら駄目だ。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:550,defense:450,attribute:"Fire",type:"Pyro",wikiName:"《フレイムダンサー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A5%EC%A5%A4%A5%E0%A5%C0%A5%F3%A5%B5%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星２/炎属性/炎族/攻 550/守 450
燃えたぎるロープを振り回し近づいてくる。
目を合わせたら駄目だ。`,kind:"Monster"},フレンドシップ:{name:"フレンドシップ",nameKana:"",description:"デュエル中ケンカをしても、友情を伝え仲直りをさせる。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1100,attribute:"Light",type:"Fairy",wikiName:"《フレンドシップ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A5%EC%A5%F3%A5%C9%A5%B7%A5%C3%A5%D7%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/天使族/攻1300/守1100
デュエル中ケンカをしても、友情を伝え仲直りをさせる。`,kind:"Monster"},フロストザウルス:{name:"フロストザウルス",nameKana:"",description:`鈍い神経と感性のお陰で、
氷づけになりつつも氷河期を乗り越える脅威の生命力を持つ。
寒さには滅法強いぞ。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2600,defense:1700,attribute:"Water",type:"Dinosaur",wikiName:"《フロストザウルス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A5%ED%A5%B9%A5%C8%A5%B6%A5%A6%A5%EB%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星６/水属性/恐竜族/攻2600/守1700
鈍い神経と感性のお陰で、
氷づけになりつつも氷河期を乗り越える脅威の生命力を持つ。
寒さには滅法強いぞ。`,kind:"Monster"},ブークー:{name:"ブークー",nameKana:"",description:`本の姿をした魔法使い。
ありとあらゆる魔法が書かれている。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:650,defense:500,attribute:"Dark",type:"Spellcaster",wikiName:"《ブークー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D6%A1%BC%A5%AF%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/魔法使い族/攻 650/守 500
本の姿をした魔法使い。
ありとあらゆる魔法が書かれている。`,kind:"Monster"},"ブラック・マジシャン":{name:"ブラック・マジシャン",nameKana:"",description:"魔法使いとしては、攻撃力・守備力ともに最高クラス。",cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2500,defense:2100,attribute:"Dark",type:"Spellcaster",wikiName:"《ブラック・マジシャン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D6%A5%E9%A5%C3%A5%AF%A1%A6%A5%DE%A5%B8%A5%B7%A5%E3%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星７/闇属性/魔法使い族/攻2500/守2100
魔法使いとしては、攻撃力・守備力ともに最高クラス。`,kind:"Monster"},"ブラッド・ヴォルス":{name:"ブラッド・ヴォルス",nameKana:"",description:`悪行の限りを尽くし、それを喜びとしている魔獣人。
手にした斧は常に血塗られている。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1900,defense:1200,attribute:"Dark",type:"BeastWarrior",wikiName:"《ブラッド・ヴォルス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D6%A5%E9%A5%C3%A5%C9%A1%A6%A5%F4%A5%A9%A5%EB%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/獣戦士族/攻1900/守1200
悪行の限りを尽くし、それを喜びとしている魔獣人。
手にした斧は常に血塗られている。`,kind:"Monster"},"ブレード・スケーター":{name:"ブレード・スケーター",nameKana:"",description:`氷上の舞姫は、華麗なる戦士。
必殺アクセル・スライサーで華麗に敵モンスターを切り裂く。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1500,attribute:"Earth",type:"Warrior",wikiName:"《ブレード・スケーター》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D6%A5%EC%A1%BC%A5%C9%A1%A6%A5%B9%A5%B1%A1%BC%A5%BF%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/戦士族/攻1400/守1500
氷上の舞姫は、華麗なる戦士。
必殺アクセル・スライサーで華麗に敵モンスターを切り裂く。`,kind:"Monster"},"ブレイブ・シザー":{name:"ブレイブ・シザー",nameKana:"",description:"何本も持っているハサミを器用に動かし、相手を切り刻む。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1e3,attribute:"Dark",type:"Machine",wikiName:"《ブレイブ・シザー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D6%A5%EC%A5%A4%A5%D6%A1%A6%A5%B7%A5%B6%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/機械族/攻1300/守1000
何本も持っているハサミを器用に動かし、相手を切り刻む。`,kind:"Monster"},ブロッカー:{name:"ブロッカー",nameKana:"",description:"体のパーツがそれぞれ武器になっており、分裂して襲ってくる。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:850,defense:1800,attribute:"Dark",type:"Machine",wikiName:"《ブロッカー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D6%A5%ED%A5%C3%A5%AB%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/機械族/攻 850/守1800
体のパーツがそれぞれ武器になっており、分裂して襲ってくる。`,kind:"Monster"},プチテンシ:{name:"プチテンシ",nameKana:"",description:"ちょこまか動き攻撃がなかなか当たらない、とても小さな天使。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:600,defense:900,attribute:"Light",type:"Fairy",wikiName:"《プチテンシ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D7%A5%C1%A5%C6%A5%F3%A5%B7%A1%D5",wikiTextAll:`通常モンスター
星３/光属性/天使族/攻 600/守 900
ちょこまか動き攻撃がなかなか当たらない、とても小さな天使。`,kind:"Monster"},プチモス:{name:"プチモス",nameKana:"",description:"成長したらどんなムシになるか分からない、小さな幼虫。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:300,defense:200,attribute:"Earth",type:"Insect",wikiName:"《プチモス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D7%A5%C1%A5%E2%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星１/地属性/昆虫族/攻 300/守 200
成長したらどんなムシになるか分からない、小さな幼虫。`,kind:"Monster"},プチリュウ:{name:"プチリュウ",nameKana:"",description:"とても小さなドラゴン。小さなからだをいっぱいに使い攻撃する。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:600,defense:700,attribute:"Wind",type:"Dragon",wikiName:"《プチリュウ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D7%A5%C1%A5%EA%A5%E5%A5%A6%A1%D5",wikiTextAll:`通常モンスター
星２/風属性/ドラゴン族/攻 600/守 700
とても小さなドラゴン。小さなからだをいっぱいに使い攻撃する。`,kind:"Monster"},プリズマン:{name:"プリズマン",nameKana:"",description:`透き通った水晶の塊。
光を集めてレーザーを放つ。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:1e3,attribute:"Light",type:"Rock",wikiName:"《プリズマン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D7%A5%EA%A5%BA%A5%DE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星３/光属性/岩石族/攻 800/守1000
透き通った水晶の塊。
光を集めてレーザーを放つ。`,kind:"Monster"},"プリマ・マテリアクトル":{name:"プリマ・マテリアクトル",nameKana:"",description:`遥か彼方の天上界より突如として飛来した外来生命体。
多くの研究者が正体の究明に努めたが、その放たれる光輝や立ち込める瘴気により永きにわたって存在が謎に包まれ、
全容を目にすることは困難を極めた。
しかしながら、近年、新進の研究者の働きによって新種が多数発見された。
その全容が明かされる日も近いだろう。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:3,attribute:"Light",type:"Dragon",pendulumScaleR:1,pendulumScaleL:1,wikiName:"《プリマ・マテリアクトル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D7%A5%EA%A5%DE%A1%A6%A5%DE%A5%C6%A5%EA%A5%A2%A5%AF%A5%C8%A5%EB%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星３/光属性/ドラゴン族/攻   0/守   0
【Ｐスケール：青１/赤１】
このカード名の(2)のＰ効果は１ターンに１度しか使用できない。
(1)：自分フィールドのＸモンスターの攻撃力は、フィールドのＸ素材の数×１００アップする。
(2)：自分フィールドの「マテリアクトル」Ｘモンスター１体を対象として発動できる。
このカードをそのモンスターのＸ素材とする。
その後、自分は１枚ドローする。
【モンスター情報】
遥か彼方の天上界より突如として飛来した外来生命体。
多くの研究者が正体の究明に努めたが、その放たれる光輝や立ち込める瘴気により永きにわたって存在が謎に包まれ、
全容を目にすることは困難を極めた。
しかしながら、近年、新進の研究者の働きによって新種が多数発見された。
その全容が明かされる日も近いだろう。`,kind:"Monster",pendulumDescription:`このカード名の(2)のＰ効果は１ターンに１度しか使用できない。
(1)：自分フィールドのＸモンスターの攻撃力は、フィールドのＸ素材の数×１００アップする。
(2)：自分フィールドの「マテリアクトル」Ｘモンスター１体を対象として発動できる。
このカードをそのモンスターのＸ素材とする。
その後、自分は１枚ドローする。`,defense:0,attack:0},"プリヴェント・ラット":{name:"プリヴェント・ラット",nameKana:"",description:`毛が集まり、かたい皮のようになっている。
守備はかなり高い。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:500,defense:2e3,attribute:"Earth",type:"Beast",wikiName:"《プリヴェント・ラット》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D7%A5%EA%A5%F4%A5%A7%A5%F3%A5%C8%A1%A6%A5%E9%A5%C3%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣族/攻 500/守2000
毛が集まり、かたい皮のようになっている。
守備はかなり高い。`,kind:"Monster"},プロトロン:{name:"プロトロン",nameKana:"",description:`電子空間で見つかる原種。
その情報量は未知数。`,cardType:"Monster",monsterCategories:["Normal"],level:1,attack:100,defense:100,attribute:"Earth",type:"Cyberse",wikiName:"《プロトロン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D7%A5%ED%A5%C8%A5%ED%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星１/地属性/サイバース族/攻 100/守 100 
電子空間で見つかる原種。
その情報量は未知数。`,kind:"Monster"},"ヘラクレス・ビートル":{name:"ヘラクレス・ビートル",nameKana:"",description:`巨大カブトムシ。
つの攻撃とかたい体の守りは強力。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1500,defense:2e3,attribute:"Earth",type:"Insect",wikiName:"《ヘラクレス・ビートル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D8%A5%E9%A5%AF%A5%EC%A5%B9%A1%A6%A5%D3%A1%BC%A5%C8%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/昆虫族/攻1500/守2000
巨大カブトムシ。
つの攻撃とかたい体の守りは強力。`,kind:"Monster"},"ヘルゲート・ディーグ":{name:"ヘルゲート・ディーグ",nameKana:"",description:"おなかに地獄へ通じる扉があり、召還もできる不気味なモンスター。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:700,defense:800,attribute:"Dark",type:"Beast",wikiName:"《ヘルゲート・ディーグ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D8%A5%EB%A5%B2%A1%BC%A5%C8%A1%A6%A5%C7%A5%A3%A1%BC%A5%B0%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/獣族/攻 700/守 800
おなかに地獄へ通じる扉があり、召還もできる不気味なモンスター。`,kind:"Monster"},ヘルバウンド:{name:"ヘルバウンド",nameKana:"",description:`荒野に現れるけものの亡霊。
数が集まるとやっかいなカード。`,cardType:"Monster",monsterCategories:["Normal"],level:1,attack:500,defense:200,attribute:"Dark",type:"Zombie",wikiName:"《ヘルバウンド》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D8%A5%EB%A5%D0%A5%A6%A5%F3%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星１/闇属性/アンデット族/攻 500/守 200
荒野に現れるけものの亡霊。
数が集まるとやっかいなカード。`,kind:"Monster"},ベイオウルフ:{name:"ベイオウルフ",nameKana:"",description:"一度闘いを始めると、決着がつくまで戦うことをやめないバーサーカー。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1650,defense:1e3,attribute:"Earth",type:"BeastWarrior",wikiName:"《ベイオウルフ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D9%A5%A4%A5%AA%A5%A6%A5%EB%A5%D5%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣戦士族/攻1650/守1000
一度闘いを始めると、決着がつくまで戦うことをやめないバーサーカー。`,kind:"Monster"},ベヒゴン:{name:"ベヒゴン",nameKana:"",description:"かなり変わった海へビ。大きな口と大きなキバが特徴。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1350,defense:1e3,attribute:"Water",type:"Aqua",wikiName:"《ベヒゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D9%A5%D2%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1350/守1000
かなり変わった海へビ。大きな口と大きなキバが特徴。`,kind:"Monster"},"ベビー・ティーレックス":{name:"ベビー・ティーレックス",nameKana:"",description:`ティラノサウルスの子供。
非常に凶暴な性格をしている。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1100,defense:700,attribute:"Earth",type:"Dinosaur",wikiName:"《ベビー・ティーレックス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D9%A5%D3%A1%BC%A1%A6%A5%C6%A5%A3%A1%BC%A5%EC%A5%C3%A5%AF%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/恐竜族/攻1100/守 700
ティラノサウルスの子供。
非常に凶暴な性格をしている。`,kind:"Monster"},ベビードラゴン:{name:"ベビードラゴン",nameKana:"",description:`こどもドラゴンとあなどってはいけない。
うちに秘める力は計り知れない。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:700,attribute:"Wind",type:"Dragon",wikiName:"《ベビードラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D9%A5%D3%A1%BC%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星３/風属性/ドラゴン族/攻1200/守 700
こどもドラゴンとあなどってはいけない。
うちに秘める力は計り知れない。`,kind:"Monster"},ペイルビースト:{name:"ペイルビースト",nameKana:"",description:"青白い肌をした、気味の悪い正体不明のモンスター。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1200,attribute:"Earth",type:"Beast",wikiName:"《ペイルビースト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DA%A5%A4%A5%EB%A5%D3%A1%BC%A5%B9%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣族/攻1500/守1200
青白い肌をした、気味の悪い正体不明のモンスター。`,kind:"Monster"},"ホーリー・エルフ":{name:"ホーリー・エルフ",nameKana:"",description:"かよわいエルフだが、聖なる力で身を守りとても守備が高い。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:800,defense:2e3,attribute:"Light",type:"Spellcaster",wikiName:"《ホーリー・エルフ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DB%A1%BC%A5%EA%A1%BC%A1%A6%A5%A8%A5%EB%A5%D5%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/魔法使い族/攻 800/守2000
かよわいエルフだが、聖なる力で身を守りとても守備が高い。`,kind:"Monster"},"ホーリー・ドール":{name:"ホーリー・ドール",nameKana:"",description:`聖なる力を操る人形。
闇での攻撃は強力だ。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1e3,attribute:"Light",type:"Spellcaster",wikiName:"《ホーリー・ドール》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DB%A1%BC%A5%EA%A1%BC%A1%A6%A5%C9%A1%BC%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/魔法使い族/攻1600/守1000
聖なる力を操る人形。
闇での攻撃は強力だ。`,kind:"Monster"},"ホーリー・ナイト・ドラゴン":{name:"ホーリー・ナイト・ドラゴン",nameKana:"",description:"聖なる炎で悪しき者を焼きはらう、神聖な力を持つドラゴン。",cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2500,defense:2300,attribute:"Light",type:"Dragon",wikiName:"《ホーリー・ナイト・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DB%A1%BC%A5%EA%A1%BC%A1%A6%A5%CA%A5%A4%A5%C8%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星７/光属性/ドラゴン族/攻2500/守2300
聖なる炎で悪しき者を焼きはらう、神聖な力を持つドラゴン。`,kind:"Monster"},"ホーリー・パワー":{name:"ホーリー・パワー",nameKana:"",description:"ひょろひょろとしているが、聖なる力に守られている。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:600,defense:800,attribute:"Light",type:"Spellcaster",wikiName:"《ホーリー・パワー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DB%A1%BC%A5%EA%A1%BC%A1%A6%A5%D1%A5%EF%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星２/光属性/魔法使い族/攻 600/守 800
ひょろひょろとしているが、聖なる力に守られている。`,kind:"Monster"},ホログラー:{name:"ホログラー",nameKana:"",description:"様々な幻想を見せ、そのスキをついて攻撃してくる機械。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1100,defense:700,attribute:"Earth",type:"Machine",wikiName:"《ホログラー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DB%A5%ED%A5%B0%A5%E9%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/機械族/攻1100/守 700
様々な幻想を見せ、そのスキをついて攻撃してくる機械。`,kind:"Monster"},"ホワイト・ダストン":{name:"ホワイト・ダストン",nameKana:"",description:`ちっちゃな悪魔、ダストンズの白いヤツ。
自身でも驚きの白さである事をホコリに思っているらしい。`,cardType:"Monster",monsterCategories:["Normal"],level:1,defense:1e3,attribute:"Light",type:"Fiend",wikiName:"《ホワイト・ダストン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DB%A5%EF%A5%A4%A5%C8%A1%A6%A5%C0%A5%B9%A5%C8%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星１/光属性/悪魔族/攻   0/守1000
ちっちゃな悪魔、ダストンズの白いヤツ。
自身でも驚きの白さである事をホコリに思っているらしい。`,kind:"Monster",attack:0},"ホワイト・ドルフィン":{name:"ホワイト・ドルフィン",nameKana:"",description:"頭にツノを持つまっしろなイルカ。大波をおこして攻撃する。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:500,defense:400,attribute:"Water",type:"Fish",wikiName:"《ホワイト・ドルフィン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DB%A5%EF%A5%A4%A5%C8%A1%A6%A5%C9%A5%EB%A5%D5%A5%A3%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星２/水属性/魚族/攻 500/守 400
頭にツノを持つまっしろなイルカ。大波をおこして攻撃する。`,kind:"Monster"},ボーンハイマー:{name:"ボーンハイマー",nameKana:"",description:"海の中をさまよい、獲物を見つけたらあらゆる水分を吸い尽くす。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:850,defense:400,attribute:"Water",type:"Aqua",wikiName:"《ボーンハイマー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DC%A1%BC%A5%F3%A5%CF%A5%A4%A5%DE%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻 850/守 400
海の中をさまよい、獲物を見つけたらあらゆる水分を吸い尽くす。`,kind:"Monster"},"ボルト・エスカルゴ":{name:"ボルト・エスカルゴ",nameKana:"",description:"ネバネバの液をはきかけ、動けなくなったところに電撃アタック！",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1400,defense:1500,attribute:"Water",type:"Thunder",wikiName:"《ボルト・エスカルゴ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DC%A5%EB%A5%C8%A1%A6%A5%A8%A5%B9%A5%AB%A5%EB%A5%B4%A1%D5",wikiTextAll:`通常モンスター
星５/水属性/雷族/攻1400/守1500
ネバネバの液をはきかけ、動けなくなったところに電撃アタック！`,kind:"Monster"},"ボルト・ペンギン":{name:"ボルト・ペンギン",nameKana:"",description:"両腕の電撃ムチで相手をマヒさせ、首を絞めて攻撃する。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1100,defense:800,attribute:"Water",type:"Thunder",wikiName:"《ボルト・ペンギン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DC%A5%EB%A5%C8%A1%A6%A5%DA%A5%F3%A5%AE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/雷族/攻1100/守 800
両腕の電撃ムチで相手をマヒさせ、首を絞めて攻撃する。`,kind:"Monster"},"ポット・ザ・トリック":{name:"ポット・ザ・トリック",nameKana:"",description:"魔術師の命令通りに動く使い魔。あまり強くない。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:400,defense:400,attribute:"Earth",type:"Rock",wikiName:"《ポット・ザ・トリック》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DD%A5%C3%A5%C8%A1%A6%A5%B6%A1%A6%A5%C8%A5%EA%A5%C3%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/岩石族/攻 400/守 400
魔術師の命令通りに動く使い魔。あまり強くない。`,kind:"Monster"},"ポテト＆チップス":{name:"ポテト＆チップス",nameKana:"",description:`いつも仲良しポテトとチップス。
ポテトチップスをかじりながら部屋でごろごろ。
コンソメパンチも美味しい。のりしおも美味しい。
ポテトとチップスの美味しい生活。 `,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:200,defense:200,attribute:"Earth",type:"Plant",wikiName:"《ポテト＆チップス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DD%A5%C6%A5%C8%A1%F5%A5%C1%A5%C3%A5%D7%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/植物族/攻 200/守 200 
いつも仲良しポテトとチップス。
ポテトチップスをかじりながら部屋でごろごろ。
コンソメパンチも美味しい。のりしおも美味しい。
ポテトとチップスの美味しい生活。 `,kind:"Monster"},"マーダーサーカス・ゾンビ":{name:"マーダーサーカス・ゾンビ",nameKana:"",description:`闇の力で生き返ったピエロ。
フラフラとした踊りで死へといざなう。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:1350,attribute:"Dark",type:"Zombie",wikiName:"《マーダーサーカス・ゾンビ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A1%BC%A5%C0%A1%BC%A5%B5%A1%BC%A5%AB%A5%B9%A1%A6%A5%BE%A5%F3%A5%D3%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/アンデット族/攻1350/守   0
闇の力で生き返ったピエロ。
フラフラとした踊りで死へといざなう。`,kind:"Monster",defense:0},マイティガード:{name:"マイティガード",nameKana:"",description:`警備用として開発された機械の戦士。
錆びない金属でできている。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:500,defense:1200,attribute:"Earth",type:"Machine",wikiName:"《マイティガード》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%A4%A5%C6%A5%A3%A5%AC%A1%BC%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/機械族/攻 500/守1200
警備用として開発された機械の戦士。
錆びない金属でできている。`,kind:"Monster"},"マイルド・ターキー":{name:"マイルド・ターキー",nameKana:"",description:`ボウリングへの情熱に身を焦がすワイルドな七面鳥。
ストライクを取るべく鍛え上げられた体は、常に極上の香りを放つ。
まだ見ぬターキーを目指し、日々の練習を欠かさない。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:4,attack:1e3,defense:2e3,attribute:"Fire",type:"WingedBeast",pendulumScaleR:7,pendulumScaleL:7,wikiName:"《マイルド・ターキー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%A4%A5%EB%A5%C9%A1%A6%A5%BF%A1%BC%A5%AD%A1%BC%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星４/炎属性/鳥獣族/攻1000/守2000
【Ｐスケール：青７/赤７】
(1)：１ターンに１度、自分メインフェイズに発動できる。
サイコロを１回振る。
ターン終了時まで、このカードのＰスケールを出た目の数だけ下げる（最小１まで）。
【モンスター情報】
ボウリングへの情熱に身を焦がすワイルドな七面鳥。
ストライクを取るべく鍛え上げられた体は、常に極上の香りを放つ。
まだ見ぬターキーを目指し、日々の練習を欠かさない。`,kind:"Monster",pendulumDescription:`(1)：１ターンに１度、自分メインフェイズに発動できる。
サイコロを１回振る。
ターン終了時まで、このカードのＰスケールを出た目の数だけ下げる（最小１まで）。`},"マウンテン・ウォーリアー":{name:"マウンテン・ウォーリアー",nameKana:"",description:"足場の悪い所でもガンガン動きまわる頑丈な戦士。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:600,defense:1e3,attribute:"Earth",type:"BeastWarrior",wikiName:"《マウンテン・ウォーリアー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%A6%A5%F3%A5%C6%A5%F3%A1%A6%A5%A6%A5%A9%A1%BC%A5%EA%A5%A2%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/獣戦士族/攻 600/守1000
足場の悪い所でもガンガン動きまわる頑丈な戦士。`,kind:"Monster"},マキャノン:{name:"マキャノン",nameKana:"",description:`大砲のような悪魔。
目に見えない早さで目玉の弾を発射する。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1700,defense:1400,attribute:"Dark",type:"Fiend",wikiName:"《マキャノン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%AD%A5%E3%A5%CE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/悪魔族/攻1700/守1400
大砲のような悪魔。
目に見えない早さで目玉の弾を発射する。`,kind:"Monster"},"マグナム・リリィ":{name:"マグナム・リリィ",nameKana:"",description:`いわゆるてっぽうユリ。
花粉の弾を飛ばし相手を攻撃する。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1100,defense:600,attribute:"Earth",type:"Plant",wikiName:"《マグナム・リリィ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%B0%A5%CA%A5%E0%A1%A6%A5%EA%A5%EA%A5%A3%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/植物族/攻1100/守 600
いわゆるてっぽうユリ。
花粉の弾を飛ばし相手を攻撃する。`,kind:"Monster"},マグネッツ１号:{name:"マグネッツ１号",nameKana:"",description:"コンビプレーが得意な戦士。強い磁力を発し、誰にも逃げられない。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:500,attribute:"Earth",type:"Warrior",wikiName:"《マグネッツ１号》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%B0%A5%CD%A5%C3%A5%C4%A3%B1%B9%E6%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/戦士族/攻1000/守 500
コンビプレーが得意な戦士。強い磁力を発し、誰にも逃げられない。`,kind:"Monster"},マグネッツ２号:{name:"マグネッツ２号",nameKana:"",description:"コンビプレーが得意な戦士。電磁コーティングされた鎧は頑丈。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:500,defense:1e3,attribute:"Earth",type:"Warrior",wikiName:"《マグネッツ２号》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%B0%A5%CD%A5%C3%A5%C4%A3%B2%B9%E6%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/戦士族/攻 500/守1000
コンビプレーが得意な戦士。電磁コーティングされた鎧は頑丈。`,kind:"Monster"},マグマン:{name:"マグマン",nameKana:"",description:"マグマの中から生まれたモンスター。ものすごい熱で近づくものは溶ける。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:1e3,attribute:"Earth",type:"Rock",wikiName:"《マグマン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%B0%A5%DE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/岩石族/攻 900/守1000
マグマの中から生まれたモンスター。ものすごい熱で近づくものは溶ける。`,kind:"Monster"},"マシン・アタッカー":{name:"マシン・アタッカー",nameKana:"",description:"特攻用に作り出した機械。突撃で敵をなぎ倒していく。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1600,defense:1300,attribute:"Earth",type:"Machine",wikiName:"《マシン・アタッカー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%B7%A5%F3%A1%A6%A5%A2%A5%BF%A5%C3%A5%AB%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/機械族/攻1600/守1300
特攻用に作り出した機械。突撃で敵をなぎ倒していく。`,kind:"Monster"},"マジカル・ゴースト":{name:"マジカル・ゴースト",nameKana:"",description:"相手に魔法をかけて、恐怖と混乱におとしいれ攻撃する。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1400,attribute:"Dark",type:"Zombie",wikiName:"《マジカル・ゴースト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%B8%A5%AB%A5%EB%A1%A6%A5%B4%A1%BC%A5%B9%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/アンデット族/攻1300/守1400
相手に魔法をかけて、恐怖と混乱におとしいれ攻撃する。`,kind:"Monster"},"マスター・アン・エキスパート":{name:"マスター・アン・エキスパート",nameKana:"",description:`けもの使いの達人と、主人に忠実なけもの。
コンビは完璧。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1e3,attribute:"Earth",type:"Beast",wikiName:"《マスター・アン・エキスパート》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%B9%A5%BF%A1%BC%A1%A6%A5%A2%A5%F3%A1%A6%A5%A8%A5%AD%A5%B9%A5%D1%A1%BC%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣族/攻1200/守1000
けもの使いの達人と、主人に忠実なけもの。
コンビは完璧。`,kind:"Monster"},"マッド・ロブスター":{name:"マッド・ロブスター",nameKana:"",description:`世界中のグルメモンスター達に愛されている高級食材として有名。
凶悪な味が刺激的という。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1700,defense:1e3,attribute:"Water",type:"Aqua",wikiName:"《マッド・ロブスター》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%C3%A5%C9%A1%A6%A5%ED%A5%D6%A5%B9%A5%BF%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻1700/守1000
世界中のグルメモンスター達に愛されている高級食材として有名。
凶悪な味が刺激的という。`,kind:"Monster"},マンイーター:{name:"マンイーター",nameKana:"",description:`人喰い人面花。
毒のある触手で攻撃してくる。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:800,defense:600,attribute:"Earth",type:"Plant",wikiName:"《マンイーター》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%F3%A5%A4%A1%BC%A5%BF%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/植物族/攻 800/守 600
人喰い人面花。
毒のある触手で攻撃してくる。`,kind:"Monster"},マンドラゴン:{name:"マンドラゴン",nameKana:"",description:`悲哀に満ちたドラゴンの魂を宿したマンドリン。
呪いの音色を奏で、聞いたものは恐怖のあまり自我を失ってしまうという。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:5,attack:2500,defense:1e3,attribute:"Earth",type:"Plant",pendulumScaleR:2,pendulumScaleL:2,wikiName:"《マンドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%F3%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星５/地属性/植物族/攻2500/守1000
【Ｐスケール：青２/赤２】
【モンスター情報】
悲哀に満ちたドラゴンの魂を宿したマンドリン。
呪いの音色を奏で、聞いたものは恐怖のあまり自我を失ってしまうという。`,kind:"Monster",pendulumDescription:""},マンモスの墓場:{name:"マンモスの墓場",nameKana:"",description:`仲間のお墓を守るマンモス。
墓荒らしを容赦なく攻撃。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:800,attribute:"Earth",type:"Dinosaur",wikiName:"《マンモスの墓場》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%F3%A5%E2%A5%B9%A4%CE%CA%E8%BE%EC%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/恐竜族/攻1200/守 800
仲間のお墓を守るマンモス。
墓荒らしを容赦なく攻撃。`,kind:"Monster"},ミスターボルケーノ:{name:"ミスターボルケーノ",nameKana:"",description:"炎をあやつる紳士。ふだんは温厚だが怒ると怖い。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:2100,defense:1300,attribute:"Fire",type:"Pyro",wikiName:"《ミスターボルケーノ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DF%A5%B9%A5%BF%A1%BC%A5%DC%A5%EB%A5%B1%A1%BC%A5%CE%A1%D5",wikiTextAll:`通常モンスター
星５/炎属性/炎族/攻2100/守1300
炎をあやつる紳士。ふだんは温厚だが怒ると怖い。`,kind:"Monster"},"ミッドナイト・デビル":{name:"ミッドナイト・デビル",nameKana:"",description:"深夜に現れる鳥のばけもの。呼び出すにはいけにえが必要という。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:800,defense:600,attribute:"Dark",type:"Fiend",wikiName:"《ミッドナイト・デビル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DF%A5%C3%A5%C9%A5%CA%A5%A4%A5%C8%A1%A6%A5%C7%A5%D3%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/悪魔族/攻 800/守 600
深夜に現れる鳥のばけもの。呼び出すにはいけにえが必要という。`,kind:"Monster"},ミノタウルス:{name:"ミノタウルス",nameKana:"",description:`すごい力を持つウシの怪物。
オノひと振りで何でもなぎ倒す。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1700,defense:1e3,attribute:"Earth",type:"BeastWarrior",wikiName:"《ミノタウルス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DF%A5%CE%A5%BF%A5%A6%A5%EB%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣戦士族/攻1700/守1000
すごい力を持つウシの怪物。
オノひと振りで何でもなぎ倒す。`,kind:"Monster"},ミューズの天使:{name:"ミューズの天使",nameKana:"",description:"芸術家の天使。特にハープの演奏は、右に出る者はいない。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:850,defense:900,attribute:"Light",type:"Fairy",wikiName:"《ミューズの天使》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DF%A5%E5%A1%BC%A5%BA%A4%CE%C5%B7%BB%C8%A1%D5",wikiTextAll:`通常モンスター
星３/光属性/天使族/攻 850/守 900
芸術家の天使。特にハープの演奏は、右に出る者はいない。`,kind:"Monster"},ミラージュ:{name:"ミラージュ",nameKana:"",description:"手にする鏡から仲間を呼び出すことのできる鳥のけもの。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1100,defense:1400,attribute:"Light",type:"WingedBeast",wikiName:"《ミラージュ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DF%A5%E9%A1%BC%A5%B8%A5%E5%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/鳥獣族/攻1100/守1400
手にする鏡から仲間を呼び出すことのできる鳥のけもの。`,kind:"Monster"},"メカ・ハンター":{name:"メカ・ハンター",nameKana:"",description:"機械王の命令で、ターゲットを捕まえるまで追いつづけるハンター。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1850,defense:800,attribute:"Dark",type:"Machine",wikiName:"《メカ・ハンター》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%AB%A1%A6%A5%CF%A5%F3%A5%BF%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/機械族/攻1850/守 800
機械王の命令で、ターゲットを捕まえるまで追いつづけるハンター。`,kind:"Monster"},メカニカルスネイル:{name:"メカニカルスネイル",nameKana:"",description:`機械に改造されたカタツムリ。
しかし、スピードはあまり変わらない。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:1e3,attribute:"Dark",type:"Machine",wikiName:"《メカニカルスネイル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%AB%A5%CB%A5%AB%A5%EB%A5%B9%A5%CD%A5%A4%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/機械族/攻 800/守1000
機械に改造されたカタツムリ。
しかし、スピードはあまり変わらない。`,kind:"Monster"},メカファルコン:{name:"メカファルコン",nameKana:"",description:`ジェットエンジンを装備した鷹。
音の速度で飛ぶ事ができる。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1200,attribute:"Wind",type:"Machine",wikiName:"《メカファルコン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%AB%A5%D5%A5%A1%A5%EB%A5%B3%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/機械族/攻1400/守1200
ジェットエンジンを装備した鷹。
音の速度で飛ぶ事ができる。`,kind:"Monster"},メカレオン:{name:"メカレオン",nameKana:"",description:"身体の色を変化させ、どんな場所にでも隠れることができる。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:800,defense:600,attribute:"Water",type:"Reptile",wikiName:"《メカレオン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%AB%A5%EC%A5%AA%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星２/水属性/爬虫類族/攻 800/守 600
身体の色を変化させ、どんな場所にでも隠れることができる。`,kind:"Monster"},"メガ・サンダーボール":{name:"メガ・サンダーボール",nameKana:"",description:"地面を転がり回り、周囲に電撃を放つボール。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:750,defense:600,attribute:"Wind",type:"Thunder",wikiName:"《メガ・サンダーボール》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%AC%A1%A6%A5%B5%A5%F3%A5%C0%A1%BC%A5%DC%A1%BC%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星２/風属性/雷族/攻 750/守 600
地面を転がり回り、周囲に電撃を放つボール。`,kind:"Monster"},メガザウラー:{name:"メガザウラー",nameKana:"",description:`全身にツノの生えた恐竜。
突撃攻撃は強烈だ！`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:1800,defense:2e3,attribute:"Earth",type:"Dinosaur",wikiName:"《メガザウラー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%AC%A5%B6%A5%A6%A5%E9%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星６/地属性/恐竜族/攻1800/守2000
全身にツノの生えた恐竜。
突撃攻撃は強烈だ！`,kind:"Monster"},"メガソニック・アイ":{name:"メガソニック・アイ",nameKana:"",description:`宇宙の果てからやってきた殺人マシン。
謎の金属でできている。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1500,defense:1800,attribute:"Dark",type:"Machine",wikiName:"《メガソニック・アイ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%AC%A5%BD%A5%CB%A5%C3%A5%AF%A1%A6%A5%A2%A5%A4%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/機械族/攻1500/守1800
宇宙の果てからやってきた殺人マシン。
謎の金属でできている。`,kind:"Monster"},メガロスマッシャーＸ:{name:"メガロスマッシャーＸ",nameKana:"",description:`太古の大海原に突如として現れた恐竜型バイオノイド。
自慢の消音装甲で獲物の背後に忍び寄り、音もなく喰らいつくが、
捕食モードになると体が発光する仕様なのでよく逃げられてしまう。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:2e3,attribute:"Water",type:"Dinosaur",wikiName:"《メガロスマッシャーＸ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%AC%A5%ED%A5%B9%A5%DE%A5%C3%A5%B7%A5%E3%A1%BC%A3%D8%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/恐竜族/攻2000/守   0
太古の大海原に突如として現れた恐竜型バイオノイド。
自慢の消音装甲で獲物の背後に忍び寄り、音もなく喰らいつくが、
捕食モードになると体が発光する仕様なのでよく逃げられてしまう。`,kind:"Monster",defense:0},"メギラス・ライト":{name:"メギラス・ライト",nameKana:"",description:"ブキミな目から悪しき光を放ち、相手にダメージを与える。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:600,attribute:"Dark",type:"Fiend",wikiName:"《メギラス・ライト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%AE%A5%E9%A5%B9%A1%A6%A5%E9%A5%A4%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/悪魔族/攻 900/守 600
ブキミな目から悪しき光を放ち、相手にダメージを与える。`,kind:"Monster"},"メタファイズ・アームド・ドラゴン":{name:"メタファイズ・アームド・ドラゴン",nameKana:"",description:"崇高なる存在は幻の如く。其の竜は頂に佇む。",cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2800,defense:1e3,attribute:"Light",type:"Wyrm",wikiName:"《メタファイズ・アームド・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%BF%A5%D5%A5%A1%A5%A4%A5%BA%A1%A6%A5%A2%A1%BC%A5%E0%A5%C9%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星７/光属性/幻竜族/攻2800/守1000
崇高なる存在は幻の如く。其の竜は頂に佇む。`,kind:"Monster"},"メタル・ガーディアン":{name:"メタル・ガーディアン",nameKana:"",description:`魔界の宝を守護する悪魔。
暗闇での守備は相当かたい。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1150,defense:2150,attribute:"Dark",type:"Fiend",wikiName:"《メタル・ガーディアン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%BF%A5%EB%A1%A6%A5%AC%A1%BC%A5%C7%A5%A3%A5%A2%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/悪魔族/攻1150/守2150
魔界の宝を守護する悪魔。
暗闇での守備は相当かたい。`,kind:"Monster"},"メタル・フィッシュ":{name:"メタル・フィッシュ",nameKana:"",description:"金属の魚。鋭いカッターになっている尾ビレで相手を切り刻む。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1600,defense:1900,attribute:"Water",type:"Machine",wikiName:"《メタル・フィッシュ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%BF%A5%EB%A1%A6%A5%D5%A5%A3%A5%C3%A5%B7%A5%E5%A1%D5",wikiTextAll:`通常モンスター
星５/水属性/機械族/攻1600/守1900
金属の魚。鋭いカッターになっている尾ビレで相手を切り刻む。`,kind:"Monster"},"メタルフォーゼ・ゴルドライバー":{name:"メタルフォーゼ・ゴルドライバー",nameKana:"",description:`黄金のボディを煌めかせ、豪快なドリフト走法で敵をなぎ倒す。
しばしば派手にスピンをやらかすが、本人はそれが必殺技だというスタンスを崩さない。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:4,attack:1900,defense:500,attribute:"Fire",type:"Psychic",pendulumScaleR:1,pendulumScaleL:1,wikiName:"《メタルフォーゼ・ゴルドライバー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%BF%A5%EB%A5%D5%A5%A9%A1%BC%A5%BC%A1%A6%A5%B4%A5%EB%A5%C9%A5%E9%A5%A4%A5%D0%A1%BC%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星４/炎属性/サイキック族/攻1900/守 500
【Ｐスケール：青１/赤１】
(1)：１ターンに１度、このカード以外の自分フィールドの表側表示のカード１枚を対象として発動できる。
そのカードを破壊し、デッキから「メタルフォーゼ」魔法・罠カード１枚を選んで自分フィールドにセットする。
【モンスター情報】
黄金のボディを煌めかせ、豪快なドリフト走法で敵をなぎ倒す。
しばしば派手にスピンをやらかすが、本人はそれが必殺技だというスタンスを崩さない。`,kind:"Monster",pendulumDescription:`(1)：１ターンに１度、このカード以外の自分フィールドの表側表示のカード１枚を対象として発動できる。
そのカードを破壊し、デッキから「メタルフォーゼ」魔法・罠カード１枚を選んで自分フィールドにセットする。`},"メタルフォーゼ・シルバード":{name:"メタルフォーゼ・シルバード",nameKana:"",description:`白銀の亜光速ジェットを操る美しき狙撃手。
常識を超えたスピードで疾走る彼女を捉える事は不可能に近く、
光の速さで繰り出される一撃から逃れる術は無い。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:3,attack:1700,defense:100,attribute:"Fire",type:"Psychic",pendulumScaleR:1,pendulumScaleL:1,wikiName:"《メタルフォーゼ・シルバード》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%BF%A5%EB%A5%D5%A5%A9%A1%BC%A5%BC%A1%A6%A5%B7%A5%EB%A5%D0%A1%BC%A5%C9%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星３/炎属性/サイキック族/攻1700/守 100
【Ｐスケール：青１/赤１】
(1)：１ターンに１度、このカード以外の
自分フィールドの表側表示のカード１枚を対象として発動できる。
そのカードを破壊し、デッキから
「メタルフォーゼ」魔法・罠カード１枚を選んで自分フィールドにセットする。
【モンスター情報】
白銀の亜光速ジェットを操る美しき狙撃手。
常識を超えたスピードで疾走る彼女を捉える事は不可能に近く、
光の速さで繰り出される一撃から逃れる術は無い。`,kind:"Monster",pendulumDescription:`(1)：１ターンに１度、このカード以外の
自分フィールドの表側表示のカード１枚を対象として発動できる。
そのカードを破壊し、デッキから
「メタルフォーゼ」魔法・罠カード１枚を選んで自分フィールドにセットする。`},"メタルフォーゼ・スティエレン":{name:"メタルフォーゼ・スティエレン",nameKana:"",description:`黒鉄の機体に秘められた魂が覚醒する時、
鋼鉄は秘金属へと昇華し、人機一体の勇士となる。
その身に刻まれし魂鋼を燃焼させろ！――錬装融合！！`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:2,defense:2100,attribute:"Fire",type:"Psychic",pendulumScaleR:8,pendulumScaleL:8,wikiName:"《メタルフォーゼ・スティエレン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%BF%A5%EB%A5%D5%A5%A9%A1%BC%A5%BC%A1%A6%A5%B9%A5%C6%A5%A3%A5%A8%A5%EC%A5%F3%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星２/炎属性/サイキック族/攻   0/守2100
【Ｐスケール：青８/赤８】
(1)：１ターンに１度、このカード以外の
自分フィールドの表側表示のカード１枚を対象として発動できる。
そのカードを破壊し、デッキから
「メタルフォーゼ」魔法・罠カード１枚を選んで自分フィールドにセットする。
【モンスター情報】
黒鉄の機体に秘められた魂が覚醒する時、
鋼鉄は秘金属へと昇華し、人機一体の勇士となる。
その身に刻まれし魂鋼を燃焼させろ！――錬装融合！！`,kind:"Monster",pendulumDescription:`(1)：１ターンに１度、このカード以外の
自分フィールドの表側表示のカード１枚を対象として発動できる。
そのカードを破壊し、デッキから
「メタルフォーゼ」魔法・罠カード１枚を選んで自分フィールドにセットする。`,attack:0},"メタルフォーゼ・ヴォルフレイム":{name:"メタルフォーゼ・ヴォルフレイム",nameKana:"",description:`赤熱の魂鋼を持つ上級戦士。
世界を終末へと誘う赤き真竜の脅威と対峙した時、
呼応するかのように次元を超えて現われた光の意志に導かれ、
鍛えし鋼を身にまとう術を開花させた。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:7,attack:2400,defense:2e3,attribute:"Fire",type:"Psychic",pendulumScaleR:8,pendulumScaleL:8,wikiName:"《メタルフォーゼ・ヴォルフレイム》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%BF%A5%EB%A5%D5%A5%A9%A1%BC%A5%BC%A1%A6%A5%F4%A5%A9%A5%EB%A5%D5%A5%EC%A5%A4%A5%E0%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星７/炎属性/サイキック族/攻2400/守2000
【Ｐスケール：青８/赤８】
(1)：１ターンに１度、このカード以外の
自分フィールドの表側表示のカード１枚を対象として発動できる。
そのカードを破壊し、デッキから
「メタルフォーゼ」魔法・罠カード１枚を選んで自分フィールドにセットする。
【モンスター情報】
赤熱の魂鋼を持つ上級戦士。
世界を終末へと誘う赤き真竜の脅威と対峙した時、
呼応するかのように次元を超えて現われた光の意志に導かれ、
鍛えし鋼を身にまとう術を開花させた。`,kind:"Monster",pendulumDescription:`(1)：１ターンに１度、このカード以外の
自分フィールドの表側表示のカード１枚を対象として発動できる。
そのカードを破壊し、デッキから
「メタルフォーゼ」魔法・罠カード１枚を選んで自分フィールドにセットする。`},"メテオ・ドラゴン":{name:"メテオ・ドラゴン",nameKana:"",description:"宇宙の果てから地球におちてきた、流星のドラゴン。",cardType:"Monster",monsterCategories:["Normal"],level:6,attack:1800,defense:2e3,attribute:"Earth",type:"Dragon",wikiName:"《メテオ・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%C6%A5%AA%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星６/地属性/ドラゴン族/攻1800/守2000
宇宙の果てから地球におちてきた、流星のドラゴン。`,kind:"Monster"},メデューサの亡霊:{name:"メデューサの亡霊",nameKana:"",description:`毒ヘビの頭を持つモンスター。
目をあわせると、石にされてしまう。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1200,attribute:"Dark",type:"Zombie",wikiName:"《メデューサの亡霊》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%C7%A5%E5%A1%BC%A5%B5%A4%CE%CB%B4%CE%EE%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/アンデット族/攻1500/守1200
毒ヘビの頭を持つモンスター。
目をあわせると、石にされてしまう。`,kind:"Monster"},メルキド四面獣:{name:"メルキド四面獣",nameKana:"",description:"４つの仮面を切り替えながら、４種類の攻撃をしてくる化け物。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1200,attribute:"Dark",type:"Fiend",wikiName:"《メルキド四面獣》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%EB%A5%AD%A5%C9%BB%CD%CC%CC%BD%C3%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1500/守1200
４つの仮面を切り替えながら、４種類の攻撃をしてくる化け物。`,kind:"Monster"},"メルフィー・ラビィ":{name:"メルフィー・ラビィ",nameKana:"",description:`ラビィはこの切り株がいちばんのお気に入り。いつも登ってまわりをきょろきょろ。

メルフィーの森には個性豊かでかわいい動物たちがいっぱい。
切り株を見つけるとついつい座りたくなっちゃうそこのあなた！
さぁ、ラビィといっしょにメルフィーのお友達を探しに行きましょう♪`,cardType:"Monster",monsterCategories:["Normal"],level:2,defense:2100,attribute:"Earth",type:"Beast",wikiName:"《メルフィー・ラビィ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E1%A5%EB%A5%D5%A5%A3%A1%BC%A1%A6%A5%E9%A5%D3%A5%A3%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/獣族/攻   0/守2100
ラビィはこの切り株がいちばんのお気に入り。いつも登ってまわりをきょろきょろ。

メルフィーの森には個性豊かでかわいい動物たちがいっぱい。
切り株を見つけるとついつい座りたくなっちゃうそこのあなた！
さぁ、ラビィといっしょにメルフィーのお友達を探しに行きましょう♪`,kind:"Monster",attack:0},モリンフェン:{name:"モリンフェン",nameKana:"",description:"長い腕とかぎづめが特徴の奇妙な姿をした悪魔。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1550,defense:1300,attribute:"Dark",type:"Fiend",wikiName:"《モリンフェン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E2%A5%EA%A5%F3%A5%D5%A5%A7%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/悪魔族/攻1550/守1300
長い腕とかぎづめが特徴の奇妙な姿をした悪魔。`,kind:"Monster"},"モン・ラーバス":{name:"モン・ラーバス",nameKana:"",description:"ラーバスがより進化したけもの。力がパワーアップしている。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1400,attribute:"Earth",type:"Beast",wikiName:"《モン・ラーバス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E2%A5%F3%A1%A6%A5%E9%A1%BC%A5%D0%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣族/攻1300/守1400
ラーバスがより進化したけもの。力がパワーアップしている。`,kind:"Monster"},"モンスター・エッグ":{name:"モンスター・エッグ",nameKana:"",description:`卵のカラに身を包んだ謎の戦士。
カラを飛ばして攻撃する。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:600,defense:900,attribute:"Earth",type:"Warrior",wikiName:"《モンスター・エッグ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E2%A5%F3%A5%B9%A5%BF%A1%BC%A1%A6%A5%A8%A5%C3%A5%B0%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/戦士族/攻 600/守 900
卵のカラに身を包んだ謎の戦士。
カラを飛ばして攻撃する。`,kind:"Monster"},モンスタートル:{name:"モンスタートル",nameKana:"",description:"トゲのついたこうらを身につけたカメ。とても凶暴で人になつかない。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:1e3,attribute:"Water",type:"Aqua",wikiName:"《モンスタートル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E2%A5%F3%A5%B9%A5%BF%A1%BC%A5%C8%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻 800/守1000
トゲのついたこうらを身につけたカメ。とても凶暴で人になつかない。`,kind:"Monster"},ヤシの木:{name:"ヤシの木",nameKana:"",description:`意志をもつヤシの木。
実を落として攻撃。
実の中のミルクはおいしい。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:800,defense:600,attribute:"Earth",type:"Plant",wikiName:"《ヤシの木》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E4%A5%B7%A4%CE%CC%DA%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/植物族/攻 800/守 600
意志をもつヤシの木。
実を落として攻撃。
実の中のミルクはおいしい。`,kind:"Monster"},ヤマタノ竜絵巻:{name:"ヤマタノ竜絵巻",nameKana:"",description:"絵巻のドラゴンが実体化して攻撃する。守備はかなり低い。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:900,defense:300,attribute:"Wind",type:"Dragon",wikiName:"《ヤマタノ竜絵巻》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E4%A5%DE%A5%BF%A5%CE%CE%B5%B3%A8%B4%AC%A1%D5",wikiTextAll:`通常モンスター
星２/風属性/ドラゴン族/攻 900/守 300
絵巻のドラゴンが実体化して攻撃する。守備はかなり低い。`,kind:"Monster"},ヤマドラン:{name:"ヤマドラン",nameKana:"",description:"三つの頭でつぎつぎ炎をはき、あたり一面を炎の海にする！",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1600,defense:1800,attribute:"Fire",type:"Dragon",wikiName:"《ヤマドラン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E4%A5%DE%A5%C9%A5%E9%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星５/炎属性/ドラゴン族/攻1600/守1800
三つの頭でつぎつぎ炎をはき、あたり一面を炎の海にする！`,kind:"Monster"},ヤランゾ:{name:"ヤランゾ",nameKana:"",description:"宝箱のフタを開けようとする盗賊を、箱から飛び出し襲う。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1500,attribute:"Dark",type:"Zombie",wikiName:"《ヤランゾ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E4%A5%E9%A5%F3%A5%BE%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/アンデット族/攻1300/守1500
宝箱のフタを開けようとする盗賊を、箱から飛び出し襲う。`,kind:"Monster"},ヨルムンガルド:{name:"ヨルムンガルド",nameKana:"",description:`神話の世界に出てくるヘビ。
非常に長い。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:900,attribute:"Earth",type:"Reptile",wikiName:"《ヨルムンガルド》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E8%A5%EB%A5%E0%A5%F3%A5%AC%A5%EB%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/爬虫類族/攻1200/守 900
神話の世界に出てくるヘビ。
非常に長い。`,kind:"Monster"},ラーバス:{name:"ラーバス",nameKana:"",description:"素早く動く鳥のばけもの。細く長い腕をからませ絞めあげる。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:1e3,attribute:"Earth",type:"Beast",wikiName:"《ラーバス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A1%BC%A5%D0%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/獣族/攻 800/守1000
素早く動く鳥のばけもの。細く長い腕をからませ絞めあげる。`,kind:"Monster"},ライドロン:{name:"ライドロン",nameKana:"",description:`高い適合能力を持った電子獣。
縄張り意識が強い。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:2e3,attribute:"Earth",type:"Cyberse",wikiName:"《ライドロン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C9%A5%ED%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/サイバース族/攻2000/守   0
高い適合能力を持った電子獣。
縄張り意識が強い。`,kind:"Monster",defense:0},ライブラの魔法秤:{name:"ライブラの魔法秤",nameKana:"",description:`意思を持った天秤。
世の中の均衡を保っているが、しばしば間違った方に錘星を乗せてしまう。`,cardType:"Monster",monsterCategories:["Normal","Tuner","Pendulum"],level:4,attack:1e3,defense:1e3,attribute:"Water",type:"Spellcaster",pendulumScaleR:5,pendulumScaleL:5,wikiName:"《ライブラの魔法秤》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%D6%A5%E9%A4%CE%CB%E2%CB%A1%C7%E9%A1%D5",wikiTextAll:`ペンデュラム・チューナー・通常モンスター
星４/水属性/魔法使い族/攻1000/守1000
【Ｐスケール：青５/赤５】
このカード名のＰ効果は１ターンに１度しか使用できない。
(1)：１～６までの任意のレベルを宣言し、
自分フィールドの表側表示モンスター２体を対象として発動できる。
ターン終了時まで、対象のモンスター１体のレベルを宣言したレベル分だけ下げ、
もう１体のモンスターのレベルを宣言したレベル分だけ上げる。
【モンスター情報】
意思を持った天秤。
世の中の均衡を保っているが、しばしば間違った方に錘星を乗せてしまう。`,kind:"Monster",pendulumDescription:`このカード名のＰ効果は１ターンに１度しか使用できない。
(1)：１～６までの任意のレベルを宣言し、
自分フィールドの表側表示モンスター２体を対象として発動できる。
ターン終了時まで、対象のモンスター１体のレベルを宣言したレベル分だけ下げ、
もう１体のモンスターのレベルを宣言したレベル分だけ上げる。`},ラビードラゴン:{name:"ラビードラゴン",nameKana:"",description:`雪原に生息するドラゴンの突然変異種。
巨大な耳は数キロ離れた物音を聴き分け、
驚異的な跳躍力と相俟って狙った獲物は逃さない。`,cardType:"Monster",monsterCategories:["Normal"],level:8,attack:2950,defense:2900,attribute:"Light",type:"Dragon",wikiName:"《ラビードラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%D3%A1%BC%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星８/光属性/ドラゴン族/攻2950/守2900
雪原に生息するドラゴンの突然変異種。
巨大な耳は数キロ離れた物音を聴き分け、
驚異的な跳躍力と相俟って狙った獲物は逃さない。`,kind:"Monster"},ラブラドライドラゴン:{name:"ラブラドライドラゴン",nameKana:"",description:`ラブラドレッセンスと呼ばれる特有の美しい輝きを放つウロコを持ったドラゴン。
そのウロコから生まれる眩い輝きは、見た者の魂を導き、感情を解放させる力を持つ。
――その光は前世の記憶を辿り、人々を巡り合わせると伝えられる。`,cardType:"Monster",monsterCategories:["Normal","Tuner"],level:6,defense:2400,attribute:"Dark",type:"Dragon",wikiName:"《ラブラドライドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%D6%A5%E9%A5%C9%A5%E9%A5%A4%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`チューナー・通常モンスター
星６/闇属性/ドラゴン族/攻   0/守2400
ラブラドレッセンスと呼ばれる特有の美しい輝きを放つウロコを持ったドラゴン。
そのウロコから生まれる眩い輝きは、見た者の魂を導き、感情を解放させる力を持つ。
――その光は前世の記憶を辿り、人々を巡り合わせると伝えられる。`,kind:"Monster",attack:0},ラムーン:{name:"ラムーン",nameKana:"",description:"月に住む魔法使い。月の持つ魔力で相手を魅了する。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1200,defense:1700,attribute:"Light",type:"Spellcaster",wikiName:"《ラムーン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%E0%A1%BC%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星５/光属性/魔法使い族/攻1200/守1700
月に住む魔法使い。月の持つ魔力で相手を魅了する。`,kind:"Monster"},"ララ・ライウーン":{name:"ララ・ライウーン",nameKana:"",description:`電気を帯びた雲形のモンスター。
何でも溶かす危険な雨を降らせる。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:600,defense:600,attribute:"Wind",type:"Thunder",wikiName:"《ララ・ライウーン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%E9%A1%A6%A5%E9%A5%A4%A5%A6%A1%BC%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星２/風属性/雷族/攻 600/守 600
電気を帯びた雲形のモンスター。
何でも溶かす危険な雨を降らせる。`,kind:"Monster"},ランスフォリンクス:{name:"ランスフォリンクス",nameKana:"",description:`太古の絶滅を生き延びた幻の翼竜。
その姿はより攻撃的に進化し、クチバシは全てを貫く槍と化した。
・・・それでも主食は魚らしい。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:6,attack:2500,defense:800,attribute:"Wind",type:"Dinosaur",pendulumScaleR:7,pendulumScaleL:7,wikiName:"《ランスフォリンクス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%F3%A5%B9%A5%D5%A5%A9%A5%EA%A5%F3%A5%AF%A5%B9%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星６/風属性/恐竜族/攻2500/守 800
【Ｐスケール：青７/赤７】
(1)：自分の通常モンスターが守備表示モンスターを攻撃した場合、
その守備力を攻撃力が超えた分だけ相手に戦闘ダメージを与える。
【モンスター情報】
太古の絶滅を生き延びた幻の翼竜。
その姿はより攻撃的に進化し、クチバシは全てを貫く槍と化した。
・・・それでも主食は魚らしい。`,kind:"Monster",pendulumDescription:`(1)：自分の通常モンスターが守備表示モンスターを攻撃した場合、
その守備力を攻撃力が超えた分だけ相手に戦闘ダメージを与える。`},ランドスターの剣士:{name:"ランドスターの剣士",nameKana:"",description:"剣の腕は未熟だが、不思議な能力を持つ妖精剣士。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:500,defense:1200,attribute:"Earth",type:"Warrior",wikiName:"《ランドスターの剣士》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%F3%A5%C9%A5%B9%A5%BF%A1%BC%A4%CE%B7%F5%BB%CE%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/戦士族/攻 500/守1200
剣の腕は未熟だが、不思議な能力を持つ妖精剣士。`,kind:"Monster"},ランプの魔人:{name:"ランプの魔人",nameKana:"",description:`魔法のランプから現れる魔人。
呼び出した者に服従する。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1200,attribute:"Dark",type:"Fiend",wikiName:"《ランプの魔人》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%F3%A5%D7%A4%CE%CB%E2%BF%CD%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1400/守1200
魔法のランプから現れる魔人。
呼び出した者に服従する。`,kind:"Monster"},"ランプの魔精・ラ・ジーン":{name:"ランプの魔精・ラ・ジーン",nameKana:"",description:"呼び出した主人の言うことを、何でも聞いてくれるランプの精。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,defense:1e3,attribute:"Dark",type:"Fiend",wikiName:"《ランプの魔精・ラ・ジーン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%F3%A5%D7%A4%CE%CB%E2%C0%BA%A1%A6%A5%E9%A1%A6%A5%B8%A1%BC%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1800/守1000
呼び出した主人の言うことを、何でも聞いてくれるランプの精。`,kind:"Monster"},"リクイド・ビースト":{name:"リクイド・ビースト",nameKana:"",description:"ドロドロ溶けて、水の中を自在に移動できる液体生命体。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:950,defense:800,attribute:"Water",type:"Aqua",wikiName:"《リクイド・ビースト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EA%A5%AF%A5%A4%A5%C9%A1%A6%A5%D3%A1%BC%A5%B9%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻 950/守 800
ドロドロ溶けて、水の中を自在に移動できる液体生命体。`,kind:"Monster"},リザード兵:{name:"リザード兵",nameKana:"",description:`ドラゴンから派生した獣人種。
ドラゴン族の中では小型で敏捷性に優れ、戦略性に富んでいる。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1100,defense:800,attribute:"Wind",type:"Dragon",wikiName:"《リザード兵》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EA%A5%B6%A1%BC%A5%C9%CA%BC%A1%D5",wikiTextAll:`通常モンスター
星３/風属性/ドラゴン族/攻1100/守 800
ドラゴンから派生した獣人種。
ドラゴン族の中では小型で敏捷性に優れ、戦略性に富んでいる。`,kind:"Monster"},"ルート・ウォーター":{name:"ルート・ウォーター",nameKana:"",description:"海にひそむ半魚人。暗黒の大津波を起こして攻撃する。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:800,attribute:"Water",type:"Fish",wikiName:"《ルート・ウォーター》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EB%A1%BC%A5%C8%A1%A6%A5%A6%A5%A9%A1%BC%A5%BF%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/魚族/攻 900/守 800
海にひそむ半魚人。暗黒の大津波を起こして攻撃する。`,kind:"Monster"},"ルード・カイザー":{name:"ルード・カイザー",nameKana:"",description:"両手に持つ魔人のオノの破壊力は、かなり強力だ！",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1800,defense:1600,attribute:"Earth",type:"BeastWarrior",wikiName:"《ルード・カイザー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EB%A1%BC%A5%C9%A1%A6%A5%AB%A5%A4%A5%B6%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/獣戦士族/攻1800/守1600
両手に持つ魔人のオノの破壊力は、かなり強力だ！`,kind:"Monster"},ルイーズ:{name:"ルイーズ",nameKana:"",description:"体は小さいが、草原での守備力はかなり強い。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1500,attribute:"Earth",type:"BeastWarrior",wikiName:"《ルイーズ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EB%A5%A4%A1%BC%A5%BA%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣戦士族/攻1200/守1500
体は小さいが、草原での守備力はかなり強い。`,kind:"Monster"},"レアメタル・ソルジャー":{name:"レアメタル・ソルジャー",nameKana:"",description:`全身がメタルの装甲で覆われている戦士。
｢レアメタル・レディ」と融合し、パワーアップする。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:450,attribute:"Earth",type:"Machine",wikiName:"《レアメタル・ソルジャー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EC%A5%A2%A5%E1%A5%BF%A5%EB%A1%A6%A5%BD%A5%EB%A5%B8%A5%E3%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/機械族/攻 900/守 450
全身がメタルの装甲で覆われている戦士。
｢レアメタル・レディ」と融合し、パワーアップする。`,kind:"Monster"},"レアメタル・レディ":{name:"レアメタル・レディ",nameKana:"",description:`全身がメタルの装甲で覆われている女戦士。
｢レアメタル・ソルジャー」と融合し、パワーアップする。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:450,defense:900,attribute:"Earth",type:"Machine",wikiName:"《レアメタル・レディ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EC%A5%A2%A5%E1%A5%BF%A5%EB%A1%A6%A5%EC%A5%C7%A5%A3%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/機械族/攻 450/守 900
全身がメタルの装甲で覆われている女戦士。
｢レアメタル・ソルジャー」と融合し、パワーアップする。`,kind:"Monster"},"レインボー・フィッシュ":{name:"レインボー・フィッシュ",nameKana:"",description:"世にも珍しい七色の魚。捕まえるのはかなり難しい。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,defense:800,attribute:"Water",type:"Fish",wikiName:"《レインボー・フィッシュ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EC%A5%A4%A5%F3%A5%DC%A1%BC%A1%A6%A5%D5%A5%A3%A5%C3%A5%B7%A5%E5%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/魚族/攻1800/守 800
世にも珍しい七色の魚。捕まえるのはかなり難しい。`,kind:"Monster"},"レインボー・マリン・マーメイド":{name:"レインボー・マリン・マーメイド",nameKana:"",description:"空に大きな虹の橋がかかると現れる、珍しいマーメイド。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1550,defense:1700,attribute:"Water",type:"Fish",wikiName:"《レインボー・マリン・マーメイド》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EC%A5%A4%A5%F3%A5%DC%A1%BC%A1%A6%A5%DE%A5%EA%A5%F3%A1%A6%A5%DE%A1%BC%A5%E1%A5%A4%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星５/水属性/魚族/攻1550/守1700
空に大きな虹の橋がかかると現れる、珍しいマーメイド。`,kind:"Monster"},"レオ・ウィザード":{name:"レオ・ウィザード",nameKana:"",description:`黒いマントをはおった魔術師。
正体は言葉を話すシシ。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1350,defense:1200,attribute:"Earth",type:"Spellcaster",wikiName:"《レオ・ウィザード》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EC%A5%AA%A1%A6%A5%A6%A5%A3%A5%B6%A1%BC%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/魔法使い族/攻1350/守1200
黒いマントをはおった魔術師。
正体は言葉を話すシシ。`,kind:"Monster"},レオグン:{name:"レオグン",nameKana:"",description:`百獣の王のような立派なたてがみを持つシシ。
体も大きい。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1750,defense:1550,attribute:"Earth",type:"Beast",wikiName:"《レオグン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EC%A5%AA%A5%B0%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/獣族/攻1750/守1550
百獣の王のような立派なたてがみを持つシシ。
体も大きい。`,kind:"Monster"},"レッサー・ドラゴン":{name:"レッサー・ドラゴン",nameKana:"",description:"あまり強くなく、ブレス攻撃もやらない低級のドラゴン。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1e3,attribute:"Wind",type:"Dragon",wikiName:"《レッサー・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EC%A5%C3%A5%B5%A1%BC%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/ドラゴン族/攻1200/守1000
あまり強くなく、ブレス攻撃もやらない低級のドラゴン。`,kind:"Monster"},"レッド・エース":{name:"レッド・エース",nameKana:"",description:`死の呪いをかけてくる魔法使い。
呪文を聞くと、気が遠くなる。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:800,attribute:"Dark",type:"Spellcaster",wikiName:"《レッド・エース》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EC%A5%C3%A5%C9%A1%A6%A5%A8%A1%BC%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/魔法使い族/攻1000/守 800
死の呪いをかけてくる魔法使い。
呪文を聞くと、気が遠くなる。`,kind:"Monster"},"レッド・サイクロプス":{name:"レッド・サイクロプス",nameKana:"",description:"「冥界の魔王 ハ・デス」に仕える一つ目の巨人。ツノの攻撃で敵を粉砕する。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,defense:1700,attribute:"Dark",type:"Fiend",wikiName:"《レッド・サイクロプス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EC%A5%C3%A5%C9%A1%A6%A5%B5%A5%A4%A5%AF%A5%ED%A5%D7%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1800/守1700
「冥界の魔王 ハ・デス」に仕える一つ目の巨人。ツノの攻撃で敵を粉砕する。`,kind:"Monster"},"レッド・ドラゴン":{name:"レッド・ドラゴン",nameKana:"",description:"ファイヤーボールをはき辺りを火の海にする、真っ赤なドラゴン。",cardType:"Monster",monsterCategories:["Normal"],level:6,attack:1700,defense:1900,attribute:"Fire",type:"Dragon",wikiName:"《レッド・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EC%A5%C3%A5%C9%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星６/炎属性/ドラゴン族/攻1700/守1900
ファイヤーボールをはき辺りを火の海にする、真っ赤なドラゴン。`,kind:"Monster"},ロイヤルガード:{name:"ロイヤルガード",nameKana:"",description:"王族を守るために開発された、意志を持つ機械の兵隊。",cardType:"Monster",monsterCategories:["Normal"],level:6,attack:1900,defense:2200,attribute:"Earth",type:"Machine",wikiName:"《ロイヤルガード》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%ED%A5%A4%A5%E4%A5%EB%A5%AC%A1%BC%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星６/地属性/機械族/攻1900/守2200
王族を守るために開発された、意志を持つ機械の兵隊。`,kind:"Monster"},ロックメイス:{name:"ロックメイス",nameKana:"",description:"心の良い部分を封印して、相手を悪魔の手先にしてしまう。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1050,defense:1200,attribute:"Dark",type:"Fiend",wikiName:"《ロックメイス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%ED%A5%C3%A5%AF%A5%E1%A5%A4%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1050/守1200
心の良い部分を封印して、相手を悪魔の手先にしてしまう。`,kind:"Monster"},ワームドレイク:{name:"ワームドレイク",nameKana:"",description:"その長い体に巻き込まれたら最後、二度と逃げる事はできない。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1500,attribute:"Earth",type:"Reptile",wikiName:"《ワームドレイク》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EF%A1%BC%A5%E0%A5%C9%A5%EC%A5%A4%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/爬虫類族/攻1400/守1500
その長い体に巻き込まれたら最後、二度と逃げる事はできない。`,kind:"Monster"},ワイト:{name:"ワイト",nameKana:"",description:`どこにでも出てくるガイコツのおばけ。
攻撃は弱いが集まると大変。`,cardType:"Monster",monsterCategories:["Normal"],level:1,attack:300,defense:200,attribute:"Dark",type:"Zombie",wikiName:"《ワイト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EF%A5%A4%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星１/闇属性/アンデット族/攻 300/守 200
どこにでも出てくるガイコツのおばけ。
攻撃は弱いが集まると大変。`,kind:"Monster"},ワイバーン:{name:"ワイバーン",nameKana:"",description:"羽をはばたかせて強力な竜巻をおこす。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1e3,attribute:"Wind",type:"WingedBeast",wikiName:"《ワイバーン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EF%A5%A4%A5%D0%A1%BC%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/鳥獣族/攻1200/守1000
羽をはばたかせて強力な竜巻をおこす。`,kind:"Monster"},ワイバーンの戦士:{name:"ワイバーンの戦士",nameKana:"",description:"剣技にすぐれたトカゲ人間。音の速さで剣をふるう。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1200,attribute:"Earth",type:"Beast",wikiName:"《ワイバーンの戦士》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EF%A5%A4%A5%D0%A1%BC%A5%F3%A4%CE%C0%EF%BB%CE%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣族/攻1500/守1200
剣技にすぐれたトカゲ人間。音の速さで剣をふるう。`,kind:"Monster"},"ワイルド・ラプター":{name:"ワイルド・ラプター",nameKana:"",description:`走ることが得意な恐竜。
鋭いかぎづめで攻撃する。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:800,attribute:"Earth",type:"Dinosaur",wikiName:"《ワイルド・ラプター》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EF%A5%A4%A5%EB%A5%C9%A1%A6%A5%E9%A5%D7%A5%BF%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/恐竜族/攻1500/守 800
走ることが得意な恐竜。
鋭いかぎづめで攻撃する。`,kind:"Monster"},ヴァルキリー:{name:"ヴァルキリー",nameKana:"",description:`神話に出てくる闘いの天使。
手にする槍で天罰を下す。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1800,defense:1700,attribute:"Light",type:"Fairy",wikiName:"《ヴァルキリー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%F4%A5%A1%A5%EB%A5%AD%A5%EA%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星５/光属性/天使族/攻1800/守1700
神話に出てくる闘いの天使。
手にする槍で天罰を下す。`,kind:"Monster"},"ヴィシュワ・ランディー":{name:"ヴィシュワ・ランディー",nameKana:"",description:`闇に仕える女戦士。
相手を血祭りにあげることが生きがい。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:700,attribute:"Dark",type:"Warrior",wikiName:"《ヴィシュワ・ランディー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%F4%A5%A3%A5%B7%A5%E5%A5%EF%A1%A6%A5%E9%A5%F3%A5%C7%A5%A3%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/戦士族/攻 900/守 700
闇に仕える女戦士。
相手を血祭りにあげることが生きがい。`,kind:"Monster"},"ヴェノム・コブラ":{name:"ヴェノム・コブラ",nameKana:"",description:`堅いウロコに覆われた巨大なコブラ。
大量の毒液を射出して攻撃するが、その巨大さ故毒液は大味である。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:100,defense:2e3,attribute:"Earth",type:"Reptile",wikiName:"《ヴェノム・コブラ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%F4%A5%A7%A5%CE%A5%E0%A1%A6%A5%B3%A5%D6%A5%E9%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/爬虫類族/攻 100/守2000
堅いウロコに覆われた巨大なコブラ。
大量の毒液を射出して攻撃するが、その巨大さ故毒液は大味である。`,kind:"Monster"},"ヴェルズ・ヘリオロープ":{name:"ヴェルズ・ヘリオロープ",nameKana:"",description:`ルメトモ　ヲンエウユシ　ツメハ　イカハ
ンネヤジルナウコウス　ノズルエヴンイ
イシマタノラレワ　ルナクアヤジ　テシニイスンユジ`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1950,defense:650,attribute:"Dark",type:"Rock",wikiName:"《ヴェルズ・ヘリオロープ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%F4%A5%A7%A5%EB%A5%BA%A1%A6%A5%D8%A5%EA%A5%AA%A5%ED%A1%BC%A5%D7%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/岩石族/攻1950/守 650
ルメトモ　ヲンエウユシ　ツメハ　イカハ
ンネヤジルナウコウス　ノズルエヴンイ
イシマタノラレワ　ルナクアヤジ　テシニイスンユジ`,kind:"Monster"},"ヴォルカニック・ラット":{name:"ヴォルカニック・ラット",nameKana:"",description:"灼熱の火山地帯に生息するネズミの変種。どんな暑さにも耐えられる体を持っている。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:500,defense:500,attribute:"Fire",type:"Pyro",wikiName:"《ヴォルカニック・ラット》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%F4%A5%A9%A5%EB%A5%AB%A5%CB%A5%C3%A5%AF%A1%A6%A5%E9%A5%C3%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星１/炎属性/炎族/攻 500/守 500
灼熱の火山地帯に生息するネズミの変種。どんな暑さにも耐えられる体を持っている。`,kind:"Monster"},悪の無名戦士:{name:"悪の無名戦士",nameKana:"",description:"素早い動きで真空を作り出し、相手を切り刻む戦士。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:500,attribute:"Dark",type:"Warrior",wikiName:"《悪の無名戦士》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%AD%A4%CE%CC%B5%CC%BE%C0%EF%BB%CE%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/戦士族/攻1000/守 500
素早い動きで真空を作り出し、相手を切り刻む戦士。`,kind:"Monster"},悪魔の鏡:{name:"悪魔の鏡",nameKana:"",description:"鏡に映るものに催眠術をかけ攻撃をよける悪魔の鏡。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:700,defense:600,attribute:"Dark",type:"Fiend",wikiName:"《悪魔の鏡》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%AD%CB%E2%A4%CE%B6%C0%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/悪魔族/攻 700/守 600
鏡に映るものに催眠術をかけ攻撃をよける悪魔の鏡。`,kind:"Monster"},暗黒の海竜兵:{name:"暗黒の海竜兵",nameKana:"",description:`暗黒海の世界を守る戦士。
水中はもちろん、陸上でも高い戦闘能力を誇る。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,defense:1500,attribute:"Water",type:"SeaSerpent",wikiName:"《暗黒の海竜兵》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%C5%B9%F5%A4%CE%B3%A4%CE%B5%CA%BC%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/海竜族/攻1800/守1500
暗黒海の世界を守る戦士。
水中はもちろん、陸上でも高い戦闘能力を誇る。`,kind:"Monster"},暗黒の狂犬:{name:"暗黒の狂犬",nameKana:"",description:"かつては公園で遊ぶ普通の犬だったが、暗黒の力により凶暴化してしまった。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1900,defense:1400,attribute:"Dark",type:"Beast",wikiName:"《暗黒の狂犬》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%C5%B9%F5%A4%CE%B6%B8%B8%A4%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/獣族/攻1900/守1400
かつては公園で遊ぶ普通の犬だったが、暗黒の力により凶暴化してしまった。`,kind:"Monster"},暗黒の竜王:{name:"暗黒の竜王",nameKana:"",description:`暗闇の奥深くに生息するドラゴン。
目はあまり良くない。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:800,attribute:"Dark",type:"Dragon",wikiName:"《暗黒の竜王》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%C5%B9%F5%A4%CE%CE%B5%B2%A6%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/ドラゴン族/攻1500/守 800
暗闇の奥深くに生息するドラゴン。
目はあまり良くない。`,kind:"Monster"},"暗黒界の騎士 ズール":{name:"暗黒界の騎士 ズール",nameKana:"",description:`暗黒界でその名を知らぬ者はいない、誇り高き騎士。
決して弱き者に手を下す事はない。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,defense:1500,attribute:"Dark",type:"Fiend",wikiName:"《暗黒界の騎士 ズール》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%C5%B9%F5%B3%A6%A4%CE%B5%B3%BB%CE%20%A5%BA%A1%BC%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1800/守1500
暗黒界でその名を知らぬ者はいない、誇り高き騎士。
決して弱き者に手を下す事はない。`,kind:"Monster",nameTags:["暗黒界"]},"暗黒界の番兵 レンジ":{name:"暗黒界の番兵 レンジ",nameKana:"",description:`暗黒界随一の強靭な身体を誇り、
「鉄壁レンジ」として暗黒界の人々から親しまれている。
彼の守りを破れる者は少ない。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:100,defense:2100,attribute:"Dark",type:"Fiend",wikiName:"《暗黒界の番兵 レンジ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%C5%B9%F5%B3%A6%A4%CE%C8%D6%CA%BC%20%A5%EC%A5%F3%A5%B8%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻 100/守2100
暗黒界随一の強靭な身体を誇り、
「鉄壁レンジ」として暗黒界の人々から親しまれている。
彼の守りを破れる者は少ない。`,kind:"Monster",nameTags:["暗黒界"]},暗黒騎士ガイア:{name:"暗黒騎士ガイア",nameKana:"",description:"風よりも速く走る馬に乗った騎士。突進攻撃に注意。",cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2300,defense:2100,attribute:"Earth",type:"Warrior",wikiName:"《暗黒騎士ガイア》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%C5%B9%F5%B5%B3%BB%CE%A5%AC%A5%A4%A5%A2%A1%D5",wikiTextAll:`通常モンスター
星７/地属性/戦士族/攻2300/守2100
風よりも速く走る馬に乗った騎士。突進攻撃に注意。`,kind:"Monster"},"暗黒魔神 ナイトメア":{name:"暗黒魔神 ナイトメア",nameKana:"",description:`夢の中に潜むと言われている悪魔。
寝ている間に命を奪う。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1100,attribute:"Dark",type:"Fiend",wikiName:"《暗黒魔神 ナイトメア》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%C5%B9%F5%CB%E2%BF%C0%20%A5%CA%A5%A4%A5%C8%A5%E1%A5%A2%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1300/守1100
夢の中に潜むと言われている悪魔。
寝ている間に命を奪う。`,kind:"Monster"},"闇・道化師のサギー":{name:"闇・道化師のサギー",nameKana:"",description:`どこからともなく現れる道化師。
不思議な動きで攻撃をかわす。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:600,defense:1500,attribute:"Dark",type:"Spellcaster",wikiName:"《闇・道化師のサギー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%C7%A1%A6%C6%BB%B2%BD%BB%D5%A4%CE%A5%B5%A5%AE%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/魔法使い族/攻 600/守1500
どこからともなく現れる道化師。
不思議な動きで攻撃をかわす。`,kind:"Monster"},闇にしたがう者:{name:"闇にしたがう者",nameKana:"",description:`闇を崇拝する魔法使い。
魔の手を呼び出し暗闇へ引きずり込む。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:700,defense:500,attribute:"Dark",type:"Spellcaster",wikiName:"《闇にしたがう者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%C7%A4%CB%A4%B7%A4%BF%A4%AC%A4%A6%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/魔法使い族/攻 700/守 500
闇を崇拝する魔法使い。
魔の手を呼び出し暗闇へ引きずり込む。`,kind:"Monster"},闇の暗殺者:{name:"闇の暗殺者",nameKana:"",description:"サイコソードと呼ばれる剣を持ち、魔界に君臨する暗殺者。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1200,attribute:"Dark",type:"Zombie",wikiName:"《闇の暗殺者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%C7%A4%CE%B0%C5%BB%A6%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/アンデット族/攻1200/守1200
サイコソードと呼ばれる剣を持ち、魔界に君臨する暗殺者。`,kind:"Monster"},闇を司る影:{name:"闇を司る影",nameKana:"",description:`暗闇の中にとけこむ影。
金縛りで敵の動きを封じる。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:700,attribute:"Dark",type:"Fiend",wikiName:"《闇を司る影》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%C7%A4%F2%BB%CA%A4%EB%B1%C6%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/悪魔族/攻 800/守 700
暗闇の中にとけこむ影。
金縛りで敵の動きを封じる。`,kind:"Monster"},"闇魔界の戦士 ダークソード":{name:"闇魔界の戦士 ダークソード",nameKana:"",description:`ドラゴンを操ると言われている闇魔界の戦士。
邪悪なパワーで斬りかかる攻撃はすさまじい。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,defense:1500,attribute:"Dark",type:"Warrior",wikiName:"《闇魔界の戦士 ダークソード》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%C7%CB%E2%B3%A6%A4%CE%C0%EF%BB%CE%20%A5%C0%A1%BC%A5%AF%A5%BD%A1%BC%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/戦士族/攻1800/守1500
ドラゴンを操ると言われている闇魔界の戦士。
邪悪なパワーで斬りかかる攻撃はすさまじい。`,kind:"Monster"},闇魔界の覇王:{name:"闇魔界の覇王",nameKana:"",description:"強大な闇の力を使い、まわりのものを全て破壊する。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:2e3,defense:1530,attribute:"Dark",type:"Fiend",wikiName:"《闇魔界の覇王》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%C7%CB%E2%B3%A6%A4%CE%C7%C6%B2%A6%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/悪魔族/攻2000/守1530
強大な闇の力を使い、まわりのものを全て破壊する。`,kind:"Monster"},異界より来たるシェルガ:{name:"異界より来たるシェルガ",nameKana:"",description:"永き波闘の果て、溟海より目覚めしは、誇り高き闘者。",cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:7,attack:2800,defense:2500,attribute:"Water",type:"Psychic",pendulumScaleR:10,pendulumScaleL:10,wikiName:"《異界より来たるシェルガ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%DB%B3%A6%A4%E8%A4%EA%CD%E8%A4%BF%A4%EB%A5%B7%A5%A7%A5%EB%A5%AC%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター（使用不可カード）
星７/水属性/サイキック族/攻2800/守2500
【Ｐスケール：青１０/赤１０】
(1)：１ターンに１度、自分フィールドのサイキック族Ｐモンスター３体を除外し、
自分フィールドのＰモンスター１体を対象として発動できる。
このターンそのモンスターが直接攻撃で相手のＬＰを０にした場合、
自分はマッチに勝利する。
【モンスター情報】
永き波闘の果て、溟海より目覚めしは、誇り高き闘者。`,kind:"Monster",pendulumDescription:`(1)：１ターンに１度、自分フィールドのサイキック族Ｐモンスター３体を除外し、
自分フィールドのＰモンスター１体を対象として発動できる。
このターンそのモンスターが直接攻撃で相手のＬＰを０にした場合、
自分はマッチに勝利する。`},異次元からの侵略者:{name:"異次元からの侵略者",nameKana:"",description:"銀河系の外から地球にやってきた宇宙人。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:950,defense:1400,attribute:"Dark",type:"Fiend",wikiName:"《異次元からの侵略者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%DB%BC%A1%B8%B5%A4%AB%A4%E9%A4%CE%BF%AF%CE%AC%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻 950/守1400
銀河系の外から地球にやってきた宇宙人。`,kind:"Monster"},異次元トレーナー:{name:"異次元トレーナー",nameKana:"",description:`異次元に吸い込まれてしまった哀れなゴブリン。
しかし、今新たな目標に向かって日々努力している。`,cardType:"Monster",monsterCategories:["Normal"],level:1,attack:100,defense:2e3,attribute:"Dark",type:"Fiend",wikiName:"《異次元トレーナー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%DB%BC%A1%B8%B5%A5%C8%A5%EC%A1%BC%A5%CA%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星１/闇属性/悪魔族/攻 100/守2000
異次元に吸い込まれてしまった哀れなゴブリン。
しかし、今新たな目標に向かって日々努力している。`,kind:"Monster"},一眼の盾竜:{name:"一眼の盾竜",nameKana:"",description:"身につけた盾は身を守るだけでなく、突撃にも使える。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:700,defense:1300,attribute:"Wind",type:"Dragon",wikiName:"《一眼の盾竜》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%EC%B4%E3%A4%CE%BD%E2%CE%B5%A1%D5",wikiTextAll:`通常モンスター
星３/風属性/ドラゴン族/攻 700/守1300
身につけた盾は身を守るだけでなく、突撃にも使える。`,kind:"Monster"},"陰陽師 タオ":{name:"陰陽師 タオ",nameKana:"",description:"陰と陽の力を浸食させ、歪んだ力を生み出す魔導士。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:900,attribute:"Earth",type:"Spellcaster",wikiName:"《陰陽師 タオ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B1%A2%CD%DB%BB%D5%20%A5%BF%A5%AA%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/魔法使い族/攻1200/守 900
陰と陽の力を浸食させ、歪んだ力を生み出す魔導士。`,kind:"Monster"},"運否の天賦羅－ＥＢＩ":{name:"運否の天賦羅－ＥＢＩ",nameKana:"",description:`話題沸騰のＥＤＯ－ＦＲＯＮＴに。
ここの天賦羅はスケールの大きさもさる事ながら、その美しい造形には「金賦羅」の異名も付くほど。
最新鋭の設備と異文化感に溢れた港内ですが、どこか懐かしさを感じる芳醇な香りも漂い、
時折パチパチと鳴り響く小気味良い音色に心も揚ガります。
念願の天賦羅でしたが、周辺空域の荒れ模様に左右される為本日は一切入港されず…。
運が悪かったとはいえ、その後の予定も白紙にせざるを得ませんでした。
１年間心待ちにしていただけに誠に遺憾ではありますが、今回の対応については星３が妥当かと思います。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:3,attack:1600,attribute:"Fire",type:"Aqua",pendulumScaleR:8,pendulumScaleL:8,wikiName:"《運否の天賦羅－ＥＢＩ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B1%BF%C8%DD%A4%CE%C5%B7%C9%EA%CD%E5%A1%DD%A3%C5%A3%C2%A3%C9%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星３/炎属性/水族/攻1600/守   0
【Ｐスケール：青８/赤８】
このカード名のＰ効果は１ターンに１度しか使用できない。
(1)：自分のＰゾーンのカード１枚を対象として発動できる。
コイントスを１回行い、その裏表によって以下の効果を適用する。
●表：そのカードを特殊召喚する。
●裏：そのカードを破壊し、自分はそのＰスケール×３００ＬＰを失う。
【モンスター情報】
話題沸騰のＥＤＯ－ＦＲＯＮＴに。
ここの天賦羅はスケールの大きさもさる事ながら、その美しい造形には「金賦羅」の異名も付くほど。
最新鋭の設備と異文化感に溢れた港内ですが、どこか懐かしさを感じる芳醇な香りも漂い、
時折パチパチと鳴り響く小気味良い音色に心も揚ガります。
念願の天賦羅でしたが、周辺空域の荒れ模様に左右される為本日は一切入港されず…。
運が悪かったとはいえ、その後の予定も白紙にせざるを得ませんでした。
１年間心待ちにしていただけに誠に遺憾ではありますが、今回の対応については星３が妥当かと思います。`,kind:"Monster",pendulumDescription:`このカード名のＰ効果は１ターンに１度しか使用できない。
(1)：自分のＰゾーンのカード１枚を対象として発動できる。
コイントスを１回行い、その裏表によって以下の効果を適用する。
●表：そのカードを特殊召喚する。
●裏：そのカードを破壊し、自分はそのＰスケール×３００ＬＰを失う。`,defense:0},運命のろうそく:{name:"運命のろうそく",nameKana:"",description:"指先の炎が消えたとき、相手の運命が決定する。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:600,defense:600,attribute:"Dark",type:"Fiend",wikiName:"《運命のろうそく》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B1%BF%CC%BF%A4%CE%A4%ED%A4%A6%A4%BD%A4%AF%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/悪魔族/攻 600/守 600
指先の炎が消えたとき、相手の運命が決定する。`,kind:"Monster"},"雲魔物－スモークボール":{name:"雲魔物－スモークボール",nameKana:"",description:`小さな小さな雲魔物の子供雲。ひとりぼっちが大嫌いで、
仲間達とそよ風に乗ってゆらゆらと散歩をするのが大好き。`,cardType:"Monster",monsterCategories:["Normal"],level:1,attack:200,defense:600,attribute:"Water",type:"Fairy",wikiName:"《雲魔物－スモークボール》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B1%C0%CB%E2%CA%AA%A1%DD%A5%B9%A5%E2%A1%BC%A5%AF%A5%DC%A1%BC%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星１/水属性/天使族/攻 200/守 600
小さな小さな雲魔物の子供雲。ひとりぼっちが大嫌いで、
仲間達とそよ風に乗ってゆらゆらと散歩をするのが大好き。`,kind:"Monster"},怨念集合体:{name:"怨念集合体",nameKana:"",description:`恨みを持って死んでいった人の意識が集まってできた悪霊。
人を襲いその意識をとりこんで巨大化していく。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:900,defense:200,attribute:"Dark",type:"Fiend",wikiName:"《怨念集合体》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B1%E5%C7%B0%BD%B8%B9%E7%C2%CE%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/悪魔族/攻 900/守 200
恨みを持って死んでいった人の意識が集まってできた悪霊。
人を襲いその意識をとりこんで巨大化していく。`,kind:"Monster"},炎の剣豪:{name:"炎の剣豪",nameKana:"",description:"火山に落ちて、炎を身にまとう能力を身につけた武士。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1700,defense:1100,attribute:"Fire",type:"Pyro",wikiName:"《炎の剣豪》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B1%EA%A4%CE%B7%F5%B9%EB%A1%D5",wikiTextAll:`通常モンスター
星４/炎属性/炎族/攻1700/守1100
火山に落ちて、炎を身にまとう能力を身につけた武士。`,kind:"Monster"},炎の魔神:{name:"炎の魔神",nameKana:"",description:`炎につつまれた魔人。
まわりの炎を自在に操り攻撃する。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1e3,attribute:"Fire",type:"Pyro",wikiName:"《炎の魔神》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B1%EA%A4%CE%CB%E2%BF%C0%A1%D5",wikiTextAll:`通常モンスター
星４/炎属性/炎族/攻1300/守1000
炎につつまれた魔人。
まわりの炎を自在に操り攻撃する。`,kind:"Monster"},炎を食らう大亀:{name:"炎を食らう大亀",nameKana:"",description:"真っ赤な甲羅が特徴のカメ。炎を食べると言われている。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1400,defense:1800,attribute:"Water",type:"Aqua",wikiName:"《炎を食らう大亀》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B1%EA%A4%F2%BF%A9%A4%E9%A4%A6%C2%E7%B5%B5%A1%D5",wikiTextAll:`通常モンスター
星５/水属性/水族/攻1400/守1800
真っ赤な甲羅が特徴のカメ。炎を食べると言われている。`,kind:"Monster"},炎を操る者:{name:"炎を操る者",nameKana:"",description:"炎の海や炎の壁を自在につくり出し攻撃する。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:1e3,attribute:"Fire",type:"Spellcaster",wikiName:"《炎を操る者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B1%EA%A4%F2%C1%E0%A4%EB%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星３/炎属性/魔法使い族/攻 900/守1000
炎の海や炎の壁を自在につくり出し攻撃する。`,kind:"Monster"},王家の守護者:{name:"王家の守護者",nameKana:"",description:`何千年もの間王家を守り続けている兵士のミイラ。
その魂は今も侵入者を許す事はない。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:900,attribute:"Earth",type:"Zombie",wikiName:"《王家の守護者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B2%A6%B2%C8%A4%CE%BC%E9%B8%EE%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/アンデット族/攻 900/守   0
何千年もの間王家を守り続けている兵士のミイラ。
その魂は今も侵入者を許す事はない。`,kind:"Monster",defense:0},王座の守護者:{name:"王座の守護者",nameKana:"",description:"王が留守の間、王座を外敵から守る王妃。守備は高い。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:800,defense:1500,attribute:"Earth",type:"Warrior",wikiName:"《王座の守護者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B2%A6%BA%C2%A4%CE%BC%E9%B8%EE%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/戦士族/攻 800/守1500
王が留守の間、王座を外敵から守る王妃。守備は高い。`,kind:"Monster"},王室前のガーディアン:{name:"王室前のガーディアン",nameKana:"",description:`王室をガードする衛兵ロボ。
当たるまで追い続けるミサイルを撃つ。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1650,defense:1600,attribute:"Light",type:"Machine",wikiName:"《王室前のガーディアン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B2%A6%BC%BC%C1%B0%A4%CE%A5%AC%A1%BC%A5%C7%A5%A3%A5%A2%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/機械族/攻1650/守1600
王室をガードする衛兵ロボ。
当たるまで追い続けるミサイルを撃つ。`,kind:"Monster"},屋根裏の物の怪:{name:"屋根裏の物の怪",nameKana:"",description:`どの家の屋根裏にも潜んでいるもののけ。
特にわるさはしない。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:550,defense:400,attribute:"Dark",type:"Fiend",wikiName:"《屋根裏の物の怪》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B2%B0%BA%AC%CE%A2%A4%CE%CA%AA%A4%CE%B2%F8%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/悪魔族/攻 550/守 400
どの家の屋根裏にも潜んでいるもののけ。
特にわるさはしない。`,kind:"Monster"},音女:{name:"音女",nameKana:"",description:`音を扱うのが得意なオトメ。
音符のカマを使い攻撃する。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:900,attribute:"Earth",type:"Warrior",wikiName:"《音女》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B2%BB%BD%F7%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/戦士族/攻1200/守 900
音を扱うのが得意なオトメ。
音符のカマを使い攻撃する。`,kind:"Monster"},音速ダック:{name:"音速ダック",nameKana:"",description:`音速で歩く事ができるダック。
そのすさまじいスピードに対応できず、コントロールを失う事が多い。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1700,defense:700,attribute:"Wind",type:"WingedBeast",wikiName:"《音速ダック》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B2%BB%C2%AE%A5%C0%A5%C3%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星３/風属性/鳥獣族/攻1700/守 700
音速で歩く事ができるダック。
そのすさまじいスピードに対応できず、コントロールを失う事が多い。`,kind:"Monster"},"仮面呪術師カースド・ギュラ":{name:"仮面呪術師カースド・ギュラ",nameKana:"",description:"呪いの呪文で相手を念殺する、仮面モンスター。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:800,attribute:"Dark",type:"Fiend",wikiName:"《仮面呪術師カースド・ギュラ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B2%BE%CC%CC%BC%F6%BD%D1%BB%D5%A5%AB%A1%BC%A5%B9%A5%C9%A1%A6%A5%AE%A5%E5%A5%E9%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1500/守 800
呪いの呪文で相手を念殺する、仮面モンスター。`,kind:"Monster"},仮面道化:{name:"仮面道化",nameKana:"",description:"死のおどりを踊りながら、手にするカマで敵を切りきざむ戦士。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:500,defense:700,attribute:"Dark",type:"Warrior",wikiName:"《仮面道化》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B2%BE%CC%CC%C6%BB%B2%BD%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/戦士族/攻 500/守 700
死のおどりを踊りながら、手にするカマで敵を切りきざむ戦士。`,kind:"Monster"},科学特殊兵:{name:"科学特殊兵",nameKana:"",description:`未知の生物に対抗するため、最新の科学兵器を装備した兵士。
背中のコンテナにはさまざまな兵器が収納されている。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:800,attribute:"Dark",type:"Warrior",wikiName:"《科学特殊兵》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B2%CA%B3%D8%C6%C3%BC%EC%CA%BC%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/戦士族/攻 800/守 800
未知の生物に対抗するため、最新の科学兵器を装備した兵士。
背中のコンテナにはさまざまな兵器が収納されている。`,kind:"Monster"},火炎草:{name:"火炎草",nameKana:"",description:`火山の近くに生息する草。
花から火炎を吹き攻撃する。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:700,defense:600,attribute:"Earth",type:"Plant",wikiName:"《火炎草》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B2%D0%B1%EA%C1%F0%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/植物族/攻 700/守 600
火山の近くに生息する草。
花から火炎を吹き攻撃する。`,kind:"Monster"},火炎木人１８:{name:"火炎木人１８",nameKana:"",description:`全身が灼熱の炎に包まれた巨木の化身。
炎の攻撃は強力だが、自身が燃えているため先は長くない。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1850,attribute:"Fire",type:"Pyro",wikiName:"《火炎木人１８》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B2%D0%B1%EA%CC%DA%BF%CD%A3%B1%A3%B8%A1%D5",wikiTextAll:`通常モンスター
星４/炎属性/炎族/攻1850/守   0
全身が灼熱の炎に包まれた巨木の化身。
炎の攻撃は強力だが、自身が燃えているため先は長くない。`,kind:"Monster",defense:0},霞の谷の見張り番:{name:"霞の谷の見張り番",nameKana:"",description:`霞の谷を代々見張り続ける、見張り番一族の末裔。
谷で起こる出来事は、どんな些細な事も見逃さない。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1900,attribute:"Wind",type:"Spellcaster",wikiName:"《霞の谷の見張り番》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B2%E2%A4%CE%C3%AB%A4%CE%B8%AB%C4%A5%A4%EA%C8%D6%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/魔法使い族/攻1500/守1900
霞の谷を代々見張り続ける、見張り番一族の末裔。
谷で起こる出来事は、どんな些細な事も見逃さない。`,kind:"Monster"},海の竜王:{name:"海の竜王",nameKana:"",description:`海の王様。
かたい甲羅を持ち、口からアワをはいて攻撃する。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2e3,defense:1700,attribute:"Water",type:"SeaSerpent",wikiName:"《海の竜王》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B3%A4%A4%CE%CE%B5%B2%A6%A1%D5",wikiTextAll:`通常モンスター
星６/水属性/海竜族/攻2000/守1700
海の王様。
かたい甲羅を持ち、口からアワをはいて攻撃する。`,kind:"Monster"},海を守る戦士:{name:"海を守る戦士",nameKana:"",description:"海を汚す奴等を徹底的に攻撃する、マーマン戦士。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1e3,attribute:"Water",type:"Aqua",wikiName:"《海を守る戦士》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B3%A4%A4%F2%BC%E9%A4%EB%C0%EF%BB%CE%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1300/守1000
海を汚す奴等を徹底的に攻撃する、マーマン戦士。`,kind:"Monster"},"海月－ジェリーフィッシュ－":{name:"海月－ジェリーフィッシュ－",nameKana:"",description:`海を漂うクラゲ。
半透明の身体で姿を確認しにくい。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1500,attribute:"Water",type:"Aqua",wikiName:"《海月－ジェリーフィッシュ－》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B3%A4%B7%EE%A1%DD%A5%B8%A5%A7%A5%EA%A1%BC%A5%D5%A5%A3%A5%C3%A5%B7%A5%E5%A1%DD%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1200/守1500
海を漂うクラゲ。
半透明の身体で姿を確認しにくい。`,kind:"Monster"},海原の女戦士:{name:"海原の女戦士",nameKana:"",description:`海の神に仕えるマーメイド。
神聖な領域を守っている。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1400,attribute:"Water",type:"Fish",wikiName:"《海原の女戦士》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B3%A4%B8%B6%A4%CE%BD%F7%C0%EF%BB%CE%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/魚族/攻1300/守1400
海の神に仕えるマーメイド。
神聖な領域を守っている。`,kind:"Monster"},海皇の長槍兵:{name:"海皇の長槍兵",nameKana:"",description:`海底を支配していると言われる、海皇に仕える長槍兵。
深く暗い海の底から襲いかかる長槍の連続攻撃は、深海魚たちに恐れられている。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:1400,attribute:"Water",type:"SeaSerpent",wikiName:"《海皇の長槍兵》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B3%A4%B9%C4%A4%CE%C4%B9%C1%E4%CA%BC%A1%D5",wikiTextAll:`通常モンスター
星２/水属性/海竜族/攻1400/守   0
海底を支配していると言われる、海皇に仕える長槍兵。
深く暗い海の底から襲いかかる長槍の連続攻撃は、深海魚たちに恐れられている。`,kind:"Monster",defense:0},海賊船スカルブラッド号:{name:"海賊船スカルブラッド号",nameKana:"",description:`船首に赤い骸骨をかたどった海賊船。
あらゆる海域に神出鬼没に現れ、旅客船や貨物船を襲撃する。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:900,attribute:"Water",type:"Warrior",wikiName:"《海賊船スカルブラッド号》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B3%A4%C2%B1%C1%A5%A5%B9%A5%AB%A5%EB%A5%D6%A5%E9%A5%C3%A5%C9%B9%E6%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/戦士族/攻1600/守 900
船首に赤い骸骨をかたどった海賊船。
あらゆる海域に神出鬼没に現れ、旅客船や貨物船を襲撃する。`,kind:"Monster"},海竜神:{name:"海竜神",nameKana:"",description:`海の主と呼ばれる海のドラゴン。
津波をおこして全てを飲み込む。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1800,defense:1500,attribute:"Water",type:"SeaSerpent",wikiName:"《海竜神》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B3%A4%CE%B5%BF%C0%A1%D5",wikiTextAll:`通常モンスター
星５/水属性/海竜族/攻1800/守1500
海の主と呼ばれる海のドラゴン。
津波をおこして全てを飲み込む。`,kind:"Monster"},絵画に潜む者:{name:"絵画に潜む者",nameKana:"",description:`描いた者の呪いの込められた絵。
この絵を所持した者は全て不幸に陥ると言われている。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1500,attribute:"Earth",type:"Fiend",wikiName:"《絵画に潜む者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B3%A8%B2%E8%A4%CB%C0%F8%A4%E0%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/悪魔族/攻1200/守1500
描いた者の呪いの込められた絵。
この絵を所持した者は全て不幸に陥ると言われている。`,kind:"Monster"},鎧ネズミ:{name:"鎧ネズミ",nameKana:"",description:"鎧のようにかたい毛で体を守ることができるネズミ。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:950,defense:1100,attribute:"Earth",type:"Beast",wikiName:"《鎧ネズミ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B3%BB%A5%CD%A5%BA%A5%DF%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/獣族/攻 950/守1100
鎧のようにかたい毛で体を守ることができるネズミ。`,kind:"Monster"},鎧武者ゾンビ:{name:"鎧武者ゾンビ",nameKana:"",description:`怨念により蘇った武者。
闇雲にふりまわすカタナに注意。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1500,attribute:"Dark",type:"Zombie",wikiName:"《鎧武者ゾンビ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B3%BB%C9%F0%BC%D4%A5%BE%A5%F3%A5%D3%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/アンデット族/攻1500/守   0
怨念により蘇った武者。
闇雲にふりまわすカタナに注意。`,kind:"Monster",defense:0},鎧武者斬鬼:{name:"鎧武者斬鬼",nameKana:"",description:"一騎打ちを好む。一瞬のスキをついて、居合い抜きで攻撃！",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1500,defense:1700,attribute:"Earth",type:"Warrior",wikiName:"《鎧武者斬鬼》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B3%BB%C9%F0%BC%D4%BB%C2%B5%B4%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/戦士族/攻1500/守1700
一騎打ちを好む。一瞬のスキをついて、居合い抜きで攻撃！`,kind:"Monster"},鎧蜥蜴:{name:"鎧蜥蜴",nameKana:"",description:"かたい体のトカゲ。大きな口で噛みつかれたら、ひとたまりもないぞ。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1200,attribute:"Earth",type:"Reptile",wikiName:"《鎧蜥蜴》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B3%BB%E9%F2%E9%EE%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/爬虫類族/攻1500/守1200
かたい体のトカゲ。大きな口で噛みつかれたら、ひとたまりもないぞ。`,kind:"Monster"},"格闘ねずみ チュー助":{name:"格闘ねずみ チュー助",nameKana:"",description:`ねずみ界最強の格闘家を目指して世界を放浪している熱血ねずみ。
うかつに触ると火傷するぞ。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,attribute:"Earth",type:"Beast",wikiName:"《格闘ねずみ チュー助》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B3%CA%C6%AE%A4%CD%A4%BA%A4%DF%20%A5%C1%A5%E5%A1%BC%BD%F5%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/獣族/攻1200/守   0
ねずみ界最強の格闘家を目指して世界を放浪している熱血ねずみ。
うかつに触ると火傷するぞ。`,kind:"Monster",defense:0},格闘戦士アルティメーター:{name:"格闘戦士アルティメーター",nameKana:"",description:"武器をいっさい使わず、素手で戦いぬく格闘戦士。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:700,defense:1e3,attribute:"Earth",type:"Warrior",wikiName:"《格闘戦士アルティメーター》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B3%CA%C6%AE%C0%EF%BB%CE%A5%A2%A5%EB%A5%C6%A5%A3%A5%E1%A1%BC%A5%BF%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/戦士族/攻 700/守1000
武器をいっさい使わず、素手で戦いぬく格闘戦士。`,kind:"Monster"},冠を戴く蒼き翼:{name:"冠を戴く蒼き翼",nameKana:"",description:"頭の毛が冠のように見える、青白く燃えるトリ。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1200,attribute:"Wind",type:"WingedBeast",wikiName:"《冠を戴く蒼き翼》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B4%A7%A4%F2%C2%D7%A4%AF%C1%F3%A4%AD%CD%E3%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/鳥獣族/攻1600/守1200
頭の毛が冠のように見える、青白く燃えるトリ。`,kind:"Monster"},岩の戦士:{name:"岩の戦士",nameKana:"",description:"非常に重たい岩石の剣を振り回す、岩石の戦士。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1200,attribute:"Earth",type:"Rock",wikiName:"《岩の戦士》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B4%E4%A4%CE%C0%EF%BB%CE%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/岩石族/攻1300/守1200
非常に重たい岩石の剣を振り回す、岩石の戦士。`,kind:"Monster"},"岩窟魔人オーガ・ロック":{name:"岩窟魔人オーガ・ロック",nameKana:"",description:"体が岩のため守備は高い。太い腕のひと振りに注意。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:1200,attribute:"Earth",type:"Rock",wikiName:"《岩窟魔人オーガ・ロック》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B4%E4%B7%A2%CB%E2%BF%CD%A5%AA%A1%BC%A5%AC%A1%A6%A5%ED%A5%C3%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/岩石族/攻 800/守1200
体が岩のため守備は高い。太い腕のひと振りに注意。`,kind:"Monster"},岩石の巨兵:{name:"岩石の巨兵",nameKana:"",description:`岩石の巨人兵。
太い腕の攻撃は大地をゆるがす。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1300,defense:2e3,attribute:"Earth",type:"Rock",wikiName:"《岩石の巨兵》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B4%E4%C0%D0%A4%CE%B5%F0%CA%BC%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/岩石族/攻1300/守2000
岩石の巨人兵。
太い腕の攻撃は大地をゆるがす。`,kind:"Monster"},岩石の精霊:{name:"岩石の精霊",nameKana:"",description:`はにわみたいだが岩石の精霊。
攻撃・守備ともにかなり強い。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1650,defense:1900,attribute:"Earth",type:"Spellcaster",wikiName:"《岩石の精霊》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B4%E4%C0%D0%A4%CE%C0%BA%CE%EE%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/魔法使い族/攻1650/守1900
はにわみたいだが岩石の精霊。
攻撃・守備ともにかなり強い。`,kind:"Monster"},岩石カメッター:{name:"岩石カメッター",nameKana:"",description:`全身が岩石でできているカメ。
非常に高い守備が特徴。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:1450,defense:2200,attribute:"Water",type:"Aqua",wikiName:"《岩石カメッター》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B4%E4%C0%D0%A5%AB%A5%E1%A5%C3%A5%BF%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星６/水属性/水族/攻1450/守2200
全身が岩石でできているカメ。
非常に高い守備が特徴。`,kind:"Monster"},機械の巨兵:{name:"機械の巨兵",nameKana:"",description:"巨大なオノの攻撃は、大地が割れるほど強力な一撃だ。",cardType:"Monster",monsterCategories:["Normal"],level:6,attack:1750,defense:1900,attribute:"Earth",type:"Machine",wikiName:"《機械の巨兵》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B5%A1%B3%A3%A4%CE%B5%F0%CA%BC%A1%D5",wikiTextAll:`通常モンスター
星６/地属性/機械族/攻1750/守1900
巨大なオノの攻撃は、大地が割れるほど強力な一撃だ。`,kind:"Monster"},機械の兵隊:{name:"機械の兵隊",nameKana:"",description:"機械王を警護する兵隊。丸い身体でゴロゴロ転がってくる。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1500,defense:1700,attribute:"Dark",type:"Machine",wikiName:"《機械の兵隊》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B5%A1%B3%A3%A4%CE%CA%BC%C2%E2%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/機械族/攻1500/守1700
機械王を警護する兵隊。丸い身体でゴロゴロ転がってくる。`,kind:"Monster"},機械軍曹:{name:"機械軍曹",nameKana:"",description:`機械王に仕える機械族の司令塔。
機械の兵隊を統率する攻撃的な用兵で有名。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1800,attribute:"Fire",type:"Machine",wikiName:"《機械軍曹》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B5%A1%B3%A3%B7%B3%C1%E2%A1%D5",wikiTextAll:`通常モンスター
星４/炎属性/機械族/攻1600/守1800
機械王に仕える機械族の司令塔。
機械の兵隊を統率する攻撃的な用兵で有名。`,kind:"Monster"},機界騎士アヴラム:{name:"機界騎士アヴラム",nameKana:"",description:`星の光を守護する勇者　幻界せし闇を討つべく　選ばれしものに力を託す。
星の杯に継がれし意志は新たな鍵となり　闇を絶ち切る剣とならん。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:2e3,attribute:"Light",type:"Psychic",wikiName:"《機界騎士アヴラム》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B5%A1%B3%A6%B5%B3%BB%CE%A5%A2%A5%F4%A5%E9%A5%E0%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/サイキック族/攻2000/守   0 
星の光を守護する勇者　幻界せし闇を討つべく　選ばれしものに力を託す。
星の杯に継がれし意志は新たな鍵となり　闇を絶ち切る剣とならん。`,kind:"Monster",defense:0},"輝銀の天空船－レオ号":{name:"輝銀の天空船－レオ号",nameKana:"",description:`輝銀の翼は栄光の印。
その証は言葉によって語られる。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:7,defense:3e3,attribute:"Wind",type:"Machine",pendulumScaleR:10,pendulumScaleL:10,wikiName:"《輝銀の天空船－レオ号》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B5%B1%B6%E4%A4%CE%C5%B7%B6%F5%C1%A5%A1%DD%A5%EC%A5%AA%B9%E6%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター（使用不可カード）
星７/風属性/機械族/攻   0/守3000
【Ｐスケール：青１０/赤１０】
(1)：１ターンに１度、自分フィールドの機械族Ｐモンスター３体を除外し、
自分フィールドのＰモンスター１体を対象として発動できる。
このターン、そのモンスターが直接攻撃で相手のＬＰを０にした場合、
自分はマッチに勝利する。
【モンスター情報】
輝銀の翼は栄光の印。
その証は言葉によって語られる。`,kind:"Monster",pendulumDescription:`(1)：１ターンに１度、自分フィールドの機械族Ｐモンスター３体を除外し、
自分フィールドのＰモンスター１体を対象として発動できる。
このターン、そのモンスターが直接攻撃で相手のＬＰを０にした場合、
自分はマッチに勝利する。`,attack:0},"鬼タンクＴ－３４":{name:"鬼タンクＴ－３４",nameKana:"",description:"鬼の魂が乗り移った戦車。意思を持ち敵をどこまでも追いつめる。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1700,attribute:"Earth",type:"Machine",wikiName:"《鬼タンクＴ－３４》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B5%B4%A5%BF%A5%F3%A5%AF%A3%D4%A1%DD%A3%B3%A3%B4%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/機械族/攻1400/守1700
鬼の魂が乗り移った戦車。意思を持ち敵をどこまでも追いつめる。`,kind:"Monster"},逆転の女神:{name:"逆転の女神",nameKana:"",description:"聖なる力で弱き者を守り、逆転の力を与える女神。",cardType:"Monster",monsterCategories:["Normal"],level:6,attack:1800,defense:2e3,attribute:"Light",type:"Fairy",wikiName:"《逆転の女神》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B5%D5%C5%BE%A4%CE%BD%F7%BF%C0%A1%D5",wikiTextAll:`通常モンスター
星６/光属性/天使族/攻1800/守2000
聖なる力で弱き者を守り、逆転の力を与える女神。`,kind:"Monster"},吸血ノミ:{name:"吸血ノミ",nameKana:"",description:`血を吸う巨大ノミ。攻撃はかなり強い。
ノミとあなどると危険。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1200,attribute:"Earth",type:"Insect",wikiName:"《吸血ノミ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B5%DB%B7%EC%A5%CE%A5%DF%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/昆虫族/攻1500/守1200
血を吸う巨大ノミ。攻撃はかなり強い。
ノミとあなどると危険。`,kind:"Monster"},弓を引くマーメイド:{name:"弓を引くマーメイド",nameKana:"",description:"普段は貝殻の中に身を隠し、近づく者に矢を放つマーメイド。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1500,attribute:"Water",type:"Aqua",wikiName:"《弓を引くマーメイド》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B5%DD%A4%F2%B0%FA%A4%AF%A5%DE%A1%BC%A5%E1%A5%A4%A5%C9%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1400/守1500
普段は貝殻の中に身を隠し、近づく者に矢を放つマーメイド。`,kind:"Monster"},球騎士の三人娘:{name:"球騎士の三人娘",nameKana:"",description:`パワプロ界のナビゲーター三人娘。
（左）明るく元気で責任感が強いけど、忘れっぽいのが玉に瑕の「パーちゃん」。
（右）おしとやかで真面目＆冷静だが、時たま暴走する事もある「ワーちゃん」。
（中）鞄がトレードマークで二人の大先輩である「なみき」とその愛犬の「ちくわ」。
彼女達に導かれるかの如く踏み入れた球場の中、ついに運命にたどり着く。
そして球児達は大きな一歩を踏み出すのだ。
――これは全ての始まりであり、大いなる球史である。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:2400,attribute:"Light",type:"Warrior",wikiName:"《球騎士の三人娘》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B5%E5%B5%B3%BB%CE%A4%CE%BB%B0%BF%CD%CC%BC%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/戦士族/攻1200/守2400
パワプロ界のナビゲーター三人娘。
（左）明るく元気で責任感が強いけど、忘れっぽいのが玉に瑕の「パーちゃん」。
（右）おしとやかで真面目＆冷静だが、時たま暴走する事もある「ワーちゃん」。
（中）鞄がトレードマークで二人の大先輩である「なみき」とその愛犬の「ちくわ」。
彼女達に導かれるかの如く踏み入れた球場の中、ついに運命にたどり着く。
そして球児達は大きな一歩を踏み出すのだ。
――これは全ての始まりであり、大いなる球史である。`,kind:"Monster"},牛鬼:{name:"牛鬼",nameKana:"",description:`黒魔術で蘇ったウシの悪魔。
壺の中から現れる。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2150,defense:1950,attribute:"Dark",type:"Fiend",wikiName:"《牛鬼》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B5%ED%B5%B4%A1%D5",wikiTextAll:`通常モンスター
星６/闇属性/悪魔族/攻2150/守1950
黒魔術で蘇ったウシの悪魔。
壺の中から現れる。`,kind:"Monster"},牛魔人:{name:"牛魔人",nameKana:"",description:"森に住む牛の魔人。ツノを突き出し突進して攻撃。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1800,defense:1300,attribute:"Earth",type:"BeastWarrior",wikiName:"《牛魔人》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B5%ED%CB%E2%BF%CD%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/獣戦士族/攻1800/守1300
森に住む牛の魔人。ツノを突き出し突進して攻撃。`,kind:"Monster"},巨大な怪鳥:{name:"巨大な怪鳥",nameKana:"",description:`あまり見かけない、とても大きなトリ。
空から急降下して襲いかかる。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2e3,defense:1900,attribute:"Wind",type:"WingedBeast",wikiName:"《巨大な怪鳥》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B5%F0%C2%E7%A4%CA%B2%F8%C4%BB%A1%D5",wikiTextAll:`通常モンスター
星６/風属性/鳥獣族/攻2000/守1900
あまり見かけない、とても大きなトリ。
空から急降下して襲いかかる。`,kind:"Monster"},魚ギョ戦士:{name:"魚ギョ戦士",nameKana:"",description:`魚に手足が生えた魚人獣。
鋭い歯でかみついてくる。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1250,defense:900,attribute:"Water",type:"Fish",wikiName:"《魚ギョ戦士》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B5%FB%A5%AE%A5%E7%C0%EF%BB%CE%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/魚族/攻1250/守 900
魚に手足が生えた魚人獣。
鋭い歯でかみついてくる。`,kind:"Monster"},恐竜人:{name:"恐竜人",nameKana:"",description:"人型の恐竜。高い知能を持つが、あまり強くはない。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:850,attribute:"Earth",type:"Dinosaur",wikiName:"《恐竜人》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B6%B2%CE%B5%BF%CD%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/恐竜族/攻1000/守 850
人型の恐竜。高い知能を持つが、あまり強くはない。`,kind:"Monster"},響女:{name:"響女",nameKana:"",description:`耳障りな音をガンガン響かせる。
相手を行動不能にしてしまう。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1450,defense:1e3,attribute:"Earth",type:"Warrior",wikiName:"《響女》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B6%C1%BD%F7%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/戦士族/攻1450/守1000
耳障りな音をガンガン響かせる。
相手を行動不能にしてしまう。`,kind:"Monster"},"極刀の武者 左京":{name:"極刀の武者 左京",nameKana:"",description:`夢現の闘宴は終に決す。
強者は勝鬨の声を上げよ。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:7,attack:2900,defense:2600,attribute:"Light",type:"Warrior",pendulumScaleR:10,pendulumScaleL:10,wikiName:"《極刀の武者 左京》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B6%CB%C5%E1%A4%CE%C9%F0%BC%D4%20%BA%B8%B5%FE%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター（使用不可カード）
星７/光属性/戦士族/攻2900/守2600
【Ｐスケール：青１０/赤１０】
(1)：１ターンに１度、自分のモンスターゾーンの戦士族Ｐモンスター３体を除外し、
自分のモンスターゾーンのＰモンスター１体を対象として発動できる。
このターンそのモンスターが直接攻撃で相手のＬＰを０にした場合、自分はマッチに勝利する。
【モンスター情報】
夢現の闘宴は終に決す。
強者は勝鬨の声を上げよ。`,kind:"Monster",pendulumDescription:`(1)：１ターンに１度、自分のモンスターゾーンの戦士族Ｐモンスター３体を除外し、
自分のモンスターゾーンのＰモンスター１体を対象として発動できる。
このターンそのモンスターが直接攻撃で相手のＬＰを０にした場合、自分はマッチに勝利する。`},吟幽獅神ペサンタ:{name:"吟幽獅神ペサンタ",nameKana:"",description:`敬虔な祈りに応じて顕現する異形。
未来予言の詩を吟詠するとされるが、その内容は摩訶不思議で全く理解できない。`,cardType:"Monster",monsterCategories:["Normal"],level:8,attack:2500,defense:2500,attribute:"Dark",type:"Illusion",wikiName:"《吟幽獅神ペサンタ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B6%E3%CD%A9%BB%E2%BF%C0%A5%DA%A5%B5%A5%F3%A5%BF%A1%D5",wikiTextAll:`通常モンスター
星８/闇属性/幻想魔族/攻2500/守2500
敬虔な祈りに応じて顕現する異形。
未来予言の詩を吟詠するとされるが、その内容は摩訶不思議で全く理解できない。`,kind:"Monster"},月の使者:{name:"月の使者",nameKana:"",description:"月の女神に仕える戦士。三日月のような矛で攻撃！",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1100,defense:1e3,attribute:"Light",type:"Warrior",wikiName:"《月の使者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B7%EE%A4%CE%BB%C8%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/戦士族/攻1100/守1000
月の女神に仕える戦士。三日月のような矛で攻撃！`,kind:"Monster"},"月の女神 エルザェム":{name:"月の女神 エルザェム",nameKana:"",description:`月を守護するきれいな女神。
月あかりのカーテンで攻撃を防ぐ。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:750,defense:1100,attribute:"Light",type:"Fairy",wikiName:"《月の女神 エルザェム》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B7%EE%A4%CE%BD%F7%BF%C0%20%A5%A8%A5%EB%A5%B6%A5%A7%A5%E0%A1%D5",wikiTextAll:`通常モンスター
星３/光属性/天使族/攻 750/守1100
月を守護するきれいな女神。
月あかりのカーテンで攻撃を防ぐ。`,kind:"Monster"},月明かりの乙女:{name:"月明かりの乙女",nameKana:"",description:`月に守護されている月の魔導士。
神秘的な魔法で幻想を見せる。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1300,attribute:"Light",type:"Spellcaster",wikiName:"《月明かりの乙女》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B7%EE%CC%C0%A4%AB%A4%EA%A4%CE%B2%B5%BD%F7%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/魔法使い族/攻1500/守1300
月に守護されている月の魔導士。
神秘的な魔法で幻想を見せる。`,kind:"Monster"},剣闘獣アンダル:{name:"剣闘獣アンダル",nameKana:"",description:`高い攻撃力で敵を追いつめる、隻眼の戦闘グマ。
恐るべきスピードと重さを誇る自慢のパンチを受けて倒れぬ者はいない。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1900,defense:1500,attribute:"Earth",type:"BeastWarrior",wikiName:"《剣闘獣アンダル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B7%F5%C6%AE%BD%C3%A5%A2%A5%F3%A5%C0%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣戦士族/攻1900/守1500
高い攻撃力で敵を追いつめる、隻眼の戦闘グマ。
恐るべきスピードと重さを誇る自慢のパンチを受けて倒れぬ者はいない。`,kind:"Monster",nameTags:["剣闘獣"]},剣竜:{name:"剣竜",nameKana:"",description:`全身にカタナのトゲがついた恐竜。
突進攻撃をする。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:1750,defense:2030,attribute:"Earth",type:"Dinosaur",wikiName:"《剣竜》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B7%F5%CE%B5%A1%D5",wikiTextAll:`通常モンスター
星６/地属性/恐竜族/攻1750/守2030
全身にカタナのトゲがついた恐竜。
突進攻撃をする。`,kind:"Monster"},幻のグリフォン:{name:"幻のグリフォン",nameKana:"",description:`山岳に隠れ棲む伝説のモンスター。
その翼はひと羽ばたきで嵐を巻き起こすという。
ハーピィとは仲が悪く、狩場を巡って争いが絶えないらしい。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:2e3,attribute:"Wind",type:"WingedBeast",wikiName:"《幻のグリフォン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B8%B8%A4%CE%A5%B0%A5%EA%A5%D5%A5%A9%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/鳥獣族/攻2000/守   0
山岳に隠れ棲む伝説のモンスター。
その翼はひと羽ばたきで嵐を巻き起こすという。
ハーピィとは仲が悪く、狩場を巡って争いが絶えないらしい。`,kind:"Monster",defense:0},幻殻竜:{name:"幻殻竜",nameKana:"",description:`別次元から突如として飛来した謎の生命体。
高い攻撃力と奇襲能力を併せ持つ。
その攻撃は対象物の神経を麻痺させ、強烈な幻覚症状を引き起こす。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:2e3,attribute:"Dark",type:"Wyrm",wikiName:"《幻殻竜》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B8%B8%B3%CC%CE%B5%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/幻竜族/攻2000/守   0
別次元から突如として飛来した謎の生命体。
高い攻撃力と奇襲能力を併せ持つ。
その攻撃は対象物の神経を麻痺させ、強烈な幻覚症状を引き起こす。`,kind:"Monster",defense:0},幻獣王ガゼル:{name:"幻獣王ガゼル",nameKana:"",description:"走るスピードが速すぎて、姿が幻のように見える獣。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1200,attribute:"Earth",type:"Beast",wikiName:"《幻獣王ガゼル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B8%B8%BD%C3%B2%A6%A5%AC%A5%BC%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣族/攻1500/守1200
走るスピードが速すぎて、姿が幻のように見える獣。`,kind:"Monster"},"幻想師・ノー・フェイス":{name:"幻想師・ノー・フェイス",nameKana:"",description:"幻影を見せ、ひらりと攻撃をかわす。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1200,defense:2200,attribute:"Dark",type:"Spellcaster",wikiName:"《幻想師・ノー・フェイス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B8%B8%C1%DB%BB%D5%A1%A6%A5%CE%A1%BC%A1%A6%A5%D5%A5%A7%A5%A4%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/魔法使い族/攻1200/守2200
幻影を見せ、ひらりと攻撃をかわす。`,kind:"Monster"},"幻煌龍 スパイラル":{name:"幻煌龍 スパイラル",nameKana:"",description:`熾烈な戦渦を経た猛き龍。
傷付いたその身は古の光に触れ、浸渦を遂げた。
やがて、龍はその翼を広げ、天渦を制する煌となる。
その新たなる煌は、夢か現か幻か。`,cardType:"Monster",monsterCategories:["Normal"],level:8,attack:2900,defense:2900,attribute:"Water",type:"Wyrm",wikiName:"《幻煌龍 スパイラル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B8%B8%DF%EA%CE%B6%20%A5%B9%A5%D1%A5%A4%A5%E9%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星８/水属性/幻竜族/攻2900/守2900
熾烈な戦渦を経た猛き龍。
傷付いたその身は古の光に触れ、浸渦を遂げた。
やがて、龍はその翼を広げ、天渦を制する煌となる。
その新たなる煌は、夢か現か幻か。`,kind:"Monster"},古代のトカゲ戦士:{name:"古代のトカゲ戦士",nameKana:"",description:"太古の、昔の姿そのままのトカゲの戦士。意外に強いぞ。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1100,attribute:"Earth",type:"Reptile",wikiName:"《古代のトカゲ戦士》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B8%C5%C2%E5%A4%CE%A5%C8%A5%AB%A5%B2%C0%EF%BB%CE%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/爬虫類族/攻1400/守1100
太古の、昔の姿そのままのトカゲの戦士。意外に強いぞ。`,kind:"Monster"},古代魔導士:{name:"古代魔導士",nameKana:"",description:"数多くの杖を持ち、それぞれを使い分け多彩な攻撃をする。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1e3,defense:1300,attribute:"Dark",type:"Spellcaster",wikiName:"《古代魔導士》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B8%C5%C2%E5%CB%E2%C6%B3%BB%CE%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/魔法使い族/攻1000/守1300
数多くの杖を持ち、それぞれを使い分け多彩な攻撃をする。`,kind:"Monster"},悟りの老樹:{name:"悟りの老樹",nameKana:"",description:"ありとあらゆる知識を駆使して、様々な攻撃を防ぐ。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:600,defense:1500,attribute:"Earth",type:"Plant",wikiName:"《悟りの老樹》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B8%E7%A4%EA%A4%CE%CF%B7%BC%F9%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/植物族/攻 600/守1500
ありとあらゆる知識を駆使して、様々な攻撃を防ぐ。`,kind:"Monster"},"光をもたらす者 ルシファー":{name:"光をもたらす者 ルシファー",nameKana:"",description:"我、至高の玉座にて天地を統べる者なり・・・光あれ！",cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2600,defense:1800,attribute:"Dark",type:"Fairy",wikiName:"《光をもたらす者 ルシファー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B8%F7%A4%F2%A4%E2%A4%BF%A4%E9%A4%B9%BC%D4%20%A5%EB%A5%B7%A5%D5%A5%A1%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星６/闇属性/天使族/攻2600/守1800
我、至高の玉座にて天地を統べる者なり・・・光あれ！`,kind:"Monster"},甲虫装甲騎士:{name:"甲虫装甲騎士",nameKana:"",description:`昆虫戦士の中でも、エリート中のエリートのみが所属できるという「無死虫団」の精鋭騎士。
彼らの高い戦闘能力は無視できない。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1900,defense:1500,attribute:"Earth",type:"Insect",wikiName:"《甲虫装甲騎士》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B9%C3%C3%EE%C1%F5%B9%C3%B5%B3%BB%CE%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/昆虫族/攻1900/守1500
昆虫戦士の中でも、エリート中のエリートのみが所属できるという「無死虫団」の精鋭騎士。
彼らの高い戦闘能力は無視できない。`,kind:"Monster"},紅葉の女王:{name:"紅葉の女王",nameKana:"",description:"鮮やかな紅葉に囲まれて暮らす、緑樹の霊王のお妃。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1800,defense:1500,attribute:"Earth",type:"Plant",wikiName:"《紅葉の女王》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B9%C8%CD%D5%A4%CE%BD%F7%B2%A6%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/植物族/攻1800/守1500
鮮やかな紅葉に囲まれて暮らす、緑樹の霊王のお妃。`,kind:"Monster"},鋼鉄の巨神像:{name:"鋼鉄の巨神像",nameKana:"",description:"機械の国にまつられているという、鋼鉄の巨神像。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1400,defense:1800,attribute:"Earth",type:"Machine",wikiName:"《鋼鉄の巨神像》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B9%DD%C5%B4%A4%CE%B5%F0%BF%C0%C1%FC%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/機械族/攻1400/守1800
機械の国にまつられているという、鋼鉄の巨神像。`,kind:"Monster"},黒い影の鬼王:{name:"黒い影の鬼王",nameKana:"",description:`黒い影にとりつかれたオーガ。
すごいスピードで突撃してくる。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1400,attribute:"Earth",type:"BeastWarrior",wikiName:"《黒い影の鬼王》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B9%F5%A4%A4%B1%C6%A4%CE%B5%B4%B2%A6%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣戦士族/攻1200/守1400
黒い影にとりつかれたオーガ。
すごいスピードで突撃してくる。`,kind:"Monster"},黒魔族のカーテン:{name:"黒魔族のカーテン",nameKana:"",description:"魔術師がつくりだしたカーテン。魔法使いの力が上がるという。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:600,defense:500,attribute:"Dark",type:"Spellcaster",wikiName:"《黒魔族のカーテン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B9%F5%CB%E2%C2%B2%A4%CE%A5%AB%A1%BC%A5%C6%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/魔法使い族/攻 600/守 500
魔術師がつくりだしたカーテン。魔法使いの力が上がるという。`,kind:"Monster"},骨ネズミ:{name:"骨ネズミ",nameKana:"",description:"ネコにやられた恨みをはらすため、アンデットとして蘇ったネズミ。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:400,defense:300,attribute:"Dark",type:"Zombie",wikiName:"《骨ネズミ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B9%FC%A5%CD%A5%BA%A5%DF%A1%D5",wikiTextAll:`通常モンスター
星１/闇属性/アンデット族/攻 400/守 300
ネコにやられた恨みをはらすため、アンデットとして蘇ったネズミ。`,kind:"Monster"},骨犬マロン:{name:"骨犬マロン",nameKana:"",description:`１０００年前に飼い主とはぐれてしまった迷犬。
未だにご主人の迎えを待ち続けている。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1350,defense:2e3,attribute:"Earth",type:"Beast",wikiName:"《骨犬マロン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B9%FC%B8%A4%A5%DE%A5%ED%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣族/攻1350/守2000
１０００年前に飼い主とはぐれてしまった迷犬。
未だにご主人の迎えを待ち続けている。`,kind:"Monster"},昆虫人間:{name:"昆虫人間",nameKana:"",description:`群をなして暮らす昆虫。
森の中は彼らの楽園だ。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:500,defense:700,attribute:"Earth",type:"Insect",wikiName:"《昆虫人間》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BA%AB%C3%EE%BF%CD%B4%D6%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/昆虫族/攻 500/守 700
群をなして暮らす昆虫。
森の中は彼らの楽園だ。`,kind:"Monster"},魂を狩る者:{name:"魂を狩る者",nameKana:"",description:"剣で斬りつけられた者は、魂をぬかれてしまう。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1100,defense:1e3,attribute:"Earth",type:"BeastWarrior",wikiName:"《魂を狩る者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BA%B2%A4%F2%BC%ED%A4%EB%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣戦士族/攻1100/守1000
剣で斬りつけられた者は、魂をぬかれてしまう。`,kind:"Monster"},魂喰らい:{name:"魂喰らい",nameKana:"",description:"全てが謎に包まれている超生命体。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,attribute:"Earth",type:"Fish",wikiName:"《魂喰らい》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BA%B2%B6%F4%A4%E9%A4%A4%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/魚族/攻1200/守　 0
全てが謎に包まれている超生命体。`,kind:"Monster",defense:0},魂虎:{name:"魂虎",nameKana:"",description:`人の魂をむさぼると言われている恐ろしい虎の魂。
できれば出会いたくない魂として有名。`,cardType:"Monster",monsterCategories:["Normal"],level:4,defense:2100,attribute:"Earth",type:"Beast",wikiName:"《魂虎》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BA%B2%B8%D7%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣族/攻   0/守2100
人の魂をむさぼると言われている恐ろしい虎の魂。
できれば出会いたくない魂として有名。`,kind:"Monster",attack:0},砦を守る翼竜:{name:"砦を守る翼竜",nameKana:"",description:`山の砦を守る竜。
天空から急降下して敵を攻撃。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1200,attribute:"Wind",type:"Dragon",wikiName:"《砦を守る翼竜》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BA%D6%A4%F2%BC%E9%A4%EB%CD%E3%CE%B5%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/ドラゴン族/攻1400/守1200
山の砦を守る竜。
天空から急降下して敵を攻撃。`,kind:"Monster"},三ツ首のギドー:{name:"三ツ首のギドー",nameKana:"",description:`三ツ首の怪物。
夜行性でとても凶暴な性格を持つ。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1400,attribute:"Dark",type:"Fiend",wikiName:"《三ツ首のギドー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BB%B0%A5%C4%BC%F3%A4%CE%A5%AE%A5%C9%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1200/守1400
三ツ首の怪物。
夜行性でとても凶暴な性格を持つ。`,kind:"Monster"},山の精霊:{name:"山の精霊",nameKana:"",description:"手にする笛の音を聞いた者は、力が抜けてしまうと言われている。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1300,defense:1800,attribute:"Earth",type:"Spellcaster",wikiName:"《山の精霊》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BB%B3%A4%CE%C0%BA%CE%EE%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/魔法使い族/攻1300/守1800
手にする笛の音を聞いた者は、力が抜けてしまうと言われている。`,kind:"Monster"},斬首の美女:{name:"斬首の美女",nameKana:"",description:"その美貌とはうらはらに、カタナで数多くの首をはねてきた女。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:800,attribute:"Earth",type:"Warrior",wikiName:"《斬首の美女》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BB%C2%BC%F3%A4%CE%C8%FE%BD%F7%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/戦士族/攻1600/守 800
その美貌とはうらはらに、カタナで数多くの首をはねてきた女。`,kind:"Monster"},屍を貪る竜:{name:"屍を貪る竜",nameKana:"",description:`何でも噛み砕く口を持つ恐竜。
その攻撃は強い。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1200,attribute:"Earth",type:"Dinosaur",wikiName:"《屍を貪る竜》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BB%D3%A4%F2%EC%C5%A4%EB%CE%B5%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/恐竜族/攻1600/守1200
何でも噛み砕く口を持つ恐竜。
その攻撃は強い。`,kind:"Monster"},"死の沈黙の天使 ドマ":{name:"死の沈黙の天使 ドマ",nameKana:"",description:`死を司る天使。
こいつに睨まれたら、死から逃れられない。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1600,defense:1400,attribute:"Dark",type:"Fairy",wikiName:"《死の沈黙の天使 ドマ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BB%E0%A4%CE%C4%C0%CC%DB%A4%CE%C5%B7%BB%C8%20%A5%C9%A5%DE%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/天使族/攻1600/守1400
死を司る天使。
こいつに睨まれたら、死から逃れられない。`,kind:"Monster"},死者の腕:{name:"死者の腕",nameKana:"",description:"混沌の沼から腕をのばし、生ける者を中へと引きずり込む。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:600,defense:600,attribute:"Dark",type:"Zombie",wikiName:"《死者の腕》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BB%E0%BC%D4%A4%CE%CF%D3%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/アンデット族/攻 600/守 600
混沌の沼から腕をのばし、生ける者を中へと引きずり込む。`,kind:"Monster"},死神のドクロイゾ:{name:"死神のドクロイゾ",nameKana:"",description:"地獄の一撃で魂を奪おうとする死神。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:1200,attribute:"Dark",type:"Zombie",wikiName:"《死神のドクロイゾ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BB%E0%BF%C0%A4%CE%A5%C9%A5%AF%A5%ED%A5%A4%A5%BE%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/アンデット族/攻 900/守1200
地獄の一撃で魂を奪おうとする死神。`,kind:"Monster"},死神ブーメラン:{name:"死神ブーメラン",nameKana:"",description:"ねらいを付けた標的をめがけてどこまでも飛んでゆく意志を持ったブーメラン。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:400,attribute:"Fire",type:"Fiend",wikiName:"《死神ブーメラン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BB%E0%BF%C0%A5%D6%A1%BC%A5%E1%A5%E9%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星３/炎属性/悪魔族/攻1000/守 400
ねらいを付けた標的をめがけてどこまでも飛んでゆく意志を持ったブーメラン。`,kind:"Monster"},死霊伯爵:{name:"死霊伯爵",nameKana:"",description:`魔界の伯爵。紳士を装ってはいるが、本性は邪悪そのもの。
人間だけでなく、低級悪魔たちにも恐れられている。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:2e3,defense:700,attribute:"Dark",type:"Fiend",wikiName:"《死霊伯爵》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BB%E0%CE%EE%C7%EC%BC%DF%A1%D5",wikiTextAll:`通常モンスター
星５/闇属性/悪魔族/攻2000/守 700
魔界の伯爵。紳士を装ってはいるが、本性は邪悪そのもの。
人間だけでなく、低級悪魔たちにも恐れられている。`,kind:"Monster"},紫炎の影武者:{name:"紫炎の影武者",nameKana:"",description:`シエンに仕える影武者。
鋭い切れ味の名刀を持つ。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:800,defense:400,attribute:"Earth",type:"Warrior",wikiName:"《紫炎の影武者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BB%E7%B1%EA%A4%CE%B1%C6%C9%F0%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/戦士族/攻 800/守 400
シエンに仕える影武者。
鋭い切れ味の名刀を持つ。`,kind:"Monster"},"時の魔人 ネクロランサ":{name:"時の魔人 ネクロランサ",nameKana:"",description:"好きな所へ行けるという時空リングから出てくる、一つ目の魔人。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:900,attribute:"Dark",type:"Spellcaster",wikiName:"《時の魔人 ネクロランサ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BB%FE%A4%CE%CB%E2%BF%CD%20%A5%CD%A5%AF%A5%ED%A5%E9%A5%F3%A5%B5%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/魔法使い族/攻 800/守 900
好きな所へ行けるという時空リングから出てくる、一つ目の魔人。`,kind:"Monster"},磁石の戦士α:{name:"磁石の戦士α",nameKana:"",description:"α、β、γで変形合体する。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1700,attribute:"Earth",type:"Rock",wikiName:"《磁石の戦士α》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BC%A7%C0%D0%A4%CE%C0%EF%BB%CE%A6%C1%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/岩石族/攻1400/守1700
α、β、γで変形合体する。`,kind:"Monster"},磁石の戦士β:{name:"磁石の戦士β",nameKana:"",description:"α、β、γで変形合体する。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1700,defense:1600,attribute:"Earth",type:"Rock",wikiName:"《磁石の戦士β》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BC%A7%C0%D0%A4%CE%C0%EF%BB%CE%A6%C2%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/岩石族/攻1700/守1600
α、β、γで変形合体する。`,kind:"Monster"},磁石の戦士γ:{name:"磁石の戦士γ",nameKana:"",description:"α、β、γで変形合体する。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1800,attribute:"Earth",type:"Rock",wikiName:"《磁石の戦士γ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BC%A7%C0%D0%A4%CE%C0%EF%BB%CE%A6%C3%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/岩石族/攻1500/守1800
α、β、γで変形合体する。`,kind:"Monster"},邪炎の翼:{name:"邪炎の翼",nameKana:"",description:"赤黒く燃える翼。全身から炎を吹き出し攻撃する。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:700,defense:600,attribute:"Fire",type:"Pyro",wikiName:"《邪炎の翼》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BC%D9%B1%EA%A4%CE%CD%E3%A1%D5",wikiTextAll:`通常モンスター
星２/炎属性/炎族/攻 700/守 600
赤黒く燃える翼。全身から炎を吹き出し攻撃する。`,kind:"Monster"},邪剣男爵:{name:"邪剣男爵",nameKana:"",description:"怨念のこもった剣をあやつる貴族。執念深く獲物を追いつめる。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1550,defense:800,attribute:"Dark",type:"Fiend",wikiName:"《邪剣男爵》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BC%D9%B7%F5%C3%CB%BC%DF%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1550/守 800
怨念のこもった剣をあやつる貴族。執念深く獲物を追いつめる。`,kind:"Monster"},守護竜ユスティア:{name:"守護竜ユスティア",nameKana:"",description:`星鍵は流れぬ涙を流し、天命は果たされる。
神の門は嘶き崩れ、蛇は守人の夢幻を喰らう。
其の魂は始まりの地に、彼の魂は終極の地に。
――此処に神獄たる星は闢かれん。`,cardType:"Monster",monsterCategories:["Normal","Tuner"],level:2,defense:2100,attribute:"Water",type:"Dragon",wikiName:"《守護竜ユスティア》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BC%E9%B8%EE%CE%B5%A5%E6%A5%B9%A5%C6%A5%A3%A5%A2%A1%D5",wikiTextAll:`チューナー・通常モンスター
星２/水属性/ドラゴン族/攻   0/守2100
星鍵は流れぬ涙を流し、天命は果たされる。
神の門は嘶き崩れ、蛇は守人の夢幻を喰らう。
其の魂は始まりの地に、彼の魂は終極の地に。
――此処に神獄たる星は闢かれん。`,kind:"Monster",attack:0},手招きする墓場:{name:"手招きする墓場",nameKana:"",description:"死者にさらなる力をあたえ、生ける者を死へとさそう墓場。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:700,defense:900,attribute:"Dark",type:"Zombie",wikiName:"《手招きする墓場》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BC%EA%BE%B7%A4%AD%A4%B9%A4%EB%CA%E8%BE%EC%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/アンデット族/攻 700/守 900
死者にさらなる力をあたえ、生ける者を死へとさそう墓場。`,kind:"Monster"},首なし騎士:{name:"首なし騎士",nameKana:"",description:`反逆者に仕立て上げられ処刑された騎士の亡霊。
失ったものを求め、出会った者に襲いかかる。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1450,defense:1700,attribute:"Earth",type:"Fiend",wikiName:"《首なし騎士》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BC%F3%A4%CA%A4%B7%B5%B3%BB%CE%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/悪魔族/攻1450/守1700
反逆者に仕立て上げられ処刑された騎士の亡霊。
失ったものを求め、出会った者に襲いかかる。`,kind:"Monster"},首狩り魔人:{name:"首狩り魔人",nameKana:"",description:`大きなカマを振り回しクビを狩る悪魔。
大きな目からビームも出す。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:1750,defense:1900,attribute:"Dark",type:"Fiend",wikiName:"《首狩り魔人》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BC%F3%BC%ED%A4%EA%CB%E2%BF%CD%A1%D5",wikiTextAll:`通常モンスター
星６/闇属性/悪魔族/攻1750/守1900
大きなカマを振り回しクビを狩る悪魔。
大きな目からビームも出す。`,kind:"Monster"},呪われし魔剣:{name:"呪われし魔剣",nameKana:"",description:"身につけ、呪いに打ち勝つことができた者は力を得られると言う。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:800,attribute:"Dark",type:"Warrior",wikiName:"《呪われし魔剣》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BC%F6%A4%EF%A4%EC%A4%B7%CB%E2%B7%F5%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/戦士族/攻1400/守 800
身につけ、呪いに打ち勝つことができた者は力を得られると言う。`,kind:"Monster"},女剣士カナン:{name:"女剣士カナン",nameKana:"",description:"チョウのように舞いハチのように刺す、剣と盾を手にした女戦士。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1400,attribute:"Earth",type:"Warrior",wikiName:"《女剣士カナン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BD%F7%B7%F5%BB%CE%A5%AB%A5%CA%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/戦士族/攻1400/守1400
チョウのように舞いハチのように刺す、剣と盾を手にした女戦士。`,kind:"Monster"},女帝カマキリ:{name:"女帝カマキリ",nameKana:"",description:`集団性の高い巨大カマキリの女王。
狩りや移動など、カマキリの大群は全て女王の指令により行動する。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2200,defense:1400,attribute:"Wind",type:"Insect",wikiName:"《女帝カマキリ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BD%F7%C4%EB%A5%AB%A5%DE%A5%AD%A5%EA%A1%D5",wikiTextAll:`通常モンスター
星６/風属性/昆虫族/攻2200/守1400
集団性の高い巨大カマキリの女王。
狩りや移動など、カマキリの大群は全て女王の指令により行動する。`,kind:"Monster"},召喚師ライズベルト:{name:"召喚師ライズベルト",nameKana:"",description:`妹セームベルをとても大事に想っている、心優しき兄ライズベルト。
昼下がりの午後に妹と一緒に魔術書を読む時間は毎日の日課になっており、
そんな二人の仲睦まじい様子に周囲の人々は自然と心が癒されてしまう。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:3,attack:800,defense:800,attribute:"Wind",type:"Psychic",pendulumScaleR:2,pendulumScaleL:2,wikiName:"《召喚師ライズベルト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BE%A4%B4%AD%BB%D5%A5%E9%A5%A4%A5%BA%A5%D9%A5%EB%A5%C8%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星３/風属性/サイキック族/攻 800/守 800
【Ｐスケール：青２/赤２】
(1)：１ターンに１度、フィールドの表側表示モンスター１体を対象として発動できる。
そのモンスターのレベルを１つ上げる。
【モンスター情報】
妹セームベルをとても大事に想っている、心優しき兄ライズベルト。
昼下がりの午後に妹と一緒に魔術書を読む時間は毎日の日課になっており、
そんな二人の仲睦まじい様子に周囲の人々は自然と心が癒されてしまう。`,kind:"Monster",pendulumDescription:`(1)：１ターンに１度、フィールドの表側表示モンスター１体を対象として発動できる。
そのモンスターのレベルを１つ上げる。`},笑う花:{name:"笑う花",nameKana:"",description:`いつも笑っている花。
笑い声を聞きつづけると、頭が混乱する。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:900,defense:500,attribute:"Earth",type:"Plant",wikiName:"《笑う花》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BE%D0%A4%A6%B2%D6%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/植物族/攻 900/守 500
いつも笑っている花。
笑い声を聞きつづけると、頭が混乱する。`,kind:"Monster"},振り子刃の拷問機械:{name:"振り子刃の拷問機械",nameKana:"",description:"大きな振り子の刃で相手をまっぷたつ！恐ろしい拷問機械。",cardType:"Monster",monsterCategories:["Normal"],level:6,attack:1750,defense:2e3,attribute:"Dark",type:"Machine",wikiName:"《振り子刃の拷問機械》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BF%B6%A4%EA%BB%D2%BF%CF%A4%CE%B9%E9%CC%E4%B5%A1%B3%A3%A1%D5",wikiTextAll:`通常モンスター
星６/闇属性/機械族/攻1750/守2000
大きな振り子の刃で相手をまっぷたつ！恐ろしい拷問機械。`,kind:"Monster"},森の屍:{name:"森の屍",nameKana:"",description:"森のぬしが倒れたあと、悪しき者の手により蘇った屍。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:900,attribute:"Dark",type:"Zombie",wikiName:"《森の屍》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BF%B9%A4%CE%BB%D3%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/アンデット族/攻1000/守 900
森のぬしが倒れたあと、悪しき者の手により蘇った屍。`,kind:"Monster"},深き森の長老:{name:"深き森の長老",nameKana:"",description:`昔から森に住んでいる白ヤギ。
真の姿は森の長老。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:1800,defense:1900,attribute:"Earth",type:"Beast",wikiName:"《深き森の長老》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BF%BC%A4%AD%BF%B9%A4%CE%C4%B9%CF%B7%A1%D5",wikiTextAll:`通常モンスター
星６/地属性/獣族/攻1800/守1900
昔から森に住んでいる白ヤギ。
真の姿は森の長老。`,kind:"Monster"},深淵に咲く花:{name:"深淵に咲く花",nameKana:"",description:"光の届かない深淵にひっそりと咲く、あまり見かけない花。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:750,defense:400,attribute:"Earth",type:"Plant",wikiName:"《深淵に咲く花》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BF%BC%CA%A5%A4%CB%BA%E9%A4%AF%B2%D6%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/植物族/攻 750/守 400
光の届かない深淵にひっそりと咲く、あまり見かけない花。`,kind:"Monster"},深淵の冥王:{name:"深淵の冥王",nameKana:"",description:"冥界の王。かつて闇を全て支配するほどの力があったという。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:800,attribute:"Dark",type:"Fiend",wikiName:"《深淵の冥王》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BF%BC%CA%A5%A4%CE%CC%BD%B2%A6%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/悪魔族/攻1200/守 800
冥界の王。かつて闇を全て支配するほどの力があったという。`,kind:"Monster"},真紅眼の黒竜:{name:"真紅眼の黒竜",nameKana:"",description:`真紅の眼を持つ黒竜。
怒りの黒き炎はその眼に映る者全てを焼き尽くす。`,cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2400,defense:2e3,attribute:"Dark",type:"Dragon",wikiName:"《真紅眼の黒竜》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BF%BF%B9%C8%B4%E3%A4%CE%B9%F5%CE%B5%A1%D5",wikiTextAll:`通常モンスター
星７/闇属性/ドラゴン族/攻2400/守2000
真紅の眼を持つ黒竜。
怒りの黒き炎はその眼に映る者全てを焼き尽くす。`,kind:"Monster"},神魚:{name:"神魚",nameKana:"",description:`水中を優雅に泳ぐ魚の神様。
怒らせると危険。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1650,defense:1700,attribute:"Water",type:"Fish",wikiName:"《神魚》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BF%C0%B5%FB%A1%D5",wikiTextAll:`通常モンスター
星５/水属性/魚族/攻1650/守1700
水中を優雅に泳ぐ魚の神様。
怒らせると危険。`,kind:"Monster"},神聖なる球体:{name:"神聖なる球体",nameKana:"",description:`聖なる輝きに包まれた天使の魂。
その美しい姿を見た者は、願い事がかなうと言われている。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:500,defense:500,attribute:"Light",type:"Fairy",wikiName:"《神聖なる球体》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BF%C0%C0%BB%A4%CA%A4%EB%B5%E5%C2%CE%A1%D5",wikiTextAll:`通常モンスター
星２/光属性/天使族/攻 500/守 500
聖なる輝きに包まれた天使の魂。
その美しい姿を見た者は、願い事がかなうと言われている。`,kind:"Monster"},"神竜 ラグナロク":{name:"神竜 ラグナロク",nameKana:"",description:`神の使いと言い伝えられている伝説の竜。
その怒りに触れた時、世界は海に沈むと言われている。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1e3,attribute:"Light",type:"Dragon",wikiName:"《神竜 ラグナロク》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BF%C0%CE%B5%20%A5%E9%A5%B0%A5%CA%A5%ED%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/ドラゴン族/攻1500/守1000
神の使いと言い伝えられている伝説の竜。
その怒りに触れた時、世界は海に沈むと言われている。`,kind:"Monster"},神龍の聖刻印:{name:"神龍の聖刻印",nameKana:"",description:`謎の刻印が刻まれた聖なる遺物。
神の如く力を振るった龍の力を封じた物と伝承は語る。
黄金の太陽の下、悠久の刻を経て、
それはやがて神々しさと共に太陽石と呼ばれるようになった。`,cardType:"Monster",monsterCategories:["Normal"],level:8,attribute:"Light",type:"Dragon",wikiName:"《神龍の聖刻印》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BF%C0%CE%B6%A4%CE%C0%BB%B9%EF%B0%F5%A1%D5",wikiTextAll:`通常モンスター
星８/光属性/ドラゴン族/攻   0/守   0
謎の刻印が刻まれた聖なる遺物。
神の如く力を振るった龍の力を封じた物と伝承は語る。
黄金の太陽の下、悠久の刻を経て、
それはやがて神々しさと共に太陽石と呼ばれるようになった。`,kind:"Monster",defense:0,attack:0,nameTags:["聖刻"]},人喰い植物:{name:"人喰い植物",nameKana:"",description:"きれいな花と思わせ、近づく人をパクリと食べる、肉食の花。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:800,defense:600,attribute:"Earth",type:"Plant",wikiName:"《人喰い植物》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BF%CD%B6%F4%A4%A4%BF%A2%CA%AA%A1%D5",wikiTextAll:`通常モンスター
星２/地属性/植物族/攻 800/守 600
きれいな花と思わせ、近づく人をパクリと食べる、肉食の花。`,kind:"Monster"},人喰い宝石箱:{name:"人喰い宝石箱",nameKana:"",description:"宝石箱の形をしたモンスター。冒険者をだまして襲いかかる。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1e3,attribute:"Dark",type:"Fiend",wikiName:"《人喰い宝石箱》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BF%CD%B6%F4%A4%A4%CA%F5%C0%D0%C8%A2%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1600/守1000
宝石箱の形をしたモンスター。冒険者をだまして襲いかかる。`,kind:"Monster"},人造木人１８:{name:"人造木人１８",nameKana:"",description:`謎の大木１８が魔界の先端技術により改造された姿。
頑丈な装甲に重点を置きすぎた結果、機動性が犠牲になった。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:500,defense:2500,attribute:"Fire",type:"Machine",wikiName:"《人造木人１８》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BF%CD%C2%A4%CC%DA%BF%CD%A3%B1%A3%B8%A1%D5",wikiTextAll:`通常モンスター
星５/炎属性/機械族/攻 500/守2500
謎の大木１８が魔界の先端技術により改造された姿。
頑丈な装甲に重点を置きすぎた結果、機動性が犠牲になった。`,kind:"Monster"},水の魔導師:{name:"水の魔導師",nameKana:"",description:"水で相手の周りを囲んで、包むように攻撃をする。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1e3,attribute:"Water",type:"Aqua",wikiName:"《水の魔導師》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BF%E5%A4%CE%CB%E2%C6%B3%BB%D5%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1400/守1000
水で相手の周りを囲んで、包むように攻撃をする。`,kind:"Monster"},水の踊り子:{name:"水の踊り子",nameKana:"",description:"かめから次々とあふれでる水を、竜に変えて攻撃してくる。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1200,attribute:"Water",type:"Aqua",wikiName:"《水の踊り子》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BF%E5%A4%CE%CD%D9%A4%EA%BB%D2%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1400/守1200
かめから次々とあふれでる水を、竜に変えて攻撃してくる。`,kind:"Monster"},水陸の帝王:{name:"水陸の帝王",nameKana:"",description:"大きな口から四方八方に炎をはく、爬虫類のばけもの。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1800,defense:1500,attribute:"Water",type:"Reptile",wikiName:"《水陸の帝王》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BF%E5%CE%A6%A4%CE%C4%EB%B2%A6%A1%D5",wikiTextAll:`通常モンスター
星５/水属性/爬虫類族/攻1800/守1500
大きな口から四方八方に炎をはく、爬虫類のばけもの。`,kind:"Monster"},星杯に選ばれし者:{name:"星杯に選ばれし者",nameKana:"",description:`機怪の残骸で武装する、真っ直ぐな心の少年。
星辰の森に古くから伝わる『星の勇者』に憧れており、
妖精リースの願いを受けて、光を授かった仲間たちと共に七つの星遺物を解き放つ旅に出る。

”星明かりの勇者　掲げし剣に光を束ね　大いなる闇を討ち祓わん”`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1600,attribute:"Fire",type:"Psychic",wikiName:"《星杯に選ばれし者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%B1%C7%D5%A4%CB%C1%AA%A4%D0%A4%EC%A4%B7%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星３/炎属性/サイキック族/攻1600/守   0
機怪の残骸で武装する、真っ直ぐな心の少年。
星辰の森に古くから伝わる『星の勇者』に憧れており、
妖精リースの願いを受けて、光を授かった仲間たちと共に七つの星遺物を解き放つ旅に出る。

”星明かりの勇者　掲げし剣に光を束ね　大いなる闇を討ち祓わん”`,kind:"Monster",defense:0},星杯に誘われし者:{name:"星杯に誘われし者",nameKana:"",description:`機怪との戦いに明け暮れる青年。
森の周辺に生息する機怪蟲が突如凶暴化した際にも、
一歩も引かずに結界への侵入を防ぎ続けた。
常に先陣を駆けるその雄姿は森の民を奮い立たせるが、
本人はたった一人の妹を守る為だけにその槍を振るっている。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,attribute:"Earth",type:"Warrior",wikiName:"《星杯に誘われし者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%B1%C7%D5%A4%CB%CD%B6%A4%EF%A4%EC%A4%B7%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/戦士族/攻1800/守   0
機怪との戦いに明け暮れる青年。
森の周辺に生息する機怪蟲が突如凶暴化した際にも、
一歩も引かずに結界への侵入を防ぎ続けた。
常に先陣を駆けるその雄姿は森の民を奮い立たせるが、
本人はたった一人の妹を守る為だけにその槍を振るっている。`,kind:"Monster",defense:0},星杯を戴く巫女:{name:"星杯を戴く巫女",nameKana:"",description:`星神に鎮魂の祈りを捧げる巫女。
手にした杖は代々受け継がれし祭器であり、力を結界に変えて機界騎士による支配から森の民を守護している。
森の守護竜が懐く程の神通力をその身に秘めているが、普段は兄と幼馴染を大切に想う、心優しい少女の顔を見せる。`,cardType:"Monster",monsterCategories:["Normal"],level:2,defense:2100,attribute:"Water",type:"Spellcaster",wikiName:"《星杯を戴く巫女》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%B1%C7%D5%A4%F2%C2%D7%A4%AF%D6%E0%BD%F7%A1%D5",wikiTextAll:`通常モンスター
星２/水属性/魔法使い族/攻   0/守2100
星神に鎮魂の祈りを捧げる巫女。
手にした杖は代々受け継がれし祭器であり、力を結界に変えて機界騎士による支配から森の民を守護している。
森の守護竜が懐く程の神通力をその身に秘めているが、普段は兄と幼馴染を大切に想う、心優しい少女の顔を見せる。`,kind:"Monster",attack:0},生き血をすするもの:{name:"生き血をすするもの",nameKana:"",description:"暗闇の中、道行く人々を襲う人型の吸血ヘビ。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:800,attribute:"Earth",type:"Reptile",wikiName:"《生き血をすするもの》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%B8%A4%AD%B7%EC%A4%F2%A4%B9%A4%B9%A4%EB%A4%E2%A4%CE%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/爬虫類族/攻 900/守 800
暗闇の中、道行く人々を襲う人型の吸血ヘビ。`,kind:"Monster"},聖なる鎖:{name:"聖なる鎖",nameKana:"",description:"聖なる力で、動きを封じることができると言われている鎖。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:700,defense:700,attribute:"Light",type:"Fairy",wikiName:"《聖なる鎖》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%BB%A4%CA%A4%EB%BA%BF%A1%D5",wikiTextAll:`通常モンスター
星２/光属性/天使族/攻 700/守 700
聖なる力で、動きを封じることができると言われている鎖。`,kind:"Monster"},聖騎士アルトリウス:{name:"聖騎士アルトリウス",nameKana:"",description:`聖騎士団に所属する聡明な青年騎士。
導かれるかの如く分け入った森の中、ついに運命にたどり着く。
そして青年は大きな一歩を踏み出すのだ。
――これは全ての始まりであり、大いなる叙事詩である。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,defense:1800,attribute:"Light",type:"Warrior",wikiName:"《聖騎士アルトリウス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%BB%B5%B3%BB%CE%A5%A2%A5%EB%A5%C8%A5%EA%A5%A6%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/戦士族/攻1800/守1800
聖騎士団に所属する聡明な青年騎士。
導かれるかの如く分け入った森の中、ついに運命にたどり着く。
そして青年は大きな一歩を踏み出すのだ。
――これは全ての始まりであり、大いなる叙事詩である。`,kind:"Monster"},聖種の地霊:{name:"聖種の地霊",nameKana:"",description:"千年に１度、聖天樹から獲れる種は、千年の時を経てその土地の守護精霊になると言われている。",cardType:"Monster",monsterCategories:["Normal"],level:1,defense:600,attribute:"Earth",type:"Plant",wikiName:"《聖種の地霊》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%BB%BC%EF%A4%CE%C3%CF%CE%EE%A1%D5",wikiTextAll:`通常モンスター
星１/地属性/植物族/攻   0/守 600
千年に１度、聖天樹から獲れる種は、千年の時を経てその土地の守護精霊になると言われている。`,kind:"Monster",attack:0},青眼の銀ゾンビ:{name:"青眼の銀ゾンビ",nameKana:"",description:"目から出す怪光線で、相手をゾンビに変えてしまうと言われている。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:700,attribute:"Dark",type:"Zombie",wikiName:"《青眼の銀ゾンビ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%C4%B4%E3%A4%CE%B6%E4%A5%BE%A5%F3%A5%D3%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/アンデット族/攻 900/守 700
目から出す怪光線で、相手をゾンビに変えてしまうと言われている。`,kind:"Monster"},青眼の白龍:{name:"青眼の白龍",nameKana:"",description:`高い攻撃力を誇る伝説のドラゴン。
どんな相手でも粉砕する、その破壊力は計り知れない。`,cardType:"Monster",monsterCategories:["Normal"],level:8,attack:3e3,defense:2500,attribute:"Light",type:"Dragon",wikiName:"《青眼の白龍》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%C4%B4%E3%A4%CE%C7%F2%CE%B6%A1%D5",wikiTextAll:`通常モンスター
星８/光属性/ドラゴン族/攻3000/守2500
高い攻撃力を誇る伝説のドラゴン。
どんな相手でも粉砕する、その破壊力は計り知れない。`,kind:"Monster"},青虫:{name:"青虫",nameKana:"",description:`糸をはき攻撃する。
どんなムシに成長するか分からない。`,cardType:"Monster",monsterCategories:["Normal"],level:1,attack:250,defense:300,attribute:"Earth",type:"Insect",wikiName:"《青虫》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%C4%C3%EE%A1%D5",wikiTextAll:`通常モンスター
星１/地属性/昆虫族/攻 250/守 300
糸をはき攻撃する。
どんなムシに成長するか分からない。`,kind:"Monster"},隻眼のホワイトタイガー:{name:"隻眼のホワイトタイガー",nameKana:"",description:"ある者には恐怖、ある者には尊敬の対象とされている、気高き密林の王者。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1300,defense:500,attribute:"Wind",type:"Beast",wikiName:"《隻眼のホワイトタイガー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%C9%B4%E3%A4%CE%A5%DB%A5%EF%A5%A4%A5%C8%A5%BF%A5%A4%A5%AC%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星３/風属性/獣族/攻1300/守 500
ある者には恐怖、ある者には尊敬の対象とされている、気高き密林の王者。`,kind:"Monster"},赤き剣のライムンドス:{name:"赤き剣のライムンドス",nameKana:"",description:`赤き炎の剣を持った戦士。
炎の束縛で動きを封じる。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1300,attribute:"Earth",type:"Warrior",wikiName:"《赤き剣のライムンドス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%D6%A4%AD%B7%F5%A4%CE%A5%E9%A5%A4%A5%E0%A5%F3%A5%C9%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/戦士族/攻1200/守1300
赤き炎の剣を持った戦士。
炎の束縛で動きを封じる。`,kind:"Monster"},"絶対なる王者－メガプランダー":{name:"絶対なる王者－メガプランダー",nameKana:"",description:`大地を統べる恐竜の王。
力強い雄叫びで敵を震え上がらせるぞ！`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2e3,defense:1500,attribute:"Earth",type:"Dinosaur",wikiName:"《絶対なる王者－メガプランダー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%E4%C2%D0%A4%CA%A4%EB%B2%A6%BC%D4%A1%DD%A5%E1%A5%AC%A5%D7%A5%E9%A5%F3%A5%C0%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星６/地属性/恐竜族/攻2000/守1500
大地を統べる恐竜の王。
力強い雄叫びで敵を震え上がらせるぞ！`,kind:"Monster"},舌魚:{name:"舌魚",nameKana:"",description:"他の魚を長い舌で捕まえ、エネルギーを吸収する。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1350,defense:800,attribute:"Water",type:"Fish",wikiName:"《舌魚》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%E5%B5%FB%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/魚族/攻1350/守 800
他の魚を長い舌で捕まえ、エネルギーを吸収する。`,kind:"Monster"},千眼の邪教神:{name:"千眼の邪教神",nameKana:"",description:`人の心を操る邪神。
千の邪眼は、人の負の心を見透かし増大させる。`,cardType:"Monster",monsterCategories:["Normal"],level:1,attribute:"Dark",type:"Spellcaster",wikiName:"《千眼の邪教神》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%E9%B4%E3%A4%CE%BC%D9%B6%B5%BF%C0%A1%D5",wikiTextAll:`通常モンスター
星１/闇属性/魔法使い族/攻   0/守   0
人の心を操る邪神。
千の邪眼は、人の負の心を見透かし増大させる。`,kind:"Monster",defense:0,attack:0},千年の盾:{name:"千年の盾",nameKana:"",description:`古代エジプト王家より伝わるといわれている伝説の盾。
どんなに強い攻撃でも防げるという。`,cardType:"Monster",monsterCategories:["Normal"],level:5,defense:3e3,attribute:"Earth",type:"Warrior",wikiName:"《千年の盾》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%E9%C7%AF%A4%CE%BD%E2%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/戦士族/攻   0/守3000
古代エジプト王家より伝わるといわれている伝説の盾。
どんなに強い攻撃でも防げるという。`,kind:"Monster",attack:0},千年ゴーレム:{name:"千年ゴーレム",nameKana:"",description:"千年もの間、財宝を守りつづけてきたゴーレム。",cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2e3,defense:2200,attribute:"Earth",type:"Rock",wikiName:"《千年ゴーレム》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%E9%C7%AF%A5%B4%A1%BC%A5%EC%A5%E0%A1%D5",wikiTextAll:`通常モンスター
星６/地属性/岩石族/攻2000/守2200
千年もの間、財宝を守りつづけてきたゴーレム。`,kind:"Monster"},千年原人:{name:"千年原人",nameKana:"",description:"どんな時でも力で押し通す、千年アイテムを持つ原始人。",cardType:"Monster",monsterCategories:["Normal"],level:8,attack:2750,defense:2500,attribute:"Earth",type:"BeastWarrior",wikiName:"《千年原人》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%E9%C7%AF%B8%B6%BF%CD%A1%D5",wikiTextAll:`通常モンスター
星８/地属性/獣戦士族/攻2750/守2500
どんな時でも力で押し通す、千年アイテムを持つ原始人。`,kind:"Monster"},"戦いの神 オリオン":{name:"戦いの神 オリオン",nameKana:"",description:`戦いの神と言われている天使。
その戦いを見た者は誰もいない。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1800,defense:1500,attribute:"Light",type:"Fairy",wikiName:"《戦いの神 オリオン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%EF%A4%A4%A4%CE%BF%C0%20%A5%AA%A5%EA%A5%AA%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星５/光属性/天使族/攻1800/守1500
戦いの神と言われている天使。
その戦いを見た者は誰もいない。`,kind:"Monster"},"戦士ダイ・グレファー":{name:"戦士ダイ・グレファー",nameKana:"",description:`ドラゴン族を操る才能を秘めた戦士。
過去は謎に包まれている。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1700,defense:1600,attribute:"Earth",type:"Warrior",wikiName:"《戦士ダイ・グレファー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%EF%BB%CE%A5%C0%A5%A4%A1%A6%A5%B0%A5%EC%A5%D5%A5%A1%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/戦士族/攻1700/守1600
ドラゴン族を操る才能を秘めた戦士。
過去は謎に包まれている。`,kind:"Monster"},泉の妖精:{name:"泉の妖精",nameKana:"",description:"泉を守る妖精。泉を汚す者を容赦なく攻撃。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1100,attribute:"Water",type:"Aqua",wikiName:"《泉の妖精》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%F4%A4%CE%CD%C5%C0%BA%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1600/守1100
泉を守る妖精。泉を汚す者を容赦なく攻撃。`,kind:"Monster"},閃光の騎士:{name:"閃光の騎士",nameKana:"",description:`神の振り子により新たな力を会得した騎士。
今こそ覚醒し、その力を解放せよ！`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:4,attack:1800,defense:600,attribute:"Light",type:"Warrior",pendulumScaleR:7,pendulumScaleL:7,wikiName:"《閃光の騎士》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C1%AE%B8%F7%A4%CE%B5%B3%BB%CE%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星４/光属性/戦士族/攻1800/守 600
【Ｐスケール：青７/赤７】
【モンスター情報】
神の振り子により新たな力を会得した騎士。
今こそ覚醒し、その力を解放せよ！`,kind:"Monster",pendulumDescription:""},太古の壺:{name:"太古の壺",nameKana:"",description:"とても壊れやすい大昔の壺。中に何かが潜んでいるらしい。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:400,defense:200,attribute:"Earth",type:"Rock",wikiName:"《太古の壺》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C2%C0%B8%C5%A4%CE%D4%E4%A1%D5",wikiTextAll:`通常モンスター
星１/地属性/岩石族/攻 400/守 200
とても壊れやすい大昔の壺。中に何かが潜んでいるらしい。`,kind:"Monster"},大くしゃみのカバザウルス:{name:"大くしゃみのカバザウルス",nameKana:"",description:`巨大な体を持つカバの化け物。
その巨体からくり出されるクシャミは、ハリケーンに匹敵する。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1700,defense:1500,attribute:"Water",type:"Dinosaur",wikiName:"《大くしゃみのカバザウルス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C2%E7%A4%AF%A4%B7%A4%E3%A4%DF%A4%CE%A5%AB%A5%D0%A5%B6%A5%A6%A5%EB%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/恐竜族/攻1700/守1500
巨大な体を持つカバの化け物。
その巨体からくり出されるクシャミは、ハリケーンに匹敵する。`,kind:"Monster"},大食いグール:{name:"大食いグール",nameKana:"",description:"どんなに食べても、おなかがいっぱいになることは無いというモンスター。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1200,attribute:"Dark",type:"Zombie",wikiName:"《大食いグール》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C2%E7%BF%A9%A4%A4%A5%B0%A1%BC%A5%EB%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/アンデット族/攻1600/守1200
どんなに食べても、おなかがいっぱいになることは無いというモンスター。`,kind:"Monster"},大砲だるま:{name:"大砲だるま",nameKana:"",description:"大砲で埋め尽くされているメカだるま。ねらいは外さない。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:900,defense:500,attribute:"Dark",type:"Machine",wikiName:"《大砲だるま》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C2%E7%CB%A4%A4%C0%A4%EB%A4%DE%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/機械族/攻 900/守 500
大砲で埋め尽くされているメカだるま。ねらいは外さない。`,kind:"Monster"},大木人１８:{name:"大木人１８",nameKana:"",description:"切り倒された大木に邪悪な魂が宿った姿。森に迷い込んだ者に襲いかかる。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1900,attribute:"Earth",type:"Machine",wikiName:"《大木人１８》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C2%E7%CC%DA%BF%CD%A3%B1%A3%B8%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/機械族/攻1600/守1900
切り倒された大木に邪悪な魂が宿った姿。森に迷い込んだ者に襲いかかる。`,kind:"Monster"},大木炭１８:{name:"大木炭１８",nameKana:"",description:`完全に燃え尽きてしまった巨木の化身。
この炭で焼く肉は絶品と言われ、重宝されている。`,cardType:"Monster",monsterCategories:["Normal"],level:1,attack:100,defense:2100,attribute:"Fire",type:"Pyro",wikiName:"《大木炭１８》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C2%E7%CC%DA%C3%BA%A3%B1%A3%B8%A1%D5",wikiTextAll:`通常モンスター
星１/炎属性/炎族/攻 100/守2100
完全に燃え尽きてしまった巨木の化身。
この炭で焼く肉は絶品と言われ、重宝されている。`,kind:"Monster"},達人キョンシー:{name:"達人キョンシー",nameKana:"",description:`強い相手を求めさまよっているキョンシー。
かつてはあらゆる武術の達人として知られていたらしい。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1750,defense:1e3,attribute:"Earth",type:"Zombie",wikiName:"《達人キョンシー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C3%A3%BF%CD%A5%AD%A5%E7%A5%F3%A5%B7%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/アンデット族/攻1750/守1000
強い相手を求めさまよっているキョンシー。
かつてはあらゆる武術の達人として知られていたらしい。`,kind:"Monster"},誕生の天使:{name:"誕生の天使",nameKana:"",description:"女性のおなかに命が宿った事を知らせてくれると言われている。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1400,defense:1700,attribute:"Light",type:"Fairy",wikiName:"《誕生の天使》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C3%C2%C0%B8%A4%CE%C5%B7%BB%C8%A1%D5",wikiTextAll:`通常モンスター
星５/光属性/天使族/攻1400/守1700
女性のおなかに命が宿った事を知らせてくれると言われている。`,kind:"Monster"},団結するレジスタンス:{name:"団結するレジスタンス",nameKana:"",description:`強大な力に立ち向かう誓いを交わすために集結した人々。
革命の日は近い。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:400,attribute:"Wind",type:"Thunder",wikiName:"《団結するレジスタンス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C3%C4%B7%EB%A4%B9%A4%EB%A5%EC%A5%B8%A5%B9%A5%BF%A5%F3%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星３/風属性/雷族/攻1000/守 400
強大な力に立ち向かう誓いを交わすために集結した人々。
革命の日は近い。`,kind:"Monster"},弾圧される民:{name:"弾圧される民",nameKana:"",description:"いつの日か自由を手にする事ができると信じて日々の生活に耐えている。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:400,defense:2e3,attribute:"Water",type:"Aqua",wikiName:"《弾圧される民》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C3%C6%B0%B5%A4%B5%A4%EC%A4%EB%CC%B1%A1%D5",wikiTextAll:`通常モンスター
星１/水属性/水族/攻 400/守2000
いつの日か自由を手にする事ができると信じて日々の生活に耐えている。`,kind:"Monster"},地を這うドラゴン:{name:"地を這うドラゴン",nameKana:"",description:`力が弱り、空を飛べなくなったドラゴン。
しかしまだ攻撃は強い。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1600,defense:1400,attribute:"Earth",type:"Dragon",wikiName:"《地を這うドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C3%CF%A4%F2%C7%E7%A4%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/ドラゴン族/攻1600/守1400
力が弱り、空を飛べなくなったドラゴン。
しかしまだ攻撃は強い。`,kind:"Monster"},地獄の裁判:{name:"地獄の裁判",nameKana:"",description:"敵を棺桶に閉じこめ、地獄の使いがグサリと判決を下す。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:900,attribute:"Dark",type:"Fiend",wikiName:"《地獄の裁判》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C3%CF%B9%F6%A4%CE%BA%DB%C8%BD%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1300/守 900
敵を棺桶に閉じこめ、地獄の使いがグサリと判決を下す。`,kind:"Monster"},地獄の魔物使い:{name:"地獄の魔物使い",nameKana:"",description:"モンスターを自在に操り攻撃してくる、モンスター使い。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1800,defense:1600,attribute:"Earth",type:"Warrior",wikiName:"《地獄の魔物使い》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C3%CF%B9%F6%A4%CE%CB%E2%CA%AA%BB%C8%A4%A4%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/戦士族/攻1800/守1600
モンスターを自在に操り攻撃してくる、モンスター使い。`,kind:"Monster"},地縛霊:{name:"地縛霊",nameKana:"",description:`闘いに敗れた兵士たちの魂が一つになった怨霊。
この地に足を踏み入れた者を地中に引きずり込もうとする。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:500,defense:2e3,attribute:"Earth",type:"Fiend",wikiName:"《地縛霊》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C3%CF%C7%FB%CE%EE%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/悪魔族/攻 500/守2000
闘いに敗れた兵士たちの魂が一つになった怨霊。
この地に足を踏み入れた者を地中に引きずり込もうとする。`,kind:"Monster"},地雷獣:{name:"地雷獣",nameKana:"",description:"強力な電磁波をバリバリとまわりに放出して攻撃する。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1300,attribute:"Earth",type:"Thunder",wikiName:"《地雷獣》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C3%CF%CD%EB%BD%C3%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/雷族/攻1200/守1300
強力な電磁波をバリバリとまわりに放出して攻撃する。`,kind:"Monster"},蜘蛛男:{name:"蜘蛛男",nameKana:"",description:"巨大クモが知恵をつけた姿。糸を吐き動きを封じ込める。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:700,defense:1400,attribute:"Earth",type:"Insect",wikiName:"《蜘蛛男》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C3%D8%E9%E1%C3%CB%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/昆虫族/攻 700/守1400
巨大クモが知恵をつけた姿。糸を吐き動きを封じ込める。`,kind:"Monster"},"超時空戦闘機ビック・バイパー":{name:"超時空戦闘機ビック・バイパー",nameKana:"",description:"パワーカプセルにより、様々な能力を発揮する超高性能戦闘機。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:800,attribute:"Light",type:"Machine",wikiName:"《超時空戦闘機ビック・バイパー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C4%B6%BB%FE%B6%F5%C0%EF%C6%AE%B5%A1%A5%D3%A5%C3%A5%AF%A1%A6%A5%D0%A5%A4%A5%D1%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/機械族/攻1200/守 800
パワーカプセルにより、様々な能力を発揮する超高性能戦闘機。`,kind:"Monster"},泥に潜み棲むもの:{name:"泥に潜み棲むもの",nameKana:"",description:"足下がドロドロと溶けだしたら、こいつが現れる前兆だ。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1300,attribute:"Earth",type:"Rock",wikiName:"《泥に潜み棲むもの》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C5%A5%A4%CB%C0%F8%A4%DF%C0%B3%A4%E0%A4%E2%A4%CE%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/岩石族/攻1200/守1300
足下がドロドロと溶けだしたら、こいつが現れる前兆だ。`,kind:"Monster"},鉄鋼装甲虫:{name:"鉄鋼装甲虫",nameKana:"",description:`全身が分厚い装甲で覆われている巨大な昆虫型生物。
行く手を妨げるものは容赦なく破壊する。`,cardType:"Monster",monsterCategories:["Normal"],level:8,attack:2800,defense:1500,attribute:"Earth",type:"Insect",wikiName:"《鉄鋼装甲虫》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C5%B4%B9%DD%C1%F5%B9%C3%C3%EE%A1%D5",wikiTextAll:`通常モンスター
星８/地属性/昆虫族/攻2800/守1500
全身が分厚い装甲で覆われている巨大な昆虫型生物。
行く手を妨げるものは容赦なく破壊する。`,kind:"Monster"},鉄腕ゴーレム:{name:"鉄腕ゴーレム",nameKana:"",description:`鋼鉄でできた機械人形。
恐るべき怪力を誇る。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:1900,defense:2200,attribute:"Earth",type:"Machine",wikiName:"《鉄腕ゴーレム》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C5%B4%CF%D3%A5%B4%A1%BC%A5%EC%A5%E0%A1%D5",wikiTextAll:`通常モンスター
星６/地属性/機械族/攻1900/守2200
鋼鉄でできた機械人形。
恐るべき怪力を誇る。`,kind:"Monster"},天空竜:{name:"天空竜",nameKana:"",description:"４枚の羽を持つ、鳥の姿をしたドラゴン。刃の羽で攻撃。",cardType:"Monster",monsterCategories:["Normal"],level:6,attack:1900,defense:1800,attribute:"Wind",type:"Dragon",wikiName:"《天空竜》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C5%B7%B6%F5%CE%B5%A1%D5",wikiTextAll:`通常モンスター
星６/風属性/ドラゴン族/攻1900/守1800
４枚の羽を持つ、鳥の姿をしたドラゴン。刃の羽で攻撃。`,kind:"Monster"},転職の魔鏡:{name:"転職の魔鏡",nameKana:"",description:`悪魔の鏡。
攻撃を受けても割れずに、ダメージを防いでくれる。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:1300,attribute:"Dark",type:"Fiend",wikiName:"《転職の魔鏡》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C5%BE%BF%A6%A4%CE%CB%E2%B6%C0%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/悪魔族/攻 800/守1300
悪魔の鏡。
攻撃を受けても割れずに、ダメージを防いでくれる。`,kind:"Monster"},伝説の決闘場:{name:"伝説の決闘場",nameKana:"",description:`どんな時でも組みあげたデッキを信じ、どんな時でも敵に背を向けず、
最後まであきらめずに闘う勇気ある者たちが集うとされる、
勝者と敗者を分かつ儀式が繰り広げられる戦いの場。
カードの心と絆で結束し、誇りと魂にかけて踏み出した時、
見果てぬ先まで続く未来のロードが切り拓かれるという。`,cardType:"Monster",monsterCategories:["Normal"],level:5,defense:3e3,attribute:"Earth",type:"Machine",wikiName:"《伝説の決闘場》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C5%C1%C0%E2%A4%CE%B7%E8%C6%AE%BE%EC%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/機械族/攻   0/守3000
どんな時でも組みあげたデッキを信じ、どんな時でも敵に背を向けず、
最後まであきらめずに闘う勇気ある者たちが集うとされる、
勝者と敗者を分かつ儀式が繰り広げられる戦いの場。
カードの心と絆で結束し、誇りと魂にかけて踏み出した時、
見果てぬ先まで続く未来のロードが切り拓かれるという。`,kind:"Monster",attack:0},"伝説の剣豪 ＭＡＳＡＫＩ":{name:"伝説の剣豪 ＭＡＳＡＫＩ",nameKana:"",description:"百人斬りを成しとげたといわれる、伝説の剣豪。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1100,defense:1100,attribute:"Earth",type:"Warrior",wikiName:"《伝説の剣豪 ＭＡＳＡＫＩ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C5%C1%C0%E2%A4%CE%B7%F5%B9%EB%20%A3%CD%A3%C1%A3%D3%A3%C1%A3%CB%A3%C9%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/戦士族/攻1100/守1100
百人斬りを成しとげたといわれる、伝説の剣豪。`,kind:"Monster"},怒りの海王:{name:"怒りの海王",nameKana:"",description:"偉大な海の王。終わることのない大津波を呼び、敵をのみこむ。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:700,attribute:"Water",type:"Aqua",wikiName:"《怒りの海王》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C5%DC%A4%EA%A4%CE%B3%A4%B2%A6%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻 800/守 700
偉大な海の王。終わることのない大津波を呼び、敵をのみこむ。`,kind:"Monster"},島亀:{name:"島亀",nameKana:"",description:`小島ほどの大きさがある巨大ガメ。
海中に潜ることはなく、甲羅の上には木や生物が住みついている。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1100,defense:2e3,attribute:"Water",type:"Aqua",wikiName:"《島亀》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C5%E7%B5%B5%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1100/守2000
小島ほどの大きさがある巨大ガメ。
海中に潜ることはなく、甲羅の上には木や生物が住みついている。`,kind:"Monster"},東方の英雄:{name:"東方の英雄",nameKana:"",description:`遥か東の国から来たと言われているサムライ。
手にするカタナは良く切れる。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1100,defense:1e3,attribute:"Earth",type:"Warrior",wikiName:"《東方の英雄》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C5%EC%CA%FD%A4%CE%B1%D1%CD%BA%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/戦士族/攻1100/守1000
遥か東の国から来たと言われているサムライ。
手にするカタナは良く切れる。`,kind:"Monster"},逃げまどう民:{name:"逃げまどう民",nameKana:"",description:"いつも苦しみに耐えているが、いつか必ず革命を起こすと心に誓っている。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:600,defense:600,attribute:"Fire",type:"Pyro",wikiName:"《逃げまどう民》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C6%A8%A4%B2%A4%DE%A4%C9%A4%A6%CC%B1%A1%D5",wikiTextAll:`通常モンスター
星２/炎属性/炎族/攻 600/守 600
いつも苦しみに耐えているが、いつか必ず革命を起こすと心に誓っている。`,kind:"Monster"},洞窟に潜む竜:{name:"洞窟に潜む竜",nameKana:"",description:`洞窟に潜む巨大なドラゴン。
普段はおとなしいが、怒ると恐ろしい。
財宝を守っていると伝えられている。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:2e3,attribute:"Wind",type:"Dragon",wikiName:"《洞窟に潜む竜》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C6%B6%B7%A2%A4%CB%C0%F8%A4%E0%CE%B5%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/ドラゴン族/攻1300/守2000
洞窟に潜む巨大なドラゴン。
普段はおとなしいが、怒ると恐ろしい。
財宝を守っていると伝えられている。`,kind:"Monster"},銅鑼ドラゴン:{name:"銅鑼ドラゴン",nameKana:"",description:`最新鋭の技術を駆使し、飛行が可能になった戦闘用の銅鑼。
マッハ０.７で天空を翔るその存在に驚愕せざるを得ない。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:4,attack:500,defense:2100,attribute:"Earth",type:"Machine",pendulumScaleR:7,pendulumScaleL:7,wikiName:"《銅鑼ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C6%BC%EF%D5%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星４/地属性/機械族/攻 500/守2100
【Ｐスケール：青７/赤７】
【モンスター情報】
最新鋭の技術を駆使し、飛行が可能になった戦闘用の銅鑼。
マッハ０.７で天空を翔るその存在に驚愕せざるを得ない。`,kind:"Monster",pendulumDescription:""},二つの口を持つ闇の支配者:{name:"二つの口を持つ闇の支配者",nameKana:"",description:`口が二つある恐竜。
ツノに蓄電し、背中の口から放電する。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:700,attribute:"Earth",type:"Dinosaur",wikiName:"《二つの口を持つ闇の支配者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C6%F3%A4%C4%A4%CE%B8%FD%A4%F2%BB%FD%A4%C4%B0%C7%A4%CE%BB%D9%C7%DB%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/恐竜族/攻 900/守 700
口が二つある恐竜。
ツノに蓄電し、背中の口から放電する。`,kind:"Monster"},"二頭を持つキング・レックス":{name:"二頭を持つキング・レックス",nameKana:"",description:"恐竜族の中では強力なカード。２つの頭で同時攻撃。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1200,attribute:"Earth",type:"Dinosaur",wikiName:"《二頭を持つキング・レックス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C6%F3%C6%AC%A4%F2%BB%FD%A4%C4%A5%AD%A5%F3%A5%B0%A1%A6%A5%EC%A5%C3%A5%AF%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/恐竜族/攻1600/守1200
恐竜族の中では強力なカード。２つの頭で同時攻撃。`,kind:"Monster"},忍犬ワンダードッグ:{name:"忍犬ワンダードッグ",nameKana:"",description:"忍術を極めた犬忍者。厳しい修行により、擬人化の忍術を使う事が可能となった。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,defense:1e3,attribute:"Wind",type:"BeastWarrior",wikiName:"《忍犬ワンダードッグ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C7%A6%B8%A4%A5%EF%A5%F3%A5%C0%A1%BC%A5%C9%A5%C3%A5%B0%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/獣戦士族/攻1800/守1000
忍術を極めた犬忍者。厳しい修行により、擬人化の忍術を使う事が可能となった。`,kind:"Monster"},破壊のゴーレム:{name:"破壊のゴーレム",nameKana:"",description:`大きな右手が特徴のゴーレム。
右手で押しつぶして攻撃する。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1e3,attribute:"Earth",type:"Rock",wikiName:"《破壊のゴーレム》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C7%CB%B2%F5%A4%CE%A5%B4%A1%BC%A5%EC%A5%E0%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/岩石族/攻1500/守1000
大きな右手が特徴のゴーレム。
右手で押しつぶして攻撃する。`,kind:"Monster"},"半魚獣・フィッシャービースト":{name:"半魚獣・フィッシャービースト",nameKana:"",description:"陸では獣のように、海では魚のように素早く攻撃する。",cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2400,defense:2e3,attribute:"Water",type:"Fish",wikiName:"《半魚獣・フィッシャービースト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C8%BE%B5%FB%BD%C3%A1%A6%A5%D5%A5%A3%A5%C3%A5%B7%A5%E3%A1%BC%A5%D3%A1%BC%A5%B9%A5%C8%A1%D5",wikiTextAll:`通常モンスター
星６/水属性/魚族/攻2400/守2000
陸では獣のように、海では魚のように素早く攻撃する。`,kind:"Monster"},美しき魔物使い:{name:"美しき魔物使い",nameKana:"",description:"珍しい女性の魔物使い。ムチを手にすると、性格が変わる。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1750,defense:1500,attribute:"Earth",type:"Warrior",wikiName:"《美しき魔物使い》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C8%FE%A4%B7%A4%AD%CB%E2%CA%AA%BB%C8%A4%A4%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/戦士族/攻1750/守1500
珍しい女性の魔物使い。ムチを手にすると、性格が変わる。`,kind:"Monster"},氷:{name:"氷",nameKana:"",description:`全身が氷でできている戦士。
触れるものを何でも凍らせてしまう。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:1200,attribute:"Water",type:"Warrior",wikiName:"《氷》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C9%B9%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/戦士族/攻 800/守1200
全身が氷でできている戦士。
触れるものを何でも凍らせてしまう。`,kind:"Monster"},氷水:{name:"氷水",nameKana:"",description:`攻撃的なマーメイド。
体に生えているトゲを使って攻撃する。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1150,defense:900,attribute:"Water",type:"Aqua",wikiName:"《氷水》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C9%B9%BF%E5%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻1150/守 900
攻撃的なマーメイド。
体に生えているトゲを使って攻撃する。`,kind:"Monster"},"武神－ヒルコ":{name:"武神－ヒルコ",nameKana:"",description:`遥か太古の昔に主神の座をかけて「武神－ヒルメ」と戦い、
死闘の末に封印されてしまった悪神。
自らの封印を解くために「ヒルメ」を操り、
禍々しき「アマテラス」を生み出して世界に闇を齎したが、
その野望は「ヤマト」たち若き武神の活躍によって潰えた。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:4,attack:1e3,defense:2e3,attribute:"Light",type:"BeastWarrior",pendulumScaleR:3,pendulumScaleL:3,wikiName:"《武神－ヒルコ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C9%F0%BF%C0%A1%DD%A5%D2%A5%EB%A5%B3%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星４/光属性/獣戦士族/攻1000/守2000
【Ｐスケール：青３/赤３】
(1)：自分のＰゾーンのこのカードを除外し、
自分フィールドの「武神」Ｘモンスター１体を対象として発動できる。
その自分のモンスターとカード名が異なる「武神」Ｘモンスター１体を、
対象のモンスターの上に重ねてＸ召喚扱いとしてエクストラデッキから特殊召喚する。
【モンスター情報】
遥か太古の昔に主神の座をかけて「武神－ヒルメ」と戦い、
死闘の末に封印されてしまった悪神。
自らの封印を解くために「ヒルメ」を操り、
禍々しき「アマテラス」を生み出して世界に闇を齎したが、
その野望は「ヤマト」たち若き武神の活躍によって潰えた。`,kind:"Monster",pendulumDescription:`(1)：自分のＰゾーンのこのカードを除外し、
自分フィールドの「武神」Ｘモンスター１体を対象として発動できる。
その自分のモンスターとカード名が異なる「武神」Ｘモンスター１体を、
対象のモンスターの上に重ねてＸ召喚扱いとしてエクストラデッキから特殊召喚する。`},封印されし者の右足:{name:"封印されし者の右足",nameKana:"",description:"封印された右足。封印を解くと、無限の力を得られる。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:200,defense:300,attribute:"Dark",type:"Spellcaster",wikiName:"《封印されし者の右足》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C9%F5%B0%F5%A4%B5%A4%EC%A4%B7%BC%D4%A4%CE%B1%A6%C2%AD%A1%D5",wikiTextAll:`通常モンスター
星１/闇属性/魔法使い族/攻 200/守 300
封印された右足。封印を解くと、無限の力を得られる。`,kind:"Monster"},封印されし者の右腕:{name:"封印されし者の右腕",nameKana:"",description:"封印された右腕。封印を解くと、無限の力を得られる。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:200,defense:300,attribute:"Dark",type:"Spellcaster",wikiName:"《封印されし者の右腕》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C9%F5%B0%F5%A4%B5%A4%EC%A4%B7%BC%D4%A4%CE%B1%A6%CF%D3%A1%D5",wikiTextAll:`通常モンスター
星１/闇属性/魔法使い族/攻 200/守 300
封印された右腕。封印を解くと、無限の力を得られる。`,kind:"Monster"},封印されし者の左足:{name:"封印されし者の左足",nameKana:"",description:"封印された左足。封印を解くと、無限の力を得られる。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:200,defense:300,attribute:"Dark",type:"Spellcaster",wikiName:"《封印されし者の左足》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C9%F5%B0%F5%A4%B5%A4%EC%A4%B7%BC%D4%A4%CE%BA%B8%C2%AD%A1%D5",wikiTextAll:`通常モンスター
星１/闇属性/魔法使い族/攻 200/守 300
封印された左足。封印を解くと、無限の力を得られる。`,kind:"Monster"},封印されし者の左腕:{name:"封印されし者の左腕",nameKana:"",description:"封印された左腕。封印を解くと、無限の力を得られる。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:200,defense:300,attribute:"Dark",type:"Spellcaster",wikiName:"《封印されし者の左腕》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C9%F5%B0%F5%A4%B5%A4%EC%A4%B7%BC%D4%A4%CE%BA%B8%CF%D3%A1%D5",wikiTextAll:`通常モンスター
星１/闇属性/魔法使い族/攻 200/守 300
封印された左腕。封印を解くと、無限の力を得られる。`,kind:"Monster"},封印の鎖:{name:"封印の鎖",nameKana:"",description:"相手をギリギリと締め上げて、封印を施す力を持つ。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:1100,attribute:"Light",type:"Fairy",wikiName:"《封印の鎖》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C9%F5%B0%F5%A4%CE%BA%BF%A1%D5",wikiTextAll:`通常モンスター
星３/光属性/天使族/攻1000/守1100
相手をギリギリと締め上げて、封印を施す力を持つ。`,kind:"Monster"},"封印師 メイセイ":{name:"封印師 メイセイ",nameKana:"",description:`封印の呪符を使いこなす事ができる数少ない人物。
その経歴は未だ謎に包まれている。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1100,defense:900,attribute:"Dark",type:"Spellcaster",wikiName:"《封印師 メイセイ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C9%F5%B0%F5%BB%D5%20%A5%E1%A5%A4%A5%BB%A5%A4%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/魔法使い族/攻1100/守 900
封印の呪符を使いこなす事ができる数少ない人物。
その経歴は未だ謎に包まれている。`,kind:"Monster"},風の精霊:{name:"風の精霊",nameKana:"",description:"気ままに飛び回る風の精霊。機嫌が悪いと嵐になる。",cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1700,defense:1400,attribute:"Wind",type:"Spellcaster",wikiName:"《風の精霊》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C9%F7%A4%CE%C0%BA%CE%EE%A1%D5",wikiTextAll:`通常モンスター
星５/風属性/魔法使い族/攻1700/守1400
気ままに飛び回る風の精霊。機嫌が悪いと嵐になる。`,kind:"Monster"},"風の番人 ジン":{name:"風の番人 ジン",nameKana:"",description:"風をあやつり、竜巻や突風を起こし周囲のものを吹き飛ばす。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:700,defense:900,attribute:"Wind",type:"Spellcaster",wikiName:"《風の番人 ジン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C9%F7%A4%CE%C8%D6%BF%CD%20%A5%B8%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星３/風属性/魔法使い族/攻 700/守 900
風をあやつり、竜巻や突風を起こし周囲のものを吹き飛ばす。`,kind:"Monster"},復讐のカッパ:{name:"復讐のカッパ",nameKana:"",description:"仲間を殺され、復讐のために心を悪に売ってしまったカッパ。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:900,attribute:"Water",type:"Aqua",wikiName:"《復讐のカッパ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C9%FC%BD%B2%A4%CE%A5%AB%A5%C3%A5%D1%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/水族/攻1200/守 900
仲間を殺され、復讐のために心を悪に売ってしまったカッパ。`,kind:"Monster"},"復讐のソード・ストーカー":{name:"復讐のソード・ストーカー",nameKana:"",description:"やられていった味方の怨念が宿っているモンスター。",cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2e3,defense:1600,attribute:"Dark",type:"Warrior",wikiName:"《復讐のソード・ストーカー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C9%FC%BD%B2%A4%CE%A5%BD%A1%BC%A5%C9%A1%A6%A5%B9%A5%C8%A1%BC%A5%AB%A1%BC%A1%D5",wikiTextAll:`通常モンスター
星６/闇属性/戦士族/攻2000/守1600
やられていった味方の怨念が宿っているモンスター。`,kind:"Monster"},物陰の協力者:{name:"物陰の協力者",nameKana:"",description:"物陰からこっそりと協力してくれる、かわいらしい小人。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:1e3,attribute:"Earth",type:"Warrior",wikiName:"《物陰の協力者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CA%AA%B1%A2%A4%CE%B6%A8%CE%CF%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/戦士族/攻1000/守1000
物陰からこっそりと協力してくれる、かわいらしい小人。`,kind:"Monster"},"包焼蒸騎－ＢＵＬＬａｕｎｃｈｅｒ":{name:"包焼蒸騎－ＢＵＬＬａｕｎｃｈｅｒ",nameKana:"",description:`「ＢＵＬＬａｕｎｃｈｅｒ」は「Ｃｏｃ－ＯＳ」及び「ＢＦＳ装甲」が日々改良される中、
「マデラ」の命を受けて試行錯誤の末に開発された３機の「Ｆｏｉｌ－Ｐａｃｋｅｒ」の内、
砲撃＆白昼戦闘に特化した支援機である。
「Ｂｅｅｆ－Ｒｉｆｌｅ」等の武装に換装する事で「包焼蒸騎」は中・遠距離への対応が可能となる。
また「ＢＵＬＬａｕｎｃｈｅｒ」は、高速＆空中戦闘に特化した「ＷＩＮＧｅａｒ」及び、
近接＆強襲戦闘に特化した「ＢＯＡＲｍｓ」と”熟成合体”する事で、
熱量の高い「包焼獣神－ＢＷ」が降臨する。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1800,defense:200,attribute:"Fire",type:"BeastWarrior",wikiName:"《包焼蒸騎－ＢＵＬＬａｕｎｃｈｅｒ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CA%F1%BE%C6%BE%F8%B5%B3%A1%DD%A3%C2%A3%D5%A3%CC%A3%CC%A3%E1%A3%F5%A3%EE%A3%E3%A3%E8%A3%E5%A3%F2%A1%D5",wikiTextAll:`通常モンスター
星４/炎属性/獣戦士族/攻1800/守 200
「ＢＵＬＬａｕｎｃｈｅｒ」は「Ｃｏｃ－ＯＳ」及び「ＢＦＳ装甲」が日々改良される中、
「マデラ」の命を受けて試行錯誤の末に開発された３機の「Ｆｏｉｌ－Ｐａｃｋｅｒ」の内、
砲撃＆白昼戦闘に特化した支援機である。
「Ｂｅｅｆ－Ｒｉｆｌｅ」等の武装に換装する事で「包焼蒸騎」は中・遠距離への対応が可能となる。
また「ＢＵＬＬａｕｎｃｈｅｒ」は、高速＆空中戦闘に特化した「ＷＩＮＧｅａｒ」及び、
近接＆強襲戦闘に特化した「ＢＯＡＲｍｓ」と”熟成合体”する事で、
熱量の高い「包焼獣神－ＢＷ」が降臨する。`,kind:"Monster"},"包焼蒸騎－ハンバルク":{name:"包焼蒸騎－ハンバルク",nameKana:"",description:`ファクトリーにてじっくりと錬成された濃鋼鉄の「ＢＦＳ装甲」及び、
高解析力の「Ｃｏｃ－ＯＳ」と連動する事で戦況に応じ様々な武装に換装できる特殊機構
「Ｆｏｉｌ－Ｐａｃｋｅｒ」を装備した騎士団の１人。
「ハンバルク」は武装こそスタンダードではあるが、
高い熱量を有した戦闘スタイルは本格派で、人々からの人気が非常に高い。
女神「マデラ」の加護を受ける事で、その力はさらに拡張される。`,cardType:"Monster",monsterCategories:["Normal"],level:8,attack:2500,defense:200,attribute:"Fire",type:"Warrior",wikiName:"《包焼蒸騎－ハンバルク》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CA%F1%BE%C6%BE%F8%B5%B3%A1%DD%A5%CF%A5%F3%A5%D0%A5%EB%A5%AF%A1%D5",wikiTextAll:`通常モンスター
星８/炎属性/戦士族/攻2500/守 200
ファクトリーにてじっくりと錬成された濃鋼鉄の「ＢＦＳ装甲」及び、
高解析力の「Ｃｏｃ－ＯＳ」と連動する事で戦況に応じ様々な武装に換装できる特殊機構
「Ｆｏｉｌ－Ｐａｃｋｅｒ」を装備した騎士団の１人。
「ハンバルク」は武装こそスタンダードではあるが、
高い熱量を有した戦闘スタイルは本格派で、人々からの人気が非常に高い。
女神「マデラ」の加護を受ける事で、その力はさらに拡張される。`,kind:"Monster"},北風と太陽:{name:"北風と太陽",nameKana:"",description:`仲の良い北風と太陽。
かまいたちと熱光線で攻撃。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:1e3,attribute:"Light",type:"Fairy",wikiName:"《北風と太陽》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%CC%C9%F7%A4%C8%C2%C0%CD%DB%A1%D5",wikiTextAll:`通常モンスター
星３/光属性/天使族/攻1000/守1000
仲の良い北風と太陽。
かまいたちと熱光線で攻撃。`,kind:"Monster"},"本の精霊 ホーク・ビショップ":{name:"本の精霊 ホーク・ビショップ",nameKana:"",description:"本の精霊。とても高い知恵を持ち、多彩な攻撃をしかけてくる。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1200,attribute:"Wind",type:"WingedBeast",wikiName:"《本の精霊 ホーク・ビショップ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%DC%A4%CE%C0%BA%CE%EE%20%A5%DB%A1%BC%A5%AF%A1%A6%A5%D3%A5%B7%A5%E7%A5%C3%A5%D7%A1%D5",wikiTextAll:`通常モンスター
星４/風属性/鳥獣族/攻1400/守1200
本の精霊。とても高い知恵を持ち、多彩な攻撃をしかけてくる。`,kind:"Monster"},"魔貨物車両 ボコイチ":{name:"魔貨物車両 ボコイチ",nameKana:"",description:`デコイチ専用の貨物車両。
どんな物でも運ぶ事ができるが、大抵は到着時に壊れている。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:500,defense:500,attribute:"Dark",type:"Machine",wikiName:"《魔貨物車両 ボコイチ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%E2%B2%DF%CA%AA%BC%D6%CE%BE%20%A5%DC%A5%B3%A5%A4%A5%C1%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/機械族/攻 500/守 500
デコイチ専用の貨物車両。
どんな物でも運ぶ事ができるが、大抵は到着時に壊れている。`,kind:"Monster"},魔界のイバラ:{name:"魔界のイバラ",nameKana:"",description:`魔界に生息するイバラ。
無理に通ろうとする者にからみつく。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:900,attribute:"Earth",type:"Plant",wikiName:"《魔界のイバラ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%E2%B3%A6%A4%CE%A5%A4%A5%D0%A5%E9%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/植物族/攻1200/守 900
魔界に生息するイバラ。
無理に通ろうとする者にからみつく。`,kind:"Monster"},魔界の機械兵:{name:"魔界の機械兵",nameKana:"",description:"闇の力でつくられた機械兵。狂ったように敵を破壊する。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1200,attribute:"Dark",type:"Machine",wikiName:"《魔界の機械兵》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%E2%B3%A6%A4%CE%B5%A1%B3%A3%CA%BC%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/機械族/攻1400/守1200
闇の力でつくられた機械兵。狂ったように敵を破壊する。`,kind:"Monster"},魔界植物:{name:"魔界植物",nameKana:"",description:"表面から強力な酸を出して、近づく者を溶かしてしまう。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:400,defense:300,attribute:"Dark",type:"Fiend",wikiName:"《魔界植物》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%E2%B3%A6%BF%A2%CA%AA%A1%D5",wikiTextAll:`通常モンスター
星１/闇属性/悪魔族/攻 400/守 300
表面から強力な酸を出して、近づく者を溶かしてしまう。`,kind:"Monster"},"魔鍵銃士－クラヴィス":{name:"魔鍵銃士－クラヴィス",nameKana:"",description:`人は誰しも可能性に満ち満ちる。
行くも止まるも、施めるも解くも己次第。
めくるめく世界に扉は数多。
それを解くは魔法の鍵。
２つの鍵で１つの扉。
２つの意思で１つの姿。
扉を解けば世界が繋がり、巨大な力が顔を出す。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1900,defense:1900,attribute:"Dark",type:"Warrior",wikiName:"《魔鍵銃士－クラヴィス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%E2%B8%B0%BD%C6%BB%CE%A1%DD%A5%AF%A5%E9%A5%F4%A5%A3%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/戦士族/攻1900/守1900
人は誰しも可能性に満ち満ちる。
行くも止まるも、施めるも解くも己次第。
めくるめく世界に扉は数多。
それを解くは魔法の鍵。
２つの鍵で１つの扉。
２つの意思で１つの姿。
扉を解けば世界が繋がり、巨大な力が顔を出す。`,kind:"Monster"},"魔人 テラ":{name:"魔人 テラ",nameKana:"",description:`沼地に住む悪魔の手先。
見た目ほど強くないが油断は禁物。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1300,attribute:"Dark",type:"Fiend",wikiName:"《魔人 テラ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%E2%BF%CD%20%A5%C6%A5%E9%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1200/守1300
沼地に住む悪魔の手先。
見た目ほど強くないが油断は禁物。`,kind:"Monster"},魔人デスサタン:{name:"魔人デスサタン",nameKana:"",description:"闇にとけ込む黒のタキシードに身をつつんだ、死を司る悪魔。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1300,attribute:"Dark",type:"Fiend",wikiName:"《魔人デスサタン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%E2%BF%CD%A5%C7%A5%B9%A5%B5%A5%BF%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1400/守1300
闇にとけ込む黒のタキシードに身をつつんだ、死を司る悪魔。`,kind:"Monster"},魔人銃:{name:"魔人銃",nameKana:"",description:"口から弾を発射して攻撃する生物兵器。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:600,defense:800,attribute:"Dark",type:"Fiend",wikiName:"《魔人銃》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%E2%BF%CD%BD%C6%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/悪魔族/攻 600/守 800
口から弾を発射して攻撃する生物兵器。`,kind:"Monster"},魔天老:{name:"魔天老",nameKana:"",description:`天界から追放された堕天使。
闇での闘いに優れている。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:700,attribute:"Dark",type:"Fiend",wikiName:"《魔天老》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%E2%C5%B7%CF%B7%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/悪魔族/攻1000/守 700
天界から追放された堕天使。
闇での闘いに優れている。`,kind:"Monster"},魔頭を持つ邪竜:{name:"魔頭を持つ邪竜",nameKana:"",description:`もう一つの頭を持つドラゴン。
二つの口で敵を噛み砕く。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:900,attribute:"Wind",type:"Dragon",wikiName:"《魔頭を持つ邪竜》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%E2%C6%AC%A4%F2%BB%FD%A4%C4%BC%D9%CE%B5%A1%D5",wikiTextAll:`通常モンスター
星３/風属性/ドラゴン族/攻 900/守 900
もう一つの頭を持つドラゴン。
二つの口で敵を噛み砕く。`,kind:"Monster"},"魔導紳士－Ｊ":{name:"魔導紳士－Ｊ",nameKana:"",description:`奇抜な変装に身を包んで、気まぐれに悪事を働いたり人助けをしたりする。
「美」にはうるさい。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1600,attribute:"Dark",type:"Spellcaster",wikiName:"《魔導紳士－Ｊ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%E2%C6%B3%BF%C2%BB%CE%A1%DD%A3%CA%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/魔法使い族/攻1500/守1600
奇抜な変装に身を包んで、気まぐれに悪事を働いたり人助けをしたりする。
「美」にはうるさい。`,kind:"Monster"},魔物の狩人:{name:"魔物の狩人",nameKana:"",description:`人を狩る凶悪な狩人。
岩をも砕く強い力を持つ。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1200,attribute:"Earth",type:"Warrior",wikiName:"《魔物の狩人》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%E2%CA%AA%A4%CE%BC%ED%BF%CD%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/戦士族/攻1500/守1200
人を狩る凶悪な狩人。
岩をも砕く強い力を持つ。`,kind:"Monster"},魔法剣士トランス:{name:"魔法剣士トランス",nameKana:"",description:`かなりの実力を持った風変わりな魔法使い。
異空間の旅から帰還したらしい。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2600,defense:200,attribute:"Earth",type:"Spellcaster",wikiName:"《魔法剣士トランス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%E2%CB%A1%B7%F5%BB%CE%A5%C8%A5%E9%A5%F3%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星６/地属性/魔法使い族/攻2600/守 200
かなりの実力を持った風変わりな魔法使い。
異空間の旅から帰還したらしい。`,kind:"Monster"},魔法剣士ネオ:{name:"魔法剣士ネオ",nameKana:"",description:`武術と剣に優れた風変わりな魔法使い。
異空間を旅している。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1700,defense:1e3,attribute:"Light",type:"Spellcaster",wikiName:"《魔法剣士ネオ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%E2%CB%A1%B7%F5%BB%CE%A5%CD%A5%AA%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/魔法使い族/攻1700/守1000
武術と剣に優れた風変わりな魔法使い。
異空間を旅している。`,kind:"Monster"},満ち潮のマーマン:{name:"満ち潮のマーマン",nameKana:"",description:"水の中を自在に泳ぐ、半魚人の戦士。攻撃は強い。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1650,defense:1300,attribute:"Water",type:"Aqua",wikiName:"《満ち潮のマーマン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%FE%A4%C1%C4%AC%A4%CE%A5%DE%A1%BC%A5%DE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/水属性/水族/攻1650/守1300
水の中を自在に泳ぐ、半魚人の戦士。攻撃は強い。`,kind:"Monster"},未熟な悪魔:{name:"未熟な悪魔",nameKana:"",description:`完全体になれなかった醜い悪魔。
はらの穴は何でも吸い込む。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:500,defense:750,attribute:"Dark",type:"Fiend",wikiName:"《未熟な悪魔》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CC%A4%BD%CF%A4%CA%B0%AD%CB%E2%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/悪魔族/攻 500/守 750
完全体になれなかった醜い悪魔。
はらの穴は何でも吸い込む。`,kind:"Monster"},魅惑の怪盗:{name:"魅惑の怪盗",nameKana:"",description:`黒いマントをはおるキザな怪盗。
杖を振って、相手を魅了する。`,cardType:"Monster",monsterCategories:["Normal"],level:2,attack:700,defense:700,attribute:"Dark",type:"Spellcaster",wikiName:"《魅惑の怪盗》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CC%A5%CF%C7%A4%CE%B2%F8%C5%F0%A1%D5",wikiTextAll:`通常モンスター
星２/闇属性/魔法使い族/攻 700/守 700
黒いマントをはおるキザな怪盗。
杖を振って、相手を魅了する。`,kind:"Monster"},密林の黒竜王:{name:"密林の黒竜王",nameKana:"",description:`密林に生息する、漆黒のドラゴン。
バリバリと木を食べる。`,cardType:"Monster",monsterCategories:["Normal"],level:6,attack:2100,defense:1800,attribute:"Earth",type:"Dragon",wikiName:"《密林の黒竜王》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CC%A9%CE%D3%A4%CE%B9%F5%CE%B5%B2%A6%A1%D5",wikiTextAll:`通常モンスター
星６/地属性/ドラゴン族/攻2100/守1800
密林に生息する、漆黒のドラゴン。
バリバリと木を食べる。`,kind:"Monster"},眠り子:{name:"眠り子",nameKana:"",description:"子供だが睡魔をあやつり二度と覚めることのない眠りを誘う。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:800,defense:700,attribute:"Dark",type:"Spellcaster",wikiName:"《眠り子》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CC%B2%A4%EA%BB%D2%A1%D5",wikiTextAll:`通常モンスター
星３/闇属性/魔法使い族/攻 800/守 700
子供だが睡魔をあやつり二度と覚めることのない眠りを誘う。`,kind:"Monster"},眠れる獅子:{name:"眠れる獅子",nameKana:"",description:`普段眠っている猛獣。
目をさますと手がつけられない。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:700,defense:1700,attribute:"Earth",type:"Beast",wikiName:"《眠れる獅子》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CC%B2%A4%EC%A4%EB%BB%E2%BB%D2%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/獣族/攻 700/守1700
普段眠っている猛獣。
目をさますと手がつけられない。`,kind:"Monster"},夢魔の亡霊:{name:"夢魔の亡霊",nameKana:"",description:`寝ている者の夢に取り憑き、生気を吸い取る悪魔。
取り憑かれてしまった者は、決して自力で目覚めることはない。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1300,defense:1800,attribute:"Dark",type:"Fiend",wikiName:"《夢魔の亡霊》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CC%B4%CB%E2%A4%CE%CB%B4%CE%EE%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1300/守1800
寝ている者の夢に取り憑き、生気を吸い取る悪魔。
取り憑かれてしまった者は、決して自力で目覚めることはない。`,kind:"Monster"},冥界の番人:{name:"冥界の番人",nameKana:"",description:"冥界への入り口を守る戦士。許可のない者は容赦なく斬る。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1e3,defense:1200,attribute:"Earth",type:"Warrior",wikiName:"《冥界の番人》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CC%BD%B3%A6%A4%CE%C8%D6%BF%CD%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/戦士族/攻1000/守1200
冥界への入り口を守る戦士。許可のない者は容赦なく斬る。`,kind:"Monster"},命ある花瓶:{name:"命ある花瓶",nameKana:"",description:"生けてある花から、花粉を飛ばし噛みついてくる生きている花瓶。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:900,defense:1100,attribute:"Earth",type:"Plant",wikiName:"《命ある花瓶》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CC%BF%A4%A2%A4%EB%B2%D6%C9%D3%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/植物族/攻 900/守1100
生けてある花から、花粉を飛ばし噛みついてくる生きている花瓶。`,kind:"Monster"},命の砂時計:{name:"命の砂時計",nameKana:"",description:"命を司る天使。命を短くするかわりに力を与える。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:700,defense:600,attribute:"Light",type:"Fairy",wikiName:"《命の砂時計》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CC%BF%A4%CE%BA%BD%BB%FE%B7%D7%A1%D5",wikiTextAll:`通常モンスター
星２/光属性/天使族/攻 700/守 600
命を司る天使。命を短くするかわりに力を与える。`,kind:"Monster"},命を食する者:{name:"命を食する者",nameKana:"",description:"あらゆる生き物の魂を喰い、己のエネルギーとする悪魔。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1e3,attribute:"Dark",type:"Fiend",wikiName:"《命を食する者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CC%BF%A4%F2%BF%A9%A4%B9%A4%EB%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻1200/守1000
あらゆる生き物の魂を喰い、己のエネルギーとする悪魔。`,kind:"Monster"},"迷宮壁－ラビリンス・ウォール－":{name:"迷宮壁－ラビリンス・ウォール－",nameKana:"",description:"フィールドに壁を出現させ、出口のない迷宮をつくる。",cardType:"Monster",monsterCategories:["Normal"],level:5,defense:3e3,attribute:"Earth",type:"Rock",wikiName:"《迷宮壁－ラビリンス・ウォール－》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CC%C2%B5%DC%CA%C9%A1%DD%A5%E9%A5%D3%A5%EA%A5%F3%A5%B9%A1%A6%A5%A6%A5%A9%A1%BC%A5%EB%A1%DD%A1%D5",wikiTextAll:`通常モンスター
星５/地属性/岩石族/攻   0/守3000
フィールドに壁を出現させ、出口のない迷宮をつくる。`,kind:"Monster",attack:0},妖精の贈りもの:{name:"妖精の贈りもの",nameKana:"",description:"誰もが幸せになれるという魔法をふりまきながら飛びまわる。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1400,defense:1e3,attribute:"Light",type:"Spellcaster",wikiName:"《妖精の贈りもの》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CD%C5%C0%BA%A4%CE%C2%A3%A4%EA%A4%E2%A4%CE%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/魔法使い族/攻1400/守1000
誰もが幸せになれるという魔法をふりまきながら飛びまわる。`,kind:"Monster"},溶岩大巨人:{name:"溶岩大巨人",nameKana:"",description:`マグマの大地から生まれた巨人。
マグマパンチで攻撃をする。`,cardType:"Monster",monsterCategories:["Normal"],level:5,attack:1e3,defense:2200,attribute:"Fire",type:"Pyro",wikiName:"《溶岩大巨人》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CD%CF%B4%E4%C2%E7%B5%F0%BF%CD%A1%D5",wikiTextAll:`通常モンスター
星５/炎属性/炎族/攻1000/守2200
マグマの大地から生まれた巨人。
マグマパンチで攻撃をする。`,kind:"Monster"},翼を織りなす者:{name:"翼を織りなす者",nameKana:"",description:"６枚の翼をもつハイエンジェル。人々の自由と希望を司っている。",cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2750,defense:2400,attribute:"Light",type:"Fairy",wikiName:"《翼を織りなす者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CD%E3%A4%F2%BF%A5%A4%EA%A4%CA%A4%B9%BC%D4%A1%D5",wikiTextAll:`通常モンスター
星７/光属性/天使族/攻2750/守2400
６枚の翼をもつハイエンジェル。人々の自由と希望を司っている。`,kind:"Monster"},雷ウナギ:{name:"雷ウナギ",nameKana:"",description:"電気ウナギが進化すると雷ウナギになると言い伝えられている。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:350,defense:750,attribute:"Water",type:"Thunder",wikiName:"《雷ウナギ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CD%EB%A5%A6%A5%CA%A5%AE%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/雷族/攻 350/守 750
電気ウナギが進化すると雷ウナギになると言い伝えられている。`,kind:"Monster"},"陸戦型 バグロス":{name:"陸戦型 バグロス",nameKana:"",description:"陸上戦闘ロボット。今はダメだが、海でも使えたらしい。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1500,defense:1e3,attribute:"Earth",type:"Machine",wikiName:"《陸戦型 バグロス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CE%A6%C0%EF%B7%BF%20%A5%D0%A5%B0%A5%ED%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星４/地属性/機械族/攻1500/守1000
陸上戦闘ロボット。今はダメだが、海でも使えたらしい。`,kind:"Monster"},竜核の呪霊者:{name:"竜核の呪霊者",nameKana:"",description:`永きに渡って狩り続けたドラゴンの返り血により、常人ならざる力を宿した女戦士。
その魂は斃されたドラゴンの怨嗟に染まり、疫病を撒き散らす邪悪な竜核へと成り果てた。
もはや帰る故郷もなく、本能のままに刃を血に染めたその目的は、彼女自身にも思い出せない・・・。`,cardType:"Monster",monsterCategories:["Normal","Tuner"],level:8,attack:2300,defense:3e3,attribute:"Dark",type:"Dragon",wikiName:"《竜核の呪霊者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CE%B5%B3%CB%A4%CE%BC%F6%CE%EE%BC%D4%A1%D5",wikiTextAll:`チューナー・通常モンスター
星８/闇属性/ドラゴン族/攻2300/守3000
永きに渡って狩り続けたドラゴンの返り血により、常人ならざる力を宿した女戦士。
その魂は斃されたドラゴンの怨嗟に染まり、疫病を撒き散らす邪悪な竜核へと成り果てた。
もはや帰る故郷もなく、本能のままに刃を血に染めたその目的は、彼女自身にも思い出せない・・・。`,kind:"Monster"},竜角の狩猟者:{name:"竜角の狩猟者",nameKana:"",description:`疫病に苦しむ故郷の村を救うため、霊薬の原料となるドラゴンの角を乱獲する女戦士。
その村はすでに、棲み処を追われたドラゴンたちによって踏み荒らされ、
焼き尽くされてしまった事を、彼女はまだ知らない・・・。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:6,attack:2300,defense:1e3,attribute:"Dark",type:"Warrior",pendulumScaleR:3,pendulumScaleL:3,wikiName:"《竜角の狩猟者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CE%B5%B3%D1%A4%CE%BC%ED%CE%C4%BC%D4%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星６/闇属性/戦士族/攻2300/守1000
【Ｐスケール：青３/赤３】
(1)：フィールドの通常モンスターの攻撃力は２００アップし、
自分の通常モンスターの戦闘で発生する自分への戦闘ダメージは０になる。
【モンスター情報】
疫病に苦しむ故郷の村を救うため、霊薬の原料となるドラゴンの角を乱獲する女戦士。
その村はすでに、棲み処を追われたドラゴンたちによって踏み荒らされ、
焼き尽くされてしまった事を、彼女はまだ知らない・・・。`,kind:"Monster",pendulumDescription:`(1)：フィールドの通常モンスターの攻撃力は２００アップし、
自分の通常モンスターの戦闘で発生する自分への戦闘ダメージは０になる。`},竜穴の魔術師:{name:"竜穴の魔術師",nameKana:"",description:`若くして竜の魂を呼び覚ます神通力を体得した天才魔術師。
その寡黙でストイックな魔術への姿勢から人付き合いは苦手だが、
弟子の「竜脈の魔術師」にいつも振り回され、調子を狂わされている。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:7,attack:900,defense:2700,attribute:"Water",type:"Spellcaster",pendulumScaleR:8,pendulumScaleL:8,wikiName:"《竜穴の魔術師》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CE%B5%B7%EA%A4%CE%CB%E2%BD%D1%BB%D5%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星７/水属性/魔法使い族/攻 900/守2700
【Ｐスケール：青８/赤８】
(1)：１ターンに１度、もう片方の自分のＰゾーンに「魔術師」カードが存在する場合、
手札のＰモンスター１体を捨て、
フィールドの魔法・罠カード１枚を対象として発動できる。
そのカードを破壊する。
【モンスター情報】
若くして竜の魂を呼び覚ます神通力を体得した天才魔術師。
その寡黙でストイックな魔術への姿勢から人付き合いは苦手だが、
弟子の「竜脈の魔術師」にいつも振り回され、調子を狂わされている。`,kind:"Monster",pendulumDescription:`(1)：１ターンに１度、もう片方の自分のＰゾーンに「魔術師」カードが存在する場合、
手札のＰモンスター１体を捨て、
フィールドの魔法・罠カード１枚を対象として発動できる。
そのカードを破壊する。`},竜剣士マスターＰ:{name:"竜剣士マスターＰ",nameKana:"",description:`同志たちの力を得て成長した「竜剣士ラスターＰ」の姿。
謎の呪いをかけられて竜魔族に似た竜の力を発現しているが、
それ以前の記憶が全て失われており、真相は定かではない。
"竜化の秘法"がその呪いと記憶を紐解く鍵だと信じて、
今日も悪の魔王を討つべく旅を続けている。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:4,attack:1950,attribute:"Light",type:"Dragon",pendulumScaleR:3,pendulumScaleL:3,wikiName:"《竜剣士マスターＰ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CE%B5%B7%F5%BB%CE%A5%DE%A5%B9%A5%BF%A1%BC%A3%D0%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星４/光属性/ドラゴン族/攻1950/守   0
【Ｐスケール：青３/赤３】
(1)：このカードがＰゾーンに存在する限り１度だけ、
自分または相手のＰゾーンのカード１枚を対象として発動できる。
そのカードを破壊する。
【モンスター情報】
同志たちの力を得て成長した「竜剣士ラスターＰ」の姿。
謎の呪いをかけられて竜魔族に似た竜の力を発現しているが、
それ以前の記憶が全て失われており、真相は定かではない。
"竜化の秘法"がその呪いと記憶を紐解く鍵だと信じて、
今日も悪の魔王を討つべく旅を続けている。`,kind:"Monster",pendulumDescription:`(1)：このカードがＰゾーンに存在する限り１度だけ、
自分または相手のＰゾーンのカード１枚を対象として発動できる。
そのカードを破壊する。`,defense:0},竜魂の石像:{name:"竜魂の石像",nameKana:"",description:"ドラゴンの魂を持つ石像の戦士。自慢の剣で、敵を切り裂く。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1100,defense:900,attribute:"Earth",type:"Warrior",wikiName:"《竜魂の石像》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CE%B5%BA%B2%A4%CE%C0%D0%C1%FC%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/戦士族/攻1100/守 900
ドラゴンの魂を持つ石像の戦士。自慢の剣で、敵を切り裂く。`,kind:"Monster"},竜魔王ベクターＰ:{name:"竜魔王ベクターＰ",nameKana:"",description:`この世界に突如として現れ、瞬く間に世界を蹂躙し尽くした竜魔族の大群を率いる魔王。
"竜化の秘法"によって万物を悪しきドラゴンの姿に変えてしまうと言われているが、
その力の正体はよく分かっていない。
強大な魔力の源泉はこの次元のものではないとまで噂されている。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:4,attack:1850,attribute:"Dark",type:"Dragon",pendulumScaleR:3,pendulumScaleL:3,wikiName:"《竜魔王ベクターＰ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CE%B5%CB%E2%B2%A6%A5%D9%A5%AF%A5%BF%A1%BC%A3%D0%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星４/闇属性/ドラゴン族/攻1850/守   0
【Ｐスケール：青３/赤３】
(1)：このカードがＰゾーンに存在する限り、
相手のＰゾーンのカードの効果は無効化される。
【モンスター情報】
この世界に突如として現れ、瞬く間に世界を蹂躙し尽くした竜魔族の大群を率いる魔王。
"竜化の秘法"によって万物を悪しきドラゴンの姿に変えてしまうと言われているが、
その力の正体はよく分かっていない。
強大な魔力の源泉はこの次元のものではないとまで噂されている。`,kind:"Monster",pendulumDescription:`(1)：このカードがＰゾーンに存在する限り、
相手のＰゾーンのカードの効果は無効化される。`,defense:0},竜脈の魔術師:{name:"竜脈の魔術師",nameKana:"",description:`元気だけが取り得の駆け出しの少年魔術師。
実は無意識のうちに大地に眠る竜の魂を知覚する能力を有しており、
まだ半人前ながらその資質の高さには師匠の「竜穴の魔術師」も一目置いている。`,cardType:"Monster",monsterCategories:["Normal","Pendulum"],level:4,attack:1800,defense:900,attribute:"Earth",type:"Spellcaster",pendulumScaleR:1,pendulumScaleL:1,wikiName:"《竜脈の魔術師》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CE%B5%CC%AE%A4%CE%CB%E2%BD%D1%BB%D5%A1%D5",wikiTextAll:`ペンデュラム・通常モンスター
星４/地属性/魔法使い族/攻1800/守 900
【Ｐスケール：青１/赤１】
(1)：１ターンに１度、もう片方の自分のＰゾーンに「魔術師」カードが存在する場合、
手札のＰモンスター１体を捨て、
フィールドの表側表示モンスター１体を対象として発動できる。
そのモンスターを破壊する。
【モンスター情報】
元気だけが取り得の駆け出しの少年魔術師。
実は無意識のうちに大地に眠る竜の魂を知覚する能力を有しており、
まだ半人前ながらその資質の高さには師匠の「竜穴の魔術師」も一目置いている。`,kind:"Monster",pendulumDescription:`(1)：１ターンに１度、もう片方の自分のＰゾーンに「魔術師」カードが存在する場合、
手札のＰモンスター１体を捨て、
フィールドの表側表示モンスター１体を対象として発動できる。
そのモンスターを破壊する。`},緑樹の霊王:{name:"緑樹の霊王",nameKana:"",description:"青々と生い茂る木に囲まれて暮らす、森を治める若き王。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:500,defense:1600,attribute:"Earth",type:"Plant",wikiName:"《緑樹の霊王》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CE%D0%BC%F9%A4%CE%CE%EE%B2%A6%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/植物族/攻 500/守1600
青々と生い茂る木に囲まれて暮らす、森を治める若き王。`,kind:"Monster"},"麗の魔妖－妲姫":{name:"麗の魔妖－妲姫",nameKana:"",description:`(1)：「麗の魔妖－妲姫」は自分フィールドに１体しか表側表示で存在できない。
(2)：このカードが墓地に存在し、
「魔妖」モンスターがＥＸデッキから自分フィールドに特殊召喚された時に発動できる。
このカードを特殊召喚する。
この効果を発動するターン、自分は「魔妖」モンスターしかＥＸデッキから特殊召喚できない。`,cardType:"Monster",monsterCategories:["Effect","Tuner"],level:2,attack:1e3,defense:0,attribute:"Fire",type:"Zombie",wikiName:"《麗の魔妖－妲姫》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CE%EF%A4%CE%CB%E2%CD%C5%A1%DD%D5%A7%C9%B1%A1%D5",wikiTextAll:`チューナー・効果モンスター
星２/炎属性/アンデット族/攻1000/守   0
(1)：「麗の魔妖－妲姫」は自分フィールドに１体しか表側表示で存在できない。
(2)：このカードが墓地に存在し、
「魔妖」モンスターがＥＸデッキから自分フィールドに特殊召喚された時に発動できる。
このカードを特殊召喚する。
この効果を発動するターン、自分は「魔妖」モンスターしかＥＸデッキから特殊召喚できない。`,kind:"Monster"},六武衆の侍従:{name:"六武衆の侍従",nameKana:"",description:`六武衆を陰で支える謎多き人物。
今はもう闘う事はないが、体に刻まれた無数の傷跡が何かを語る。
その過去を知る者はいない。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:200,defense:2e3,attribute:"Earth",type:"Warrior",wikiName:"《六武衆の侍従》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CF%BB%C9%F0%BD%B0%A4%CE%BB%F8%BD%BE%A1%D5",wikiTextAll:`通常モンスター
星３/地属性/戦士族/攻 200/守2000
六武衆を陰で支える謎多き人物。
今はもう闘う事はないが、体に刻まれた無数の傷跡が何かを語る。
その過去を知る者はいない。`,kind:"Monster",nameTags:["六武衆"]},恍惚の人魚:{name:"恍惚の人魚",nameKana:"",description:"海を航海する者を誘惑しておぼれさせる、美しい人魚。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:900,attribute:"Water",type:"Fish",wikiName:"《恍惚の人魚》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%D7%F2%B9%FB%A4%CE%BF%CD%B5%FB%A1%D5",wikiTextAll:`通常モンスター
星３/水属性/魚族/攻1200/守 900
海を航海する者を誘惑しておぼれさせる、美しい人魚。`,kind:"Monster"},髑髏の寺院:{name:"髑髏の寺院",nameKana:"",description:`ドクロと骨ばかりの、気味の悪いお寺。
近づく者を吸い込む。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:900,defense:1300,attribute:"Dark",type:"Zombie",wikiName:"《髑髏の寺院》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%F1%F1%F1%F0%A4%CE%BB%FB%B1%A1%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/アンデット族/攻 900/守1300
ドクロと骨ばかりの、気味の悪いお寺。
近づく者を吸い込む。`,kind:"Monster"},"サイバー・ドラゴン・インフィニティ":{name:"サイバー・ドラゴン・インフィニティ",nameKana:"",description:`機械族・光属性レベル６モンスター×３
「サイバー・ドラゴン・インフィニティ」は１ターンに１度、
自分フィールドの「サイバー・ドラゴン・ノヴァ」の上に重ねてＸ召喚する事もできる。
(1)：このカードの攻撃力は、このカードのＸ素材の数×２００アップする。
(2)：１ターンに１度、フィールドの表側攻撃表示モンスター１体を対象として発動できる。
そのモンスターをこのカードのＸ素材とする。
(3)：１ターンに１度、魔法・罠・モンスターの効果が発動した時、
このカードのＸ素材を１つ取り除いて発動できる。
その発動を無効にし破壊する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Xyz","SpecialSummon","Effect"],attack:2100,defense:1600,attribute:"Light",type:"Machine",wikiName:"《サイバー・ドラゴン・インフィニティ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%A4%A5%D0%A1%BC%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%A6%A5%A4%A5%F3%A5%D5%A5%A3%A5%CB%A5%C6%A5%A3%A1%D5",wikiTextAll:`エクシーズ・効果モンスター
ランク６/光属性/機械族/攻2100/守1600
機械族・光属性レベル６モンスター×３
「サイバー・ドラゴン・インフィニティ」は１ターンに１度、
自分フィールドの「サイバー・ドラゴン・ノヴァ」の上に重ねてＸ召喚する事もできる。
(1)：このカードの攻撃力は、このカードのＸ素材の数×２００アップする。
(2)：１ターンに１度、フィールドの表側攻撃表示モンスター１体を対象として発動できる。
そのモンスターをこのカードのＸ素材とする。
(3)：１ターンに１度、魔法・罠・モンスターの効果が発動した時、
このカードのＸ素材を１つ取り除いて発動できる。
その発動を無効にし破壊する。`},"サイバー・ドラゴン・ノヴァ":{name:"サイバー・ドラゴン・ノヴァ",nameKana:"",description:`機械族レベル５モンスター×２
(1)：１ターンに１度、このカードのＸ素材を１つ取り除き、
自分の墓地の「サイバー・ドラゴン」１体を対象として発動できる。
そのモンスターを特殊召喚する。
(2)：自分・相手ターンに１度、自分の手札・フィールド（表側表示）から
「サイバー・ドラゴン」１体を除外して発動できる。
このカードの攻撃力はターン終了時まで２１００アップする。
(3)：このカードが相手の効果で墓地へ送られた場合に発動できる。
ＥＸデッキから機械族の融合モンスター１体を特殊召喚する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Xyz","Effect"],attack:2100,defense:1600,attribute:"Light",type:"Machine",wikiName:"《サイバー・ドラゴン・ノヴァ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%A4%A5%D0%A1%BC%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%A6%A5%CE%A5%F4%A5%A1%A1%D5",wikiTextAll:`エクシーズ・効果モンスター
ランク５/光属性/機械族/攻2100/守1600
機械族レベル５モンスター×２
(1)：１ターンに１度、このカードのＸ素材を１つ取り除き、
自分の墓地の「サイバー・ドラゴン」１体を対象として発動できる。
そのモンスターを特殊召喚する。
(2)：自分・相手ターンに１度、自分の手札・フィールド（表側表示）から
「サイバー・ドラゴン」１体を除外して発動できる。
このカードの攻撃力はターン終了時まで２１００アップする。
(3)：このカードが相手の効果で墓地へ送られた場合に発動できる。
ＥＸデッキから機械族の融合モンスター１体を特殊召喚する。`},"トゥーン・サイバー・ドラゴン":{name:"トゥーン・サイバー・ドラゴン",nameKana:"",description:`(1)：相手フィールドにモンスターが存在し、
自分フィールドにモンスターが存在しない場合、
このカードは手札から特殊召喚できる。
(2)：このカードは召喚・反転召喚・特殊召喚したターンには攻撃できない。
(3)：自分フィールドに「トゥーン・ワールド」が存在し、
相手フィールドにトゥーンモンスターが存在しない場合、このカードは直接攻撃できる。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Toon","Effect"],level:5,attack:2100,defense:1600,attribute:"Light",type:"Machine",wikiName:"《トゥーン・サイバー・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A5%A5%A1%BC%A5%F3%A1%A6%A5%B5%A5%A4%A5%D0%A1%BC%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`トゥーン・効果モンスター
星５/光属性/機械族/攻2100/守1600
(1)：相手フィールドにモンスターが存在し、
自分フィールドにモンスターが存在しない場合、
このカードは手札から特殊召喚できる。
(2)：このカードは召喚・反転召喚・特殊召喚したターンには攻撃できない。
(3)：自分フィールドに「トゥーン・ワールド」が存在し、
相手フィールドにトゥーンモンスターが存在しない場合、このカードは直接攻撃できる。`,nameTags:["トゥーン"]},"サイバー・ドラゴン・コア":{name:"サイバー・ドラゴン・コア",nameKana:"",description:`このカード名の(2)(3)の効果は１ターンに１度、いずれか１つしか使用できない。
(1)：このカードのカード名は、フィールド・墓地に存在する限り「サイバー・ドラゴン」として扱う。
(2)：このカードが召喚した場合に発動する。
デッキから「サイバー」魔法・罠カードか「サイバネティック」魔法・罠カード１枚を手札に加える。
(3)：相手フィールドにのみモンスターが存在する場合、墓地のこのカードを除外して発動できる。
デッキから「サイバー・ドラゴン」モンスター１体を特殊召喚する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:2,attack:400,defense:1500,attribute:"Light",type:"Machine",wikiName:"《サイバー・ドラゴン・コア》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%A4%A5%D0%A1%BC%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%A6%A5%B3%A5%A2%A1%D5",wikiTextAll:`効果モンスター
星２/光属性/機械族/攻 400/守1500
このカード名の(2)(3)の効果は１ターンに１度、いずれか１つしか使用できない。
(1)：このカードのカード名は、フィールド・墓地に存在する限り「サイバー・ドラゴン」として扱う。
(2)：このカードが召喚した場合に発動する。
デッキから「サイバー」魔法・罠カードか「サイバネティック」魔法・罠カード１枚を手札に加える。
(3)：相手フィールドにのみモンスターが存在する場合、墓地のこのカードを除外して発動できる。
デッキから「サイバー・ドラゴン」モンスター１体を特殊召喚する。`},"サイバー・ドラゴン・ツヴァイ":{name:"サイバー・ドラゴン・ツヴァイ",nameKana:"",description:`(1)：このカードのカード名は、墓地に存在する限り「サイバー・ドラゴン」として扱う。
(2)：１ターンに１度、手札の魔法カード１枚を相手に見せて発動できる。
このカードのカード名はエンドフェイズまで「サイバー・ドラゴン」として扱う。
(3)：このカードが相手モンスターに攻撃するダメージステップの間、このカードの攻撃力は３００アップする。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1500,defense:1e3,attribute:"Light",type:"Machine",wikiName:"《サイバー・ドラゴン・ツヴァイ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%A4%A5%D0%A1%BC%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%A6%A5%C4%A5%F4%A5%A1%A5%A4%A1%D5",wikiTextAll:`効果モンスター
星４/光属性/機械族/攻1500/守1000
(1)：このカードのカード名は、墓地に存在する限り「サイバー・ドラゴン」として扱う。
(2)：１ターンに１度、手札の魔法カード１枚を相手に見せて発動できる。
このカードのカード名はエンドフェイズまで「サイバー・ドラゴン」として扱う。
(3)：このカードが相手モンスターに攻撃するダメージステップの間、このカードの攻撃力は３００アップする。`},"サイバー・ドラゴン・ドライ":{name:"サイバー・ドラゴン・ドライ",nameKana:"",description:`(1)：このカードのカード名は、フィールド・墓地に存在する限り「サイバー・ドラゴン」として扱う。
(2)：このカードが召喚に成功した時に発動できる。
自分フィールドの全ての「サイバー・ドラゴン」のレベルを５にする。
この効果を発動するターン、自分は機械族モンスターしか特殊召喚できない。
(3)：このカードが除外された場合、
自分フィールドの「サイバー・ドラゴン」１体を対象として発動できる。
このターン、そのモンスターは戦闘・効果では破壊されない。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1800,defense:800,attribute:"Light",type:"Machine",wikiName:"《サイバー・ドラゴン・ドライ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%A4%A5%D0%A1%BC%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%A6%A5%C9%A5%E9%A5%A4%A1%D5",wikiTextAll:`効果モンスター
星４/光属性/機械族/攻1800/守 800
(1)：このカードのカード名は、フィールド・墓地に存在する限り「サイバー・ドラゴン」として扱う。
(2)：このカードが召喚に成功した時に発動できる。
自分フィールドの全ての「サイバー・ドラゴン」のレベルを５にする。
この効果を発動するターン、自分は機械族モンスターしか特殊召喚できない。
(3)：このカードが除外された場合、
自分フィールドの「サイバー・ドラゴン」１体を対象として発動できる。
このターン、そのモンスターは戦闘・効果では破壊されない。`},"サイバー・ドラゴン・ネクステア":{name:"サイバー・ドラゴン・ネクステア",nameKana:"",description:`このカード名の(2)(3)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：このカードのカード名は、フィールド・墓地に存在する限り「サイバー・ドラゴン」として扱う。
(2)：手札から他のモンスター１体を捨てて発動できる。
このカードを手札から特殊召喚する。
(3)：このカードが召喚・特殊召喚した場合、
攻撃力か守備力が２１００の、自分の墓地の機械族モンスター１体を対象として発動できる。
そのモンスターを特殊召喚する。
この効果の発動後、ターン終了時まで自分は機械族モンスターしか特殊召喚できない。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:1,attack:200,defense:200,attribute:"Light",type:"Machine",wikiName:"《サイバー・ドラゴン・ネクステア》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%A4%A5%D0%A1%BC%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%A6%A5%CD%A5%AF%A5%B9%A5%C6%A5%A2%A1%D5",wikiTextAll:`効果モンスター
星１/光属性/機械族/攻 200/守 200
このカード名の(2)(3)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：このカードのカード名は、フィールド・墓地に存在する限り「サイバー・ドラゴン」として扱う。
(2)：手札から他のモンスター１体を捨てて発動できる。
このカードを手札から特殊召喚する。
(3)：このカードが召喚・特殊召喚した場合、
攻撃力か守備力が２１００の、自分の墓地の機械族モンスター１体を対象として発動できる。
そのモンスターを特殊召喚する。
この効果の発動後、ターン終了時まで自分は機械族モンスターしか特殊召喚できない。`},"サイバー・ドラゴン・フィーア":{name:"サイバー・ドラゴン・フィーア",nameKana:"",description:`このカード名の(2)の効果は１ターンに１度しか使用できない。
(1)：このカードのカード名は、フィールド・墓地に存在する限り「サイバー・ドラゴン」として扱う。
(2)：自分が「サイバー・ドラゴン」の召喚・特殊召喚に成功した場合に発動できる。
このカードを手札から守備表示で特殊召喚する。
(3)：このカードがモンスターゾーンに存在する限り、
自分フィールドの全ての「サイバー・ドラゴン」の攻撃力・守備力は５００アップする。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1100,defense:1600,attribute:"Light",type:"Machine",wikiName:"《サイバー・ドラゴン・フィーア》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%A4%A5%D0%A1%BC%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%A6%A5%D5%A5%A3%A1%BC%A5%A2%A1%D5",wikiTextAll:`効果モンスター
星４/光属性/機械族/攻1100/守1600
このカード名の(2)の効果は１ターンに１度しか使用できない。
(1)：このカードのカード名は、フィールド・墓地に存在する限り「サイバー・ドラゴン」として扱う。
(2)：自分が「サイバー・ドラゴン」の召喚・特殊召喚に成功した場合に発動できる。
このカードを手札から守備表示で特殊召喚する。
(3)：このカードがモンスターゾーンに存在する限り、
自分フィールドの全ての「サイバー・ドラゴン」の攻撃力・守備力は５００アップする。`},"サイバー・ドラゴン・ヘルツ":{name:"サイバー・ドラゴン・ヘルツ",nameKana:"",description:`このカード名の(2)(3)の効果は１ターンに１度、いずれか１つしか使用できない。
(1)：このカードのカード名は、フィールド・墓地に存在する限り「サイバー・ドラゴン」として扱う。
(2)：このカードが特殊召喚した場合に発動できる。
このカードのレベルをターン終了時まで５にする。
この効果の発動後、ターン終了時まで自分は機械族モンスターしか特殊召喚できない。
(3)：このカードが墓地へ送られた場合に発動できる。
自分のデッキ・墓地からこのカード以外の「サイバー・ドラゴン」１体を手札に加える。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:1,attack:100,defense:100,attribute:"Light",type:"Machine",wikiName:"《サイバー・ドラゴン・ヘルツ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%A4%A5%D0%A1%BC%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%A6%A5%D8%A5%EB%A5%C4%A1%D5",wikiTextAll:`効果モンスター
星１/光属性/機械族/攻 100/守 100
このカード名の(2)(3)の効果は１ターンに１度、いずれか１つしか使用できない。
(1)：このカードのカード名は、フィールド・墓地に存在する限り「サイバー・ドラゴン」として扱う。
(2)：このカードが特殊召喚した場合に発動できる。
このカードのレベルをターン終了時まで５にする。
この効果の発動後、ターン終了時まで自分は機械族モンスターしか特殊召喚できない。
(3)：このカードが墓地へ送られた場合に発動できる。
自分のデッキ・墓地からこのカード以外の「サイバー・ドラゴン」１体を手札に加える。`},"サイバー・ドラゴン":{name:"サイバー・ドラゴン",nameKana:"",description:"(1)：相手フィールドにのみモンスターが存在する場合、このカードは手札から特殊召喚できる。",pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:5,attack:2100,defense:1600,attribute:"Light",type:"Machine",wikiName:"《サイバー・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%A4%A5%D0%A1%BC%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`効果モンスター
星５/光属性/機械族/攻2100/守1600
(1)：相手フィールドにのみモンスターが存在する場合、
このカードは手札から特殊召喚できる。`},"プロト・サイバー・ドラゴン":{name:"プロト・サイバー・ドラゴン",nameKana:"",description:"このカードのカード名は、フィールド上に表側表示で存在する限り「サイバー・ドラゴン」として扱う。",pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:3,attack:1100,defense:600,attribute:"Light",type:"Machine",wikiName:"《プロト・サイバー・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D7%A5%ED%A5%C8%A1%A6%A5%B5%A5%A4%A5%D0%A1%BC%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`効果モンスター
星３/光属性/機械族/攻1100/守 600
このカードのカード名は、フィールド上に表側表示で存在する限り「サイバー・ドラゴン」として扱う。`},"Ｎｏ.１７ リバイス・ドラゴン":{name:"Ｎｏ.１７ リバイス・ドラゴン",nameKana:"",description:`レベル３モンスター×２
(1)：Ｘ素材が無いこのカードは直接攻撃できない。
(2)：１ターンに１度、このカードのＸ素材を１つ取り除いて発動できる。
このカードの攻撃力は５００アップする。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Xyz","Effect"],attack:2e3,attribute:"Water",type:"Dragon",wikiName:"《Ｎｏ.１７ リバイス・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%CE%A3%EF.%A3%B1%A3%B7%20%A5%EA%A5%D0%A5%A4%A5%B9%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`エクシーズ・効果モンスター
ランク３/水属性/ドラゴン族/攻2000/守   0
レベル３モンスター×２
(1)：Ｘ素材が無いこのカードは直接攻撃できない。
(2)：１ターンに１度、このカードのＸ素材を１つ取り除いて発動できる。
このカードの攻撃力は５００アップする。`,defense:0},"クリアー・バイス・ドラゴン":{name:"クリアー・バイス・ドラゴン",nameKana:"",description:`(1)：このカードがモンスターゾーンに存在する限り、
自分に「クリアー・ワールド」の効果は適用されない。
(2)：このカードの攻撃力は相手モンスターに攻撃するダメージ計算時のみ、
その相手モンスターの攻撃力の倍になる。
(3)：フィールドのこのカードが相手の効果で破壊される場合、
代わりに自分の手札を１枚捨てる事ができる。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:8,attribute:"Dark",type:"Dragon",wikiName:"《クリアー・バイス・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AF%A5%EA%A5%A2%A1%BC%A1%A6%A5%D0%A5%A4%A5%B9%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`効果モンスター
星８/闇属性/ドラゴン族/攻   ?/守   0
(1)：このカードがモンスターゾーンに存在する限り、
自分に「クリアー・ワールド」の効果は適用されない。
(2)：このカードの攻撃力は相手モンスターに攻撃するダメージ計算時のみ、
その相手モンスターの攻撃力の倍になる。
(3)：フィールドのこのカードが相手の効果で破壊される場合、
代わりに自分の手札を１枚捨てる事ができる。`,defense:0},"バイス・ドラゴン":{name:"バイス・ドラゴン",nameKana:"",description:`(1)：相手フィールドにのみモンスターが存在する場合、
このカードは手札から特殊召喚できる。
この方法で特殊召喚したこのカードの元々の攻撃力・守備力は半分になる。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:5,attack:2e3,defense:2400,attribute:"Dark",type:"Dragon",wikiName:"《バイス・ドラゴン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D0%A5%A4%A5%B9%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%D5",wikiTextAll:`効果モンスター
星５/闇属性/ドラゴン族/攻2000/守2400
(1)：相手フィールドにのみモンスターが存在する場合、
このカードは手札から特殊召喚できる。
この方法で特殊召喚したこのカードの元々の攻撃力・守備力は半分になる。`},"サモン・リアクター・ＡＩ":{name:"サモン・リアクター・ＡＩ",nameKana:"",description:`このカードが自分フィールド上に表側表示で存在する限り、
相手フィールド上にモンスターが召喚・反転召喚・特殊召喚された時、
相手ライフに８００ポイントダメージを与える。
この効果は１ターンに１度しか使用できない。
この効果を使用したターンのバトルフェイズ時、
相手モンスター１体の攻撃を無効にできる。
また、自分フィールド上に表側表示で存在する、
このカードと「トラップ・リアクター・ＲＲ」
「マジック・リアクター・ＡＩＤ」をそれぞれ１体ずつ墓地へ送る事で、
自分の手札・デッキ・墓地から「ジャイアント・ボマー・エアレイド」
１体を選んで特殊召喚する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:5,attack:2e3,defense:1400,attribute:"Dark",type:"Machine",wikiName:"《サモン・リアクター・ＡＩ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%E2%A5%F3%A1%A6%A5%EA%A5%A2%A5%AF%A5%BF%A1%BC%A1%A6%A3%C1%A3%C9%A1%D5",wikiTextAll:`効果モンスター
星５/闇属性/機械族/攻2000/守1400
このカードが自分フィールド上に表側表示で存在する限り、
相手フィールド上にモンスターが召喚・反転召喚・特殊召喚された時、
相手ライフに８００ポイントダメージを与える。
この効果は１ターンに１度しか使用できない。
この効果を使用したターンのバトルフェイズ時、
相手モンスター１体の攻撃を無効にできる。
また、自分フィールド上に表側表示で存在する、
このカードと「トラップ・リアクター・ＲＲ」
「マジック・リアクター・ＡＩＤ」をそれぞれ１体ずつ墓地へ送る事で、
自分の手札・デッキ・墓地から「ジャイアント・ボマー・エアレイド」
１体を選んで特殊召喚する。`},"トラップ・リアクター・ＲＲ":{name:"トラップ・リアクター・ＲＲ",nameKana:"",description:`１ターンに１度、相手が罠カードを発動した時に発動できる。
その罠カードを破壊し、相手ライフに８００ポイントダメージを与える。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:800,defense:1800,attribute:"Dark",type:"Machine",wikiName:"《トラップ・リアクター・ＲＲ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A5%E9%A5%C3%A5%D7%A1%A6%A5%EA%A5%A2%A5%AF%A5%BF%A1%BC%A1%A6%A3%D2%A3%D2%A1%D5",wikiTextAll:`効果モンスター
星４/闇属性/機械族/攻 800/守1800
１ターンに１度、相手が罠カードを発動した時に発動できる。
その罠カードを破壊し、相手ライフに８００ポイントダメージを与える。`},"マジック・リアクター・ＡＩＤ":{name:"マジック・リアクター・ＡＩＤ",nameKana:"",description:`１ターンに１度、相手が魔法カードを発動した時に発動できる。
その魔法カードを破壊し、相手ライフに８００ポイントダメージを与える。 `,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:3,attack:1200,defense:900,attribute:"Dark",type:"Machine",wikiName:"《マジック・リアクター・ＡＩＤ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%B8%A5%C3%A5%AF%A1%A6%A5%EA%A5%A2%A5%AF%A5%BF%A1%BC%A1%A6%A3%C1%A3%C9%A3%C4%A1%D5",wikiTextAll:`効果モンスター
星３/闇属性/機械族/攻1200/守 900　
１ターンに１度、相手が魔法カードを発動した時に発動できる。
その魔法カードを破壊し、相手ライフに８００ポイントダメージを与える。 `},"リアクター・スライム":{name:"リアクター・スライム",nameKana:"",description:`このカード名の(1)(2)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：自分メインフェイズに発動できる。
自分フィールドに「スライムモンスタートークン」（水族・水・星１・攻／守５００）２体を特殊召喚する。
このターン、自分は幻神獣族モンスターしか召喚・特殊召喚できない。
(2)：自分・相手のバトルフェイズにこのカードをリリースして発動できる。
自分の手札・デッキ・墓地から「メタル・リフレクト・スライム」１枚を選んで自分の魔法＆罠ゾーンにセットする。
この効果でセットしたカードはセットしたターンでも発動できる。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:500,defense:500,attribute:"Water",type:"Aqua",wikiName:"《リアクター・スライム》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EA%A5%A2%A5%AF%A5%BF%A1%BC%A1%A6%A5%B9%A5%E9%A5%A4%A5%E0%A1%D5",wikiTextAll:`効果モンスター
星４/水属性/水族/攻 500/守 500
このカード名の(1)(2)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：自分メインフェイズに発動できる。
自分フィールドに「スライムモンスタートークン」（水族・水・星１・攻／守５００）２体を特殊召喚する。
このターン、自分は幻神獣族モンスターしか召喚・特殊召喚できない。
(2)：自分・相手のバトルフェイズにこのカードをリリースして発動できる。
自分の手札・デッキ・墓地から「メタル・リフレクト・スライム」１枚を選んで自分の魔法＆罠ゾーンにセットする。
この効果でセットしたカードはセットしたターンでも発動できる。`},地底のアラクネー:{name:"地底のアラクネー",nameKana:"",description:`闇属性チューナー＋チューナー以外の昆虫族モンスター１体
このカードが攻撃する場合、
相手はダメージステップ終了時まで魔法・罠カードを発動する事ができない。
１ターンに１度、相手フィールド上に表側表示で存在するモンスターを
装備カード扱いとしてこのカードに１体のみ装備する事ができる。
このカードが戦闘によって破壊される場合、
代わりにこの効果で装備したモンスターを破壊する事ができる。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Syncro","Effect"],level:6,attack:2400,defense:1200,attribute:"Earth",type:"Insect",wikiName:"《地底のアラクネー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C3%CF%C4%EC%A4%CE%A5%A2%A5%E9%A5%AF%A5%CD%A1%BC%A1%D5",wikiTextAll:`シンクロ・効果モンスター
星６/地属性/昆虫族/攻2400/守1200
闇属性チューナー＋チューナー以外の昆虫族モンスター１体
このカードが攻撃する場合、
相手はダメージステップ終了時まで魔法・罠カードを発動する事ができない。
１ターンに１度、相手フィールド上に表側表示で存在するモンスターを
装備カード扱いとしてこのカードに１体のみ装備する事ができる。
このカードが戦闘によって破壊される場合、
代わりにこの効果で装備したモンスターを破壊する事ができる。`},強欲な壺の精霊:{name:"強欲な壺の精霊",nameKana:"",description:`(1)：「強欲な壺」が発動した場合に発動する。
その「強欲な壺」を発動したプレイヤーはデッキから１枚ドローできる。
この効果はこのカードがモンスターゾーンに表側攻撃表示で存在する場合に発動と処理を行う。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:1,attack:100,defense:100,attribute:"Light",type:"Fairy",wikiName:"《強欲な壺の精霊》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B6%AF%CD%DF%A4%CA%D4%E4%A4%CE%C0%BA%CE%EE%A1%D5",wikiTextAll:`効果モンスター
星１/光属性/天使族/攻 100/守 100
(1)：「強欲な壺」が発動した場合に発動する。
その「強欲な壺」を発動したプレイヤーはデッキから１枚ドローできる。
この効果はこのカードがモンスターゾーンに表側攻撃表示で存在する場合に発動と処理を行う。`},強欲な壺:{name:"強欲な壺",nameKana:"",description:"(1)：自分はデッキから２枚ドローする。",kind:"Spell",spellCategory:"Normal",wikiName:"《強欲な壺》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B6%AF%CD%DF%A4%CA%D4%E4%A1%D5",wikiTextAll:`通常魔法
(1)：自分はデッキから２枚ドローする。`},天使の施し:{name:"天使の施し",nameKana:"",description:"自分のデッキからカードを３枚ドローし、その後手札を２枚選択して捨てる。",kind:"Spell",spellCategory:"Normal",wikiName:"《天使の施し》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C5%B7%BB%C8%A4%CE%BB%DC%A4%B7%A1%D5",wikiTextAll:`通常魔法
自分のデッキからカードを３枚ドローし、その後手札を２枚選択して捨てる。`},成金ゴブリン:{name:"成金ゴブリン",nameKana:"",description:`(1)：自分はデッキから１枚ドローする。
その後、相手は１０００ＬＰ回復する。`,kind:"Spell",spellCategory:"Normal",wikiName:"《成金ゴブリン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%AE%B6%E2%A5%B4%A5%D6%A5%EA%A5%F3%A1%D5",wikiTextAll:`通常魔法
(1)：自分はデッキから１枚ドローする。
その後、相手は１０００ＬＰ回復する。`},おろかな埋葬:{name:"おろかな埋葬",nameKana:"",description:"(1)：デッキからモンスター１体を墓地へ送る。",kind:"Spell",spellCategory:"Normal",wikiName:"《おろかな埋葬》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%AA%A4%ED%A4%AB%A4%CA%CB%E4%C1%F2%A1%D5",wikiTextAll:`通常魔法
(1)：デッキからモンスター１体を墓地へ送る。`},増援:{name:"増援",nameKana:"",description:"(1)：デッキからレベル４以下の戦士族モンスター１体を手札に加える。",kind:"Spell",spellCategory:"Normal",wikiName:"《増援》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C1%FD%B1%E7%A1%D5",wikiTextAll:`通常魔法
(1)：デッキからレベル４以下の戦士族モンスター１体を手札に加える。`},増援部隊:{name:"増援部隊",nameKana:"",description:`このカード名の(1)の効果は１ターンに１度しか使用できない。
(1)：自分の戦士族モンスターが戦闘を行う攻撃宣言時に発動できる。
手札からレベル４以下の戦士族モンスター１体を特殊召喚する。`,kind:"Spell",spellCategory:"Continuous",wikiName:"《増援部隊》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C1%FD%B1%E7%C9%F4%C2%E2%A1%D5",wikiTextAll:`永続魔法
このカード名の(1)の効果は１ターンに１度しか使用できない。
(1)：自分の戦士族モンスターが戦闘を行う攻撃宣言時に発動できる。
手札からレベル４以下の戦士族モンスター１体を特殊召喚する。`},"Ｅ－エマージェンシーコール":{name:"Ｅ－エマージェンシーコール",nameKana:"",description:"(1)：デッキから「Ｅ・ＨＥＲＯ」モンスター１体を手札に加える。",kind:"Spell",spellCategory:"Normal",wikiName:"《Ｅ－エマージェンシーコール》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%C5%A1%DD%A5%A8%A5%DE%A1%BC%A5%B8%A5%A7%A5%F3%A5%B7%A1%BC%A5%B3%A1%BC%A5%EB%A1%D5",wikiTextAll:`通常魔法
(1)：デッキから「Ｅ・ＨＥＲＯ」モンスター１体を手札に加える。`},"エマージェンシー・サイバー":{name:"エマージェンシー・サイバー",nameKana:"",description:`このカード名のカードは１ターンに１枚しか発動できない。
(1)：デッキから「サイバー・ドラゴン」モンスター
または通常召喚できない機械族・光属性モンスター１体を手札に加える。
(2)：相手によってこのカードの発動が無効になり、
このカードが墓地へ送られた場合、手札を１枚捨てて発動できる。
このカードを手札に加える。`,kind:"Spell",spellCategory:"Normal",wikiName:"《エマージェンシー・サイバー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A8%A5%DE%A1%BC%A5%B8%A5%A7%A5%F3%A5%B7%A1%BC%A1%A6%A5%B5%A5%A4%A5%D0%A1%BC%A1%D5",wikiTextAll:`通常魔法
このカード名のカードは１ターンに１枚しか発動できない。
(1)：デッキから「サイバー・ドラゴン」モンスター
または通常召喚できない機械族・光属性モンスター１体を手札に加える。
(2)：相手によってこのカードの発動が無効になり、
このカードが墓地へ送られた場合、手札を１枚捨てて発動できる。
このカードを手札に加える。`},"スクラップ・デスデーモン":{name:"スクラップ・デスデーモン",nameKana:"",description:"チューナー＋チューナー以外のモンスター１体以上",pendulumDescription:"",kind:"Monster",monsterCategories:["Syncro"],level:7,attack:2700,defense:1800,attribute:"Earth",type:"Fiend",wikiName:"《スクラップ・デスデーモン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B9%A5%AF%A5%E9%A5%C3%A5%D7%A1%A6%A5%C7%A5%B9%A5%C7%A1%BC%A5%E2%A5%F3%A1%D5",wikiTextAll:`シンクロモンスター
星７/地属性/悪魔族/攻2700/守1800
チューナー＋チューナー以外のモンスター１体以上`},大地の騎士ガイアナイト:{name:"大地の騎士ガイアナイト",nameKana:"",description:"チューナー＋チューナー以外のモンスター１体以上",pendulumDescription:"",kind:"Monster",monsterCategories:["Syncro"],level:6,attack:2600,defense:800,attribute:"Earth",type:"Warrior",wikiName:"《大地の騎士ガイアナイト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C2%E7%C3%CF%A4%CE%B5%B3%BB%CE%A5%AC%A5%A4%A5%A2%A5%CA%A5%A4%A5%C8%A1%D5",wikiTextAll:`シンクロモンスター
星６/地属性/戦士族/攻2600/守 800
チューナー＋チューナー以外のモンスター１体以上`},"ナチュル・ガオドレイク":{name:"ナチュル・ガオドレイク",nameKana:"",description:"地属性チューナー＋チューナー以外の地属性モンスター１体以上",pendulumDescription:"",kind:"Monster",monsterCategories:["Syncro"],level:9,attack:3e3,defense:1800,attribute:"Earth",type:"Beast",wikiName:"《ナチュル・ガオドレイク》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%CA%A5%C1%A5%E5%A5%EB%A1%A6%A5%AC%A5%AA%A5%C9%A5%EC%A5%A4%A5%AF%A1%D5",wikiTextAll:`シンクロモンスター
星９/地属性/獣族/攻3000/守1800
地属性チューナー＋チューナー以外の地属性モンスター１体以上`},"マジックカード「死者蘇生」":{name:"マジックカード「死者蘇生」",nameKana:"",description:`このカード名のカードは１ターンに１枚しか発動できない。
(1)：自分か相手の墓地のモンスター１体を対象として発動できる。
そのモンスターを自分フィールドに特殊召喚する。
このターン、この効果で特殊召喚したモンスターは攻撃できず、その効果は発動できない。`,kind:"Spell",spellCategory:"QuickPlay",wikiName:"《マジックカード「死者蘇生」》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%B8%A5%C3%A5%AF%A5%AB%A1%BC%A5%C9%A1%D6%BB%E0%BC%D4%C1%C9%C0%B8%A1%D7%A1%D5",wikiTextAll:`速攻魔法
このカード名のカードは１ターンに１枚しか発動できない。
(1)：自分か相手の墓地のモンスター１体を対象として発動できる。
そのモンスターを自分フィールドに特殊召喚する。
このターン、この効果で特殊召喚したモンスターは攻撃できず、その効果は発動できない。`},死者蘇生:{name:"死者蘇生",nameKana:"",description:`(1)：自分か相手の墓地のモンスター１体を対象として発動できる。
そのモンスターを自分フィールドに特殊召喚する。`,kind:"Spell",spellCategory:"Normal",wikiName:"《死者蘇生》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BB%E0%BC%D4%C1%C9%C0%B8%A1%D5",wikiTextAll:`通常魔法
(1)：自分か相手の墓地のモンスター１体を対象として発動できる。
そのモンスターを自分フィールドに特殊召喚する。`},"ライトロード・セイント ミネルバ":{name:"ライトロード・セイント ミネルバ",nameKana:"",description:`レベル４モンスター×２
このカード名の(1)(2)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：このカードのＸ素材を１つ取り除いて発動できる。
自分のデッキの上からカードを３枚墓地へ送る。
その中に「ライトロード」カードがあった場合、さらにその数だけ自分はドローする。
(2)：このカードが戦闘または相手の効果で破壊された場合に発動できる。
自分のデッキの上からカード３枚を墓地へ送る。
その中に「ライトロード」カードがあった場合、
さらにその数までフィールドのカードを破壊できる。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Xyz","SpecialSummon","Effect"],rank:4,attack:2e3,defense:800,attribute:"Light",type:"Fairy",wikiName:"《ライトロード・セイント ミネルバ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%BB%A5%A4%A5%F3%A5%C8%20%A5%DF%A5%CD%A5%EB%A5%D0%A1%D5",wikiTextAll:`エクシーズ・効果モンスター
ランク４/光属性/天使族/攻2000/守 800
レベル４モンスター×２
このカード名の(1)(2)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：このカードのＸ素材を１つ取り除いて発動できる。
自分のデッキの上からカードを３枚墓地へ送る。
その中に「ライトロード」カードがあった場合、さらにその数だけ自分はドローする。
(2)：このカードが戦闘または相手の効果で破壊された場合に発動できる。
自分のデッキの上からカード３枚を墓地へ送る。
その中に「ライトロード」カードがあった場合、
さらにその数までフィールドのカードを破壊できる。`,nameTags:["ライトロード"]},"ライトロード・アーク ミカエル":{name:"ライトロード・アーク ミカエル",nameKana:"",description:`チューナー＋チューナー以外の光属性モンスター１体以上
(1)：１ターンに１度、１０００ＬＰを払い、
フィールドのカード１枚を対象として発動できる。
そのカードを除外する。
(2)：このカードが破壊された時、
このカード以外の自分の墓地の「ライトロード」モンスターを任意の数だけ対象として発動できる。
そのモンスターをデッキに戻し、自分は戻した数×３００ＬＰ回復する。
(3)：自分エンドフェイズに発動する。
自分のデッキの上からカードを３枚墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["SpecialSummon","Effect"],level:7,attack:2600,defense:2e3,attribute:"Light",type:"Dragon",wikiName:"《ライトロード・アーク ミカエル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%A2%A1%BC%A5%AF%20%A5%DF%A5%AB%A5%A8%A5%EB%A1%D5",wikiTextAll:`シンクロ・効果モンスター
星７/光属性/ドラゴン族/攻2600/守2000
チューナー＋チューナー以外の光属性モンスター１体以上
(1)：１ターンに１度、１０００ＬＰを払い、
フィールドのカード１枚を対象として発動できる。
そのカードを除外する。
(2)：このカードが破壊された時、
このカード以外の自分の墓地の「ライトロード」モンスターを任意の数だけ対象として発動できる。
そのモンスターをデッキに戻し、自分は戻した数×３００ＬＰ回復する。
(3)：自分エンドフェイズに発動する。
自分のデッキの上からカードを３枚墓地へ送る。`,nameTags:["ライトロード"]},"ライトロード・アーチャー フェリス":{name:"ライトロード・アーチャー フェリス",nameKana:"",description:`このカードは通常召喚できず、カードの効果でのみ特殊召喚できる。
(1)：このカードがモンスターの効果でデッキから墓地へ送られた場合に発動する。
このカードを特殊召喚する。
(2)：このカードをリリースし、相手フィールドのモンスター１体を対象として発動できる。
その相手モンスターを破壊する。
その後、自分のデッキの上からカードを３枚墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["SpecialSummon","Tuner","Effect"],level:4,attack:1100,defense:2e3,attribute:"Light",type:"BeastWarrior",wikiName:"《ライトロード・アーチャー フェリス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%A2%A1%BC%A5%C1%A5%E3%A1%BC%20%A5%D5%A5%A7%A5%EA%A5%B9%A1%D5",wikiTextAll:`特殊召喚・チューナー・効果モンスター
星４/光属性/獣戦士族/攻1100/守2000
このカードは通常召喚できず、カードの効果でのみ特殊召喚できる。
(1)：このカードがモンスターの効果でデッキから墓地へ送られた場合に発動する。
このカードを特殊召喚する。
(2)：このカードをリリースし、相手フィールドのモンスター１体を対象として発動できる。
その相手モンスターを破壊する。
その後、自分のデッキの上からカードを３枚墓地へ送る。`,nameTags:["ライトロード"],canReborn:!0},"ライトロード・ビースト ウォルフ":{name:"ライトロード・ビースト ウォルフ",nameKana:"",description:`このカードは通常召喚できず、カードの効果でのみ特殊召喚できる。
(1)：このカードがデッキから墓地へ送られた場合に発動する。
このカードを特殊召喚する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["SpecialSummon","Effect"],level:4,attack:2100,defense:300,attribute:"Light",type:"BeastWarrior",wikiName:"《ライトロード・ビースト ウォルフ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%D3%A1%BC%A5%B9%A5%C8%20%A5%A6%A5%A9%A5%EB%A5%D5%A1%D5",wikiTextAll:`特殊召喚・効果モンスター
星４/光属性/獣戦士族/攻2100/守 300
このカードは通常召喚できず、カードの効果でのみ特殊召喚できる。
(1)：このカードがデッキから墓地へ送られた場合に発動する。
このカードを特殊召喚する。`,nameTags:["ライトロード"],canReborn:!0},"ライトロード・シーフ ライニャン":{name:"ライトロード・シーフ ライニャン",nameKana:"",description:`リバース：自分の墓地に存在する「ライトロード」と名のついた
モンスター１体を選択してデッキに戻し、
自分のデッキからカードを１枚ドローする。`,pendulumDescription:"",kind:"Monster",monsterCategories:["FlipEffect","Effect"],level:2,attack:100,defense:100,attribute:"Light",type:"Beast",wikiName:"《ライトロード・シーフ ライニャン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%B7%A1%BC%A5%D5%20%A5%E9%A5%A4%A5%CB%A5%E3%A5%F3%A1%D5",wikiTextAll:`効果モンスター
星２/光属性/獣族/攻 100/守 100
リバース：自分の墓地に存在する「ライトロード」と名のついた
モンスター１体を選択してデッキに戻し、
自分のデッキからカードを１枚ドローする。`,nameTags:["ライトロード"]},"ライトロード・ハンター ライコウ":{name:"ライトロード・ハンター ライコウ",nameKana:"",description:`(1)：このカードがリバースした場合に発動する。
フィールドのカード１枚を選んで破壊できる。
自分のデッキの上からカードを３枚墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["FlipEffect","Effect"],level:2,attack:200,defense:100,attribute:"Light",type:"Beast",wikiName:"《ライトロード・ハンター ライコウ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%CF%A5%F3%A5%BF%A1%BC%20%A5%E9%A5%A4%A5%B3%A5%A6%A1%D5",wikiTextAll:`リバース・効果モンスター
星２/光属性/獣族/攻 200/守 100
(1)：このカードがリバースした場合に発動する。
フィールドのカード１枚を選んで破壊できる。
自分のデッキの上からカードを３枚墓地へ送る。`,nameTags:["ライトロード"]},"ライトロード・アサシン ライデン":{name:"ライトロード・アサシン ライデン",nameKana:"",description:`このカード名の(1)の効果は１ターンに１度しか使用できない。
(1)：自分メインフェイズに発動できる。
自分のデッキの上からカードを２枚墓地へ送る。
その中に「ライトロード」モンスターがあった場合、
さらにこのカードの攻撃力は相手ターン終了時まで２００アップする。
(2)：自分エンドフェイズに発動する。
自分のデッキの上からカードを２枚墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Tuner","Effect"],level:4,attack:1700,defense:1e3,attribute:"Light",type:"Warrior",wikiName:"《ライトロード・アサシン ライデン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%A2%A5%B5%A5%B7%A5%F3%20%A5%E9%A5%A4%A5%C7%A5%F3%A1%D5",wikiTextAll:`チューナー・効果モンスター
星４/光属性/戦士族/攻1700/守1000
このカード名の(1)の効果は１ターンに１度しか使用できない。
(1)：自分メインフェイズに発動できる。
自分のデッキの上からカードを２枚墓地へ送る。
その中に「ライトロード」モンスターがあった場合、
さらにこのカードの攻撃力は相手ターン終了時まで２００アップする。
(2)：自分エンドフェイズに発動する。
自分のデッキの上からカードを２枚墓地へ送る。`,nameTags:["ライトロード"]},"ライトロード・デーモン ヴァイス":{name:"ライトロード・デーモン ヴァイス",nameKana:"",description:`このカード名の(1)(2)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：手札から他の「ライトロード」カード１枚をデッキの一番上に戻して発動できる。
このカードを手札から特殊召喚する。
その後、自分のデッキの上からカードを２枚墓地へ送る。
(2)：このカードがデッキから墓地へ送られた場合、
「ライトロード・デーモン ヴァイス」以外の自分の墓地の「ライトロード」モンスター１体を対象として発動できる。
そのモンスターを特殊召喚する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Tuner","Effect"],level:4,defense:1700,attribute:"Light",type:"Fiend",wikiName:"《ライトロード・デーモン ヴァイス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%C7%A1%BC%A5%E2%A5%F3%20%A5%F4%A5%A1%A5%A4%A5%B9%A1%D5",wikiTextAll:`チューナー・効果モンスター
星４/光属性/悪魔族/攻   0/守1700
このカード名の(1)(2)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：手札から他の「ライトロード」カード１枚をデッキの一番上に戻して発動できる。
このカードを手札から特殊召喚する。
その後、自分のデッキの上からカードを２枚墓地へ送る。
(2)：このカードがデッキから墓地へ送られた場合、
「ライトロード・デーモン ヴァイス」以外の自分の墓地の「ライトロード」モンスター１体を対象として発動できる。
そのモンスターを特殊召喚する。`,nameTags:["ライトロード"],attack:0},"ライトロード・メイデン ミネルバ":{name:"ライトロード・メイデン ミネルバ",nameKana:"",description:`(1)：このカードが召喚した時に発動できる。
自分の墓地の「ライトロード」モンスターの種類の数以下のレベルを持つ
ドラゴン族・光属性モンスター１体をデッキから手札に加える。
(2)：このカードが手札・デッキから墓地へ送られた場合に発動する。
自分のデッキの上からカードを１枚墓地へ送る。
(3)：自分エンドフェイズに発動する。
自分のデッキの上からカードを２枚墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Tuner","Effect"],level:3,attack:800,defense:200,attribute:"Light",type:"Spellcaster",wikiName:"《ライトロード・メイデン ミネルバ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%E1%A5%A4%A5%C7%A5%F3%20%A5%DF%A5%CD%A5%EB%A5%D0%A1%D5",wikiTextAll:`チューナー・効果モンスター
星３/光属性/魔法使い族/攻 800/守 200
(1)：このカードが召喚した時に発動できる。
自分の墓地の「ライトロード」モンスターの種類の数以下のレベルを持つ
ドラゴン族・光属性モンスター１体をデッキから手札に加える。
(2)：このカードが手札・デッキから墓地へ送られた場合に発動する。
自分のデッキの上からカードを１枚墓地へ送る。
(3)：自分エンドフェイズに発動する。
自分のデッキの上からカードを２枚墓地へ送る。`,nameTags:["ライトロード"]},"トワイライトロード・シャーマン ルミナス":{name:"トワイライトロード・シャーマン ルミナス",nameKana:"",description:`(1)：１ターンに１度、自分の手札・墓地から「ライトロード」モンスター１体を除外し、
「トワイライトロード・シャーマン ルミナス」以外の自分の除外状態の「ライトロード」モンスター１体を対象として発動できる。
そのモンスターを特殊召喚する。
(2)：１ターンに１度、他の自分の「ライトロード」モンスターの効果が発動した場合に発動する。
自分のデッキの上からカードを３枚墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:3,attack:1e3,defense:1e3,attribute:"Dark",type:"Spellcaster",wikiName:"《トワイライトロード・シャーマン ルミナス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A5%EF%A5%A4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%B7%A5%E3%A1%BC%A5%DE%A5%F3%20%A5%EB%A5%DF%A5%CA%A5%B9%A1%D5",wikiTextAll:`効果モンスター
星３/闇属性/魔法使い族/攻1000/守1000
(1)：１ターンに１度、自分の手札・墓地から「ライトロード」モンスター１体を除外し、
「トワイライトロード・シャーマン ルミナス」以外の自分の除外状態の「ライトロード」モンスター１体を対象として発動できる。
そのモンスターを特殊召喚する。
(2)：１ターンに１度、他の自分の「ライトロード」モンスターの効果が発動した場合に発動する。
自分のデッキの上からカードを３枚墓地へ送る。`,nameTags:["ライトロード"]},"トワイライトロード・ジェネラル ジェイン":{name:"トワイライトロード・ジェネラル ジェイン",nameKana:"",description:`(1)：１ターンに１度、自分の手札・墓地から「ライトロード」モンスター１体を除外し、
フィールドの表側表示モンスター１体を対象として発動できる。
そのモンスターの攻撃力・守備力はターン終了時まで、
除外したモンスターのレベル×３００ダウンする。
(2)：１ターンに１度、このカード以外の自分の「ライトロード」モンスターの効果が発動した場合に発動する。
自分のデッキの上からカードを２枚墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1800,defense:1200,attribute:"Dark",type:"Warrior",wikiName:"《トワイライトロード・ジェネラル ジェイン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A5%EF%A5%A4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%B8%A5%A7%A5%CD%A5%E9%A5%EB%20%A5%B8%A5%A7%A5%A4%A5%F3%A1%D5",wikiTextAll:`効果モンスター
星４/闇属性/戦士族/攻1800/守1200
(1)：１ターンに１度、自分の手札・墓地から「ライトロード」モンスター１体を除外し、
フィールドの表側表示モンスター１体を対象として発動できる。
そのモンスターの攻撃力・守備力はターン終了時まで、
除外したモンスターのレベル×３００ダウンする。
(2)：１ターンに１度、このカード以外の自分の「ライトロード」モンスターの効果が発動した場合に発動する。
自分のデッキの上からカードを２枚墓地へ送る。`,nameTags:["ライトロード"]},"トワイライトロード・ソーサラー ライラ":{name:"トワイライトロード・ソーサラー ライラ",nameKana:"",description:`(1)：１ターンに１度、魔法・罠カードの効果が発動した時、
自分の手札・墓地から「ライトロード」モンスター１体を除外し、フィールドの表側表示の魔法・罠カード１枚を対象として発動できる。
そのカードを破壊する。
(2)：１ターンに１度、このカード以外の自分の「ライトロード」モンスターの効果が発動した場合に発動する。
自分のデッキの上からカードを３枚墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1700,defense:200,attribute:"Dark",type:"Spellcaster",wikiName:"《トワイライトロード・ソーサラー ライラ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A5%EF%A5%A4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%BD%A1%BC%A5%B5%A5%E9%A1%BC%20%A5%E9%A5%A4%A5%E9%A1%D5",wikiTextAll:`効果モンスター
星４/闇属性/魔法使い族/攻1700/守 200
(1)：１ターンに１度、魔法・罠カードの効果が発動した時、
自分の手札・墓地から「ライトロード」モンスター１体を除外し、フィールドの表側表示の魔法・罠カード１枚を対象として発動できる。
そのカードを破壊する。
(2)：１ターンに１度、このカード以外の自分の「ライトロード」モンスターの効果が発動した場合に発動する。
自分のデッキの上からカードを３枚墓地へ送る。`,nameTags:["ライトロード"]},"トワイライトロード・ファイター ライコウ":{name:"トワイライトロード・ファイター ライコウ",nameKana:"",description:`(1)：このカードが召喚・リバースした場合、自分の手札・墓地から「ライトロード」モンスター１体を除外して発動できる。
フィールドのカード１枚を選んで除外する。
(2)：１ターンに１度、このカード以外の自分の「ライトロード」モンスターの効果が発動した場合に発動する。
自分のデッキの上からカードを３枚墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:2,attack:200,defense:100,attribute:"Dark",type:"Beast",wikiName:"《トワイライトロード・ファイター ライコウ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A5%EF%A5%A4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%D5%A5%A1%A5%A4%A5%BF%A1%BC%20%A5%E9%A5%A4%A5%B3%A5%A6%A1%D5",wikiTextAll:`効果モンスター
星２/闇属性/獣族/攻 200/守 100
(1)：このカードが召喚・リバースした場合、自分の手札・墓地から「ライトロード」モンスター１体を除外して発動できる。
フィールドのカード１枚を選んで除外する。
(2)：１ターンに１度、このカード以外の自分の「ライトロード」モンスターの効果が発動した場合に発動する。
自分のデッキの上からカードを３枚墓地へ送る。`,nameTags:["ライトロード"]},"ライトロード・アテナ ミネルバ":{name:"ライトロード・アテナ ミネルバ",nameKana:"",description:`チューナー＋チューナー以外のモンスター１体以上
このカード名の(1)(3)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：このカードがＳ召喚した場合に発動できる。
そのＳ素材とした「ライトロード」モンスターの数まで、
デッキから「ライトロード」モンスターを墓地へ送る（同じ種族は１体まで）。
(2)：自分フィールドの「ライトロード」モンスターは効果では除外できない。
(3)：自分の墓地から「ライトロード」モンスターを４体まで除外して発動できる。
除外した数だけ自分のデッキの上からカードを墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:8,attack:2800,defense:1800,attribute:"Light",type:"Fairy",wikiName:"《ライトロード・アテナ ミネルバ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%A2%A5%C6%A5%CA%20%A5%DF%A5%CD%A5%EB%A5%D0%A1%D5",wikiTextAll:`シンクロ・効果モンスター
星８/光属性/天使族/攻2800/守1800
チューナー＋チューナー以外のモンスター１体以上
このカード名の(1)(3)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：このカードがＳ召喚した場合に発動できる。
そのＳ素材とした「ライトロード」モンスターの数まで、
デッキから「ライトロード」モンスターを墓地へ送る（同じ種族は１体まで）。
(2)：自分フィールドの「ライトロード」モンスターは効果では除外できない。
(3)：自分の墓地から「ライトロード」モンスターを４体まで除外して発動できる。
除外した数だけ自分のデッキの上からカードを墓地へ送る。`,nameTags:["ライトロード"]},"ライトロード・ウォリアー ガロス":{name:"ライトロード・ウォリアー ガロス",nameKana:"",description:`「ライトロード・ウォリアー ガロス」以外の
自分フィールド上の「ライトロード」と名のついたモンスターの効果によって
自分のデッキからカードが墓地へ送られた場合、
自分のデッキの上からカードを２枚墓地へ送る。
その後、この効果で墓地へ送られた「ライトロード」と名のついたモンスターの数だけ
デッキからカードをドローする。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1850,defense:1300,attribute:"Light",type:"Warrior",wikiName:"《ライトロード・ウォリアー ガロス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%A6%A5%A9%A5%EA%A5%A2%A1%BC%20%A5%AC%A5%ED%A5%B9%A1%D5",wikiTextAll:`効果モンスター
星４/光属性/戦士族/攻1850/守1300
「ライトロード・ウォリアー ガロス」以外の
自分フィールド上の「ライトロード」と名のついたモンスターの効果によって
自分のデッキからカードが墓地へ送られた場合、
自分のデッキの上からカードを２枚墓地へ送る。
その後、この効果で墓地へ送られた「ライトロード」と名のついたモンスターの数だけ
デッキからカードをドローする。`,nameTags:["ライトロード"]},"ライトロード・エンジェル ケルビム":{name:"ライトロード・エンジェル ケルビム",nameKana:"",description:`「ライトロード」と名のついたモンスターをリリースして
このカードのアドバンス召喚に成功した時、
自分のデッキの上からカードを４枚墓地へ送って発動できる。
相手フィールド上のカードを２枚まで選択して破壊する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:5,attack:2300,defense:200,attribute:"Light",type:"Fairy",wikiName:"《ライトロード・エンジェル ケルビム》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%A8%A5%F3%A5%B8%A5%A7%A5%EB%20%A5%B1%A5%EB%A5%D3%A5%E0%A1%D5",wikiTextAll:`効果モンスター
星５/光属性/天使族/攻2300/守 200
「ライトロード」と名のついたモンスターをリリースして
このカードのアドバンス召喚に成功した時、
自分のデッキの上からカードを４枚墓地へ送って発動できる。
相手フィールド上のカードを２枚まで選択して破壊する。`,nameTags:["ライトロード"]},"ライトロード・サモナー ルミナス":{name:"ライトロード・サモナー ルミナス",nameKana:"",description:`(1)：１ターンに１度、手札を１枚捨て、
自分の墓地のレベル４以下の「ライトロード」モンスター１体を対象として発動できる。
そのモンスターを特殊召喚する。
(2)：自分エンドフェイズに発動する。
自分のデッキの上からカードを３枚墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:3,attack:1e3,defense:1e3,attribute:"Light",type:"Spellcaster",wikiName:"《ライトロード・サモナー ルミナス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%B5%A5%E2%A5%CA%A1%BC%20%A5%EB%A5%DF%A5%CA%A5%B9%A1%D5",wikiTextAll:`効果モンスター
星３/光属性/魔法使い族/攻1000/守1000
(1)：１ターンに１度、手札を１枚捨て、
自分の墓地のレベル４以下の「ライトロード」モンスター１体を対象として発動できる。
そのモンスターを特殊召喚する。
(2)：自分エンドフェイズに発動する。
自分のデッキの上からカードを３枚墓地へ送る。`,nameTags:["ライトロード"]},"ライトロード・スピリット シャイア":{name:"ライトロード・スピリット シャイア",nameKana:"",description:`このカードの攻撃力は、自分の墓地に存在する
「ライトロード」と名のついたモンスターの種類×３００ポイントアップする。
このカードが自分フィールド上に表側表示で存在する限り、
自分のエンドフェイズ毎に、自分のデッキの上からカードを２枚墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:3,attack:400,defense:1400,attribute:"Light",type:"Fairy",wikiName:"《ライトロード・スピリット シャイア》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%B9%A5%D4%A5%EA%A5%C3%A5%C8%20%A5%B7%A5%E3%A5%A4%A5%A2%A1%D5",wikiTextAll:`効果モンスター
星３/光属性/天使族/攻 400/守1400
このカードの攻撃力は、自分の墓地に存在する
「ライトロード」と名のついたモンスターの種類×３００ポイントアップする。
このカードが自分フィールド上に表側表示で存在する限り、
自分のエンドフェイズ毎に、自分のデッキの上からカードを２枚墓地へ送る。`,nameTags:["ライトロード"]},"ライトロード・ドラゴン グラゴニス":{name:"ライトロード・ドラゴン グラゴニス",nameKana:"",description:`このカードの攻撃力・守備力は、自分の墓地の
「ライトロード」と名のついたモンスターの種類×３００ポイントアップする。
このカードが守備表示モンスターを攻撃した時、
その守備力を攻撃力が超えていれば、
その数値だけ相手ライフに戦闘ダメージを与える。
また、自分のエンドフェイズ毎に発動する。
自分のデッキの上からカードを３枚墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:6,attack:2e3,defense:1600,attribute:"Light",type:"Dragon",wikiName:"《ライトロード・ドラゴン グラゴニス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%20%A5%B0%A5%E9%A5%B4%A5%CB%A5%B9%A1%D5",wikiTextAll:`効果モンスター
星６/光属性/ドラゴン族/攻2000/守1600
このカードの攻撃力・守備力は、自分の墓地の
「ライトロード」と名のついたモンスターの種類×３００ポイントアップする。
このカードが守備表示モンスターを攻撃した時、
その守備力を攻撃力が超えていれば、
その数値だけ相手ライフに戦闘ダメージを与える。
また、自分のエンドフェイズ毎に発動する。
自分のデッキの上からカードを３枚墓地へ送る。`,nameTags:["ライトロード"]},"ライトロード・ドルイド オルクス":{name:"ライトロード・ドルイド オルクス",nameKana:"",description:`このカードがフィールド上に表側表示で存在する限り、
お互いのプレイヤーは「ライトロード」と名のついたモンスターを
魔法・罠・効果モンスターの効果の対象にできない。
また、自分のエンドフェイズ毎に発動する。
自分のデッキの上からカードを２枚墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:3,attack:1200,defense:1800,attribute:"Light",type:"BeastWarrior",wikiName:"《ライトロード・ドルイド オルクス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%C9%A5%EB%A5%A4%A5%C9%20%A5%AA%A5%EB%A5%AF%A5%B9%A1%D5",wikiTextAll:`効果モンスター
星３/光属性/獣戦士族/攻1200/守1800
このカードがフィールド上に表側表示で存在する限り、
お互いのプレイヤーは「ライトロード」と名のついたモンスターを
魔法・罠・効果モンスターの効果の対象にできない。
また、自分のエンドフェイズ毎に発動する。
自分のデッキの上からカードを２枚墓地へ送る。`,nameTags:["ライトロード"]},"ライトロード・パラディン ジェイン":{name:"ライトロード・パラディン ジェイン",nameKana:"",description:`(1)：このカードが相手モンスターに攻撃するダメージステップの間、
このカードの攻撃力は３００アップする。
(2)：自分エンドフェイズに発動する。
自分のデッキの上からカードを２枚墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1800,defense:1200,attribute:"Light",type:"Warrior",wikiName:"《ライトロード・パラディン ジェイン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%D1%A5%E9%A5%C7%A5%A3%A5%F3%20%A5%B8%A5%A7%A5%A4%A5%F3%A1%D5",wikiTextAll:`効果モンスター
星４/光属性/戦士族/攻1800/守1200
(1)：このカードが相手モンスターに攻撃するダメージステップの間、
このカードの攻撃力は３００アップする。
(2)：自分エンドフェイズに発動する。
自分のデッキの上からカードを２枚墓地へ送る。`,nameTags:["ライトロード"]},"ライトロード・プリースト ジェニス":{name:"ライトロード・プリースト ジェニス",nameKana:"",description:`「ライトロード」と名のついたカードの効果によって
自分のデッキからカードが墓地へ送られたターンのエンドフェイズ時、
相手ライフに５００ポイントダメージを与え、自分は５００ライフポイント回復する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:300,defense:2100,attribute:"Light",type:"Spellcaster",wikiName:"《ライトロード・プリースト ジェニス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%D7%A5%EA%A1%BC%A5%B9%A5%C8%20%A5%B8%A5%A7%A5%CB%A5%B9%A1%D5",wikiTextAll:`効果モンスター
星４/光属性/魔法使い族/攻 300/守2100
「ライトロード」と名のついたカードの効果によって
自分のデッキからカードが墓地へ送られたターンのエンドフェイズ時、
相手ライフに５００ポイントダメージを与え、自分は５００ライフポイント回復する。`,nameTags:["ライトロード"]},"ライトロード・マジシャン ライラ":{name:"ライトロード・マジシャン ライラ",nameKana:"",description:`(1)：相手フィールドの魔法・罠カード１枚を対象として発動できる。
自分フィールドの表側攻撃表示のこのカードを守備表示にし、対象の相手のカードを破壊する。
この効果の発動後、次の自分ターンの終了時までこのカードは表示形式を変更できない。
(2)：自分エンドフェイズに発動する。
自分のデッキの上からカードを３枚墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1700,defense:200,attribute:"Light",type:"Spellcaster",wikiName:"《ライトロード・マジシャン ライラ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%DE%A5%B8%A5%B7%A5%E3%A5%F3%20%A5%E9%A5%A4%A5%E9%A1%D5",wikiTextAll:`効果モンスター
星４/光属性/魔法使い族/攻1700/守 200
(1)：相手フィールドの魔法・罠カード１枚を対象として発動できる。
自分フィールドの表側攻撃表示のこのカードを守備表示にし、対象の相手のカードを破壊する。
この効果の発動後、次の自分ターンの終了時までこのカードは表示形式を変更できない。
(2)：自分エンドフェイズに発動する。
自分のデッキの上からカードを３枚墓地へ送る。`,nameTags:["ライトロード"]},"ライトロード・モンク エイリン":{name:"ライトロード・モンク エイリン",nameKana:"",description:`(1)：このカードが守備表示モンスターを攻撃したダメージ計算前に発動する。
そのモンスターを持ち主のデッキに戻す。
(2)：自分エンドフェイズに発動する。
自分のデッキの上からカードを３枚墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1600,defense:1e3,attribute:"Light",type:"Warrior",wikiName:"《ライトロード・モンク エイリン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%E2%A5%F3%A5%AF%20%A5%A8%A5%A4%A5%EA%A5%F3%A1%D5",wikiTextAll:`効果モンスター
星４/光属性/戦士族/攻1600/守1000
(1)：このカードが守備表示モンスターを攻撃したダメージ計算前に発動する。
そのモンスターを持ち主のデッキに戻す。
(2)：自分エンドフェイズに発動する。
自分のデッキの上からカードを３枚墓地へ送る。`,nameTags:["ライトロード"]},ライトロードの神域:{name:"ライトロードの神域",nameKana:"",description:`(1)：１ターンに１度、手札の「ライトロード」モンスター１体を墓地へ送り、
そのモンスター以外の自分の墓地の「ライトロード」モンスター１体を対象として発動できる。
対象のモンスターを手札に加える。
(2)：このカードが魔法＆罠ゾーンに存在する限り、
自分のデッキからカードが墓地へ送られる度に、
このカードにシャインカウンターを１つ置く。
(3)：自分フィールドの「ライトロード」カードが効果で破壊される場合、
代わりに自分フィールドのシャインカウンターを、
破壊される「ライトロード」カード１枚につき２つ取り除く事ができる。`,kind:"Spell",spellCategory:"Continuous",wikiName:"《ライトロードの神域》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A4%CE%BF%C0%B0%E8%A1%D5",wikiTextAll:`永続魔法
(1)：１ターンに１度、手札の「ライトロード」モンスター１体を墓地へ送り、
そのモンスター以外の自分の墓地の「ライトロード」モンスター１体を対象として発動できる。
対象のモンスターを手札に加える。
(2)：このカードが魔法＆罠ゾーンに存在する限り、
自分のデッキからカードが墓地へ送られる度に、
このカードにシャインカウンターを１つ置く。
(3)：自分フィールドの「ライトロード」カードが効果で破壊される場合、
代わりに自分フィールドのシャインカウンターを、
破壊される「ライトロード」カード１枚につき２つ取り除く事ができる。`,nameTags:["ライトロード"]},"ライトロード・レイピア":{name:"ライトロード・レイピア",nameKana:"",description:`「ライトロード」と名のついたモンスターにのみ装備可能。
装備モンスターの攻撃力は７００ポイントアップする。
このカードがデッキから墓地に送られた時、
このカードを自分フィールド上に存在する「ライトロード」と名のついたモンスター１体に
装備する事ができる。`,kind:"Spell",spellCategory:"Equip",wikiName:"《ライトロード・レイピア》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%EC%A5%A4%A5%D4%A5%A2%A1%D5",wikiTextAll:`装備魔法
「ライトロード」と名のついたモンスターにのみ装備可能。
装備モンスターの攻撃力は７００ポイントアップする。
このカードがデッキから墓地に送られた時、
このカードを自分フィールド上に存在する「ライトロード」と名のついたモンスター１体に
装備する事ができる。`,nameTags:["ライトロード"]},"ライトロード・アイギス":{name:"ライトロード・アイギス",nameKana:"",description:`このカード名の(1)(2)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：自分フィールドの「ライトロード」モンスターの数まで、
相手フィールドの表側表示カードを対象として発動できる。
そのカードの効果をターン終了時まで無効にする。
(2)：このカードがデッキから墓地へ送られた場合に発動できる。
このカードを自分フィールドにセットする。`,kind:"Trap",trapCategory:"Normal",wikiName:"《ライトロード・アイギス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%A2%A5%A4%A5%AE%A5%B9%A1%D5",wikiTextAll:`通常罠
このカード名の(1)(2)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：自分フィールドの「ライトロード」モンスターの数まで、
相手フィールドの表側表示カードを対象として発動できる。
そのカードの効果をターン終了時まで無効にする。
(2)：このカードがデッキから墓地へ送られた場合に発動できる。
このカードを自分フィールドにセットする。`,nameTags:["ライトロード"]},ライトロードの裁き:{name:"ライトロードの裁き",nameKana:"",description:`(1)：このカードをデッキの一番上に戻す。
(2)：このカードが「ライトロード」モンスターの効果でデッキから墓地へ送られた場合に発動できる。
デッキから「裁きの龍」１体を手札に加える。`,kind:"Trap",trapCategory:"Normal",wikiName:"《ライトロードの裁き》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A4%CE%BA%DB%A4%AD%A1%D5",wikiTextAll:`通常罠
(1)：このカードをデッキの一番上に戻す。
(2)：このカードが「ライトロード」モンスターの効果でデッキから墓地へ送られた場合に発動できる。
デッキから「裁きの龍」１体を手札に加える。`,nameTags:["ライトロード"]},"ライトロード・バリア":{name:"ライトロード・バリア",nameKana:"",description:`自分フィールド上の「ライトロード」と名のついた
モンスターが攻撃対象に選択された時、
自分のデッキの上からカードを２枚墓地へ送る事で、
攻撃モンスター１体を選択し、その攻撃を無効にする。`,kind:"Trap",trapCategory:"Continuous",wikiName:"《ライトロード・バリア》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%D0%A5%EA%A5%A2%A1%D5",wikiTextAll:`永続罠
自分フィールド上の「ライトロード」と名のついた
モンスターが攻撃対象に選択された時、
自分のデッキの上からカードを２枚墓地へ送る事で、
攻撃モンスター１体を選択し、その攻撃を無効にする。`,nameTags:["ライトロード"]},光道の龍:{name:"光道の龍",nameKana:"",description:`このカード名の(1)(2)(3)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：自分の墓地に「ライトロード」モンスターが存在する場合に発動できる。
このカードを手札から特殊召喚する。
(2)：このカードが特殊召喚した場合に発動できる。
デッキから「光道の龍」以外の「ライトロード」カード１枚を墓地へ送る。
(3)：このカードが墓地へ送られた場合に発動できる。
デッキから攻撃力３０００／守備力２６００のドラゴン族モンスター１体を手札に加える。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1500,defense:1300,attribute:"Light",type:"Dragon",wikiName:"《光道の龍》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B8%F7%C6%BB%A4%CE%CE%B6%A1%D5",wikiTextAll:`効果モンスター
星４/光属性/ドラゴン族/攻1500/守1300
このカード名の(1)(2)(3)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：自分の墓地に「ライトロード」モンスターが存在する場合に発動できる。
このカードを手札から特殊召喚する。
(2)：このカードが特殊召喚した場合に発動できる。
デッキから「光道の龍」以外の「ライトロード」カード１枚を墓地へ送る。
(3)：このカードが墓地へ送られた場合に発動できる。
デッキから攻撃力３０００／守備力２６００のドラゴン族モンスター１体を手札に加える。`,nameTags:["ライトロード"]},光の援軍:{name:"光の援軍",nameKana:"",description:`(1)：自分のデッキの上からカードを３枚墓地へ送って発動できる。
デッキからレベル４以下の「ライトロード」モンスター１体を手札に加える。`,kind:"Spell",spellCategory:"Normal",wikiName:"《光の援軍》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B8%F7%A4%CE%B1%E7%B7%B3%A1%D5",wikiTextAll:`通常魔法
(1)：自分のデッキの上からカードを３枚墓地へ送って発動できる。
デッキからレベル４以下の「ライトロード」モンスター１体を手札に加える。`},"ソーラー・エクスチェンジ":{name:"ソーラー・エクスチェンジ",nameKana:"",description:`(1)：手札から「ライトロード」モンスター１体を捨てて発動できる。
自分は２枚ドローする。
その後、自分のデッキの上からカードを２枚墓地へ送る。`,kind:"Spell",spellCategory:"Normal",wikiName:"《ソーラー・エクスチェンジ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BD%A1%BC%A5%E9%A1%BC%A1%A6%A5%A8%A5%AF%A5%B9%A5%C1%A5%A7%A5%F3%A5%B8%A1%D5",wikiTextAll:`通常魔法
(1)：手札から「ライトロード」モンスター１体を捨てて発動できる。
自分は２枚ドローする。
その後、自分のデッキの上からカードを２枚墓地へ送る。`},"トレード・イン":{name:"トレード・イン",nameKana:"",description:"(1)：手札からレベル８モンスター１体を捨てて発動できる。自分は２枚ドローする。",kind:"Spell",spellCategory:"Normal",wikiName:"《トレード・イン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A5%EC%A1%BC%A5%C9%A1%A6%A5%A4%A5%F3%A1%D5",wikiTextAll:`通常魔法
(1)：手札からレベル８モンスター１体を捨てて発動できる。
自分は２枚ドローする。`},召喚師のスキル:{name:"召喚師のスキル",nameKana:"",description:"(1)：デッキからレベル５以上の通常モンスター１体を手札に加える。",kind:"Spell",spellCategory:"Normal",wikiName:"《召喚師のスキル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BE%A4%B4%AD%BB%D5%A4%CE%A5%B9%A5%AD%A5%EB%A1%D5",wikiTextAll:`通常魔法
(1)：デッキからレベル５以上の通常モンスター１体を手札に加える。`},大狼雷鳴:{name:"大狼雷鳴",nameKana:"",description:`このカードの効果を発動するターン、自分はバトルフェイズを行えない。
(1)：このカードが墓地からの特殊召喚に成功した場合に発動できる。
相手フィールドの表側表示モンスターを全て破壊する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:7,attack:2500,defense:2e3,attribute:"Light",type:"Thunder",wikiName:"《大狼雷鳴》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C2%E7%CF%B5%CD%EB%CC%C4%A1%D5",wikiTextAll:`効果モンスター
星７/光属性/雷族/攻2500/守2000
このカードの効果を発動するターン、自分はバトルフェイズを行えない。
(1)：このカードが墓地からの特殊召喚に成功した場合に発動できる。
相手フィールドの表側表示モンスターを全て破壊する。`},ゴブリンの秘薬:{name:"ゴブリンの秘薬",nameKana:"",description:"(1)：自分は６００ＬＰ回復する。",kind:"Spell",spellCategory:"Normal",wikiName:"《ゴブリンの秘薬》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B4%A5%D6%A5%EA%A5%F3%A4%CE%C8%EB%CC%F4%A1%D5",wikiTextAll:`通常魔法
(1)：自分は６００ＬＰ回復する。`},"ファイヤー・ボール":{name:"ファイヤー・ボール",nameKana:"",description:"(1)：相手に５００ダメージを与える。",kind:"Spell",spellCategory:"Normal",wikiName:"《ファイヤー・ボール》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D5%A5%A1%A5%A4%A5%E4%A1%BC%A1%A6%A5%DC%A1%BC%A5%EB%A1%D5",wikiTextAll:`通常魔法
(1)：相手に５００ダメージを与える。`},"ブルー・ポーション":{name:"ブルー・ポーション",nameKana:"",description:"(1)：自分は４００ＬＰ回復する。",kind:"Spell",spellCategory:"Normal",wikiName:"《ブルー・ポーション》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D6%A5%EB%A1%BC%A1%A6%A5%DD%A1%BC%A5%B7%A5%E7%A5%F3%A1%D5",wikiTextAll:`通常魔法
(1)：自分は４００ＬＰ回復する。`},"レッド・ポーション":{name:"レッド・ポーション",nameKana:"",description:"自分は５００ライフポイント回復する。",kind:"Spell",spellCategory:"Normal",wikiName:"《レッド・ポーション》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EC%A5%C3%A5%C9%A1%A6%A5%DD%A1%BC%A5%B7%A5%E7%A5%F3%A1%D5",wikiTextAll:`通常魔法
自分は５００ライフポイント回復する。`},火あぶりの刑:{name:"火あぶりの刑",nameKana:"",description:"相手ライフに６００ポイントダメージを与える。",kind:"Spell",spellCategory:"Normal",wikiName:"《火あぶりの刑》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B2%D0%A4%A2%A4%D6%A4%EA%A4%CE%B7%BA%A1%D5",wikiTextAll:`通常魔法
相手ライフに６００ポイントダメージを与える。`},火の粉:{name:"火の粉",nameKana:"",description:"相手ライフに２００ポイントダメージを与える。",kind:"Spell",spellCategory:"Normal",wikiName:"《火の粉》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B2%D0%A4%CE%CA%B4%A1%D5",wikiTextAll:`通常魔法
相手ライフに２００ポイントダメージを与える。`},火炎地獄:{name:"火炎地獄",nameKana:"",description:`相手ライフに１０００ポイントダメージを与え、
自分は５００ポイントダメージを受ける。`,kind:"Spell",spellCategory:"Normal",wikiName:"《火炎地獄》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B2%D0%B1%EA%C3%CF%B9%F6%A1%D5",wikiTextAll:`通常魔法
相手ライフに１０００ポイントダメージを与え、
自分は５００ポイントダメージを受ける。`},恵みの雨:{name:"恵みの雨",nameKana:"",description:"お互いのプレイヤーは１０００ライフポイント回復する。",kind:"Spell",spellCategory:"Normal",wikiName:"《恵みの雨》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B7%C3%A4%DF%A4%CE%B1%AB%A1%D5",wikiTextAll:`通常魔法
お互いのプレイヤーは１０００ライフポイント回復する。`},"治療の神 ディアン・ケト":{name:"治療の神 ディアン・ケト",nameKana:"",description:"(1)：自分は１０００ＬＰ回復する。",kind:"Spell",spellCategory:"Normal",wikiName:"《治療の神 ディアン・ケト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BC%A3%CE%C5%A4%CE%BF%C0%20%A5%C7%A5%A3%A5%A2%A5%F3%A1%A6%A5%B1%A5%C8%A1%D5",wikiTextAll:`通常魔法
(1)：自分は１０００ＬＰ回復する。`},昼夜の大火事:{name:"昼夜の大火事",nameKana:"",description:"相手ライフに８００ポイントダメージを与える。",kind:"Spell",spellCategory:"Normal",wikiName:"《昼夜の大火事》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C3%EB%CC%EB%A4%CE%C2%E7%B2%D0%BB%F6%A1%D5",wikiTextAll:`通常魔法
相手ライフに８００ポイントダメージを与える。`},天使の生き血:{name:"天使の生き血",nameKana:"",description:"自分は８００ライフポイント回復する。",kind:"Spell",spellCategory:"Normal",wikiName:"《天使の生き血》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C5%B7%BB%C8%A4%CE%C0%B8%A4%AD%B7%EC%A1%D5",wikiTextAll:`通常魔法
自分は８００ライフポイント回復する。`},盗人ゴブリン:{name:"盗人ゴブリン",nameKana:"",description:`(1)：相手に５００ダメージを与える。
自分は５００ＬＰ回復する。`,kind:"Spell",spellCategory:"Normal",wikiName:"《盗人ゴブリン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C5%F0%BF%CD%A5%B4%A5%D6%A5%EA%A5%F3%A1%D5",wikiTextAll:`通常魔法
(1)：相手に５００ダメージを与える。
自分は５００ＬＰ回復する。`},雷鳴:{name:"雷鳴",nameKana:"",description:"相手ライフに３００ポイントダメージを与える。",kind:"Spell",spellCategory:"Normal",wikiName:"《雷鳴》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CD%EB%CC%C4%A1%D5",wikiTextAll:`通常魔法
相手ライフに３００ポイントダメージを与える。`},調律の魔術師:{name:"調律の魔術師",nameKana:"",description:`「調律の魔術師」の(1)の効果は１ターンに１度しか使用できない。
(1)：このカードが手札・墓地に存在し、
自分のＰゾーンに「魔術師」カードが２枚存在する場合に発動できる。
このカードを特殊召喚する。
この効果で特殊召喚したこのカードは、フィールドから離れた場合に除外される。
(2)：このカードが召喚・特殊召喚に成功した場合に発動する。
相手は４００ＬＰ回復し、その後自分は４００ダメージを受ける。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Tuner","Effect"],level:1,attribute:"Dark",type:"Spellcaster",wikiName:"《調律の魔術師》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C4%B4%CE%A7%A4%CE%CB%E2%BD%D1%BB%D5%A1%D5",wikiTextAll:`チューナー・効果モンスター
星１/闇属性/魔法使い族/攻   0/守   0
「調律の魔術師」の(1)の効果は１ターンに１度しか使用できない。
(1)：このカードが手札・墓地に存在し、
自分のＰゾーンに「魔術師」カードが２枚存在する場合に発動できる。
このカードを特殊召喚する。
この効果で特殊召喚したこのカードは、フィールドから離れた場合に除外される。
(2)：このカードが召喚・特殊召喚に成功した場合に発動する。
相手は４００ＬＰ回復し、その後自分は４００ダメージを受ける。`,attack:0,defense:0},トゥーンのもくじ:{name:"トゥーンのもくじ",nameKana:"",description:"(1)：デッキから「トゥーン」カード１枚を手札に加える。",kind:"Spell",spellCategory:"Normal",wikiName:"《トゥーンのもくじ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A5%A5%A1%BC%A5%F3%A4%CE%A4%E2%A4%AF%A4%B8%A1%D5",wikiTextAll:`通常魔法
(1)：デッキから「トゥーン」カード１枚を手札に加える。`,nameTags:["トゥーン"]},紫炎の狼煙:{name:"紫炎の狼煙",nameKana:"",description:"(1)：デッキからレベル３以下の「六武衆」モンスター１体を手札に加える。 ",kind:"Spell",spellCategory:"Normal",wikiName:"《紫炎の狼煙》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BB%E7%B1%EA%A4%CE%CF%B5%B1%EC%A1%D5",wikiTextAll:`通常魔法
(1)：デッキからレベル３以下の「六武衆」モンスター１体を手札に加える。 `},調律:{name:"調律",nameKana:"",description:`(1)：デッキから「シンクロン」チューナー１体を手札に加える。
その後、自分のデッキの一番上のカードを墓地へ送る。`,kind:"Spell",spellCategory:"Normal",wikiName:"《調律》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C4%B4%CE%A7%A1%D5",wikiTextAll:`通常魔法
(1)：デッキから「シンクロン」チューナー１体を手札に加える。
その後、自分のデッキの一番上のカードを墓地へ送る。`},虹の架け橋:{name:"虹の架け橋",nameKana:"",description:"(1)：デッキから「宝玉」魔法・罠カード１枚を手札に加える。",kind:"Spell",spellCategory:"Normal",wikiName:"《虹の架け橋》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C6%FA%A4%CE%B2%CD%A4%B1%B6%B6%A1%D5",wikiTextAll:`通常魔法
(1)：デッキから「宝玉」魔法・罠カード１枚を手札に加える。`},融合賢者:{name:"融合賢者",nameKana:"",description:"自分のデッキから「融合」魔法カード１枚を手札に加える。",kind:"Spell",spellCategory:"Normal",wikiName:"《融合賢者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CD%BB%B9%E7%B8%AD%BC%D4%A1%D5",wikiTextAll:`通常魔法
自分のデッキから「融合」魔法カード１枚を手札に加える。`},調律師の陰謀:{name:"調律師の陰謀",nameKana:"",description:`相手フィールド上にシンクロモンスターが特殊召喚された時に発動する事ができる。
そのシンクロモンスター１体のコントロールを得る。
この効果でコントロールを得たモンスターは破壊された場合ゲームから除外される。
そのモンスターがフィールド上に存在しなくなった時、このカードを破壊する。`,kind:"Trap",trapCategory:"Continuous",wikiName:"《調律師の陰謀》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C4%B4%CE%A7%BB%D5%A4%CE%B1%A2%CB%C5%A1%D5",wikiTextAll:`永続罠
相手フィールド上にシンクロモンスターが特殊召喚された時に発動する事ができる。
そのシンクロモンスター１体のコントロールを得る。
この効果でコントロールを得たモンスターは破壊された場合ゲームから除外される。
そのモンスターがフィールド上に存在しなくなった時、このカードを破壊する。`},簡易融合:{name:"簡易融合",nameKana:"",description:`このカード名のカードは１ターンに１枚しか発動できない。
(1)：１０００ＬＰを払って発動できる。
レベル５以下の融合モンスター１体を融合召喚扱いとしてＥＸデッキから特殊召喚する。
この効果で特殊召喚したモンスターは攻撃できず、エンドフェイズに破壊される。`,kind:"Spell",spellCategory:"Normal",wikiName:"《簡易融合》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B4%CA%B0%D7%CD%BB%B9%E7%A1%D5",wikiTextAll:`通常魔法
このカード名のカードは１ターンに１枚しか発動できない。
(1)：１０００ＬＰを払って発動できる。
レベル５以下の融合モンスター１体を融合召喚扱いとしてＥＸデッキから特殊召喚する。
この効果で特殊召喚したモンスターは攻撃できず、エンドフェイズに破壊される。`},"テラ・フォーミング":{name:"テラ・フォーミング",nameKana:"",description:"(1)：デッキからフィールド魔法カード１枚を手札に加える。",kind:"Spell",spellCategory:"Normal",wikiName:"《テラ・フォーミング》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C6%A5%E9%A1%A6%A5%D5%A5%A9%A1%BC%A5%DF%A5%F3%A5%B0%A1%D5",wikiTextAll:`通常魔法
(1)：デッキからフィールド魔法カード１枚を手札に加える。`},"コール・リゾネーター":{name:"コール・リゾネーター",nameKana:"",description:"(1)：デッキから「リゾネーター」モンスター１体を手札に加える。",kind:"Spell",spellCategory:"Normal",wikiName:"《コール・リゾネーター》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B3%A1%BC%A5%EB%A1%A6%A5%EA%A5%BE%A5%CD%A1%BC%A5%BF%A1%BC%A1%D5",wikiTextAll:`通常魔法
(1)：デッキから「リゾネーター」モンスター１体を手札に加える。`},"デステニー・ドロー":{name:"デステニー・ドロー",nameKana:"",description:`(1)：手札から「Ｄ－ＨＥＲＯ」カード１枚を捨てて発動できる。
自分はデッキから２枚ドローする。`,kind:"Spell",spellCategory:"Normal",wikiName:"《デステニー・ドロー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C7%A5%B9%A5%C6%A5%CB%A1%BC%A1%A6%A5%C9%A5%ED%A1%BC%A1%D5",wikiTextAll:`通常魔法
(1)：手札から「Ｄ－ＨＥＲＯ」カード１枚を捨てて発動できる。
自分はデッキから２枚ドローする。`},調和の宝札:{name:"調和の宝札",nameKana:"",description:`(1)：手札から攻撃力１０００以下のドラゴン族チューナー１体を捨てて発動できる。
自分はデッキから２枚ドローする。`,kind:"Spell",spellCategory:"Normal",wikiName:"《調和の宝札》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C4%B4%CF%C2%A4%CE%CA%F5%BB%A5%A1%D5",wikiTextAll:`通常魔法
(1)：手札から攻撃力１０００以下のドラゴン族チューナー１体を捨てて発動できる。
自分はデッキから２枚ドローする。`},"Ｄ－ＨＥＲＯ ディアボリックガイ":{name:"Ｄ－ＨＥＲＯ ディアボリックガイ",nameKana:"",description:`(1)：墓地のこのカードを除外して発動できる。
デッキから「Ｄ－ＨＥＲＯ ディアボリックガイ」１体を特殊召喚する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:6,attack:800,defense:800,attribute:"Dark",type:"Warrior",wikiName:"《Ｄ－ＨＥＲＯ ディアボリックガイ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%C4%A1%DD%A3%C8%A3%C5%A3%D2%A3%CF%20%A5%C7%A5%A3%A5%A2%A5%DC%A5%EA%A5%C3%A5%AF%A5%AC%A5%A4%A1%D5",wikiTextAll:`効果モンスター
星６/闇属性/戦士族/攻 800/守 800
(1)：墓地のこのカードを除外して発動できる。
デッキから「Ｄ－ＨＥＲＯ ディアボリックガイ」１体を特殊召喚する。`,nameTags:["Ｄ－ＨＥＲＯ","ＨＥＲＯ"]},"サルベージ・ウォリアー":{name:"サルベージ・ウォリアー",nameKana:"",description:`このカードがアドバンス召喚に成功した時、
手札または自分の墓地からチューナー１体を特殊召喚する事ができる。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:5,attack:1900,defense:1600,attribute:"Water",type:"Warrior",wikiName:"《サルベージ・ウォリアー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%EB%A5%D9%A1%BC%A5%B8%A1%A6%A5%A6%A5%A9%A5%EA%A5%A2%A1%BC%A1%D5",wikiTextAll:`効果モンスター
星５/水属性/戦士族/攻1900/守1600
このカードがアドバンス召喚に成功した時、
手札または自分の墓地からチューナー１体を特殊召喚する事ができる。`},"サルベージェント・ドライバー":{name:"サルベージェント・ドライバー",nameKana:"",description:`このカード名の(1)(2)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：このカードが手札・墓地に存在し、
自分フィールドのサイバース族リンクモンスターが相手の効果によって破壊された場合に発動できる。
このカードを特殊召喚する。
(2)：手札から魔法カード１枚を捨て、
自分の墓地のサイバース族モンスター１体を対象として発動できる。
そのモンスターを特殊召喚する。
この効果で特殊召喚したモンスターはこのターン直接攻撃できない。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:6,attack:2200,defense:2100,attribute:"Light",type:"Cyberse",wikiName:"《サルベージェント・ドライバー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%EB%A5%D9%A1%BC%A5%B8%A5%A7%A5%F3%A5%C8%A1%A6%A5%C9%A5%E9%A5%A4%A5%D0%A1%BC%A1%D5",wikiTextAll:`効果モンスター
星６/光属性/サイバース族/攻2200/守2100
このカード名の(1)(2)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：このカードが手札・墓地に存在し、
自分フィールドのサイバース族リンクモンスターが相手の効果によって破壊された場合に発動できる。
このカードを特殊召喚する。
(2)：手札から魔法カード１枚を捨て、
自分の墓地のサイバース族モンスター１体を対象として発動できる。
そのモンスターを特殊召喚する。
この効果で特殊召喚したモンスターはこのターン直接攻撃できない。`},サルベージ:{name:"サルベージ",nameKana:"",description:`(1)：自分の墓地の攻撃力１５００以下の水属性モンスター２体を対象として発動できる。
その水属性モンスターを手札に加える。`,kind:"Spell",spellCategory:"Normal",wikiName:"《サルベージ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%EB%A5%D9%A1%BC%A5%B8%A1%D5",wikiTextAll:`通常魔法
(1)：自分の墓地の攻撃力１５００以下の水属性モンスター２体を対象として発動できる。
その水属性モンスターを手札に加える。`},バッテリーリサイクル:{name:"バッテリーリサイクル",nameKana:"",description:`(1)：自分の墓地の攻撃力１５００以下の雷族モンスター２体を対象として発動できる。
その雷族モンスターを手札に加える。`,kind:"Spell",spellCategory:"Normal",wikiName:"《バッテリーリサイクル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%D0%A5%C3%A5%C6%A5%EA%A1%BC%A5%EA%A5%B5%A5%A4%A5%AF%A5%EB%A1%D5",wikiTextAll:`通常魔法
(1)：自分の墓地の攻撃力１５００以下の雷族モンスター２体を対象として発動できる。
その雷族モンスターを手札に加える。`},悪夢再び:{name:"悪夢再び",nameKana:"",description:`(1)：自分の墓地の守備力０の闇属性モンスター２体を対象として発動できる。
その闇属性モンスターを手札に加える。`,kind:"Spell",spellCategory:"Normal",wikiName:"《悪夢再び》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%AD%CC%B4%BA%C6%A4%D3%A1%D5",wikiTextAll:`通常魔法
(1)：自分の墓地の守備力０の闇属性モンスター２体を対象として発動できる。
その闇属性モンスターを手札に加える。`},闇の量産工場:{name:"闇の量産工場",nameKana:"",description:`(1)：自分の墓地の通常モンスター２体を対象として発動できる。
そのモンスターを手札に加える。`,kind:"Spell",spellCategory:"Normal",wikiName:"《闇の量産工場》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%C7%A4%CE%CE%CC%BB%BA%B9%A9%BE%EC%A1%D5",wikiTextAll:`通常魔法
(1)：自分の墓地の通常モンスター２体を対象として発動できる。
そのモンスターを手札に加える。`},戦士の生還:{name:"戦士の生還",nameKana:"",description:`(1)：自分の墓地の戦士族モンスター１体を対象として発動できる。
その戦士族モンスターを手札に加える。`,kind:"Spell",spellCategory:"Normal",wikiName:"《戦士の生還》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%EF%BB%CE%A4%CE%C0%B8%B4%D4%A1%D5",wikiTextAll:`通常魔法
(1)：自分の墓地の戦士族モンスター１体を対象として発動できる。
その戦士族モンスターを手札に加える。`},暗黒よりの軍勢:{name:"暗黒よりの軍勢",nameKana:"",description:`(1)：自分の墓地の「暗黒界」モンスター２体を対象として発動できる。
そのモンスターを手札に加える。`,kind:"Trap",trapCategory:"Normal",wikiName:"《暗黒よりの軍勢》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%C5%B9%F5%A4%E8%A4%EA%A4%CE%B7%B3%C0%AA%A1%D5",wikiTextAll:`通常罠
(1)：自分の墓地の「暗黒界」モンスター２体を対象として発動できる。
そのモンスターを手札に加える。`},伝説の白石:{name:"伝説の白石",nameKana:"",description:`(1)：このカードが墓地へ送られた場合に発動する。
デッキから「青眼の白龍」１体を手札に加える。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Tuner","Effect"],level:1,attack:300,defense:250,attribute:"Light",type:"Dragon",wikiName:"《伝説の白石》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C5%C1%C0%E2%A4%CE%C7%F2%C0%D0%A1%D5",wikiTextAll:`チューナー・効果モンスター
星１/光属性/ドラゴン族/攻 300/守 250
(1)：このカードが墓地へ送られた場合に発動する。
デッキから「青眼の白龍」１体を手札に加える。`},強欲で貪欲な壺:{name:"強欲で貪欲な壺",nameKana:"",description:`このカード名のカードは１ターンに１枚しか発動できない。
(1)：自分のデッキの上からカード１０枚を裏側表示で除外して発動できる。
自分はデッキから２枚ドローする。`,kind:"Spell",spellCategory:"Normal",wikiName:"《強欲で貪欲な壺》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B6%AF%CD%DF%A4%C7%EC%C5%CD%DF%A4%CA%D4%E4%A1%D5",wikiTextAll:`通常魔法
このカード名のカードは１ターンに１枚しか発動できない。
(1)：自分のデッキの上からカード１０枚を裏側表示で除外して発動できる。
自分はデッキから２枚ドローする。`},手札抹殺:{name:"手札抹殺",nameKana:"",description:`(1)：手札があるプレイヤーは、その手札を全て捨てる。
その後、そのプレイヤーは自身が捨てた枚数分ドローする。`,kind:"Spell",spellCategory:"Normal",wikiName:"《手札抹殺》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BC%EA%BB%A5%CB%F5%BB%A6%A1%D5",wikiTextAll:`通常魔法
(1)：手札があるプレイヤーは、その手札を全て捨てる。
その後、そのプレイヤーは自身が捨てた枚数分ドローする。`},魔法石の採掘:{name:"魔法石の採掘",nameKana:"",description:`(1)：手札を２枚捨て、自分の墓地の魔法カード１枚を対象として発動できる。
そのカードを手札に加える。`,kind:"Spell",spellCategory:"Normal",wikiName:"《魔法石の採掘》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%E2%CB%A1%C0%D0%A4%CE%BA%CE%B7%A1%A1%D5",wikiTextAll:`通常魔法
(1)：手札を２枚捨て、自分の墓地の魔法カード１枚を対象として発動できる。
そのカードを手札に加える。`},貪欲な壺:{name:"貪欲な壺",nameKana:"",description:`(1)：自分の墓地のモンスター５体を対象として発動できる。
そのモンスター５体をデッキに戻してシャッフルする。
その後、自分は２枚ドローする。`,kind:"Spell",spellCategory:"Normal",wikiName:"《貪欲な壺》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%EC%C5%CD%DF%A4%CA%D4%E4%A1%D5",wikiTextAll:`通常魔法
(1)：自分の墓地のモンスター５体を対象として発動できる。
そのモンスター５体をデッキに戻してシャッフルする。
その後、自分は２枚ドローする。`},死者転生:{name:"死者転生",nameKana:"",description:`(1)：手札を１枚捨て、自分の墓地のモンスター１体を対象として発動できる。
そのモンスターを手札に加える。`,kind:"Spell",spellCategory:"Normal",wikiName:"《死者転生》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BB%E0%BC%D4%C5%BE%C0%B8%A1%D5",wikiTextAll:`通常魔法
(1)：手札を１枚捨て、自分の墓地のモンスター１体を対象として発動できる。
そのモンスターを手札に加える。`},魔法再生:{name:"魔法再生",nameKana:"",description:`手札の魔法カードを２枚墓地に送る。
自分の墓地から魔法カードを１枚選択し、手札に加える。`,kind:"Spell",spellCategory:"Normal",wikiName:"《魔法再生》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CB%E2%CB%A1%BA%C6%C0%B8%A1%D5",wikiTextAll:`通常魔法
手札の魔法カードを２枚墓地に送る。
自分の墓地から魔法カードを１枚選択し、手札に加える。`},おろかな重葬:{name:"おろかな重葬",nameKana:"",description:`このカード名のカードは１ターンに１枚しか発動できず、
このカードを発動するターン、自分は魔法・罠カードをセットできない。
(1)：ＬＰを半分払って発動できる。
ＥＸデッキからモンスター１体を墓地へ送る。`,kind:"Spell",spellCategory:"Normal",wikiName:"《おろかな重葬》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%AA%A4%ED%A4%AB%A4%CA%BD%C5%C1%F2%A1%D5",wikiTextAll:`通常魔法
このカード名のカードは１ターンに１枚しか発動できず、
このカードを発動するターン、自分は魔法・罠カードをセットできない。
(1)：ＬＰを半分払って発動できる。
ＥＸデッキからモンスター１体を墓地へ送る。`},おろかな副葬:{name:"おろかな副葬",nameKana:"",description:`このカード名のカードは１ターンに１枚しか発動できない。
(1)：デッキから魔法・罠カード１枚を墓地へ送る。`,kind:"Spell",spellCategory:"Normal",wikiName:"《おろかな副葬》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%AA%A4%ED%A4%AB%A4%CA%C9%FB%C1%F2%A1%D5",wikiTextAll:`通常魔法（準制限カード）
このカード名のカードは１ターンに１枚しか発動できない。
(1)：デッキから魔法・罠カード１枚を墓地へ送る。`},おろかな転生:{name:"おろかな転生",nameKana:"",description:`相手の墓地に存在するカード１枚を選択して発動する。
選択したカードをデッキに戻す。`,kind:"Spell",spellCategory:"QuickPlay",wikiName:"《おろかな転生》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%AA%A4%ED%A4%AB%A4%CA%C5%BE%C0%B8%A1%D5",wikiTextAll:`速攻魔法
相手の墓地に存在するカード１枚を選択して発動する。
選択したカードをデッキに戻す。`},"ワン・フォー・ワン":{name:"ワン・フォー・ワン",nameKana:"",description:`(1)：手札からモンスター１体を墓地へ送って発動できる。
手札・デッキからレベル１モンスター１体を特殊召喚する。`,kind:"Spell",spellCategory:"Normal",wikiName:"《ワン・フォー・ワン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EF%A5%F3%A1%A6%A5%D5%A5%A9%A1%BC%A1%A6%A5%EF%A5%F3%A1%D5",wikiTextAll:`通常魔法（制限カード）
(1)：手札からモンスター１体を墓地へ送って発動できる。
手札・デッキからレベル１モンスター１体を特殊召喚する。`},終末の騎士:{name:"終末の騎士",nameKana:"",description:`(1)：このカードが召喚・反転召喚・特殊召喚に成功した時に発動できる。
デッキから闇属性モンスター１体を墓地へ送る。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1400,defense:1200,attribute:"Dark",type:"Warrior",wikiName:"《終末の騎士》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BD%AA%CB%F6%A4%CE%B5%B3%BB%CE%A1%D5",wikiTextAll:`効果モンスター
星４/闇属性/戦士族/攻1400/守1200
(1)：このカードが召喚・反転召喚・特殊召喚に成功した時に発動できる。
デッキから闇属性モンスター１体を墓地へ送る。`},"アンノウン・シンクロン":{name:"アンノウン・シンクロン",nameKana:"",description:`「アンノウン・シンクロン」の(1)の方法による特殊召喚はデュエル中に１度しかできない。
(1)：相手フィールドにモンスターが存在し、自分フィールドにモンスターが存在しない場合、
このカードは手札から特殊召喚できる。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Tuner","Effect"],level:1,attribute:"Dark",type:"Machine",wikiName:"《アンノウン・シンクロン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%A2%A5%F3%A5%CE%A5%A6%A5%F3%A1%A6%A5%B7%A5%F3%A5%AF%A5%ED%A5%F3%A1%D5",wikiTextAll:`チューナー・効果モンスター
星１/闇属性/機械族/攻   0/守   0
「アンノウン・シンクロン」の(1)の方法による特殊召喚はデュエル中に１度しかできない。
(1)：相手フィールドにモンスターが存在し、自分フィールドにモンスターが存在しない場合、
このカードは手札から特殊召喚できる。`,nameTags:["シンクロン"],attack:0,defense:0},ゾンビキャリア:{name:"ゾンビキャリア",nameKana:"",description:`(1)：このカードが墓地に存在する場合、手札を１枚デッキの一番上に戻して発動できる。
このカードを特殊召喚する。
この効果で特殊召喚したこのカードは、フィールドから離れた場合に除外される。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Tuner","Effect"],level:2,attack:400,defense:200,attribute:"Dark",type:"Zombie",wikiName:"《ゾンビキャリア》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BE%A5%F3%A5%D3%A5%AD%A5%E3%A5%EA%A5%A2%A1%D5",wikiTextAll:`チューナー・効果モンスター
星２/闇属性/アンデット族/攻 400/守 200
(1)：このカードが墓地に存在する場合、手札を１枚デッキの一番上に戻して発動できる。
このカードを特殊召喚する。
この効果で特殊召喚したこのカードは、フィールドから離れた場合に除外される。`},"Ａ・Ｏ・Ｊ アンノウン・クラッシャー":{name:"Ａ・Ｏ・Ｊ アンノウン・クラッシャー",nameKana:"",description:`このカードが光属性モンスターと戦闘を行った時、
そのモンスターをゲームから除外する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:3,attack:1200,defense:800,attribute:"Dark",type:"Machine",wikiName:"《Ａ・Ｏ・Ｊ アンノウン・クラッシャー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%C1%A1%A6%A3%CF%A1%A6%A3%CA%20%A5%A2%A5%F3%A5%CE%A5%A6%A5%F3%A1%A6%A5%AF%A5%E9%A5%C3%A5%B7%A5%E3%A1%BC%A1%D5",wikiTextAll:`効果モンスター
星３/闇属性/機械族/攻1200/守 800
このカードが光属性モンスターと戦闘を行った時、
そのモンスターをゲームから除外する。`},マスマティシャン:{name:"マスマティシャン",nameKana:"",description:`(1)：このカードが召喚に成功した時に発動できる。
デッキからレベル４以下のモンスター１体を墓地へ送る。
(2)：このカードが戦闘で破壊され墓地へ送られた時に発動できる。
自分はデッキから１枚ドローする。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:3,attack:1500,defense:500,attribute:"Earth",type:"Spellcaster",wikiName:"《マスマティシャン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%DE%A5%B9%A5%DE%A5%C6%A5%A3%A5%B7%A5%E3%A5%F3%A1%D5",wikiTextAll:`効果モンスター
星３/地属性/魔法使い族/攻1500/守 500
(1)：このカードが召喚に成功した時に発動できる。
デッキからレベル４以下のモンスター１体を墓地へ送る。
(2)：このカードが戦闘で破壊され墓地へ送られた時に発動できる。
自分はデッキから１枚ドローする。`},"ローンファイア・ブロッサム":{name:"ローンファイア・ブロッサム",nameKana:"",description:`(1)：１ターンに１度、自分フィールドの表側表示の植物族モンスター１体をリリースして発動できる。
デッキから植物族モンスター１体を特殊召喚する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:3,attack:500,defense:1400,attribute:"Fire",type:"Plant",wikiName:"《ローンファイア・ブロッサム》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%ED%A1%BC%A5%F3%A5%D5%A5%A1%A5%A4%A5%A2%A1%A6%A5%D6%A5%ED%A5%C3%A5%B5%A5%E0%A1%D5",wikiTextAll:`効果モンスター
星３/炎属性/植物族/攻 500/守1400
(1)：１ターンに１度、自分フィールドの表側表示の植物族モンスター１体をリリースして発動できる。
デッキから植物族モンスター１体を特殊召喚する。`},"タイム・エスケーパー":{name:"タイム・エスケーパー",nameKana:"",description:`このカードを手札から捨て、
自分フィールド上に表側表示で存在する
サイキック族モンスター１体を選択して発動する。
選択したモンスターを次の自分のスタンバイフェイズ時までゲームから除外する。
この効果は相手ターンでも発動する事ができる。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:2,attack:500,defense:100,attribute:"Earth",type:"Psychic",wikiName:"《タイム・エスケーパー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BF%A5%A4%A5%E0%A1%A6%A5%A8%A5%B9%A5%B1%A1%BC%A5%D1%A1%BC%A1%D5",wikiTextAll:`効果モンスター
星２/地属性/サイキック族/攻 500/守 100
このカードを手札から捨て、
自分フィールド上に表側表示で存在する
サイキック族モンスター１体を選択して発動する。
選択したモンスターを次の自分のスタンバイフェイズ時までゲームから除外する。
この効果は相手ターンでも発動する事ができる。`},ドットスケーパー:{name:"ドットスケーパー",nameKana:"",description:`このカード名の(1)(2)の効果は１ターンに１度、いずれか１つしか使用できず、それぞれデュエル中に１度しか使用できない。
(1)：このカードが墓地へ送られた場合に発動できる。このカードを特殊召喚する。
(2)：このカードが除外された場合に発動できる。このカードを特殊召喚する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:1,defense:2100,attribute:"Earth",type:"Cyberse",wikiName:"《ドットスケーパー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C9%A5%C3%A5%C8%A5%B9%A5%B1%A1%BC%A5%D1%A1%BC%A1%D5",wikiTextAll:`効果モンスター
星１/地属性/サイバース族/攻   0/守2100
このカード名の(1)(2)の効果は１ターンに１度、いずれか１つしか使用できず、
それぞれデュエル中に１度しか使用できない。
(1)：このカードが墓地へ送られた場合に発動できる。
このカードを特殊召喚する。
(2)：このカードが除外された場合に発動できる。
このカードを特殊召喚する。`,attack:0},"ダーク・バースト":{name:"ダーク・バースト",nameKana:"",description:`(1)：自分の墓地の攻撃力１５００以下の闇属性モンスター１体を対象として発動できる。
その闇属性モンスターを手札に加える。`,kind:"Spell",spellCategory:"Normal",wikiName:"《ダーク・バースト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C0%A1%BC%A5%AF%A1%A6%A5%D0%A1%BC%A5%B9%A5%C8%A1%D5",wikiTextAll:`通常魔法
(1)：自分の墓地の攻撃力１５００以下の闇属性モンスター１体を対象として発動できる。
その闇属性モンスターを手札に加える。`},"ユーフォロイド・ファイター":{name:"ユーフォロイド・ファイター",nameKana:"",description:`「ユーフォロイド」＋戦士族モンスター
このモンスターの融合召喚は、上記のカードでしか行えない。
このカードの元々の攻撃力・守備力は、融合素材にした
モンスター２体の元々の攻撃力を合計した数値になる。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Fusion","Effect"],level:10,attribute:"Light",type:"Machine",wikiName:"《ユーフォロイド・ファイター》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E6%A1%BC%A5%D5%A5%A9%A5%ED%A5%A4%A5%C9%A1%A6%A5%D5%A5%A1%A5%A4%A5%BF%A1%BC%A1%D5",wikiTextAll:`融合・効果モンスター
星１０/光属性/機械族/攻   ?/守   ?
「ユーフォロイド」＋戦士族モンスター
このモンスターの融合召喚は、上記のカードでしか行えない。
このカードの元々の攻撃力・守備力は、融合素材にした
モンスター２体の元々の攻撃力を合計した数値になる。`},ＵＦＯタートル:{name:"ＵＦＯタートル",nameKana:"",description:`このカードが戦闘によって破壊され墓地へ送られた時、
デッキから攻撃力１５００以下の炎属性モンスター１体を表側攻撃表示で特殊召喚できる。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1400,defense:1200,attribute:"Fire",type:"Machine",wikiName:"《ＵＦＯタートル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%D5%A3%C6%A3%CF%A5%BF%A1%BC%A5%C8%A5%EB%A1%D5",wikiTextAll:`効果モンスター
星４/炎属性/機械族/攻1400/守1200
このカードが戦闘によって破壊され墓地へ送られた時、
デッキから攻撃力１５００以下の炎属性モンスター１体を表側攻撃表示で特殊召喚できる。`},"ＸＸ－セイバー エマーズブレイド":{name:"ＸＸ－セイバー エマーズブレイド",nameKana:"",description:`(1)：このカードが戦闘で破壊され墓地へ送られた時に発動できる。
デッキからレベル４以下の「Ｘ－セイバー」モンスター１体を特殊召喚する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:3,attack:1300,defense:800,attribute:"Earth",type:"Insect",wikiName:"《ＸＸ－セイバー エマーズブレイド》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%D8%A3%D8%A1%DD%A5%BB%A5%A4%A5%D0%A1%BC%20%A5%A8%A5%DE%A1%BC%A5%BA%A5%D6%A5%EC%A5%A4%A5%C9%A1%D5",wikiTextAll:`効果モンスター
星３/地属性/昆虫族/攻1300/守 800
(1)：このカードが戦闘で破壊され墓地へ送られた時に発動できる。
デッキからレベル４以下の「Ｘ－セイバー」モンスター１体を特殊召喚する。`,nameTags:["Ｘ－セイバー"]},グリズリーマザー:{name:"グリズリーマザー",nameKana:"",description:`(1)：このカードが戦闘で破壊され墓地へ送られた時に発動できる。
デッキから攻撃力１５００以下の水属性モンスター１体を攻撃表示で特殊召喚する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1400,defense:1e3,attribute:"Water",type:"BeastWarrior",wikiName:"《グリズリーマザー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B0%A5%EA%A5%BA%A5%EA%A1%BC%A5%DE%A5%B6%A1%BC%A1%D5",wikiTextAll:`効果モンスター
星４/水属性/獣戦士族/攻1400/守1000
(1)：このカードが戦闘で破壊され墓地へ送られた時に発動できる。
デッキから攻撃力１５００以下の水属性モンスター１体を攻撃表示で特殊召喚する。`},シャインエンジェル:{name:"シャインエンジェル",nameKana:"",description:`このカードが戦闘によって破壊され墓地へ送られた時、
デッキから攻撃力１５００以下の光属性モンスター１体を
表側攻撃表示で特殊召喚できる。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1400,defense:800,attribute:"Light",type:"Fairy",wikiName:"《シャインエンジェル》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B7%A5%E3%A5%A4%A5%F3%A5%A8%A5%F3%A5%B8%A5%A7%A5%EB%A1%D5",wikiTextAll:`効果モンスター
星４/光属性/天使族/攻1400/守 800
このカードが戦闘によって破壊され墓地へ送られた時、
デッキから攻撃力１５００以下の光属性モンスター１体を
表側攻撃表示で特殊召喚できる。`},ゼンマイハニー:{name:"ゼンマイハニー",nameKana:"",description:`このカードが戦闘によって破壊され墓地へ送られた時、
デッキからレベル４以下の「ゼンマイ」と名のついたモンスター１体を特殊召喚できる。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:1,attack:100,defense:300,attribute:"Earth",type:"Insect",wikiName:"《ゼンマイハニー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%BC%A5%F3%A5%DE%A5%A4%A5%CF%A5%CB%A1%BC%A1%D5",wikiTextAll:`効果モンスター
星１/地属性/昆虫族/攻 100/守 300
このカードが戦闘によって破壊され墓地へ送られた時、
デッキからレベル４以下の「ゼンマイ」と名のついたモンスター１体を特殊召喚できる。`,nameTags:["ゼンマイ"]},ドラゴンフライ:{name:"ドラゴンフライ",nameKana:"",description:`このカードが戦闘によって破壊され墓地へ送られた時、
自分のデッキから攻撃力１５００以下の風属性モンスター１体を
自分フィールド上に表側攻撃表示で特殊召喚する事ができる。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1400,defense:900,attribute:"Wind",type:"Insect",wikiName:"《ドラゴンフライ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C9%A5%E9%A5%B4%A5%F3%A5%D5%A5%E9%A5%A4%A1%D5",wikiTextAll:`効果モンスター
星４/風属性/昆虫族/攻1400/守 900
このカードが戦闘によって破壊され墓地へ送られた時、
自分のデッキから攻撃力１５００以下の風属性モンスター１体を
自分フィールド上に表側攻撃表示で特殊召喚する事ができる。`},"ナチュル・ドラゴンフライ":{name:"ナチュル・ドラゴンフライ",nameKana:"",description:`このカードは攻撃力２０００以上のモンスターとの戦闘では破壊されない。
このカードの攻撃力は自分の墓地の
「ナチュル」と名のついたモンスターの数×２００ポイントアップする。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1200,defense:400,attribute:"Earth",type:"Insect",wikiName:"《ナチュル・ドラゴンフライ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%CA%A5%C1%A5%E5%A5%EB%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A5%D5%A5%E9%A5%A4%A1%D5",wikiTextAll:`効果モンスター
星４/地属性/昆虫族/攻1200/守 400
このカードは攻撃力２０００以上のモンスターとの戦闘では破壊されない。
このカードの攻撃力は自分の墓地の
「ナチュル」と名のついたモンスターの数×２００ポイントアップする。`},ユーフォロイド:{name:"ユーフォロイド",nameKana:"",description:`このカードが戦闘によって破壊され墓地へ送られた時、
デッキから攻撃力１５００以下の機械族モンスター１体を
表側攻撃表示で特殊召喚する事ができる。
その後デッキをシャッフルする。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:6,attack:1200,defense:1200,attribute:"Light",type:"Machine",wikiName:"《ユーフォロイド》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E6%A1%BC%A5%D5%A5%A9%A5%ED%A5%A4%A5%C9%A1%D5",wikiTextAll:`効果モンスター
星６/光属性/機械族/攻1200/守1200
このカードが戦闘によって破壊され墓地へ送られた時、
デッキから攻撃力１５００以下の機械族モンスター１体を
表側攻撃表示で特殊召喚する事ができる。
その後デッキをシャッフルする。`},リトルトルーパー:{name:"リトルトルーパー",nameKana:"",description:`このカードが戦闘によって破壊された場合、
デッキからレベル２以下の戦士族モンスター１体を
裏側守備表示で特殊召喚できる。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:1,attack:900,defense:500,attribute:"Earth",type:"Warrior",wikiName:"《リトルトルーパー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%EA%A5%C8%A5%EB%A5%C8%A5%EB%A1%BC%A5%D1%A1%BC%A1%D5",wikiTextAll:`効果モンスター
星１/地属性/戦士族/攻 900/守 500
このカードが戦闘によって破壊された場合、
デッキからレベル２以下の戦士族モンスター１体を
裏側守備表示で特殊召喚できる。`},巨大ネズミ:{name:"巨大ネズミ",nameKana:"",description:`(1)：このカードが戦闘で破壊され墓地へ送られた時に発動できる。
デッキから攻撃力１５００以下の地属性モンスター１体を攻撃表示で特殊召喚する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1400,defense:1450,attribute:"Earth",type:"Beast",wikiName:"《巨大ネズミ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B5%F0%C2%E7%A5%CD%A5%BA%A5%DF%A1%D5",wikiTextAll:`効果モンスター
星４/地属性/獣族/攻1400/守1450
(1)：このカードが戦闘で破壊され墓地へ送られた時に発動できる。
デッキから攻撃力１５００以下の地属性モンスター１体を攻撃表示で特殊召喚する。`},共鳴虫:{name:"共鳴虫",nameKana:"",description:`このカードが戦闘によって破壊され墓地に送られた時、
デッキから攻撃力１５００以下の昆虫族モンスター１体を
自分フィールド上に特殊召喚する事ができる。
その後デッキをシャッフルする。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:3,attack:1200,defense:1300,attribute:"Earth",type:"Insect",wikiName:"《共鳴虫》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B6%A6%CC%C4%C3%EE%A1%D5",wikiTextAll:`効果モンスター
星３/地属性/昆虫族/攻1200/守1300
このカードが戦闘によって破壊され墓地に送られた時、
デッキから攻撃力１５００以下の昆虫族モンスター１体を
自分フィールド上に特殊召喚する事ができる。
その後デッキをシャッフルする。`},軍隊竜:{name:"軍隊竜",nameKana:"",description:`このカードが戦闘によって破壊され墓地へ送られた時、
自分のデッキから「軍隊竜」１体を特殊召喚する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:2,attack:700,defense:800,attribute:"Wind",type:"Dragon",wikiName:"《軍隊竜》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B7%B3%C2%E2%CE%B5%A1%D5",wikiTextAll:`効果モンスター
星２/風属性/ドラゴン族/攻 700/守 800
このカードが戦闘によって破壊され墓地へ送られた時、
自分のデッキから「軍隊竜」１体を特殊召喚する。`},幻影の魔術士:{name:"幻影の魔術士",nameKana:"",description:`このカードが戦闘によって破壊され墓地へ送られた時、 
自分のデッキから攻撃力１０００以下の「ＨＥＲＯ」と名のついたモンスター１体を
表側守備表示で特殊召喚する事ができる。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:3,attack:600,defense:700,attribute:"Dark",type:"Spellcaster",wikiName:"《幻影の魔術士》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B8%B8%B1%C6%A4%CE%CB%E2%BD%D1%BB%CE%A1%D5",wikiTextAll:`効果モンスター
星３/闇属性/魔法使い族/攻 600/守 700
このカードが戦闘によって破壊され墓地へ送られた時、 
自分のデッキから攻撃力１０００以下の「ＨＥＲＯ」と名のついたモンスター１体を
表側守備表示で特殊召喚する事ができる。`},荒野の女戦士:{name:"荒野の女戦士",nameKana:"",description:`(1)：このカードが戦闘で破壊され墓地へ送られた時に発動できる。
デッキから攻撃力１５００以下の戦士族・地属性モンスター１体を攻撃表示で特殊召喚する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1100,defense:1200,attribute:"Earth",type:"Warrior",wikiName:"《荒野の女戦士》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B9%D3%CC%EE%A4%CE%BD%F7%C0%EF%BB%CE%A1%D5",wikiTextAll:`効果モンスター
星４/地属性/戦士族/攻1100/守1200
(1)：このカードが戦闘で破壊され墓地へ送られた時に発動できる。
デッキから攻撃力１５００以下の戦士族・地属性モンスター１体を攻撃表示で特殊召喚する。`},紫炎の足軽:{name:"紫炎の足軽",nameKana:"",description:"このカードが戦闘によって破壊され墓地へ送られた時、デッキからレベル３以下の「六武衆」と名のついたモンスター１体を特殊召喚できる。",pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:2,attack:700,defense:300,attribute:"Earth",type:"Warrior",wikiName:"《紫炎の足軽》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BB%E7%B1%EA%A4%CE%C2%AD%B7%DA%A1%D5",wikiTextAll:`効果モンスター
星２/地属性/戦士族/攻 700/守 300
このカードが戦闘によって破壊され墓地へ送られた時、
デッキからレベル３以下の「六武衆」と名のついたモンスター１体を特殊召喚できる。`},破面竜:{name:"破面竜",nameKana:"",description:"(1)：このカードが戦闘で破壊され墓地へ送られた時に発動できる。デッキから守備力１５００以下の幻竜族モンスター１体を特殊召喚する。",pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:3,attack:1400,defense:1100,attribute:"Fire",type:"Wyrm",wikiName:"《破面竜》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C7%CB%CC%CC%CE%B5%A1%D5",wikiTextAll:`効果モンスター
星３/炎属性/幻竜族/攻1400/守1100
(1)：このカードが戦闘で破壊され墓地へ送られた時に発動できる。
デッキから守備力１５００以下の幻竜族モンスター１体を特殊召喚する。`},"グローアップ・バルブ":{name:"グローアップ・バルブ",nameKana:"",description:`このカード名の効果はデュエル中に１度しか使用できない。
(1)：このカードが墓地に存在する場合に発動できる。
自分のデッキの一番上のカードを墓地へ送り、このカードを特殊召喚する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Tuner","Effect"],level:1,attack:100,defense:100,attribute:"Earth",type:"Plant",wikiName:"《グローアップ・バルブ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B0%A5%ED%A1%BC%A5%A2%A5%C3%A5%D7%A1%A6%A5%D0%A5%EB%A5%D6%A1%D5",wikiTextAll:`チューナー・効果モンスター
星１/地属性/植物族/攻 100/守 100
このカード名の効果はデュエル中に１度しか使用できない。
(1)：このカードが墓地に存在する場合に発動できる。
自分のデッキの一番上のカードを墓地へ送り、このカードを特殊召喚する。`},"グローアップ・ブルーム":{name:"グローアップ・ブルーム",nameKana:"",description:`このカード名の効果は１ターンに１度しか使用できない。
(1)：このカードが墓地へ送られた場合、墓地のこのカードを除外して発動できる。
デッキからレベル５以上のアンデット族モンスター１体を手札に加える。
フィールドゾーンに「アンデットワールド」が存在する場合、
手札に加えず特殊召喚する事もできる。
この効果の発動後、ターン終了時まで自分はアンデット族モンスターしか特殊召喚できない。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Tuner","Effect"],level:1,attribute:"Dark",type:"Zombie",wikiName:"《グローアップ・ブルーム》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B0%A5%ED%A1%BC%A5%A2%A5%C3%A5%D7%A1%A6%A5%D6%A5%EB%A1%BC%A5%E0%A1%D5",wikiTextAll:`チューナー・効果モンスター
星１/闇属性/アンデット族/攻   0/守   0
このカード名の効果は１ターンに１度しか使用できない。
(1)：このカードが墓地へ送られた場合、墓地のこのカードを除外して発動できる。
デッキからレベル５以上のアンデット族モンスター１体を手札に加える。
フィールドゾーンに「アンデットワールド」が存在する場合、
手札に加えず特殊召喚する事もできる。
この効果の発動後、ターン終了時まで自分はアンデット族モンスターしか特殊召喚できない。`,attack:0,defense:0},"キラー・トマト":{name:"キラー・トマト",nameKana:"",description:`(1)：このカードが戦闘で破壊され墓地へ送られた時に発動できる。
デッキから攻撃力１５００以下の闇属性モンスター１体を攻撃表示で特殊召喚する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1400,defense:1100,attribute:"Dark",type:"Plant",wikiName:"《キラー・トマト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AD%A5%E9%A1%BC%A1%A6%A5%C8%A5%DE%A5%C8%A1%D5",wikiTextAll:`効果モンスター
星４/闇属性/植物族/攻1400/守1100
(1)：このカードが戦闘で破壊され墓地へ送られた時に発動できる。
デッキから攻撃力１５００以下の闇属性モンスター１体を攻撃表示で特殊召喚する。`},"キラー・ポテト":{name:"キラー・ポテト",nameKana:"",description:`(1)：フィールドのこのカードが効果で破壊され墓地へ送られた場合に発動できる。
「キラー・ポテト」を除く、攻撃力１５００以下の闇属性モンスター１体をデッキから攻撃表示で特殊召喚する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:4,attack:1400,defense:1100,attribute:"Dark",type:"Plant",wikiName:"《キラー・ポテト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AD%A5%E9%A1%BC%A1%A6%A5%DD%A5%C6%A5%C8%A1%D5",wikiTextAll:`効果モンスター
星４/闇属性/植物族/攻1400/守1100
(1)：フィールドのこのカードが効果で破壊され墓地へ送られた場合に発動できる。
「キラー・ポテト」を除く、攻撃力１５００以下の闇属性モンスター１体をデッキから攻撃表示で特殊召喚する。`},六武衆のご隠居:{name:"六武衆のご隠居",nameKana:"",description:"相手フィールド上にモンスターが存在し、自分フィールド上にモンスターが存在しない場合、このカードは手札から特殊召喚する事ができる。",pendulumDescription:"",kind:"Monster",monsterCategories:["Effect"],level:3,attack:400,attribute:"Earth",type:"Warrior",wikiName:"《六武衆のご隠居》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%CF%BB%C9%F0%BD%B0%A4%CE%A4%B4%B1%A3%B5%EF%A1%D5",wikiTextAll:`効果モンスター
星３/地属性/戦士族/攻 400/守   0
相手フィールド上にモンスターが存在し、
自分フィールド上にモンスターが存在しない場合、
このカードは手札から特殊召喚する事ができる。`,nameTags:["六武衆"],defense:0},ご隠居の大釜:{name:"ご隠居の大釜",nameKana:"",description:`(1)：このカードの発動時の効果処理として、このカードにカウンターを１つ置く。
(2)：自分スタンバイフェイズに発動する。
このカードにカウンターを１つ置く。
(3)：１ターンに１度、以下の効果から１つを選択して発動できる。
●自分はこのカードのカウンターの数×５００ＬＰ回復する。
●このカードのカウンターの数×３００ダメージを相手に与える。`,kind:"Spell",spellCategory:"Continuous",wikiName:"《ご隠居の大釜》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%B4%B1%A3%B5%EF%A4%CE%C2%E7%B3%F8%A1%D5",wikiTextAll:`永続魔法
(1)：このカードの発動時の効果処理として、このカードにカウンターを１つ置く。
(2)：自分スタンバイフェイズに発動する。
このカードにカウンターを１つ置く。
(3)：１ターンに１度、以下の効果から１つを選択して発動できる。
●自分はこのカードのカウンターの数×５００ＬＰ回復する。
●このカードのカウンターの数×３００ダメージを相手に与える。`},ご隠居の猛毒薬:{name:"ご隠居の猛毒薬",nameKana:"",description:`(1)：以下の効果から１つを選択して発動できる。
●自分は１２００ＬＰ回復する。
●相手に８００ダメージを与える。`,kind:"Spell",spellCategory:"QuickPlay",wikiName:"《ご隠居の猛毒薬》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%B4%B1%A3%B5%EF%A4%CE%CC%D4%C6%C7%CC%F4%A1%D5",wikiTextAll:`速攻魔法
(1)：以下の効果から１つを選択して発動できる。
●自分は１２００ＬＰ回復する。
●相手に８００ダメージを与える。`},屋敷わらし:{name:"屋敷わらし",nameKana:"",description:`このカード名の効果は１ターンに１度しか使用できない。
(1)：以下のいずれかの効果を含む魔法・罠・モンスターの効果が発動した時、
このカードを手札から捨てて発動できる。
その発動を無効にする。
●墓地からカードを手札・デッキ・ＥＸデッキに加える効果
●墓地からモンスターを特殊召喚する効果
●墓地からカードを除外する効果`,pendulumDescription:"",kind:"Monster",monsterCategories:["Tuner","Effect"],level:3,defense:1800,attribute:"Earth",type:"Zombie",wikiName:"《屋敷わらし》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B2%B0%C9%DF%A4%EF%A4%E9%A4%B7%A1%D5",wikiTextAll:`チューナー・効果モンスター
星３/地属性/アンデット族/攻   0/守1800
このカード名の効果は１ターンに１度しか使用できない。
(1)：以下のいずれかの効果を含む魔法・罠・モンスターの効果が発動した時、
このカードを手札から捨てて発動できる。
その発動を無効にする。
●墓地からカードを手札・デッキ・ＥＸデッキに加える効果
●墓地からモンスターを特殊召喚する効果
●墓地からカードを除外する効果`,attack:0},灰流うらら:{name:"灰流うらら",nameKana:"",description:`このカード名の効果は１ターンに１度しか使用できない。
(1)：以下のいずれかの効果を含む魔法・罠・モンスターの効果が発動した時、
このカードを手札から捨てて発動できる。
その効果を無効にする。
●デッキからカードを手札に加える効果
●デッキからモンスターを特殊召喚する効果
●デッキからカードを墓地へ送る効果`,pendulumDescription:"",kind:"Monster",monsterCategories:["Tuner","Effect"],level:3,defense:1800,attribute:"Fire",type:"Zombie",wikiName:"《灰流うらら》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B3%A5%CE%AE%A4%A6%A4%E9%A4%E9%A1%D5",wikiTextAll:`チューナー・効果モンスター
星３/炎属性/アンデット族/攻   0/守1800
このカード名の効果は１ターンに１度しか使用できない。
(1)：以下のいずれかの効果を含む魔法・罠・モンスターの効果が発動した時、
このカードを手札から捨てて発動できる。
その効果を無効にする。
●デッキからカードを手札に加える効果
●デッキからモンスターを特殊召喚する効果
●デッキからカードを墓地へ送る効果`,attack:0}},Ze=class Ze{constructor(e){d(this,"id");d(this,"name");d(this,"description");d(this,"save",async e=>{const t=e??{id:this.id,name:this.name,description:this.description},i=await Ze.tblHeader.update(this.id,a=>({...a,...t}));return new Ze(i)});this.id=e.id,this.name=e.name,this.description=e.description}};d(Ze,"tblHeader"),d(Ze,"getOrCreateNew",async e=>{Ze.tblHeader||(Ze.tblHeader=new ws(e));const t=await Ze.tblHeader.getAll();if(t.length)return new Ze(t[0]);const i=await Ze.tblHeader.insert({name:"あなた",description:"ここの文字列を何に使うかは未定。"});return new Ze(i)});let Qn=Ze;class ws extends mi{constructor(t){super(t,"TblDuelistProfile");d(this,"_prepareInitialRecords",()=>[])}}let Cs=-1;const Ds=[{id:Cs--,name:"NPC",description:""}],ys=["Deck","ExtraDeck"],vs={Deck:"メインデッキ",ExtraDeck:"エクストラデッキ"},Jn=["Monster","Spell","Trap"],ba={Monster:"モンスター",Spell:"魔法",Trap:"罠"},Zt=["Fusion","Syncro","Xyz","Link"],_a=[...Zt,"SpecialSummon"],gs=["Toon","Spirit","Union","Gemini","FlipEffect"],Bs=["Tuner","Effect","Normal","Pendulum","Token"],Fi=[..._a,...gs,...Bs],Sn={Syncro:"シンクロ",Fusion:"融合",Xyz:"エクシーズ",Link:"リンク",SpecialSummon:"特殊召喚",Toon:"トゥーン",Spirit:"スピリット",Union:"ユニオン",Gemini:"デュアル",FlipEffect:"リバース",Tuner:"チューナー",Effect:"効果",Normal:"通常",Pendulum:"ペンデュラム",Token:"トークン"},an={Syncro:"🎵",Fusion:"🌀",Xyz:"📰",Link:"⛓️",SpecialSummon:"🔯",Toon:"📖",Spirit:"👻",Union:"🚗",Gemini:"👫",FlipEffect:"🔄",Tuner:"🎶",Effect:"✨",Normal:"🔘",Pendulum:"💠",Token:"🐏"},Hi=["Light","Dark","Earth","Water","Fire","Wind","Divine"],ui={Light:"光",Dark:"闇",Earth:"地",Water:"水",Fire:"炎",Wind:"風",Divine:"神"},Si=["Aqua","Beast","BeastWarrior","CreatorGod","Cyberse","Dinosaur","DivineBeast","Dragon","Fairy","Fiend","Fish","Insect","Illusion","Machine","Plant","Psychic","Pyro","Reptile","Rock","SeaSerpent","Spellcaster","Thunder","Warrior","WingedBeast","Wyrm","Zombie"],Ki=["Normal","Continuous","Field","QuickPlay","Equip","Ritual"],rn={Normal:"通常",Continuous:"永続",Field:"フィールド",QuickPlay:"速攻",Equip:"装備",Ritual:"儀式"},Pi=["Normal","Continuous","Counter"],sn={Normal:"通常",Continuous:"永続",Counter:"カウンター"},Kn={Aqua:"水",Beast:"獣",BeastWarrior:"獣戦士",CreatorGod:"創造神",Cyberse:"サイバース",Dinosaur:"恐竜",DivineBeast:"幻獣神",Dragon:"ドラゴン",Fairy:"天使",Fiend:"悪魔",Fish:"魚",Insect:"昆虫",Illusion:"幻想魔",Machine:"機械",Plant:"植物",Psychic:"サイキック",Pyro:"炎",Reptile:"爬虫類",Rock:"岩石",SeaSerpent:"海竜",Spellcaster:"魔法使い",Thunder:"雷",Warrior:"戦士",WingedBeast:"鳥獣",Wyrm:"幻竜",Zombie:"アンデット"},on={Aqua:"🚰",Beast:"🐅",BeastWarrior:"🦁",CreatorGod:"🔆",Cyberse:"💻️",Dinosaur:"🦖",DivineBeast:"💫",Dragon:"🐲",Fairy:"👼",Fiend:"👿",Fish:"🐟️",Insect:"🦋",Illusion:"🤡",Machine:"🤖",Plant:"🌱",Psychic:"👁️",Pyro:"🔥",Reptile:"🦎",Rock:"⛰",SeaSerpent:"🐍",Spellcaster:"🧙",Thunder:"⚡️",Warrior:"⚔️",WingedBeast:"🦅",Wyrm:"🐉",Zombie:"🦴"},qi=["Deck","ExtraDeck","Graveyard","Banished"],Fa=["MonsterZone","ExtraMonsterZone"],Es=["SpellAndTrapZone","FieldSpellZone"],Ha=[...Fa,...Es],Xn={0:{0:"Hand"},1:{0:"Deck",1:"SpellAndTrapZone",2:"SpellAndTrapZone",3:"SpellAndTrapZone",4:"SpellAndTrapZone",5:"SpellAndTrapZone",6:"ExtraDeck"},2:{0:"Graveyard",1:"MonsterZone",2:"MonsterZone",3:"MonsterZone",4:"MonsterZone",5:"MonsterZone",6:"FieldSpellZone"},3:{0:"Banished",1:"Disable",2:"ExtraMonsterZone",3:"Disable",4:"ExtraMonsterZone",5:"Disable",6:"Banished"},4:{0:"FieldSpellZone",1:"MonsterZone",2:"MonsterZone",3:"MonsterZone",4:"MonsterZone",5:"MonsterZone",6:"Graveyard"},5:{0:"ExtraDeck",1:"SpellAndTrapZone",2:"SpellAndTrapZone",3:"SpellAndTrapZone",4:"SpellAndTrapZone",5:"SpellAndTrapZone",6:"Deck"},6:{0:"Hand"}};class Ts{constructor(e,t,i,a){d(this,"onUpdateEvent",new Re);d(this,"field");d(this,"row");d(this,"column");d(this,"cellType");d(this,"owner");d(this,"_entities");d(this,"releaseEntities",e=>(this._entities=this._entities.filter(t=>!e.includes(t)),this.onUpdateEvent.trigger(),e));d(this,"acceptEntities",(e,t)=>{t==="Bottom"?this._entities.push(...e):t==="Top"&&this._entities.unshift(...e),this._entities.forEach(i=>{i.fieldCell=this}),this.onUpdateEvent.trigger()});d(this,"shuffle",()=>{this._entities=this.entities.shuffle()});this.field=e,this.row=t,this.column=i,this.cellType=Xn[t][i],this.owner=a,this._entities=[]}get onUpdate(){return this.onUpdateEvent.expose()}get entities(){return this._entities}get cardEntities(){return this._entities.filter(e=>js.find(t=>t===e.entityType))}get targetForAttack(){return this.cellType==="Hand"?this._entities.find(e=>e.entityType==="Duelist"):this.cardEntities[0]}get isAvailable(){return this._entities.length===0}}Array.prototype.shuffle=function(){return this.map(e=>({item:e,seq:Math.random()})).toSorted((e,t)=>e.seq-t.seq).map(e=>e.item)};Array.prototype.randomPick=function(n){return this.shuffle().slice(0,n)};Array.prototype.reset=function(...n){this.splice(0),this.push(...n)};Array.prototype.union=function(n){return this.filter(n.includes,n)};Array.prototype.getAllOnOffPattern=function(){const n=[];return this.forEach(e=>{if(n.length==0){n.push([e]),n.push([]);return}n.forEach(t=>n.push([...t,e]))}),n};Array.prototype.getDistinct=function(){return Array.from(new Set(this))};const Sa=async()=>({selectedEntities:[],chainBlockTags:[],prepared:void 0}),xs=n=>{if(n.controller.normalSummonCount>=n.controller.maxNormalSummonCount||!n.status.level)return;const e=n.controller.getAvailableMonsterZones();return n.status.level<5?e.length>0?e:void 0:n.controller.getReleasableMonsters().length<(n.status.level<7?1:2)?void 0:[]},Ms=async(n,e,t,i)=>{if(!n.status.level)return;let a=e?[e]:n.controller.getAvailableMonsterZones();if(a.length===0)return;let r=i,o=[];if(n.status.level>4){const c=n.controller.getReleasableMonsters(),u=n.controller.getExtraMonsterZones(),C=n.status.level<7?1:2;u.length>=C&&c.filter(p=>p.fieldCell.cellType!=="ExtraMonsterZone");const s=await n.field.release(n.controller,n.controller.getReleasableMonsters(),C,"Cost",["AdvanceSummonRelease","Rule"],n,r);if(!s)return;o=s,r=!1,a=n.controller.getAvailableMonsterZones()}let k=(n.atk??0)>0&&(n.atk??0)>=(n.def??0)?"Attack":"Set",m=a.randomPick(1)[0];if(n.controller.duelistType!=="NPC"){const c=await n.field.duel.view.waitSelectSummonDest(n,a,["Attack","Set"],r);if(!c)return;m=c.dest,k=c.pos}return{selectedEntities:[],chainBlockTags:[],prepared:{dest:m,pos:k,materials:o}}},Ns=async(n,e,t)=>{const i=["Rule","NormalSummon"];return t.prepared.materials.length>0&&(n.info.materials.reset(...t.prepared.materials),i.push("AdvanceSummon")),await n.summon(t.prepared.dest,t.prepared.pos,"NormalSummon",i,n,e),n.controller.normalSummonCount++,!0},Wi=async(n,e,t,i,a)=>{const r=e?[e]:n.controller.getAvailableMonsterZones();if(r.length===0)return;let o=t.randomPick(1)[0],k=r.randomPick(1)[0];if(t.length&&t.includes("Attack")&&(o=(n.atk??0)>0&&(n.atk??0)>=(n.def??0)?"Attack":t.filter(m=>m!=="Attack").randomPick(1)[0]),n.controller.duelistType!=="NPC"){const m=await n.field.duel.view.waitSelectSummonDest(n,r,t,a);if(!m)return;k=m.dest,o=m.pos}return{selectedEntities:[],chainBlockTags:[],prepared:{dest:k,pos:o,materials:i}}},Li=async(n,e,t)=>{const i=["Rule","SpecialSummon"];return await n.summon(t.prepared.dest,t.prepared.pos,"SpecialSummon",i,n,e),n.info.materials=t.prepared.materials,n.controller.specialSummonCount++,!0},qe={title:"通常召喚",playType:"NormalSummon",spellSpeed:"Normal",executableCells:["Hand"],validate:xs,prepare:Ms,execute:Ns,settle:async()=>!0},bs=n=>{if(n.info.attackCount>0||n.battlePotion!=="Attack"||!n.controller.isTurnPlayer)return;const e=n.controller.getAttackTargetMonsters();return e.length>0?e.map(t=>t.fieldCell):[n.controller.getOpponentPlayer().getHandCell()]},_s=async(n,e)=>{if(n.info.attackCount>0||n.battlePotion!=="Attack")return;if(e!=null&&e.targetForAttack)return{selectedEntities:[],chainBlockTags:[],prepared:{target:e.targetForAttack}};const t=n.controller.getAttackTargetMonsters(),i=n.controller.getOpponentPlayer().entity;if(t.length===0)return{selectedEntities:[],chainBlockTags:[],prepared:{target:i}};if(t.length===1)return{selectedEntities:[],chainBlockTags:[],prepared:{target:t[0]}};const a=await n.field.duel.view.waitSelectEntities(n.controller,t,1,r=>r.length===1,"攻撃対象を選択。",!0);if(a)return{selectedEntities:[],chainBlockTags:[],prepared:{target:a[0]}}},Fs=async(n,e,t)=>(n.field.duel.declareAnAttack(n,t.prepared.target),!0),Be={title:"攻撃宣言",playType:"Battle",spellSpeed:"Normal",executableCells:["MonsterZone","ExtraMonsterZone"],validate:bs,prepare:_s,execute:Fs,settle:async()=>!0},Hs=n=>{if(!(n.info.battlePotisionChangeCount>0||n.info.attackCount>0||!n.controller.isTurnPlayer))return[]},Ss=async n=>n.info.battlePotisionChangeCount>0||!n.controller.isTurnPlayer?!1:(n.setBattlePosition(n.battlePotion==="Attack"?"Defense":"Attack"),n.info.battlePotisionChangeCount++,!0),Ee={title:"表示形式変更",playType:"ChangeBattlePosition",spellSpeed:"Normal",executableCells:["MonsterZone","ExtraMonsterZone"],validate:Hs,prepare:Sa,execute:Ss,settle:async()=>!0},Ks=n=>{if(n.status.spellCategory==="Field"){const t=n.controller.getFieldZone();return t.isAvailable?[t]:void 0}const e=n.controller.getAvailableSpellTrapZones();return e.length>0?e:void 0},Ps=async(n,e)=>{if(e)return{selectedEntities:[],chainBlockTags:[],prepared:{dest:e}};const t=n.controller.getAvailableSpellTrapZones();if(t.length===0)return;let i=t[0];if(t.length>1&&n.controller.duelistType!=="NPC"){const a=[At.createDammyAction(n,"セット",t)],r=n.field.duel.view.modalController.selectAction(n.field.duel.view,{title:"カードをセット先へドラッグ",actions:a,cancelable:!0}),o=n.field.duel.view.waitSubAction(n.controller,a,"カードをセット先へドラッグ",!0),k=await Promise.any([r,o.then(m=>m.action)]);if(!k)return;i=k.cell||i}return{selectedEntities:[],chainBlockTags:[],prepared:{dest:i}}},qs=async(n,e,t)=>(await n.setAsSpellTrap(t.prepared.dest,["Rule","SpellTrapSet"],n,e),e.duel.log.info(`${n.status.name}をセット（SpellTrapSet）。`,e),n.info.isSettingSickness=n.status.kind==="Trap"||n.status.spellCategory==="QuickPlay",!0),Te={title:"セット",playType:"SpellTrapSet",spellSpeed:"Normal",executableCells:["Hand"],validate:Ks,prepare:Ps,execute:qs,settle:async()=>!0},Me=n=>{if(n.info.isDying||n.info.isSettingSickness)return;if(n.fieldCell.cellType==="FieldSpellZone"&&n.face==="FaceDown")return[];if(n.field.duel.getTurnPlayer()!==n.controller)return;const e=n.controller.getAvailableSpellTrapZones();return e.length>0?e:void 0},Ne=async(n,e,t,i,a,r,o)=>{if(n.info.isDying=!0,n.fieldCell.cellType==="FieldSpellZone"&&n.face==="FaceDown")return n.setNonFieldPosition("FaceUp",!0),{chainBlockTags:a,selectedEntities:r,prepared:o};if(n.fieldCell.cellType==="Hand"){const k=["SpellTrapActivate"],m=e?[e]:n.controller.getAvailableSpellTrapZones();return await n.field.activateSpellTrapFromHand(n,m,k,n,n.controller,!0),{chainBlockTags:a,selectedEntities:r,prepared:o}}},Ka=(n,e,t,i)=>!(e.some(a=>!a.status.canBeSyncroMaterial)||e.some(a=>a.fieldCell.cellType!=="Hand"&&a.fieldCell.cellType!=="MonsterZone"&&a.fieldCell.cellType!=="ExtraMonsterZone")||e.some(a=>a.fieldCell.cellType==="Hand")&&e.every(a=>!a.status.allowHandSyncro)||e.some(a=>!a.lvl)||e.map(a=>a.lvl??0).reduce((a,r)=>a+r,0)!==(n.origin.level??-1)||!t(e.filter(a=>{var r;return(r=a.status.monsterCategories)==null?void 0:r.some(o=>o==="Tuner")}))||!i(e.filter(a=>{var r;return(r=a.status.monsterCategories)==null?void 0:r.every(o=>o!=="Tuner")}))),Pa=(n,e=i=>i.length===1,t=i=>i.length>0)=>{let i=[...n.controller.getMonstersOnField().filter(a=>a.battlePotion!=="Set"),...n.controller.getHandCell().entities.filter(a=>a.origin.kind==="Monster")].filter(a=>a.status.canBeSyncroMaterial);return i.every(a=>!a.status.allowHandSyncro)&&(i=n.controller.getMonstersOnField()),i.length<2?[]:i.getAllOnOffPattern().filter(a=>Ka(n,a,e,t))},Ws=(n,e=i=>i.length===1,t=i=>i.length>0)=>Pa(n,e,t).length>0?[]:void 0,Ls=async(n,e,t,i=r=>r.length===1,a=r=>r.length>0)=>{const r=Pa(n,i,a);let o;if(r.length===1){for(const u of r[0])await u.sendToGraveyard(["SyncroMaterial","Rule","SpecialSummonMaterial"],n,n.controller);o=r[0],n.field.duel.log.info(`シンクロ素材として、${o.map(u=>"《"+u.nm+"》").join("、")}を墓地に送り――`,n.controller)}else{const u=r.flatMap(s=>s).getDistinct(),C=await n.field.sendToGraveyard("シンクロ素材とするモンスターを選択",n.controller,u,-1,s=>Ka(n,s,i,a),["SyncroMaterial","Rule","SpecialSummonMaterial"],n,t);if(!C)return;o=C,n.field.duel.log.info(`シンクロ素材として、${o.map(s=>"《"+s.nm+"》").join("")}を墓地に送り――`)}console.log(o);const k=[...n.controller.getAvailableMonsterZones(),...n.controller.getAvailableExtraZones()];let m=(n.atk??0)>0&&(n.atk??0)>=(n.def??0)?"Attack":"Defense",c=k.randomPick(1)[0];if(n.controller.duelistType!=="NPC"){const u=await n.field.duel.view.waitSelectSummonDest(n,k,["Attack","Defense"],!1);if(!u)return;c=u.dest,m=u.pos}return{selectedEntities:[],chainBlockTags:[],prepared:{dest:c,pos:m,materials:o}}},Rs=async(n,e,t)=>{const i=["Rule","SpecialSummon","SyncroSummon"];return await n.summon(t.prepared.dest,t.prepared.pos,"SyncroSummon",i,void 0,e),e.specialSummonCount++,n.info.isRebornable=!0,!0},Os=(n,e,t,i,a)=>({title:"①リクルート",playType:"TriggerEffect",spellSpeed:"Normal",executableCells:a,canExecuteOnDamageStep:!0,validate:r=>{if(r.wasMovedAs.union(i).length!==0&&r.isMoveAtPreviousChain&&r.controller.getDeckCell().cardEntities.filter(n).length!==0)return[]},prepare:Sa,execute:async(r,o)=>{const k=r.controller.getDeckCell().cardEntities.filter(n);if(k.length===0)return!1;const m=await r.field.duel.view.waitSelectEntities(o,k,e.length===1?e[0]:-1,c=>e.includes(c.length),"特殊召喚するモンスターを選択",!1);if(!m)throw new Error("illegal state");for(const c of m)await r.field.summon(c,t,o.getAvailableMonsterZones(),"SpecialSummon",["Effect"],r,o,!1);return o.shuffleDeck(),!0},settle:async()=>!0}),Ri=(n=t=>t.length===1,e=t=>t.length>0)=>({title:"シンクロ召喚",playType:"SpecialSummon",spellSpeed:"Normal",executableCells:["ExtraDeck"],validate:t=>Ws(t,n,e),prepare:(t,i,a,r)=>Ls(t,i,r,n,e),execute:Rs,settle:async()=>!0}),Zs=n=>({title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:e=>{if(e.controller.getDeckCell().cardEntities.filter(n).length!==0)return Me(e)},prepare:(e,t,i,a)=>Ne(e,t,i,a,["AddToHandFromDeck"],[],void 0),execute:async(e,t)=>{const i=t.getDeckCell().cardEntities.filter(n);if(i.length===0)return!1;const a=await e.field.duel.view.waitSelectEntities(t,i,1,r=>r.length===1,"手札に加えるカードを選択",!1);for(const r of a??[])await r.addToHand(["Effect"],e,t);return t.shuffleDeck(),!0},settle:async()=>!0}),Is=(n,e)=>({title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],hasToTargetCards:!0,validate:t=>{if(!(t.controller.getGraveyard().cardEntities.filter(n).length<e))return Me(t)},prepare:(t,i,a,r)=>Ne(t,i,a,r,["AddToHandFromGraveyard"],[],void 0),execute:async(t,i)=>{const a=i.getGraveyard().cardEntities.filter(n);if(a.length===0)return!1;const r=await t.field.duel.view.waitSelectEntities(i,a,e,o=>o.length===e,"手札に加えるカードを選択",!1);for(const o of r??[])await o.addToHand(["Effect"],t,i);return!0},settle:async()=>!0}),$s=n=>({title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:e=>{if(e.controller.getHandCell().cardEntities.filter(n).length!==0&&!(e.controller.getDeckCell().cardEntities.length<2))return Me(e)},prepare:async(e,t,i,a)=>(await e.controller.discard(1,["Discard","Cost"],e,e.controller,n),Ne(e,t,i,a,["AddToHandFromDeck"],[],void 0)),execute:async(e,t)=>(await t.draw(2,e,t),!0),settle:async()=>!0}),Us=n=>({title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:Me,prepare:(e,t,i,a)=>Ne(e,t,i,a,["AddToHandFromGraveyard"],[],void 0),execute:async(e,t)=>{const[i,a]=n(e);return a>0?t.getOpponentPlayer().heal(a,e):a<0&&t.getOpponentPlayer().effectDamage(Math.abs(a),e),i>0?t.heal(i,e):i<0&&t.effectDamage(Math.abs(i),e),!0},settle:async()=>!0}),Gs=["NormalSummon","SpecialSummon","ChangeBattlePosition","Battle","SpellTrapSet","SpellTrapActivate"],Pt=n=>n.playType==="CardActivation"?n.entity.nm:`${n.entity.nm}«${n.title}»`;class hi{constructor(e,t,i){d(this,"seq");d(this,"entity");d(this,"cardActionBase");d(this,"getClone",()=>new hi(this.seq,this.entity,this.cardActionBase));d(this,"validate",e=>{if(!(this.isOnlyNTimesPerDuel>0&&this.entity.field.duel.cardActionLog.records.filter(t=>this.isSame(t.cardAction)).filter(t=>t.activater).length>=this.isOnlyNTimesPerDuel)&&!(this.isOnlyNTimesPerTurn>0&&this.entity.field.duel.cardActionLog.records.filter(t=>this.isSameGroupPerTurn(t.cardAction)).filter(t=>t.turn===this.entity.field.duel.clock.turn).filter(t=>t.activater).length>=this.isOnlyNTimesPerTurn))return this.cardActionBase.validate(this.entity,e)});d(this,"prepare",async(e,t,i)=>{const a=await this.cardActionBase.prepare(this.entity,e,t,i);if(a!==void 0)return this.entity.field.duel.cardActionLog.push(this.entity.controller,this),{...a,action:this,activator:this.entity.controller}});d(this,"execute",(e,t,i)=>this.cardActionBase.execute(this.entity,e,t,i));d(this,"settle",(e,t,i)=>this.cardActionBase.settle(this.entity,e,t,i));d(this,"isSame",e=>this.entity.origin.name===e.entity.origin.name&&this.title===e.title);d(this,"isSameGroupPerTurn",e=>this.actionGroupNamePerTurn?this.entity.origin.name===e.entity.origin.name&&this.actionGroupNamePerTurn===e.actionGroupNamePerTurn:this.isSame(e));this.seq=e,this.entity=t,this.cardActionBase=i}get title(){return this.cardActionBase.title}get playType(){return this.cardActionBase.playType}get spellSpeed(){return this.cardActionBase.spellSpeed}get hasToTargetCards(){return this.cardActionBase.hasToTargetCards??!1}get executableCells(){return this.cardActionBase.executableCells}get isOnlyNTimesPerDuel(){return this.cardActionBase.isOnlyNTimesPerDuel??0}get isOnlyNTimesPerTurn(){return this.cardActionBase.isOnlyNTimesPerTurn??0}get actionGroupNamePerTurn(){return this.cardActionBase.actionGroupNamePerTurn}get canExecuteOnDamageStep(){return this.cardActionBase.canExecuteOnDamageStep??!1}}const js=["Card","Token","Avatar"],kn=(n,e)=>{const t=n.monsterCategories??[],i=e.monsterCategories??[];for(const a of Zt.toReversed()){if(t.includes(a)&&!i.includes(a))return 1;if(!t.includes(a)&&i.includes(a))return-1}if(n.kind===e.kind){if(n.kind==="Monster"){if((n.link??0)!==(e.link??0))return(n.link??0)-(e.link??0);if((n.rank??0)!==(e.rank??0))return(n.rank??0)-(e.rank??0);if((n.level??0)!==(e.level??0))return(n.level??0)-(e.level??0);if((n.attack??0)!==(e.attack??0))return(n.attack??0)-(e.attack??0);if((n.defense??0)!==(e.defense??0))return(n.defense??0)-(e.defense??0)}return n.name.localeCompare(e.name,"Ja")}for(const a of Jn){if(n.kind===a)return-1;if(e.kind===a)return 1}return n.name.localeCompare(e.name,"Ja")},Ys=(n,e)=>kn(n.origin,e.origin),ge=class ge{constructor(e,t,i,a,r,o,k,m){d(this,"seq");d(this,"origin");d(this,"entityType");d(this,"face");d(this,"isUnderControl");d(this,"_battlePosition");d(this,"orientation");d(this,"controller");d(this,"owner");d(this,"fieldCell");d(this,"wasMovedBy");d(this,"wasMovedByWhom");d(this,"wasMovedAs");d(this,"wasMovedFrom");d(this,"wasMovedAt");d(this,"_status");d(this,"_info");d(this,"actions",[]);d(this,"getIndexInCell",()=>{const e=this.fieldCell.cardEntities.indexOf(this);if(e<0)throw new Pe("エンティティとセルの状態が矛盾している。",[this,this.fieldCell]);return e});d(this,"setBattlePosition",e=>{this._battlePosition=e,this.orientation=e==="Attack"?"Vertical":"Horizontal",this.face=e==="Set"?"FaceDown":"FaceUp",this.isUnderControl=!0});d(this,"setNonFieldPosition",(e,t)=>{this._battlePosition=void 0,this.orientation=e==="XysMaterial"?"Horizontal":"Vertical",this.face=e==="FaceUp"?"FaceUp":"FaceDown",this.isUnderControl=t});d(this,"summon",async(e,t,i,a,r,o)=>{const k={Attack:"AttackSummon",Defense:"DefenseSummon",Set:"SetSummon"};e.isAvailable&&(this.setBattlePosition(t),i==="SyncroSummon"&&this.field.duel.log.info(`${this.nm}をシンクロ召喚！`,this.controller),await this._moveTo(e,"Top",[i,k[t],...a],r,o),this.info.battlePotisionChangeCount=1)});d(this,"setAsSpellTrap",async(e,t,i,a)=>{await this._moveTo(e,"Top",[...t,"SpellTrapSet"],i,a),this.setNonFieldPosition("Set",!0)});d(this,"activateSpellTrapFromHand",async(e,t,i,a)=>{this.setNonFieldPosition("FaceUp",!0),await this._moveTo(e,"Top",[...t,"SpellTrapActivate"],i,a)});d(this,"activateSpellTrapOnField",async()=>{this.setNonFieldPosition("FaceUp",!0)});d(this,"draw",async(e,t,i)=>{await this._moveTo(this.owner.getHandCell(),"Bottom",[...e,"Draw"],t,i),this.setNonFieldPosition("Set",!0)});d(this,"addToHand",async(e,t,i)=>{await this._moveTo(this.owner.getHandCell(),"Bottom",e,t,i),this.setNonFieldPosition("Set",!0)});d(this,"release",async(e,t,i)=>{await this.sendToGraveyard([...e,"Release"],t,i)});d(this,"destroy",async(e,t,i,a)=>{await this.sendToGraveyard([...t,e,"Destroy"],i,a)});d(this,"sendToGraveyard",async(e,t,i)=>{if(this.info.willBeBanished)return await this.banish(e,t,i);if(this.info.willReturnToDeck)return await this.banish(e,t,i);this.info.isDying=!1,this.setNonFieldPosition("FaceUp",!0);const a=this.owner.getGraveyard();await this._moveTo(a,"Top",e,t,i)});d(this,"banish",async(e,t,i)=>{if(this.info.willReturnToDeck)return await this.banish(e,t,i);this.info.isDying=!1,this.setNonFieldPosition("FaceUp",!0);const a=this.owner.getBanished();await this._moveTo(a,"Top",e,t,i),this.info.willBeBanished=!1});d(this,"banishTemporarily",async(e,t,i)=>{if(this.info.willBeBanished)return await this.banish(e,t,i);if(this.info.willReturnToDeck)return await this.banish(e,t,i);throw this.initForTurn(),new Error("not implemented")});d(this,"returnToDeck",async(e,t,i,a)=>{if(this.info.willBeBanished)return await this.banish(t,i,a),this.owner.getBanished();const r=this.origin.monsterCategories&&this.origin.monsterCategories.union(Zt).length?this.owner.getExtraDeck():this.owner.getDeckCell();return this.setNonFieldPosition("Set",!1),this.resetInfo(),this.resetStatus(),await this._moveTo(r,e,t,i,a)});d(this,"_moveTo",async(e,t,i,a,r)=>{if(!e)throw new Error("illegal argument: to");if(this.field.duel.clock.turn>0&&await this.field.duel.view.waitAnimation({entity:this,to:e,index:t,count:0}),this.fieldCell.releaseEntities([this]),(this.fieldCell.cellType!==e.cellType||this.fieldCell.cellType==="ExtraMonsterZone"&&e.cellType==="MonsterZone")&&(this.wasMovedAs.reset(...new Set(i)),this.wasMovedAt=this.field.duel.clock.getClone(),this.wasMovedBy=a,this.wasMovedFrom=this.fieldCell,this.wasMovedByWhom=r),this.entityType==="Token"&&Ha.every(o=>o!==this.fieldCell.cellType)){this.field.duel.log.info(`${this.nm}は消滅した。`,this.controller);return}e.owner&&(this.controller=e.owner),e.acceptEntities([this],t)});d(this,"initForTurn",()=>{this.info.isSettingSickness=!1,this.info.attackCount=0,this.info.battlePotisionChangeCount=0});d(this,"resetInfo",()=>{var e;this._info={isDying:!1,isVanished:!1,isRebornable:((e=this.origin.monsterCategories)==null?void 0:e.union(_a).length)===0||(this.origin.canReborn??!1),isSettingSickness:!1,materials:[],willBeBanished:!1,willReturnToDeck:!1,attackCount:0,battlePotisionChangeCount:0}});d(this,"resetStatus",()=>{this._status={...JSON.parse(JSON.stringify(this.origin)),canAttack:!0,isEffective:!0,canDirectAttack:!1,attackCount:0,isSelectableForAttack:!0,canBeSyncroMaterial:!0,willBeBanished:!1}});this.seq=ge.nextEntitySeq++,this.owner=e,this.controller=t,this.fieldCell=i,this.entityType=a,this.origin=r,this._status=JSON.parse(JSON.stringify(r)),this.resetStatus(),this._info={attackCount:0,battlePotisionChangeCount:0,isDying:!1,isVanished:!1,isRebornable:!0,isSettingSickness:!1,materials:[],willBeBanished:!1,willReturnToDeck:!1},this.resetInfo(),this.face=o,this.isUnderControl=k,this.orientation=m,this.wasMovedAs=["Rule"],this.wasMovedAt=this.field.duel.clock,this.wasMovedByWhom=e,i.acceptEntities([this],"Top")}get field(){return this.owner.duel.field}get status(){return this._status}get info(){return this._info}get nm(){return this.status.name}get atk(){return this.status.attack}get def(){return this.status.defense}get lvl(){return this.status.level}get rank(){return this.status.rank}get attr(){return this.status.attribute?[this.status.attribute]:[]}get type(){return this.status.type?[this.status.type]:[]}get psL(){return[this.status.pendulumScaleL]}get psR(){return[this.status.pendulumScaleR]}get isMoveAtPreviousChain(){return this.field.duel.clock.isPreviousChain(this.wasMovedAt)}get battlePotion(){return this._battlePosition}};d(ge,"nextActionSeq",0),d(ge,"nextEntitySeq",0),d(ge,"actionDic",{}),d(ge,"createCardActionList",(e,t)=>{const i=t.map(a=>new hi(ge.nextActionSeq++,e,a));return i.forEach(a=>ge.actionDic[a.seq]=a),i}),d(ge,"createPlayerEntity",e=>{const t=e.getHandCell();return new ge(e,e,t,"Duelist",{name:e.profile.name,kind:"Monster"},"FaceUp",!0,"Vertical")}),d(ge,"createCardEntity",(e,t)=>{var o;const i=t.monsterCategories&&t.monsterCategories.union(Zt).length?e.getExtraDeck():e.getDeckCell(),a=new ge(e,e,i,"Card",t,"FaceDown",!1,"Vertical");Object.hasOwn(Se,a.origin.name)||e.duel.log.info(`未実装カード${t.name}がデッキに投入された。`,e);const r=Se[a.origin.name];return r.kind==="Monster"&&((o=r.monsterCategories)!=null&&o.includes("Normal"))?a.actions.push(...ge.createCardActionList(a,[qe,Be,Ee])):a.actions.push(...ge.createCardActionList(a,ei.get(a.origin.name)||[])),a}),d(ge,"createDammyAction",(e,t,i,a)=>({seq:ge.nextActionSeq++,title:t,entity:e,playType:"Dammy",spellSpeed:"Dammy",executableCells:[e.fieldCell.cellType],hasToTargetCards:!1,isOnlyNTimesPerDuel:0,isOnlyNTimesPerTurn:0,getClone:function(){return this},validate:()=>i,prepare:async()=>{},execute:async()=>!1,settle:async()=>!1,pos:a,cell:i[0],dragAndDropOnly:i.length>1}));let At=ge;class Oi{constructor(e,t,i,a,r){d(this,"duel");d(this,"seat");d(this,"_entity");d(this,"profile");d(this,"deckInfo");d(this,"duelistType");d(this,"lifeLog");d(this,"normalSummonCount");d(this,"specialSummonCount");d(this,"maxNormalSummonCount");d(this,"_lp");d(this,"battleDamage",(e,t)=>this.setLp(this._lp-e,t,"BattleDamage"));d(this,"effectDamage",(e,t)=>this.setLp(this._lp-e,t,"EffectDamage"));d(this,"lostLp",(e,t)=>this.setLp(this._lp-e,t,"Lost"));d(this,"payLp",(e,t)=>this.setLp(this._lp-e,t,"Pay"));d(this,"heal",(e,t)=>this.setLp(this._lp+e,t,"Heal"));d(this,"setLp",(e,t,i)=>{const a={clock:this.duel.clock,reason:i||"Set",beforeLp:this._lp,afterLp:e,entity:t};return this.lifeLog.push(a),this._lp=e,this.duel.log.info(`ライフポイント変動：${a.afterLp-a.beforeLp}（${a.beforeLp} ⇒ ${a.afterLp}）`,this),a});d(this,"getOpponentPlayer",()=>this.duel.firstPlayer===this?this.duel.secondPlayer:this.duel.firstPlayer);d(this,"getHandCell",()=>this.duel.field.getCells("Hand").filter(e=>e.owner===this)[0]);d(this,"getDeckCell",()=>this.duel.field.getCells("Deck").filter(e=>e.owner===this)[0]);d(this,"getExtraDeck",()=>this.duel.field.getCells("ExtraDeck").filter(e=>e.owner===this)[0]);d(this,"getGraveyard",()=>this.duel.field.getCells("Graveyard").filter(e=>e.owner===this)[0]);d(this,"getFieldZone",()=>this.duel.field.getCells("FieldSpellZone").filter(e=>e.owner===this)[0]);d(this,"getBanished",()=>this.duel.field.getCells("Banished").filter(e=>e.owner===this)[0]);d(this,"getMonsterZones",()=>this.duel.field.getCells("MonsterZone").filter(e=>e.owner===this));d(this,"getExtraMonsterZones",()=>this.duel.field.getCells("ExtraMonsterZone").filter(e=>{var t;return((t=e.cardEntities[0])==null?void 0:t.controller)===this}));d(this,"getSpellTrapZones",()=>this.duel.field.getCells("SpellAndTrapZone").filter(e=>e.owner===this));d(this,"getEmptyMonsterZones",()=>this.getMonsterZones().filter(e=>e.cardEntities.length===0));d(this,"getEmptyExtraZones",()=>this.getExtraMonsterZones().length===0?this.getMonsterZones().filter(e=>e.cardEntities.length===0):[]);d(this,"getAvailableMonsterZones",()=>this.getMonsterZones().filter(e=>e.isAvailable));d(this,"getAvailableExtraZones",()=>this.getExtraMonsterZones().length===0?this.duel.field.getCells("ExtraMonsterZone").filter(e=>e.isAvailable):[]);d(this,"getAvailableSpellTrapZones",()=>this.getSpellTrapZones().filter(e=>e.isAvailable));d(this,"getReleasableMonsters",()=>this.getMonstersOnField());d(this,"getMonstersOnField",()=>this.duel.field.getMonstersOnField().filter(e=>e.controller===this));d(this,"getAttackTargetMonsters",()=>this.duel.field.getMonstersOnField().filter(e=>e.status.isSelectableForAttack&&e.controller!==this));d(this,"pushDeck",()=>{this.deckInfo.cardNames.map(e=>Se[e]).filter(e=>e).forEach(e=>At.createCardEntity(this,e)),this.duel.log.info(`デッキをセット。メイン${this.getDeckCell().cardEntities.length}枚。エクストラ${this.getExtraDeck().cardEntities.length}枚。`,this)});d(this,"draw",async(e,t,i)=>{var o;if(e<1)return;const a=this.getDeckCell(),r=[];for(const k of Array(e)){if(!a.cardEntities.length)throw this.duel.log.info(r.length>0?`デッキからカードを${e}枚ドローしようとしたが、${r.length}枚しかドローできなかった。${r}`:"デッキからカードをドローできなかった。",this),this.duel.isEnded=!0,this.setLp(0),new vt(this.getOpponentPlayer());const m=a.cardEntities[0];await m.draw(t?["Effect"]:["Rule"],t,i),r.push(((o=m.origin)==null?void 0:o.name)||"!名称取得失敗!")}this.duel.log.info(`デッキからカードを${r.length}枚ドロー。${r}。`,this)});d(this,"shuffleDeck",()=>{this.getDeckCell().shuffle(),this.duel.log.info("デッキをシャッフル。",this)});d(this,"discard",async(e,t,i,a,r,o)=>{const k=r||(()=>!0),m=this.getHandCell().cardEntities.filter(k);if(m.length<e)return[];let c=[];(a||this).duelistType==="NPC"?c=m.randomPick(e):c=await this.duel.view.waitSelectEntities(a||this,m,e,u=>u.length===e,`${e}枚カードを捨てる。`,!1)||[];for(const u of c)await u.sendToGraveyard(["Discard",...t],i,o);return this.duel.log.info(`手札からカードを${c.length}枚捨てた。${c.map(u=>{var C;return(C=u.origin)==null?void 0:C.name})}。`,this),c});this.duel=e,this.seat=t,this.profile=i,this.duelistType=a,this.deckInfo=r,this.lifeLog=[],this.normalSummonCount=0,this.specialSummonCount=0,this.maxNormalSummonCount=1,this._lp=8e3}get entity(){const e=this.getHandCell().entities.find(t=>t.entityType==="Duelist");return e||At.createPlayerEntity(this)}get lp(){return this._lp}get isTurnPlayer(){return this.duel.getTurnPlayer()===this}}class zs{constructor(e){d(this,"cells");d(this,"duel");d(this,"getAllCells",()=>this.cells.flat());d(this,"getCells",(...e)=>this.getAllCells().filter(t=>e.includes(t.cellType)));d(this,"getAllEntities",()=>this.getAllCells().map(e=>e.entities).flat());d(this,"getAllCardEntities",()=>this.getAllCells().map(e=>e.cardEntities).flat());d(this,"getMonstersOnField",()=>this.getCells(...Fa).map(e=>e.cardEntities).filter(e=>e.length>0).map(e=>e[0]));d(this,"getEntiteisOnField",()=>this.getCells(...Ha).map(e=>e.cardEntities).filter(e=>e.length>0).map(e=>e[0]));d(this,"getEntities",e=>this.getAllEntities().filter(t=>t.controller===e));d(this,"sendGraveyardAtSameTime",async(e,t,i,a)=>{const r=e.reduce((k,m)=>(k[m.owner.seat].push(m),k),{Above:[],Below:[]}),o=Object.values(r).map(k=>new Promise(m=>{let c=new Promise(u=>u());for(const u of k)c=c.then(()=>u.sendToGraveyard(t,i,a));c.then(()=>m())}));await Promise.all(o)});d(this,"drawAtSameTime",async(e,t,i,a,r,o)=>{const k=[],m=[],c=[e.draw(t,r,o),i.draw(a,r,o)].map(u=>u.catch(C=>{C instanceof vt?C.winner&&k.push(C.winner):m.push(C)}));if(await Promise.all(c),m.length)throw new Pe("ドロー処理で想定されない例外が発生した。",e,t,i,a,r,...m);if(k.length!==0)throw k.length===1?new vt(k[0]):new vt});d(this,"sendToGraveyard",async(e,t,i,a,r,o,k,m)=>{if(a>0&&i.length<a)return;const c=await this.duel.view.waitSelectEntities(t,i,a,r,e,m);if(c){for(const u of c)await u.sendToGraveyard(o,k,t);return this.duel.log.info(`${c.map(u=>u.status.name).join(", ")}を墓地に送った（${o.getDistinct().join(", ")}）。`,t),c}});d(this,"release",async(e,t,i,a,r,o,k,m)=>{if(i>0&&t.length<i)return;const c=await this.duel.view.waitSelectEntities(e,t,i,C=>(k||C.length>0)&&(i<0||C.length===i),"リリースするモンスターを選択",m);if(!c)return;const u=[];for(const C of c)await C.release(["Release",a,...r],o,e),u.push(C);return this.duel.log.info(`${u.map(C=>C.status.name).join(", ")}をリリース（${[...new Set(u.flatMap(C=>C.wasMovedAs))].join(", ")}）。`,e),u});d(this,"summonMany",async(e,t,i,a,r,o,k)=>{const m=await Promise.all(e.map(async c=>this._summon(c,t(c),i(c),a,r,o,k?k(c):void 0)));if(m.find(c=>!c))throw new Pe("想定されない返却値",m);return m});d(this,"summon",async(e,t,i,a,r,o,k,m=!1)=>{const c=await this._summon(e,t,i,a,r,o,k,m);if(c)return this.duel.log.info(`${c.status.name}を召喚（${[...r,a].join(",")}）。`,k??(o==null?void 0:o.controller)??e.controller),c});d(this,"_summon",async(e,t,i,a,r,o,k,m=!1)=>{const c=k??(o==null?void 0:o.controller)??e.controller;let u=t.randomPick(1)[0],C=i.randomPick(1)[0];if((i.length>1||t.length>1)&&c.duelistType!=="NPC"){const s=i.length>1?"カードを召喚先へドラッグ。":"表示形式を選択。",p=t.map(w=>At.createDammyAction(e,w,i,w)),f=this.duel.view.modalController.selectAction(this.duel.view,{title:s,actions:p,cancelable:!1}),y=this.duel.view.waitSubAction(c,p,s,m).then(w=>w.action),l=await Promise.any([f,y]);if(!l&&!m)throw new Pe("",l);if(!l)return;C=l.cell||C,u=l.pos||u}return console.log(C,u,a,r,o),await e.summon(C,u,a,r,o,c),e});d(this,"activateSpellTrapFromHand",async(e,t,i,a,r,o=!1)=>{const k=r??(a==null?void 0:a.controller)??e.controller;let m=t.randomPick(1)[0];if(t.length>1&&k.duelistType!=="NPC"){const c=[At.createDammyAction(e,"カードの発動",t,void 0)];this.duel.view.modalController.selectAction(this.duel.view,{title:"カードを魔法罠ゾーンへドラッグ",actions:c,cancelable:!1});const u=await this.duel.view.waitSubAction(k,c,"カードを魔法罠ゾーンへドラッグ。",o),C=u.action;if(!C&&!o)throw new Pe("",u);if(!C)return;m=C.cell||m}return await e.activateSpellTrapFromHand(m,i,a,k),e});d(this,"setSpellTrap",async(e,t,i,a,r=!1)=>{let o=t[0];const k=a??(i==null?void 0:i.controller)??e.controller;if(t.length>1&&k.duelistType!=="NPC"){const m=[At.createDammyAction(e,"セット",t)],c=this.duel.view.modalController.selectAction(this.duel.view,{title:"カードをセット先へドラッグ",actions:m,cancelable:r}),u=this.duel.view.waitSubAction(k,m,"カードをセット先へドラッグ",r),C=await Promise.any([c,u.then(s=>s.action)]);if(!C&&!r)throw new Pe("",C);if(!C)return;o=C.cell||o}return await e.setAsSpellTrap(o,["SpellTrapSet"],i,k),this.duel.log.info(`${e.status.name}をセット（SpellTrapSet）。`,a??(i==null?void 0:i.controller)??e.controller),o});this.duel=e,this.cells=[...Array(7)].map(()=>[]);for(const t of Object.keys(Xn).map(Number))for(const i of Object.keys(Xn[t]).map(Number))this.cells[t][i]=new Ts(this,t,i,t<3?e.duelists.Above:t>3?e.duelists.Below:i===0?e.duelists.Above:i===6?e.duelists.Below:void 0)}}let Vs=class{constructor(e){d(this,"onUpdateEvent",new Re);d(this,"nextSeq");d(this,"records",[]);d(this,"duel");d(this,"dispose",()=>{this.onUpdateEvent.clear()});d(this,"error",e=>{console.error(e);const t=["エラー発生"];e instanceof Error?(e instanceof Pe&&(t.push("-- エラーメッセージ --"),t.push(e.message),t.push("-- 関連オブジェクト --"),e.items.forEach(i=>t.push(JSON.stringify(i)))),t.push("-- エラー名称 --"),t.push(e.name||"エラー名称取得失敗"),t.push("-- スタックトレース --"),t.push(e.stack||"スタックトレース取得失敗")):(t.push("-- エラー型特定失敗 --"),t.push(JSON.stringify(e))),this.info(t)});d(this,"info",(e,t)=>{const i=Array.isArray(e)?e.join(`
`):e;this.records.push({seq:this.nextSeq++,turn:this.duel.clock.turn,phase:this.duel.phase,phaseStep:this.duel.phaseStep,clock:this.duel.clock,duelist:t,text:i}),this.onUpdateEvent.trigger()});this.nextSeq=0,this.duel=e}get onUpdate(){return this.onUpdateEvent.expose()}};const Zi=["DuelEntitiesSelector","DuelActionSelector","DuelTextSelector"];class Qs{constructor(e){d(this,"onUpdateEvent",new Re);d(this,"states");d(this,"view");d(this,"cancelAll",()=>{Zi.forEach(e=>this.states[e]="Disable"),console.info(this,"cancelAll"),this.onUpdateEvent.trigger()});d(this,"duelEntitiesSelectorArg",{title:"対象を選択",entities:[],validator:()=>!0,qty:-1,cancelable:!1});d(this,"duelEntitiesSelectorValue");d(this,"duelEntitiesSelectorResolve",()=>{});d(this,"selectDuelEntities",async e=>(this.duelEntitiesSelectorArg=e,this.states.DuelEntitiesSelector="Shown",this.onUpdateEvent.trigger(),new Promise(t=>{this.duelEntitiesSelectorResolve=i=>{this.states.DuelEntitiesSelector="Disable",this.onUpdateEvent.trigger(),t(i)}})));d(this,"cardActionSelectorArg",{title:"カード操作を選択。",actions:[],cancelable:!1});d(this,"cardActionSelectorResolve",()=>{});d(this,"cardActionSelectorValue");d(this,"selectAction",async(e,t)=>(this.cardActionSelectorArg=t,this.states.DuelActionSelector="Shown",e.onWaitEnd.append(this.cancelAll),this.onUpdateEvent.trigger(),new Promise(i=>{this.cardActionSelectorResolve=a=>{console.log(a),this.states.DuelActionSelector="Disable",e.onWaitEnd.remove(this.cancelAll),this.onUpdateEvent.trigger(),i(a)}})));d(this,"duelTextSelectorArg",{title:"カード操作を選択。",choises:[],cancelable:!1});d(this,"duelTextSelectorResolve",()=>{});d(this,"duelTextSelectorValue");d(this,"selectText",async(e,t)=>(this.duelTextSelectorArg=t,this.states.DuelTextSelector="Shown",e.onWaitEnd.append(this.cancelAll),this.onUpdateEvent.trigger(),new Promise(i=>{this.duelTextSelectorResolve=a=>{console.log(a),this.states.DuelTextSelector="Disable",e.onWaitEnd.remove(this.cancelAll),this.onUpdateEvent.trigger(),i(a)}})));this.view=e,this.states=Zi.reduce((t,i)=>(t[i]="Disable",t),{})}get onUpdate(){return this.onUpdateEvent.expose()}}class Js{constructor(e){d(this,"onDuelUpdateEvent",new Re);d(this,"requireUpdate",()=>{this.onDuelUpdateEvent.trigger()});d(this,"onWaitStartEvent",new Re);d(this,"onWaitEndEvent",new Re);d(this,"onDragStartEvent",new Re);d(this,"onDragEndEvent",new Re);d(this,"onAnimationStartEvent",new Re);d(this,"onShowCardEntityEvent",new Re);d(this,"duel");d(this,"modalController");d(this,"message");d(this,"waitMode");d(this,"infoBoardState");d(this,"infoBoardCell");d(this,"getCell",(e,t)=>this.duel.field.cells[e][t]);d(this,"showCardInfo",e=>{this.onShowCardEntityEvent.trigger(e)});d(this,"dispose",()=>{this.onDragStartEvent.clear(),this.onDragEndEvent.clear(),this.onDuelUpdateEvent.clear(),this.onWaitStartEvent.clear(),this.onWaitEndEvent.clear()});d(this,"waitFieldAction",async(e,t)=>{if(console.log(e),this.duel.getTurnPlayer().duelistType==="NPC"){const i=e.toSorted((a,r)=>(r.entity.atk||0)-(a.entity.atk||0)).find(a=>a.playType==="NormalSummon"||a.playType==="SpecialSummon"||a.playType==="CardActivation");return i?{action:i}:{phaseChange:this.duel.nextPhaseList[0]}}return await this._waitDuelistAction(e,"SelectFieldAction",t)});d(this,"waitQuickEffect",async(e,t,i)=>{if(e.length===0)return;const a=[];return a.push(this.modalController.selectAction(this,{title:t,actions:e,cancelable:i}).then(r=>r&&r)),a.push(this._waitDuelistAction(e,"SelectAction",this.message).then(r=>r.action)),await Promise.any(a)});d(this,"waitSubAction",async(e,t,i,a=!1)=>{if(e.duelistType==="NPC")throw Error("Not implemented");return await this._waitDuelistAction(t,"SelectAction",i,void 0,void 0,void 0,a)});d(this,"waitSelectEntities",async(e,t,i,a,r,o=!1)=>{let k=[];if(i&&t.length===i)return[...t];if(e.duelistType==="NPC"){for(;!a(k);){const c=i&&i>0?i:Math.floor(Math.random()*t.length)+1;k=t.randomPick(c)}return k}this.waitMode=t.every(c=>(c.fieldCell.cellType==="MonsterZone"||c.fieldCell.cellType==="ExtraMonsterZone")&&c.getIndexInCell()===0||c.fieldCell.cellType==="Hand"&&c.controller===e)?"SelectFieldEntities":"SelectEntities",console.log(this.waitMode);const m=await this._waitDuelistAction([],this.waitMode,r,t,i,a,o);return console.log(m),m.selectedEntities});d(this,"_waitDuelistAction",async(e,t,i,a,r,o,k=!1)=>{this.waitMode=t,this.message=i,this.onDuelUpdateEvent.trigger();const m=await new Promise(c=>{const u={resolve:c,enableActions:e,qty:r,entitiesValidator:o||(()=>!1),selectableEntities:a||[]};console.log(a),console.log(o),console.log(this.waitMode),console.log(this.waitMode==="SelectEntities"),a&&o&&this.waitMode==="SelectEntities"&&(u.duelEntitiesSelectorArg={title:i,entities:a,validator:o,qty:r??-1,cancelable:!1}),console.log(u),this.onWaitStartEvent.trigger(u)});if(this.waitMode="None",this.onWaitEndEvent.trigger(),m.surrender)throw new vt(this.duel.duelists.Above);if(!k&&m.cancel)throw new Pe("キャンセル不可のアクションがキャンセルされた。",m,e,t,a);return m});d(this,"waitSelectSummonDest",async(e,t,i,a)=>{const r=t.length>1?"カードを召喚先へドラッグ。":"表示形式を選択。",o=i.map(u=>At.createDammyAction(e,u,t,u)),k=this.modalController.selectAction(e.field.duel.view,{title:r,actions:o,cancelable:!1}),m=this.waitSubAction(e.controller,o,r,a).then(u=>u.action),c=await Promise.any([k,m]);if(!c&&!a)throw new Pe("キャンセル不可のアクションがキャンセルされた。",c);if(c){if(!c.cell)throw new Pe("召喚先のセルが指定されなかった。",c);if(!c.pos)throw new Pe("表示形式が指定されなかった。",c);return{dest:c.cell,pos:c.pos}}});d(this,"waitSelectText",async(e,t,i=!1)=>this.duel.view.modalController.selectText(this.duel.view,{title:t,choises:e,cancelable:i}));d(this,"waitAnimation",async e=>(this.onDuelUpdateEvent.trigger(),new Promise(t=>this.onAnimationStartEvent.trigger({...e,resolve:t}))));d(this,"setDraggingActions",e=>{this.onDragStartEvent.trigger(e),this.requireUpdate()});d(this,"removeDraggingActions",()=>{this.onDragEndEvent.trigger()});this.duel=e,this.message="",this.waitMode="None",this.infoBoardState="Log",this.infoBoardCell=e.duelists.Below.getExtraDeck(),this.modalController=new Qs(this)}get onDuelUpdate(){return this.onDuelUpdateEvent.expose()}get onWaitStart(){return this.onWaitStartEvent.expose()}get onWaitEnd(){return this.onWaitEndEvent.expose()}get onDragStart(){return this.onDragStartEvent.expose()}get onDragEnd(){return this.onDragEndEvent.expose()}get onAnimation(){return this.onAnimationStartEvent.expose()}get onShowCardEntity(){return this.onShowCardEntityEvent.expose()}}class Xs{constructor(){d(this,"_turn",0);d(this,"_phaseSeq",0);d(this,"_stepSeq",0);d(this,"_chainSeq",0);d(this,"_chainBlockSeq",0);d(this,"_procSeq",0);d(this,"_procTotalSeq",0);d(this,"incrementTurn",()=>{this._turn++,this._phaseSeq=0,this._stepSeq=0,this._chainSeq=0,this._chainBlockSeq=0,this._procSeq=0});d(this,"incrementPhaseSeq",()=>{this._phaseSeq++,this._stepSeq=0,this._chainSeq=0,this._chainBlockSeq=0,this._procSeq=0});d(this,"incrementStepSeq",()=>{this._stepSeq++,this._chainSeq=0,this._chainBlockSeq=0,this._procSeq=0});d(this,"incrementChainSeq",()=>{this._chainSeq++,this._chainBlockSeq=0,this._procSeq=0});d(this,"incrementChainBlockSeq",()=>{this._chainBlockSeq++,this._procSeq=0});d(this,"incrementProcSeq",()=>{this._procSeq++,this._procTotalSeq++});d(this,"toString",()=>`${this.procTotalSeq}(t${this.turn}-p${this.phaseSeq}-ps${this.stepSeq}-c${this.chainSeq}-cb${this.chainBlockSeq}-p${this.procSeq})`);d(this,"getClone",()=>({turn:this.turn,phaseSeq:this.phaseSeq,stepSeq:this.stepSeq,chainSeq:this.chainSeq,chainBlockSeq:this.chainBlockSeq,procSeq:this.procSeq,procTotalSeq:this.procTotalSeq}));d(this,"isSameChain",e=>this.turn===e.turn&&this.phaseSeq===e.phaseSeq&&this.stepSeq===e.stepSeq&&this.chainSeq===e.chainSeq);d(this,"isPreviousChain",e=>this.turn===e.turn&&this.phaseSeq===e.phaseSeq&&this.stepSeq===e.stepSeq&&this.chainSeq===e.chainSeq+1);d(this,"isPreviousProc",e=>this.procTotalSeq===e.procTotalSeq+1)}get turn(){return this._turn}get phaseSeq(){return this._phaseSeq}get stepSeq(){return this._stepSeq}get chainSeq(){return this._chainSeq}get chainBlockSeq(){return this._chainBlockSeq}get procSeq(){return this._procSeq}get procTotalSeq(){return this._procTotalSeq}}class eo{constructor(e){d(this,"nextSeq");d(this,"records",[]);d(this,"duel");d(this,"push",(e,t)=>{this.records.push({seq:this.nextSeq++,turn:this.duel.clock.turn,activater:e,cardAction:t})});this.nextSeq=0,this.duel=e}}class vt extends Error{constructor(t){const i=t?`デュエルが終了した。勝者：${t.profile.name}`:"デュエルが終了した。ドロー。";super(i);d(this,"winner");this.winner=t}}class Pe extends Error{constructor(t,...i){super(t);d(this,"message");d(this,"items");this.message=t,this.items=i}}class fi extends Pe{constructor(...e){super("キャンセル不可のアクションがキャンセルされた。",...e)}}class to{constructor(e,t,i,a,r,o){d(this,"view");d(this,"log");d(this,"cardActionLog");d(this,"clock");d(this,"phase");d(this,"phaseStep");d(this,"nextPhaseList");d(this,"field");d(this,"attackingMonster");d(this,"targetForAttack");d(this,"_chainBlockInfos");d(this,"duelists");d(this,"priorityHolder");d(this,"isEnded");d(this,"coin",!1);d(this,"getTurnPlayer",()=>this.clock.turn%2===0?this.secondPlayer:this.firstPlayer);d(this,"getNonTurnPlayer",()=>this.clock.turn%2===0?this.firstPlayer:this.secondPlayer);d(this,"main",async()=>{console.info("main start!"),this.coin=Math.random()>.5,this.priorityHolder=this.firstPlayer,this.log.info("【デュエル開始】"),this.log.info(`先攻：${this.firstPlayer.profile.name}`),Object.values(this.duelists).forEach(e=>e.pushDeck()),Object.values(this.duelists).forEach(e=>e.shuffleDeck()),await Promise.all(Object.values(this.duelists).map(e=>e.draw(5,void 0,void 0))),this.moveNextPhase("draw"),this.view.requireUpdate();try{for(;!this.isEnded&&(this.phase==="draw"?await this.procDrawPhase():this.phase==="standby"?await this.procStanbyPhase():this.phase==="main1"?await this.procMainPhase():this.phase==="battle"?await this.procBattlePhase():this.phase==="main2"?await this.procMainPhase():this.phase==="end"&&await this.procEndPhase(),!(this.clock.turn>1e3)););}catch(e){e instanceof vt?(console.info(e),this.isEnded=!0,this.log.info(e.winner?`デュエル終了。勝者${e.winner.profile.name}`:"引き分け")):e instanceof Error&&this.log.error(e)}finally{this.view.requireUpdate(),this.view.dispose(),this.log.dispose()}});d(this,"moveNextPhase",e=>{this.clock.turn<1?this.phase="draw":e==="draw"?this.log.info("ターン終了。",this.getTurnPlayer()):this.log.info(`フェイズ移行（${this.phase}→${e}）`,this.getTurnPlayer()),e==="draw"?this.clock.incrementTurn():this.clock.incrementPhaseSeq(),this.phase=e,this.phaseStep=void 0,this.phase==="main2"||this.clock.turn===1?this.nextPhaseList=["end"]:this.phase==="battle"?this.nextPhaseList=["main2"]:this.phase==="main1"?this.nextPhaseList=["battle","end"]:this.nextPhaseList=[]});d(this,"declareAnAttack",(e,t)=>{this.attackingMonster=e,this.targetForAttack=t,e.info.attackCount++,this.log.info(`攻撃宣言：${e.status.name} ⇒ ${t.status.name}`,e.controller)});d(this,"procDrawPhase",async()=>{for(Object.values(this.duelists).forEach(e=>{e.normalSummonCount=0,e.specialSummonCount=0}),this.log.info("ドローフェイズ開始。",this.getTurnPlayer()),this.clock.turn===1?this.log.info("先攻プレイヤーはドローできない。",this.getTurnPlayer()):await this.getTurnPlayer().draw(1,void 0,void 0);await this.procChainBlock(void 0,void 0););this.field.getEntiteisOnField().forEach(e=>e.initForTurn()),this.moveNextPhase("standby")});d(this,"procStanbyPhase",async()=>{for(;await this.procChainBlock(void 0,void 0););this.moveNextPhase("main1")});d(this,"procMainPhase",async()=>{for(;;){this.priorityHolder=this.getTurnPlayer();const e=await this.view.waitFieldAction(this.getEnableActions(["NormalSummon","SpellTrapSet","SpecialSummon","ChangeBattlePosition","IgnitionEffect","QuickEffect","CardActivation"],["Normal","Quick","Counter"],[]),"あなたの手番です。");if(console.log(e),e&&e.action){if([...Gs].includes(e.action.playType)){console.log("is not chainable",e);const i=await e.action.prepare(e.action.cell,[],!0);if(i===void 0)continue;await e.action.execute(this.priorityHolder,i,this.chainBlockInfos),this.clock.incrementChainSeq()}else console.log("is chainable",e),await this.procChainBlock(e.action,void 0);for(;await this.procChainBlock(void 0,void 0););continue}const t=e.phaseChange;if(t){this.priorityHolder=this.getNonTurnPlayer();const i=await this.view.waitQuickEffect(this.getEnableActions(["QuickEffect","TriggerEffect"],["Quick","Counter"],[]),"",!0);if(i){for(await this.procChainBlock(i,void 0);await this.procChainBlock(void 0,void 0););continue}this.moveNextPhase(t);return}}});d(this,"procBattlePhase",async()=>{await this.procBattlePhaseStartStep(),await this.procBattlePhaseBattleStep(),await this.procBattlePhaseEndStep()});d(this,"procBattlePhaseStartStep",async()=>{for(this.phaseStep="start",this.priorityHolder=this.getTurnPlayer(),this.attackingMonster=void 0,this.targetForAttack=void 0;await this.procChainBlock(void 0,void 0););});d(this,"procBattlePhaseBattleStep",async()=>{for(;;){this.phaseStep="battle",this.priorityHolder=this.getTurnPlayer();const e=await this.view.waitFieldAction(this.getEnableActions(["Battle"],["Normal"],[]),"攻撃モンスターと対象を選択。");if(e.phaseChange)break;if(e.action){const t=await e.action.prepare(e.action.cell,[],!0);if(!t)continue;for(await e.action.execute(this.priorityHolder,t,[]),this.clock.incrementChainSeq();await this.procChainBlock(void 0,void 0););this.clock.incrementStepSeq(),await this.procBattlePhaseDamageStep()}}this.clock.incrementStepSeq()});d(this,"procBattlePhaseDamageStep",async()=>{this.phaseStep="damage";const e=this.attackingMonster,t=this.targetForAttack;if(!e||!e.atk)throw new Pe("想定されない状態",this.attackingMonster,this.targetForAttack);this.log.info("ダメージステップ開始時",this.getTurnPlayer()),this.log.info("ダメージ計算前",this.getTurnPlayer()),(t==null?void 0:t.battlePotion)==="Set"&&t.setBattlePosition("Defense"),this.log.info("ダメージ計算時",this.getTurnPlayer());const i=e.atk,a=((t==null?void 0:t.battlePotion)==="Attack"?t.atk:t==null?void 0:t.def)||0;!t||t.entityType==="Duelist"?e.controller.getOpponentPlayer().battleDamage(i-a,e):i>0&&i>a?(t.battlePotion==="Attack"&&e.controller.getOpponentPlayer().battleDamage(i-a,e),t.info.isDying=!0):i<a?(e.controller.battleDamage(a-i,t),t.battlePotion==="Attack"&&(e.info.isDying=!0)):i===a&&t.battlePotion==="Attack"&&(e.info.isDying=!0,t.info.isDying=!0);const r=Object.values(this.duelists).filter(o=>o.lp<=0);if(r.length>0)throw new vt(Object.values(this.duelists).filter(o=>!r.includes(o)).pop());for(t&&e.info.isDying&&t.info.isDying&&e.owner!==t.owner?await Promise.all([e.destroy("BattleDestroy",[],t,t==null?void 0:t.controller),t.destroy("BattleDestroy",[],e,e.controller)]):(e.info.isDying&&await e.destroy("BattleDestroy",[],t,t==null?void 0:t.controller),t!=null&&t.info.isDying&&await t.destroy("BattleDestroy",[],e,e.controller)),this.clock.incrementChainSeq(),this.log.info("ダメージ計算後",this.getTurnPlayer());await this.procChainBlock(void 0,void 0););this.log.info("ダメージステップ終了時",this.getTurnPlayer()),this.clock.incrementStepSeq()});d(this,"procBattlePhaseEndStep",async()=>{for(this.phaseStep="end",this.priorityHolder=this.getTurnPlayer();await this.procChainBlock(void 0,void 0););this.moveNextPhase("main2")});d(this,"procEndPhase",async()=>{for(;await this.procChainBlock(void 0,void 0););for(;;){const t=this.getTurnPlayer().getHandCell().cardEntities.length;if(t<7)break;await this.getTurnPlayer().discard(t-6,["Rule"])}this.moveNextPhase("draw")});d(this,"procChainBlock",async(e,t)=>{const i=this.clock.chainBlockSeq===0;let a=t??Object.values(this.duelists).flatMap(k=>(this.priorityHolder=k,this.getEnableActions(["TriggerMandatoryEffect","TriggerEffect"],["Normal"],[]))),r=!1,o;if(e)o=e,r=!0;else if(a.length>0){const k=await this.selectTriggerEffect(a);k&&(a=a.filter(m=>m!==k),o=k,r=!0)}if(!r){let k=0;for(;k<2;){this.priorityHolder=this.priorityHolder.getOpponentPlayer();const m=await this.view.waitQuickEffect(this.getEnableActions(["QuickEffect","CardActivation"],["Quick","Counter"],this.chainBlockInfos),"クイックエフェクト発動タイミング。効果を発動しますか？",!0);if(m){o=m,r=!0;break}k++}}if(console.info("selected action: ",o),o){const k=o.entity.controller,m=this.clock.chainBlockSeq+1;this.log.info(`チェーン${m}: ${Pt(o)}を発動`,k);const c=await o.prepare(o.cell,this.chainBlockInfos,!1);if(!c)throw new fi(o);this._chainBlockInfos.push(c),console.log(this.chainBlockInfos),this.clock.incrementProcSeq(),this.clock.incrementChainBlockSeq(),await this.procChainBlock(void 0,a.filter(u=>u.seq!==(o==null?void 0:o.seq))),this.log.info(`チェーン${m}: ${Pt(o)}の効果処理。`,k),console.log(c),c.isNegatedActivationBy?this.log.info(`チェーン${m}: ${Pt(o)}を${Pt(c.isNegatedActivationBy)}によって発動を無効にした。`,c.activator):c.isNegatedEffectBy?this.log.info(`チェーン${m}: ${Pt(o)}を${Pt(c.isNegatedEffectBy)}によって効果を無効にした。`,c.activator):await o.execute(k,c,this.chainBlockInfos),this.clock.incrementProcSeq(),i&&(await Promise.all(this.field.getAllCells().filter(u=>u.cellType==="SpellAndTrapZone").flatMap(u=>u.entities).filter(u=>u.info.isDying).map(u=>u.sendToGraveyard(["Rule"],void 0,void 0))),this._chainBlockInfos.reset(),this.clock.incrementChainSeq())}return r});d(this,"selectTriggerEffect",async e=>{if(e.length>0)for(const t of["TriggerMandatoryEffect","TriggerEffect"])for(const i of[this.getTurnPlayer(),this.getNonTurnPlayer()]){this.priorityHolder=i;const a=e.filter(o=>o.playType===t&&o.entity.controller===i);if(a.length===0)continue;if(a.length===1&&t==="TriggerMandatoryEffect")return console.log(a[0]),a[0];const r=await this.view.waitQuickEffect(a,"効果を選択。",t==="TriggerEffect");if(r)return r}});d(this,"getEnableActions",(e,t,i)=>this.field.getAllCardEntities().filter(a=>a.controller===this.priorityHolder).flatMap(a=>a.actions).filter(a=>a.executableCells.includes(a.entity.fieldCell.cellType)).filter(a=>e.includes(a.playType)).filter(a=>t.includes(a.spellSpeed)).filter(a=>a.validate(i)));this.phase="end",this.clock=new Xs,this.nextPhaseList=[],this.isEnded=!1,this.duelists={Below:new Oi(this,"Below",e,t,i),Above:new Oi(this,"Above",a,r,o)},this.priorityHolder=this.firstPlayer,this._chainBlockInfos=[],this.field=new zs(this),this.view=new Js(this),this.log=new Vs(this),this.cardActionLog=new eo(this)}get chainBlockInfos(){return this._chainBlockInfos}get firstPlayer(){return this.coin?this.duelists.Below:this.duelists.Above}get secondPlayer(){return this.coin?this.duelists.Above:this.duelists.Below}}const no=()=>{const n=[],e={title:"特殊召喚",playType:"SpecialSummon",spellSpeed:"Normal",executableCells:["Hand"],validate:l=>{const w=l.field.getMonstersOnField();if(w.length==0||w.some(T=>T.controller===l.controller))return;const D=l.controller.getAvailableMonsterZones();return D.length>0?D:void 0},prepare:(l,w,D,T)=>Wi(l,w,["Attack","Defense"],[],T),execute:Li,settle:async()=>!0},t={name:"サイバー・ドラゴン",actions:[qe,Be,Ee,e]};n.push(t);const i={name:"六武衆のご隠居",actions:[qe,Be,Ee,e]};n.push(i);const a={name:"ジャンク・フォアード",actions:[qe,Be,Ee,{title:"特殊召喚",playType:"SpecialSummon",spellSpeed:"Normal",executableCells:["Hand"],validate:l=>{const w=l.controller.getAvailableMonsterZones();return w.length>0?w:void 0},prepare:(l,w,D,T)=>Wi(l,w,["Attack","Defense"],[],T),execute:Li,settle:async()=>!0}]};n.push(a);const r={name:"アンノウン・シンクロン",actions:[qe,Be,Ee,{...e,isOnlyNTimesPerDuel:1}]};n.push(r);const o={name:"Ｄ－ＨＥＲＯ ディアボリックガイ",actions:[qe,Be,Ee,{title:"①リクルート",playType:"IgnitionEffect",spellSpeed:"Normal",executableCells:["Graveyard"],validate:l=>l.controller.getDeckCell().cardEntities.filter(D=>D.nm==="Ｄ－ＨＥＲＯ ディアボリックガイ").length===0?void 0:l.controller.getAvailableMonsterZones().length>0?[]:void 0,prepare:async l=>(await l.banish(["Cost"],l,l.controller),{selectedEntities:[],chainBlockTags:["SpecialSummonFromDeck"],prepared:void 0}),execute:async(l,w)=>{const D=w.getAvailableMonsterZones();if(!D.length)return!1;const T=w.getDeckCell().cardEntities.find(S=>S.nm==="Ｄ－ＨＥＲＯ ディアボリックガイ");return T?(await l.field.summon(T,["Attack","Defense"],D,"SpecialSummon",["Effect"],l,w,!1),w.specialSummonCount++,!0):!1},settle:async()=>!0}]};n.push(o);const k={name:"ゾンビキャリア",actions:[qe,Be,Ee,{title:"①自己再生",playType:"IgnitionEffect",spellSpeed:"Normal",executableCells:["Graveyard"],validate:l=>l.controller.getHandCell().cardEntities.length===0?void 0:l.controller.getAvailableMonsterZones().length>0?[]:void 0,prepare:async l=>{const w=l.controller.getHandCell().cardEntities,D=await l.controller.duel.view.waitSelectEntities(l.controller,w,1,T=>T.length===1,"デッキトップに戻すカードを一枚選択。");if(!D)throw new Pe("キャンセル不可の行動がキャンセルされた。",l);return await D[0].returnToDeck("Top",["Cost"],l,l.controller),{selectedEntities:[],chainBlockTags:["SpecialSummonFromGraveyard"],prepared:void 0}},execute:async(l,w)=>{if(w.duel.clock.isSameChain(l.wasMovedAt))return!1;const D=l.controller.getAvailableMonsterZones();return D.length===0?!1:(await l.field.summon(l,["Attack","Defense"],D,"SpecialSummon",["Effect"],l,w,!1),l.info.willBeBanished=!0,w.specialSummonCount++,!0)},settle:async()=>!0}]};n.push(k);const m={name:"グローアップ・バルブ",actions:[qe,Be,Ee,{title:"①自己再生",playType:"IgnitionEffect",spellSpeed:"Normal",executableCells:["Graveyard"],isOnlyNTimesPerDuel:1,validate:l=>l.controller.getDeckCell().cardEntities.length===0?void 0:l.controller.getAvailableMonsterZones().length>0?[]:void 0,prepare:async l=>(await l.controller.getDeckCell().cardEntities[0].sendToGraveyard(["Cost"],l,l.controller),{selectedEntities:[],chainBlockTags:["SpecialSummonFromGraveyard"],prepared:void 0}),execute:async(l,w)=>{if(w.duel.clock.isSameChain(l.wasMovedAt))return!1;const D=l.controller.getAvailableMonsterZones();return D.length===0?!1:(await l.field.summon(l,["Attack","Defense"],D,"SpecialSummon",["Effect"],l,w),w.specialSummonCount++,!0)},settle:async()=>!0}]};n.push(m);const c={name:"終末の騎士",actions:[qe,Be,Ee,{title:"①墓地送り",playType:"TriggerEffect",spellSpeed:"Normal",executableCells:["MonsterZone"],canExecuteOnDamageStep:!0,validate:l=>{if(l.wasMovedAs.union(["SpecialSummon","NormalSummon"]).length!==0&&l.field.duel.clock.isPreviousChain(l.wasMovedAt)&&l.controller.getDeckCell().cardEntities.filter(w=>w.attr.includes("Dark")).length!==0)return[]},prepare:async()=>({selectedEntities:[],chainBlockTags:["SendToGraveyardFromDeck"],prepared:void 0}),execute:async(l,w)=>{const D=l.controller.getDeckCell().cardEntities.filter(T=>T.attr.includes("Dark"));return D.length===0?!1:(await l.field.sendToGraveyard("墓地に送るモンスターを選択",w,D,1,T=>T.length===1,["Effect"],l,!1),w.shuffleDeck(),!0)},settle:async()=>!0}]};n.push(c);const u={name:"マスマティシャン",actions:[qe,Be,Ee,{title:"①墓地送り",playType:"TriggerEffect",spellSpeed:"Normal",executableCells:["MonsterZone"],validate:l=>{if(l.wasMovedAs.includes("NormalSummon")&&l.isMoveAtPreviousChain&&l.controller.getDeckCell().cardEntities.find(w=>(w.lvl??5)<5))return[]},prepare:async()=>({selectedEntities:[],chainBlockTags:["SendToGraveyardFromDeck"],prepared:void 0}),execute:async(l,w)=>{const D=l.controller.getDeckCell().cardEntities.filter(T=>(T.lvl??5)<5);return D.length===0?!1:(await l.field.sendToGraveyard("墓地に送るモンスターを選択",w,D,1,T=>T.length===1,["Effect"],l,!1),w.shuffleDeck(),!0)},settle:async()=>!0},{title:"②ドロー",playType:"TriggerEffect",spellSpeed:"Normal",executableCells:["Graveyard"],canExecuteOnDamageStep:!0,validate:l=>{if(l.wasMovedAs.includes("BattleDestroy")&&l.isMoveAtPreviousChain&&l.controller.getDeckCell().cardEntities.length!==0)return[]},prepare:async()=>({selectedEntities:[],chainBlockTags:["AddToHandFromDeck"],prepared:void 0}),execute:async(l,w)=>(await w.draw(1,l,w),!0),settle:async()=>!0}]};n.push(u);const C={name:"大地の騎士ガイアナイト",actions:[Be,Ee,Ri()]};n.push(C),n.push({...C,name:"スクラップ・デスデーモン"});const s={name:"ナチュル・ガオドレイク",actions:[Be,Ee,Ri(l=>l.length===1&&l.every(w=>w.attr.some(D=>D==="Earth")),l=>l.length>0&&l.every(w=>w.attr.some(D=>D==="Earth")))]};n.push(s);const p={name:"ライトロード・ビースト ウォルフ",actions:[Be,Ee,{title:"①自己再生",playType:"TriggerMandatoryEffect",spellSpeed:"Normal",executableCells:["Graveyard"],validate:l=>{var w;if(l.field.duel.clock.isPreviousChain(l.wasMovedAt)&&((w=l.wasMovedFrom)==null?void 0:w.cellType)==="Deck")return l.controller.getAvailableMonsterZones().length>0?[]:void 0},prepare:async()=>({selectedEntities:[],chainBlockTags:["SpecialSummonFromGraveyard"],prepared:void 0}),execute:async(l,w)=>{if(w.duel.clock.isSameChain(l.wasMovedAt))return!1;const D=l.controller.getAvailableMonsterZones();return!D.length||l.fieldCell.cellType!=="Graveyard"&&l.fieldCell.cellType!=="Banished"||l.face==="FaceDown"?!1:(await l.field.summon(l,["Attack","Defense"],D,"SpecialSummon",["Effect"],l),l.controller.specialSummonCount++,!0)},settle:async()=>!0}]};n.push(p);const f={name:"伝説の白石",actions:[Be,Ee,qe,{title:"①サーチ",playType:"TriggerEffect",spellSpeed:"Normal",executableCells:["Graveyard"],validate:l=>{var w;if(l.field.duel.clock.isPreviousChain(l.wasMovedAt)&&((w=l.wasMovedFrom)==null?void 0:w.cellType)!=="Banished")return l.controller.getDeckCell().cardEntities.find(D=>D.nm==="青眼の白龍")?[]:void 0},prepare:async()=>({selectedEntities:[],chainBlockTags:["AddToHandFromDeck"],prepared:void 0}),execute:async(l,w)=>{const D=w.getDeckCell().cardEntities.find(T=>T.nm==="青眼の白龍");return D?(await D.addToHand(["Effect"],l,w),w.shuffleDeck(),!0):!1},settle:async()=>!0}]};return n.push(f),[{name:"灰流うらら",chainBlockTags:["AddToHandFromDeck","SendToGraveyardFromDeck","SpecialSummonFromDeck"]},{name:"屋敷わらし",chainBlockTags:["SendToGraveyardFromDeck","SpecialSummonFromGraveyard","AddToHandFromGraveyard"]}].forEach(l=>{n.push({name:l.name,actions:[Be,Ee,qe,{title:"①無効化",playType:"QuickEffect",spellSpeed:"Quick",executableCells:["Hand"],isOnlyNTimesPerTurn:!0,validate:(w,D)=>{if(D.length===0)return;const T=D.slice(-1)[0];return console.log(T),T.chainBlockTags.union(l.chainBlockTags).length>0?[]:void 0},prepare:async(w,D,T)=>(await w.sendToGraveyard(["Discard","Cost"],w,w.controller),{selectedEntities:[],chainBlockTags:["NegateCardEffect"],prepared:T.length}),execute:async(w,D,T,S)=>{const W=S[T.prepared-1];return W.isNegatedEffectBy=T.action,!0},settle:async()=>!0}]})}),[{name:"キラー・ポテト",filter:l=>l.attr.includes("Dark")&&(l.atk??9999)<=1500,qtyList:[1],posList:["Attack"],destoryTypes:["EffectDestroy"],executableCells:["Graveyard"]},{name:"キラー・トマト",filter:l=>l.attr.includes("Dark")&&(l.atk??9999)<=1500,qtyList:[1],posList:["Attack"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"巨大ネズミ",filter:l=>l.attr.includes("Earth")&&(l.atk??9999)<=1500,qtyList:[1],posList:["Attack"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"グリズリーマザー",filter:l=>l.attr.includes("Water")&&(l.atk??9999)<=1500,qtyList:[1],posList:["Attack"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"シャインエンジェル",filter:l=>l.attr.includes("Light")&&(l.atk??9999)<=1500,qtyList:[1],posList:["Attack"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"ドラゴンフライ",filter:l=>l.attr.includes("Wind")&&(l.atk??9999)<=1500,qtyList:[1],posList:["Attack"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"ＵＦＯタートル",filter:l=>l.attr.includes("Fire")&&(l.atk??9999)<=1500,qtyList:[1],posList:["Attack"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"荒野の女戦士",filter:l=>l.attr.includes("Earth")&&l.type.includes("Warrior")&&(l.atk??9999)<=1500,qtyList:[1],posList:["Attack"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"リトル・トルーパー",filter:l=>l.type.includes("Warrior")&&(l.lvl??9999)<3,qtyList:[1],posList:["Set"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard","Banished"]},{name:"破面竜",filter:l=>l.type.includes("Warrior")&&(l.def??9999)<=1500,qtyList:[1],posList:["Attack","Defense"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"共鳴虫",filter:l=>l.type.includes("Insect")&&(l.atk??9999)<=1500,qtyList:[1],posList:["Attack","Defense"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"ピラミッド・タートル",filter:l=>l.type.includes("Zombie")&&(l.def??9999)<=2e3,qtyList:[1],posList:["Attack","Defense"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"ユーフォロイド",filter:l=>l.type.includes("Machine")&&(l.atk??9999)<=1500,qtyList:[1],posList:["Attack"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"ヘル・セキュリティ",filter:l=>l.type.includes("Fiend")&&(l.lvl??9999)===1,qtyList:[1],posList:["Attack","Defense"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"ガスタ・イグル",filter:l=>(l.status.nameTags??[]).includes("ガスタ")&&(l.status.monsterCategories??[]).includes("Tuner"),qtyList:[1],posList:["Attack","Defense"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"幻影の魔術士",filter:l=>(l.status.nameTags??[]).includes("ＨＥＲＯ")&&(l.atk??9999)<=1e3,qtyList:[1],posList:["Defense"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"ジェネクス・サーチャー",filter:l=>(l.status.nameTags??[]).includes("ジェネクス")&&(l.atk??9999)<=1500,qtyList:[1],posList:["Attack"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"紫炎の足軽",filter:l=>(l.status.nameTags??[]).includes("六武衆")&&(l.lvl??12)<=3,qtyList:[1],posList:["Attack","Defense"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"スレイブ・エイプ",filter:l=>(l.status.nameTags??[]).includes("剣闘獣")&&(l.lvl??12)<=4,qtyList:[1],posList:["Attack","Defense"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"ゼンマイハニー",filter:l=>(l.status.nameTags??[]).includes("ゼンマイ")&&(l.lvl??12)<=4,qtyList:[1],posList:["Attack","Defense"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"ＸＸ－セイバー エマーズブレイド",filter:l=>(l.status.nameTags??[]).includes("Ｘ－セイバー")&&(l.lvl??12)<=4,qtyList:[1],posList:["Attack","Defense"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"軍隊竜",filter:l=>l.nm==="軍隊竜",qtyList:[1],posList:["Attack","Defense"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"アサルト・ガンドッグ",filter:l=>l.nm==="アサルト・ガンドッグ",qtyList:[1,2,3,4,5],posList:["Attack","Defense"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]},{name:"ハイエナ",filter:l=>l.nm==="ハイエナ",qtyList:[1,2,3,4,5],posList:["Attack","Defense"],destoryTypes:["BattleDestroy"],executableCells:["Graveyard"]}].forEach(l=>{n.push({name:l.name,actions:[Os(l.filter,l.qtyList,l.posList,l.destoryTypes,l.executableCells),Be,Ee,qe]})}),n},io=()=>{const n=[],e={name:"強欲な壺",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:s=>{if(!(s.controller.getDeckCell().cardEntities.length<2))return Me(s)},prepare:(s,p,f,y)=>Ne(s,p,f,y,["AddToHandFromDeck"],[],void 0),execute:async(s,p)=>(await p.draw(2,s,p),!0),settle:async()=>!0},Te]};n.push(e);const t={name:"貪欲な壺",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:s=>{if(!(s.controller.getGraveyard().cardEntities.filter(p=>p.status.kind==="Monster").length<5))return Me(s)},prepare:async(s,p,f,y)=>{const l=await s.field.duel.view.waitSelectEntities(s.controller,s.controller.getGraveyard().cardEntities.filter(w=>w.status.kind==="Monster"),5,w=>w.length===5,"デッキに戻すモンスターを選択。",!1);if(l)return Ne(s,p,f,y,["AddToHandFromDeck","ReturnToDeckFromGraveyard"],l,void 0)},execute:async(s,p,f)=>{if(f.prepared.some(l=>p.duel.clock.isSameChain(l.wasMovedAt)))return!1;const y=[];for(const l of f.prepared){const w=await l.returnToDeck("Top",["Effect"],s,p);w&&y.push(w)}return y.getDistinct().filter(l=>l.cellType==="Deck").forEach(l=>l.shuffle()),await p.draw(2,s,p),!0},settle:async()=>!0},Te]};n.push(t);const i={name:"天使の施し",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:s=>{if(!(s.controller.getDeckCell().cardEntities.length<3))return Me(s)},prepare:(s,p,f)=>Ne(s,p,f,!1,["AddToHandFromDeck"],[],void 0),execute:async(s,p)=>(await p.draw(3,s,p),await p.discard(2,["Effect","Discard"],s,p),!0),settle:async()=>!0},Te]};n.push(i);const a={name:"成金ゴブリン",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:s=>{if(!(s.controller.getDeckCell().cardEntities.length<1))return Me(s)},prepare:(s,p,f)=>Ne(s,p,f,!1,["AddToHandFromDeck"],[],void 0),execute:async(s,p)=>(await p.draw(1,s,p),s.field.duel.clock.incrementProcSeq(),p.getOpponentPlayer().heal(1e3,s),!0),settle:async()=>!0},Te]};n.push(a);const r={name:"おろかな埋葬",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:s=>{if(s.controller.getDeckCell().cardEntities.filter(p=>p.status.kind==="Monster").length!==0)return Me(s)},prepare:(s,p,f)=>Ne(s,p,f,!1,["SendToGraveyardFromDeck"],[],void 0),execute:async(s,p)=>{const f=p.getDeckCell().cardEntities.filter(l=>l.status.kind==="Monster");if(f.length===0)return!1;const y=await s.field.duel.view.waitSelectEntities(p,f,1,l=>l.length===1,"墓地に送るモンスターを選択",!1);for(const l of y??[])await l.sendToGraveyard(["Effect"],s,p);return await p.shuffleDeck(),!0},settle:async()=>!0},Te]};n.push(r);const o={name:"おろかな副葬",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],isOnlyNTimesPerTurn:1,validate:s=>{if(s.controller.getDeckCell().cardEntities.filter(p=>p.status.kind!=="Monster").length!==0)return Me(s)},prepare:(s,p,f)=>Ne(s,p,f,!1,["SendToGraveyardFromDeck"],[],void 0),execute:async(s,p)=>{const f=p.getDeckCell().cardEntities.filter(l=>l.status.kind!=="Monster");if(f.length===0)return!1;const y=await s.field.duel.view.waitSelectEntities(p,f,1,l=>l.length===1,"墓地に送る魔法罠を選択",!1);for(const l of y??[])await l.sendToGraveyard(["Effect"],s,p);return await p.shuffleDeck(),!0},settle:async()=>!0},Te]};n.push(o);const k={name:"死者蘇生",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],hasToTargetCards:!0,validate:s=>{if(s.field.getCells("Graveyard").flatMap(p=>p.cardEntities).filter(p=>p.status.kind==="Monster"&&p.info.isRebornable).length!==0&&s.controller.getAvailableMonsterZones().length!==0)return Me(s)},prepare:async(s,p,f)=>{const y=await s.field.duel.view.waitSelectEntities(s.controller,s.field.getCells("Graveyard").flatMap(l=>l.cardEntities).filter(l=>l.origin.kind==="Monster"&&l.info.isRebornable),1,l=>l.length===1,"蘇生対象とするモンスターを選択",!1);if(!y)throw new fi(s);return await Ne(s,p,f,!1,["SpecialSummonFromGraveyard"],y,void 0)},execute:async(s,p,f)=>{const y=p.getEmptyMonsterZones(),l=f.selectedEntities[0];return l.controller=p,await f.selectedEntities[0].field.summon(l,["Attack","Defense"],y,"SpecialSummon",["Effect"],s,void 0,!1),p.specialSummonCount++,!0},settle:async()=>!0},Te]};n.push(k);const m={name:"手札抹殺",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:s=>{if(!(s.controller.getDeckCell().cardEntities.length<s.controller.getHandCell().cardEntities.filter(p=>p.seq!==s.seq).length)&&s.field.getAllCells().filter(p=>p.cellType==="Hand").flatMap(p=>p.cardEntities).filter(p=>p.seq!==s.seq).length!==0)return Me(s)},prepare:(s,p,f)=>Ne(s,p,f,!1,["AddToHandFromDeck"],[],void 0),execute:async(s,p)=>{const f=p.getHandCell().cardEntities.length,y=p.getOpponentPlayer().getHandCell().cardEntities.length;return await s.field.sendGraveyardAtSameTime(s.field.getCells("Hand").flatMap(l=>l.cardEntities),["Effect","Discard"],s,p),p.duel.clock.incrementProcSeq(),await s.field.drawAtSameTime(p,f,p.getOpponentPlayer(),y,s,p),!0},settle:async()=>!0},Te]};n.push(m);const c={name:"光の援軍",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:s=>{if(!(s.controller.getDeckCell().cardEntities.length<4)&&s.controller.getDeckCell().cardEntities.filter(p=>p.status.kind==="Monster").filter(p=>(p.lvl??13)<5).filter(p=>p.status.nameTags&&p.status.nameTags.includes("ライトロード")).length!==0)return Me(s)},prepare:async(s,p,f)=>{const y=s.controller.getDeckCell();return Array(3).forEach(()=>y.cardEntities[0].sendToGraveyard(["Cost"],s,s.controller)),await Ne(s,p,f,!1,["AddToHandFromDeck","SendToGraveyardFromDeck"],[],void 0)},execute:async(s,p)=>{const f=p.getDeckCell().cardEntities.filter(l=>l.status.kind==="Monster").filter(l=>(l.lvl??13)<5).filter(l=>l.status.nameTags&&l.status.nameTags.includes("ライトロード"));if(f.length===0)return!1;const y=await s.field.duel.view.waitSelectEntities(p,f,1,l=>l.length===1,"手札に加えるモンスターを選択",!1);for(const l of y??[])await l.addToHand(["Effect"],s,p);return!0},settle:async()=>!0},Te]};n.push(c);const u={name:"調律",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:s=>{const p=s.controller.getDeckCell().cardEntities;if(!(p.length<2)&&p.filter(f=>{var y;return(y=f.status.nameTags)==null?void 0:y.includes("シンクロン")}).filter(f=>{var y;return(y=f.status.monsterCategories)==null?void 0:y.includes("Tuner")}).length!==0)return Me(s)},prepare:(s,p,f)=>Ne(s,p,f,!1,["AddToHandFromDeck","SendToGraveyardFromDeck"],[],void 0),execute:async(s,p)=>{const f=p.getDeckCell().cardEntities;if(f.length<2)return;const y=f.filter(w=>{var D;return(D=w.status.nameTags)==null?void 0:D.includes("シンクロン")}).filter(w=>{var D;return(D=w.status.monsterCategories)==null?void 0:D.includes("Tuner")});if(y.length===0)return!1;const l=await s.field.duel.view.waitSelectEntities(p,y,1,w=>w.length===1,"手札に加えるモンスターを選択",!1);for(const w of l??[])await w.addToHand(["Effect"],s,p);return p.duel.clock.incrementProcSeq(),p.getDeckCell().shuffle(),await p.getDeckCell().cardEntities[0].sendToGraveyard(["Effect"],s,p),!0},settle:async()=>!0},Te]};n.push(u);const C={name:"ワン・フォー・ワン",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:s=>{if(s.controller.getDeckCell().cardEntities.filter(p=>p.lvl===1).length===0){if(s.controller.getHandCell().cardEntities.filter(p=>p.lvl===1).length===0||s.controller.getHandCell().cardEntities.filter(p=>p.status.kind==="Monster").length<2)return}else if(s.controller.getHandCell().cardEntities.filter(p=>p.status.kind==="Monster").length===0)return;return Me(s)},prepare:async(s,p,f)=>{let y=s.controller.getHandCell().cardEntities.filter(w=>w.status.kind==="Monster");if(s.controller.getDeckCell().cardEntities.filter(w=>w.lvl===1).length===0){const w=s.controller.getHandCell().cardEntities.filter(D=>D.lvl===1);w.length===1&&(y=y.filter(D=>D!==w[0]))}if(await s.field.sendToGraveyard("墓地送るモンスターを選択",s.controller,y,1,w=>w.length===1,["Cost"],s,!0))return await Ne(s,p,f,!1,["SpecialSummonFromDeck"],[],void 0)},execute:async(s,p)=>{const f=[...s.controller.getDeckCell().cardEntities.filter(l=>l.lvl===1),...s.controller.getHandCell().cardEntities.filter(l=>l.lvl===1)];if(f.length===0)return!1;const y=await s.field.duel.view.waitSelectEntities(p,f,1,l=>l.length===1,"特殊召喚するモンスターを選択",!1);if(!y)throw new Error("illegal state");return await s.field.summon(y[0],["Attack","Defense"],p.getAvailableMonsterZones(),"SpecialSummon",["Effect"],s,p,!1),p.shuffleDeck(),!0},settle:async()=>!0},Te]};return n.push(C),[{name:"増援",filter:s=>s.origin.kind==="Monster"&&s.origin.type==="Warrior"&&(s.origin.level??5)<5},{name:"化石調査",filter:s=>s.origin.kind==="Monster"&&s.origin.type==="Dinosaur"&&(s.origin.level??6)<6},{name:"Ｅ－エマージェンシーコール",filter:s=>s.origin.kind==="Monster"&&(s.origin.nameTags??[]).includes("Ｅ・ＨＥＲＯ")},{name:"召集の聖刻印",filter:s=>s.origin.kind==="Monster"&&(s.origin.nameTags??[]).includes("聖刻")},{name:"召喚師のスキル",filter:s=>s.origin.kind==="Monster"&&(s.origin.monsterCategories??[]).includes("Normal")&&(s.origin.level??4)>4},{name:"トゥーンのもくじ",filter:s=>(s.origin.nameTags??[]).includes("トゥーン")},{name:"融合賢者",filter:s=>s.origin.name==="融合"},{name:"虹の架け橋",filter:s=>s.origin.kind!=="Monster"&&(s.origin.nameTags??[]).includes("宝玉")},{name:"紫炎の狼煙",filter:s=>s.origin.kind==="Monster"&&(s.origin.nameTags??[]).includes("六武衆")&&(s.origin.level??4)<4},{name:"テラ・フォーミング",filter:s=>s.origin.kind==="Spell"&&s.origin.spellCategory==="Field"},{name:"コール・リゾネーター",filter:s=>s.origin.kind==="Monster"&&(s.origin.nameTags??[]).includes("リゾネーター")}].forEach(s=>{n.push({name:s.name,actions:[Zs(s.filter),Te]})}),[{name:"戦士の生還",filter:s=>s.status.kind==="Monster"&&s.type.includes("Warrior"),qty:1},{name:"ダーク・バースト",filter:s=>s.status.kind==="Monster"&&s.attr.includes("Dark")&&(s.atk??9999)<=1500,qty:1},{name:"悪夢再び",filter:s=>s.status.kind==="Monster"&&s.attr.includes("Dark")&&(s.def??9999)===0,qty:2},{name:"サルベージ",filter:s=>s.status.kind==="Monster"&&s.attr.includes("Water")&&(s.atk??9999)<=1500,qty:2},{name:"バッテリーリサイクル",filter:s=>s.status.kind==="Monster"&&s.type.includes("Thunder")&&(s.atk??9999)<=1500,qty:2},{name:"闇の量産工場",filter:s=>s.status.kind==="Monster"&&(s.status.monsterCategories??[]).includes("Normal"),qty:2}].forEach(s=>{n.push({name:s.name,actions:[Is(s.filter,s.qty),Te]})}),[{name:"トレード・イン",filter:s=>s.status.kind==="Monster"&&(s.lvl??0)===8},{name:"調和の宝札",filter:s=>s.status.kind==="Monster"&&(s.origin.monsterCategories??[]).includes("Tuner")&&s.type.includes("Dragon")&&(s.atk??9999)<=1e3},{name:"デステニー・ドロー",filter:s=>s.status.kind==="Monster"&&(s.origin.nameTags??[]).includes("Ｄ－ＨＥＲＯ")}].forEach(s=>{n.push({name:s.name,actions:[$s(s.filter),Te]})}),[{name:"火の粉",calcHeal:()=>[0,-200]},{name:"雷鳴",calcHeal:()=>[0,-300]},{name:"ファイヤー・ボール",calcHeal:()=>[0,-500]},{name:"火あぶりの刑",calcHeal:()=>[0,-600]},{name:"昼夜の大火事",calcHeal:()=>[0,-800]},{name:"火炎地獄",calcHeal:()=>[-500,-1e3]},{name:"盗人ゴブリン",calcHeal:()=>[500,-500]},{name:"ブルー・ポーション",calcHeal:()=>[400,0]},{name:"レッド・ポーション",calcHeal:()=>[500,0]},{name:"ゴブリンの秘薬",calcHeal:()=>[600,0]},{name:"天使の生き血",calcHeal:()=>[800,0]},{name:"治療の神 ディアン・ケト",calcHeal:()=>[1e3,0]},{name:"恵みの雨",calcHeal:()=>[1e3,1e3]}].forEach(s=>{n.push({name:s.name,actions:[Us(s.calcHeal),Te]})}),n},ao=()=>{const n=[],e={name:"ご隠居の猛毒薬",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Quick",executableCells:["Hand","SpellAndTrapZone"],validate:Me,prepare:async(t,i,a,r)=>{t.info.isDying=!0;const o=await t.field.duel.view.waitSelectText([{seq:0,text:"●自分は１２００ＬＰ回復する。"},{seq:1,text:"●相手に８００ダメージを与える。"}],"使用する効果を選択",!1);if(o===void 0&&!r)throw new fi(t);const k=[];return o===1&&k.push("DamageToOpponent"),Ne(t,i,a,r,k,[],o)},execute:async(t,i,a)=>a.prepared===1?(i.getOpponentPlayer().effectDamage(800,t),!0):(i.heal(1200,t),!0),settle:async()=>!0},Te]};return n.push(e),n},ro=()=>{const n=[...no(),...io(),...ao()];return n.forEach(e=>console.log(e.name)),n},qa=new Map;ro().forEach(n=>{qa.set(n.name,n.actions)});const ei=qa,so=fs,Se=Object.values(so).reduce((n,e)=>(n[e.name]=e,n),{}),oe=class oe{constructor(e,t){d(this,"id");d(this,"name");d(this,"description");d(this,"lastUsedAt");d(this,"cardNames");d(this,"getIllegalCardNames",()=>Array.from(new Set(this.cardNames.filter(e=>!Object.keys(Se).includes(e)))));d(this,"getDisableCardNames",()=>Array.from(new Set(this.cardNames.filter(e=>!Object.keys(Se).includes(e)))));d(this,"createCardInfos",()=>{const e=this.getIllegalCardNames();if(e.length>0)throw new Error(`存在しないカード名からデッキを生成しようとした。${e}`);return this.cardNames.map(t=>Se==null?void 0:Se[t]).filter(t=>t)});d(this,"copy",async()=>oe.createNewDeck(this.name,this.description,this.cardNames));d(this,"updateTimestamp",async()=>{await oe.tblHeader.update(this.id,e=>({...e,lastUsedAt:new Date}))});d(this,"saveDeckInfo",async e=>{const t=e??this;await oe.tblHeader.update(this.id,r=>({...r,name:t.name,description:t.description,lastUsedAt:new Date}));const i=(await oe.tblDetail.getAll()).filter(r=>r.deckId===this.id);console.log(t.cardNames),await oe.tblDetail.delete(i.map(r=>r.id));const a=await oe.tblDetail.insertMany(t.cardNames.map((r,o)=>({deckId:this.id,seq:o,name:r,description:""})));return console.log(a),new oe(await oe.tblHeader.get(this.id),a)});d(this,"delete",async()=>{await oe.tblHeader.delete([this.id]);const e=(await oe.tblDetail.getAll()).filter(t=>t.deckId===this.id);await oe.tblDetail.delete(e.map(t=>t.id))});this.id=e.id,this.name=e.name,this.description=e.description,this.lastUsedAt=e.lastUsedAt,this.cardNames=t.filter(i=>i.deckId===this.id).map(i=>i.name)}};d(oe,"idb"),d(oe,"tblHeader"),d(oe,"tblDetail"),d(oe,"getAllDeckInfo",async e=>{if(e&&(oe.idb=e),!oe.idb)throw new Error("illegal argument: idb is undefined.");oe.tblHeader||(oe.tblHeader=new oo(oe.idb)),oe.tblDetail||(oe.tblDetail=new lo(oe.idb));const t=await oe.tblHeader.getAll(),i=await oe.tblDetail.getAll();return t.length?t.map(a=>new oe(a,i)):[await oe.prepareSampleDeck()]}),d(oe,"createNewDeck",async(e,t,i)=>{const a=await oe.tblHeader.insert({name:e,description:t,lastUsedAt:new Date}),r=await oe.tblDetail.insertMany(i.map((o,k)=>({deckId:a.id,seq:k,name:o,description:""})));return new oe(a,r)}),d(oe,"prepareSampleDeck",async()=>await oe.createNewDeck(mn[0].name,mn[0].description,mn[0].cardNames));let gt=oe;class oo extends mi{constructor(t){super(t,"TblDeckHeader");d(this,"_prepareInitialRecords",()=>[])}}class lo extends mi{constructor(t){super(t,"TblDeckDetail");d(this,"_prepareInitialRecords",()=>[])}}let Ao=-1,Vt=["おろかな埋葬","成金ゴブリン","強欲な壺","天使の施し","増援","トレード・イン","調和の宝札","死者蘇生","召喚師のスキル","サイバー・ドラゴン","Ｄ－ＨＥＲＯ ディアボリックガイ","ライトロード・ビースト ウォルフ","ナチュル・ガオドレイク","スクラップ・デスデーモン","大地の騎士ガイアナイト","青眼の白龍"];Vt=[...Vt,...Vt,...Vt,"Ｅ－エマージェンシーコール","闇の量産工場","戦士の生還","トレード・イン","ジェネティック・ワーウルフ","ジョングルグールの幻術師","ゾンビーノ","フロストザウルス","しゃりの軍貫","チューン・ウォリアー","貪欲な壺","ガード・オブ・フレムベル","ギャラクシーサーペント","ハロハロ","ラブラドライドラゴン","守護竜ユスティア","Ｅ・ＨＥＲＯ クレイマン","Ｅ・ＨＥＲＯ スパークマン","Ｅ・ＨＥＲＯ ネオス","Ｅ・ＨＥＲＯ バーストレディ","Ｅ・ＨＥＲＯ フェザーマン"];const mn=[{id:Ao--,name:"サンプルデッキ１",description:"",lastUsedAt:new Date,cardNames:Vt}];function po(n){const e=n-1;return e*e*e+1}function Ii(n,e){for(const t in e)n[t]=e[t];return n}function co({fallback:n,...e}){const t=new Map,i=new Map;function a(o,k,m){const{delay:c=0,duration:u=_=>Math.sqrt(_)*30,easing:C=po}=Ii(Ii({},e),m),s=o.getBoundingClientRect(),p=k.getBoundingClientRect(),f=s.left-p.left,y=s.top-p.top,l=s.width/p.width,w=s.height/p.height,D=Math.sqrt(f*f+y*y),T=getComputedStyle(k),S=T.transform==="none"?"":T.transform,W=+T.opacity;return{delay:c,duration:typeof u=="function"?u(D):u,easing:C,css:(_,$)=>`
			   opacity: ${_*W};
			   transform-origin: top left;
			   transform: ${S} translate(${$*f}px,${$*y}px) scale(${_+(1-_)*l}, ${_+(1-_)*w});
		   `}}function r(o,k,m){return(c,u)=>(o.set(u.key,c),()=>{if(k.has(u.key)){const C=k.get(u.key);return k.delete(u.key),a(C,c,u)}return o.delete(u.key),n&&n(c,u,m)})}return[r(i,t,!1),r(t,i,!0)]}var ko=N("<div></div>"),mo=N('<div class="duel_card_row svelte-1y7jo5c"><div class="svelte-1y7jo5c"> </div> <div class="svelte-1y7jo5c"> </div></div>'),uo=N('<div class="duel_card_row svelte-1y7jo5c"><div class="svelte-1y7jo5c"></div> <div class="svelte-1y7jo5c"> </div></div>'),ho=N('<div class="duel_card_row svelte-1y7jo5c"><div class="svelte-1y7jo5c"></div> <div class="svelte-1y7jo5c"> </div></div>'),fo=N('<div class="duel_card_row svelte-1y7jo5c"><div class="svelte-1y7jo5c"> </div> <div class="svelte-1y7jo5c"> </div></div>'),wo=N('<div class="duel_card_row svelte-1y7jo5c"><div class="svelte-1y7jo5c"> </div></div> <div class="duel_card_row duel_card_row_wide svelte-1y7jo5c"><div class="svelte-1y7jo5c"> </div> <div class="svelte-1y7jo5c"> </div></div>',1),Co=N('<button><div class="duel_card duel_card_face_up svelte-1y7jo5c"><div class="duel_card_row svelte-1y7jo5c" style="position:relative"><div class="svelte-1y7jo5c"> </div> <!></div> <!> <!> <!></div></button>'),Do=N('<div class="duel_card duel_card_face_down duel_card_face_down_defense svelte-1y7jo5c"><div class="svelte-1y7jo5c"></div></div>'),yo=N('<div class="duel_card duel_card_face_down svelte-1y7jo5c"><div class="svelte-1y7jo5c"></div></div>');function rt(n,e){be(e,!1);let t=me(e,"entity",8),i=me(e,"state",8,"Disabled"),a=me(e,"selectedList",28,()=>[]),r=me(e,"isVisibleForcibly",8,!1),o=me(e,"isWideMode",8,!1),k=me(e,"actions",24,()=>[]),m=me(e,"cardActionResolve",8),c=me(e,"entitySelectResolve",8,()=>{}),u=Ce(!1),C=()=>{},s=me(e,"qty",12,void 0);const p=E=>{te(u,!1),s(E.qty),C=E.resolve};t().field.duel.view.onWaitStart.append(p);let f=Ce(!1);const y=()=>{if(i()!=="Disabled"&&(console.log(s()),i()==="Selectable"&&s()&&s()===1)){if(a().some(E=>E.seq!==t().seq)){a([t()]);return}s()&&s()===1&&c()&&c()([t()])}},l=()=>{(t().face==="FaceUp"||t().owner===t().field.duel.duelists.Below&&(t().isUnderControl||r()))&&t().field.duel.view.showCardInfo(t())},w=()=>{if(console.log(t(),i()),l(),i()==="Disabled")return;if(i()==="Selectable"){te(u,!A(u)),a(A(u)?[...a(),t()]:a().filter(U=>U!==t()));return}if(k().length===0)return;if(k().length===1){if(k()[0].dragAndDropOnly)return;if(m()){m()(k()[0]);return}console.log(k()[0],C),C({action:k()[0]});return}const E=t().field.duel.view;E.modalController.selectAction(E,{title:"行動を選択。",actions:k(),cancelable:!0}).then(U=>{C({action:U})})},D=E=>{console.info("drag start",E,k()),t().field.duel.view.setDraggingActions(k()),te(f,!0)},T=E=>{console.info("drag end",E,k()),t().field.duel.view.removeDraggingActions(),E.dataTransfer&&te(f,!1)};Oe();var S=he(),W=ne(S);{var _=E=>{var U=Co(),re=h(U),se=h(re),ue=h(se),we=h(ue),X=v(ue,2);ce(X,1,()=>t().attr,pe,(H,q)=>{var K=ko();L(()=>fe(K,`monster_attr ${A(q)??""} svelte-1y7jo5c`)),g(H,K)});var M=v(se,2);{var O=H=>{var q=mo(),K=h(q),G=h(K),z=v(K,2),j=h(z);L((Q,ae)=>{F(G,Q),F(j,ae)},[()=>"★".repeat(t().status.level||0),()=>"☆".repeat(t().status.rank||0)],ye),g(H,q)},ie=H=>{var q=he(),K=ne(q);{var G=j=>{var Q=uo(),ae=v(h(Q),2),J=h(ae);L(()=>F(J,`${rn[t().status.spellCategory]??""}魔法`)),g(j,Q)},z=j=>{var Q=he(),ae=ne(Q);{var J=x=>{var B=ho(),Y=v(h(B),2),b=h(Y);L(()=>F(b,`${sn[t().status.trapCategory]??""}罠`)),g(x,B)};R(ae,x=>{t().status.kind==="Trap"&&t().status.trapCategory&&x(J)},!0)}g(j,Q)};R(K,j=>{t().status.kind==="Spell"&&t().status.spellCategory?j(G):j(z,!1)},!0)}g(H,q)};R(M,H=>{t().status.kind==="Monster"?H(O):H(ie,!1)})}var I=v(M,2);{var ee=H=>{var q=fo(),K=h(q),G=h(K),z=v(K,2),j=h(z);L(()=>{F(G,`◀ ${t().psL??""}`),F(j,`${t().psR??""} ▶`)}),g(H,q)};R(I,H=>{var q;(q=t().status.monsterCategories)!=null&&q.includes("Pendulum")&&H(ee)})}var P=v(I,2);{var V=H=>{var q=wo(),K=ne(q),G=h(K),z=h(G),j=v(K,2),Q=h(j),ae=h(Q),J=v(Q,2),x=h(J);L((B,Y,b)=>{yt(G,"title",B),F(z,Y),F(ae,b),F(x,`${t().atk??"?"} / ${t().def??"?"}`)},[()=>{var B;return(B=t().status.monsterCategories)==null?void 0:B.join(" ")},()=>{var B;return(B=t().status.monsterCategories)==null?void 0:B.map(Y=>an[Y]+(o()?Sn[Y]:"")).join()},()=>t().type.map(B=>on[B]+(o()?Kn[B]:"")).join()],ye),g(H,q)};R(P,H=>{t().status.kind==="Monster"&&H(V)})}L(H=>{fe(U,`duel_card button_style_reset ${t().status.kind??""} ${H??""} ${(A(u)?"duel_card_selected":"")??""} ${i()??""} duel_card_${t().orientation??""} ${(A(f)?"isDragging":"")??""} ${(o()?"duel_card_wide":"")??""} svelte-1y7jo5c`),yt(U,"draggable",i()==="Draggable"),yt(U,"title",t().nm),F(we,t().nm)},[()=>{var H;return((H=t().status.monsterCategories)==null?void 0:H.join(" "))||""}],ye),ve("dragstart",U,D),ve("dragend",U,T),ve("click",U,w),ve("dblclick",U,y),ve("mouseenter",U,l),g(E,U)},$=E=>{var U=he(),re=ne(U);{var se=we=>{var X=Do();g(we,X)},ue=we=>{var X=yo();g(we,X)};R(re,we=>{t().battlePotion==="Set"?we(se):we(ue,!1)},!0)}g(E,U)};R(W,E=>{t().face==="FaceUp"||r()||t().controller.seat==="Below"&&t().isUnderControl?E(_):E($,!1)})}g(n,S),_e()}var vo=N('<div class="phase_display svelte-1mupj1p"><span class="svelte-1mupj1p"> </span> </div>'),go=N('<div class="lifepoint_display svelte-1mupj1p"><div class="svelte-1mupj1p"> </div> <div class="svelte-1mupj1p"> </div></div>'),Bo=(n,e,t)=>e(A(t)),Eo=N('<div class="svelte-1mupj1p"><button class="phase_button svelte-1mupj1p"> </button></div>'),To=N("<div><!></div>"),xo=N('<div class="svelte-1mupj1p"><!></div>'),Mo=N("<div><!></div>"),No=N("<!> <!> <!>",1),bo=N('<div style="position: absolute;" class="card_animation_receiver svelte-1mupj1p"><!></div>'),_o=N('<div style="position: absolute; display:flex;justify-content: center;" class="svelte-1mupj1p"><!></div>'),Fo=N('<div style="position: absolute; bottom:0rem" class="svelte-1mupj1p"> </div>'),Ho=N("<!> <!>",1),So=N('<div class="badge svelte-1mupj1p"> </div>'),Ko=N('<div class="card_animation_receiver svelte-1mupj1p"><!></div>'),Po=N("<!> <!> <!> <!>",1),qo=N('<td><div role="listitem"><!></div></td>');function Wo(n,e){be(e,!1);let t=me(e,"view",8),i=me(e,"row",8),a=me(e,"column",8),r=me(e,"selectedList",28,()=>[]),o=Ce(t().getCell(i(),a()));const k=()=>{te(o,t().getCell(i(),a()))};A(o).onUpdate.append(k),t().onDuelUpdate.append(k),t().modalController.onUpdate.append(k);let m=Ce([]),c=()=>{},u;const C=M=>{te(D,void 0),r().reset(),c=M.resolve,te(m,M.enableActions),u=M.selectableEntities,M.entitiesValidator};t().onWaitStart.append(C);let s,p=Ce(!1);const f=M=>{s=M,te(p,M.some(O=>{var ie;return(ie=O.validate())==null?void 0:ie.includes(A(o))})||!1),k()},y=()=>{s=void 0,te(p,!1),k()};t().onDragStart.append(f),t().onDragEnd.append(y);const[l,w]=Tl;let D=Ce(void 0);const T=M=>{if(A(o)===M.to||A(o).entities.includes(M.entity)){console.log(M),te(D,M);const O=M.resolve;te(o,A(o)),setTimeout(()=>{te(D,void 0),M.count++,M.count>1&&O()},600)}};t().onAnimation.append(T);const S=M=>{console.info(M),c({phaseChange:M})},W=()=>(A(o).cellType==="Deck"||A(o).cellType==="ExtraDeck"||A(o).cellType==="Graveyard"||A(o).cellType==="Banished")&&A(o).entities.flatMap(M=>M.actions).filter(M=>A(m).map(O=>O.seq).some(O=>O===M.seq)).length>0,_=()=>{if(Le(o,A(o).field.duel.view.infoBoardState="Log"),A(o).cellType==="Deck"||A(o).cellType==="ExtraDeck"||A(o).cellType==="Graveyard"||A(o).cellType==="Banished"){Le(o,A(o).field.duel.view.infoBoardState="CellInfo"),Le(o,A(o).field.duel.view.infoBoardCell=A(o)),A(o).field.duel.view.requireUpdate();const M=A(o).entities.flatMap(O=>O.actions).filter(O=>A(m).map(ie=>ie.seq).some(ie=>ie===O.seq));if(console.log(A(m)),console.log(M),M.length){const O=A(o).field.duel.view;O.modalController.selectAction(O,{title:"カードを選択。",actions:M,cancelable:!0}).then(ie=>{c({action:ie})});return}}A(o).field.duel.view.requireUpdate(),console.info(A(o))},$=M=>{M.preventDefault(),M.dataTransfer&&(M.dataTransfer.dropEffect="move")},E=M=>{M.preventDefault(),console.info("drop",M,A(p),s),M.dataTransfer&&(M.dataTransfer.dropEffect="move");try{if(A(p)&&s)if(console.info(s,A(o)),s.length===1){const O=s[0].getClone();O.cell=A(o),c({action:O})}else s.length>1&&(A(o).field.duel.view.modalController.cancelAll(),A(o).field.duel.view.modalController.selectAction(A(o).field.duel.view,{title:"選択",actions:s,cancelable:!1}))}finally{t().removeDraggingActions()}},U=(...M)=>{if(u&&u.find(I=>M.find(ee=>I===ee)))return"Selectable";if(!A(m)||A(m).length===0||t().waitMode!=="SelectFieldAction"||Object.values(t().modalController.states).some(I=>I==="Shown"))return"Disabled";const O=A(m).filter(I=>M.includes(I.entity));if(O.length===0)return"Disabled";if(O.length>1)return"Clickable";if(A(m)[0].playType==="RuleDraw")return"Draggable";if(["Deck","ExtraDeck","Graveyard","Banished"].includes(A(o).cellType)||O[0].entity!==M[0])return"Clickable";const ie=O[0].validate();return ie&&ie.length>0?"Draggable":"Clickable"};Oe();var re=qo(),se=h(re);se.__click=_;var ue=h(se);{var we=M=>{var O=he(),ie=ne(O);{var I=ee=>{var P=he(),V=ne(P);{var H=K=>{var G=vo(),z=h(G),j=h(z),Q=v(z,1,!0);L((ae,J)=>{F(j,ae),F(Q,J)},[()=>String(A(o).field.duel.clock.turn).padStart(2,"0"),()=>A(o).field.duel.phase.toUpperCase()],ye),g(K,G)},q=K=>{var G=he(),z=ne(G);{var j=ae=>{var J=go(),x=h(J),B=h(x),Y=v(x,2),b=h(Y);L(()=>{F(B,A(o).field.duel.duelists.Above.lp),F(b,A(o).field.duel.duelists.Below.lp)}),g(ae,J)},Q=ae=>{var J=he(),x=ne(J);{var B=Y=>{var b=he(),Z=ne(b);{var le=Ae=>{var Ye=he(),wt=ne(Ye);{var xt=nt=>{var it=he(),jt=ne(it);ce(jt,1,()=>t().duel.nextPhaseList,pe,(Yt,Mt)=>{var Ve=Eo(),Qe=h(Ve);Qe.__click=[Bo,S,Mt];var Nt=h(Qe);L(bt=>F(Nt,bt),[()=>A(Mt).toUpperCase()],ye),g(Yt,Ve)}),g(nt,it)};R(wt,nt=>{t().duel.isEnded||nt(xt)})}g(Ae,Ye)};R(Z,Ae=>{t().waitMode==="SelectFieldAction"&&Ae(le)})}g(Y,b)};R(x,Y=>{A(o).column===5&&Y(B)},!0)}g(ae,J)};R(z,ae=>{A(o).column===3?ae(j):ae(Q,!1)},!0)}g(K,G)};R(V,K=>{A(o).column===1?K(H):K(q,!1)})}g(ee,P)};R(ie,ee=>{A(o).row===3&&ee(I)})}g(M,O)},X=M=>{var O=he(),ie=ne(O);{var I=P=>{var V=No(),H=ne(V);{var q=j=>{var Q=To(),ae=h(Q);rt(ae,{get entity(){return A(D).entity},state:"Disabled",actions:[],cardActionResolve:void 0}),L(()=>fe(Q,`card_animation_receiver ${A(o).cellType??""} svelte-1mupj1p`)),Ht(1,Q,()=>w,()=>({key:A(D).entity.seq})),g(j,Q)};R(H,j=>{A(D)&&A(D).entity&&A(D).to===A(o)&&A(D).index==="Top"&&j(q)})}var K=v(H,2);ce(K,1,()=>A(o).cardEntities,pe,(j,Q)=>{var ae=he(),J=ne(ae);{var x=B=>{var Y=xo(),b=h(Y);const Z=ye(()=>U(A(Q))),le=ye(()=>A(m).filter(Ae=>Ae.entity===A(Q)));rt(b,{get entity(){return A(Q)},get state(){return A(Z)},get actions(){return A(le)},cardActionResolve:void 0,get selectedList(){return r()},set selectedList(Ae){r(Ae)},$$legacy:!0}),Ht(2,Y,()=>l,()=>({key:A(Q).seq})),g(B,Y)};R(J,B=>{(!A(D)||A(D).entity.seq!==A(Q).seq)&&B(x)})}g(j,ae)});var G=v(K,2);{var z=j=>{var Q=Mo(),ae=h(Q);rt(ae,{get entity(){return A(D).entity},state:"Disabled",actions:[],cardActionResolve:void 0}),L(()=>fe(Q,`card_animation_receiver ${A(o).cellType??""} svelte-1mupj1p`)),Ht(1,Q,()=>w,()=>({key:A(D).entity.seq})),g(j,Q)};R(G,j=>{A(D)&&A(D).entity&&A(D).to===A(o)&&A(D).index==="Bottom"&&j(z)})}g(P,V)},ee=P=>{var V=Po(),H=ne(V);{var q=J=>{var x=bo(),B=h(x);rt(B,{get entity(){return A(D).entity},state:"Disabled",actions:[],cardActionResolve:void 0}),Ht(1,x,()=>w,()=>({key:A(D).entity.seq})),g(J,x)};R(H,J=>{A(D)&&A(D).entity&&A(D).to===A(o)&&A(D).index==="Bottom"&&J(q)})}var K=v(H,2);{var G=J=>{var x=Ho(),B=ne(x);ce(B,1,()=>A(o).cardEntities.toReversed(),pe,(Z,le,Ae)=>{var Ye=he(),wt=ne(Ye);{var xt=nt=>{var it=_o(),jt=h(it);const Yt=ye(()=>Ae===0&&qi.every(Ve=>Ve!==A(o).cellType)?U(...A(o).cardEntities):void 0),Mt=ye(()=>Ae===0?A(m).filter(Ve=>A(o).cardEntities.includes(Ve.entity)):void 0);rt(jt,{get entity(){return A(le)},get state(){return A(Yt)},get actions(){return A(Mt)},cardActionResolve:void 0,get selectedList(){return r()},set selectedList(Ve){r(Ve)},$$legacy:!0}),Ht(2,it,()=>l,()=>({key:A(le).seq})),g(nt,it)};R(wt,nt=>{(!A(D)||A(D).entity.seq!==A(le).seq)&&nt(xt)})}g(Z,Ye)});var Y=v(B,2);{var b=Z=>{var le=Fo(),Ae=h(le);L(()=>F(Ae,`【${(A(o).cardEntities[0].battlePotion==="Attack"?"攻撃表示":A(o).cardEntities[0].battlePotion==="Defense"?"表守備表示":"裏守備表示")??""}】`)),g(Z,le)};R(Y,Z=>{A(o).cardEntities[0].battlePotion&&Z(b)})}g(J,x)};R(K,J=>{A(o).cardEntities.length>0&&J(G)})}var z=v(K,2);{var j=J=>{var x=So(),B=h(x);L(()=>F(B,A(o).cardEntities.length)),g(J,x)};R(z,J=>{qi.find(x=>x===A(o).cellType)&&J(j)})}var Q=v(z,2);{var ae=J=>{var x=Ko(),B=h(x);rt(B,{get entity(){return A(D).entity},state:"Disabled",actions:[],cardActionResolve:void 0}),Ht(1,x,()=>w,()=>({key:A(D).entity.seq})),g(J,x)};R(Q,J=>{A(D)&&A(D).entity&&A(D).to===A(o)&&A(D).index==="Top"&&J(ae)})}g(P,V)};R(ie,P=>{A(o).cellType==="Hand"?P(I):P(ee,!1)},!0)}g(M,O)};R(ue,M=>{A(o).cellType==="Disable"?M(we):M(X,!1)})}L(M=>{fe(re,`${`duel_field_cell duel_field_cell_${A(o).cellType}`??""} svelte-1mupj1p`),yt(re,"colspan",A(o).cellType==="Hand"?7:1),fe(se,`${M??""} svelte-1mupj1p`)},[()=>`duel_card_wrapper ${A(o).cellType} ${A(p)?"can_accept_drop":""} ${W()?"can_action":""}`],ye),ve("dragover",se,M=>$(M)),ve("drop",se,M=>E(M)),g(n,re),_e()}Hn(["click"]);var Lo=N('<tr><td style=" white-space: nowrap;text-align: center;"> </td><td class="svelte-13svkzh"> </td></tr>'),Ro=N('<div class="duel_log svelte-13svkzh"><table><tbody></tbody></table></div>');function Oo(n,e){var m,c;be(e,!1);let t=Ce(void 0),i=me(e,"log",12);const a=()=>{i(i()),Wr().then(()=>A(t)&&A(t).scroll(0,A(t).clientHeight*10))};(c=(m=i())==null?void 0:m.onUpdate)==null||c.append(a),Oe();var r=Ro(),o=h(r),k=h(o);ce(k,5,()=>i().records,pe,(u,C)=>{var s=Lo(),p=h(s),f=h(p),y=v(p),l=h(y);L(()=>{var w,D;fe(p,`duelist ${((w=A(C).duelist)==null?void 0:w.seat)??""} svelte-13svkzh`),F(f,((D=A(C).duelist)==null?void 0:D.profile.name)||"SYSTEM"),F(l,A(C).text)}),g(u,s)}),As(r,u=>te(t,u),()=>A(t)),g(n,r),_e()}const Zo=n=>new Promise(e=>setTimeout(e,n));var Io=N('<div><div class="duelist_name svelte-12u0sqq"> </div> <div> </div></div>');function $i(n,e){be(e,!1);let t=me(e,"duelist",12),i=Ce(0),a=Ce();const r=async()=>{const s=t().lp-A(i);if(!A(a)||Math.abs(s)<10){te(i,t().lp),A(a)&&(A(a)(),te(a,void 0));return}te(i,A(i)+Math.floor(Math.random()*s)),await Zo(100),r()},o=()=>{t(t()),!A(a)&&t().lp!==A(i)&&new Promise(s=>{te(a,s),Math.abs(t().lp-A(i)),r()})};t().duel.log.onUpdate.append(o),r(),Oe();var k=Io(),m=h(k),c=h(m),u=v(m,2),C=h(u);L(()=>{fe(k,`duelist ${t().seat??""} svelte-12u0sqq`),F(c,t().profile.name),fe(u,`duelist_lp ${(A(a)?"vibration":"")??""} svelte-12u0sqq`),F(C,A(i))}),g(n,k),_e()}const $o=()=>{};var Uo=N("<div><!></div>"),Go=N("<div></div>"),jo=(n,e,t)=>e.resolve(A(t)),Yo=(n,e)=>e.resolve(void 0),zo=N('<button class="svelte-1h1of0m">Cancel</button>'),Vo=N('<div class="base svelte-1h1of0m"><button class="overlay svelte-1h1of0m">☆</button> <div class="window svelte-1h1of0m"><div> </div> <!> <div><button class="svelte-1h1of0m">OK</button> <!></div></div></div>');function Qo(n,e){be(e,!0);let t=Cr(kt([]));var i=he(),a=ne(i);{var r=o=>{var k=Vo(),m=h(k);m.__click=[$o];var c=v(m,2),u=h(c),C=h(u),s=v(u,2);ce(s,17,()=>e.entities.map(w=>w.controller.seat).getDistinct(),pe,(w,D)=>{var T=Go();ce(T,21,()=>e.entities.filter(S=>S.controller.seat===A(D)),pe,(S,W)=>{var _=Uo(),$=h(_);rt($,{get entity(){return A(W)},isVisibleForcibly:!0,state:"Selectable",entitySelectResolve:E=>e.resolve(E),get qty(){return e.qty},cardActionResolve:void 0,get selectedList(){return A(t)},set selectedList(E){te(t,kt(E))}}),g(S,_)}),L(()=>fe(T,`entities_list ${A(D)??""} svelte-1h1of0m`)),g(w,T)});var p=v(s,2),f=h(p);f.__click=[jo,e,t];var y=v(f,2);{var l=w=>{var D=zo();D.__click=[Yo,e],g(w,D)};R(y,w=>{e.cancelable&&w(l)})}L(w=>{F(C,e.title),f.disabled=w},[()=>!e.validator(A(t))]),g(o,k)};R(a,o=>{o(r)})}g(n,i),_e()}Hn(["click"]);const Jo=(n,e)=>{e.cancelable&&e.resolve(void 0)};var Xo=N('<div class="duel_card_wrapper svelte-11mc7y0"><!> <div> </div></div>'),el=(n,e)=>e.resolve(),tl=N('<div><button class="cancel_button svelte-11mc7y0">Cancel</button></div>'),nl=N('<div><button>★</button> <div><div> </div> <div class="flex svelte-11mc7y0"></div> <!></div></div>');function il(n,e){be(e,!0);const[t,i]=ks(),a=()=>cs(r,"$isDragging",t);let r=ds(!1);const o=()=>r.set(!0),k=()=>r.set(!1);e.view.onDragStart.append(o),e.view.onDragEnd.append(k);const m=s=>{const p=s.validate(e.view.duel.chainBlockInfos);return p&&p.length>0?"Draggable":"Clickable"};var c=he(),u=ne(c);{var C=s=>{var p=nl(),f=h(p);f.__click=[Jo,e];var y=v(f,2),l=h(y),w=h(l),D=v(l,2);ce(D,21,()=>e.actions,pe,(W,_)=>{var $=Xo(),E=h($);const U=Bt(()=>m(A(_))),re=Bt(()=>e.dragAndDropOnly?[]:[A(_)]);rt(E,{get entity(){return A(_).entity},isVisibleForcibly:!0,get state(){return A(U)},get actions(){return A(re)},get cardActionResolve(){return e.resolve}});var se=v(E,2),ue=h(se);L(()=>F(ue,`«${A(_).title??""}»`)),g(W,$)});var T=v(D,2);{var S=W=>{var _=tl(),$=h(_);$.__click=[el,e],g(W,_)};R(T,W=>{e.cancelable&&W(S)})}L(()=>{fe(p,`${`base ${a()?"minimum_mode":""}`??""} svelte-11mc7y0`),fe(f,`${`overlay ${a()?"minimum_mode":""}`??""} svelte-11mc7y0`),fe(y,`${`window ${a()?"minimum_mode":""}`??""} svelte-11mc7y0`),F(w,e.title)}),g(s,p)};R(u,s=>{s(C)})}g(n,c),_e(),i()}Hn(["click"]);const al=(n,e,t,i)=>{e().cancelable&&(t()(void 0),te(i,!1))};var rl=(n,e,t)=>e()(t()),sl=N("<li><button> </button></li>"),ol=(n,e)=>e()(void 0),ll=N("<button>Cancel</button>"),Al=N('<div class="base svelte-1103gpy"><button class="overlay svelte-1103gpy">★</button> <div class="window svelte-1103gpy"><div> </div> <ui class="text_list svelte-1103gpy"></ui> <!></div></div>');function dl(n,e){be(e,!1);let t=me(e,"arg",8),i=me(e,"resolve",8),a=Ce(!0);Oe();var r=he(),o=ne(r);{var k=m=>{var c=Al(),u=h(c);u.__click=[al,t,i,a];var C=v(u,2),s=h(C),p=h(s),f=v(s,2);ce(f,5,()=>t().choises,pe,(w,D)=>{let T=()=>A(D).seq,S=()=>A(D).text;var W=sl(),_=h(W);_.__click=[rl,i,T];var $=h(_);L(()=>{fe(W,`text_item ${T()??""} svelte-1103gpy`),F($,S())}),g(w,W)});var y=v(f,2);{var l=w=>{var D=ll();D.__click=[ol,i],g(w,D)};R(y,w=>{t().cancelable&&w(l)})}L(()=>F(p,t().title)),g(m,c)};R(o,m=>{A(a)&&m(k)})}g(n,r),_e()}Hn(["click"]);var pl=N('<div class="base svelte-1y912d"><!> <!> <!></div>');function cl(n,e){var C,s;be(e,!1);let t=me(e,"modalController",12);const i=()=>{t(t())};(s=(C=t())==null?void 0:C.onUpdate)==null||s.append(i),Oe();var a=pl(),r=h(a);{var o=p=>{Qo(p,{get title(){return t().duelEntitiesSelectorArg.title},get entities(){return t().duelEntitiesSelectorArg.entities},get validator(){return t().duelEntitiesSelectorArg.validator},get qty(){return t().duelEntitiesSelectorArg.qty},get cancelable(){return t().duelEntitiesSelectorArg.cancelable},resolve:f=>{t().duelEntitiesSelectorResolve(f)}})};R(r,p=>{t().states.DuelEntitiesSelector==="Shown"&&p(o)})}var k=v(r,2);{var m=p=>{const f=ye(()=>t().cardActionSelectorArg.dragAndDropOnly??!1);il(p,{get view(){return t().view},get title(){return t().cardActionSelectorArg.title},get actions(){return t().cardActionSelectorArg.actions},get dragAndDropOnly(){return A(f)},get cancelable(){return t().cardActionSelectorArg.cancelable},resolve:y=>{console.info(y),t().cardActionSelectorResolve(y)}})};R(k,p=>{t().states.DuelActionSelector==="Shown"&&p(m)})}var c=v(k,2);{var u=p=>{dl(p,{get arg(){return t().duelTextSelectorArg},resolve:f=>{console.info(f),t().duelTextSelectorResolve(f)}})};R(c,p=>{t().states.DuelTextSelector==="Shown"&&p(u)})}g(n,a),_e()}var kl=N('<div class="duel_card_info_row svelte-1qhzdl0"><div class="svelte-1qhzdl0"><pre class="description svelte-1qhzdl0"> </pre></div></div> <div class="duel_card_info_row svelte-1qhzdl0" style=" justify-content: space-between;"><div class="svelte-1qhzdl0"> </div> <div class="svelte-1qhzdl0"> </div></div>',1),ml=N('<div></div> <div class="svelte-1qhzdl0"> </div>',1),ul=N("<div> </div>"),hl=N("<div> </div>"),fl=N('<div class="duel_card_info_row svelte-1qhzdl0"><!> <!></div> <div class="duel_card_info_row svelte-1qhzdl0"></div>',1),wl=N('<div class="duel_card_row svelte-1qhzdl0"><div class="svelte-1qhzdl0"></div> <div class="svelte-1qhzdl0"> </div></div>'),Cl=N('<div class="duel_card_row svelte-1qhzdl0"><div class="svelte-1qhzdl0"></div> <div class="svelte-1qhzdl0"> </div></div>'),Dl=N('<div><div class="duel_card_info_header svelte-1qhzdl0"><div class="duel_card_info_row svelte-1qhzdl0"><div class="svelte-1qhzdl0"> </div></div> <div class="duel_card_info_row svelte-1qhzdl0" style="position:sticky; top:0;"><div class="svelte-1qhzdl0"> </div> <div class="svelte-1qhzdl0"> </div></div> <!> <!></div> <div class="duel_card_info_body svelte-1qhzdl0"><div class="duel_card_info_row svelte-1qhzdl0"><div class="svelte-1qhzdl0"><pre class="description svelte-1qhzdl0"> </pre></div></div></div> <div class="duel_card_info_footer svelte-1qhzdl0"><div class="duel_card_info_links svelte-1qhzdl0"><a target="_blank" rel="noopener noreferrer" title="遊戯王カードWiki" class="svelte-1qhzdl0">⇒遊戯王カードWiki</a> <a target="_blank" rel="noopener noreferrer" title="コナミカードデータベース" class="svelte-1qhzdl0"> </a></div></div></div>');function yl(n,e){be(e,!1);let t=me(e,"entity",8,void 0);const i=()=>t()?Se[t().origin.name]:void 0,a=()=>{var m;return t()&&(t().origin.cardId??!1)?`https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&cid=${t().origin.cardId}`:`https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&rp=10&mode=&sort=1&keyword=${(m=i())==null?void 0:m.name}&stype=1&ctype=&othercon=2&starfr=&starto=&pscalefr=&pscaleto=&linkmarkerfr=&linkmarkerto=&link_m=2&atkfr=&atkto=&deffr=&defto=&releaseDStart=1&releaseMStart=1&releaseYStart=1999&releaseDEnd=&releaseMEnd=&releaseYEnd=`};Oe();var r=he(),o=ne(r);{var k=m=>{var c=Dl(),u=h(c),C=h(u),s=h(C),p=h(s),f=v(C,2),y=h(f),l=h(y),w=v(y,2),D=h(w),T=v(f,2);{var S=I=>{var ee=kl(),P=ne(ee),V=h(P),H=h(V),q=h(H),K=v(P,2),G=h(K),z=h(G),j=v(G,2),Q=h(j);L(()=>{F(q,Se[t().origin.name].pendulumDescription),F(z,`◀ ${t().psL??""}`),F(Q,`${t().psR??""} ▶`)}),g(I,ee)};R(T,I=>{var ee;(ee=t().status.monsterCategories)!=null&&ee.includes("Pendulum")&&I(S)})}var W=v(T,2);{var _=I=>{var ee=fl(),P=ne(ee),V=h(P);ce(V,1,()=>t().attr,pe,(G,z)=>{var j=ml(),Q=ne(j),ae=v(Q,2),J=h(ae);L(()=>{fe(Q,`monster_attr ${A(z)??""} svelte-1qhzdl0`),F(J,`${ui[A(z)]??""}属性`)}),g(G,j)});var H=v(V,2);{var q=G=>{var z=ul(),j=h(z);L(()=>{fe(z,`monster_cat ${t().status.type??""} svelte-1qhzdl0`),F(j,`${on[t().status.type]??""}${Kn[t().status.type]??""}族`)}),g(G,z)};R(H,G=>{t().status.type&&G(q)})}var K=v(P,2);ce(K,5,()=>t().status.monsterCategories??[],pe,(G,z)=>{var j=hl(),Q=h(j);L(()=>{fe(j,`monster_cat ${A(z)??""} svelte-1qhzdl0`),F(Q,`${an[A(z)]??""}${Sn[A(z)]??""}`)}),g(G,j)}),g(I,ee)},$=I=>{var ee=he(),P=ne(ee);{var V=q=>{var K=wl(),G=v(h(K),2),z=h(G);L(()=>F(z,`${rn[t().status.spellCategory]??""}魔法`)),g(q,K)},H=q=>{var K=he(),G=ne(K);{var z=j=>{var Q=Cl(),ae=v(h(Q),2),J=h(ae);L(()=>F(J,`${sn[t().status.trapCategory]??""}罠`)),g(j,Q)};R(G,j=>{t().status.kind==="Trap"&&t().status.trapCategory&&j(z)},!0)}g(q,K)};R(P,q=>{t().status.kind==="Spell"&&t().status.spellCategory?q(V):q(H,!1)},!0)}g(I,ee)};R(W,I=>{t().status.kind==="Monster"?I(_):I($,!1)})}var E=v(u,2),U=h(E),re=h(U),se=h(re),ue=h(se),we=v(E,2),X=h(we),M=h(X),O=v(M,2),ie=h(O);L((I,ee,P,V,H,q)=>{var K;fe(c,`duel_card duel_card_info ${t().origin.kind??""} ${I??""} svelte-1qhzdl0`),F(p,t().nm),F(l,ee),F(D,P),F(ue,V),yt(M,"href",H),yt(O,"href",q),F(ie,`⇒${((K=t())!=null&&K.origin.cardId?"公式カードページ":"公式で検索")??""}`)},[()=>{var I;return(I=t().origin.monsterCategories)==null?void 0:I.join(" ")},()=>"★".repeat(t().status.level||0),()=>"☆".repeat(t().status.rank||0),()=>{var I;return(I=i())==null?void 0:I.description},()=>{var I;return(I=i())==null?void 0:I.wikiHref},a],ye),g(m,c)};R(o,m=>{t()&&m(k)})}g(n,r),_e()}var vl=N('<div class="duel_field_cell_info_item svelte-1xj7qf1"><!></div>'),gl=N('<div class="duel_field_cell_info_box svelte-1xj7qf1"><div class="duel_field_cell_info_label svelte-1xj7qf1"> </div> <!></div>'),Bl=N('<div class="duel_field_cell_info svelte-1xj7qf1"><div class="duel_field_cell_info_header item_btn svelte-1xj7qf1"><div class="svelte-1xj7qf1"> </div> <div class="svelte-1xj7qf1"> </div></div> <div class="duel_field_cell_info_body svelte-1xj7qf1"></div></div>');function El(n,e){be(e,!1);let t=me(e,"cell",12);const i=()=>{t(t())},a=s=>t().cardEntities.filter(p=>p.face===s);t().field.duel.view.onDuelUpdate.append(i),Oe();var r=Bl(),o=h(r),k=h(o),m=h(k),c=v(k,2),u=h(c),C=v(o,2);ce(C,4,()=>["FaceUp","FaceDown"],pe,(s,p)=>{var f=he(),y=ne(f);{var l=w=>{var D=gl(),T=h(D),S=h(T),W=v(T,2);ce(W,1,()=>a(p).toSorted(Ys),pe,(_,$)=>{var E=vl(),U=h(E);const re=ye(()=>t().owner===t().field.duel.duelists.Below);rt(U,{get entity(){return A($)},get isVisibleForcibly(){return A(re)},isWideMode:!0,cardActionResolve:void 0}),g(_,E)}),L(()=>F(S,p==="FaceUp"?"表向き":"裏向き")),g(w,D)};R(y,w=>{a(p).length&&w(l)})}g(s,f)}),L(()=>{var s;F(m,(s=t().owner)==null?void 0:s.profile.name),F(u,t().cellType)}),g(n,r),_e()}const Tl=co({duration:400});var xl=N('<div class="duel_field_header_message svelte-accyye"> </div> <div class="duel_field_header_buttons svelte-accyye"><button class="svelte-accyye">サレンダー</button></div>',1),Ml=N("<tr></tr>"),Nl=N('<table class="duel_field svelte-accyye"><tbody class="svelte-accyye"></tbody></table>'),bl=N('<button class="svelte-accyye">OK</button>'),_l=N('<div style="position:absolute;right:0;top:0"> </div> <div class="flex duel_desk svelte-accyye"><div class="duel_desk_left v_flex svelte-accyye"><!> <!> <!></div> <div class=" duel_desk_center v_flex svelte-accyye"><div class="duel_field_header svelte-accyye"><!></div> <div class="svelte-accyye"><!></div> <div class="duel_field_footer svelte-accyye"><!></div></div> <div class=" duel_desk_right svelte-accyye" style="text-align: left;"><!></div></div> <!>',1);function Fl(n,e){be(e,!1);let t=me(e,"duel",12),i=()=>{},a=Ce(()=>!0),r=Ce();const o=P=>{i=P.resolve,te(a,P.entitiesValidator),te(r,P.selectableEntities),P.duelEntitiesSelectorArg&&t().view.modalController.selectDuelEntities(P.duelEntitiesSelectorArg).then(V=>{i({selectedEntities:V})})};t().view.onWaitStart.append(o);let k=Ce(void 0);const m=P=>{te(k,P)};t().view.onShowCardEntity.append(m);let c=me(e,"selectedList",28,()=>[]);const u=()=>{t(t())};t().view.onDuelUpdate.append(u);const C=()=>{A(a)(c())&&i({selectedEntities:c()})},s=()=>{i({surrender:!0})};t().main(),Oe();var p=_l(),f=ne(p),y=h(f),l=v(f,2),w=h(l),D=h(w);$i(D,{get duelist(){return t().duelists.Above}});var T=v(D,2);yl(T,{get entity(){return A(k)}});var S=v(T,2);$i(S,{get duelist(){return t().duelists.Below}});var W=v(w,2),_=h(W),$=h(_);{var E=P=>{var V=xl(),H=ne(V),q=h(H),K=v(H,2),G=h(K);L(()=>F(q,`[TURN:${t().clock.turn}][PHASE:${t().phase}] ${t().view.message}`)),ve("click",G,s),g(P,V)};R($,P=>{t().isEnded||P(E)})}var U=v(_,2),re=h(U);{var se=P=>{var V=Nl(),H=h(V);ce(H,5,()=>t().field.cells,pe,(q,K,G)=>{var z=Ml();fe(z,`${`duel_desk_row_${G}`??""} svelte-accyye`),ce(z,5,()=>A(K),pe,(j,Q,ae)=>{Wo(j,{get view(){return t().view},row:G,column:ae,get selectedList(){return c()},set selectedList(J){c(J)},$$legacy:!0})}),g(q,z)}),g(P,V)};R(re,P=>{t().clock.turn>0&&P(se)})}var ue=v(U,2),we=h(ue);{var X=P=>{var V=bl();L(H=>V.disabled=H,[()=>!A(a)(c())],ye),ve("click",V,C),g(P,V)};R(we,P=>{A(r)&&A(r).length>0&&P(X)})}var M=v(W,2),O=h(M);{var ie=P=>{Oo(P,{get log(){return t().log}})},I=P=>{var V=he(),H=ne(V);{var q=K=>{El(K,{get cell(){return t().view.infoBoardCell}})};R(H,K=>{t().view.infoBoardState==="CellInfo"&&K(q)},!0)}g(P,V)};R(O,P=>{t().view.infoBoardState==="Log"?P(ie):P(I,!1)})}var ee=v(l,2);cl(ee,{get modalController(){return t().view.modalController}}),L(P=>F(y,P),[()=>t().clock.toString()],ye),g(n,p),_e()}var Hl=N("<div></div>"),Sl=N('<span> </span> / <span style="display: inline-block;width:2rem;text-align: right;"> </span>',1),Kl=N('<li class="deck_editor_item svelte-vivzk2"><div role="listitem"><div class="svelte-vivzk2"><div class="svelte-vivzk2"> </div> <div style="display:flex" class="svelte-vivzk2"><div class="svelte-vivzk2"><!> <!> <!> <!> <!> <!> <!></div> <div style="flex-grow: 1; width:0.1rem" class="svelte-vivzk2"></div> <div class="svelte-vivzk2"><!></div></div></div></div> <button class="button_style_reset svelte-vivzk2">+</button> <button class="button_style_reset svelte-vivzk2">-</button></li>'),Pl=N('<div class="deck_editor_card_kind svelte-vivzk2"><span class="svelte-vivzk2"> </span> <ul class="svelte-vivzk2"></ul></div>'),ql=N('<div class="deck_editor_deck_type svelte-vivzk2"><span class="svelte-vivzk2"> </span> <!></div>'),Wl=N('<div class="deck_editor_card_list svelte-vivzk2"></div>');function Ui(n,e){be(e,!1);let t=me(e,"allCardInfos",8),i=me(e,"deckCardInfos",12),a=me(e,"mode",8),r=me(e,"onAttention",8);const o={Deck:["Monster","Spell","Trap"],ExtraDeck:["Monster"]},k=(C,s)=>(a()==="List"?t():i()).filter(p=>{var f;return ei.has(p.name)||((f=p.monsterCategories)==null?void 0:f.includes("Normal"))}).filter(p=>!s||p.kind===s).filter(p=>{var f,y;return!C||C==="Deck"&&!((f=p==null?void 0:p.monsterCategories)!=null&&f.union(Zt).length)||C==="ExtraDeck"&&((y=p==null?void 0:p.monsterCategories)==null?void 0:y.union(Zt).length)}).toSorted(kn),m=(C,s)=>{const p=i().filter(y=>y.name===s.name).length;if(p>2)return;const f=C.shiftKey?3-p:1;f<1||(i().push(...Array(f).fill(s)),i().sort(kn),i(i()))},c=(C,s)=>{let p=0;i(i().filter(f=>f.name!==s.name?!0:(p++,!C.shiftKey&&p>1))),i().sort(kn)};Oe();var u=Wl();ce(u,5,()=>ys,pe,(C,s)=>{var p=ql(),f=h(p),y=h(f),l=v(f,2);ce(l,1,()=>o[A(s)],pe,(w,D)=>{var T=Pl(),S=h(T),W=h(S),_=v(S,2);ce(_,5,()=>k(A(s),A(D)),pe,($,E)=>{var U=Kl(),re=h(U),se=h(re),ue=h(se),we=h(ue),X=v(ue,2),M=h(X),O=h(M);{var ie=b=>{var Z=_t();L(()=>F(Z,`★${A(E).level??""}`)),g(b,Z)};R(O,b=>{A(E).level&&b(ie)})}var I=v(O,2);{var ee=b=>{var Z=_t();L(()=>F(Z,`☆${A(E).rank??""}`)),g(b,Z)};R(I,b=>{A(E).rank&&b(ee)})}var P=v(I,2);{var V=b=>{var Z=Hl();L(()=>fe(Z,`monster_attr ${A(E).attribute??""} svelte-vivzk2`)),g(b,Z)};R(P,b=>{A(E).attribute!==void 0&&b(V)})}var H=v(P,2);{var q=b=>{var Z=_t();L(()=>F(Z,on[A(E).type])),g(b,Z)};R(H,b=>{A(E).type!==void 0&&b(q)})}var K=v(H,2);ce(K,1,()=>A(E).monsterCategories??[],pe,(b,Z)=>{var le=_t();L(()=>F(le,an[A(Z)])),g(b,le)});var G=v(K,2);{var z=b=>{var Z=_t();L(()=>F(Z,`${rn[A(E).spellCategory]??""}魔法`)),g(b,Z)};R(G,b=>{A(E).spellCategory!==void 0&&b(z)})}var j=v(G,2);{var Q=b=>{var Z=_t();L(()=>F(Z,`${sn[A(E).trapCategory]??""}罠`)),g(b,Z)};R(j,b=>{A(E).trapCategory!==void 0&&b(Q)})}var ae=v(M,4),J=h(ae);{var x=b=>{var Z=Sl(),le=ne(Z),Ae=h(le),Ye=v(le,2),wt=h(Ye);L(()=>{F(Ae,A(E).attack),F(wt,A(E).defense??"-")}),g(b,Z)};R(J,b=>{A(E).attack!==void 0&&b(x)})}var B=v(re,2),Y=v(B,2);L(b=>{fe(re,`${b??""} svelte-vivzk2`),F(we,A(E).name)},[()=>{var b,Z;return`deck_editor_card duel_card ${A(E).kind} ${(Z=(b=A(E))==null?void 0:b.monsterCategories)==null?void 0:Z.join(" ")} ${ei.has(A(E).name)?"is_implemented":"is_not_implemented"}`}],ye),ve("mouseenter",re,()=>r()(A(E))),ve("click",B,b=>m(b,A(E))),ve("click",Y,b=>c(b,A(E))),g($,U)}),L(()=>F(W,ba[A(D)])),g(w,T)}),L(()=>F(y,vs[A(s)])),g(C,p)}),g(n,u),_e()}var Ll=N('<div class="duel_card_info_row svelte-1xf9hqi"><div class="svelte-1xf9hqi"><pre class="description svelte-1xf9hqi"> </pre></div></div> <div class="duel_card_info_row svelte-1xf9hqi" style=" justify-content: space-between;"><div class="svelte-1xf9hqi"> </div> <div class="svelte-1xf9hqi"> </div></div>',1),Rl=N('<div></div> <div class="svelte-1xf9hqi"> </div>',1),Ol=N("<div> </div>"),Zl=N("<div> </div>"),Il=N('<div class="duel_card_info_row svelte-1xf9hqi"><!> <!></div> <div class="duel_card_info_row svelte-1xf9hqi"></div>',1),$l=N('<div class="duel_card_row svelte-1xf9hqi"><div class="svelte-1xf9hqi"></div> <div class="svelte-1xf9hqi"> </div></div>'),Ul=N('<div class="duel_card_row svelte-1xf9hqi"><div class="svelte-1xf9hqi"></div> <div class="svelte-1xf9hqi"> </div></div>'),Gl=N('<div><div class="duel_card_info_header svelte-1xf9hqi"><div class="duel_card_info_row svelte-1xf9hqi"><div class="svelte-1xf9hqi"> </div></div> <div class="duel_card_info_row svelte-1xf9hqi" style="position:sticky; top:0;"><div class="svelte-1xf9hqi"> </div> <div class="svelte-1xf9hqi"> </div></div></div> <div class="duel_card_info_body svelte-1xf9hqi"><!> <!> <div class="duel_card_info_row description svelte-1xf9hqi"><div class="svelte-1xf9hqi"><pre class="description svelte-1xf9hqi"> </pre></div></div> <div class="duel_card_info_links svelte-1xf9hqi"><a target="_blank" rel="noopener noreferrer" title="遊戯王カードWiki" class="svelte-1xf9hqi">⇒遊戯王カードWiki</a></div></div></div>');function jl(n,e){be(e,!1);let t=me(e,"cardInfo",8,void 0);const i=()=>t()?Se[t().name]:void 0;Oe();var a=he(),r=ne(a);{var o=k=>{var m=Gl(),c=h(m),u=h(c),C=h(u),s=h(C),p=v(u,2),f=h(p),y=h(f),l=v(f,2),w=h(l),D=v(c,2),T=h(D);{var S=X=>{var M=Ll(),O=ne(M),ie=h(O),I=h(ie),ee=h(I),P=v(O,2),V=h(P),H=h(V),q=v(V,2),K=h(q);L(()=>{F(ee,Se[t().name].pendulumDescription),F(H,`◀ ${t().pendulumScaleL??""}`),F(K,`${t().pendulumScaleR??""} ▶`)}),g(X,M)};R(T,X=>{var M;(M=t().monsterCategories)!=null&&M.includes("Pendulum")&&X(S)})}var W=v(T,2);{var _=X=>{var M=Il(),O=ne(M),ie=h(O);{var I=H=>{var q=Rl(),K=ne(q),G=v(K,2),z=h(G);L(()=>{fe(K,`monster_attr ${t().attribute??""} svelte-1xf9hqi`),F(z,`${ui[t().attribute]??""}属性`)}),g(H,q)};R(ie,H=>{t().attribute&&H(I)})}var ee=v(ie,2);{var P=H=>{var q=Ol(),K=h(q);L(()=>{fe(q,`monster_cat ${t().type??""} svelte-1xf9hqi`),F(K,`${on[t().type]??""}${Kn[t().type]??""}族`)}),g(H,q)};R(ee,H=>{t().type&&H(P)})}var V=v(O,2);ce(V,5,()=>t().monsterCategories??[],pe,(H,q)=>{var K=Zl(),G=h(K);L(()=>{fe(K,`monster_cat ${A(q)??""} svelte-1xf9hqi`),F(G,`${an[A(q)]??""}${Sn[A(q)]??""}`)}),g(H,K)}),g(X,M)},$=X=>{var M=he(),O=ne(M);{var ie=ee=>{var P=$l(),V=v(h(P),2),H=h(V);L(()=>F(H,`${rn[t().spellCategory]??""}魔法`)),g(ee,P)},I=ee=>{var P=he(),V=ne(P);{var H=q=>{var K=Ul(),G=v(h(K),2),z=h(G);L(()=>F(z,`${sn[t().trapCategory]??""}罠`)),g(q,K)};R(V,q=>{t().kind==="Trap"&&t().trapCategory&&q(H)},!0)}g(ee,P)};R(O,ee=>{t().kind==="Spell"&&t().spellCategory?ee(ie):ee(I,!1)},!0)}g(X,M)};R(W,X=>{t().kind==="Monster"?X(_):X($,!1)})}var E=v(W,2),U=h(E),re=h(U),se=h(re),ue=v(E,2),we=h(ue);L((X,M,O,ie,I)=>{fe(m,`duel_card duel_card_info ${t().kind??""} ${X??""} svelte-1xf9hqi`),F(s,t().name),F(y,M),F(w,O),F(se,ie),yt(we,"href",I)},[()=>{var X;return(X=t().monsterCategories)==null?void 0:X.join(" ")},()=>"★".repeat(t().level||0),()=>"☆".repeat(t().rank||0),()=>{var X;return(X=i())==null?void 0:X.description},()=>{var X;return(X=i())==null?void 0:X.wikiHref}],ye),g(k,m)};R(r,k=>{t()&&k(o)})}g(n,a),_e()}const Yl={0:{aaa:"日",aaaa:"日曜日",ddd:"Sun",dddd:"Sunday"},1:{aaa:"月",aaaa:"月曜日",ddd:"Mon",dddd:"Monday"},2:{aaa:"火",aaaa:"火曜日",ddd:"Tue",dddd:"Tuesday"},3:{aaa:"水",aaaa:"水曜日",ddd:"Wed",dddd:"Wednesday"},4:{aaa:"木",aaaa:"木曜日",ddd:"Thu",dddd:"Thursday"},5:{aaa:"金",aaaa:"金曜日",ddd:"Fri",dddd:"Friday"},6:{aaa:"土",aaaa:"土曜日",ddd:"Sat",dddd:"Saturday"}};class zl{constructor(){d(this,"DefaultSeparator1","/");d(this,"DefaultSeparator2"," ");d(this,"DefaultSeparator3",":");d(this,"createDate",e=>{if(!e)return;const t=new Date(e);if(!isNaN(t.getTime()))return t});d(this,"createDateOr",(e,t)=>this.createDate(e)||t||new Date);d(this,"truncateDate",e=>{const t=e||new Date;return new Date(t.getFullYear(),t.getMonth(),t.getDate())});d(this,"addDate",(e,t)=>{const i=this.createDateOr(e);return i.setDate(i.getDate()+t),i});d(this,"addMonth",(e,t)=>{const i=this.createDateOr(e);return i.setMonth(i.getMonth()+t),i});d(this,"addYear",(e,t)=>{const i=this.createDateOr(e);return i.setFullYear(i.getFullYear()+t),i});d(this,"getDayOfWeek",(e,t="dddd")=>{const i=this.createDate(e);return i?Yl[i.getDay()][t]:""});d(this,"formatToYYYYMMDD",(e,t=this.DefaultSeparator1)=>{const i=this.createDate(e);if(!i)return"";const a=i.getFullYear().toString(),r=("0"+(i.getMonth()+1)).slice(-2),o=("0"+i.getDate()).slice(-2);return a+t+r+t+o});d(this,"formatToYYYYMM",(e,t=this.DefaultSeparator1)=>{const i=this.createDate(e);if(!i)return"";t||(t="");const a=i.getFullYear().toString(),r=("0"+(i.getMonth()+1)).slice(-2);return a+t+r});d(this,"formatToHHMMSS",(e,t=this.DefaultSeparator3)=>{const i=this.createDate(e);if(!i)return"";t||(t="");const a=i.getHours(),r=i.getMinutes(),o=i.getSeconds();return("0"+a).slice(-2)+t+("0"+r).slice(-2)+t+("0"+o).slice(-2)});d(this,"formatToHHMM",(e,t=this.DefaultSeparator3)=>{const i=this.createDate(e);if(!i)return"";t||(t="");const a=("0"+i.getHours()).slice(-2),r=("0"+i.getMinutes()).slice(-2);return a+t+r});d(this,"formatToYYYYMMDD_HHMM",(e,t=this.DefaultSeparator1,i=this.DefaultSeparator2,a=this.DefaultSeparator3)=>{const r=this.createDate(e);return r?this.formatToYYYYMMDD(r,t)+i+this.formatToHHMM(r,a):""});d(this,"formatToYYYYMMDD_HHMMSS",(e,t=this.DefaultSeparator1,i=this.DefaultSeparator2,a=this.DefaultSeparator3)=>{const r=this.createDate(e);return r?this.formatToYYYYMMDD(r,t)+i+this.formatToHHMMSS(r,a):""})}}const je=new zl;Date.prototype.truncateDate=function(){return je.truncateDate(this)};Date.prototype.getCloneOr=function(n){return je.createDateOr(this,n)};Date.prototype.addDate=function(n){return je.addDate(this,n)};Date.prototype.addMonth=function(n){return je.addDate(this,n)};Date.prototype.addYear=function(n){return je.addDate(this,n)};Date.prototype.getDayOfWeek=function(n="dddd"){return je.getDayOfWeek(this,n)};Date.prototype.formatToYYYYMM=function(n){return je.formatToYYYYMM(this,n)};Date.prototype.formatToYYYYMMDD=function(n){return je.formatToYYYYMMDD(this,n)};Date.prototype.formatToYYYYMMDD_HHMM=function(n,e,t){return je.formatToYYYYMMDD_HHMM(this,n,e,t)};Date.prototype.formatToYYYYMMDD_HHMMSS=function(n,e,t){return je.formatToYYYYMMDD_HHMMSS(this,n,e,t)};Date.prototype.formatToHHMM=function(n){return je.formatToHHMM(this,n)};Date.prototype.formatToHHMMSS=function(n){return je.formatToHHMMSS(this,n)};var Vl=N('<label><input type="checkbox"> </label>'),Ql=N('<label><input type="checkbox"> </label>'),Jl=N('<label><input type="checkbox"> <div style="display: inline-block;"></div> </label>'),Xl=N('<label><input type="checkbox"> </label>'),eA=N('<label><input type="checkbox"> </label>'),tA=N('<label><input type="checkbox"> </label>'),nA=N("<option> </option>"),iA=N('<div class="deck_editor_body_right_header svelte-rsq0rf"><div class="deck_editor_body_right_header_row svelte-rsq0rf"><div class="svelte-rsq0rf">編集対象</div> <select></select></div> <div class="deck_editor_body_right_header_row svelte-rsq0rf"><div class="svelte-rsq0rf">新規名称</div> <input type="text"></div> <div class="deck_editor_body_right_header_row svelte-rsq0rf"><div class="svelte-rsq0rf">操作</div> <div class="svelte-rsq0rf"><button class="svelte-rsq0rf">デッキを保存</button></div> <div class="svelte-rsq0rf"></div> <div class="svelte-rsq0rf"><button class="svelte-rsq0rf">デッキを複製</button></div> <div class="svelte-rsq0rf"><button title="shiftキー押下で確認メッセージスキップ" class="svelte-rsq0rf">デッキを削除</button></div></div></div> <!>',1),aA=N("<div>デッキ情報読込中</div>"),rA=N('<div class="deck_editor svelte-rsq0rf"><div class="deck_editor_header"></div> <div class="deck_editor_body svelte-rsq0rf"><div class="deck_editor_body_left svelte-rsq0rf"><div class="deck_editor_search_box svelte-rsq0rf"><div><div>検索条件</div></div> <div class="deck_editor_search_box_row svelte-rsq0rf"><div class="svelte-rsq0rf">名称</div> <div class="svelte-rsq0rf"><input type="text" style="width:70%">※ルビには対応していません</div></div> <div class="deck_editor_search_box_row svelte-rsq0rf"><div class="svelte-rsq0rf">種類</div> <div class="svelte-rsq0rf"></div></div> <div class="deck_editor_search_box_row svelte-rsq0rf"><div class="svelte-rsq0rf">モンスター</div> <div class="svelte-rsq0rf"></div></div> <div class="deck_editor_search_box_row svelte-rsq0rf"><div class="svelte-rsq0rf">属性</div> <div class="svelte-rsq0rf"></div></div> <div class="deck_editor_search_box_row svelte-rsq0rf"><div class="svelte-rsq0rf">種族</div> <div class="svelte-rsq0rf"></div></div> <div class="deck_editor_search_box_row svelte-rsq0rf"><div class="svelte-rsq0rf">魔法</div> <div class="svelte-rsq0rf"></div></div> <div class="deck_editor_search_box_row svelte-rsq0rf"><div class="svelte-rsq0rf">罠</div> <div class="svelte-rsq0rf"></div></div></div> <!></div> <div class="deck_editor_body_center svelte-rsq0rf"><!></div> <div class="deck_editor_body_right svelte-rsq0rf"><!></div></div></div>');function sA(n,e){be(e,!1);const t=[],i=[],a=[],r=[],o=[],k=[],m=async()=>{const B=(await A(C)).find(Y=>Y.id===A(u));B&&te(p,{...B,cardInfos:B.cardNames.map(Y=>Se[Y])})},c=()=>gt.getAllDeckInfo().then(x=>(x.forEach(B=>console.log(B.id,B.lastUsedAt,B.lastUsedAt.getTime())),console.log(Math.max(...x.map(B=>B.lastUsedAt.getTime()))),te(u,(x.find(B=>B.lastUsedAt.getTime()===Math.max(...x.map(Y=>Y.lastUsedAt.getTime())))??x[0]).id),x));let u=Ce(-1),C=Ce(c());A(C).then(m);const s=()=>{te(C,c()),m()};let p=Ce({id:Number.MIN_VALUE,name:"",description:"",lastUsedAt:new Date,cardInfos:[]}),f=Ce(Se.ゾンビーノ);const y=Ce({name:"",cardKinds:[...Jn],monsterCategories:[...Fi].filter(x=>x!=="Normal"&&x!=="Token"),monsterAttributes:[...Hi],monsterTypes:[...Si],spellCategories:[...Ki],trapCategories:[...Pi]}),l=()=>Object.values(Se).filter(x=>{var B;if(!A(y).cardKinds.includes(x.kind)||A(y).name.trim().length&&!x.name.includes(A(y).name))return!1;if(x.kind==="Monster")return x.attribute&&!A(y).monsterAttributes.includes(x.attribute)||x.type&&!A(y).monsterTypes.includes(x.type)?!1:(B=x.monsterCategories)==null?void 0:B.union(A(y).monsterCategories).length;if(x.kind==="Spell")return x.spellCategory&&A(y).spellCategories.includes(x.spellCategory);if(x.kind==="Trap")return x.trapCategory&&A(y).trapCategories.includes(x.trapCategory)}),w=x=>{te(f,x)},D=async()=>{const B=(await A(C)).find(Y=>Y.id===A(u));if(!B)throw new Error("illegal state");return B},T=async()=>{const x=await D();await x.saveDeckInfo({...x,name:A(p).name,cardNames:A(p).cardInfos.map(B=>B.name),lastUsedAt:new Date}),s()},S=async()=>{(await gt.createNewDeck(`デッキ_${new Date().formatToYYYYMMDD_HHMMSS("","","")}`,`コピー日時：${new Date().formatToYYYYMMDD_HHMMSS("-"," ",":")}`,A(p).cardInfos.map(B=>B.name))).saveDeckInfo(),s()},W=async x=>{const B=await D();!x.shiftKey&&!confirm(`デッキ【${B.name}】を削除します。
よろしいですか？`)||(await B.delete(),s())};Oe();var _=rA(),$=v(h(_),2),E=h($),U=h(E),re=v(h(U),2),se=v(h(re),2),ue=h(se),we=v(re,2),X=v(h(we),2);ce(X,5,()=>Jn,pe,(x,B)=>{var Y=Vl(),b=h(Y),Z,le=v(b);L(()=>{Z!==(Z=A(B))&&(b.value=(b.__value=A(B))==null?"":A(B)),F(le,` ${ba[A(B)]??""}`)}),St(t,[],b,()=>(A(B),A(y).cardKinds),Ae=>Le(y,A(y).cardKinds=Ae)),g(x,Y)});var M=v(we,2),O=v(h(M),2);ce(O,5,()=>Fi,pe,(x,B)=>{var Y=Ql(),b=h(Y),Z,le=v(b);L(()=>{Z!==(Z=A(B))&&(b.value=(b.__value=A(B))==null?"":A(B)),F(le,` ${an[A(B)]??""}${Sn[A(B)]??""}`)}),St(i,[],b,()=>(A(B),A(y).monsterCategories),Ae=>Le(y,A(y).monsterCategories=Ae)),g(x,Y)});var ie=v(M,2),I=v(h(ie),2);ce(I,5,()=>Hi,pe,(x,B)=>{var Y=Jl(),b=h(Y),Z,le=v(b,2),Ae=v(le);L(()=>{Z!==(Z=A(B))&&(b.value=(b.__value=A(B))==null?"":A(B)),fe(le,`monster_attr ${A(f).attribute??""} svelte-rsq0rf`),F(Ae,` ${ui[A(B)]??""}`)}),St(a,[],b,()=>(A(B),A(y).monsterAttributes),Ye=>Le(y,A(y).monsterAttributes=Ye)),g(x,Y)});var ee=v(ie,2),P=v(h(ee),2);ce(P,5,()=>Si,pe,(x,B)=>{var Y=Xl(),b=h(Y),Z,le=v(b);L(()=>{Z!==(Z=A(B))&&(b.value=(b.__value=A(B))==null?"":A(B)),F(le,` ${on[A(B)]??""}
                ${Kn[A(B)]??""}`)}),St(r,[],b,()=>(A(B),A(y).monsterTypes),Ae=>Le(y,A(y).monsterTypes=Ae)),g(x,Y)});var V=v(ee,2),H=v(h(V),2);ce(H,5,()=>Ki,pe,(x,B)=>{var Y=eA(),b=h(Y),Z,le=v(b);L(()=>{Z!==(Z=A(B))&&(b.value=(b.__value=A(B))==null?"":A(B)),F(le,` ${rn[A(B)]??""}`)}),St(o,[],b,()=>(A(B),A(y).spellCategories),Ae=>Le(y,A(y).spellCategories=Ae)),g(x,Y)});var q=v(V,2),K=v(h(q),2);ce(K,5,()=>Pi,pe,(x,B)=>{var Y=tA(),b=h(Y),Z,le=v(b);L(()=>{Z!==(Z=A(B))&&(b.value=(b.__value=A(B))==null?"":A(B)),F(le,` ${sn[A(B)]??""}`)}),St(k,[],b,()=>(A(B),A(y).trapCategories),Ae=>Le(y,A(y).trapCategories=Ae)),g(x,Y)});var G=v(U,2);jl(G,{get cardInfo(){return A(f)}});var z=v(E,2),j=h(z);const Q=ye(l);Ui(j,{mode:"List",get allCardInfos(){return A(Q)},onAttention:w,get deckCardInfos(){return A(p).cardInfos},set deckCardInfos(x){Le(p,A(p).cardInfos=x)},$$legacy:!0});var ae=v(z,2),J=h(ae);jn(J,()=>A(C),x=>{var B=aA();g(x,B)},(x,B)=>{var Y=iA(),b=ne(Y),Z=h(b),le=v(h(Z),2);L(()=>{A(u),Ba(()=>{A(B)})}),ce(le,5,()=>A(B),pe,(Qe,Nt)=>{var bt=nA(),wi={},Wa=h(bt);L(()=>{wi!==(wi=A(Nt).id)&&(bt.value=(bt.__value=A(Nt).id)==null?"":A(Nt).id),F(Wa,A(Nt).name)}),g(Qe,bt)});var Ae=v(Z,2),Ye=v(h(Ae),2),wt=v(Ae,2),xt=v(h(wt),2),nt=h(xt),it=v(xt,4),jt=h(it),Yt=v(it,2),Mt=h(Yt),Ve=v(b,2);Ui(Ve,{mode:"Deck",allCardInfos:[],onAttention:w,get deckCardInfos(){return A(p).cardInfos},set deckCardInfos(Qe){Le(p,A(p).cardInfos=Qe)},$$legacy:!0}),Ma(le,()=>A(u),Qe=>te(u,Qe)),ve("change",le,m),zn(Ye,()=>A(p).name,Qe=>Le(p,A(p).name=Qe)),ve("click",nt,T),ve("click",jt,S),ve("click",Mt,W),g(x,Y)}),zn(ue,()=>A(y).name,x=>Le(y,A(y).name=x)),g(n,_),_e()}const oA="2025-03-15 16:32:07",lA={timestamp:oA},AA=["TblDeckHeader","TblDeckDetail","TblDuelistProfile"],dA=3;var pA=N("<option> </option>"),cA=N('<div class="svelte-bc2zvv"><label for="deck_selector" class="deck_selector svelte-bc2zvv">デッキ：</label> <select id="deck_selector" class="deck_selector svelte-bc2zvv"></select></div> <div class="svelte-bc2zvv"><button class="btn svelte-bc2zvv">duel start!</button></div>',1),kA=N('<div class="svelte-bc2zvv">デッキ情報の読み込み、もしくは作成中...</div>'),mA=N('<div class="svelte-bc2zvv"><label for="duelist_name" class="duelist_name svelte-bc2zvv">名前：</label> <input id="duelist_name" class="duelist_name svelte-bc2zvv" type="text"></div> <!> <div class="svelte-bc2zvv"><button class="btn svelte-bc2zvv">deck edit</button></div>',1),uA=N('<div class="svelte-bc2zvv">デュエリスト情報の読み込み、もしくは作成中...</div>'),hA=N('<div class="app_body svelte-bc2zvv"><!></div>'),fA=N('<main class="svelte-bc2zvv"><!> <div class="debug_info svelte-bc2zvv"><span> </span> <span class="screen_info"></span></div></main>');function wA(n,e){be(e,!1);const t=new hs("stk_ygo_svelte",dA,AA);let i=Ce(),a=Ce("None"),r=Ce(0);const o=Qn.getOrCreateNew(t);let k=Ce(gt.getAllDeckInfo(t).then(_=>(Promise.all(_.filter($=>!$.lastUsedAt).map($=>{$.saveDeckInfo()})),te(r,(_.find($=>$.lastUsedAt.getTime()===Math.max(..._.map(E=>E.lastUsedAt.getTime())))??_[0]).id),_)));const m=async()=>{let _=(await A(k)).find($=>$.id===A(r));if(_||(_=(await u()).find($=>$.id===A(r))),!_)throw new Error("illegal state");return _},c=async()=>{(await o).save()},u=()=>(te(k,gt.getAllDeckInfo(t).then(_=>(te(r,(_.find($=>$.lastUsedAt.getTime()===Math.max(..._.map(E=>E.lastUsedAt.getTime())))??_[0]).id),_))),A(k)),C=async()=>{(await A(k)).length||(await gt.prepareSampleDeck(),u())},s=async()=>{await Promise.all([c(),C()]),(await m()).updateTimestamp(),te(i,new to(await o,"Player",await m(),Ds[0],"NPC",mn[0]))},p=async()=>{console.log("hoge"),await Promise.all([c(),C()]),te(a,"DeckEdit")},f=async _=>{await c(),_.key==="Enter"&&!_.repeat&&(await o).save()};C(),Oe();var y=fA(),l=h(y);{var w=_=>{Fl(_,{get duel(){return A(i)}})},D=_=>{var $=he(),E=ne($);{var U=se=>{sA(se,{})},re=se=>{var ue=hA(),we=h(ue);jn(we,()=>o,X=>{var M=uA();g(X,M)},(X,M)=>{var O=mA(),ie=ne(O),I=v(h(ie),2),ee=v(ie,2);jn(ee,()=>A(k),H=>{var q=kA();g(H,q)},(H,q)=>{var K=cA(),G=ne(K),z=v(h(G),2);L(()=>{A(r),Ba(()=>{A(q)})}),ce(z,5,()=>A(q),pe,(ae,J)=>{var x=pA(),B={},Y=h(x);L(()=>{B!==(B=A(J).id)&&(x.value=(x.__value=A(J).id)==null?"":A(J).id),F(Y,A(J).name)}),g(ae,x)});var j=v(G,2),Q=h(j);Ma(z,()=>A(r),ae=>te(r,ae)),ve("click",Q,s),g(H,K)});var P=v(ee,2),V=h(P);zn(I,()=>A(M).name,H=>A(M).name=H),ve("keypress",I,f),ve("click",V,p),g(X,O)}),g(se,ue)};R(E,se=>{A(a)==="DeckEdit"?se(U):se(re,!1)},!0)}g(_,$)};R(l,_=>{A(i)?_(w):_(D,!1)})}var T=v(l,2),S=h(T),W=h(S);L(()=>F(W,`build at: ${lA.timestamp}`)),g(n,y),_e()}jr(wA,{target:document.getElementById("app")});
