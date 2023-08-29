<!--
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-14 14:31:17
 * @LastEditTime: 2023-08-25 17:29:40
 * @Description: 特效
 1. scene 背景图失真问题   
    bgTexture.encoding = THREE.sRGBEncoding;
    renderer.outputEncoding = THREE.sRGBEncoding;
 * @FilePath: \demo\src\part\animationScene.vue
-->
<template>
  <div class="scene" ref="sceneDom">

  </div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {ref, onMounted} from 'vue'
import * as dat from 'dat.gui';
import Start from '../utils/particle/system'
const sceneDom = ref(null)
let scene, camera, renderer, controls, gui, startObj;
gui = new dat.GUI();
//改变交互界面style属性
gui.domElement.style.right = '0px';
gui.domElement.style.width = '300px';

const params = {
  'particle':()=>{ // 例子系统回调

  }
}
gui.add(params,'particle').name = '粒子系统'


// 初始化场景
const createScene = ()=>{
  // 加载场景
  scene  = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    75,
    sceneDom.value.clientWidth / sceneDom.value.clientHeight,
    0.1,
    1000
  )
 
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(sceneDom.value.clientWidth,sceneDom.value.clientHeight)
  renderer.outputEncoding = THREE.sRGBEncoding;
  
  sceneDom.value.appendChild(renderer.domElement)
  camera.position.set( 0, 0, 100 );
  camera.lookAt( 0, 0, 0 );
  controls = new OrbitControls(camera,renderer.domElement);
  controls.enablePan = true
  controls.update();
  animate()
  const axes = new THREE.AxesHelper(100)
  scene.add(axes)

  // 设置scene背景
  // scene.background = new THREE.Color(0xff0000)  设置一个颜色
  
  const bgTexture = new THREE.TextureLoader().load(require('../assets/bg.jpg'))
  bgTexture.encoding = THREE.sRGBEncoding;
  scene.background = bgTexture
}


function animate(){
  if(startObj) {
   renderStart()
  }
  if(cylinder) renderCylinder()

  // if(cMaterial) {
  //   cMaterial.uniforms.u_r.value += Math.PI * 50 + 4;
  //   if (cMaterial.uniforms.u_r.value >= 600) {
  //     cMaterial.uniforms.u_r.value = 20
  //   }
  // }

	renderer.render( scene, camera );
  controls.update();
  requestAnimationFrame( animate );
}
function renderStart(){
  startObj.rotateZ(0.001)
}

let floor;
function createFloor(){
  const geom = new THREE.PlaneGeometry(100,100)
  const material = new THREE.MeshBasicMaterial({color: '#080808',transparent: false})
  floor = new THREE.Mesh(geom,material)
  scene.add(floor)
}


let cylinder;
function createCylinder(){
  let texture = new THREE.TextureLoader().load(require('../assets/texture1.png'))
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
    texture.repeat.set(1, 1)
    texture.needsUpdate = true
    let materials = [
      new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true
      }),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
      }),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: .1,
        side: THREE.DoubleSide
      })
    ]
  let geometry = new THREE.CylinderGeometry(4, 4, 2, 64);
  cylinder = new THREE.Mesh(geometry, materials)
  cylinder.rotateX(Math.PI/2)
  cylinder.position.z = 4
  scene.add(cylinder)
}

let s = 0
let p = 1
function renderCylinder(){
  s += 0.01;
  p -= 0.005;

  if (s > 2) {
    s = 0;
    p = 1;
  }
  cylinder.scale.set(1 + s, 1, 1 + s);
  cylinder.material[0].opacity = p;
}


let circle;
let cMaterial;
function createCircle() {
  var uniform = {
    u_color: { value: new THREE.Color("#5588aa") },
    u_tcolor: { value: new THREE.Color("#EF5F00") },
    u_r: { value:0.8 },
    u_length: { value: 20 },//扫过区域
    u_max: { value: 600 }//扫过最大值
  };
  var Shader = {
    vertexShader: `
      varying vec3 vp;
      void main(){
      vp = position;
      gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
            fragmentShader: `
      varying vec3 vp;
      uniform vec3 u_color;
      uniform vec3 u_tcolor;
      uniform float u_r;
      uniform float u_length;
      uniform float u_max;
      float getLeng(float x, float y){
        return  sqrt((x-0.0)*(x-0.0)+(y-0.0)*(y-0.0));
      }
      void main(){
        float uOpacity = 0.3;
        vec3 vColor = u_color;
        float uLength = getLeng(vp.x,vp.z);
        if ( uLength <= u_r && uLength > u_r - u_length ) {
          float op = sin( (u_r - uLength) / u_length ) * 0.6 + 0.3 ;
          uOpacity = op;
          if( vp.y<0.0){
            vColor  = u_tcolor * 0.6;
          }else{
            vColor = u_tcolor;
          };
        }
        gl_FragColor = vec4(vColor,uOpacity);
      }
    `
  }
  cMaterial = new THREE.ShaderMaterial({
    vertexShader: Shader.vertexShader,
    fragmentShader: Shader.fragmentShader,
    side: THREE.DoubleSide,
    uniforms: uniform,
    transparent: true,
    depthWrite: false,
  });
  const geometry = new THREE.PlaneGeometry(10,10)
  circle = new THREE.Mesh( geometry, cMaterial );
  circle.position.z = 10
  scene.add(circle)

}

onMounted(()=>{
  createScene()
  const start = new Start({scene})
  const obj = start.init()
  scene.add(obj)
  startObj = obj

  createFloor()
  createCylinder()
  createCircle()


})

</script>

<style scoped lang="less">
.scene {
  height: 100%;
}
</style>