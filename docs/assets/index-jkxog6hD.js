var Aa=Object.defineProperty;var oa=(n,e,t)=>e in n?Aa(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var A=(n,e,t)=>oa(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();const Cn=!1;var bn=Array.isArray,la=Array.prototype.indexOf,Fn=Array.from,ki=Object.defineProperty,wt=Object.getOwnPropertyDescriptor,ci=Object.getOwnPropertyDescriptors,da=Object.prototype,pa=Array.prototype,_n=Object.getPrototypeOf;function ka(n){return typeof n=="function"}const He=()=>{};function ca(n){return typeof(n==null?void 0:n.then)=="function"}function ma(n){return n()}function fn(n){for(var e=0;e<n.length;e++)n[e]()}const Se=2,mi=4,Jt=8,en=16,$e=32,Ht=64,$t=128,Me=256,zt=512,fe=1024,ze=2048,Bt=4096,je=8192,tn=16384,ui=32768,nn=65536,ua=1<<17,ha=1<<19,hi=1<<20,ot=Symbol("$state"),wa=Symbol("legacy props"),Ca=Symbol("");function wi(n){return n===this.v}function Ci(n,e){return n!=n?e==e:n!==e||n!==null&&typeof n=="object"||typeof n=="function"}function Hn(n){return!Ci(n,this.v)}function fa(n){throw new Error("https://svelte.dev/e/effect_in_teardown")}function Da(){throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function ya(n){throw new Error("https://svelte.dev/e/effect_orphan")}function ga(){throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function Ba(n){throw new Error("https://svelte.dev/e/props_invalid_value")}function va(){throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function Ea(){throw new Error("https://svelte.dev/e/state_prototype_fixed")}function Ta(){throw new Error("https://svelte.dev/e/state_unsafe_local_read")}function xa(){throw new Error("https://svelte.dev/e/state_unsafe_mutation")}let Kt=!1,Ma=!1;function Na(){Kt=!0}const Kn=1,Sn=2,fi=4,ba=8,Fa=16,_a=1,Ha=2,Ka=4,Sa=8,Wa=16,Pa=1,La=2,qa=4,Ra=1,Ia=2,he=Symbol();let Ae=null;function Vt(n){Ae=n}function Fe(n,e=!1,t){Ae={p:Ae,c:null,e:null,m:!1,s:n,x:null,l:null},Kt&&!e&&(Ae.l={s:null,u:null,r1:[],r2:we(!1)})}function _e(n){const e=Ae;if(e!==null){const s=e.e;if(s!==null){var t=Y,i=Q;e.e=null;try{for(var a=0;a<s.length;a++){var r=s[a];be(r.effect),Ne(r.reaction),rn(r.fn)}}finally{be(t),Ne(i)}}Ae=e.p,e.m=!0}return{}}function vt(){return!Kt||Ae!==null&&Ae.l===null}function we(n,e){var t={f:0,v:n,reactions:null,equals:wi,rv:0,wv:0};return t}function Za(n){return Di(we(n))}function yt(n,e=!1){var i;const t=we(n);return e||(t.equals=Hn),Kt&&Ae!==null&&Ae.l!==null&&((i=Ae.l).s??(i.s=[])).push(t),t}function ge(n,e=!1){return Di(yt(n,e))}function Di(n){return Q!==null&&!Le&&Q.f&Se&&(qe===null?Ja([n]):qe.push(n)),n}function cn(n,e){return U(n,it(()=>c(n))),e}function U(n,e){return Q!==null&&!Le&&vt()&&Q.f&(Se|en)&&(qe===null||!qe.includes(n))&&xa(),Ct(n,e)}function Ct(n,e){return n.equals(e)||(n.v,n.v=e,n.wv=Li(),yi(n,ze),vt()&&Y!==null&&Y.f&fe&&!(Y.f&($e|Ht))&&(Ze===null?er([n]):Ze.push(n))),e}function yi(n,e){var t=n.reactions;if(t!==null)for(var i=vt(),a=t.length,r=0;r<a;r++){var s=t[r],l=s.f;l&ze||!i&&s===Y||(Re(s,e),l&(fe|Me)&&(l&Se?yi(s,Bt):on(s)))}}let gi=!1;function Je(n,e=null,t){if(typeof n!="object"||n===null||ot in n)return n;const i=_n(n);if(i!==da&&i!==pa)return n;var a=new Map,r=bn(n),s=we(0);r&&a.set("length",we(n.length));var l;return new Proxy(n,{defineProperty(d,o,m){(!("value"in m)||m.configurable===!1||m.enumerable===!1||m.writable===!1)&&va();var u=a.get(o);return u===void 0?(u=we(m.value),a.set(o,u)):U(u,Je(m.value,l)),!0},deleteProperty(d,o){var m=a.get(o);if(m===void 0)o in d&&a.set(o,we(he));else{if(r&&typeof o=="string"){var u=a.get("length"),k=Number(o);Number.isInteger(k)&&k<u.v&&U(u,k)}U(m,he),$n(s)}return!0},get(d,o,m){var p;if(o===ot)return n;var u=a.get(o),k=o in d;if(u===void 0&&(!k||(p=wt(d,o))!=null&&p.writable)&&(u=we(Je(k?d[o]:he,l)),a.set(o,u)),u!==void 0){var C=c(u);return C===he?void 0:C}return Reflect.get(d,o,m)},getOwnPropertyDescriptor(d,o){var m=Reflect.getOwnPropertyDescriptor(d,o);if(m&&"value"in m){var u=a.get(o);u&&(m.value=c(u))}else if(m===void 0){var k=a.get(o),C=k==null?void 0:k.v;if(k!==void 0&&C!==he)return{enumerable:!0,configurable:!0,value:C,writable:!0}}return m},has(d,o){var C;if(o===ot)return!0;var m=a.get(o),u=m!==void 0&&m.v!==he||Reflect.has(d,o);if(m!==void 0||Y!==null&&(!u||(C=wt(d,o))!=null&&C.writable)){m===void 0&&(m=we(u?Je(d[o],l):he),a.set(o,m));var k=c(m);if(k===he)return!1}return u},set(d,o,m,u){var v;var k=a.get(o),C=o in d;if(r&&o==="length")for(var p=m;p<k.v;p+=1){var w=a.get(p+"");w!==void 0?U(w,he):p in d&&(w=we(he),a.set(p+"",w))}k===void 0?(!C||(v=wt(d,o))!=null&&v.writable)&&(k=we(void 0),U(k,Je(m,l)),a.set(o,k)):(C=k.v!==he,U(k,Je(m,l)));var f=Reflect.getOwnPropertyDescriptor(d,o);if(f!=null&&f.set&&f.set.call(u,m),!C){if(r&&typeof o=="string"){var y=a.get("length"),h=Number(o);Number.isInteger(h)&&h>=y.v&&U(y,h+1)}$n(s)}return!0},ownKeys(d){c(s);var o=Reflect.ownKeys(d).filter(k=>{var C=a.get(k);return C===void 0||C.v!==he});for(var[m,u]of a)u.v!==he&&!(m in d)&&o.push(m);return o},setPrototypeOf(){Ea()}})}function $n(n,e=1){U(n,n.v+e)}var zn,Bi,vi,Ei;function Oa(){if(zn===void 0){zn=window,Bi=/Firefox/.test(navigator.userAgent);var n=Element.prototype,e=Node.prototype;vi=wt(e,"firstChild").get,Ei=wt(e,"nextSibling").get,n.__click=void 0,n.__className="",n.__attributes=null,n.__styles=null,n.__e=void 0,Text.prototype.__t=void 0}}function Wn(n=""){return document.createTextNode(n)}function Gt(n){return vi.call(n)}function an(n){return Ei.call(n)}function D(n,e){return Gt(n)}function z(n,e){{var t=Gt(n);return t instanceof Comment&&t.data===""?an(t):t}}function x(n,e=1,t=!1){let i=n;for(;e--;)i=an(i);return i}function Ua(n){n.textContent=""}function dt(n){var e=Se|ze,t=Q!==null&&Q.f&Se?Q:null;return Y===null||t!==null&&t.f&Me?e|=Me:Y.f|=hi,{ctx:Ae,deps:null,effects:null,equals:wi,f:e,fn:n,reactions:null,rv:0,v:null,wv:0,parent:t??Y}}function me(n){const e=dt(n);return e.equals=Hn,e}function Ti(n){var e=n.effects;if(e!==null){n.effects=null;for(var t=0;t<e.length;t+=1)nt(e[t])}}function ja(n){for(var e=n.parent;e!==null;){if(!(e.f&Se))return e;e=e.parent}return null}function $a(n){var e,t=Y;be(ja(n));try{Ti(n),e=Ri(n)}finally{be(t)}return e}function xi(n){var e=$a(n),t=(et||n.f&Me)&&n.deps!==null?Bt:fe;Re(n,t),n.equals(e)||(n.v=e,n.wv=Li())}function Mi(n){Y===null&&Q===null&&ya(),Q!==null&&Q.f&Me&&Y===null&&Da(),qn&&fa()}function za(n,e){var t=e.last;t===null?e.last=e.first=n:(t.next=n,n.prev=t,e.last=n)}function Et(n,e,t,i=!0){var a=(n&Ht)!==0,r=Y,s={ctx:Ae,deps:null,nodes_start:null,nodes_end:null,f:n|ze,first:null,fn:e,last:null,next:null,parent:a?null:r,prev:null,teardown:null,transitions:null,wv:0};if(t){var l=ft;try{Gn(!0),Rn(s),s.f|=ui}catch(m){throw nt(s),m}finally{Gn(l)}}else e!==null&&on(s);var d=t&&s.deps===null&&s.first===null&&s.nodes_start===null&&s.teardown===null&&(s.f&(hi|$t))===0;if(!d&&!a&&i&&(r!==null&&za(s,r),Q!==null&&Q.f&Se)){var o=Q;(o.effects??(o.effects=[])).push(s)}return s}function Ni(n){const e=Et(Jt,null,!1);return Re(e,fe),e.teardown=n,e}function Vn(n){Mi();var e=Y!==null&&(Y.f&$e)!==0&&Ae!==null&&!Ae.m;if(e){var t=Ae;(t.e??(t.e=[])).push({fn:n,effect:Y,reaction:Q})}else{var i=rn(n);return i}}function Va(n){return Mi(),Pn(n)}function Ga(n){const e=Et(Ht,n,!0);return(t={})=>new Promise(i=>{t.outro?lt(e,()=>{nt(e),i(void 0)}):(nt(e),i(void 0))})}function rn(n){return Et(mi,n,!1)}function Pn(n){return Et(Jt,n,!0)}function $(n,e=[],t=dt){const i=e.map(t);return sn(()=>n(...i.map(c)))}function sn(n,e=0){return Et(Jt|en|e,n,!0)}function pt(n,e=!0){return Et(Jt|$e,n,!0,e)}function bi(n){var e=n.teardown;if(e!==null){const t=qn,i=Q;Yn(!0),Ne(null);try{e.call(null)}finally{Yn(t),Ne(i)}}}function Fi(n,e=!1){var t=n.first;for(n.first=n.last=null;t!==null;){var i=t.next;nt(t,e),t=i}}function Ya(n){for(var e=n.first;e!==null;){var t=e.next;e.f&$e||nt(e),e=t}}function nt(n,e=!0){var t=!1;if((e||n.f&ha)&&n.nodes_start!==null){for(var i=n.nodes_start,a=n.nodes_end;i!==null;){var r=i===a?null:an(i);i.remove(),i=r}t=!0}Fi(n,e&&!t),Xt(n,0),Re(n,tn);var s=n.transitions;if(s!==null)for(const d of s)d.stop();bi(n);var l=n.parent;l!==null&&l.first!==null&&_i(n),n.next=n.prev=n.teardown=n.ctx=n.deps=n.fn=n.nodes_start=n.nodes_end=null}function _i(n){var e=n.parent,t=n.prev,i=n.next;t!==null&&(t.next=i),i!==null&&(i.prev=t),e!==null&&(e.first===n&&(e.first=i),e.last===n&&(e.last=t))}function lt(n,e){var t=[];Ln(n,t,!0),Hi(t,()=>{nt(n),e&&e()})}function Hi(n,e){var t=n.length;if(t>0){var i=()=>--t||e();for(var a of n)a.out(i)}else e()}function Ln(n,e,t){if(!(n.f&je)){if(n.f^=je,n.transitions!==null)for(const s of n.transitions)(s.is_global||t)&&e.push(s);for(var i=n.first;i!==null;){var a=i.next,r=(i.f&nn)!==0||(i.f&$e)!==0;Ln(i,e,r?t:!1),i=a}}}function gt(n){Ki(n,!0)}function Ki(n,e){if(n.f&je){n.f^=je,n.f&fe||(n.f^=fe),Wt(n)&&(Re(n,ze),on(n));for(var t=n.first;t!==null;){var i=t.next,a=(t.f&nn)!==0||(t.f&$e)!==0;Ki(t,a?e:!1),t=i}if(n.transitions!==null)for(const r of n.transitions)(r.is_global||e)&&r.in()}}let Yt=!1,Dn=[];function Si(){Yt=!1;const n=Dn.slice();Dn=[],fn(n)}function St(n){Yt||(Yt=!0,queueMicrotask(Si)),Dn.push(n)}function Qa(){Yt&&Si()}const Wi=0,Xa=1;let It=!1,Zt=Wi,Ft=!1,_t=null,ft=!1,qn=!1;function Gn(n){ft=n}function Yn(n){qn=n}let rt=[],Dt=0;let Q=null,Le=!1;function Ne(n){Q=n}let Y=null;function be(n){Y=n}let qe=null;function Ja(n){qe=n}let Ce=null,De=0,Ze=null;function er(n){Ze=n}let Pi=1,Qt=0,et=!1;function Li(){return++Pi}function Wt(n){var u;var e=n.f;if(e&ze)return!0;if(e&Bt){var t=n.deps,i=(e&Me)!==0;if(t!==null){var a,r,s=(e&zt)!==0,l=i&&Y!==null&&!et,d=t.length;if(s||l){var o=n,m=o.parent;for(a=0;a<d;a++)r=t[a],(s||!((u=r==null?void 0:r.reactions)!=null&&u.includes(o)))&&(r.reactions??(r.reactions=[])).push(o);s&&(o.f^=zt),l&&m!==null&&!(m.f&Me)&&(o.f^=Me)}for(a=0;a<d;a++)if(r=t[a],Wt(r)&&xi(r),r.wv>n.wv)return!0}(!i||Y!==null&&!et)&&Re(n,fe)}return!1}function tr(n,e){for(var t=e;t!==null;){if(t.f&$t)try{t.fn(n);return}catch{t.f^=$t}t=t.parent}throw It=!1,n}function nr(n){return(n.f&tn)===0&&(n.parent===null||(n.parent.f&$t)===0)}function An(n,e,t,i){if(It){if(t===null&&(It=!1),nr(e))throw n;return}t!==null&&(It=!0);{tr(n,e);return}}function qi(n,e,t=!0){var i=n.reactions;if(i!==null)for(var a=0;a<i.length;a++){var r=i[a];r.f&Se?qi(r,e,!1):e===r&&(t?Re(r,ze):r.f&fe&&Re(r,Bt),on(r))}}function Ri(n){var C;var e=Ce,t=De,i=Ze,a=Q,r=et,s=qe,l=Ae,d=Le,o=n.f;Ce=null,De=0,Ze=null,Q=o&($e|Ht)?null:n,et=(o&Me)!==0&&(!ft||a===null||d),qe=null,Vt(n.ctx),Le=!1,Qt++;try{var m=(0,n.fn)(),u=n.deps;if(Ce!==null){var k;if(Xt(n,De),u!==null&&De>0)for(u.length=De+Ce.length,k=0;k<Ce.length;k++)u[De+k]=Ce[k];else n.deps=u=Ce;if(!et)for(k=De;k<u.length;k++)((C=u[k]).reactions??(C.reactions=[])).push(n)}else u!==null&&De<u.length&&(Xt(n,De),u.length=De);if(vt()&&Ze!==null&&!Le&&u!==null&&!(n.f&(Se|Bt|ze)))for(k=0;k<Ze.length;k++)qi(Ze[k],n);return a!==null&&Qt++,m}finally{Ce=e,De=t,Ze=i,Q=a,et=r,qe=s,Vt(l),Le=d}}function ir(n,e){let t=e.reactions;if(t!==null){var i=la.call(t,n);if(i!==-1){var a=t.length-1;a===0?t=e.reactions=null:(t[i]=t[a],t.pop())}}t===null&&e.f&Se&&(Ce===null||!Ce.includes(e))&&(Re(e,Bt),e.f&(Me|zt)||(e.f^=zt),Ti(e),Xt(e,0))}function Xt(n,e){var t=n.deps;if(t!==null)for(var i=e;i<t.length;i++)ir(n,t[i])}function Rn(n){var e=n.f;if(!(e&tn)){Re(n,fe);var t=Y,i=Ae;Y=n;try{e&en?Ya(n):Fi(n),bi(n);var a=Ri(n);n.teardown=typeof a=="function"?a:null,n.wv=Pi;var r=n.deps,s;Cn&&Ma&&n.f&ze}catch(l){An(l,n,t,i||n.ctx)}finally{Y=t}}}function Ii(){if(Dt>1e3){Dt=0;try{ga()}catch(n){if(_t!==null)An(n,_t,null);else throw n}}Dt++}function Zi(n){var e=n.length;if(e!==0){Ii();var t=ft;ft=!0;try{for(var i=0;i<e;i++){var a=n[i];a.f&fe||(a.f^=fe);var r=sr(a);ar(r)}}finally{ft=t}}}function ar(n){var e=n.length;if(e!==0)for(var t=0;t<e;t++){var i=n[t];if(!(i.f&(tn|je)))try{Wt(i)&&(Rn(i),i.deps===null&&i.first===null&&i.nodes_start===null&&(i.teardown===null?_i(i):i.fn=null))}catch(a){An(a,i,null,i.ctx)}}}function rr(){if(Ft=!1,Dt>1001)return;const n=rt;rt=[],Zi(n),Ft||(Dt=0,_t=null)}function on(n){Zt===Wi&&(Ft||(Ft=!0,queueMicrotask(rr))),_t=n;for(var e=n;e.parent!==null;){e=e.parent;var t=e.f;if(t&(Ht|$e)){if(!(t&fe))return;e.f^=fe}}rt.push(e)}function sr(n){var e=[],t=n.first;e:for(;t!==null;){var i=t.f,a=(i&$e)!==0,r=a&&(i&fe)!==0,s=t.next;if(!r&&!(i&je)){if(i&mi)e.push(t);else if(a)t.f^=fe;else{var l=Q;try{Q=t,Wt(t)&&Rn(t)}catch(m){An(m,t,null,t.ctx)}finally{Q=l}}var d=t.first;if(d!==null){t=d;continue}}if(s===null){let m=t.parent;for(;m!==null;){if(n===m)break e;var o=m.next;if(o!==null){t=o;continue e}m=m.parent}}t=s}return e}function In(n){var e=Zt,t=rt;try{Ii();const a=[];Zt=Xa,rt=a,Ft=!1,Zi(t);var i=n==null?void 0:n();return Qa(),(rt.length>0||a.length>0)&&In(),Dt=0,_t=null,i}finally{Zt=e,rt=t}}async function Ar(){await Promise.resolve(),In()}function c(n){var e=n.f,t=(e&Se)!==0;if(Q!==null&&!Le){qe!==null&&qe.includes(n)&&Ta();var i=Q.deps;n.rv<Qt&&(n.rv=Qt,Ce===null&&i!==null&&i[De]===n?De++:Ce===null?Ce=[n]:(!et||!Ce.includes(n))&&Ce.push(n))}else if(t&&n.deps===null&&n.effects===null){var a=n,r=a.parent;r!==null&&!(r.f&Me)&&(a.f^=Me)}return t&&(a=n,Wt(a)&&xi(a)),n.v}function it(n){var e=Le;try{return Le=!0,n()}finally{Le=e}}const or=-7169;function Re(n,e){n.f=n.f&or|e}function lr(n){if(!(typeof n!="object"||!n||n instanceof EventTarget)){if(ot in n)yn(n);else if(!Array.isArray(n))for(let e in n){const t=n[e];typeof t=="object"&&t&&ot in t&&yn(t)}}}function yn(n,e=new Set){if(typeof n=="object"&&n!==null&&!(n instanceof EventTarget)&&!e.has(n)){e.add(n),n instanceof Date&&n.getTime();for(let i in n)try{yn(n[i],e)}catch{}const t=_n(n);if(t!==Object.prototype&&t!==Array.prototype&&t!==Map.prototype&&t!==Set.prototype&&t!==Date.prototype){const i=ci(t);for(let a in i){const r=i[a].get;if(r)try{r.call(n)}catch{}}}}}const dr=["touchstart","touchmove"];function pr(n){return dr.includes(n)}let Qn=!1;function kr(){Qn||(Qn=!0,document.addEventListener("reset",n=>{Promise.resolve().then(()=>{var e;if(!n.defaultPrevented)for(const t of n.target.elements)(e=t.__on_r)==null||e.call(t)})},{capture:!0}))}function Zn(n){var e=Q,t=Y;Ne(null),be(null);try{return n()}finally{Ne(e),be(t)}}function cr(n,e,t,i=t){n.addEventListener(e,()=>Zn(t));const a=n.__on_r;a?n.__on_r=()=>{a(),i(!0)}:n.__on_r=()=>i(!0),kr()}const Oi=new Set,gn=new Set;function mr(n,e,t,i={}){function a(r){if(i.capture||xt.call(e,r),!r.cancelBubble)return Zn(()=>t==null?void 0:t.call(this,r))}return n.startsWith("pointer")||n.startsWith("touch")||n==="wheel"?St(()=>{e.addEventListener(n,a,i)}):e.addEventListener(n,a,i),a}function Ke(n,e,t,i,a){var r={capture:i,passive:a},s=mr(n,e,t,r);(e===document.body||e===window||e===document)&&Ni(()=>{e.removeEventListener(n,s,r)})}function On(n){for(var e=0;e<n.length;e++)Oi.add(n[e]);for(var t of gn)t(n)}function xt(n){var h;var e=this,t=e.ownerDocument,i=n.type,a=((h=n.composedPath)==null?void 0:h.call(n))||[],r=a[0]||n.target,s=0,l=n.__root;if(l){var d=a.indexOf(l);if(d!==-1&&(e===document||e===window)){n.__root=e;return}var o=a.indexOf(e);if(o===-1)return;d<=o&&(s=d)}if(r=a[s]||n.target,r!==e){ki(n,"currentTarget",{configurable:!0,get(){return r||t}});var m=Q,u=Y;Ne(null),be(null);try{for(var k,C=[];r!==null;){var p=r.assignedSlot||r.parentNode||r.host||null;try{var w=r["__"+i];if(w!==void 0&&!r.disabled)if(bn(w)){var[f,...y]=w;f.apply(r,[n,...y])}else w.call(r,n)}catch(v){k?C.push(v):k=v}if(n.cancelBubble||p===e||p===null)break;r=p}if(k){for(let v of C)queueMicrotask(()=>{throw v});throw k}}finally{n.__root=e,delete n.currentTarget,Ne(m),be(u)}}}function ur(n){var e=document.createElement("template");return e.innerHTML=n,e.content}function Bn(n,e){var t=Y;t.nodes_start===null&&(t.nodes_start=n,t.nodes_end=e)}function N(n,e){var t=(e&Ra)!==0,i=(e&Ia)!==0,a,r=!n.startsWith("<!>");return()=>{a===void 0&&(a=ur(r?n:"<!>"+n),t||(a=Gt(a)));var s=i||Bi?document.importNode(a,!0):a.cloneNode(!0);if(t){var l=Gt(s),d=s.lastChild;Bn(l,d)}else Bn(s,s);return s}}function se(){var n=document.createDocumentFragment(),e=document.createComment(""),t=Wn();return n.append(e,t),Bn(e,t),n}function g(n,e){n!==null&&n.before(e)}let vn=!0;function S(n,e){var t=e==null?"":typeof e=="object"?e+"":e;t!==(n.__t??(n.__t=n.nodeValue))&&(n.__t=t,n.nodeValue=t+"")}function hr(n,e){return wr(n,e)}const mt=new Map;function wr(n,{target:e,anchor:t,props:i={},events:a,context:r,intro:s=!0}){Oa();var l=new Set,d=u=>{for(var k=0;k<u.length;k++){var C=u[k];if(!l.has(C)){l.add(C);var p=pr(C);e.addEventListener(C,xt,{passive:p});var w=mt.get(C);w===void 0?(document.addEventListener(C,xt,{passive:p}),mt.set(C,1)):mt.set(C,w+1)}}};d(Fn(Oi)),gn.add(d);var o=void 0,m=Ga(()=>{var u=t??e.appendChild(Wn());return pt(()=>{if(r){Fe({});var k=Ae;k.c=r}a&&(i.$$events=a),vn=s,o=n(u,i)||{},vn=!0,r&&_e()}),()=>{var p;for(var k of l){e.removeEventListener(k,xt);var C=mt.get(k);--C===0?(document.removeEventListener(k,xt),mt.delete(k)):mt.set(k,C)}gn.delete(d),u!==t&&((p=u.parentNode)==null||p.removeChild(u))}});return Cr.set(o,m),o}let Cr=new WeakMap;const mn=0,Lt=1,un=2;function fr(n,e,t,i,a){var r=n,s=vt(),l=Ae,d=he,o,m,u,k=(s?we:yt)(void 0),C=(s?we:yt)(void 0),p=!1;function w(y,h){p=!0,h&&(be(f),Ne(f),Vt(l));try{y===mn&&t&&(o?gt(o):o=pt(()=>t(r))),y===Lt&&i&&(m?gt(m):m=pt(()=>i(r,k))),y!==mn&&o&&lt(o,()=>o=null),y!==Lt&&m&&lt(m,()=>m=null),y!==un&&u&&lt(u,()=>u=null)}finally{h&&(Vt(null),Ne(null),be(null),In())}}var f=sn(()=>{if(d!==(d=e())){if(ca(d)){var y=d;p=!1,y.then(h=>{y===d&&(Ct(k,h),w(Lt,!0))},h=>{if(y===d)throw Ct(C,h),w(un,!0),C.v}),St(()=>{p||w(mn,!0)})}else Ct(k,d),w(Lt,!1);return()=>d=he}})}function K(n,e,t=!1){var i=n,a=null,r=null,s=he,l=t?nn:0,d=!1;const o=(u,k=!0)=>{d=!0,m(k,u)},m=(u,k)=>{s!==(s=u)&&(s?(a?gt(a):k&&(a=pt(()=>k(i))),r&&lt(r,()=>{r=null})):(r?gt(r):k&&(r=pt(()=>k(i))),a&&lt(a,()=>{a=null})))};sn(()=>{d=!1,e(o),d||m(null,null)},l)}function Be(n,e){return e}function Dr(n,e,t,i){for(var a=[],r=e.length,s=0;s<r;s++)Ln(e[s].e,a,!0);var l=r>0&&a.length===0&&t!==null;if(l){var d=t.parentNode;Ua(d),d.append(t),i.clear(),Xe(n,e[0].prev,e[r-1].next)}Hi(a,()=>{for(var o=0;o<r;o++){var m=e[o];l||(i.delete(m.k),Xe(n,m.prev,m.next)),nt(m.e,!l)}})}function ve(n,e,t,i,a,r=null){var s=n,l={flags:e,items:new Map,first:null},d=(e&fi)!==0;if(d){var o=n;s=o.appendChild(Wn())}var m=null,u=!1,k=me(()=>{var C=t();return bn(C)?C:C==null?[]:Fn(C)});sn(()=>{var C=c(k),p=C.length;u&&p===0||(u=p===0,yr(C,l,s,a,e,i,t),r!==null&&(p===0?m?gt(m):m=pt(()=>r(s)):m!==null&&lt(m,()=>{m=null})),c(k))})}function yr(n,e,t,i,a,r,s){var pe,B,W,I;var l=(a&ba)!==0,d=(a&(Kn|Sn))!==0,o=n.length,m=e.items,u=e.first,k=u,C,p=null,w,f=[],y=[],h,v,M,T;if(l)for(T=0;T<o;T+=1)h=n[T],v=r(h,T),M=m.get(v),M!==void 0&&((pe=M.a)==null||pe.measure(),(w??(w=new Set)).add(M));for(T=0;T<o;T+=1){if(h=n[T],v=r(h,T),M=m.get(v),M===void 0){var P=k?k.e.nodes_start:t;p=Br(P,e,p,p===null?e.first:p.next,h,v,T,i,a,s),m.set(v,p),f=[],y=[],k=p.next;continue}if(d&&gr(M,h,T,a),M.e.f&je&&(gt(M.e),l&&((B=M.a)==null||B.unfix(),(w??(w=new Set)).delete(M))),M!==k){if(C!==void 0&&C.has(M)){if(f.length<y.length){var _=y[0],b;p=_.prev;var H=f[0],de=f[f.length-1];for(b=0;b<f.length;b+=1)Xn(f[b],_,t);for(b=0;b<y.length;b+=1)C.delete(y[b]);Xe(e,H.prev,de.next),Xe(e,p,H),Xe(e,de,_),k=_,p=de,T-=1,f=[],y=[]}else C.delete(M),Xn(M,k,t),Xe(e,M.prev,M.next),Xe(e,M,p===null?e.first:p.next),Xe(e,p,M),p=M;continue}for(f=[],y=[];k!==null&&k.k!==v;)k.e.f&je||(C??(C=new Set)).add(k),y.push(k),k=k.next;if(k===null)continue;M=k}f.push(M),p=M,k=M.next}if(k!==null||C!==void 0){for(var oe=C===void 0?[]:Fn(C);k!==null;)k.e.f&je||oe.push(k),k=k.next;var R=oe.length;if(R>0){var ae=a&fi&&o===0?t:null;if(l){for(T=0;T<R;T+=1)(W=oe[T].a)==null||W.measure();for(T=0;T<R;T+=1)(I=oe[T].a)==null||I.fix()}Dr(e,oe,ae,m)}}l&&St(()=>{var X;if(w!==void 0)for(M of w)(X=M.a)==null||X.apply()}),Y.first=e.first&&e.first.e,Y.last=p&&p.e}function gr(n,e,t,i){i&Kn&&Ct(n.v,e),i&Sn?Ct(n.i,t):n.i=t}function Br(n,e,t,i,a,r,s,l,d,o){var m=(d&Kn)!==0,u=(d&Fa)===0,k=m?u?yt(a):we(a):a,C=d&Sn?we(s):s,p={i:C,v:k,k:r,a:null,e:null,prev:t,next:i};try{return p.e=pt(()=>l(n,k,C,o),gi),p.e.prev=t&&t.e,p.e.next=i&&i.e,t===null?e.first=p:(t.next=p,t.e.next=p.e),i!==null&&(i.prev=p,i.e.prev=p.e),p}finally{}}function Xn(n,e,t){for(var i=n.next?n.next.e.nodes_start:t,a=e?e.e.nodes_start:t,r=n.e.nodes_start;r!==i;){var s=an(r);a.before(r),r=s}}function Xe(n,e,t){e===null?n.first=t:(e.next=t,e.e.next=t&&t.e),t!==null&&(t.prev=e,t.e.prev=e&&e.e)}function Nt(n,e,t,i){var a=n.__attributes??(n.__attributes={});a[e]!==(a[e]=t)&&(e==="style"&&"__styles"in n&&(n.__styles={}),e==="loading"&&(n[Ca]=t),t==null?n.removeAttribute(e):typeof t!="string"&&vr(n).includes(e)?n[e]=t:n.setAttribute(e,t))}var Jn=new Map;function vr(n){var e=Jn.get(n.nodeName);if(e)return e;Jn.set(n.nodeName,e=[]);for(var t,i=n,a=Element.prototype;a!==i;){t=ci(i);for(var r in t)t[r].set&&e.push(r);i=_n(i)}return e}function ue(n,e,t){var i=n.__className,a=Er(e);(i!==a||gi)&&(e==null?n.removeAttribute("class"):n.className=a,n.__className=a)}function Er(n,e){return(n??"")+""}const Tr=()=>performance.now(),Ue={tick:n=>requestAnimationFrame(n),now:()=>Tr(),tasks:new Set};function Ui(){const n=Ue.now();Ue.tasks.forEach(e=>{e.c(n)||(Ue.tasks.delete(e),e.f())}),Ue.tasks.size!==0&&Ue.tick(Ui)}function xr(n){let e;return Ue.tasks.size===0&&Ue.tick(Ui),{promise:new Promise(t=>{Ue.tasks.add(e={c:n,f:t})}),abort(){Ue.tasks.delete(e)}}}function qt(n,e){Zn(()=>{n.dispatchEvent(new CustomEvent(e))})}function Mr(n){if(n==="float")return"cssFloat";if(n==="offset")return"cssOffset";if(n.startsWith("--"))return n;const e=n.split("-");return e.length===1?e[0]:e[0]+e.slice(1).map(t=>t[0].toUpperCase()+t.slice(1)).join("")}function ei(n){const e={},t=n.split(";");for(const i of t){const[a,r]=i.split(":");if(!a||r===void 0)break;const s=Mr(a.trim());e[s]=r.trim()}return e}const Nr=n=>n;function ut(n,e,t,i){var a=(n&Pa)!==0,r=(n&La)!==0,s=a&&r,l=(n&qa)!==0,d=s?"both":a?"in":"out",o,m=e.inert,u=e.style.overflow,k,C;function p(){var v=Q,M=Y;Ne(null),be(null);try{return o??(o=t()(e,(i==null?void 0:i())??{},{direction:d}))}finally{Ne(v),be(M)}}var w={is_global:l,in(){var v;if(e.inert=m,!a){C==null||C.abort(),(v=C==null?void 0:C.reset)==null||v.call(C);return}r||k==null||k.abort(),qt(e,"introstart"),k=En(e,p(),C,1,()=>{qt(e,"introend"),k==null||k.abort(),k=o=void 0,e.style.overflow=u})},out(v){if(!r){v==null||v(),o=void 0;return}e.inert=!0,qt(e,"outrostart"),C=En(e,p(),k,0,()=>{qt(e,"outroend"),v==null||v()})},stop:()=>{k==null||k.abort(),C==null||C.abort()}},f=Y;if((f.transitions??(f.transitions=[])).push(w),a&&vn){var y=l;if(!y){for(var h=f.parent;h&&h.f&nn;)for(;(h=h.parent)&&!(h.f&en););y=!h||(h.f&ui)!==0}y&&rn(()=>{it(()=>w.in())})}}function En(n,e,t,i,a){var r=i===1;if(ka(e)){var s,l=!1;return St(()=>{if(!l){var f=e({direction:r?"in":"out"});s=En(n,f,t,i,a)}}),{abort:()=>{l=!0,s==null||s.abort()},deactivate:()=>s.deactivate(),reset:()=>s.reset(),t:()=>s.t()}}if(t==null||t.deactivate(),!(e!=null&&e.duration))return a(),{abort:He,deactivate:He,reset:He,t:()=>i};const{delay:d=0,css:o,tick:m,easing:u=Nr}=e;var k=[];if(r&&t===void 0&&(m&&m(0,1),o)){var C=ei(o(0,1));k.push(C,C)}var p=()=>1-i,w=n.animate(k,{duration:d});return w.onfinish=()=>{var f=(t==null?void 0:t.t())??1-i;t==null||t.abort();var y=i-f,h=e.duration*Math.abs(y),v=[];if(h>0){var M=!1;if(o)for(var T=Math.ceil(h/16.666666666666668),P=0;P<=T;P+=1){var _=f+y*u(P/T),b=ei(o(_,1-_));v.push(b),M||(M=b.overflow==="hidden")}M&&(n.style.overflow="hidden"),p=()=>{var H=w.currentTime;return f+y*u(H/h)},m&&xr(()=>{if(w.playState!=="running")return!1;var H=p();return m(H,1-H),!0})}w=n.animate(v,{duration:h,fill:"forwards"}),w.onfinish=()=>{p=()=>i,m==null||m(i,1-i),a()}},{abort:()=>{w&&(w.cancel(),w.effect=null,w.onfinish=He)},deactivate:()=>{a=He},reset:()=>{i===0&&(m==null||m(1,0))},t:()=>p()}}function br(n,e,t=e){var i=vt();cr(n,"input",a=>{var r=a?n.defaultValue:n.value;if(r=hn(n)?wn(r):r,t(r),i&&r!==(r=e())){var s=n.selectionStart,l=n.selectionEnd;n.value=r??"",l!==null&&(n.selectionStart=s,n.selectionEnd=Math.min(l,n.value.length))}}),it(e)==null&&n.value&&t(hn(n)?wn(n.value):n.value),Pn(()=>{var a=e();hn(n)&&a===wn(n.value)||n.type==="date"&&!a&&!n.value||a!==n.value&&(n.value=a??"")})}function hn(n){var e=n.type;return e==="number"||e==="range"}function wn(n){return n===""?null:+n}function ti(n,e){return n===e||(n==null?void 0:n[ot])===e}function Fr(n={},e,t,i){return rn(()=>{var a,r;return Pn(()=>{a=r,r=[],it(()=>{n!==t(...r)&&(e(n,...r),a&&ti(t(...a),n)&&e(null,...a))})}),()=>{St(()=>{r&&ti(t(...r),n)&&e(null,...r)})}}),n}function Ve(n=!1){const e=Ae,t=e.l.u;if(!t)return;let i=()=>lr(e.s);if(n){let a=0,r={};const s=dt(()=>{let l=!1;const d=e.s;for(const o in d)d[o]!==r[o]&&(r[o]=d[o],l=!0);return l&&a++,a});i=()=>c(s)}t.b.length&&Va(()=>{ni(e,i),fn(t.b)}),Vn(()=>{const a=it(()=>t.m.map(ma));return()=>{for(const r of a)typeof r=="function"&&r()}}),t.a.length&&Vn(()=>{ni(e,i),fn(t.a)})}function ni(n,e){if(n.l.s)for(const t of n.l.s)c(t);e()}function ji(n,e,t){if(n==null)return e(void 0),He;const i=it(()=>n.subscribe(e,t));return i.unsubscribe?()=>i.unsubscribe():i}const ht=[];function _r(n,e=He){let t=null;const i=new Set;function a(l){if(Ci(n,l)&&(n=l,t)){const d=!ht.length;for(const o of i)o[1](),ht.push(o,n);if(d){for(let o=0;o<ht.length;o+=2)ht[o][0](ht[o+1]);ht.length=0}}}function r(l){a(l(n))}function s(l,d=He){const o=[l,d];return i.add(o),i.size===1&&(t=e(a,r)||He),l(n),()=>{i.delete(o),i.size===0&&t&&(t(),t=null)}}return{set:a,update:r,subscribe:s}}function Hr(n){let e;return ji(n,t=>e=t)(),e}let Rt=!1,Tn=Symbol();function Kr(n,e,t){const i=t[e]??(t[e]={store:null,source:yt(void 0),unsubscribe:He});if(i.store!==n&&!(Tn in t))if(i.unsubscribe(),i.store=n??null,n==null)i.source.v=void 0,i.unsubscribe=He;else{var a=!0;i.unsubscribe=ji(n,r=>{a?i.source.v=r:U(i.source,r)}),a=!1}return n&&Tn in t?Hr(n):c(i.source)}function Sr(){const n={};function e(){Ni(()=>{for(var t in n)n[t].unsubscribe();ki(n,Tn,{enumerable:!1,value:!0})})}return[n,e]}function Wr(n){var e=Rt;try{return Rt=!1,[n(),Rt]}finally{Rt=e}}function le(n,e,t,i){var P;var a=(t&_a)!==0,r=!Kt||(t&Ha)!==0,s=(t&Sa)!==0,l=(t&Wa)!==0,d=!1,o;s?[o,d]=Wr(()=>n[e]):o=n[e];var m=ot in n||wa in n,u=s&&(((P=wt(n,e))==null?void 0:P.set)??(m&&e in n&&(_=>n[e]=_)))||void 0,k=i,C=!0,p=!1,w=()=>(p=!0,C&&(C=!1,l?k=it(i):k=i),k);o===void 0&&i!==void 0&&(u&&r&&Ba(),o=w(),u&&u(o));var f;if(r)f=()=>{var _=n[e];return _===void 0?w():(C=!0,p=!1,_)};else{var y=(a?dt:me)(()=>n[e]);y.f|=ua,f=()=>{var _=c(y);return _!==void 0&&(k=void 0),_===void 0?k:_}}if(!(t&Ka))return f;if(u){var h=n.$$legacy;return function(_,b){return arguments.length>0?((!r||!b||h||d)&&u(b?f():_),_):f()}}var v=!1,M=yt(o),T=dt(()=>{var _=f(),b=c(M);return v?(v=!1,b):M.v=_});return a||(T.equals=Hn),function(_,b){if(arguments.length>0){const H=b?c(T):r&&s?Je(_):_;return T.equals(H)||(v=!0,U(M,H),p&&k!==void 0&&(k=H),it(()=>c(T))),_}return c(T)}}const Pr="5";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(Pr);Na();class Lr{constructor(e,t,i){A(this,"_dbname");A(this,"_dbversion");A(this,"dbPromise");A(this,"getTran",async(e,t)=>(await this.dbPromise).transaction(e,t));A(this,"reset",async()=>(await indexedDB.databases().then(e=>{console.log(e)}),await new Promise((e,t)=>{const i=indexedDB.deleteDatabase(this._dbname);i.onsuccess=()=>{console.log("onsuccess"),e()},i.onerror=a=>{console.log("onerror"),t(a)}})));A(this,"getAll",async e=>{const t=await this.dbPromise;return new Promise((i,a)=>{const l=t.transaction([e],"readonly").objectStore(e).getAll();l.onsuccess=()=>{i(l.result)},l.onerror=d=>{a(d)}})});A(this,"get",async(e,t)=>{const i=await this.dbPromise;return new Promise((a,r)=>{const d=i.transaction([e],"readonly").objectStore(e).get(t);d.onsuccess=()=>{a(d.result)},d.onerror=o=>{r(o)}})});A(this,"getMany",async(e,t)=>{const r=(await this.dbPromise).transaction([e],"readonly").objectStore(e),s=t.map(l=>new Promise((d,o)=>{const m=r.get(l);m.onsuccess=()=>{d(m.result)},m.onerror=u=>{o(u)}}));return await Promise.all(s)});A(this,"putRecords",async(e,t)=>{const a=(await this.dbPromise).transaction([e],"readwrite"),r=a.objectStore(e),s=t.map(l=>(console.log("putRecords",l),{record:l,request:r.put(l)}));return new Promise((l,d)=>{a.oncomplete=()=>l(s.map(o=>Object.assign({id:o.request.result},o.record))),a.onerror=o=>d(o)})});A(this,"deleteRecords",async(e,t)=>{const a=(await this.dbPromise).transaction([e],"readwrite"),r=a.objectStore(e),s=t.map(l=>({key:l,request:r.delete(l)}));return new Promise((l,d)=>{a.oncomplete=()=>{console.log(s.map(o=>o.request.result)),l()},a.onerror=o=>d(o)})});this._dbname=e,this._dbversion=t,this.dbPromise=new Promise((a,r)=>{const s=indexedDB.open(e,t);s.onsuccess=l=>{if(console.log(l),!l.target){console.log("event.target is undefined"),r("event.target is undefined");return}const d=l.target.result;if(!d){console.log("event.target.result is undefined"),r("event.target.result is undefined");return}d.onversionchange=o=>{console.log(o),d.close()},a(d)},s.onupgradeneeded=l=>{console.log("onupgradeneeded");const d=l.target.result;console.log(d),i.filter(o=>!d.objectStoreNames.contains(o)).map(o=>d.createObjectStore(o,{keyPath:"id",autoIncrement:!0}))},s.onerror=l=>{console.log(l),r(l)},s.onblocked=l=>{console.log(l),r(l)}}),console.log(this.dbPromise)}get dbversion(){return this._dbversion}}class ye{constructor(){A(this,"handlers",[])}append(e){this.handlers.push(e)}remove(e){this.handlers=this.handlers.filter(t=>t!==e)}trigger(e){this.handlers.slice(0).forEach(t=>t(e))}clear(){this.handlers.splice(0)}expose(){return this}}class ii{constructor(){A(this,"handler")}set(e){this.handler=e}async call(e){if(!this.handler)throw Error("illegal state error");return await this.handler(e)}expose(){return this}}class Un{constructor(e,t,i,a){A(this,"_name");A(this,"_createVersion");A(this,"mountResolver",()=>{});A(this,"_indexedDb");A(this,"onInsertEvent",new ye);A(this,"onBeforeInsertEvent",new ii);A(this,"onUpdateEvent",new ye);A(this,"onBeforeUpdateEvent",new ii);A(this,"onDeleteEvent",new ye);A(this,"prepareInitialRecords",()=>{const e=new Date;return this._prepareInitialRecords().map(t=>Object.assign(t,{createdAt:e,updatedAt:e,dbVersion:this._createVersion}))});A(this,"resolveMount",()=>this.mountResolver());A(this,"patchForInsert",(e,t)=>{e.newRecords.forEach(i=>{console.log(i),t[i.id]=i})});A(this,"patchForUpdate",(e,t)=>{e.recordPairs.forEach(i=>{console.log(t[i.newRecord.id],i.newRecord),t[i.newRecord.id]={...i.newRecord}})});A(this,"patchForDelete",(e,t)=>{e.oldRecords.forEach(i=>{console.log(i),delete t[i.id]})});this._indexedDb=e,this._name=t,this._createVersion=e.dbversion,this.getAll().then(r=>r.reduce((s,l)=>(s[l.id]=l,s),{})).then(r=>{console.log(this.name,r),this.onBeforeInsertEvent.set(i??(()=>Promise.resolve())),this.onBeforeUpdateEvent.set(a??(()=>Promise.resolve()))})}get name(){return this._name}get createVersion(){return this._createVersion}get oninsert(){return this.onInsertEvent.expose()}get onbeforeinsert(){return this.onBeforeInsertEvent.expose()}get onupdate(){return this.onUpdateEvent.expose()}get onbeforeupdate(){return this.onBeforeUpdateEvent.expose()}get ondelete(){return this.onDeleteEvent.expose()}getAll(){return this._indexedDb.getAll(this.name)}get(e){return this._indexedDb.get(this.name,e)}async insertMany(e){const t=new Date,i=e.map(r=>{const s={createdAt:t,updatedAt:t,dbVersion:this._createVersion};return Object.assign(r,s)});await this.onBeforeInsertEvent.call({sender:this,newRecords:i,timestamp:t});const a=await this._indexedDb.putRecords(this.name,i);return this.onInsertEvent.trigger({sender:this,newRecords:a,timestamp:t}),a}async insert(e){return(await this.insertMany([e]))[0]}async updateMany(e,t){const i=new Date,a=[];return(await this._indexedDb.getMany(this.name,e)).forEach(s=>{const l={...s},d={...l};a.push({newRecord:Object.assign(t(d),{updatedAt:i,dbVersion:this._createVersion}),oldRecord:l})}),await this.onBeforeUpdateEvent.call({sender:this,recordPairs:a,timestamp:i}),await this._indexedDb.putRecords(this.name,a.map(s=>s.newRecord)),this.onUpdateEvent.trigger({sender:this,recordPairs:a,timestamp:i}),a.map(s=>s.newRecord)}async update(e,t){return(await this.updateMany([e],t))[0]}async delete(e){const t=new Date,i=await this._indexedDb.getMany(this.name,e);await this._indexedDb.deleteRecords(this.name,e),this.onDeleteEvent.trigger({sender:this,oldRecords:i,timestamp:t})}}const qr={"１３人目の埋葬者":{name:"１３人目の埋葬者",nameKana:"",description:"誰もいないはずの１３番目の墓から突然現れたゾンビ。",pendulumDescription:"誰もいないはずの１３番目の墓から突然現れたゾンビ。",kind:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:900,attribute:"Dark",type:"Zombie",wikiName:"《１３人目の埋葬者》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%B1%A3%B3%BF%CD%CC%DC%A4%CE%CB%E4%C1%F2%BC%D4%A1%D5",wikiTextAll:`通常モンスター
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
体をはって、仲間のＥ・ＨＥＲＯを守り抜く。`,kind:"Monster",nameTags:["Ｅ・ＨＥＲＯ"]},"Ｅ・ＨＥＲＯ スパークマン":{name:"Ｅ・ＨＥＲＯ スパークマン",nameKana:"",description:`様々な武器を使いこなす、光の戦士のＥ・ＨＥＲＯ。
聖なる輝きスパークフラッシュが悪の退路を断つ。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1600,defense:1400,attribute:"Light",type:"Warrior",wikiName:"《Ｅ・ＨＥＲＯ スパークマン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%C5%A1%A6%A3%C8%A3%C5%A3%D2%A3%CF%20%A5%B9%A5%D1%A1%BC%A5%AF%A5%DE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星４/光属性/戦士族/攻1600/守1400
様々な武器を使いこなす、光の戦士のＥ・ＨＥＲＯ。
聖なる輝きスパークフラッシュが悪の退路を断つ。`,kind:"Monster",nameTags:["Ｅ・ＨＥＲＯ"]},"Ｅ・ＨＥＲＯ ネオス":{name:"Ｅ・ＨＥＲＯ ネオス",nameKana:"",description:`ネオスペースからやってきた新たなるＥ・ＨＥＲＯ。
ネオスペーシアンとコンタクト融合する事で、未知なる力を発揮する！`,cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2500,defense:2e3,attribute:"Light",type:"Warrior",wikiName:"《Ｅ・ＨＥＲＯ ネオス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%C5%A1%A6%A3%C8%A3%C5%A3%D2%A3%CF%20%A5%CD%A5%AA%A5%B9%A1%D5",wikiTextAll:`通常モンスター
星７/光属性/戦士族/攻2500/守2000
ネオスペースからやってきた新たなるＥ・ＨＥＲＯ。
ネオスペーシアンとコンタクト融合する事で、未知なる力を発揮する！`,kind:"Monster",nameTags:["Ｅ・ＨＥＲＯ"]},"Ｅ・ＨＥＲＯ バーストレディ":{name:"Ｅ・ＨＥＲＯ バーストレディ",nameKana:"",description:`炎を操るＥ・ＨＥＲＯの紅一点。
紅蓮の炎、バーストファイヤーが悪を焼き尽くす。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:800,attribute:"Fire",type:"Warrior",wikiName:"《Ｅ・ＨＥＲＯ バーストレディ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%C5%A1%A6%A3%C8%A3%C5%A3%D2%A3%CF%20%A5%D0%A1%BC%A5%B9%A5%C8%A5%EC%A5%C7%A5%A3%A1%D5",wikiTextAll:`通常モンスター
星３/炎属性/戦士族/攻1200/守 800
炎を操るＥ・ＨＥＲＯの紅一点。
紅蓮の炎、バーストファイヤーが悪を焼き尽くす。`,kind:"Monster",nameTags:["Ｅ・ＨＥＲＯ"]},"Ｅ・ＨＥＲＯ フェザーマン":{name:"Ｅ・ＨＥＲＯ フェザーマン",nameKana:"",description:`風を操り空を舞う翼を持ったＥ・ＨＥＲＯ。
天空からの一撃、フェザーブレイクで悪を裁く。`,cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1e3,defense:1e3,attribute:"Wind",type:"Warrior",wikiName:"《Ｅ・ＨＥＲＯ フェザーマン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A3%C5%A1%A6%A3%C8%A3%C5%A3%D2%A3%CF%20%A5%D5%A5%A7%A5%B6%A1%BC%A5%DE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
星３/風属性/戦士族/攻1000/守1000
風を操り空を舞う翼を持ったＥ・ＨＥＲＯ。
天空からの一撃、フェザーブレイクで悪を裁く。`,kind:"Monster",nameTags:["Ｅ・ＨＥＲＯ"]},"Ｇ戦隊 シャインブラック":{name:"Ｇ戦隊 シャインブラック",nameKana:"",description:`黒光りするスーツを身にまとい、戦場を駆け回る"黒の閃光"・・・。
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
時に冷酷なその攻撃は敵に恐れられている。`,kind:"Monster"},"Ｘ－ヘッド・キャノン":{name:"Ｘ－ヘッド・キャノン",nameKana:"",description:`強力なキャノン砲を装備した、合体能力を持つモンスター。
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
大きく反った剣を振りかざし暴れ回る、殺人マシン。`,kind:"Monster"},キラーパンダ:{name:"キラーパンダ",nameKana:"",description:"常に太い竹を一本持っており、性格は非常に凶暴である。",cardType:"Monster",monsterCategories:["Normal","Effect"],level:4,attack:1200,defense:1e3,attribute:"Earth",type:"Beast",wikiName:"《キラーパンダ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%AD%A5%E9%A1%BC%A5%D1%A5%F3%A5%C0%A1%D5",wikiTextAll:`通常モンスター
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
ターン終了時まで、このカードのＰスケールを出た目の数だけ上げる（最大１０まで）。`},ゴースト:{name:"ゴースト",nameKana:"",description:"この世の成仏できない霊が集まってできた怨霊。",cardType:"Monster",monsterCategories:["Normal","Effect"],level:2,attack:600,defense:800,attribute:"Dark",type:"Zombie",wikiName:"《ゴースト》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B4%A1%BC%A5%B9%A5%C8%A1%D5",wikiTextAll:`通常モンスター
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
様々なエレメントの力をコントロールできるぞ。`,kind:"Monster"},"ジェネティック・ワーウルフ":{name:"ジェネティック・ワーウルフ",nameKana:"",description:`遺伝子操作により強化された人狼。
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
アメリカンコミックの世界から現れた、ワニのモンスター。`,kind:"Monster"},トビペンギン:{name:"トビペンギン",nameKana:"",description:"耳のようにも見える頭についた羽で空を飛ぶ、珍しいペンギン。",cardType:"Monster",monsterCategories:["Normal"],level:4,attack:1200,defense:1e3,attribute:"Water",type:"Aqua",wikiName:"《トビペンギン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A5%D3%A5%DA%A5%F3%A5%AE%A5%F3%A1%D5",wikiTextAll:`通常モンスター
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
決して弱き者に手を下す事はない。`,kind:"Monster"},"暗黒界の番兵 レンジ":{name:"暗黒界の番兵 レンジ",nameKana:"",description:`暗黒界随一の強靭な身体を誇り、
「鉄壁レンジ」として暗黒界の人々から親しまれている。
彼の守りを破れる者は少ない。`,cardType:"Monster",monsterCategories:["Normal"],level:4,attack:100,defense:2100,attribute:"Dark",type:"Fiend",wikiName:"《暗黒界の番兵 レンジ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%C5%B9%F5%B3%A6%A4%CE%C8%D6%CA%BC%20%A5%EC%A5%F3%A5%B8%A1%D5",wikiTextAll:`通常モンスター
星４/闇属性/悪魔族/攻 100/守2100
暗黒界随一の強靭な身体を誇り、
「鉄壁レンジ」として暗黒界の人々から親しまれている。
彼の守りを破れる者は少ない。`,kind:"Monster"},暗黒騎士ガイア:{name:"暗黒騎士ガイア",nameKana:"",description:"風よりも速く走る馬に乗った騎士。突進攻撃に注意。",cardType:"Monster",monsterCategories:["Normal"],level:7,attack:2300,defense:2100,attribute:"Earth",type:"Warrior",wikiName:"《暗黒騎士ガイア》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B0%C5%B9%F5%B5%B3%BB%CE%A5%AC%A5%A4%A5%A2%A1%D5",wikiTextAll:`通常モンスター
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
恐るべきスピードと重さを誇る自慢のパンチを受けて倒れぬ者はいない。`,kind:"Monster"},剣竜:{name:"剣竜",nameKana:"",description:`全身にカタナのトゲがついた恐竜。
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
それはやがて神々しさと共に太陽石と呼ばれるようになった。`,kind:"Monster",defense:0,attack:0},人喰い植物:{name:"人喰い植物",nameKana:"",description:"きれいな花と思わせ、近づく人をパクリと食べる、肉食の花。",cardType:"Monster",monsterCategories:["Normal"],level:2,attack:800,defense:600,attribute:"Earth",type:"Plant",wikiName:"《人喰い植物》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BF%CD%B6%F4%A4%A4%BF%A2%CA%AA%A1%D5",wikiTextAll:`通常モンスター
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
対象のモンスターの上に重ねてＸ召喚扱いとしてエクストラデッキから特殊召喚する。`},封印されし者の右足:{name:"封印されし者の右足",nameKana:"",description:"封印された右足。封印を解くと、無限の力を得られる。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:200,defense:300,attribute:"Dark",type:"Spellcaster",wikiName:"《封印されし者の右足》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C9%F5%B0%F5%A4%B5%A4%EC%A4%B7%BC%D4%A4%CE%B1%A6%C2%AD%A1%D5",wikiTextAll:`通常モンスター（制限カード）
星１/闇属性/魔法使い族/攻 200/守 300
封印された右足。封印を解くと、無限の力を得られる。`,kind:"Monster"},封印されし者の右腕:{name:"封印されし者の右腕",nameKana:"",description:"封印された右腕。封印を解くと、無限の力を得られる。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:200,defense:300,attribute:"Dark",type:"Spellcaster",wikiName:"《封印されし者の右腕》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C9%F5%B0%F5%A4%B5%A4%EC%A4%B7%BC%D4%A4%CE%B1%A6%CF%D3%A1%D5",wikiTextAll:`通常モンスター（制限カード）
星１/闇属性/魔法使い族/攻 200/守 300
封印された右腕。封印を解くと、無限の力を得られる。`,kind:"Monster"},封印されし者の左足:{name:"封印されし者の左足",nameKana:"",description:"封印された左足。封印を解くと、無限の力を得られる。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:200,defense:300,attribute:"Dark",type:"Spellcaster",wikiName:"《封印されし者の左足》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C9%F5%B0%F5%A4%B5%A4%EC%A4%B7%BC%D4%A4%CE%BA%B8%C2%AD%A1%D5",wikiTextAll:`通常モンスター（制限カード）
星１/闇属性/魔法使い族/攻 200/守 300
封印された左足。封印を解くと、無限の力を得られる。`,kind:"Monster"},封印されし者の左腕:{name:"封印されし者の左腕",nameKana:"",description:"封印された左腕。封印を解くと、無限の力を得られる。",cardType:"Monster",monsterCategories:["Normal"],level:1,attack:200,defense:300,attribute:"Dark",type:"Spellcaster",wikiName:"《封印されし者の左腕》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C9%F5%B0%F5%A4%B5%A4%EC%A4%B7%BC%D4%A4%CE%BA%B8%CF%D3%A1%D5",wikiTextAll:`通常モンスター（制限カード）
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
その過去を知る者はいない。`,kind:"Monster"},恍惚の人魚:{name:"恍惚の人魚",nameKana:"",description:"海を航海する者を誘惑しておぼれさせる、美しい人魚。",cardType:"Monster",monsterCategories:["Normal"],level:3,attack:1200,defense:900,attribute:"Water",type:"Fish",wikiName:"《恍惚の人魚》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%D7%F2%B9%FB%A4%CE%BF%CD%B5%FB%A1%D5",wikiTextAll:`通常モンスター
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
ＥＸデッキから機械族の融合モンスター１体を特殊召喚する。`},"サイバー・ドラゴン・ズィーガー":{name:"サイバー・ドラゴン・ズィーガー",nameKana:"",description:`【リンクマーカー：左/下】
「サイバー・ドラゴン」を含む機械族モンスター２体
このカード名の(2)の効果は１ターンに１度しか使用できない。
(1)：このカードのカード名は、フィールド・墓地に存在する限り「サイバー・ドラゴン」として扱う。
(2)：このカードが攻撃宣言をしていない自分・相手のバトルフェイズに、
自分フィールドの攻撃力２１００以上の機械族モンスター１体を対象として発動できる。
そのモンスターの攻撃力・守備力はターン終了時まで２１００アップする。
この効果の発動後、ターン終了時までこのカードの戦闘によるお互いの戦闘ダメージは０になる。
△△△
▲□△
△▲△`,pendulumDescription:"",kind:"Monster",monsterCategories:["Link","Effect"],attack:2100,attribute:"Light",type:"Machine",wikiName:"《サイバー・ドラゴン・ズィーガー》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%B5%A5%A4%A5%D0%A1%BC%A1%A6%A5%C9%A5%E9%A5%B4%A5%F3%A1%A6%A5%BA%A5%A3%A1%BC%A5%AC%A1%BC%A1%D5",wikiTextAll:`リンク・効果モンスター
リンク２/光属性/機械族/攻2100
【リンクマーカー：左/下】
「サイバー・ドラゴン」を含む機械族モンスター２体
このカード名の(2)の効果は１ターンに１度しか使用できない。
(1)：このカードのカード名は、フィールド・墓地に存在する限り「サイバー・ドラゴン」として扱う。
(2)：このカードが攻撃宣言をしていない自分・相手のバトルフェイズに、
自分フィールドの攻撃力２１００以上の機械族モンスター１体を対象として発動できる。
そのモンスターの攻撃力・守備力はターン終了時まで２１００アップする。
この効果の発動後、ターン終了時までこのカードの戦闘によるお互いの戦闘ダメージは０になる。
△△△
▲□△
△▲△`,defense:0},"トゥーン・サイバー・ドラゴン":{name:"トゥーン・サイバー・ドラゴン",nameKana:"",description:`(1)：相手フィールドにモンスターが存在し、
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
相手フィールドにトゥーンモンスターが存在しない場合、このカードは直接攻撃できる。`},"サイバー・ドラゴン・コア":{name:"サイバー・ドラゴン・コア",nameKana:"",description:`このカード名の(2)(3)の効果は１ターンに１度、いずれか１つしか使用できない。
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
代わりに自分の手札を１枚捨てる事ができる。`,defense:0,attack:0},"バイス・ドラゴン":{name:"バイス・ドラゴン",nameKana:"",description:`(1)：相手フィールドにのみモンスターが存在する場合、
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
この効果はこのカードがモンスターゾーンに表側攻撃表示で存在する場合に発動と処理を行う。`},強欲な壺:{name:"強欲な壺",nameKana:"",description:"(1)：自分はデッキから２枚ドローする。",kind:"Spell",spellCategory:"Normal",wikiName:"《強欲な壺》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%B6%AF%CD%DF%A4%CA%D4%E4%A1%D5",wikiTextAll:`通常魔法（禁止カード）
(1)：自分はデッキから２枚ドローする。`},天使の施し:{name:"天使の施し",nameKana:"",description:"自分のデッキからカードを３枚ドローし、その後手札を２枚選択して捨てる。",kind:"Spell",spellCategory:"Normal",wikiName:"《天使の施し》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C5%B7%BB%C8%A4%CE%BB%DC%A4%B7%A1%D5",wikiTextAll:`通常魔法（禁止カード）
自分のデッキからカードを３枚ドローし、その後手札を２枚選択して捨てる。`},成金ゴブリン:{name:"成金ゴブリン",nameKana:"",description:`(1)：自分はデッキから１枚ドローする。
その後、相手は１０００ＬＰ回復する。`,kind:"Spell",spellCategory:"Normal",wikiName:"《成金ゴブリン》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C0%AE%B6%E2%A5%B4%A5%D6%A5%EA%A5%F3%A1%D5",wikiTextAll:`通常魔法
(1)：自分はデッキから１枚ドローする。
その後、相手は１０００ＬＰ回復する。`},おろかな埋葬:{name:"おろかな埋葬",nameKana:"",description:"(1)：デッキからモンスター１体を墓地へ送る。",kind:"Spell",spellCategory:"Normal",wikiName:"《おろかな埋葬》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A4%AA%A4%ED%A4%AB%A4%CA%CB%E4%C1%F2%A1%D5",wikiTextAll:`通常魔法（制限カード）
(1)：デッキからモンスター１体を墓地へ送る。`},増援:{name:"増援",nameKana:"",description:"(1)：デッキからレベル４以下の戦士族モンスター１体を手札に加える。",kind:"Spell",spellCategory:"Normal",wikiName:"《増援》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%C1%FD%B1%E7%A1%D5",wikiTextAll:`通常魔法（制限カード）
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
そのモンスターを自分フィールドに特殊召喚する。`,kind:"Spell",spellCategory:"Normal",wikiName:"《死者蘇生》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%BB%E0%BC%D4%C1%C9%C0%B8%A1%D5",wikiTextAll:`通常魔法（制限カード）
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
さらにその数までフィールドのカードを破壊できる。`,nameTags:["ライトロード"]},"ライトロード・ドミニオン キュリオス":{name:"ライトロード・ドミニオン キュリオス",nameKana:"",description:`【リンクマーカー：上/左下/右下】
同じ属性で種族が異なるモンスター３体
このカード名の(1)(2)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：このカードがＬ召喚した場合に発動できる。
デッキからカード１枚を選んで墓地へ送る。
(2)：自分のデッキのカードが効果で墓地へ送られた場合に発動する。
自分のデッキの上からカードを３枚墓地へ送る。
(3)：表側表示のこのカードが相手の効果でフィールドから離れた場合、
または戦闘で破壊された場合、自分の墓地のカード１枚を対象として発動できる。
そのカードを手札に加える。
△▲△
△□△
▲△▲`,pendulumDescription:"",kind:"Monster",monsterCategories:["Link","Effect"],attack:2400,attribute:"Light",type:"Warrior",wikiName:"《ライトロード・ドミニオン キュリオス》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%C9%A5%DF%A5%CB%A5%AA%A5%F3%20%A5%AD%A5%E5%A5%EA%A5%AA%A5%B9%A1%D5",wikiTextAll:`リンク・効果モンスター
リンク３/光属性/戦士族/攻2400
【リンクマーカー：上/左下/右下】
同じ属性で種族が異なるモンスター３体
このカード名の(1)(2)の効果はそれぞれ１ターンに１度しか使用できない。
(1)：このカードがＬ召喚した場合に発動できる。
デッキからカード１枚を選んで墓地へ送る。
(2)：自分のデッキのカードが効果で墓地へ送られた場合に発動する。
自分のデッキの上からカードを３枚墓地へ送る。
(3)：表側表示のこのカードが相手の効果でフィールドから離れた場合、
または戦闘で破壊された場合、自分の墓地のカード１枚を対象として発動できる。
そのカードを手札に加える。
△▲△
△□△
▲△▲`,nameTags:["ライトロード"]},"ライトロード・アーク ミカエル":{name:"ライトロード・アーク ミカエル",nameKana:"",description:`チューナー＋チューナー以外の光属性モンスター１体以上
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
その後、自分のデッキの上からカードを３枚墓地へ送る。`,nameTags:["ライトロード"]},"ライトロード・ビースト ウォルフ":{name:"ライトロード・ビースト ウォルフ",nameKana:"",description:`このカードは通常召喚できず、カードの効果でのみ特殊召喚できる。
(1)：このカードがデッキから墓地へ送られた場合に発動する。
このカードを特殊召喚する。`,pendulumDescription:"",kind:"Monster",monsterCategories:["SpecialSummon","Effect"],level:4,attack:2100,defense:300,attribute:"Light",type:"BeastWarrior",wikiName:"《ライトロード・ビースト ウォルフ》",wikiHref:"https://yugioh-wiki.net/index.php?%A1%D4%A5%E9%A5%A4%A5%C8%A5%ED%A1%BC%A5%C9%A1%A6%A5%D3%A1%BC%A5%B9%A5%C8%20%A5%A6%A5%A9%A5%EB%A5%D5%A1%D5",wikiTextAll:`特殊召喚・効果モンスター
星４/光属性/獣戦士族/攻2100/守 300
このカードは通常召喚できず、カードの効果でのみ特殊召喚できる。
(1)：このカードがデッキから墓地へ送られた場合に発動する。
このカードを特殊召喚する。`,nameTags:["ライトロード"]},"ライトロード・シーフ ライニャン":{name:"ライトロード・シーフ ライニャン",nameKana:"",description:`リバース：自分の墓地に存在する「ライトロード」と名のついた
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
そのモンスターを特殊召喚する。`,nameTags:["ライトロード"]},"ライトロード・メイデン ミネルバ":{name:"ライトロード・メイデン ミネルバ",nameKana:"",description:`(1)：このカードが召喚した時に発動できる。
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
その後、自分のデッキの上からカードを２枚墓地へ送る。`}},Rr=["Monster","Spell","Trap"],bt=["Fusion","Syncro","Xyz","Link"],Ir=[...bt,"SpecialSummon"],$i={Syncro:"シンクロ",Fusion:"融合",Xyz:"エクシーズ",Link:"リンク",SpecialSummon:"特殊召喚",Toon:"トゥーン",Spirit:"スピリット",Union:"ユニオン",Gemini:"デュアル",FlipEffect:"リバース",Tuner:"チューナー",Effect:"効果",Normal:"通常",Pendulum:"ペンデュラム",Token:"トークン"},zi={Syncro:"🎵",Fusion:"🌀",Xyz:"📰",Link:"⛓️",SpecialSummon:"🔯",Toon:"📖",Spirit:"👻",Union:"🚗",Gemini:"👫",FlipEffect:"🔄",Tuner:"🎶",Effect:"✨",Normal:"🔘",Pendulum:"💠",Token:"🐏"},Vi={Normal:"通常",Continuous:"永続",Field:"フィールド",QuickPlay:"速攻",Equip:"装備",Ritual:"儀式"},Gi={Normal:"通常",Continuous:"永続",Counter:"カウンター"},Zr={Light:"光",Dark:"闇",Earth:"地",Water:"水",Fire:"炎",Wind:"風",Divine:"神"},Yi={Aqua:"水",Beast:"獣",BeastWarrior:"獣戦士",CreatorGod:"創造神",Cyberse:"サイバース",Dinosaur:"恐竜",DivineBeast:"幻獣神",Dragon:"ドラゴン",Fairy:"天使",Fiend:"悪魔",Fish:"魚",Insect:"昆虫",Illusion:"幻想魔",Machine:"機械",Plant:"植物",Psychic:"サイキック",Pyro:"炎",Reptile:"爬虫類",Rock:"岩石",SeaSerpent:"海竜",Spellcaster:"魔法使い",Thunder:"雷",Warrior:"戦士",WingedBeast:"鳥獣",Wyrm:"幻竜",Zombie:"アンデット"},Qi={Aqua:"🚰",Beast:"🐅",BeastWarrior:"🦁",CreatorGod:"🔆",Cyberse:"💻️",Dinosaur:"🦖",DivineBeast:"💫",Dragon:"🐲",Fairy:"👼",Fiend:"👿",Fish:"🐟️",Insect:"🦋",Illusion:"🤡",Machine:"🤖",Plant:"🌱",Psychic:"👁️",Pyro:"🔥",Reptile:"🦎",Rock:"⛰",SeaSerpent:"🐍",Spellcaster:"🧙",Thunder:"⚡️",Warrior:"⚔️",WingedBeast:"🦅",Wyrm:"🐉",Zombie:"🦴"},xe=class xe{constructor(e){A(this,"id");A(this,"name");A(this,"description");A(this,"save",async e=>{const t=await xe.tblHeader.update(this.id,i=>({...i,...e}));return new xe(t)});this.id=e.id,this.name=e.name,this.description=e.description}};A(xe,"tblHeader"),A(xe,"getOrCreateNew",async e=>{xe.tblHeader||(xe.tblHeader=new Or(e));const t=await xe.tblHeader.getAll();if(t.length)return new xe(t[0]);const i=await xe.tblHeader.insert({name:"あなた",description:"ここの文字列を何に使うかは未定。"});return new xe(i)});let xn=xe;class Or extends Un{constructor(t){super(t,"TblDuelistProfile");A(this,"_prepareInitialRecords",()=>[])}}let Ur=-1;const jr=[{id:Ur--,name:"NPC",description:""}];class ai{constructor(e,t,i,a,r){A(this,"duel");A(this,"seat");A(this,"_entity");A(this,"profile");A(this,"deckInfo");A(this,"duelistType");A(this,"lifeLog");A(this,"normalSummonCount");A(this,"specialSummonCount");A(this,"maxNormalSummonCount");A(this,"_lp");A(this,"battleDamage",(e,t)=>this.setLp(this._lp-e,t,"BattleDamage"));A(this,"effectDamage",(e,t)=>this.setLp(this._lp-e,t,"EffectDamage"));A(this,"lostLp",(e,t)=>this.setLp(this._lp-e,t,"Lost"));A(this,"payLp",(e,t)=>this.setLp(this._lp-e,t,"Pay"));A(this,"heal",(e,t)=>this.setLp(this._lp+e,t,"Heal"));A(this,"setLp",(e,t,i)=>{const a={clock:this.duel.clock,reason:i||"Set",beforeLp:this._lp,afterLp:e,entity:t};return this.lifeLog.push(a),this._lp=e,this.duel.log.info(`ライフポイント変動：${a.afterLp-a.beforeLp}（${a.beforeLp} ⇒ ${a.afterLp}）`,this),a});A(this,"getOpponentPlayer",()=>this.duel.firstPlayer===this?this.duel.secondPlayer:this.duel.firstPlayer);A(this,"getHandCell",()=>this.duel.field.getCells("Hand").filter(e=>e.owner===this)[0]);A(this,"getDeckCell",()=>this.duel.field.getCells("Deck").filter(e=>e.owner===this)[0]);A(this,"getExtraDeck",()=>this.duel.field.getCells("ExtraDeck").filter(e=>e.owner===this)[0]);A(this,"getGraveyard",()=>this.duel.field.getCells("Graveyard").filter(e=>e.owner===this)[0]);A(this,"getFieldZone",()=>this.duel.field.getCells("FieldSpellZone").filter(e=>e.owner===this)[0]);A(this,"getBanished",()=>this.duel.field.getCells("Banished").filter(e=>e.owner===this)[0]);A(this,"getMonsterZones",()=>this.duel.field.getCells("MonsterZone").filter(e=>e.owner===this));A(this,"getExtraMonsterZones",()=>this.duel.field.getCells("ExtraMonsterZone").filter(e=>{var t;return((t=e.cardEntities[0])==null?void 0:t.controller)===this}));A(this,"getSpellTrapZones",()=>this.duel.field.getCells("SpellAndTrapZone").filter(e=>e.owner===this));A(this,"getEmptyMonsterZones",()=>this.getMonsterZones().filter(e=>e.cardEntities.length===0));A(this,"getEmptyExtraZones",()=>this.getExtraMonsterZones().length===0?this.getMonsterZones().filter(e=>e.cardEntities.length===0):[]);A(this,"getAvailableMonsterZones",()=>this.getMonsterZones().filter(e=>e.isAvailable));A(this,"getAvailableExtraZones",()=>this.getExtraMonsterZones().length===0?this.duel.field.getCells("ExtraMonsterZone").filter(e=>e.isAvailable):[]);A(this,"getAvailableSpellTrapZones",()=>this.getSpellTrapZones().filter(e=>e.isAvailable));A(this,"getReleasableMonsters",()=>this.getMonstersOnField());A(this,"getMonstersOnField",()=>this.duel.field.getMonstersOnField().filter(e=>e.controller===this));A(this,"getAttackTargetMonsters",()=>this.duel.field.getMonstersOnField().filter(e=>e.status.isSelectableForAttack&&e.controller!==this));A(this,"shuffleDeck",()=>{this.getDeckCell().shuffle(),this.duel.log.info("デッキをシャッフル。",this)});this.duel=e,this.seat=t,this.profile=i,this.duelistType=a,this.deckInfo=r,this.lifeLog=[],this.normalSummonCount=0,this.specialSummonCount=0,this.maxNormalSummonCount=1,this._lp=8e3}get entity(){const e=this.getHandCell().entities.find(t=>t.entityType==="Duelist");return e||At.createPlayerEntity(this)}get lp(){return this._lp}get isTurnPlayer(){return this.duel.getTurnPlayer()===this}}Array.prototype.shuffle=function(){return this.map(e=>({item:e,seq:Math.random()})).toSorted((e,t)=>e.seq-t.seq).map(e=>e.item)};Array.prototype.randomPick=function(n){return this.shuffle().slice(0,n)};Array.prototype.reset=function(...n){this.splice(0),this.push(...n)};Array.prototype.union=function(n){return this.filter(n.includes,n)};Array.prototype.getAllOnOffPattern=function(){const n=[];return this.forEach(e=>{if(n.length==0){n.push([e]),n.push([]);return}n.forEach(t=>n.push([...t,e]))}),n};const Mn={0:{0:"Hand"},1:{0:"Deck",1:"SpellAndTrapZone",2:"SpellAndTrapZone",3:"SpellAndTrapZone",4:"SpellAndTrapZone",5:"SpellAndTrapZone",6:"ExtraDeck"},2:{0:"Graveyard",1:"MonsterZone",2:"MonsterZone",3:"MonsterZone",4:"MonsterZone",5:"MonsterZone",6:"FieldSpellZone"},3:{0:"Banished",1:"Disable",2:"ExtraMonsterZone",3:"Disable",4:"ExtraMonsterZone",5:"Disable",6:"Banished"},4:{0:"FieldSpellZone",1:"MonsterZone",2:"MonsterZone",3:"MonsterZone",4:"MonsterZone",5:"MonsterZone",6:"Graveyard"},5:{0:"ExtraDeck",1:"SpellAndTrapZone",2:"SpellAndTrapZone",3:"SpellAndTrapZone",4:"SpellAndTrapZone",5:"SpellAndTrapZone",6:"Deck"},6:{0:"Hand"}};class $r{constructor(e,t,i,a){A(this,"onUpdateEvent",new ye);A(this,"field");A(this,"row");A(this,"column");A(this,"cellType");A(this,"owner");A(this,"_entities");A(this,"releaseEntities",(e,t,i)=>(this._entities=this._entities.filter(a=>!e.includes(a)),e.forEach(a=>{a.movedAs.splice(0),a.movedAs.push(...new Set(t)),a.movedAt=a.field.duel.clock,a.movedBy=i,a.movedFrom=this}),this.onUpdateEvent.trigger(),e));A(this,"acceptEntities",(e,t)=>{t==="Bottom"?this._entities.push(...e):t==="Top"&&this._entities.unshift(...e),this._entities.forEach(i=>{i.fieldCell=this}),this.onUpdateEvent.trigger()});A(this,"shuffle",()=>{this._entities=this.entities.shuffle()});this.field=e,this.row=t,this.column=i,this.cellType=Mn[t][i],this.owner=a,this._entities=[]}get onUpdate(){return this.onUpdateEvent.expose()}get entities(){return this._entities}get cardEntities(){return this._entities.filter(e=>ss.find(t=>t===e.entityType))}get targetForAttack(){return this.cellType==="Hand"?this._entities.find(e=>e.entityType==="Duelist"):this.cardEntities[0]}get isAvailable(){return this._entities.length===0}}class zr{constructor(e){A(this,"cells");A(this,"duel");A(this,"getAllCells",()=>this.cells.flat());A(this,"getCells",(...e)=>this.getAllCells().filter(t=>e.includes(t.cellType)));A(this,"getAllEntities",()=>this.getAllCells().map(e=>e.entities).flat());A(this,"getAllCardEntities",()=>this.getAllCells().map(e=>e.cardEntities).flat());A(this,"getMonstersOnField",()=>this.getCells("MonsterZone","ExtraMonsterZone").map(e=>e.cardEntities).filter(e=>e.length>0).map(e=>e[0]).filter(e=>e.entityType!=="Squatter"));A(this,"getEntities",e=>this.getAllEntities().filter(t=>t.controller===e));A(this,"pushDeck",e=>{e.deckInfo.cardNames.map(t=>Pe[t]).filter(t=>t).forEach(t=>At.createCardEntity(this,e,t)),this.duel.log.info(`デッキをセット。メイン${e.getDeckCell().cardEntities.length}枚。エクストラ${e.getExtraDeck().cardEntities.length}枚。`,e)});A(this,"prepareHands",async e=>await this.draw(e,5));A(this,"draw",async(e,t,i)=>{const a=await this._draw(e,t,i);if(!a)throw new st(e.getOpponentPlayer());return a});A(this,"drawSameTime",async(e,t,i,a,r)=>{const s=await this._draw(e,t,r),l=await this._draw(i,t,r);if(s&&l)return!0;throw s?new st(e):l?new st(e):new st});A(this,"_draw",async(e,t,i)=>{var s;if(t<1)return!0;const a=e.getDeckCell(),r=[];for(const l of Array(t)){if(!a.cardEntities.length)return this.duel.log.info(r.length>0?`デッキからカードを${t}枚ドローしようとしたが、${r.length}枚しかドローできなかった。${r}`:"デッキからカードをドローできなかった。",e),this.duel.isEnded=!0,e.setLp(0),!1;const d=a.cardEntities[0];await d.draw(i?["Effect"]:["Rule"],i),r.push(((s=d.origin)==null?void 0:s.name)||"!名称取得失敗!")}return this.duel.log.info(`デッキからカードを${r.length}枚ドロー。${r}。`,e),!0});A(this,"payMonstersForSpecialSummonCost",async(e,t,i,a,r,s,l)=>{if(i>0&&t.length<i)return;const d=await this.duel.view.waitSelectEntities(e,t,i,a,"素材とするモンスターを選択",l);if(console.log(d),!!d){for(const o of d)await o.release(["Release",...r],s);return this.duel.log.info(`${d.map(o=>o.status.name).join(", ")}を素材とした（${[...new Set(d.flatMap(o=>o.movedAs))].join(", ")}）。`,e),d}});A(this,"release",async(e,t,i,a,r,s,l,d)=>{if(i>0&&t.length<i)return;const o=await this.duel.view.waitSelectEntities(e,t,i,u=>(l||u.length>0)&&(i<0||u.length===i),"リリースするモンスターを選択",d);if(!o)return;const m=[];for(const u of o)await u.release(["Release",a,...r],s),m.push(u);return this.duel.log.info(`${m.map(u=>u.status.name).join(", ")}をリリース（${[...new Set(m.flatMap(u=>u.movedAs))].join(", ")}）。`,e),m});A(this,"discard",async(e,t,i,a,r,s)=>{const l=s||(()=>!0),d=e.getHandCell().cardEntities.filter(l);if(d.length<t)return[];let o=[];return(r||e).duelistType==="NPC"?o=d.randomPick(t):o=await this.duel.view.waitSelectEntities(r||e,d,t,m=>m.length===t,`${t}枚カードを捨てる。`,!1)||[],await this._sendGraveyardMany(o,["Discard",...i],a),this.duel.log.info(`手札からカードを${o.length}枚捨てた。${o.map(m=>{var u;return(u=m.origin)==null?void 0:u.name})}。`,e),o});A(this,"summonMany",async(e,t,i,a,r,s,l)=>{const d=await Promise.all(e.map(async o=>this._summon(o,t(o),i(o),a,r,s,l?l(o):void 0)));if(d.find(o=>!o))throw new tt("想定されない返却値",d);return d});A(this,"summon",async(e,t,i,a,r,s,l,d=!1)=>{const o=await this._summon(e,t,i,a,r,s,l,d);if(o)return this.duel.log.info(`${o.status.name}を召喚（${[...r,a].join(",")}）。`,l??(s==null?void 0:s.controller)??e.controller),o});A(this,"_summon",async(e,t,i,a,r,s,l,d=!1)=>{const o=l??(s==null?void 0:s.controller)??e.controller;let m=t.randomPick(1)[0],u=i.randomPick(1)[0];if((i.length>1||t.length>1)&&o.duelistType!=="NPC"){const k=t.map(w=>At.createDammyAction(e,w,i,w));this.duel.view.modalController.selectAction(this.duel.view,{title:"カードを召喚先へドラッグ。",actions:k,cancelable:!1});const C=await this.duel.view.waitSubAction(o,k,"カードを召喚先へドラッグ。",d),p=C.actionWIP;if(!p&&!d)throw new tt("",C);if(!p)return;u=p.cell||u,m=p.pos||m}return console.log(u,m,a,r,s),await e.summon(u,m,a,r,s),e});A(this,"activateSpellTrapFromHand",async(e,t,i,a,r,s=!1)=>{const l=r??(a==null?void 0:a.controller)??e.controller;let d=t.randomPick(1)[0];if(t.length>1&&l.duelistType!=="NPC"){const o=[At.createDammyAction(e,"カードの発動",t,void 0)];this.duel.view.modalController.selectAction(this.duel.view,{title:"カードを魔法罠ゾーンへドラッグ",actions:o,cancelable:!1});const m=await this.duel.view.waitSubAction(l,o,"カードを魔法罠ゾーンへドラッグ。",s),u=m.actionWIP;if(!u&&!s)throw new tt("",m);if(!u)return;d=u.cell||d}return await e.activateSpellTrapFromHand(d,i,a),e});A(this,"destroyMany",async(e,t,i)=>await this._sendGraveyardMany(e,[...t,"Destroy"],i));A(this,"sendGraveyardMany",async(e,t,i)=>await this._sendGraveyardMany(e,t,i));A(this,"_sendGraveyardMany",async(e,t,i)=>{for(const a of e)await a.sendGraveyard(t,i);return e.filter(a=>a.entityType!=="Token")});A(this,"setSpellTrap",async(e,t,i,a,r=!1)=>{let s=t[0];const l=a??(i==null?void 0:i.controller)??e.controller;if(t.length>1&&l.duelistType!=="NPC"){const d=[At.createDammyAction(e,"セット",t)],o=this.duel.view.modalController.selectAction(this.duel.view,{title:"カードをセット先へドラッグ",actions:d,cancelable:r}),m=this.duel.view.waitSubAction(l,d,"カードをセット先へドラッグ",r),u=await Promise.any([o,m.then(k=>k.actionWIP)]);if(!u&&!r)throw new tt("",u);if(!u)return;s=u.cell||s}await e.setAsSpellTrap(s,["SpellTrapSet"],i),this.duel.log.info(`${e.status.name}をセット（SpellTrapSet）。`,a??(i==null?void 0:i.controller)??e.controller)});this.duel=e,this.cells=[...Array(7)].map(()=>[]);for(const t of Object.keys(Mn).map(Number))for(const i of Object.keys(Mn[t]).map(Number))this.cells[t][i]=new $r(this,t,i,t<3?e.duelists.Above:t>3?e.duelists.Below:void 0)}}let Vr=class{constructor(e){A(this,"onUpdateEvent",new ye);A(this,"nextSeq");A(this,"records",[]);A(this,"duel");A(this,"dispose",()=>{this.onUpdateEvent.clear()});A(this,"error",e=>{console.error(e);const t=["エラー発生"];e instanceof Error?(e instanceof tt&&(t.push("-- エラーメッセージ --"),t.push(e.message),t.push("-- 関連オブジェクト --"),e.items.forEach(i=>t.push(JSON.stringify(i)))),t.push("-- エラー名称 --"),t.push(e.name||"エラー名称取得失敗"),t.push("-- スタックトレース --"),t.push(e.stack||"スタックトレース取得失敗")):(t.push("-- エラー型特定失敗 --"),t.push(JSON.stringify(e))),this.info(t)});A(this,"info",(e,t)=>{const i=Array.isArray(e)?e.join(`
`):e;this.records.push({seq:this.nextSeq++,turn:this.duel.clock.turn,phase:this.duel.phase,phaseStep:this.duel.phaseStep,clock:this.duel.clock,duelist:t,text:i}),this.onUpdateEvent.trigger()});this.nextSeq=0,this.duel=e}get onUpdate(){return this.onUpdateEvent.expose()}};const ri=["DuelEntitiesSelector","DuelActionSelector"];class Gr{constructor(e){A(this,"onUpdateEvent",new ye);A(this,"states");A(this,"view");A(this,"cancelAll",()=>{ri.forEach(e=>this.states[e]="Disable"),console.info(this,"cancelAll"),this.onUpdateEvent.trigger()});A(this,"duelEntitiesSelectorArg",{title:"対象を選択",entities:[],validator:()=>!0,qty:-1,cancelable:!1});A(this,"duelEntitiesSelectorValue");A(this,"duelEntitiesSelectorResolve",()=>{});A(this,"selectDuelEntities",async e=>(this.duelEntitiesSelectorArg=e,this.states.DuelEntitiesSelector="Shown",this.onUpdateEvent.trigger(),new Promise(t=>{this.duelEntitiesSelectorResolve=i=>{this.states.DuelEntitiesSelector="Disable",this.onUpdateEvent.trigger(),t(i)}})));A(this,"cardActionSelectorArg",{title:"カード操作を選択。",actions:[],cancelable:!1});A(this,"cardActionSelectorResolve",()=>{});A(this,"cardActionSelectorValue");A(this,"selectAction",async(e,t)=>(this.cardActionSelectorArg=t,this.states.DuelActionSelector="Shown",e.onWaitEnd.append(this.cancelAll),this.onUpdateEvent.trigger(),new Promise(i=>{this.cardActionSelectorResolve=a=>{this.states.DuelActionSelector="Disable",e.onWaitEnd.remove(this.cancelAll),this.onUpdateEvent.trigger(),i(a)}})));this.view=e,this.states=ri.reduce((t,i)=>(t[i]="Disable",t),{})}get onUpdate(){return this.onUpdateEvent.expose()}}class Yr{constructor(e){A(this,"onDuelUpdateEvent",new ye);A(this,"requireUpdate",()=>{this.onDuelUpdateEvent.trigger()});A(this,"onWaitStartEvent",new ye);A(this,"onWaitEndEvent",new ye);A(this,"onDragStartEvent",new ye);A(this,"onDragEndEvent",new ye);A(this,"onAnimationStartEvent",new ye);A(this,"onShowCardEntityEvent",new ye);A(this,"duel");A(this,"modalController");A(this,"message");A(this,"waitMode");A(this,"infoBoardState");A(this,"infoBoardCell");A(this,"getCell",(e,t)=>this.duel.field.cells[e][t]);A(this,"showCardInfo",e=>{this.onShowCardEntityEvent.trigger(e)});A(this,"dispose",()=>{this.onDragStartEvent.clear(),this.onDragEndEvent.clear(),this.onDuelUpdateEvent.clear(),this.onWaitStartEvent.clear(),this.onWaitEndEvent.clear()});A(this,"waitFieldAction",async(e,t)=>{if(console.log(e),this.duel.getTurnPlayer().duelistType==="NPC"){const i=e.toSorted((a,r)=>(r.entity.atk||0)-(a.entity.atk||0)).find(a=>a.playType==="NormalSummon"||a.playType==="SpecialSummon");return i?{actionWIP:i}:{phaseChange:this.duel.nextPhaseList[0]}}return await this._waitDuelistAction(e,"SelectFieldAction",t)});A(this,"waitQuickEffect",async(e,t,i)=>{if(e.length===0)return;const a=[];return a.push(this.modalController.selectAction(this,{title:t,actions:e,cancelable:i}).then(r=>r&&r)),a.push(this._waitDuelistAction(e,"SelectAction",this.message).then(r=>r.actionWIP)),await Promise.any(a)});A(this,"waitSubAction",async(e,t,i,a=!1)=>{if(e.duelistType==="NPC")throw Error("Not implemented");return await this._waitDuelistAction(t,"SelectAction",i,void 0,void 0,void 0,a)});A(this,"waitSelectEntities",async(e,t,i,a,r,s=!1)=>{let l=[];if(i&&t.length===i)return[...t];if(e.duelistType==="NPC"){for(;!a(l);){const o=i&&i>0?i:Math.floor(Math.random()*t.length)+1;l=t.randomPick(o)}return l}this.waitMode=t.every(o=>(o.fieldCell.cellType==="MonsterZone"||o.fieldCell.cellType==="ExtraMonsterZone")&&o.getIndexInCell()===0||o.fieldCell.cellType==="Hand"&&o.controller===e)?"SelectFieldEntities":"SelectEntities",console.log(this.waitMode);const d=await this._waitDuelistAction([],this.waitMode,r,t,i,a,s);return console.log(d),d.selectedEntities});A(this,"_waitDuelistAction",async(e,t,i,a,r,s,l=!1)=>{this.waitMode=t,this.message=i,this.onDuelUpdateEvent.trigger();const d=await new Promise(o=>{const m={resolve:o,enableActions:e,qty:r,entitiesValidator:s||(()=>!1),selectableEntities:a||[]};console.log(a),console.log(s),console.log(this.waitMode),console.log(this.waitMode==="SelectEntities"),a&&s&&this.waitMode==="SelectEntities"&&(m.duelEntitiesSelectorArg={title:i,entities:a,validator:s,qty:r??-1,cancelable:!1}),this.onWaitStartEvent.trigger(m)});if(this.waitMode="None",this.onWaitEndEvent.trigger(),d.surrender)throw new st(this.duel.duelists.Above);if(!l&&d.cancel)throw new tt("キャンセル不可のアクションがキャンセルされた。",d,e,t,a);return d});A(this,"waitAnimation",async e=>(this.onDuelUpdateEvent.trigger(),new Promise(t=>this.onAnimationStartEvent.trigger({...e,resolve:t}))));A(this,"setDraggingActions",e=>{this.onDragStartEvent.trigger(e),this.requireUpdate()});A(this,"removeDraggingActions",()=>{this.onDragEndEvent.trigger()});this.duel=e,this.message="",this.waitMode="None",this.infoBoardState="Log",this.infoBoardCell=e.duelists.Below.getExtraDeck(),this.modalController=new Gr(this)}get onDuelUpdate(){return this.onDuelUpdateEvent.expose()}get onWaitStart(){return this.onWaitStartEvent.expose()}get onWaitEnd(){return this.onWaitEndEvent.expose()}get onDragStart(){return this.onDragStartEvent.expose()}get onDragEnd(){return this.onDragEndEvent.expose()}get onAnimation(){return this.onAnimationStartEvent.expose()}get onShowCardEntity(){return this.onShowCardEntityEvent.expose()}}class Qr{constructor(){A(this,"_turn",0);A(this,"_phaseSeq",0);A(this,"_stepSeq",0);A(this,"_chainSeq",0);A(this,"_chainBlockSeq",0);A(this,"_procSeq",0);A(this,"_procTotalSeq",0);A(this,"incrementTurn",()=>{this._turn++,this._phaseSeq=0,this._stepSeq=0,this._chainSeq=0,this._chainBlockSeq=0,this._procSeq=0});A(this,"incrementPhaseSeq",()=>{this._phaseSeq++,this._stepSeq=0,this._chainSeq=0,this._chainBlockSeq=0,this._procSeq=0});A(this,"incrementStepSeq",()=>{this._stepSeq++,this._chainSeq=0,this._chainBlockSeq=0,this._procSeq=0});A(this,"incrementChainSeq",()=>{this._chainSeq++,this._chainBlockSeq=0,this._procSeq=0});A(this,"incrementChainBlockSeq",()=>{this._chainBlockSeq++,this._procSeq=0});A(this,"incrementProcSeq",()=>{this._procSeq++,this._procTotalSeq++});A(this,"toString",()=>`${this.procTotalSeq}(t${this.turn}-p${this.phaseSeq}-ps${this.stepSeq}-c${this.chainSeq}-cb${this.chainBlockSeq}-p${this.procSeq})`)}get turn(){return this._turn}get phaseSeq(){return this._phaseSeq}get stepSeq(){return this._stepSeq}get chainSeq(){return this._chainSeq}get chainBlockSeq(){return this._chainBlockSeq}get procSeq(){return this._procSeq}get procTotalSeq(){return this._procTotalSeq}}class st extends Error{constructor(t){const i=t?`デュエルが終了した。勝者：${t.profile.name}`:"デュエルが終了した。ドロー。";super(i);A(this,"winner");this.winner=t}}class tt extends Error{constructor(t,...i){super("message");A(this,"message");A(this,"items");this.message=t,this.items=i}}class Xr{constructor(e,t,i,a,r,s){A(this,"view");A(this,"log");A(this,"clock");A(this,"phase");A(this,"phaseStep");A(this,"nextPhaseList");A(this,"field");A(this,"attackingMonster");A(this,"targetForAttack");A(this,"duelists");A(this,"priorityHolder");A(this,"isEnded");A(this,"coin",!1);A(this,"getTurnPlayer",()=>this.clock.turn%2===0?this.secondPlayer:this.firstPlayer);A(this,"getNonTurnPlayer",()=>this.clock.turn%2===0?this.firstPlayer:this.secondPlayer);A(this,"main",async()=>{console.info("main start!"),this.coin=Math.random()>.5,this.priorityHolder=this.firstPlayer,this.log.info("【デュエル開始】"),this.log.info(`先攻：${this.firstPlayer.profile.name}`),Object.values(this.duelists).forEach(this.field.pushDeck),Object.values(this.duelists).forEach(e=>e.shuffleDeck()),await Promise.all(Object.values(this.duelists).map(this.field.prepareHands)),console.log("hoge"),this.moveNextPhase("draw"),this.view.requireUpdate();try{for(;!this.isEnded&&(this.phase==="draw"?await this.procDrawPhase():this.phase==="standby"?await this.procStanbyPhase():this.phase==="main1"?await this.procMainPhase():this.phase==="battle"?await this.procBattlePhase():this.phase==="main2"?await this.procMainPhase():this.phase==="end"&&await this.procEndPhase(),!(this.clock.turn>1e3)););}catch(e){e instanceof st?(console.info(e),this.isEnded=!0,this.log.info(e.winner?`デュエル終了。勝者${e.winner.profile.name}`:"引き分け")):e instanceof Error&&this.log.error(e)}finally{this.view.requireUpdate(),this.view.dispose(),this.log.dispose()}});A(this,"moveNextPhase",e=>{e==="draw"?this.clock.incrementTurn():this.clock.incrementPhaseSeq(),this.clock.turn<1?this.phase="draw":e==="draw"?this.log.info("ターン終了。",this.getTurnPlayer()):this.log.info(`フェイズ移行（${this.phase}→${e}）`,this.getTurnPlayer()),this.phase=e,this.phaseStep=void 0,this.phase==="main2"||this.clock.turn===1?this.nextPhaseList=["end"]:this.phase==="battle"?this.nextPhaseList=["main2"]:this.phase==="main1"?this.nextPhaseList=["battle","end"]:this.nextPhaseList=[]});A(this,"declareAnAttack",(e,t)=>{this.attackingMonster=e,this.targetForAttack=t,e.status.attackCount++,this.log.info(`攻撃宣言：${e.status.name} ⇒ ${t.status.name}`,e.controller)});A(this,"procDrawPhase",async()=>{for(Object.values(this.duelists).forEach(e=>{e.normalSummonCount=0,e.specialSummonCount=0}),this.log.info("ドローフェイズ開始。",this.getTurnPlayer()),this.clock.turn===1?this.log.info("先攻プレイヤーはドローできない。",this.getTurnPlayer()):await this.field.draw(this.getTurnPlayer(),1);await this.procChainBlock(););this.field.getMonstersOnField().forEach(e=>{e.status.attackCount=0,e.status.battlePotisionChangeCount=0}),this.moveNextPhase("standby")});A(this,"procStanbyPhase",async()=>{for(;await this.procChainBlock(););this.moveNextPhase("main1")});A(this,"procMainPhase",async()=>{for(;;){this.priorityHolder=this.getTurnPlayer();const e=await this.view.waitFieldAction(this.getEnableActions(["NormalSummon","SpellTrapSet","SpecialSummon","ChangeBattlePosition","IgnitionEffect","QuickEffect","CardActivation"],["Normal","Quick","Counter"]),"あなたの手番です。");if(e.actionWIP){if([...rs].includes(e.actionWIP.playType)){const i=await e.actionWIP.prepare(e.actionWIP.cell,!0);if(console.log(i),!i)continue;await e.actionWIP.execute(this.priorityHolder,e.actionWIP.cell,i),this.clock.incrementProcSeq()}else await this.procChainBlock(e.actionWIP);for(;await this.procChainBlock(););continue}const t=e.phaseChange;if(t){if(this.priorityHolder=this.getNonTurnPlayer(),await this.view.waitQuickEffect(this.getEnableActions(["QuickEffect","TriggerEffect"],["Quick","Counter"]),"",!0)){this.procChainBlock();continue}this.moveNextPhase(t);return}}});A(this,"procBattlePhase",async()=>{await this.procBattlePhaseStartStep(),await this.procBattlePhaseBattleStep(),await this.procBattlePhaseEndStep()});A(this,"procBattlePhaseStartStep",async()=>{for(this.phaseStep="start",this.priorityHolder=this.getTurnPlayer(),this.attackingMonster=void 0,this.targetForAttack=void 0;await this.procChainBlock(););});A(this,"procBattlePhaseBattleStep",async()=>{for(;;){this.phaseStep="battle",this.priorityHolder=this.getTurnPlayer();const e=await this.view.waitFieldAction(this.getEnableActions(["Battle"],["Normal"]),"攻撃モンスターと対象を選択。");if(e.phaseChange)break;if(e.actionWIP){for(await e.actionWIP.execute(this.priorityHolder,e.actionWIP.cell),this.clock.incrementProcSeq();await this.procChainBlock(););this.clock.incrementStepSeq(),await this.procBattlePhaseDamageStep()}}this.clock.incrementStepSeq()});A(this,"procBattlePhaseDamageStep",async()=>{this.phaseStep="damage";const e=this.attackingMonster,t=this.targetForAttack;if(!e||!e.atk)throw new tt("想定されない状態",this.attackingMonster,this.targetForAttack);this.log.info("ダメージステップ開始時",this.getTurnPlayer()),this.log.info("ダメージ計算前",this.getTurnPlayer()),(t==null?void 0:t.battlePotion)==="Set"&&t.setBattlePosition("Defense"),this.log.info("ダメージ計算時",this.getTurnPlayer());const i=e.atk,a=((t==null?void 0:t.battlePotion)==="Attack"?t.atk:t==null?void 0:t.def)||0;!t||t.entityType==="Duelist"?e.controller.getOpponentPlayer().battleDamage(i-a,e):i>0&&i>a?(t.battlePotion==="Attack"&&e.controller.getOpponentPlayer().battleDamage(i-a,e),t.isDying=!0):i<a?(e.controller.battleDamage(a-i,t),t.battlePotion==="Attack"&&(e.isDying=!0)):i===a&&t.battlePotion==="Attack"&&(e.isDying=!0,t.isDying=!0);const r=Object.values(this.duelists).filter(s=>s.lp<=0);if(r.length>0)throw new st(Object.values(this.duelists).filter(s=>!r.includes(s)).pop());e.isDying&&await this.field.destroyMany([e],["BattleDestroy"],t),t!=null&&t.isDying&&await this.field.destroyMany([t],["BattleDestroy"],e),this.log.info("ダメージ計算後",this.getTurnPlayer()),this.log.info("ダメージステップ終了時",this.getTurnPlayer()),this.clock.incrementStepSeq()});A(this,"procBattlePhaseEndStep",async()=>{for(this.phaseStep="end",this.priorityHolder=this.getTurnPlayer();await this.procChainBlock(););this.moveNextPhase("main2")});A(this,"procEndPhase",async()=>{for(;await this.procChainBlock(););for(;;){const t=this.getTurnPlayer().getHandCell().cardEntities.length;if(t<7)break;await this.field.discard(this.getTurnPlayer(),t-6,["Rule"])}this.moveNextPhase("draw")});A(this,"procChainBlock",async(e,t)=>{const i=this.clock.chainBlockSeq===0;let a;const r=t??Object.values(this.duelists).flatMap(s=>(this.priorityHolder=s,this.getEnableActions(["TriggerMandatoryEffect","TriggerEffect"],["Normal"])));try{if(e||r.length>0&&await this.selectTriggerEffect(r))return a=e,!0;let s=0;for(;s<2;){this.priorityHolder=this.priorityHolder.getOpponentPlayer();const l=await this.view.waitQuickEffect(this.getEnableActions(["QuickEffect"],["Normal","Quick","Counter"]),"クイックエフェクト発動タイミング。効果を発動しますか？",!0);if(l)return a=l,!0;s++}return!1}finally{if(a){const s=a.entity.controller;this.log.info(`${a.entity.nm}«${a.title}»を発動`,s);const l=await a.prepare(a.cell);this.clock.incrementProcSeq(),this.clock.incrementChainBlockSeq(),await this.procChainBlock(void 0,r.filter(d=>d.seq!==(a==null?void 0:a.seq))),this.log.info(`${a.entity.nm}«${a.title}»の効果処理`,s),await a.execute(s,a.cell,l),this.clock.incrementProcSeq(),i&&(await Promise.all(this.field.getAllCells().filter(d=>d.cellType==="SpellAndTrapZone").flatMap(d=>d.entities).filter(d=>d.isDying).map(d=>d.sendGraveyard(["Rule"]))),this.clock.incrementChainSeq())}}});A(this,"selectTriggerEffect",async e=>{if(e.length>0)for(const t of["TriggerMandatoryEffect","TriggerEffect"])for(const i of[this.getTurnPlayer(),this.getNonTurnPlayer()]){this.priorityHolder=i;const a=e.filter(s=>s.playType===t&&s.entity.controller===i);if(a.length===0)continue;if(a.length===1&&t==="TriggerMandatoryEffect")return a[0];const r=await this.view.waitQuickEffect(a,"効果を選択。",t==="TriggerEffect");if(r)return r}});A(this,"getEnableActions",(e,t)=>this.field.getAllCardEntities().filter(i=>i.controller===this.priorityHolder).flatMap(i=>i.actions).filter(i=>i.executableCells.includes(i.entity.fieldCell.cellType)).filter(i=>e.includes(i.playType)).filter(i=>t.includes(i.spellSpeed)).filter(i=>i.validate()));this.phase="end",this.clock=new Qr,this.nextPhaseList=[],this.isEnded=!1,this.duelists={Below:new ai(this,"Below",e,t,i),Above:new ai(this,"Above",a,r,s)},this.priorityHolder=this.firstPlayer,this.field=new zr(this),this.view=new Yr(this),this.log=new Vr(this)}get firstPlayer(){return this.coin?this.duelists.Below:this.duelists.Above}get secondPlayer(){return this.coin?this.duelists.Above:this.duelists.Below}}const Xi=n=>{if(n.controller.normalSummonCount>=n.controller.maxNormalSummonCount||!n.status.level)return;const e=n.controller.getAvailableMonsterZones();return n.status.level<5?e.length>0?e:void 0:n.controller.getReleasableMonsters().length<(n.status.level<7?1:2)?void 0:[]},Ji=async(n,e,t,i)=>{if(!n.status.level)return[];if(n.status.level<5)return[];let a=i;const r=n.controller.getReleasableMonsters(),s=n.controller.getExtraMonsterZones(),l=n.status.level<7?1:2;s.length>=l&&r.filter(o=>o.fieldCell.cellType!=="ExtraMonsterZone");const d=await n.field.release(n.controller,n.controller.getReleasableMonsters(),l,"Cost",["AdvanceSummonRelease","Rule"],n,a);if(d)return a=!1,d},ea=async(n,e,t,i)=>{if(!n.status.level)return!1;const a=["Rule","NormalSummon"];i&&i.length>0&&(n.materials.reset(...i),a.push("AdvanceSummon"));const r=n.controller.getAvailableMonsterZones();return await n.field.summon(n,[e],t?[t]:r,"NormalSummon",a,n,void 0,i&&i.length===0),n.controller.normalSummonCount++,!0},Jr=n=>{if(n.status.attackCount>0||n.battlePotion!=="Attack"||!n.controller.isTurnPlayer)return;const e=n.controller.getAttackTargetMonsters();return e.length>0?e.map(t=>t.fieldCell):[n.controller.getOpponentPlayer().getHandCell()]},es=async(n,e,t)=>{if(n.status.attackCount>0||n.battlePotion!=="Attack")return!1;if(t!=null&&t.targetForAttack)return n.field.duel.declareAnAttack(n,t==null?void 0:t.targetForAttack),!0;const i=n.controller.getAttackTargetMonsters(),a=n.controller.getOpponentPlayer().entity;if(i.length===0)return n.field.duel.declareAnAttack(n,a),!0;if(i.length===1)return n.field.duel.declareAnAttack(n,i[0]),!0;const r=await n.field.duel.view.waitSelectEntities(n.controller,i,1,s=>s.length===1,"攻撃対象を選択。",!0);return r?(n.field.duel.declareAnAttack(n,r[0]),!0):!1},ts=n=>{if(!(n.status.battlePotisionChangeCount>0||n.status.attackCount>0||!n.controller.isTurnPlayer))return[]},ns=async n=>n.status.battlePotisionChangeCount>0||!n.controller.isTurnPlayer?!1:(n.setBattlePosition(n.battlePotion==="Attack"?"Defense":"Attack"),n.status.battlePotisionChangeCount++,!0),is=n=>{if(n.status.spellCategory==="Field"){const t=n.controller.getFieldZone();return t.isAvailable?[t]:void 0}const e=n.controller.getAvailableSpellTrapZones();return e.length>0?e:void 0},as=async(n,e,t)=>{const i=n.controller.getAvailableSpellTrapZones();return i.length===0?!1:(await n.field.setSpellTrap(n,t?[t]:i,void 0,n.controller,!0),!0)},Ge=(n,e=()=>!0)=>{if(n.fieldCell.cellType==="FieldSpellZone"&&n.face==="FaceDown")return[];const t=n.controller.getAvailableSpellTrapZones();return t.length>0&&e(n)?t:void 0},Ye=async(n,e,t)=>{if(n.fieldCell.cellType==="FieldSpellZone"&&n.face==="FaceDown")return n.setNonFieldPosition("FaceUp",!0),!0;if(n.fieldCell.cellType==="Hand"){const i=["SpellTrapActivate"],a=t?[t]:n.controller.getAvailableSpellTrapZones();return await n.field.activateSpellTrapFromHand(n,a,i,n,n.controller,!0),!0}return!1},ta=(n,e,t,i)=>!(e.some(a=>!a.status.canBeSyncroMaterial)||e.some(a=>a.fieldCell.cellType!=="Hand"&&a.fieldCell.cellType!=="MonsterZone"&&a.fieldCell.cellType!=="ExtraMonsterZone")||e.some(a=>a.fieldCell.cellType==="Hand")&&e.every(a=>!a.status.allowHandSyncro)||e.some(a=>!a.lvl)||e.map(a=>a.lvl??0).reduce((a,r)=>a+r,0)!==(n.origin.level??-1)||!t(e.filter(a=>{var r;return(r=a.status.monsterCategories)==null?void 0:r.some(s=>s==="Tuner")}))||!i(e.filter(a=>{var r;return(r=a.status.monsterCategories)==null?void 0:r.every(s=>s!=="Tuner")}))),si=(n,e=i=>i.length===1,t=i=>i.length>0)=>{let i=[...n.controller.getMonstersOnField().filter(a=>a.face==="FaceUp"),...n.controller.getHandCell().entities.filter(a=>a.origin.kind==="Monster")].filter(a=>a.status.canBeSyncroMaterial);if(i.every(a=>!a.status.allowHandSyncro)&&(i=n.controller.getMonstersOnField()),!(i.length<2)){for(const a of i.getAllOnOffPattern())if(ta(n,a,e,t))return[]}},Ai=async(n,e,t,i,a=s=>s.length===1,r=s=>s.length>0)=>{let s=[...n.controller.getMonstersOnField(),...n.controller.getHandCell().entities.filter(d=>d.origin.kind==="Monster")].filter(d=>d.status.canBeSyncroMaterial);if(s.every(d=>!d.status.allowHandSyncro)&&(s=n.controller.getMonstersOnField()),s.length<2)return;console.log(s);const l=await n.field.payMonstersForSpecialSummonCost(n.controller,s,-1,d=>ta(n,d,a,r),["SyncroMaterial","Rule"],n,i);if(console.log(l),!!l)return l},oi=async(n,e,t,i,a)=>{a&&a.length>0&&n.materials.reset(...a);const r=[...e.getAvailableMonsterZones(),...e.getAvailableExtraZones()];return await n.field.summon(n,[t],i?[i]:r,"SyncroSummon",["Rule","SpecialSummon"],n,void 0,a&&a.length===0),e.specialSummonCount++,n.canReborn=!0,!0},na={title:"召喚",playType:"NormalSummon",spellSpeed:"Normal",executableCells:["Hand"],validate:Xi,prepare:(n,e,t)=>Ji(n,"Attack",e,t),execute:(n,e,t,i)=>ea(n,"Attack",t,i)},ia={title:"セット",playType:"NormalSummon",spellSpeed:"Normal",executableCells:["Hand"],validate:Xi,prepare:(n,e,t)=>Ji(n,"Set",e,t),execute:(n,e,t,i)=>ea(n,"Set",t,i)},Ot={title:"攻撃宣言",playType:"Battle",spellSpeed:"Normal",executableCells:["MonsterZone","ExtraMonsterZone"],validate:Jr,prepare:async()=>!0,execute:(n,e,t)=>es(n,void 0,t)},Ut={title:"表示形式変更",playType:"ChangeBattlePosition",spellSpeed:"Normal",executableCells:["MonsterZone","ExtraMonsterZone"],validate:ts,prepare:async()=>!0,execute:n=>ns(n)},Qe={title:"セット",playType:"SpellTrapSet",spellSpeed:"Normal",executableCells:["Hand"],validate:is,prepare:async()=>!0,execute:(n,e,t)=>as(n,"Set",t)},li=(n=t=>t.length===1,e=t=>t.length>0)=>[{title:"シンクロ召喚（攻撃）",playType:"SpecialSummon",spellSpeed:"Normal",executableCells:["ExtraDeck"],validate:t=>si(t,n,e),prepare:(t,i,a)=>Ai(t,"Attack",i,a,n,e),execute:(t,i,a,r)=>oi(t,i,"Attack",a,r)},{title:"シンクロ召喚（守備）",playType:"SpecialSummon",spellSpeed:"Normal",executableCells:["ExtraDeck"],validate:t=>si(t,n,e),prepare:(t,i,a)=>Ai(t,"Defense",i,a,n,e),execute:(t,i,a,r)=>oi(t,i,"Defense",a,r)}],rs=["NormalSummon","SpecialSummon","ChangeBattlePosition","Battle","SpellTrapSet","SpellTrapActivate"],ss=["Card","Token","Avatar"],As=(n,e)=>{var a,r;const t=n.monsterCategories??[],i=e.monsterCategories??[];for(const s of bt.toReversed()){if(t.includes(s)&&!i.includes(s))return 1;if(!t.includes(s)&&i.includes(s))return-1}if(n.kind===e.kind){if(n.kind==="Monster"){const s=(((a=n.monsterCategories)==null?void 0:a.union(bt).length)??0)>0,l=(((r=e.monsterCategories)==null?void 0:r.union(bt).length)??0)>0;if(s!==l)return l?1:-1;if((n.link??0)!==(e.link??0))return(n.link??0)-(e.link??0);if((n.rank??0)!==(e.rank??0))return(n.rank??0)-(e.rank??0);if((n.level??0)!==(e.level??0))return(n.level??0)-(e.level??0);if((n.attack??0)!==(e.attack??0))return(n.attack??0)-(e.attack??0);if((n.defense??0)!==(e.defense??0))return(n.defense??0)-(e.defense??0)}return n.name.localeCompare(e.name)}for(const s of Rr.toReversed())if(n.kind===s)return-1;return n.name.localeCompare(e.name)},os=(n,e)=>As(n.origin,e.origin),ce=class ce{constructor(e,t,i,a,r,s,l,d,o){A(this,"seq");A(this,"origin");A(this,"entityType");A(this,"face");A(this,"isUnderControl");A(this,"_battlePosition");A(this,"orientation");A(this,"controller");A(this,"owner");A(this,"field");A(this,"fieldCell");A(this,"movedBy");A(this,"movedAs");A(this,"movedFrom");A(this,"movedAt");A(this,"isDying");A(this,"isVanished");A(this,"canReborn");A(this,"materials");A(this,"status");A(this,"actions",[]);A(this,"getIndexInCell",()=>{const e=this.fieldCell.cardEntities.indexOf(this);if(e<0)throw new tt("エンティティとセルの状態が矛盾している。",[this,this.fieldCell]);return e});A(this,"setBattlePosition",e=>{this._battlePosition=e,this.orientation=e==="Attack"?"Vertical":"Horizontal",this.face=e==="Set"?"FaceDown":"FaceUp",this.isUnderControl=!0});A(this,"setNonFieldPosition",(e,t)=>{this._battlePosition=void 0,this.orientation=e==="XysMaterial"?"Horizontal":"Vertical",this.face=e==="FaceUp"?"FaceUp":"FaceDown",this.isUnderControl=t});A(this,"summon",async(e,t,i,a,r)=>{const s={Attack:"AttackSummon",Defense:"DefenseSummon",Set:"SetSummon"};e.isAvailable&&(this.setBattlePosition(t),await this._moveTo(e,"Top",[i,s[t],...a],r),this.status.battlePotisionChangeCount=1)});A(this,"release",async(e,t)=>{await this.sendGraveyard([...e,"Release"],t)});A(this,"destroy",async(e,t,i)=>{await this.sendGraveyard([...t,e,"Destroy"],i)});A(this,"sendGraveyard",async(e,t)=>{this.setNonFieldPosition("FaceUp",!0);const i=this.owner.getGraveyard();await this._moveTo(i,"Top",e,t)});A(this,"setAsSpellTrap",async(e,t,i)=>{await this._moveTo(e,"Top",[...t,"SpellTrapSet"],i),this.setNonFieldPosition("Set",!0)});A(this,"activateSpellTrapFromHand",async(e,t,i)=>{this.setNonFieldPosition("FaceUp",!0),await this._moveTo(e,"Top",[...t,"SpellTrapActivate"],i),this.isDying=!0});A(this,"activateSpellTrapOnField",async()=>{this.setNonFieldPosition("FaceUp",!0),this.isDying=!0});A(this,"draw",async(e,t)=>{await this._moveTo(this.owner.getHandCell(),"Bottom",[...e,"Draw"],t),this.setNonFieldPosition("Set",!0)});A(this,"addToHand",async(e,t)=>{await this._moveTo(this.owner.getHandCell(),"Bottom",e,t),this.setNonFieldPosition("Set",!0)});A(this,"_moveTo",async(e,t,i,a)=>{if(this.field.duel.clock.turn>0&&await this.field.duel.view.waitAnimation({entity:this,to:e,index:t,count:0}),this.fieldCell.releaseEntities([this],i,a),this.entityType==="Token"&&this.fieldCell.cellType!=="MonsterZone"){this.field.duel.log.info(`${this.nm}は消滅した。`,a==null?void 0:a.controller);return}e.acceptEntities([this],t)});var m;this.seq=ce.nextEntitySeq++,this.owner=e,this.controller=t,this.field=i,this.fieldCell=a,this.entityType=r,this.origin=s,this.status={...JSON.parse(JSON.stringify(s)),canAttack:!0,isEffective:!0,canDirectAttack:!1,attackCount:0,isSelectableForAttack:!0,canBeSyncroMaterial:!0},this.face=l,this.isUnderControl=d,this.orientation=o,this.movedAs=["Rule"],this.movedAt=i.duel.clock,this.isDying=!1,this.isVanished=!1,this.canReborn=((m=this.origin.monsterCategories)==null?void 0:m.union(Ir).length)===0,this.materials=[],a.acceptEntities([this],"Top")}get nm(){return this.status.name}get atk(){return this.status.attack}get def(){return this.status.defense}get lvl(){return this.status.level}get rank(){return this.status.rank}get attr(){return this.status.attribute?[this.status.attribute]:[]}get type(){return this.status.type?[this.status.type]:[]}get psL(){return[this.status.pendulumScaleL]}get psR(){return[this.status.pendulumScaleR]}get battlePotion(){return this._battlePosition}};A(ce,"nextActionSeq",0),A(ce,"nextEntitySeq",0),A(ce,"actionDic",{}),A(ce,"createCardActionList",(e,t)=>{const i=t.map(a=>({seq:ce.nextActionSeq++,title:a.title,entity:e,playType:a.playType,spellSpeed:a.spellSpeed,executableCells:a.executableCells,validate:()=>a.validate(e),prepare:r=>a.prepare(e,r),execute:(r,s,l)=>a.execute(e,r,s,l)}));return i.forEach(a=>ce.actionDic[a.seq]=a),i}),A(ce,"createPlayerEntity",e=>{const t=e.getHandCell();return new ce(e,e,e.duel.field,t,"Duelist",{name:e.profile.name,kind:"Monster"},"FaceUp",!0,"Vertical")}),A(ce,"createCardEntity",(e,t,i)=>{var l;const a=i.monsterCategories&&i.monsterCategories.union(bt).length?t.getExtraDeck():t.getDeckCell(),r=new ce(t,t,e,a,"Card",i,"FaceDown",!1,"Vertical");Object.hasOwn(Pe,r.origin.name)||e.duel.log.info(`未実装カード${i.name}がデッキに投入された。`,t);const s=Pe[r.origin.name];return s.kind==="Monster"&&((l=s.monsterCategories)!=null&&l.includes("Normal"))?r.actions.push(...ce.createCardActionList(r,[na,ia,Ot,Ut])):r.actions.push(...ce.createCardActionList(r,ds.get(r.origin.name)||[])),r}),A(ce,"createDammyAction",(e,t,i,a)=>({seq:ce.nextActionSeq++,title:t,entity:e,playType:"Dammy",spellSpeed:"Dammy",executableCells:[e.fieldCell.cellType],validate:()=>i,prepare:async()=>{},execute:async()=>!1,pos:a,dragAndDropOnly:!0}));let At=ce;const ls=()=>{const n=[],e=p=>{const w=p.field.getMonstersOnField();if(w.length==0||w.some(y=>y.controller===p.controller))return;const f=p.controller.getEmptyMonsterZones();return f.length>0?f:void 0},t=async(p,w,f)=>{const y=p.controller.getEmptyMonsterZones();return await p.field.summon(p,[w],f?[f]:y,"SpecialSummon",["Rule"],p,void 0,!0),p.controller.specialSummonCount++,!0},i={name:"サイバー・ドラゴン",actions:[na,ia,Ot,Ut,{title:"特殊召喚（攻撃）",playType:"SpecialSummon",spellSpeed:"Normal",executableCells:["Hand"],validate:e,prepare:async()=>!0,execute:async(p,w,f)=>(await t(p,"Attack",f),!0)},{title:"特殊召喚（守備）",playType:"SpecialSummon",spellSpeed:"Normal",executableCells:["Hand"],validate:e,prepare:async()=>!0,execute:async(p,w,f)=>(await t(p,"Defense",f),!0)}]};n.push(i);const a={name:"大地の騎士ガイアナイト",actions:[Ot,Ut,...li()]};n.push(a),n.push({...a,name:"スクラップ・デスデーモン"});const r={name:"ナチュル・ガオドレイク",actions:[Ot,Ut,...li(p=>p.length===1&&p.every(w=>w.attr.some(f=>f==="Earth")),p=>p.length>0&&p.every(w=>w.attr.some(f=>f==="Earth")))]};n.push(r);const s={name:"強欲な壺",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:Ge,prepare:async(p,w)=>(p.isDying=!0,await Ye(p,void 0,w)),execute:async(p,w)=>(await p.field.draw(w,2,p),!0)},Qe]};n.push(s);const l={name:"天使の施し",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:Ge,prepare:async(p,w)=>(p.isDying=!0,await Ye(p,void 0,w)),execute:async(p,w)=>(await p.field.draw(p.controller,3,p),await p.field.discard(w,2,["Effect","Discard"],p),!0)},Qe]};n.push(l);const d={name:"成金ゴブリン",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:Ge,prepare:async(p,w)=>(p.isDying=!0,await Ye(p,void 0,w)),execute:async(p,w)=>(await p.field.draw(p.controller,1,p),p.field.duel.clock.incrementProcSeq(),w.getOpponentPlayer().heal(1e3,p),!0)},Qe]};n.push(d);const o={name:"おろかな埋葬",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:p=>Ge(p,w=>w.controller.getDeckCell().cardEntities.some(f=>f.status.kind==="Monster")),prepare:async(p,w)=>(p.isDying=!0,await Ye(p,void 0,w)),execute:async(p,w)=>{const f=w.getDeckCell().cardEntities.filter(h=>h.status.kind==="Monster");if(f.length===0)return!1;const y=await p.field.duel.view.waitSelectEntities(w,f,1,h=>h.length===1,"墓地に送るモンスターを選択",!1);for(const h of y??[])await p.field.sendGraveyardMany([h],["Effect"],p);return await w.shuffleDeck(),!0}},Qe]};n.push(o);const m={name:"死者蘇生",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],hasToTargetCards:!0,validate:p=>Ge(p,w=>w.field.getCells("Graveyard").flatMap(f=>f.cardEntities).filter(f=>f.origin.kind==="Monster"&&f.canReborn).length>0&&w.controller.getAvailableMonsterZones().length>0),prepare:async(p,w)=>{p.isDying=!0;const f=await p.field.duel.view.waitSelectEntities(p.controller,p.field.getCells("Graveyard").flatMap(y=>y.cardEntities).filter(y=>y.origin.kind==="Monster"&&y.canReborn),1,y=>y.length===1,"蘇生対象とするモンスターを選択",!1);return await Ye(p,void 0,w),f==null?void 0:f[0]},execute:async(p,w,f,y)=>{const h=w.getEmptyMonsterZones();return y.controller=w,await p.field.summon(y,["Attack","Defense"],h,"SpecialSummon",["Effect"],p,void 0,!1),p.controller.specialSummonCount++,!0}},Qe]};n.push(m);const u={name:"増援",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:p=>Ge(p,w=>w.controller.getDeckCell().cardEntities.filter(f=>f.status.kind==="Monster").filter(f=>f.status.type==="Warrior").filter(f=>f.status.level&&f.status.level<5).length>0),prepare:async(p,w)=>(p.isDying=!0,await Ye(p,void 0,w)),execute:async(p,w)=>{const f=w.getDeckCell().cardEntities.filter(h=>h.status.kind==="Monster").filter(h=>h.status.type==="Warrior").filter(h=>h.status.level&&h.status.level<5);if(f.length===0)return!1;const y=await p.field.duel.view.waitSelectEntities(w,f,1,h=>h.length===1,"手札に加えるモンスターを選択",!1);for(const h of y??[])await h.addToHand(["Effect"],p);return!0}},Qe]};n.push(u);const k={name:"Ｅ－エマージェンシーコール",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:p=>Ge(p,w=>w.controller.getDeckCell().cardEntities.filter(f=>f.status.kind==="Monster").some(f=>f.status.nameTags&&f.status.nameTags.includes("Ｅ・ＨＥＲＯ"))),prepare:async(p,w)=>(p.isDying=!0,await Ye(p,void 0,w)),execute:async(p,w)=>{const f=w.getDeckCell().cardEntities.filter(h=>h.status.kind==="Monster").filter(h=>h.status.nameTags&&h.status.nameTags.includes("Ｅ・ＨＥＲＯ"));if(f.length===0)return!1;const y=await p.field.duel.view.waitSelectEntities(w,f,1,h=>h.length===1,"手札に加えるモンスターを選択",!1);for(const h of y??[])await h.addToHand(["Effect"],p);return!0}},Qe]};n.push(k);const C={name:"光の援軍",actions:[{title:"発動",playType:"CardActivation",spellSpeed:"Normal",executableCells:["Hand","SpellAndTrapZone"],validate:p=>Ge(p,w=>w.controller.getDeckCell().cardEntities.filter(f=>f.status.kind==="Monster").filter(f=>(f.lvl??13)<5).some(f=>f.status.nameTags&&f.status.nameTags.includes("ライトロード"))&&w.controller.getDeckCell().cardEntities.length>3),prepare:async(p,w)=>{p.isDying=!0;const f=p.controller.getDeckCell();return Array(3).forEach(()=>f.cardEntities[0].sendGraveyard(["Cost"],p)),await Ye(p,void 0,w)},execute:async(p,w)=>{const f=w.getDeckCell().cardEntities.filter(h=>h.status.kind==="Monster").filter(h=>(h.lvl??13)<5).filter(h=>h.status.nameTags&&h.status.nameTags.includes("ライトロード"));if(f.length===0)return!1;const y=await p.field.duel.view.waitSelectEntities(w,f,1,h=>h.length===1,"手札に加えるモンスターを選択",!1);for(const h of y??[])await h.addToHand(["Effect"],p);return!0}},Qe]};return n.push(C),console.log(n),n},aa=new Map;ls().forEach(n=>{aa.set(n.name,n.actions)});const ds=aa,ps=qr,Pe=Object.values(ps).reduce((n,e)=>(n[e.name]=e,n),{}),ee=class ee{constructor(e,t){A(this,"id");A(this,"name");A(this,"description");A(this,"lastUsedAt");A(this,"cardNames");A(this,"getIllegalCardNames",()=>Array.from(new Set(this.cardNames.filter(e=>!Object.keys(Pe).includes(e)))));A(this,"getDisableCardNames",()=>Array.from(new Set(this.cardNames.filter(e=>!Object.keys(Pe).includes(e)))));A(this,"createCardInfos",()=>{const e=this.getIllegalCardNames();if(e.length>0)throw new Error(`存在しないカード名からデッキを生成しようとした。${e}`);return this.cardNames.map(t=>Pe==null?void 0:Pe[t]).filter(t=>t)});A(this,"copy",async()=>ee.createNewDeck(this.name,this.description,this.cardNames));A(this,"saveDeckInfo",async e=>{await ee.tblHeader.update(this.id,a=>({...a,name:e.name,description:e.description}));const t=(await ee.tblDetail.getAll()).filter(a=>a.deckId===this.id);await ee.tblDetail.delete(t.map(a=>a.id));const i=await ee.tblDetail.insertMany(e.cardNames.map((a,r)=>({deckId:this.id,seq:r,name:a,description:""})));return new ee(await ee.tblHeader.get(this.id),i)});A(this,"delete",async()=>{await ee.tblHeader.delete([this.id]);const e=(await ee.tblDetail.getAll()).filter(t=>t.deckId===this.id);await ee.tblDetail.delete(e.map(t=>t.id))});this.id=e.id,this.name=e.name,this.description=e.description,this.lastUsedAt=e.lastUsedAt,this.cardNames=t.filter(i=>i.deckId===this.id).map(i=>i.name)}};A(ee,"tblHeader"),A(ee,"tblDetail"),A(ee,"getAllDeckInfo",async e=>{ee.tblHeader||(ee.tblHeader=new ks(e)),ee.tblDetail||(ee.tblDetail=new cs(e));const t=await ee.tblHeader.getAll(),i=await ee.tblDetail.getAll();return t.length?t.map(a=>new ee(a,i)):[await ee.createNewDeck(jt[0].name,jt[0].description,jt[0].cardNames)]}),A(ee,"createNewDeck",async(e,t,i)=>{const a=await ee.tblHeader.insert({name:e,description:t,lastUsedAt:new Date}),r=await ee.tblDetail.insertMany(i.map((s,l)=>({deckId:a.id,seq:l,name:s,description:""})));return new ee(a,r)});let Nn=ee;class ks extends Un{constructor(t){super(t,"TblDeckHeader");A(this,"_prepareInitialRecords",()=>[])}}class cs extends Un{constructor(t){super(t,"TblDeckDetail");A(this,"_prepareInitialRecords",()=>[])}}let ms=-1,Mt=["おろかな埋葬","成金ゴブリン","強欲な壺","天使の施し","増援","死者蘇生","Ｅ－エマージェンシーコール","サイバー・ドラゴン","ナチュル・ガオドレイク","スクラップ・デスデーモン","大地の騎士ガイアナイト"];Mt=[...Mt,...Mt,...Mt,"アレキサンドライドラゴン","ジェネティック・ワーウルフ","機界騎士アヴラム","ジョングルグールの幻術師","ゾンビーノ","幻のグリフォン","フロストザウルス","エレキテルドラゴン","青眼の白龍","幻殻竜","しゃりの軍貫","チューン・ウォリアー","ライドロン","Ａ・マインド","ウォーター・スピリット","エンジェル・トランペッター","ガード・オブ・フレムベル","ギャラクシーサーペント","ジェネクス・コントローラー","スペース・オマジナイ・ウサギ","ハロハロ","ライブラの魔法秤","ラブラドライドラゴン","守護竜ユスティア","竜核の呪霊者","Ｅ・ＨＥＲＯ クレイマン","Ｅ・ＨＥＲＯ スパークマン","Ｅ・ＨＥＲＯ ネオス","Ｅ・ＨＥＲＯ バーストレディ","Ｅ・ＨＥＲＯ フェザーマン"];const jt=[{id:ms--,name:"サンプルデッキ１",description:"",lastUsedAt:new Date,cardNames:Mt}];function us(n){const e=n-1;return e*e*e+1}function di(n,e){for(const t in e)n[t]=e[t];return n}function hs({fallback:n,...e}){const t=new Map,i=new Map;function a(s,l,d){const{delay:o=0,duration:m=P=>Math.sqrt(P)*30,easing:u=us}=di(di({},e),d),k=s.getBoundingClientRect(),C=l.getBoundingClientRect(),p=k.left-C.left,w=k.top-C.top,f=k.width/C.width,y=k.height/C.height,h=Math.sqrt(p*p+w*w),v=getComputedStyle(l),M=v.transform==="none"?"":v.transform,T=+v.opacity;return{delay:o,duration:typeof m=="function"?m(h):m,easing:u,css:(P,_)=>`
			   opacity: ${P*T};
			   transform-origin: top left;
			   transform: ${M} translate(${_*p}px,${_*w}px) scale(${P+(1-P)*f}, ${P+(1-P)*y});
		   `}}function r(s,l,d){return(o,m)=>(s.set(m.key,o),()=>{if(l.has(m.key)){const u=l.get(m.key);return l.delete(m.key),a(u,o,m)}return s.delete(m.key),n&&n(o,m,d)})}return[r(i,t,!1),r(t,i,!0)]}var ws=N("<div>●</div>"),Cs=N('<div class="duel_card_row svelte-o0zs9s"><div class="svelte-o0zs9s"> </div> <div class="svelte-o0zs9s"> </div></div>'),fs=N('<div class="duel_card_row svelte-o0zs9s"><div class="svelte-o0zs9s"></div> <div class="svelte-o0zs9s"> </div></div>'),Ds=N('<div class="duel_card_row svelte-o0zs9s"><div class="svelte-o0zs9s"></div> <div class="svelte-o0zs9s"> </div></div>'),ys=N('<div class="duel_card_row svelte-o0zs9s"><div class="svelte-o0zs9s"> </div> <div class="svelte-o0zs9s"> </div></div>'),gs=N('<div class="duel_card_row svelte-o0zs9s"><div class="svelte-o0zs9s"> </div></div> <div class="duel_card_row duel_card_row_wide svelte-o0zs9s"><div class="svelte-o0zs9s"> </div> <div class="svelte-o0zs9s"> </div></div>',1),Bs=N('<button><div class="duel_card duel_card_face_up svelte-o0zs9s"><div class="duel_card_row svelte-o0zs9s" style="position:relative"><div class="svelte-o0zs9s"> </div> <!></div> <!> <!> <!></div></button>'),vs=N('<div class="duel_card duel_card_face_down svelte-o0zs9s"><div class="svelte-o0zs9s"></div></div>');function Oe(n,e){Fe(e,!1);let t=le(e,"entity",8),i=le(e,"state",8,"Disabled"),a=le(e,"selectedList",28,()=>[]),r=le(e,"isVisibleForcibly",8,!1),s=le(e,"isWideMode",8,!1),l=le(e,"actions",24,()=>[]),d=le(e,"cardActionResolve",8),o=le(e,"entitySelectResolve",8,()=>{}),m=ge(!1),u=()=>{},k=le(e,"qty",12,void 0);const C=b=>{U(m,!1),k(b.qty),u=b.resolve};t().field.duel.view.onWaitStart.append(C);let p=ge(!1);const w=()=>{if(i()!=="Disabled"&&(console.log(k()),i()==="Selectable"&&k()&&k()===1)){if(a().some(b=>b.seq!==t().seq)){a([t()]);return}k()&&k()===1&&o()&&o()([t()])}},f=()=>{(t().face==="FaceUp"||t().owner===t().field.duel.duelists.Below&&(t().isUnderControl||r()))&&t().field.duel.view.showCardInfo(t())},y=()=>{if(console.log(t(),i()),f(),i()==="Disabled")return;if(i()==="Selectable"){U(m,!c(m)),a(c(m)?[...a(),t()]:a().filter(H=>H!==t()));return}if(l().length===0)return;if(l().length===1){if(l()[0].dragAndDropOnly)return;if(d()){d()(l()[0]);return}console.log(l()[0],u),u({actionWIP:l()[0]});return}const b=t().field.duel.view;b.modalController.selectAction(b,{title:"行動を選択。",actions:l(),cancelable:!0}).then(H=>{u({actionWIP:H})})},h=b=>{console.info("drag start",b,l()),t().field.duel.view.setDraggingActions(l()),U(p,!0)},v=b=>{console.info("drag end",b,l()),t().field.duel.view.removeDraggingActions(),b.dataTransfer&&U(p,!1)};Ve();var M=se(),T=z(M);{var P=b=>{var H=Bs(),de=D(H),oe=D(de),R=D(oe),ae=D(R),pe=x(R,2);ve(pe,1,()=>t().attr,Be,(F,j)=>{var q=ws();$(()=>ue(q,`monster_attr ${c(j)??""} svelte-o0zs9s`)),g(F,q)});var B=x(oe,2);{var W=F=>{var j=Cs(),q=D(j),ie=D(q),re=x(q,2),V=D(re);$((Z,J)=>{S(ie,Z),S(V,J)},[()=>"★".repeat(t().status.level||0),()=>"☆".repeat(t().status.rank||0)],me),g(F,j)},I=F=>{var j=se(),q=z(j);{var ie=V=>{var Z=fs(),J=x(D(Z),2),O=D(J);$(()=>S(O,`${Vi[t().status.spellCategory]??""}魔法`)),g(V,Z)},re=V=>{var Z=se(),J=z(Z);{var O=ne=>{var G=Ds(),ke=x(D(G),2),Ee=D(ke);$(()=>S(Ee,`${Gi[t().status.trapCategory]??""}罠`)),g(ne,G)};K(J,ne=>{t().status.kind==="Trap"&&t().status.trapCategory&&ne(O)},!0)}g(V,Z)};K(q,V=>{t().status.kind==="Spell"&&t().status.spellCategory?V(ie):V(re,!1)},!0)}g(F,j)};K(B,F=>{t().status.kind==="Monster"?F(W):F(I,!1)})}var X=x(B,2);{var te=F=>{var j=ys(),q=D(j),ie=D(q),re=x(q,2),V=D(re);$(()=>{S(ie,`◀ ${t().psL??""}`),S(V,`${t().psR??""} ▶`)}),g(F,j)};K(X,F=>{var j;(j=t().status.monsterCategories)!=null&&j.includes("Pendulum")&&F(te)})}var E=x(X,2);{var L=F=>{var j=gs(),q=z(j),ie=D(q),re=D(ie),V=x(q,2),Z=D(V),J=D(Z),O=x(Z,2),ne=D(O);$((G,ke,Ee)=>{Nt(ie,"title",G),S(re,ke),S(J,Ee),S(ne,`${t().atk??"?"} / ${t().def??"?"}`)},[()=>{var G;return(G=t().status.monsterCategories)==null?void 0:G.join(" ")},()=>{var G;return(G=t().status.monsterCategories)==null?void 0:G.map(ke=>zi[ke]+(s()?$i[ke]:"")).join()},()=>t().type.map(G=>Qi[G]+(s()?Yi[G]:"")).join()],me),g(F,j)};K(E,F=>{t().status.kind==="Monster"&&F(L)})}$(F=>{ue(H,`duel_card button_style_reset ${t().status.kind??""} ${F??""} ${(c(m)?"duel_card_selected":"")??""} ${i()??""} duel_card_${t().orientation??""} ${(c(p)?"isDragging":"")??""} ${(s()?"duel_card_wide":"")??""} svelte-o0zs9s`),Nt(H,"draggable",i()==="Draggable"),Nt(H,"title",t().nm),S(ae,t().nm)},[()=>{var F;return((F=t().status.monsterCategories)==null?void 0:F.join(" "))||""}],me),Ke("dragstart",H,h),Ke("dragend",H,v),Ke("click",H,y),Ke("dblclick",H,w),Ke("mouseenter",H,f),g(b,H)},_=b=>{var H=vs();g(b,H)};K(T,b=>{t().face==="FaceUp"||r()||t().controller.seat==="Below"&&t().isUnderControl?b(P):b(_,!1)})}g(n,M),_e()}var Es=N('<div class="phase_display svelte-7h9wyq"><span class="svelte-7h9wyq"> </span> </div>'),Ts=N('<div class="lifepoint_display svelte-7h9wyq"><div class="svelte-7h9wyq"> </div> <div class="svelte-7h9wyq"> </div></div>'),xs=(n,e,t)=>e(c(t)),Ms=N('<div class="svelte-7h9wyq"><button class="phase_button svelte-7h9wyq"> </button></div>'),Ns=N("<div><!></div>"),bs=N('<div class="svelte-7h9wyq"><!></div>'),Fs=N("<div><!></div>"),_s=N("<!> <!> <!>",1),Hs=N('<div style="position: absolute;" class="card_animation_receiver svelte-7h9wyq"><!></div>'),Ks=N('<div style="position: absolute;" class="svelte-7h9wyq"><!></div>'),Ss=N('<div style="position: absolute; bottom:0rem" class="svelte-7h9wyq"> </div>'),Ws=N("<!> <!>",1),Ps=N('<div class="badge svelte-7h9wyq"> </div>'),Ls=N('<div class="card_animation_receiver svelte-7h9wyq"><!></div>'),qs=N("<!> <!> <!> <!>",1),Rs=N('<td><div role="listitem"><!></div></td>');function Is(n,e){Fe(e,!1);let t=le(e,"view",8),i=le(e,"row",8),a=le(e,"column",8),r=le(e,"selectedList",28,()=>[]),s=ge(t().getCell(i(),a()));const l=()=>{U(s,t().getCell(i(),a()))};c(s).onUpdate.append(l),t().onDuelUpdate.append(l),t().modalController.onUpdate.append(l);let d=ge([]),o=()=>{},m;const u=B=>{U(h,void 0),r().reset(),o=B.resolve,U(d,B.enableActions),m=B.selectableEntities,B.entitiesValidator};t().onWaitStart.append(u);let k,C=ge(!1);const p=B=>{k=B,U(C,B.some(W=>{var I;return(I=W.validate())==null?void 0:I.includes(c(s))})||!1),l()},w=()=>{k=void 0,U(C,!1),l()};t().onDragStart.append(p),t().onDragEnd.append(w);const[f,y]=yA;let h=ge(void 0);const v=B=>{if(c(s)===B.to||c(s).entities.includes(B.entity)){U(h,B);const W=B.resolve;U(s,c(s)),setTimeout(()=>{U(h,void 0),B.count++,B.count>1&&W()},600)}};t().onAnimation.append(v);const M=B=>{console.info(B),o({phaseChange:B})},T=()=>(c(s).cellType==="Deck"||c(s).cellType==="ExtraDeck"||c(s).cellType==="Graveyard"||c(s).cellType==="Banished")&&c(s).entities.flatMap(B=>B.actions).filter(B=>c(d).map(W=>W.seq).some(W=>W===B.seq)).length>0,P=()=>{if(cn(s,c(s).field.duel.view.infoBoardState="Log"),c(s).cellType==="Deck"||c(s).cellType==="ExtraDeck"||c(s).cellType==="Graveyard"||c(s).cellType==="Banished"){cn(s,c(s).field.duel.view.infoBoardState="CellInfo"),cn(s,c(s).field.duel.view.infoBoardCell=c(s)),c(s).field.duel.view.requireUpdate();const B=c(s).entities.flatMap(W=>W.actions).filter(W=>c(d).map(I=>I.seq).some(I=>I===W.seq));if(console.log(c(d)),console.log(B),B.length){const W=c(s).field.duel.view;W.modalController.selectAction(W,{title:"カードを選択。",actions:B,cancelable:!0}).then(I=>{o({actionWIP:I})});return}}c(s).field.duel.view.requireUpdate(),console.info(c(s))},_=B=>{B.preventDefault(),B.dataTransfer&&(B.dataTransfer.dropEffect="move")},b=B=>{B.preventDefault(),console.info("drop",B,c(C),k),B.dataTransfer&&(B.dataTransfer.dropEffect="move");try{c(C)&&k&&(console.info(k,c(s)),k.length===1?o({actionWIP:{...k[0],cell:c(s)}}):k.length>1&&(c(s).field.duel.view.modalController.cancelAll(),c(s).field.duel.view.modalController.selectAction(c(s).field.duel.view,{title:"選択",actions:k,cancelable:!1})))}finally{t().removeDraggingActions()}},H=(...B)=>{if(m&&m.find(X=>B.find(te=>X===te)))return"Selectable";if(!c(d)||c(d).length===0||t().waitMode!=="SelectFieldAction"||Object.values(t().modalController.states).some(X=>X==="Shown"))return"Disabled";const W=c(d).filter(X=>B.includes(X.entity));if(W.length===0)return"Disabled";if(W.length>1)return"Clickable";if(c(d)[0].playType==="RuleDraw")return"Draggable";if(["Deck","ExtraDeck","Graveyard","Banished"].includes(c(s).cellType)||W[0].entity!==B[0])return"Clickable";const I=W[0].validate();return I&&I.length>0?"Draggable":"Clickable"};Ve();var de=Rs(),oe=D(de);oe.__click=P;var R=D(oe);{var ae=B=>{var W=se(),I=z(W);{var X=te=>{var E=se(),L=z(E);{var F=q=>{var ie=Es(),re=D(ie),V=D(re),Z=x(re,1,!0);$((J,O)=>{S(V,J),S(Z,O)},[()=>String(c(s).field.duel.clock.turn).padStart(2,"0"),()=>c(s).field.duel.phase.toUpperCase()],me),g(q,ie)},j=q=>{var ie=se(),re=z(ie);{var V=J=>{var O=Ts(),ne=D(O),G=D(ne),ke=x(ne,2),Ee=D(ke);$(()=>{S(G,c(s).field.duel.duelists.Above.lp),S(Ee,c(s).field.duel.duelists.Below.lp)}),g(J,O)},Z=J=>{var O=se(),ne=z(O);{var G=ke=>{var Ee=se(),Ie=z(Ee);{var We=Te=>{var Tt=se(),ln=z(Tt);{var dn=at=>{var kt=se(),pn=z(kt);ve(pn,1,()=>t().duel.nextPhaseList,Be,(kn,Pt)=>{var ct=Ms(),jn=D(ct);jn.__click=[xs,M,Pt];var ra=D(jn);$(sa=>S(ra,sa),[()=>c(Pt).toUpperCase()],me),g(kn,ct)}),g(at,kt)};K(ln,at=>{t().duel.isEnded||at(dn)})}g(Te,Tt)};K(Ie,Te=>{t().waitMode==="SelectFieldAction"&&Te(We)})}g(ke,Ee)};K(ne,ke=>{c(s).column===5&&ke(G)},!0)}g(J,O)};K(re,J=>{c(s).column===3?J(V):J(Z,!1)},!0)}g(q,ie)};K(L,q=>{c(s).column===1?q(F):q(j,!1)})}g(te,E)};K(I,te=>{c(s).row===3&&te(X)})}g(B,W)},pe=B=>{var W=se(),I=z(W);{var X=E=>{var L=_s(),F=z(L);{var j=V=>{var Z=Ns(),J=D(Z);Oe(J,{get entity(){return c(h).entity},state:"Disabled",actions:[],cardActionResolve:void 0}),$(()=>ue(Z,`card_animation_receiver ${c(s).cellType??""} svelte-7h9wyq`)),ut(1,Z,()=>y,()=>({key:c(h).entity.seq})),g(V,Z)};K(F,V=>{c(h)&&c(h).entity&&c(h).to===c(s)&&c(h).index==="Top"&&V(j)})}var q=x(F,2);ve(q,1,()=>c(s).cardEntities,Be,(V,Z)=>{var J=se(),O=z(J);{var ne=G=>{var ke=bs(),Ee=D(ke);const Ie=me(()=>H(c(Z))),We=me(()=>c(d).filter(Te=>Te.entity===c(Z)));Oe(Ee,{get entity(){return c(Z)},get state(){return c(Ie)},get actions(){return c(We)},cardActionResolve:void 0,get selectedList(){return r()},set selectedList(Te){r(Te)},$$legacy:!0}),ut(2,ke,()=>f,()=>({key:c(Z).seq})),g(G,ke)};K(O,G=>{(!c(h)||c(h).entity.seq!==c(Z).seq)&&G(ne)})}g(V,J)});var ie=x(q,2);{var re=V=>{var Z=Fs(),J=D(Z);Oe(J,{get entity(){return c(h).entity},state:"Disabled",actions:[],cardActionResolve:void 0}),$(()=>ue(Z,`card_animation_receiver ${c(s).cellType??""} svelte-7h9wyq`)),ut(1,Z,()=>y,()=>({key:c(h).entity.seq})),g(V,Z)};K(ie,V=>{c(h)&&c(h).entity&&c(h).to===c(s)&&c(h).index==="Bottom"&&V(re)})}g(E,L)},te=E=>{var L=qs(),F=z(L);{var j=O=>{var ne=Hs(),G=D(ne);Oe(G,{get entity(){return c(h).entity},state:"Disabled",actions:[],cardActionResolve:void 0}),ut(1,ne,()=>y,()=>({key:c(h).entity.seq})),g(O,ne)};K(F,O=>{c(h)&&c(h).entity&&c(h).to===c(s)&&c(h).index==="Bottom"&&O(j)})}var q=x(F,2);{var ie=O=>{var ne=Ws(),G=z(ne);ve(G,1,()=>c(s).cardEntities,Be,(Ie,We,Te)=>{var Tt=se(),ln=z(Tt);{var dn=at=>{var kt=Ks(),pn=D(kt);const kn=me(()=>Te===0?H(...c(s).cardEntities):void 0),Pt=me(()=>Te===0?c(d).filter(ct=>c(s).cardEntities.includes(ct.entity)):void 0);Oe(pn,{get entity(){return c(We)},get state(){return c(kn)},get actions(){return c(Pt)},cardActionResolve:void 0,get selectedList(){return r()},set selectedList(ct){r(ct)},$$legacy:!0}),ut(2,kt,()=>f,()=>({key:c(We).seq})),g(at,kt)};K(ln,at=>{(!c(h)||c(h).entity.seq!==c(We).seq)&&at(dn)})}g(Ie,Tt)});var ke=x(G,2);{var Ee=Ie=>{var We=Ss(),Te=D(We);$(()=>S(Te,`【${(c(s).cardEntities[0].battlePotion==="Attack"?"攻撃表示":c(s).cardEntities[0].battlePotion==="Defense"?"表守備表示":"裏守備表示")??""}】`)),g(Ie,We)};K(ke,Ie=>{c(s).cardEntities[0].battlePotion&&Ie(Ee)})}g(O,ne)};K(q,O=>{c(s).cardEntities.length>0&&O(ie)})}var re=x(q,2);{var V=O=>{var ne=Ps(),G=D(ne);$(()=>S(G,c(s).cardEntities.length)),g(O,ne)};K(re,O=>{(c(s).cellType==="Deck"||c(s).cellType==="ExtraDeck"||c(s).cellType==="Graveyard"||c(s).cellType==="Banished")&&O(V)})}var Z=x(re,2);{var J=O=>{var ne=Ls(),G=D(ne);Oe(G,{get entity(){return c(h).entity},state:"Disabled",actions:[],cardActionResolve:void 0}),ut(1,ne,()=>y,()=>({key:c(h).entity.seq})),g(O,ne)};K(Z,O=>{c(h)&&c(h).entity&&c(h).to===c(s)&&c(h).index==="Top"&&O(J)})}g(E,L)};K(I,E=>{c(s).cellType==="Hand"?E(X):E(te,!1)},!0)}g(B,W)};K(R,B=>{c(s).cellType==="Disable"?B(ae):B(pe,!1)})}$(B=>{ue(de,`${`duel_field_cell duel_field_cell_${c(s).cellType}`??""} svelte-7h9wyq`),Nt(de,"colspan",c(s).cellType==="Hand"?7:1),ue(oe,`${B??""} svelte-7h9wyq`)},[()=>`duel_card_wrapper ${c(s).cellType} ${c(C)?"can_accept_drop":""} ${T()?"can_action":""}`],me),Ke("dragover",oe,B=>_(B)),Ke("drop",oe,B=>b(B)),g(n,de),_e()}On(["click"]);var Zs=N('<tr><td style=" white-space: nowrap;text-align: center;"> </td><td class="svelte-11jjmb6"> </td></tr>'),Os=N('<div class="duel_log svelte-11jjmb6"><table><tbody></tbody></table></div>');function Us(n,e){var d,o;Fe(e,!1);let t=ge(void 0),i=le(e,"log",12);const a=()=>{i(i()),Ar().then(()=>c(t)&&c(t).scroll(0,c(t).clientHeight*10))};(o=(d=i())==null?void 0:d.onUpdate)==null||o.append(a),Ve();var r=Os(),s=D(r),l=D(s);ve(l,5,()=>i().records,Be,(m,u)=>{var k=Zs(),C=D(k),p=D(C),w=x(C),f=D(w);$(()=>{var y,h;ue(C,`duelist ${((y=c(u).duelist)==null?void 0:y.seat)??""} svelte-11jjmb6`),S(p,((h=c(u).duelist)==null?void 0:h.profile.name)||"SYSTEM"),S(f,c(u).text)}),g(m,k)}),Fr(r,m=>U(t,m),()=>c(t)),g(n,r),_e()}const js=n=>new Promise(e=>setTimeout(e,n));var $s=N('<div><div class="duelist_name svelte-10e7p9n"> </div> <div> </div></div>');function pi(n,e){Fe(e,!1);let t=le(e,"duelist",12),i=ge(0),a=ge();const r=async()=>{const k=t().lp-c(i);if(!c(a)||Math.abs(k)<10){U(i,t().lp),c(a)&&(c(a)(),U(a,void 0));return}U(i,c(i)+Math.floor(Math.random()*k)),await js(100),r()},s=()=>{t(t()),!c(a)&&t().lp!==c(i)&&new Promise(k=>{U(a,k),Math.abs(t().lp-c(i)),r()})};t().duel.log.onUpdate.append(s),r(),Ve();var l=$s(),d=D(l),o=D(d),m=x(d,2),u=D(m);$(()=>{ue(l,`duelist ${t().seat??""} svelte-10e7p9n`),S(o,t().profile.name),ue(m,`duelist_lp ${(c(a)?"vibration":"")??""} svelte-10e7p9n`),S(u,c(i))}),g(n,l),_e()}const zs=()=>{};var Vs=N("<div><!></div>"),Gs=(n,e,t)=>e.resolve(c(t)),Ys=(n,e)=>e.resolve(void 0),Qs=N("<button>Cancel</button>"),Xs=N('<div class="base svelte-498z68"><button class="overlay svelte-498z68">★</button> <div class="window svelte-498z68"><div> </div> <div class="entities_list svelte-498z68"></div> <div><button>OK</button> <!></div></div></div>');function Js(n,e){Fe(e,!0);let t=Za(Je([]));var i=se(),a=z(i);{var r=s=>{var l=Xs(),d=D(l);d.__click=[zs];var o=x(d,2),m=D(o),u=D(m),k=x(m,2);ve(k,21,()=>e.entities,Be,(y,h)=>{var v=Vs(),M=D(v);Oe(M,{get entity(){return c(h)},isVisibleForcibly:!0,state:"Selectable",entitySelectResolve:T=>e.resolve(T),get qty(){return e.qty},get selectedList(){return c(t)},set selectedList(T){U(t,Je(T))}}),g(y,v)});var C=x(k,2),p=D(C);p.__click=[Gs,e,t];var w=x(p,2);{var f=y=>{var h=Qs();h.__click=[Ys,e],g(y,h)};K(w,y=>{e.cancelable&&y(f)})}$(y=>{S(u,e.title),p.disabled=y},[()=>!e.validator(c(t))]),g(s,l)};K(a,s=>{s(r)})}g(n,i),_e()}On(["click"]);const eA=(n,e)=>{e.cancelable&&e.resolve(void 0)};var tA=N('<div class="duel_card_wrapper svelte-1wsrcc5"><!> <div> </div></div>'),nA=(n,e)=>e.resolve(),iA=N("<div><button>Cancel</button></div>"),aA=N('<div><button>★</button> <div><div> </div> <div class="flex svelte-1wsrcc5"></div> <!></div></div>');function rA(n,e){Fe(e,!0);const[t,i]=Sr(),a=()=>Kr(r,"$isDragging",t);let r=_r(!1);const s=()=>r.set(!0),l=()=>r.set(!1);e.view.onDragStart.append(s),e.view.onDragEnd.append(l);const d=k=>{const C=k.validate();return C&&C.length>0?"Draggable":"Clickable"};var o=se(),m=z(o);{var u=k=>{var C=aA(),p=D(C);p.__click=[eA,e];var w=x(p,2),f=D(w),y=D(f),h=x(f,2);ve(h,21,()=>e.actions,Be,(T,P)=>{var _=tA(),b=D(_);const H=dt(()=>d(c(P))),de=dt(()=>e.dragAndDropOnly?[]:[c(P)]);Oe(b,{get entity(){return c(P).entity},isVisibleForcibly:!0,get state(){return c(H)},get actions(){return c(de)},get cardActionResolve(){return e.resolve}});var oe=x(b,2),R=D(oe);$(()=>S(R,`«${c(P).title??""}»`)),g(T,_)});var v=x(h,2);{var M=T=>{var P=iA(),_=D(P);_.__click=[nA,e],g(T,P)};K(v,T=>{e.cancelable&&T(M)})}$(()=>{ue(C,`${`base ${a()?"minimum_mode":""}`??""} svelte-1wsrcc5`),ue(p,`${`overlay ${a()?"minimum_mode":""}`??""} svelte-1wsrcc5`),ue(w,`${`window ${a()?"minimum_mode":""}`??""} svelte-1wsrcc5`),S(y,e.title)}),g(k,C)};K(m,k=>{k(u)})}g(n,o),_e(),i()}On(["click"]);var sA=N('<div class="base svelte-1y912d"><!> <!></div>');function AA(n,e){var o,m;Fe(e,!1);let t=le(e,"modalController",12);const i=()=>{t(t())};(m=(o=t())==null?void 0:o.onUpdate)==null||m.append(i),Ve();var a=sA(),r=D(a);{var s=u=>{Js(u,{get title(){return t().duelEntitiesSelectorArg.title},get entities(){return t().duelEntitiesSelectorArg.entities},get validator(){return t().duelEntitiesSelectorArg.validator},get qty(){return t().duelEntitiesSelectorArg.qty},get cancelable(){return t().duelEntitiesSelectorArg.cancelable},resolve:k=>{t().duelEntitiesSelectorResolve(k)}})};K(r,u=>{t().states.DuelEntitiesSelector==="Shown"&&u(s)})}var l=x(r,2);{var d=u=>{const k=me(()=>t().cardActionSelectorArg.dragAndDropOnly??!1);rA(u,{get view(){return t().view},get title(){return t().cardActionSelectorArg.title},get actions(){return t().cardActionSelectorArg.actions},get dragAndDropOnly(){return c(k)},get cancelable(){return t().cardActionSelectorArg.cancelable},resolve:C=>{console.info(C),t().cardActionSelectorResolve(C)}})};K(l,u=>{t().states.DuelActionSelector==="Shown"&&u(d)})}g(n,a),_e()}var oA=N('<div class="duel_card_info_row svelte-15yv286"><div class="svelte-15yv286"><pre class="description svelte-15yv286"> </pre></div></div> <div class="duel_card_info_row svelte-15yv286" style=" justify-content: space-between;"><div class="svelte-15yv286"> </div> <div class="svelte-15yv286"> </div></div>',1),lA=N('<div></div> <div class="svelte-15yv286"> </div>',1),dA=N("<div> </div>"),pA=N("<div> </div>"),kA=N('<div class="duel_card_info_row svelte-15yv286"><!> <!></div> <div class="duel_card_info_row svelte-15yv286"></div>',1),cA=N('<div class="duel_card_row svelte-15yv286"><div class="svelte-15yv286"></div> <div class="svelte-15yv286"> </div></div>'),mA=N('<div class="duel_card_row svelte-15yv286"><div class="svelte-15yv286"></div> <div class="svelte-15yv286"> </div></div>'),uA=N('<div><div class="duel_card_info_row svelte-15yv286" style="position:relative"><div class="svelte-15yv286"> </div></div> <div class="duel_card_info_row svelte-15yv286"><div class="svelte-15yv286"> </div> <div class="svelte-15yv286"> </div></div> <!> <!> <div class="duel_card_info_row svelte-15yv286"><div class="svelte-15yv286"><pre class="description svelte-15yv286"> </pre></div></div> <div class="duel_card_info_links svelte-15yv286"><a title="遊戯王カードWiki" class="svelte-15yv286">⇒遊戯王カードWiki</a></div></div>');function hA(n,e){Fe(e,!1);let t=le(e,"entity",8,void 0);const i=()=>t()?Pe[t().origin.name]:void 0;Ve();var a=se(),r=z(a);{var s=l=>{var d=uA(),o=D(d),m=D(o),u=D(m),k=x(o,2),C=D(k),p=D(C),w=x(C,2),f=D(w),y=x(k,2);{var h=R=>{var ae=oA(),pe=z(ae),B=D(pe),W=D(B),I=D(W),X=x(pe,2),te=D(X),E=D(te),L=x(te,2),F=D(L);$(()=>{S(I,Pe[t().origin.name].pendulumDescription),S(E,`◀ ${t().psL??""}`),S(F,`${t().psR??""} ▶`)}),g(R,ae)};K(y,R=>{var ae;(ae=t().status.monsterCategories)!=null&&ae.includes("Pendulum")&&R(h)})}var v=x(y,2);{var M=R=>{var ae=kA(),pe=z(ae),B=D(pe);ve(B,1,()=>t().attr,Be,(te,E)=>{var L=lA(),F=z(L),j=x(F,2),q=D(j);$(()=>{ue(F,`monster_attr ${c(E)??""} svelte-15yv286`),S(q,`${Zr[c(E)]??""}属性`)}),g(te,L)});var W=x(B,2);{var I=te=>{var E=dA(),L=D(E);$(()=>{ue(E,`monster_cat ${t().status.type??""} svelte-15yv286`),S(L,`${Qi[t().status.type]??""}${Yi[t().status.type]??""}族`)}),g(te,E)};K(W,te=>{t().status.type&&te(I)})}var X=x(pe,2);ve(X,5,()=>t().status.monsterCategories??[],Be,(te,E)=>{var L=pA(),F=D(L);$(()=>{ue(L,`monster_cat ${c(E)??""} svelte-15yv286`),S(F,`${zi[c(E)]??""}${$i[c(E)]??""}`)}),g(te,L)}),g(R,ae)},T=R=>{var ae=se(),pe=z(ae);{var B=I=>{var X=cA(),te=x(D(X),2),E=D(te);$(()=>S(E,`${Vi[t().status.spellCategory]??""}魔法`)),g(I,X)},W=I=>{var X=se(),te=z(X);{var E=L=>{var F=mA(),j=x(D(F),2),q=D(j);$(()=>S(q,`${Gi[t().status.trapCategory]??""}罠`)),g(L,F)};K(te,L=>{t().status.kind==="Trap"&&t().status.trapCategory&&L(E)},!0)}g(I,X)};K(pe,I=>{t().status.kind==="Spell"&&t().status.spellCategory?I(B):I(W,!1)},!0)}g(R,ae)};K(v,R=>{t().status.kind==="Monster"?R(M):R(T,!1)})}var P=x(v,2),_=D(P),b=D(_),H=D(b),de=x(P,2),oe=D(de);$((R,ae,pe,B,W)=>{ue(d,`duel_card_info ${t().origin.kind??""} ${R??""} svelte-15yv286`),S(u,t().nm),S(p,ae),S(f,pe),S(H,B),Nt(oe,"href",W)},[()=>{var R;return(R=t().origin.monsterCategories)==null?void 0:R.join(" ")},()=>"★".repeat(t().status.level||0),()=>"☆".repeat(t().status.rank||0),()=>{var R;return(R=i())==null?void 0:R.description},()=>{var R;return(R=i())==null?void 0:R.wikiHref}],me),g(l,d)};K(r,l=>{t()&&l(s)})}g(n,a),_e()}var wA=N('<div class="duel_field_cell_info_item svelte-1xj7qf1"><!></div>'),CA=N('<div class="duel_field_cell_info_box svelte-1xj7qf1"><div class="duel_field_cell_info_label svelte-1xj7qf1"> </div> <!></div>'),fA=N('<div class="duel_field_cell_info svelte-1xj7qf1"><div class="duel_field_cell_info_header item_btn svelte-1xj7qf1"><div class="svelte-1xj7qf1"> </div> <div class="svelte-1xj7qf1"> </div></div> <div class="duel_field_cell_info_body svelte-1xj7qf1"></div></div>');function DA(n,e){Fe(e,!1);let t=le(e,"cell",12);const i=()=>{t(t())},a=k=>t().cardEntities.filter(C=>C.face===k);t().field.duel.view.onDuelUpdate.append(i),Ve();var r=fA(),s=D(r),l=D(s),d=D(l),o=x(l,2),m=D(o),u=x(s,2);ve(u,4,()=>["FaceUp","FaceDown"],Be,(k,C)=>{var p=se(),w=z(p);{var f=y=>{var h=CA(),v=D(h),M=D(v),T=x(v,2);ve(T,1,()=>a(C).toSorted(os),Be,(P,_)=>{var b=wA(),H=D(b);const de=me(()=>t().owner===t().field.duel.duelists.Below);Oe(H,{get entity(){return c(_)},get isVisibleForcibly(){return c(de)},isWideMode:!0}),g(P,b)}),$(()=>S(M,C==="FaceUp"?"表向き":"裏向き")),g(y,h)};K(w,y=>{a(C).length&&y(f)})}g(k,p)}),$(()=>{var k;S(d,(k=t().owner)==null?void 0:k.profile.name),S(m,t().cellType)}),g(n,r),_e()}const yA=hs({duration:400});var gA=N('<div class="duel_field_header_message svelte-13y6hd0"> </div> <div class="duel_field_header_buttons svelte-13y6hd0"><button class="svelte-13y6hd0">サレンダー</button></div>',1),BA=N("<tr></tr>"),vA=N('<table class="duel_field svelte-13y6hd0"><tbody class="svelte-13y6hd0"></tbody></table>'),EA=N('<button class="svelte-13y6hd0">OK</button>'),TA=N('<div style="position:absolute;right:0;top:0"> </div> <div class="flex duel_desk svelte-13y6hd0"><div class="duel_desk_left v_flex svelte-13y6hd0"><!> <!> <!></div> <div class=" duel_desk_center v_flex svelte-13y6hd0"><div class="duel_field_header svelte-13y6hd0"><!></div> <div class="svelte-13y6hd0"><!></div> <div class="duel_field_footer svelte-13y6hd0"><!></div></div> <div class=" duel_desk_right svelte-13y6hd0" style="text-align: left;"><!></div></div> <!>',1);function xA(n,e){Fe(e,!1);let t=le(e,"duel",12),i=()=>{},a=ge(()=>!0),r=ge();const s=E=>{i=E.resolve,U(a,E.entitiesValidator),U(r,E.selectableEntities),E.duelEntitiesSelectorArg&&t().view.modalController.selectDuelEntities(E.duelEntitiesSelectorArg).then(L=>{i({selectedEntities:L})})};t().view.onWaitStart.append(s);let l=ge(void 0);const d=E=>{U(l,E)};t().view.onShowCardEntity.append(d);let o=le(e,"selectedList",28,()=>[]);const m=()=>{t(t())};t().view.onDuelUpdate.append(m);const u=()=>{c(a)(o())&&i({selectedEntities:o()})},k=()=>{i({surrender:!0})};t().main(),Ve();var C=TA(),p=z(C),w=D(p),f=x(p,2),y=D(f),h=D(y);pi(h,{get duelist(){return t().duelists.Above}});var v=x(h,2);hA(v,{get entity(){return c(l)}});var M=x(v,2);pi(M,{get duelist(){return t().duelists.Below}});var T=x(y,2),P=D(T),_=D(P);{var b=E=>{var L=gA(),F=z(L),j=D(F),q=x(F,2),ie=D(q);$(()=>S(j,`[TURN:${t().clock.turn}][PHASE:${t().phase}] ${t().view.message}`)),Ke("click",ie,k),g(E,L)};K(_,E=>{t().isEnded||E(b)})}var H=x(P,2),de=D(H);{var oe=E=>{var L=vA(),F=D(L);ve(F,5,()=>t().field.cells,Be,(j,q,ie)=>{var re=BA();ue(re,`${`duel_desk_row_${ie}`??""} svelte-13y6hd0`),ve(re,5,()=>c(q),Be,(V,Z,J)=>{Is(V,{get view(){return t().view},row:ie,column:J,get selectedList(){return o()},set selectedList(O){o(O)},$$legacy:!0})}),g(j,re)}),g(E,L)};K(de,E=>{t().clock.turn>0&&E(oe)})}var R=x(H,2),ae=D(R);{var pe=E=>{var L=EA();$(F=>L.disabled=F,[()=>!c(a)(o())],me),Ke("click",L,u),g(E,L)};K(ae,E=>{c(r)&&c(r).length>0&&E(pe)})}var B=x(T,2),W=D(B);{var I=E=>{Us(E,{get log(){return t().log}})},X=E=>{var L=se(),F=z(L);{var j=q=>{DA(q,{get cell(){return t().view.infoBoardCell}})};K(F,q=>{t().view.infoBoardState==="CellInfo"&&q(j)},!0)}g(E,L)};K(W,E=>{t().view.infoBoardState==="Log"?E(I):E(X,!1)})}var te=x(f,2);AA(te,{get modalController(){return t().view.modalController}}),$(E=>S(w,E),[()=>t().clock.toString()],me),g(n,C),_e()}const MA=["TblDeckHeader","TblDeckDetail","TblDuelistProfile"],NA=3;var bA=N('<div class="svelte-irn2ek"><label for="duelist_name" class="duelist_name svelte-irn2ek">名前：</label> <input id="duelist_name" class="duelist_name svelte-irn2ek" type="text"></div> <div class="svelte-irn2ek"><button class="btn svelte-irn2ek">duel start!</button></div>',1),FA=N('<div class="svelte-irn2ek">デュエリスト情報の読み込み、もしくは作成中...</div>'),_A=N('<div class="app_body svelte-irn2ek"><!></div>'),HA=N('<main class="svelte-irn2ek"><!> <div class="screen_info svelte-irn2ek"></div></main>');function KA(n,e){Fe(e,!1);const t=new Lr("stk_ygo_svelte",NA,MA);let i=ge();const a=xn.getOrCreateNew(t),r=Nn.getAllDeckInfo(t),s=async()=>{U(i,new Xr(await a,"Player",(await r)[0],jr[0],"NPC",jt[0]))};Ve();var l=HA(),d=D(l);{var o=u=>{xA(u,{get duel(){return c(i)}})},m=u=>{var k=se(),C=z(k);{var p=w=>{var f=_A(),y=D(f);fr(y,()=>a,h=>{var v=FA();g(h,v)},(h,v)=>{var M=bA(),T=z(M),P=x(D(T),2),_=x(T,2),b=D(_);br(P,()=>c(v).name,H=>c(v).name=H),Ke("keypress",P,H=>console.log(H,c(v).name)),Ke("click",b,s),g(h,M)}),g(w,f)};K(C,w=>{w(p,!1)},!0)}g(u,k)};K(d,u=>{c(i)?u(o):u(m,!1)})}g(n,l),_e()}hr(KA,{target:document.getElementById("app")});
