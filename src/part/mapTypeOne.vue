<!--
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-14 14:31:17
 * @LastEditTime: 2023-08-24 13:52:17
 * @Description: 构造行政区域
  1. 行政区域涉及到使用 经纬度转空间坐标  可以使用d3.js  
  d3
  .geoMercator()
  .center([104.065861,30.657401])
  .scale(1000)
  .translate([0, 0]);
  会返回一个转换函数 接收一组经纬度的数组  转换为x,y空间坐标  其中。center 是行政区域的中心点

  2. 行政区域可以使用ExtrudeGeometry 构造
  3. ExtrudeGeometry 可以使用一组材质数组 分别指定 他的区域面跟边缘
  4. 区域面贴图可以通过计算 geometry的boundingbox 计算  他的x,y的范围  通过 设置texture.repeat.set(1/xsize，1/ysize)来设置
  5. 区域边缘可以使用glsl语言来设置
    glsl 语言
      1. 大小写敏感
      2. 必须要分号
      3. shaderMaterial 的unifroms 中的参数可以传入到着色器中 使用uniforms 作为全局变量使用
      4. glsl 顶点着色器的 点位有固定的获取方式  gl_position
      5. 在顶点着色器中定义的  varying 变量可以传入 片元着色器中
      6. 着色器的动画  可以通过变换 material中传入的unifroms的值来调整   比如  material.uniforms.time = ''
  6 gsap.js  可以用作动画方法 


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

  const box = new THREE.BoxGeometry(10,10,10)
  const texture = new THREE.TextureLoader().load(require('../assets/cd.jpg'))
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1,1)
  const material = new THREE.MeshBasicMaterial({
    map: texture
  })
  const mesh = new THREE.Mesh(box,material)
  mesh.position.set(0,0,4)
  scene.add(mesh)

}

</script>

<style scoped lang="less">
.scene {
  height: 100%;
}
</style>