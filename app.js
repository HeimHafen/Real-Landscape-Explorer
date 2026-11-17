/* Real Landscape Explorer V1. Original geometry and offline model loader.
   WebGL2, no CDNs, no server routes, no WebGL texture arrays. */
const $ = id => document.getElementById(id);
const canvas=$('world');
const loader=$('loading'),loadtext=$('loadtext'),progress=$('progress'),retry=$('retry'),start=$('start');
const announce=(message,pct=0)=>{loadtext.textContent=message;progress.style.width=pct+'%';};
let gl,terrain,rocks,scene,shader,skyProg,skyVao,baseTex,detailTex,worldSize=3600,gridN=385;
let running=false,mode='walk',eco=false,sprintOn=false,frames=0,fps=0,lastFPS=0,lastFrame=0;
let pos={x:-180,y:100,z:990},yaw=0.03,pitch=-0.095,airY=0,verticalSpeed=0,grounded=true;
const keys=new Set();let joyX=0,joyY=0;let lookPointer=null,lastLookX=0,lastLookY=0;
const colliders=[];
const VERT=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec2 aUV;
uniform vec3 uCamera,uRight,uUp,uForward;
uniform float uAspect,uTan,uFar;
out vec3 vPosition;
out vec3 vNormal;
out vec2 vUV;
out float vDistance;
void main(){
  vec3 delta=aPosition-uCamera;
  float x=dot(delta,uRight),y=dot(delta,uUp),z=dot(delta,uForward);
  float nearPlane=.09;
  float clipZ=((uFar+nearPlane)/(uFar-nearPlane))*z-(2.0*uFar*nearPlane/(uFar-nearPlane));
  gl_Position=vec4(x/(uTan*uAspect),y/uTan,clipZ,z);
  vPosition=aPosition;vNormal=aNormal;vUV=aUV;vDistance=length(delta);
}`;
const FRAG=`#version 300 es
precision highp float;
precision highp sampler2D;
in vec3 vPosition,vNormal;
in vec2 vUV;
in float vDistance;
uniform sampler2D uMacro;
uniform sampler2D uDetail;
uniform int uIsRock;
uniform vec3 uSun,uFog;
out vec4 outColor;
void main(){
  vec3 n=normalize(vNormal);
  float steep=1.0-abs(n.y);
  vec3 base=(uIsRock==1) ? texture(uDetail,vUV*1.6).rgb : texture(uMacro,vUV).rgb;
  vec2 uv=vPosition.xz*.21;
  vec3 micro=texture(uDetail,uv).rgb;
  // Photographic gravel detail remains visible near the observer; reduced in distant terrain.
  float detailFactor=(1.0-smoothstep(25.0,270.0,vDistance))*.32;
  float grain=dot(micro,vec3(.299,.587,.114));
  base*=mix(1.0,.57+grain*.85,detailFactor);
  if(uIsRock==0){base=mix(base,base*.86,steep*.44);}
  vec3 sun=normalize(uSun);
  float diffuse=max(dot(n,sun),0.0);
  float light=.48+.60*diffuse;
  vec3 color=base*light;
  // Near-view micro-roughness from real photographic image, without blocky normal maps.
  color*=1.0+.045*(grain-.5);
  float fog=1.0-exp(-pow(vDistance*.00030,1.65));
  fog=clamp(fog,0.0,.89);
  color=mix(color,uFog,fog);
  // Inputs are authored as sRGB data; keep restrained, daylight-friendly contrast.
  color=pow(clamp(color,0.0,1.0),vec3(.95));
  outColor=vec4(color,1.0);
}`;
const SKYVERT=`#version 300 es
precision highp float;
const vec2 triangles[3]=vec2[3](vec2(-1.,-1.),vec2(3.,-1.),vec2(-1.,3.));
out vec2 vScreen;
void main(){vScreen=triangles[gl_VertexID];gl_Position=vec4(vScreen,0.,1.);}`;
const SKYFRAG=`#version 300 es
precision highp float;
in vec2 vScreen;
uniform vec3 uRight,uUp,uForward,uSun;
uniform float uAspect,uTan;
out vec4 outColor;
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
void main(){
 vec3 ray=normalize(uForward+uRight*(vScreen.x*uTan*uAspect)+uUp*(vScreen.y*uTan));
 float h=clamp(ray.y*.85+.27,0.,1.);
 vec3 horizon=vec3(.62,.71,.76),zenith=vec3(.25,.45,.64);
 vec3 col=mix(horizon,zenith,pow(h,.75));
 float sun=max(dot(ray,normalize(uSun)),0.);
 col+=vec3(.6,.46,.23)*pow(sun,55.)*.14+vec3(1.,.84,.56)*pow(sun,2800.)*.6;
 // Subtle high-altitude cloud veils, only above the horizon.
 vec2 p=ray.xz/(max(.18,ray.y+.2))*2.2;
 float c=.56*noise(p*.8)+.31*noise(p*2.0)+.13*noise(p*5.0);
 float cloud=smoothstep(.53,.77,c)*smoothstep(.03,.3,ray.y)*.18;
 col=mix(col,vec3(.91,.93,.92),cloud);
 outColor=vec4(col,1.);
}`;
function compile(type,source){
  const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const error=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error('Shader: '+error);}
  return s;
}
function program(v,f){const p=gl.createProgram(),sv=compile(gl.VERTEX_SHADER,v),sf=compile(gl.FRAGMENT_SHADER,f);gl.attachShader(p,sv);gl.attachShader(p,sf);gl.linkProgram(p);gl.deleteShader(sv);gl.deleteShader(sf);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error('Grafikprogramm: '+gl.getProgramInfoLog(p));return p;}
function uniforms(program,keys){const u={};for(const key of keys)u[key]=gl.getUniformLocation(program,key);return u;}
const viewKeys=['uCamera','uRight','uUp','uForward','uAspect','uTan','uFar','uSun','uFog','uMacro','uDetail','uIsRock'];
const skyKeys=['uRight','uUp','uForward','uAspect','uTan','uSun'];
function decodeGLB(ab){
 const dv=new DataView(ab);if(dv.getUint32(0,true)!==0x46546c67||dv.getUint32(4,true)!==2)throw new Error('Das Geländemodell ist keine gültige GLB-2.0-Datei.');
 if(dv.getUint32(8,true)!==ab.byteLength)throw new Error('Die GLB-Datei ist unvollständig.');
 const jsonLength=dv.getUint32(12,true);if(dv.getUint32(16,true)!==0x4e4f534a)throw new Error('GLB-JSON-Block fehlt.');
 const json=JSON.parse(new TextDecoder().decode(new Uint8Array(ab,20,jsonLength)));
 const offset=20+jsonLength,binLength=dv.getUint32(offset,true);
 if(dv.getUint32(offset+4,true)!==0x004e4942)throw new Error('GLB-Binärblock fehlt.');
 const start=offset+8; if(start+binLength>ab.byteLength)throw new Error('GLB-Binärblock beschädigt.');
 const sizes={SCALAR:1,VEC2:2,VEC3:3,VEC4:4};
 function attribute(i){const a=json.accessors[i],b=json.bufferViews[a.bufferView];if(a.byteStride||b.byteStride)throw new Error('Nicht unterstütztes GLB-Meshformat.');const p=start+b.byteOffset+(a.byteOffset||0),count=a.count*sizes[a.type];if(a.componentType===5126)return new Float32Array(ab,p,count);if(a.componentType===5125)return new Uint32Array(ab,p,count);if(a.componentType===5123)return new Uint16Array(ab,p,count);throw new Error('Unbekannter GLB-Datentyp.');}
 function mesh(i){const p=json.meshes[i].primitives[0];return {positions:attribute(p.attributes.POSITION),normals:attribute(p.attributes.NORMAL),uv:attribute(p.attributes.TEXCOORD_0),indices:attribute(p.indices)};}
 function imageBlob(i){const im=json.images[i],v=json.bufferViews[im.bufferView];return new Blob([ab.slice(start+v.byteOffset,start+v.byteOffset+v.byteLength)],{type:im.mimeType});}
 return {terrain:mesh(0),rocks:mesh(1),albedo:imageBlob(0),detail:imageBlob(1),meta:json.nodes[0].extras,extras:json.extras||{}};
}
async function decodeImage(blob){
 if('createImageBitmap' in window){try{return await createImageBitmap(blob);}catch(e){/* Fallback for older Safari builds */}}
 return await new Promise((resolve,reject)=>{const url=URL.createObjectURL(blob),im=new Image();im.onload=()=>{URL.revokeObjectURL(url);resolve(im)};im.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Die Fototextur konnte nicht gelesen werden.'))};im.src=url;});
}
function texture(image){const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);const ext=gl.getExtension('EXT_texture_filter_anisotropic')||gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');if(ext)gl.texParameterf(gl.TEXTURE_2D,ext.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(4,gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));return t;}
function gpuMesh(m){
 const vao=gl.createVertexArray();gl.bindVertexArray(vao);
 function put(index,data,size){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);gl.enableVertexAttribArray(index);gl.vertexAttribPointer(index,size,gl.FLOAT,false,0,0);}
 put(0,m.positions,3);put(1,m.normals,3);put(2,m.uv,2);
 const indexBuffer=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,m.indices,gl.STATIC_DRAW);
 gl.bindVertexArray(null);return {vao,count:m.indices.length,type: m.indices instanceof Uint32Array?gl.UNSIGNED_INT:gl.UNSIGNED_SHORT,positions:m.positions};
}
async function load(){
 try{
  announce('Prüfe WebGL-2-Unterstützung …',8);
  gl=canvas.getContext('webgl2',{alpha:false,antialias:true,depth:true,stencil:false,powerPreference:'high-performance',preserveDrawingBuffer:false});
  if(!gl)throw new Error('WebGL 2 ist auf diesem Gerät/Browser nicht verfügbar.');
  shader=program(VERT,FRAG);shader.u=uniforms(shader,viewKeys);
  skyProg=program(SKYVERT,SKYFRAG);skyProg.u=uniforms(skyProg,skyKeys);
  skyVao=gl.createVertexArray();
  announce('Lade das 3D-Modell (etwa 10 MB) …',14);
  const res=await fetch('./assets/landscape.glb',{cache:'no-store'});
  if(!res.ok)throw new Error('Modell nicht gefunden (HTTP '+res.status+'). Bitte den Ordner assets vollständig hochladen.');
  const total=Number(res.headers.get('content-length'))||0;
  let ab;
  if(res.body&&total){const reader=res.body.getReader(),chunks=[];let loaded=0;while(true){const {done,value}=await reader.read();if(done)break;chunks.push(value);loaded+=value.length;announce('Lade die Geländedaten …',14+Math.min(56,Math.round(loaded/total*56)));}
   const all=new Uint8Array(loaded);let at=0;for(const c of chunks){all.set(c,at);at+=c.length;}ab=all.buffer;
  }else ab=await res.arrayBuffer();
  announce('Prüfe die echte 3D-Geometrie …',73);
  scene=decodeGLB(ab);worldSize=scene.meta.sizeMeters;gridN=scene.meta.grid;
  // Player collision samples the same mesh as the visible game world.
  terrain=gpuMesh(scene.terrain);rocks=gpuMesh(scene.rocks);
  colliders.push(...(scene.extras.boulderColliders||[]));
  announce('Lade die Fotografien für Felsen und Gelände …',85);
  const [albedo,detail]=await Promise.all([decodeImage(scene.albedo),decodeImage(scene.detail)]);
  baseTex=texture(albedo);detailTex=texture(detail);
  pos.y=height(pos.x,pos.z)+1.74;
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.BLEND);gl.disable(gl.CULL_FACE);
  announce('3D-Gelände geladen – bereit zum Wandern.',100);
  $('loaddetail').textContent='12,96 km² · 2 GLB-Meshes · '+(scene.terrain.indices.length/3+scene.rocks.indices.length/3).toLocaleString('de-DE')+' Dreiecke · offline-Materialien';
  start.hidden=false;
 }catch(err){console.error(err);loadtext.textContent='Die 3D-Welt konnte nicht gestartet werden.'; $('loaddetail').textContent=String(err.message||err);progress.style.width='0%';retry.hidden=false;}
}
function height(x,z){
 const p=terrain.positions,n=gridN,s=worldSize,step=s/(n-1);
 const ix=Math.max(0,Math.min(n-1.00001,(x+s/2)/step)),iz=Math.max(0,Math.min(n-1.00001,(z+s/2)/step));
 const i=Math.floor(ix),j=Math.floor(iz),u=ix-i,v=iz-j;
 const a=p[(j*n+i)*3+1],b=p[(j*n+i+1)*3+1],c=p[((j+1)*n+i)*3+1],d=p[((j+1)*n+i+1)*3+1];
 return u+v<=1?a*(1-u-v)+b*u+c*v:d*(u+v-1)+b*(1-v)+c*(1-u);
}
function stepSafe(x,z){
 const bound=worldSize/2-10;if(Math.abs(x)>=bound||Math.abs(z)>=bound)return false;
 for(const o of colliders){const dx=x-o[0],dz=z-o[1];if(dx*dx+dz*dz<(o[2]+.36)**2)return false;}
 return true;
}
function cameraBasis(){const c=Math.cos(yaw),s=Math.sin(yaw),p=Math.sin(pitch),cp=Math.cos(pitch);return {f:[s*cp,p,-c*cp],r:[c,0,s],u:[-s*p,cp,c*p]};}
function uniformScene(p,u,b,aspect,tan){
 gl.uniform3fv(u.uRight,b.r);gl.uniform3fv(u.uUp,b.u);gl.uniform3fv(u.uForward,b.f);gl.uniform1f(u.uAspect,aspect);gl.uniform1f(u.uTan,tan);gl.uniform3fv(u.uSun,[.55,.68,-.32]);
 if(u.uCamera)gl.uniform3f(u.uCamera,pos.x,pos.y+airY,pos.z);
 if(u.uFar)gl.uniform1f(u.uFar,5300);
 if(u.uFog)gl.uniform3f(u.uFog,.62,.70,.73);
}
function fitCanvas(){const ratio=Math.min(devicePixelRatio||1,eco?0.9:1.45);const w=Math.max(1,Math.floor(innerWidth*ratio)),h=Math.max(1,Math.floor(innerHeight*ratio));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}}
function draw(){
 fitCanvas();const aspect=canvas.width/canvas.height,tan=Math.tan((mode==='walk'?72:77)*Math.PI/360),basis=cameraBasis();
 gl.disable(gl.DEPTH_TEST);gl.depthMask(false);gl.useProgram(skyProg);gl.bindVertexArray(skyVao);uniformScene(skyProg,skyProg.u,basis,aspect,tan);gl.drawArrays(gl.TRIANGLES,0,3);
 gl.enable(gl.DEPTH_TEST);gl.depthMask(true);gl.clear(gl.DEPTH_BUFFER_BIT);
 gl.useProgram(shader);uniformScene(shader,shader.u,basis,aspect,tan);
 gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,baseTex);gl.uniform1i(shader.u.uMacro,0);
 gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,detailTex);gl.uniform1i(shader.u.uDetail,1);
 gl.uniform1i(shader.u.uIsRock,0);gl.bindVertexArray(terrain.vao);gl.drawElements(gl.TRIANGLES,terrain.count,terrain.type,0);
 gl.uniform1i(shader.u.uIsRock,1);gl.bindVertexArray(rocks.vao);gl.drawElements(gl.TRIANGLES,rocks.count,rocks.type,0);
 gl.bindVertexArray(null);
}
function motion(dt){
 let fb=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0);
 let side=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0);
 fb-=joyY;side+=joyX;
 const mag=Math.hypot(fb,side);if(mag>.001){fb/=Math.max(1,mag);side/=Math.max(1,mag);}
 let speed=(mode==='drone'?40:(keys.has('ShiftLeft')||keys.has('ShiftRight')||sprintOn?6.4:2.0));
 const vx=(Math.sin(yaw)*fb+Math.cos(yaw)*side)*speed*dt;
 const vz=(-Math.cos(yaw)*fb+Math.sin(yaw)*side)*speed*dt;
 if(mode==='drone'){
  pos.x=Math.max(-worldSize/2+8,Math.min(worldSize/2-8,pos.x+vx));pos.z=Math.max(-worldSize/2+8,Math.min(worldSize/2-8,pos.z+vz));
  if(keys.has('Space'))pos.y+=speed*dt;if(keys.has('KeyX'))pos.y-=speed*dt;
  pos.y=Math.max(height(pos.x,pos.z)+2.1,Math.min(850,pos.y));return;
 }
 // Slide on near-vertical surfaces and prevent passing through large boulders.
 const ground=height(pos.x,pos.z);
 let x=pos.x+vx,z=pos.z+vz;
 if(stepSafe(x,z)&&height(x,z)-ground <=Math.hypot(vx,vz)*.93+.1){pos.x=x;pos.z=z;}
 else {
  if(stepSafe(x,pos.z)&&height(x,pos.z)-ground<=Math.abs(vx)*.93+.1)pos.x=x;
  if(stepSafe(pos.x,z)&&height(pos.x,z)-ground<=Math.abs(vz)*.93+.1)pos.z=z;
 }
 if(keys.has('Space')&&grounded){verticalSpeed=4.5;grounded=false;}
 if(!grounded){verticalSpeed-=9.8*dt;airY+=verticalSpeed*dt;if(airY<=0){airY=0;verticalSpeed=0;grounded=true;}}
 const desired=height(pos.x,pos.z)+1.74;
 pos.y+=(desired-pos.y)*Math.min(1,dt*12);
}
function render(now){if(!running)return;const dt=Math.min(.05,(now-lastFrame)/1000||.016);lastFrame=now;
 motion(dt);draw();
 frames++;if(now-lastFPS>1000){fps=Math.round(frames*1000/(now-lastFPS));frames=0;lastFPS=now;$('stats').textContent=fps+' FPS · '+(mode==='walk'?'zu Fuß':'Panoramaflug');}
 const dir=((yaw%(Math.PI*2)+Math.PI*2)%(Math.PI*2))*180/Math.PI;
 const words=['N','NO','O','SO','S','SW','W','NW'];$('compass').textContent=words[Math.round(dir/45)%8];
 $('readout').textContent='Modellhöhe '+Math.round(height(pos.x,pos.z))+' m';
 requestAnimationFrame(render);
}
function showWorld(){loader.hidden=true;$('hud').hidden=false;$('crosshair').hidden=false;$('touchui').hidden=false;$('footer').hidden=false;$('help').hidden=false;running=true;lastFrame=performance.now();lastFPS=lastFrame;requestAnimationFrame(render);}
function setJoy(x,y){const max=37,m=Math.hypot(x,y),mul=m>max?max/m:1;const px=x*mul,py=y*mul;joyX=px/max;joyY=py/max;const n=$('nub');n.style.transform=`translate(${px}px,${py}px)`;}
function setupControls(){
 const stick=$('stick');let joyPointer=null;
 function setPointerStick(e){const rect=stick.getBoundingClientRect();setJoy(e.clientX-rect.left-rect.width/2,e.clientY-rect.top-rect.height/2);}
 stick.addEventListener('pointerdown',e=>{e.preventDefault();joyPointer=e.pointerId;stick.setPointerCapture(e.pointerId);setPointerStick(e);});
 stick.addEventListener('pointermove',e=>{if(e.pointerId===joyPointer){e.preventDefault();setPointerStick(e);}});
 const end=e=>{if(e.pointerId===joyPointer){joyPointer=null;setJoy(0,0);}};
 stick.addEventListener('pointerup',end);stick.addEventListener('pointercancel',end);stick.addEventListener('lostpointercapture',()=>{joyPointer=null;setJoy(0,0)});
 canvas.addEventListener('pointerdown',e=>{if(!running||!$('help').hidden)return;lookPointer=e.pointerId;lastLookX=e.clientX;lastLookY=e.clientY;canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(e.pointerId!==lookPointer)return;const dx=e.clientX-lastLookX,dy=e.clientY-lastLookY;lastLookX=e.clientX;lastLookY=e.clientY;yaw+=dx*.0040;pitch=Math.min(1.32,Math.max(-1.32,pitch-dy*.0031));});
 const endLook=e=>{if(e.pointerId===lookPointer)lookPointer=null;};
 canvas.addEventListener('pointerup',endLook);canvas.addEventListener('pointercancel',endLook);
 addEventListener('keydown',e=>{if(e.code.startsWith('Arrow')||e.code==='Space')e.preventDefault();keys.add(e.code);if(e.code==='KeyV'&&!e.repeat)toggleMode();if(e.code==='KeyR'&&!e.repeat)reset();});
 addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',()=>{keys.clear();joyX=0;joyY=0;setJoy(0,0)});
 $('closehelp').addEventListener('click',()=>{$('help').hidden=true;});
 $('moveMode').addEventListener('click',toggleMode);
 $('sprint').addEventListener('click',()=>{sprintOn=!sprintOn;$('sprint').textContent=sprintOn?'GEHEN':'LAUFEN';});
 $('graphics').addEventListener('click',()=>{eco=!eco;$('graphics').textContent=eco?'GRAFIK: ECO':'GRAFIK: AUTO';});
 $('reset').addEventListener('click',reset);
}
function toggleMode(){mode=mode==='walk'?'drone':'walk';if(mode==='drone'){pos.y=height(pos.x,pos.z)+115;pitch=-.45;}else{pos.y=height(pos.x,pos.z)+1.74;pitch=-.09;}airY=0;verticalSpeed=0;grounded=true;$('moveMode').textContent=mode==='walk'?'WANDERN':'AUSSICHT';}
function reset(){pos.x=-180;pos.z=990;pos.y=height(pos.x,pos.z)+(mode==='walk'?1.74:115);pitch=-.095;yaw=.03;airY=0;verticalSpeed=0;grounded=true;}
retry.addEventListener('click',()=>location.reload());start.addEventListener('click',showWorld);setupControls();load();
