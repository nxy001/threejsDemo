<!--
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-28 10:20:22
 * @LastEditTime: 2023-08-29 09:20:28
 * @Description: desc
 * @FilePath: \demo\src\part\particleScene.vue
-->
<!--
  粒子系统
  points: 粒子系统及动画（构造一个下雪的场景）
  spritte: 精灵粒子系统  （构建一个萤火虫粒子系统）
  dat.gui: 构造一个切换粒子系统的选项的切换。
  涉及到 物体的销毁与重建

  gui:  
    1. new dat.gui
    2. add(对象，关键字，其他范围等配置).name(控制项命名)
    3. open 打开
    监听变化  这边使用了object.defineProperty  可以使用vue watch

    4. add(对象，关键字) 如果对应的关键字是一个方法的话  点击会触发该方法

  Points 粒子系统
    1. 必须使用PointsMaterial
    2. Points 需要使用BufferGeometry 作为geometry
    3. 构建BufferGeometry
      1. 自定义各个buffer点位
      2. 将坐标转换成一个  Float32Array的数组
      3. 使用geom.setAttribute('position',new THREE.BufferAttribute(float32Array数组,3))加载
      4. 也可以直接使用 geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
      5. 当pointsMaterial 中的vertexColors属性为true的时候需要为geometry提供colors属性
    4. 粒子动画
      1. 获取缓存中的现有的position数据：  snow.geometry.getAttribute('position')
      2. 构造每个位置变换后的位置
      3. 重新设置每个点位的缓存数据  positionAttribute.setXYZ(index,x,y,z)
      4. 允许位置缓存数据进行更新 positionAttributes.needsUpdate = true
    5. 构建sprite粒子
      1. 使用sprite 与spriteMaterial
      2. sprite 动画需要将对象暂存  然后再animate 函数中遍历 操作对象的位置等等
    -->
<template>
  <div class="scene" ref="sceneDom"></div>
</template>

<script setup>
import {ref,onMounted} from 'vue'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
// import fireflyMaterial from '../utils/fireflyMaterial'
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
}

/**
 * 添加一个gui控制器
 */
let gui;
// const guiParam = {
//   'number': 10000,
// }
// const observe = (data)=>{
//   if(!data || typeof(data)!='object') {
//     return 
//   }
//   Object.keys(data).forEach(item=>{
//     defineReactive(data,item,data[item])
//   })
// }
// let timer = null
// const defineReactive = (data,key,value) => {
//   observe(value) 
//   Object.defineProperty(data,key,{
//     enumerable: false,
//     configurable: false,
//     get: function() {
//       return value
//     },
//     set: function(val) {
//       if(timer) {
//         clearTimeout(timer)
//       }
//       timer = setTimeout(()=>{
//         guiHandler(key,val)
//       },200)

//       value = val
//     }
//   })
// }
// const guiHandler = (key,num)=>{
//   console.log(key,num)
// }

const guiParam = {
  snow:()=>{
    if(snow)return
    clearFirefly()
    snowByPoints(1000)
  },
  fireFly: ()=>{
    if(fireFlys && fireFlys.length>0) return
    clearSnow()
    fireFlyBySprite(1000)
  }
}
const addGui = () =>{
  gui = new dat.GUI()
  gui.domElement.style.right = '0px'
  gui.domElement.style.width = '300px'
  gui.add(guiParam,'snow').name('雪景')
  gui.add(guiParam,'fireFly').name('萤火虫')
  // observe(guiParam)
  gui.open()
  
}
/********gui控制器结束***** */

/**
 * 使用points 添加雪花
 */
let snow;
const snowByPoints = (number)=>{
  if(!number || typeof(number)!='number') return
  const geom = new THREE.BufferGeometry()
  const positions = []
  const colors = []
  for(let i=0;i<number;i++) {
      const x = -100 +Math.random() * 200;
      const y = Math.random() * 200;
      const z = Math.random() * 200 -100;
      positions.push( x, y, z );

      let color = new THREE.Color();
      color.setHSL( Math.random() * 0.2 + 0.5, 0.55, Math.random() * 0.25 + 0.55 );
      colors.push( color.r, color.g, color.b );
  }
  const vertices = new Float32Array(positions)
  geom.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
  geom.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  const texture = new THREE.TextureLoader().load(require('../assets/snowflake.png'))
  const material = new THREE.PointsMaterial({
    map: texture,
    size: 1,
      transparent: true,
      opacity: 1,
      vertexColors: true, //true：且该几何体的colors属性有值，则该粒子会舍弃第一个属性--color，而应用该几何体的colors属性的颜色
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
  })
  snow = new THREE.Points(geom,material)
  snow.position.set(0,0,0)
  scene.add(snow)

  const treeBg = new THREE.TextureLoader().load(require('../assets/tree.jpg'))
  treeBg.encoding = THREE.sRGBEncoding;
  scene.background = treeBg
}
const renderSnows = ()=>{
  if(snow) {
    const positionAttribute = snow.geometry.getAttribute('position')
    for(let i=0;i<positionAttribute.count;i++) {
      const pointArray = positionAttribute.array
      let x = pointArray[3*i]+0.1
      let y = pointArray[3*i+1]-0.2
      let z = pointArray[3*i+2]+0.1

      if(y<-50) {
        x = -100 +Math.random() * 200;
        y = Math.random() * 200;
        z = Math.random() * 200 -100;
      }
      positionAttribute.setXYZ(i,x,y,z)
    } 
    positionAttribute.needsUpdate = true; // 需要加在第一次渲染之后
  }
}
/**
 * 清除雪景
 */
const clearSnow = ()=>{
  if(snow) snow.parent.remove(snow)
  snow = null
}

/************points 加载雪花粒子系统完成*********** */
let fireFlys = []
const fireFlyBySprite = (num)=>{
  if(!num || typeof num !== 'number') return
  const texture = new THREE.TextureLoader().load(require('../assets/spark.png'))
 
  for(let i=0;i<num;i++) {
    const material = new THREE.SpriteMaterial({
      map: texture,
      color: new THREE.Color(Math.random() * 0.2 + 0.5, Math.random()+0.25, Math.random() * 0.25 ),
      blending: THREE.AdditiveBlending,
      opacity: Math.random(),
      transparent: true
    })


    const x = -100 +Math.random() * 200;
    const y = Math.random() * 200;
    const z = Math.random() * 200 -100;
    const mesh = new THREE.Sprite(material)
    mesh.position.set(x,y,z)
    const mx = (Math.random()-0.5)/4
    const my = (Math.random()-0.5)/4
    const mz = (Math.random()-0.5)/4
    mesh.mConfig = [mx,my,mz]
    mesh.scale.set(4,4,4)
    fireFlys.push({
      mesh,
      mOpacity: -0.01
    })
    scene.add(mesh)
    const fireflyBg = new THREE.TextureLoader().load(require('../assets/fireflyBg.webp'))
    fireflyBg.encoding = THREE.sRGBEncoding;
    scene.background = fireflyBg
  }
}

const renderFlys = ()=>{
  if(fireFlys.length>0) {
    fireFlys.forEach(obj=>{
      const item = obj.mesh
      const mConfig = item.mConfig
      const position = item.position
      let x = position.x
      let y = position.y
      let z = position.z
      if(x<-100 || z<-100 || y<0 ||x>100||z>100||z>200) {
        x = -100 +Math.random() * 200;
        y = Math.random() * 200;
        z = Math.random() * 200 -100;
        item.position.set(x,y,z)
      }else {
        item.position.set(position.x+=mConfig[0],position.y+=mConfig[1],position.z+=mConfig[2])
      }
      if(item.material.opacity <= 0.1 ){
        obj.mOpacity = 0.01
      }
      if(item.material.opacity >= 1 ){
        obj.mOpacity = -0.01
      }
      const opacity = item.material.opacity
      item.material.opacity = (opacity + obj.mOpacity)
      item.material.needsUpdate = true
    })
  }
}
/**
 * 清除萤火虫
 */
 const clearFirefly = ()=>{
  fireFlys.forEach(item=>{
    item.mesh.parent.remove(item.mesh)
  })
  fireFlys = []
}
const animate = ()=>{
  renderSnows()
  renderFlys()
  requestAnimationFrame( animate );
	renderer.render( scene, camera );
  controls.update();

}
onMounted(()=>{
  createScene()
  addGui()
})
</script>

<style scoped lang="less">
.scene {
  height: 100%;
}
</style>