import{s as S,n as p,o as T,f as C}from"../chunks/scheduler.b108d059.js";import{S as D,i as P,g as I,h as R,y as b,k as j,a as k,f as x}from"../chunks/index.bb499846.js";function E(u){let e,r='<video id="player" src="" autoplay="" muted="" controls="" class="svelte-rdgflp"></video>';return{c(){e=I("main"),e.innerHTML=r,this.h()},l(s){e=R(s,"MAIN",{class:!0,"data-svelte-h":!0}),b(e)!=="svelte-edb7jq"&&(e.innerHTML=r),this.h()},h(){j(e,"class","svelte-rdgflp")},m(s,l){k(s,e,l)},p,i:p,o:p,d(s){s&&x(e)}}}const h=3;function L(u){let e,r,s,l=!1,f=30,m=45,d=[0,.5,0];T(async()=>{const t=Math.random().toString(36).substring(2,15);await v(t);const o=document.querySelector("main");o.addEventListener("mousedown",()=>l=!0),o.addEventListener("mouseup",()=>l=!1),o.addEventListener("mousemove",M)}),C(()=>{e&&e.close()});async function v(t){var n={iceServers:await fetch("http://54.174.13.59/ice-servers",{method:"GET",headers:{"Content-Type":"application/json"}}).then(a=>a.json())};console.log("Creating RTCPeerConnection with config: ",n),e=new RTCPeerConnection(n),e.ontrack=a=>{console.log("Received track:",a),document.getElementById("player").srcObject=a.streams[0]},r=e.createDataChannel("camera");const i={offerToReceiveAudio:!1,offerToReceiveVideo:!0},c=await e.createOffer(i);console.log("Created offer:",c),await e.setLocalDescription(c),console.log("Waiting for ICE gathering to complete..."),await new Promise(a=>{e.iceGatheringState==="complete"?a():e.onicegatheringstatechange=()=>{e.iceGatheringState==="complete"&&a()}}),console.log("Sending offer SDP: ",c);const g=await fetch(`http://54.174.13.59/offer?session_id=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sdp:e.localDescription.sdp,type:e.localDescription.type})}).then(a=>a.json());console.log("Received answer SDP: ",g),await e.setRemoteDescription(g)}function y(t,o){s||(s=setTimeout(()=>{t(),s=null},o))}function M(t){if(!l)return;const o=t.movementX||t.mozMovementX||t.webkitMovementX||0,n=t.movementY||t.mozMovementY||t.webkitMovementY||0;m-=o*.5,f+=n*.5,f=Math.min(Math.max(f,0),70),m=(m+360)%360;const i=w(f,m),c=[-f,270-m,0];y(()=>{_(i,c)},1e3/30)}function w(t,o){const n=t*Math.PI/180,i=o*Math.PI/180;return[h*Math.cos(i)*Math.cos(n)+d[0],-h*Math.sin(n)+d[1],h*Math.sin(i)*Math.cos(n)+d[2]]}function _(t,o){const n={type:"camera_update",position:t,rotation:o};r.send(JSON.stringify(n))}return[]}class Y extends D{constructor(e){super(),P(this,e,L,E,S,{})}}export{Y as component};