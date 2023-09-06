import{s as R,n as k,o as N,f as $,h as q}from"../chunks/scheduler.8b74b908.js";import{S as B,i as J,g as w,h as T,j as P,f as p,k as v,a as b,y as V}from"../chunks/index.c146e4e6.js";function z(u){let e,a;return{c(){e=w("video"),this.h()},l(t){e=T(t,"VIDEO",{id:!0,src:!0,class:!0}),P(e).forEach(p),this.h()},h(){v(e,"id","player"),q(e.src,a="")||v(e,"src",a),e.autoplay=!0,e.muted=!0,e.controls=!0,v(e,"class","svelte-1jpaclb")},m(t,s){b(t,e,s)},d(t){t&&p(e)}}}function A(u){let e,a="Loading...";return{c(){e=w("div"),e.textContent=a},l(t){e=T(t,"DIV",{"data-svelte-h":!0}),V(e)!=="svelte-194gxkm"&&(e.textContent=a)},m(t,s){b(t,e,s)},d(t){t&&p(e)}}}function G(u){let e;function a(c,l){return c[0]?A:z}let t=a(u),s=t(u);return{c(){e=w("main"),s.c(),this.h()},l(c){e=T(c,"MAIN",{class:!0});var l=P(e);s.l(l),l.forEach(p),this.h()},h(){v(e,"class","svelte-1jpaclb")},m(c,l){b(c,e,l),s.m(e,null)},p(c,[l]){t!==(t=a(c))&&(s.d(1),s=t(c),s&&(s.c(),s.m(e,null)))},i:k,o:k,d(c){c&&p(e),s.d()}}}const M=3;async function F(u,e){const a=JSON.stringify(u);console.log("Sending ICE candidate: ",a),await fetch(`https://viewer.dylanebert.com/ice-candidate?session_id=${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:a})}function H(u,e,a){let t,s,c,l=!0,f=!1,h=30,m=45,y=[0,.5,0],g=0,_=0;N(async()=>{const o=Math.random().toString(36).substring(2,15);await j(o);const n=document.querySelector("main");n.addEventListener("mousedown",()=>f=!0),n.addEventListener("mouseup",()=>f=!1),n.addEventListener("mousemove",X),n.addEventListener("touchstart",L),n.addEventListener("touchmove",O),n.addEventListener("touchend",()=>f=!1),a(0,l=!1)}),$(()=>{t&&t.close()});async function j(o){var i={iceServers:await fetch("https://viewer.dylanebert.com/ice-servers",{method:"GET",headers:{"Content-Type":"application/json"}}).then(r=>r.json())};console.log("Creating RTCPeerConnection with config: ",i),t=new RTCPeerConnection(i);let d=[];t.onicecandidate=async({candidate:r})=>{r&&d.push(r)},t.ontrack=r=>{console.log("Received track:",r),document.getElementById("player").srcObject=r.streams[0]},s=t.createDataChannel("camera");const D={offerToReceiveAudio:!1,offerToReceiveVideo:!0},C=await t.createOffer(D);console.log("Created offer:",C),await t.setLocalDescription(C),a(0,l=!1),console.log("Sending offer SDP: ",C);const E=await fetch(`https://viewer.dylanebert.com/offer?session_id=${o}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sdp:t.localDescription.sdp,type:t.localDescription.type})}).then(r=>r.json());console.log("Received answer SDP: ",E),await t.setRemoteDescription(E),d.forEach(async r=>{await F(r,o)})}function I(o,n){c||(c=setTimeout(()=>{o(),c=null},n))}function L(o){f=!0;const n=o.touches[0];g=n.clientX,_=n.clientY}function O(o){if(!f)return;const n=o.touches[0],i=n.clientX-g,d=n.clientY-_;g=n.clientX,_=n.clientY,S(i,d)}function X(o){if(!f)return;const n=o.movementX||o.mozMovementX||o.webkitMovementX||0,i=o.movementY||o.mozMovementY||o.webkitMovementY||0;S(n,i)}function S(o,n){m-=o*.5,h+=n*.5,h=Math.min(Math.max(h,0),70),m=(m+360)%360;const i=Y(h,m),d=[-h,270-m,0];I(()=>{x(i,d)},1e3/30)}function Y(o,n){const i=o*Math.PI/180,d=n*Math.PI/180;return[M*Math.cos(d)*Math.cos(i)+y[0],-M*Math.sin(i)+y[1],M*Math.sin(d)*Math.cos(i)+y[2]]}function x(o,n){const i={type:"camera_update",position:o,rotation:n};s.send(JSON.stringify(i))}return[l]}class U extends B{constructor(e){super(),J(this,e,H,G,R,{})}}export{U as component};