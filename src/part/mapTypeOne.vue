<!--
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-14 14:31:17
 * @LastEditTime: 2023-08-18 14:34:13
 * @Description: desc
 * @FilePath: \demo\src\part\mapTypeOne.vue
-->
<template>
  <div class="scene" ref="sceneDom">

  </div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {ref, onMounted} from 'vue'
import dataJson from '../utils/cd.json'
import Map from '../utils/map'
const sceneDom = ref(null)
let scene, camera, renderer, controls;
// 初始化场景
const createScene = ()=>{
  // 加载场景
  scene  = new THREE.Scene()
  scene.background = new THREE.Color( 0xffffff )
  camera = new THREE.PerspectiveCamera(
    75,
    sceneDom.value.clientWidth / sceneDom.value.clientHeight,
    0.1,
    1000
  )
 
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(sceneDom.value.clientWidth,sceneDom.value.clientHeight)
  
  sceneDom.value.appendChild(renderer.domElement)
  camera.position.set( 0, 0, 100 );
  camera.lookAt( 0, 0, 0 );
  controls = new OrbitControls(camera,renderer.domElement);
  controls.enablePan = true
  controls.update();
  animate()
  const axes = new THREE.AxesHelper(100)
  scene.add(axes)

  // 添加一个环境光
  const ambientLight = new THREE.AmbientLight('#fff')
  scene.add(ambientLight)
}


function animate(){
  requestAnimationFrame( animate );
	renderer.render( scene, camera );
  controls.update();
}
onMounted(()=>{
  createScene()
  console.log(dataJson)

  createMap()
})
// 创建一个三维地图
const createMap = function () {
  const data = dataJson.features[0].geometry.coordinates[0][0]
  const map = new Map(data)
  const object = map.init()
  scene.add(object)

}

</script>

<style scoped lang="less">
.scene {
  height: 100%;
}
</style>