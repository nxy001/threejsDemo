<!--
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-14 14:31:17
 * @LastEditTime: 2023-08-15 09:18:33
 * @Description: desc
 * @FilePath: \threejsDemo\threejsdemo\src\part\loadScene.vue
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
let scene, camera, renderer, cube, controls;
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
// 加载一个物体
const createCube = ()=>{
   // 构造一个物体
  const geometry = new THREE.BoxGeometry(1,1,1)
  const material = new THREE.MeshBasicMaterial({
    color: 0x794523
  })
  cube = new THREE.Mesh(geometry,material)
  scene.add(cube)
}

// 加载一个线条
const createLine = ()=>{
  const points = []
  points.push(
    new THREE.Vector3(-10,0,0),
    new THREE.Vector3(0,10,0),
    new THREE.Vector3(10,0,0)
  )
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({
    color: 0x0000ff 
  })
  const line = new THREE.Line(geometry,material)
  scene.add(line)
}
// 添加一个文字
const createFont = (str)=>{
  const geometry = new THREE.PlaneGeometry(40,40)

  const material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(createFontCanvas(str)),
    side: THREE.doubleSide,
    opacity: 1,
  })
  const rect = new THREE.Mesh(geometry,material)
  rect.position.z = -20
  scene.add(rect)
}

const createFontCanvas = (fontStr)=>{
  const canvas = document.createElement('canvas')
  const width = 512
  const height = 256
  canvas.width = width
  canvas.height = height
  const ct = canvas.getContext('2d')
  ct.fillRect(0,0,width,height)
  ct.font = 'normal 40px "楷体"'
  ct.fillStyle = '#2891FF'
  ct.fillText(fontStr,10,40)
  // 生成图片url
  const url = canvas.toDataURL('image/png');
  return url

}


function animate(){
  requestAnimationFrame( animate );
	renderer.render( scene, camera );
  if(cube) {
    cube.rotation.x+=0.01
    cube.rotation.y+=0.01
  }
  controls.update();
}
onMounted(()=>{
  createScene()
  createCube()
  createLine()
  createFont('测试THREE')
})

</script>

<style scoped lang="less">
.scene {
  height: 100%;
}
</style>