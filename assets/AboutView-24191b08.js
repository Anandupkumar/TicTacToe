import{g as c,r,f as _,o as d,a as p,c as v,b as t,w as m,v as f}from"./index-c4b5a781.js";const g={class:"about"},x={class:"registration-container"},h=t("h1",null,"Register",-1),b=t("br",null,null,-1),y={class:"registration-form"},I=t("label",{for:"name"},"Name:",-1),S={__name:"AboutView",setup(O){const o=c(),s=r(""),a=r([]);r();const l=_.database().ref("game");d(()=>{localStorage.getItem("xox_user")!=null&&o.proxy.$router.push("/selectOponent"),l.on("value",n=>{const e=n.val();e&&(a.value=e.users)})});const u=()=>{if(s.value!=="")if(a.value.indexOf(s.value)!==-1)o.proxy.$router.push("/selectOponent");else{a.value.push(s.value);let e=a.value;l.set({users:e}),localStorage.setItem("xox_user",JSON.stringify(s.value)),o.proxy.$router.push("/selectOponent")}else alert("enter name")};return(n,e)=>(p(),v("div",g,[t("div",x,[h,b,t("div",y,[I,m(t("input",{type:"text",id:"name","onUpdate:modelValue":e[0]||(e[0]=i=>s.value=i),required:""},null,512),[[f,s.value]]),t("button",{type:"submit",onClick:u},"Register")])])]))}};export{S as default};
