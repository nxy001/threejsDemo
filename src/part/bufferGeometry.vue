<template>
 <div class="scene" ref="sceneDom"></div> 
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
}

function animate(){
  requestAnimationFrame( animate );
	renderer.render( scene, camera );
  controls.update();
}
// 加载一个bufferGeometry
function createObject(){
  const MAX_POINTS = 500
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(MAX_POINTS*3)
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3))
  const drawCount = 2
  geometry.setDrawRange(0,drawCount)
  const material = new THREE.LineBasicMaterial({
    color: 0xff0000

  })
  const line = new THREE.Line(geometry,material)
  scene.add(line)

  const positionAttribute = line.geometry.getAttribute('position')
  let x=0,y=0,z=0;
  
  for(let i=0;i<positionAttribute.count;i++) {
    positionAttribute.setXYZ(i,x,y,z)
    x += ( Math.random() - 0.5 ) * 30;
    y += ( Math.random() - 0.5 ) * 30;
    z += ( Math.random() - 0.5 ) * 30;
  } 
  line.geometry.setDrawRange( 0, MAX_POINTS*3 );
  positionAttribute.needsUpdate = true; // 需要加在第一次渲染之后


}
onMounted(()=>{
  createScene()
  createObject()
})
</script>

<style lang="less" scoped>
.scene {
  height: 100%;
}
</style>