import{g as S,r as l,f,o as B,S as p,a as d,c as m,b as r,F as C,d as w,t as O}from"./index-c4b5a781.js";const b={class:"about"},D={class:"registration-container"},I=r("h2",null,"Select an Oponent",-1),N=r("br",null,null,-1),R={class:"user-list"},k=["onClick"],U={__name:"SelectOponent",setup(q){const u=S(),c=l([]),t=l(""),o=l();l(),l(["John Doe","Jane Doe"]);const v=l(""),_=f.database().ref("game"),i=f.database().ref("invite_requests"),h=f.database().ref("teams");B(()=>{localStorage.getItem("xox_user")!=null?t.value=JSON.parse(localStorage.getItem("xox_user")):u.proxy.$router.push("/"),_.on("value",e=>{const a=e.val();if(a){let s=a.users,n=s.indexOf(t.value);n!==-1?s.splice(n,1):x(),c.value=s}}),i.on("value",e=>{const a=e.val();a&&g(a)})});const g=e=>{o.value=e,o.value!==void 0&&o.value.hasOwnProperty(t.value)&&o.value[t.value].is_accepted==0&&p.fire({title:"You have an invaite from "+o.value[t.value].from,text:"Do you want to join ?",icon:"warning",showCancelButton:!0,confirmButtonColor:"#2a8c00",cancelButtonColor:"#d33",confirmButtonText:"Yes"}).then(async s=>{if(s.isConfirmed){v.value=t.value+"-"+o.value[t.value].from,localStorage.setItem("teamName",JSON.stringify(v.value));let n={};n[v.value]="",h.set(n),i.child(t.value).update({is_accepted:1}),u.proxy.$router.push("/play")}else s.isDismissed&&i.child(t.value).update({is_accepted:2})})},x=()=>{let e=c.value;e.push(t.value),_.set({users:e})},y=e=>{p.fire({title:"Are you sure?",text:"Do you want to invite "+e+" ?",icon:"warning",showCancelButton:!0,confirmButtonColor:"#2a8c00",cancelButtonColor:"#d33",confirmButtonText:"Yes"}).then(async a=>{a.isConfirmed&&(o.value!==void 0?i.update({[e]:{is_accepted:0,from:t.value}}):i.set({[e]:{is_accepted:0,from:t.value}}),localStorage.setItem("teamName",JSON.stringify(e+"-"+t.value)),u.proxy.$router.push("/wait"))})};return(e,a)=>(d(),m("div",b,[r("div",D,[I,N,r("ul",R,[(d(!0),m(C,null,w(c.value,s=>(d(),m("li",{class:"user-item",onClick:n=>y(s)},O(s),9,k))),256))])])]))}};export{U as default};