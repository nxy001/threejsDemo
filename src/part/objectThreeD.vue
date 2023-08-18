<!--
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-14 14:31:17
 * @LastEditTime: 2023-08-16 13:33:02
 * @Description: 
 * 基础用法：  
   object3d坐标：  如果默认没有给object3d设置位置坐标  则object默认坐标为0，0，0    
   object3d子元素的坐标为相对于父元素的位置
 * @FilePath: \threejsDemo\threejsdemo\src\part\objectThreeD.vue
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

  const light = new THREE.AmbientLight(0xffffff)
  scene.add(light)
  animate()
  const axes = new THREE.AxesHelper(100)
  scene.add(axes)
}

function createObject(){
  const obj = new THREE.Object3D()
  scene.add(obj)
  const geom1 = new THREE.BoxGeometry(10,5,5)
  const material1 = new THREE.MeshPhongMaterial({
    color: '#f29700'
  })
  const box1 = new THREE.Mesh(geom1,material1)
  box1.name="box1"
  box1.position.set(0,10,0)
  obj.add(box1)

  const object2 = new THREE.Object3D()

  const geometry2 = new THREE.CircleGeometry( 4, 32 );
  const material2 = new THREE.MeshBasicMaterial( { color: 0x9fff00 } );
  const circle = new THREE.Mesh( geometry2, material2 );
  circle.position.set(-3,10,3)
  object2.add(circle)

  const geometry4 = new THREE.CircleGeometry( 2, 32 );
  const circle3 = new THREE.Mesh(geometry4,material1)
  circle3.position.set(0,0,0)
  object2.add(circle3)
  scene.add(object2)



  const geometry3 = geometry2.clone()
  const circle2 = new THREE.Mesh(geometry3,material2)
  circle2.position.set(3,10,3)
  obj.add(circle2)
  obj.position.set(10,10,10)
  obj.rotateY(Math.PI/6)
  obj.name="object"
  scene.add(obj)
  
}
// 鼠标事件绑定
function bindEvent(){
  sceneDom.value.addEventListener('click',(event)=>{
    let mouse = {x:'',y:''}
    mouse.x = (event.offsetX / sceneDom.value.clientWidth) * 2 - 1;
    mouse.y = - (event.offsetY / sceneDom.value.clientHeight) * 2 + 1;
    let raycaster = new THREE.Raycaster();
    // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
    raycaster.setFromCamera( mouse, camera );
    // 获取raycaster直线和所有模型相交的数组集合
    const intersects = raycaster.intersectObjects(scene.children,true);
    
    if( intersects.length ){
      let obj = intersects[0].object
      console.log(obj.name)
    }
  })
}

function animate(){
  requestAnimationFrame( animate );
	renderer.render( scene, camera );
  controls.update();
}
onMounted(()=>{
  createScene()
  createObject()
  bindEvent()
})

</script>

<style scoped lang="less">
.scene {
  height: 100%;
}
</style>