<!--
  ps
  1. 基本用法
    castShadow: 如果想要阴影需要设置为true
    distance： 如果distance有非零值  需要注意配合光效衰减来调整光效，建议不设置distance 默认distance为0 这样光源就不会有距离衰减
    target： 光源指定的方向  可以是场景中的一个具体的对象 也可以自行创建一个Object3D
  2. 阴影用法
    receiveShadow: 需要在接收投影的物体上面设置receiveShadow为true
    castShadow： 在需要产生投影的物体上面设置属性castShadow为true

  3. 注意： THREE.AxisHelper is not a constructor    这个是因为最新版本的 three.js 已经更新这个api的名字 不再叫这个了
改成了。new THREE.AxisHelper()
-->
<template>
 <div class="scene" ref="sceneDom">

 </div> 
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {ref, onMounted} from 'vue'
import TWEEN from 'tween.js';
const sceneDom = ref(null)
let scene, camera, renderer, controls,plane,sphere,spotLight;

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
  // 开启场景中的阴影贴图
  renderer.setSize(sceneDom.value.clientWidth,sceneDom.value.clientHeight)

  renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
  
  sceneDom.value.appendChild(renderer.domElement)
  camera.position.set( 0, 100, 100 );
  camera.lookAt( 0, 0, 0 );
  controls = new OrbitControls(camera,renderer.domElement);
  controls.enablePan = true
  controls.update();
  const AxisHelper = new THREE.AxesHelper(100)
  scene.add( AxisHelper );
  animate()
}
// 添加一个平面地板
function createGround(){
  let material = new THREE.MeshPhongMaterial( { color: 0x666666} );
  let geometry = new THREE.PlaneGeometry( 2000, 2000 );
  plane = new THREE.Mesh( geometry, material );
  plane.position.set( 0, 0, 1 );
  plane.rotation.x = - Math.PI * 0.5;
  plane.receiveShadow = true;
  scene.add(plane)

  controls.target.copy(plane.position)
}
// 创建方块和球
function createCubeAndSphere () {
  const geom = new THREE.BoxGeometry(4, 4, 4) // 创建几何对象geom
  const material = new THREE.MeshLambertMaterial({ color: 0xff0000 }) // 创建材质对象material
  const cube = new THREE.Mesh(geom, material) // 创建网格对象cube
 cube.castShadow = true
 cube.position.set(-4, 6, 2)
 scene.add(cube) // 将网格对象添加到场景

  const sphereGeometry = new THREE.SphereGeometry(4, 26, 20) // 创建几何对象sphereGeometry
  const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff }) // 创建材质对象sphereMaterial
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial) // 创建网格对象sphere
  sphere.castShadow = true
  sphere.position.set(-4, 5, 12)
  scene.add(sphere) // 将网格对象添加到场景
}
// 创建一个据光源
function createLight(){
  const ambientLight = new THREE.AmbientLight(0xffffff) // 创建环境光
  scene.add(ambientLight) // 将环境光添加到场景

  spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set( 0, 40, 0 );
  spotLight.angle = Math.PI / 4
  spotLight.penumbra = 0.05
  spotLight.intensity = 5
  spotLight.decay = 0.1
  spotLight.distance = 0
  // const texture =  new THREE.TextureLoader().load( require('../assets/disturb.jpg') );
  // texture.minFilter = THREE.LinearFilter;
  // texture.magFilter = THREE.LinearFilter;
  // texture.colorSpace = THREE.SRGBColorSpace;

  // spotLight.map = texture

  spotLight.castShadow = true
  spotLight.shadow.mapSize.width = 1024
  spotLight.shadow.mapSize.height = 1024
  spotLight.shadow.camera.near = 10
  spotLight.shadow.camera.far = 200
  spotLight.shadow.focus = 1
  spotLight.target = sphere
  scene.add(spotLight)

  const lightHelper = new THREE.SpotLightHelper(spotLight)
  scene.add(lightHelper)
}
function tween(light) {
  new TWEEN.Tween( light ).to( {
    angle: ( Math.random() * 0.7 ) + 0.1,
    penumbra: Math.random() + 1
  }, Math.random() * 3000 + 2000 )
    .easing( TWEEN.Easing.Quadratic.Out ).start();

  new TWEEN.Tween( light.position ).to( {
    x: ( Math.random() * 30 ) - 15,
    y: ( Math.random() * 10 ) + 15,
    z: ( Math.random() * 30 ) - 15
  }, Math.random() * 3000 + 2000 )
    .easing( TWEEN.Easing.Quadratic.Out ).start();
}
function animate(){
  requestAnimationFrame( animate );
	renderer.render( scene, camera );
  controls.update();
  TWEEN.update();
  // if ( spotLight ) {
  //   spotLight.update();
  // }
}
function animateLight(){
  if(spotLight) {
    tween(spotLight)
  }
  setTimeout(animateLight,5000)
}
onMounted(()=>{
  createScene()
  createGround()
  createCubeAndSphere()
  createLight()
  animateLight()
})
</script>

<style lang="less" scoped>
.scene {
  height: 100%;
}

</style>