<!--
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-14 14:31:17
 * @LastEditTime: 2023-08-29 15:03:06
 * @Description: 辉光
 1. 将渲染背景设置城透明色  renderer.setClearAlpha(0);
 * @FilePath: \demo\src\part\bloomScene.vue
-->
<template>
  <div class="scene" ref="sceneDom">

  </div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {ref, onMounted} from 'vue'
const sceneDom = ref(null)
let scene, camera, renderer, controls;
// 初始化场景
const createScene = ()=>{
  // 加载场景
  scene  = new THREE.Scene()
  scene.background = new THREE.Color( 0x000000 )
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
}

/***
 * 辉光效果
 */
const glows = []
initModel()
const {finalComposer,glowComposer} = initComposer
const initComposer = ()=>{
  const param = {
    // 强度
    bloomStrength: 1.5,
    // 阈值
    bloomThreshold: 0,
    // 半径
    bloomRadius: 0,
  }
  const renderPass = new RenderPass()
  

}
// 创建模型
const initModel = ()=>{
  const boxGeometry = new THREE.BoxGeometry(100, 100, 100)
  // 创建地面材质
  const boxMaterial = new THREE.MeshPhongMaterial({
    color: '#68a5f1',
    side: 0
  })
 
  // 场景随机创建20个盒子
  for (let i = 0; i < 20; i++) {
    const cubeMesh = new THREE.Mesh(boxGeometry.clone(), boxMaterial.clone())
    cubeMesh.position.setY(50)
    cubeMesh.castShadow = true
    cubeMesh.receiveShadow = true
    cubeMesh.position.set(Math.random(-500, 400), Math.random(-0, 500), Math.random(-500, 400))
    // 偶数的为红色，放入辉光容器，奇数为蓝色，不辉光
    if (i % 2 === 0) {
      glows.push(cubeMesh)
      cubeMesh.material.color = new THREE.Color('#fc2d5d')
    }
    scene.add(cubeMesh)
  }
}

function animate(){
  requestAnimationFrame( animate );
	renderer.render( scene, camera );
  controls.update();
}
onMounted(()=>{
  createScene()
})

</script>

<style scoped lang="less">
.scene {
  height: 100%;
}
</style>