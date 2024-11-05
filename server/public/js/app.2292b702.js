(function(){var e={8951:function(e,t,n){"use strict";var o=n(5130),a=n(6768);function r(e,t){const n=(0,a.g2)("router-view");return(0,a.uX)(),(0,a.Wv)(n)}var s=n(1241);const l={},i=(0,s.A)(l,[["render",r]]);var u=i,d=n(1387),c=(n(4114),n(144)),p=n(4373),f=n(1219);const h={class:"body-bg"},m={class:"formContainer"};var g={__name:"Login",setup(e){const t=(0,c.Kh)({username:"",password:""}),n=(0,c.KR)(),o=(0,c.Kh)({username:[{required:!0,message:"Please enter your username",trigger:"blur"}],password:[{required:!0,message:"Please enter your password",trigger:"blur"}]}),r=(0,d.rd)(),s=()=>{n.value.validate((e=>{e&&(console.log(t),p.A.post("/adminapi/user/login",t).then((e=>{console.log(e.data),"OK"===e.data.ActionType?(localStorage.setItem("token",e.data.token),r.push("/habitai")):f.nk.error("Incorrect username or password!")})))}))};return(e,r)=>{const l=(0,a.g2)("el-input"),i=(0,a.g2)("el-form-item"),u=(0,a.g2)("el-button"),d=(0,a.g2)("el-form");return(0,a.uX)(),(0,a.CE)("div",h,[(0,a.Lk)("div",m,[(0,a.bF)(d,{ref_key:"loginFormRef",ref:n,model:t,"status-icon":"",rules:o,"label-width":"120px",class:"demo-ruleForm"},{default:(0,a.k6)((()=>[(0,a.bF)(i,{label:"user name",prop:"username"},{default:(0,a.k6)((()=>[(0,a.bF)(l,{modelValue:t.username,"onUpdate:modelValue":r[0]||(r[0]=e=>t.username=e),autocomplete:"off"},null,8,["modelValue"])])),_:1}),(0,a.bF)(i,{label:"password",prop:"password"},{default:(0,a.k6)((()=>[(0,a.bF)(l,{modelValue:t.password,"onUpdate:modelValue":r[1]||(r[1]=e=>t.password=e),type:"password",autocomplete:"off"},null,8,["modelValue"])])),_:1}),(0,a.bF)(i,null,{default:(0,a.k6)((()=>[(0,a.bF)(u,{type:"primary",onClick:r[2]||(r[2]=t=>s(e.ruleFormRef))},{default:(0,a.k6)((()=>[(0,a.eW)(" Login ")])),_:1})])),_:1})])),_:1},8,["model","rules"])])])}}};const b=(0,s.A)(g,[["__scopeId","data-v-2789bf4b"]]);var v=b,k=n(4232),_=n(782);const y=e=>((0,a.Qi)("data-v-121625ad"),e=e(),(0,a.jt)(),e),w={class:"header-content"},S=y((()=>(0,a.Lk)("div",{class:"router-name"},"Header",-1))),F={class:"user-name"};var x={__name:"TopHeader",setup(e){(0,_.Pj)();const t=(0,d.rd)(),n=(0,c.KR)("");return(0,a.sV)((()=>{p.A.get("/adminapi/user/info",{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}}).then((e=>{401===e.data.code?(t.push("/login"),localStorage.removeItem("token")):e.data&&e.data.UserName?n.value=e.data.UserName:f.nk.error("Get User Info Error!")}))})),(e,t)=>{const o=(0,a.g2)("el-header");return(0,a.uX)(),(0,a.Wv)(o,null,{content:(0,a.k6)((()=>[(0,a.Lk)("div",w,[S,(0,a.Lk)("div",F,(0,k.v_)(n.value),1)])])),_:1})}}};const W=(0,s.A)(x,[["__scopeId","data-v-121625ad"]]);var I=W,C=(0,_.y$)({state:{is_get_router:!1,is_collapsed:!0},getters:{},mutations:{changeGetRouter(e,t){e.is_get_router=t},changeCollapsed(e){e.is_collapsed=!e.is_collapsed}},actions:{},modules:{}}),R=n(7477);const O=e=>((0,a.Qi)("data-v-3baf3188"),e=e(),(0,a.jt)(),e),$=O((()=>(0,a.Lk)("span",null,"HabitAI",-1))),A=O((()=>(0,a.Lk)("span",null,"My Habits",-1))),L=O((()=>(0,a.Lk)("span",null,"User Center",-1)));var M={__name:"SideMenu",setup(e){return(e,t)=>{const n=(0,a.g2)("el-icon"),o=(0,a.g2)("el-menu-item"),r=(0,a.g2)("el-sub-menu"),s=(0,a.g2)("el-menu"),l=(0,a.g2)("el-aside");return(0,a.uX)(),(0,a.Wv)(l,null,{default:(0,a.k6)((()=>[(0,a.bF)(s,{router:!0},{default:(0,a.k6)((()=>[(0,a.bF)(o,{index:"/habitai"},{default:(0,a.k6)((()=>[(0,a.bF)(n,null,{default:(0,a.k6)((()=>[(0,a.bF)((0,c.R1)(R.YYl))])),_:1}),$])),_:1}),(0,a.bF)(r,{index:"2"},{title:(0,a.k6)((()=>[(0,a.bF)(n,null,{default:(0,a.k6)((()=>[(0,a.bF)((0,c.R1)(R.B8B))])),_:1}),A])),default:(0,a.k6)((()=>[(0,a.bF)(o,{index:"2-1"},{default:(0,a.k6)((()=>[(0,a.eW)("manage")])),_:1}),(0,a.bF)(o,{index:"2-2"},{default:(0,a.k6)((()=>[(0,a.eW)("record")])),_:1})])),_:1}),(0,a.bF)(o,{index:"/center"},{default:(0,a.k6)((()=>[(0,a.bF)(n,null,{default:(0,a.k6)((()=>[(0,a.bF)((0,c.R1)(R.euF))])),_:1}),L])),_:1})])),_:1})])),_:1})}}};const j=(0,s.A)(M,[["__scopeId","data-v-3baf3188"]]);var E=j;const T=(0,a.Lk)("div",{class:"color-box"},null,-1);var z={__name:"MainBox",setup(e){return(e,t)=>{const n=(0,a.g2)("router-view"),o=(0,a.g2)("el-main"),r=(0,a.g2)("el-container");return(0,a.uX)(),(0,a.Wv)(r,null,{default:(0,a.k6)((()=>[(0,a.bF)(E),T,(0,a.bF)(r,{direction:"vertical"},{default:(0,a.k6)((()=>[(0,a.bF)(I),(0,a.bF)(o,null,{default:(0,a.k6)((()=>[(0,a.bF)(n)])),_:1})])),_:1})])),_:1})}}};const q=z;var P=q;function U(e,t){const n=(0,a.g2)("el-empty");return(0,a.uX)(),(0,a.Wv)(n,{description:"404 not found"})}const X={},H=(0,s.A)(X,[["render",U]]);var N=H;const V={style:{"margin-top":"30px","padding-left":"10px","padding-right":"10px"}},B={style:{color:"green"}},K={style:{color:"red"}};function G(e,t,n,r,s,l){const i=(0,a.g2)("el-button"),u=(0,a.g2)("el-col"),d=(0,a.g2)("el-row");return(0,a.uX)(),(0,a.CE)("div",V,[(0,a.bF)(d,{gutter:20},{default:(0,a.k6)((()=>[(0,a.bo)((0,a.Lk)("input",{style:{"margin-left":"20px"},type:"textarea",placeholder:"请输入内容","onUpdate:modelValue":t[0]||(t[0]=e=>s.userInput=e),maxlength:"500","show-word-limit":"",autosize:{minRows:2},resize:"none"},null,512),[[o.Jo,s.userInput]]),(0,a.bF)(u,{span:8},{default:(0,a.k6)((()=>[(0,a.bF)(i,{onClick:l.start,type:"primary",style:{"margin-left":"10px",width:"50%"},loading:s.loading},{default:(0,a.k6)((()=>[(0,a.eW)((0,k.v_)(s.loading?"ai在拼命思考啦":"提问"),1)])),_:1},8,["onClick","loading"])])),_:1})])),_:1}),(0,a.Lk)("div",null,[((0,a.uX)(!0),(0,a.CE)(a.FK,null,(0,a.pI)(s.finalChat,(e=>((0,a.uX)(),(0,a.CE)("div",null,[(0,a.Lk)("p",B,"我:"+(0,k.v_)(e.user),1),(0,a.Lk)("p",K,"habitAI:"+(0,k.v_)(e.ai),1)])))),256))])])}n(4979);var Y=n(3169),J=n.n(Y),Z={data(){return{appId:"ea8bdbb5",status:"init",ttsWS:null,totalRes:"",userInput:"",aiContentRequest:"",finalChat:[],loading:!1}},methods:{getWebsocketUrl(){return new Promise(((e,t)=>{const n="2e005a1a5d7edf6feb15f7191111cb99",o="YzMzZTI1YmNkNzYzMjMxMzBkZmZiNjE2",a="wss://spark-api.xf-yun.com/v3.5/chat",r=window.location.host,s=(new Date).toGMTString(),l="hmac-sha256",i="host date request-line",u=`host: ${r}\ndate: ${s}\nGET /v3.5/chat HTTP/1.1`,d=J().HmacSHA256(u,o),c=J().enc.Base64.stringify(d),p=`api_key="${n}", algorithm="${l}", headers="${i}", signature="${c}"`,f=window.btoa(p),h=`${a}?authorization=${f}&date=${s}&host=${r}`;console.log(h),e(h)}))},setStatus(e){this.status=e},connectWebSocket(){this.setStatus("ttsing"),this.getWebsocketUrl().then((e=>{let t;if("WebSocket"in window)t=new WebSocket(e);else{if(!("MozWebSocket"in window))return void alert("浏览器不支持WebSocket");t=new MozWebSocket(e)}this.ttsWS=t,t.onopen=e=>{this.webSocketSend()},t.onmessage=e=>{this.result(e.data)},t.onerror=t=>{clearTimeout(this.playTimeout),this.setStatus("error"),alert("WebSocket报错，请f12查看详情"),console.error(`详情查看：${encodeURI(e.replace("wss:","https:"))}`)},t.onclose=e=>{console.log(e)}}))},webSocketSend(){let e=this;const t={header:{app_id:this.appId,uid:"随意"},parameter:{chat:{domain:"general",temperature:.5,max_tokens:1024}},payload:{message:{text:[{role:"user",content:e.userInput}]}}};console.log(JSON.stringify(t)),this.ttsWS.send(JSON.stringify(t))},start(){this.loading=!0,this.totalRes="",this.aiContentRequest="",this.connectWebSocket()},requestHandle(e){this.aiContentRequest=this.aiContentRequest+e.payload.choices.text[0].content},result(e){let t=JSON.parse(e);if(this.totalRes+=e,2!==t.header.status)this.requestHandle(t);else{let e={ai:this.aiContentRequest,user:this.userInput};this.finalChat.push(e),this.userInput="",this.loading=!1}if(0!==t.header.code)return alert(`提问失败: ${t.header.code}:${t.header.message}`),void console.error(`${t.header.code}:${t.header.message}`);0===t.header.code&&2===t.header.status&&(this.ttsWS.close(),this.setStatus("init"))}}};const Q=(0,s.A)(Z,[["render",G]]);var D=Q;function ee(e,t){return(0,a.uX)(),(0,a.CE)("div",null," center ")}const te={},ne=(0,s.A)(te,[["render",ee]]);var oe=ne;const ae=[{path:"/habitai",component:D},{path:"/center",component:oe},{path:"/",redirect:"/habitai"}];var re=ae;const se=[{path:"/login",name:"login",component:v},{path:"/mainbox",name:"mainbox",component:P},{path:"/:pathMatch(.*)*",name:"Notfound",component:N}],le=(0,d.aE)({history:(0,d.Bt)(),routes:se});le.beforeEach(((e,t,n)=>{"login"===e.name?n():localStorage.getItem("token")?C.state.is_get_router?n():(ie(),n({path:e.fullPath})):n({path:"/login"})}));const ie=()=>{re.forEach((e=>{le.addRoute("mainbox",e)})),C.commit("changeGetRouter",!0)};var ue=le,de=n(5587);n(4188);(0,o.Ef)(u).use(de.A).use(C).use(ue).mount("#app")},477:function(){}},t={};function n(o){var a=t[o];if(void 0!==a)return a.exports;var r=t[o]={exports:{}};return e[o].call(r.exports,r,r.exports,n),r.exports}n.m=e,function(){var e=[];n.O=function(t,o,a,r){if(!o){var s=1/0;for(d=0;d<e.length;d++){o=e[d][0],a=e[d][1],r=e[d][2];for(var l=!0,i=0;i<o.length;i++)(!1&r||s>=r)&&Object.keys(n.O).every((function(e){return n.O[e](o[i])}))?o.splice(i--,1):(l=!1,r<s&&(s=r));if(l){e.splice(d--,1);var u=a();void 0!==u&&(t=u)}}return t}r=r||0;for(var d=e.length;d>0&&e[d-1][2]>r;d--)e[d]=e[d-1];e[d]=[o,a,r]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){var e={524:0};n.O.j=function(t){return 0===e[t]};var t=function(t,o){var a,r,s=o[0],l=o[1],i=o[2],u=0;if(s.some((function(t){return 0!==e[t]}))){for(a in l)n.o(l,a)&&(n.m[a]=l[a]);if(i)var d=i(n)}for(t&&t(o);u<s.length;u++)r=s[u],n.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return n.O(d)},o=self["webpackChunkadmin"]=self["webpackChunkadmin"]||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))}();var o=n.O(void 0,[504],(function(){return n(8951)}));o=n.O(o)})();
//# sourceMappingURL=app.2292b702.js.map