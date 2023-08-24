<!--
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-14 14:31:17
 * @LastEditTime: 2023-08-24 16:48:46
 * @Description: 特效
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
let scene, camera, renderer, controls, gui;
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
  requestAnimationFrame( animate );
	renderer.render( scene, camera );

  controls.update();
}
onMounted(()=>{
  createScene()
  const start = new Start({scene})
  const obj = start.init()
  scene.add(obj)

})

</script>

<style scoped lang="less">
.scene {
  height: 100%;
}
</style>