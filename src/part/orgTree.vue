<!--
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-14 14:31:17
 * @LastEditTime: 2023-08-17 18:35:46
 * @Description:   注意  
  1. 最新版本的threejs中的scene.background 不生效   同时辅助坐标线条变为AxisHelper  原先的时AxesHelper 建议不要安装最新的three.js  因为他的文档没有同步更新
 * @FilePath: \threejsDemo\threejsdemo\src\part\orgTree.vue
  2. 飞线可以使用 着色器语言调整、也可以使用动画动态刷新的方法
  3. 文字加载比较复杂 可能涉及换行之类的 不太好计算、使用精灵的话又会有重叠的问题 不太好整
  4. 正交摄像头 没法通过调整相机的位置来拉近视角，也没法通过调整controls的zoom来调整  貌似zoom只读 或者是个内部属性
  5. 使用正交摄像头的好处时  可以避免 字体远近导致的大小不一的情况
-->
<template>
  <div class="scene" ref="sceneDom">

  </div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {ref, onMounted, reactive} from 'vue'
import FlyLine from '../utils/flyLine'
const sceneDom = ref(null)
let scene, camera, renderer, controls;
const objList = [
  {
    id: 'floor-0',
    w: 400,
    h: 400,
    position: {
      x:0,
      y:0,
      z:0
    },
    group: [
      {
        name: '生态环境局',
        id: '0-0',
        w: 170,
        h: 170,
        position: {
          x: -95,
          y: 95,
          z: 0,
        },
        objs: [
          {
            name: '垃圾填埋场/基础信息',
            title: 'top',
            id: '0-0-0',
            box: {
              w: 55,
              l: 30,
              h: 60,
            },
            position: {
              x: -50,
              y: 37,
              z: 30
            }
          },
          {
            name: 'PM2.5平均浓度',
            title: 'top',
            id: '0-0-1',
            box: {
              l: 30,
              w: 55,
              h: 60,
            },
            position: {
              x: 0,
              y: 37,
              z: 30,
            }
          },
          {
            name: '污染源基本信息',
            title: 'top',
            id: '0-0-2',
            box: {
              l: 30,
              w: 55,
              h: 60,
            },
            position: {
              x: 45,
              y: 37,
              z: 30
            }
          },
          {
            name: '焚烧厂负氧/实时数据',
            title: 'top',
            id: '0-0-3',
            box: {
              w: 55,
              l: 55,
              h: 30,
            },
            position: {
              x: -37,
              y: -37,
              z: 15
            }
          },
          {
            name: '焚烧厂负氧/实时数据',
            title: 'top',
            id: '0-0-4',
            box: {
              w: 55,
              l: 55,
              h: 30,
            },
            position: {
              x: 37,
              y: -37,
              z: 15
            }
          }
        ]

         
      },
      {
        name: '住建局',
        id: '0-1',
        w: 170,
        h: 170,
        position: {
          x: 95,
          y: 95,
          z: 0,
        },
        objs: [
          {
            name: '城市扬尘/监控数据',
            title: 'top',
            id: '0-1-0',
            box: {
              w: 55,
              l: 55,
              h: 30,
            },
            position: {
              x: -37,
              y: 37,
              z: 15
            }
          },
          {
            name: '城市体验指标/大类数据',
            title: 'top',
            id: '0-1-1',
            box: {
              w: 55,
              l: 55,
              h: 30,
            },
            position: {
              x: 37,
              y: 37,
              z: 15
            }
          },
          {
            name: '城市体检指标/细则数据',
            id: '0-1-2',
            title: 'top',
            box: {
              w: 55,
              l: 55,
              h: 30,
            },
            position: {
              x: -37,
              y: -37,
              z: 15
            }
          },
          {
            name: '城市体检指标/类型数据',
            id: '0-1-3',
            title: 'top',
            box: {
              w: 55,
              l: 55,
              h: 30,
            },
            position: {
              x: 37,
              y: -37,
              z: 15
            }
          }
        ]

         
      },
      {
        name: '民政局',
        title: 'top',
        id: '0-2',
        w: 170,
        h: 170,
        position: {
          x: -95,
          y: -95,
          z: 0,
        },
        objs: [
          {
            name: '社会组织/严重违法/失信名单信息',
            title: 'top',
            id: '0-2-0',
            box: {
              w: 55,
              l: 55,
              h: 30,
            },
            position: {
              x: -37,
              y: 37,
              z: 15
            }
          },
          {
            name: '社会组织/活动异常/名录信息',
            title: 'top',
            id: '0-2-1',
            box: {
              w: 55,
              l: 55,
              h: 30,
            },
            position: {
                x: 37,
              y: 37,
              z: 15
            }
          },
          {
            name: '社会团体/档案信息',
            title: 'top',
            id: '0-2-2',
            box: {
              w: 55,
              l: 55,
              h: 30,
            },
            position: {
              x: -37,
              y: -37,
              z: 15
            }
          },
          {
            name: '巾帼建功/标兵基础数据',
            title: 'top',
            id: '0-2-3',
            box: {
              w: 55,
              l: 55,
              h: 30,
            },
            position: {
              x: 37,
              y: -37,
              z: 15
            }
          }
        ]

         
      },
      {
        name: '资规局',
        id: '0-3',
        w: 170,
        h: 170,
        position: {
          x: 95,
          y: -95,
          z: 0,
        },
        objs: [
          {
            name: '使用登记物理表',
            title: 'top',
            id: '0-3-0',
            box: {
              w: 55,
              l: 55,
              h: 30,
            },
            position: {
              x: -37,
              y: 37,
              z: 15
            }
          },
          {
            name: '检验告知物理表',
            title: 'top',
            id: '0-3-1',
            box: {
              w: 55,
              l: 55,
              h: 30,
            },
            position: {
                x: 37,
              y: 37,
              z: 15
            }
          },
          {
            name: '安装告知物理表',
            title: 'top',
            id: '0-3-2',
            box: {
              w: 55,
              l: 55,
              h: 30,
            },
            position: {
              x: -37,
              y: -37,
              z: 15
            }
          },
          {
            name: '产权备案物理表',
            title: 'top',
            id: '0-3-3',
            box: {
              w: 55,
              l: 55,
              h: 30,
            },
            position: {
              x: 37,
              y: -37,
              z: 15
            }
          }
        ]

         
      },
    ]
  },
  {
    id: 'floor-1',
    group: [
      {
        name: '',
        id: '1-0',
        w: 200,
        h: 200,
        background: 'rgb(43, 137, 110)',
        position: {
          x: 0,
          y: -0,
          z: 160,
        },
        objs: [
          {
            name: '城市体检主题',
            id: '1-0-0',
            background: 'rgb(28, 191, 128)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x:60,
              y: 60,
              z: 15
            }
          },
          {
            name: '智慧建设主题',
            id: '1-0-1',
            background: 'rgb(28, 191, 128)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x: 60,
              y: 0,
              z: 15
            }
          },
          {
            name: '动物管理主题',
            id: '1-0-2',
            background: 'rgb(28, 191, 128)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x: 60,
              y: -60,
              z: 15
            }
          },
          {
            name: '市容环卫主题',
            id: '1-0-3',
            background: 'rgb(28, 191, 128)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x: 0,
              y: -60,
              z: 15
            }
          },
          {
            name: '社会团体主题',
            id: '1-0-4',
            background: 'rgb(28, 191, 128)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x: -60,
              y: -60,
              z: 15
            }
          },
        ]
      }
    ]
  },
  {
    id: 'floor-2',
    group: [
      {
        name: '',
        id: '2-0',
        w: 200,
        h: 200,
        background: 'rgb(178, 189, 166)',
        position: {
          x: 0,
          y: 0,
          z: 220,
        },
        objs: [
          {
            name: '体检指标专题',
            id: '2-0-0',
            background: 'rgb(240, 172, 19)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x:60,
              y: 60,
              z: 15
            }
          },
          {
            name: '工程建设专题',
            id: '2-0-1',
            background: 'rgb(240, 172, 19)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x: 60,
              y: 0,
              z: 15
            }
          },
          {
            name: '犬类管理专题',
            id: '2-0-2',
            background: 'rgb(240, 172, 19)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x: 60,
              y: -60,
              z: 15
            }
          },
          {
            name: '有害物质',
            id: '2-0-3',
            background: 'rgb(240, 172, 19)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x: 0,
              y: -60,
              z: 15
            }
          },
          {
            name: '异常团体专题',
            id: '2-0-4',
            background: 'rgb(240, 172, 19)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x: -60,
              y: -60,
              z: 15
            }
          },
        ]
      }
    ]
  },
  {
    id: 'floor-3',
    group: [
      {
        name: '',
        id: '3-0',
        w: 200,
        h: 200,
        background: 'rgb(72, 178, 166)',
        position: {
          x: 0,
          y: 0,
          z: 280,
        },
        objs: [
          {
            name: '亩均论英/雄引用',
            id: '3-0-0',
            background: 'rgb(33, 201, 197)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x:60,
              y: 60,
              z: 15
            }
          },
          {
            name: '生态环境/问题发现/.督察在线',
            id: '3-0-1',
            background: 'rgb(33, 201, 197)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x: 60,
              y: 0,
              z: 15
            }
          },
          {
            name: '城市运行平台',
            id: '3-0-2',
            background: 'rgb(33, 201, 197)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x: 60,
              y: -60,
              z: 15
            }
          },
          {
            name: '浙里就业/创业应用',
            id: '3-0-3',
            background: 'rgb(33, 201, 197)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x: 0,
              y: -60,
              z: 15
            }
          },
          { // “大综合一体化”/执法监/管数字
            name: '执法监/管数字',
            id: '3-0-4',
            background: 'rgb(33, 201, 197)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x: -60,
              y: -60,
              z: 15
            }
          },
          {
            name: '权力大数据/监督引用',
            id: '3-0-5',
            background: 'rgb(33, 201, 197)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x: 0,
              y: 60,
              z: 15
            }
          },
          {
            name: '协商在线',
            id: '3-0-6',
            background: 'rgb(33, 201, 197)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x: 0,
              y: 0,
              z: 15
            }
          },
          {
            name: '红色跟脉/强基引用',
            id: '3-0-7',
            background: 'rgb(33, 201, 197)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x: -60,
              y: 0,
              z: 15
            }
          },
          {
            name: '人大代表/履职应用',
            id: '3-0-8',
            background: 'rgb(33, 201, 197)',
            box: {
              w: 40,
              l: 40,
              h: 30,
            },
            position: {
              x: -60,
              y: 60,
              z: 15
            }
          },
        ]
      }
    ]
  }
]
const lineArr = [
  {
    start:{
      id: '3-0-2'
    },
    lineColor: 'rgb(255, 224, 28)',
    color: 'rgb(245, 184, 16)',
    end: [
      '2-0-0',
      '2-0-1',
      '2-0-2',
      '2-0-3',
      '2-0-4',
    ]
  },
  {
    start:{
      id: '2-0-4'
    },
    lineColor: '#8fffd6',
    color: '#baff6e',
    end: [
      '1-0-3',
    ]
  },
  {
    start:{
      id: '2-0-2'
    },
    lineColor: '#8fffd6',
    color: '#baff6e',
    end: [
      '1-0-2',
    ]
  },
  {
    start:{
      id: '2-0-1'
    },
    lineColor: '#8fffd6',
    color: '#baff6e',
    end: [
      '1-0-1',
    ]
  },
  {
    start:{
      id: '2-0-0'
    },
    lineColor: '#8fffd6',
    color: '#baff6e',
    end: [
      '1-0-0',
    ]
  },
  {
    start:{
      id: '2-0-3'
    },
    lineColor: '#8fffd6',
    color: '#baff6e',
    end: [
      '1-0-3',
    ]
  },
  {
    start:{
      id: '1-0-4'
    },
    lineColor: '#69a5ef',
    color: '#8abfff',
    end: [
      '0-2-0',
      '0-2-1',
      '0-2-2',
      '0-2-3',
    ]
  },
  {
    start:{
      id: '1-0-3'
    },
    lineColor: '#69a5ef',
    color: '#8abfff',
    end: [
      '0-0-0',
      '0-0-1',
      '0-0-2',
      '0-0-3',
      '0-0-4',
    ]
  },
  {
    start:{
      id: '1-0-1'
    },
    lineColor: '#69a5ef',
    color: '#8abfff',
    end: [
      '0-3-0',
      '0-3-1',
      '0-3-2',
      '0-3-3',
    ]
  },
  {
    start:{
      id: '1-0-0'
    },
    lineColor: '#69a5ef',
    color: '#8abfff',
    end: [
      '0-1-0',
      '0-1-1',
      '0-1-2',
      '0-1-3',
    ]
  }
]
const objsArr = reactive(objList)
const lineFlys = reactive(lineArr)
// 初始化场景
const createScene = ()=>{
  // 加载场景
  scene  = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    15,
    sceneDom.value.clientWidth / sceneDom.value.clientHeight,
    0.1,
    10000
  )
  // camera = new THREE.OrthographicCamera(
  //   sceneDom.value.clientWidth / - 2, sceneDom.value.clientWidth / 2, sceneDom.value.clientHeight / 2, sceneDom.value.clientHeight / - 2, 1, 8000 
  // )
  

  


  camera.position.set( 1300, -1300, 1000 );
  camera.lookAt( 0, 0, 160 );
  
camera.up = new THREE.Vector3(0,0,1) 


 
  renderer = new THREE.WebGLRenderer({
    antialias: true, //开启锯齿
    alpha: true
})
  renderer.setSize(sceneDom.value.clientWidth,sceneDom.value.clientHeight)
  renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  controls = new OrbitControls(camera,renderer.domElement);
  controls.enablePan = true
  controls.update();
  controls.target = new THREE.Vector3(0,0,100);
  controls.maxPolarAngle = Math.PI * 0.45;

  // const axes = new THREE.AxesHelper(300)
  // scene.add(axes)
  scene.background = new THREE.Color(0,0,0);
  sceneDom.value.appendChild(renderer.domElement)

  
  animate()
}


function animate(){
  requestAnimationFrame( animate );
	renderer.render( scene, camera );
  controls.update();
}
onMounted(()=>{
  createScene()
  createOrgTree()
  createLights()
  createFlyLine()
  createPolygon()
})
// 创建组织架构树
function createOrgTree(){
  const list = objsArr
  if(list.length==0) return
  const bigObject = new THREE.Object3D()
  list.forEach(item=>{
    const {w,h,position,group} = item
    const object1 = new THREE.Object3D()

    if(w && h && position) {
      const geometry = new THREE.PlaneGeometry( w, h );
      const material = new THREE.MeshPhongMaterial( {color: item.background || 'rgb(27, 142, 205)', side: THREE.DoubleSide} );
      const plane = new THREE.Mesh( geometry, material );
      const {x,y,z} = position
      plane.position.set(x,y,z)
      object1.add(plane)

    }
    createGroup(group)
    bigObject.add(object1)
  }) 
  scene.add( bigObject );

}
// 加载单个组数据
function createGroup(list) {
  if(!list || list.length ===0) return 
  list.forEach(item=>{
    const {name,w,h,position,objs} = item
    // 创建底部
    const object1 = new THREE.Object3D()
    const geometry = new THREE.PlaneGeometry( w, h );
		const material = new THREE.MeshStandardMaterial( {color: item.background || 'rgb(18, 89, 141)', side: THREE.DoubleSide} );
		const plane = new THREE.Mesh( geometry, material );
		const {x,y,z} = position
    plane.receiveShadow = true
    

    plane.name = name
    object1.add(plane)

    // 生成物体
    const objArr = createObject(objs)
    objArr.forEach(item1=>{
      object1.add(item1)
    })
    // 添加文字
    const fontObj = createFont(name)
    fontObj.position.set(65,-100,15)
    fontObj.rotateX(Math.PI/2)
    object1.add(fontObj)

    object1.position.set(x,y,z+2)



    scene.add(object1)
  })
}
// 添加单个物体
function createObject(list) {
  if(!list || list.length==0) return
  const objArr = []
  list.forEach(item=>{
    const {name,id,box,position} = item
    const {l,w,h} = box
    const geom = new THREE.BoxGeometry(l,w,h)
    const material = new THREE.MeshPhongMaterial({
      color: item.background || 'rgb(12, 92, 191)'
    })
    // 添加正方体
    const obj = new THREE.Mesh(geom,material)
    const {x,y,z} = position
    obj.position.set(x,y,z)
    if(item.id.indexOf('0-')==0) {
      obj.scale.set(0.8,0.8,0.8)
    }else {
      obj.scale.set(0.5,0.5,0.5)
    }
    obj.name = id
    obj.castShadow = true

    // 添加文字
    const fontObj = createObjFont(name.split("/"))
    if(item.title=='top') {
      fontObj.position.set(x+40,y-10,z+5)
    }else {
      const nameGroups = name.split("/").length
      fontObj.position.set(x+40,y-30,z-15+nameGroups*15)
    }
    fontObj.rotateX(Math.PI/2)
    fontObj.rotateY(Math.PI/4)

    objArr.push(fontObj)
    objArr.push(obj)

  })
  return objArr
}

// 添加一个文字
const createFont = (str)=>{
  const geometry = new THREE.PlaneGeometry(70,30)

  const material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(createFontCanvas([str],40)),
    side: THREE.doubleSide,
    opacity: 1,
    transparent: true, // 设为透明
  })
  const rect = new THREE.Mesh(geometry,material)
  return rect
}

// 添加一个文字
const createObjFont = (strArr)=>{
  const fontSize = 15
  let maxLength = 0
  strArr.forEach(item=>{
    if(item.length>maxLength) maxLength = item.length
  })
  let width = 0
  let height = 0
  if(strArr.length==1){
    height = strArr.length*fontSize*3.3
    width = maxLength*fontSize
  }else if(strArr.length == 2) {
    height = strArr.length*fontSize*1.4
    width = maxLength*fontSize* 1.4
  }else if(strArr.length==3) {
    height = strArr.length*fontSize*1
    width = maxLength*fontSize* 1
  }
  const geometry = new THREE.PlaneGeometry(width,height)

  const texture = new THREE.TextureLoader().load(createFontCanvas(strArr,fontSize,width,height,'#fff'))
  texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	// uv两个方向纹理重复数量
  texture.repeat.set(1, 1);

  const material = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.doubleSide,
    opacity: 1,
    transparent: true, // 设为透明
  })
  const rect = new THREE.Mesh(geometry,material)

  // const spriteMap = new THREE.TextureLoader().load(createFontCanvas([str],str.length*30,20,8,'#fff'))
  // const spriteMaterial = new THREE.SpriteMaterial({map:spriteMap,color:0xffffff,sizeAttenuation:false,depthTest:false})
  // const sprite = new THREE.Sprite(spriteMaterial)
  // sprite.scale.set(0.5,0.3,0.3)


 
  return rect
}
// 构建文字canvas
const createFontCanvas = (fontStr, fontSize=14,width,height, fontColor='#fff', background='transparent' )=>{
  const canvas = document.createElement('canvas')
  canvas.style.letterSpacing =  '0px';	
  const ct = canvas.getContext('2d')
  ct.fillStyle = background || 'transparent';
  ct.fillRect(0,0,width,height)

  ct.font = `normal ${fontSize*2}px "楷体"`
  ct.fillStyle = fontColor
  fontStr.forEach((v,i)=>{
    ct.fillText(`${v}`, 10, (i+1)*(fontSize)*2);
  });
  ct.fillStyle = "transparent";  // 设为透明
  // 生成图片url
  const url = canvas.toDataURL('image/png');
  return url

}
// 构建光效
const createLights = function(){
  const ambientLight = new THREE.AmbientLight('rgba(255,255,255,0.8)')
  // 从上方照射的白色平行光，强度为 0.5。
  const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.castShadow = true
  directionalLight.position.set(1000,0,0)
  scene.add( directionalLight );

  const directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.4 );
  directionalLight1.castShadow = true
  directionalLight1.position.set(0,-1000,0)
  scene.add( directionalLight1 );



  scene.add(ambientLight)

  const spotLight = new THREE.PointLight('#bee7ff')
  spotLight.position.set(0,0,100 );
  spotLight.angle = Math.PI / 3
  spotLight.penumbra = 0.05
  spotLight.intensity = 5
  spotLight.decay = 0.1
  spotLight.distance = 400
  spotLight.castShadow = true
  spotLight.shadow.mapSize.width = 216
  spotLight.shadow.mapSize.height = 216
  spotLight.shadow.camera.near = 10
  spotLight.shadow.camera.far = 20
  spotLight.shadow.fov = 50
  scene.add(spotLight)

}

// 创建飞线
const createFlyLine = function(){
  const list = lineFlys
  for(let i=0;i<list.length;i++) {
    const item = list[i]
    const {start,lineColor,color,end} = item
    const startPosition = getPositionById(start.id)
    for(let j=0;j<end.length;j++) {
      const endPosition = getPositionById(end[j])
      
      const flyLine = new FlyLine(startPosition,endPosition,{
        lineType: 2,
        scale: 0.01,
        color: new THREE.Color(color),
        baseColor: new THREE.Color(lineColor)
      })
      const obj = flyLine.init()
      scene.add(obj)
    }

    console.log(lineColor,color,end)
  }
  console.log(lineFlys)
}
// 根据物体id获取世界坐标
const getPositionById = function (id){
  const startObj = scene.getObjectByName(id)
  // 声明一个三维向量用来保存世界坐标
  const worldPosition = new THREE.Vector3();
  // 执行getWorldPosition方法把模型的世界坐标保存到参数worldPosition中
  startObj.getWorldPosition(worldPosition);
  return worldPosition
}
// 构造多面体
const createPolygon = function(){
  const data = [[
    -200, -200, 0,
    -200, 200, 0,
    -100, 100, 280,
    -100, 100, 280,
    -100, -100, 280,
    -200, -200, 0,
  ],[
    200, 200, 0,
    -200, 200, 0,
    -100, 100, 280,

    -100, 100, 280,

    100, 100, 280,
    200, 200, 0,
  ]]
  data.forEach(item=>{
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array( item );
    
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    const material = new THREE.MeshBasicMaterial( { color: 'rgb(21, 144, 255)',opacity:0.2,transparent: true,side:THREE.DoubleSide } );
    const mesh = new THREE.Mesh( geometry, material );
    scene.add(mesh)
  })


  const lineData = [
    [
      100,100,280,
      200,200,0
    ],
    [
      -100,100,280,
      -200,200,0
    ],
    [
      100,-100,280,
      200,-200,0
    ],
    [
      -100,-100,280,
      -200,-200,0
    ]
  ]
  lineData.forEach(item=>{
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array( item );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    const material = new THREE.LineBasicMaterial({
      color: 'rgb(23, 242, 238)'
    })
    const line = new THREE.Line(geometry,material)
    scene.add(line)
  })

  
}
</script>

<style scoped lang="less">
.scene {
  height: 100%;
  background: #fff;
}
</style>