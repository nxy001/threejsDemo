/*
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-18 13:35:36
 * @LastEditTime: 2023-08-24 18:18:50
 * @Description: 构造行政区域
 * @FilePath: \demo\src\utils\map.js
 */
import * as THREE from 'three'
import * as d3 from 'd3'
import createOpacityWallMat from './material.js'
import FragmentShader from './fragment2.glsl';
import VertexShader from './vertex2.glsl';
import gsap from 'gsap';
class Map {
  /**
   * 
   * @param {Array} bounds 区域边界 [[longitude,latitude],...]
   * @param {Array} center 区域中心点 [longitude,latitude]
   */
  constructor(bounds,center){
    this.bounds = bounds
    this.center = center
  }
  /**
   * 初始化行政区域
   */
  init() {
    if(!this.bounds || this.bounds.length == 0) {
      return
    }
    const group = new THREE.Group()
    const shape = new THREE.Shape()
    let points = []
    this.bounds.forEach((item,index)=>{
      let [x,y] = projection(item)
      if(index == 0) {
        shape.moveTo(x,-y)
      }
      shape.lineTo(x,-y)
      points.push(new THREE.Vector3(x,-y,4))

    })
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const ver = new Float32Array(points.length);

    for (let i = 0; i < points.length; i++) {
      ver[i] = i;
    }

    lineGeometry.setAttribute('aIndex', new THREE.BufferAttribute(ver, 1));
    const lineMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uLength: {
          value:  points.length,
        },
        uBaseColor: {
          value: new THREE.Color('rgba(0,0,0,0)'),
        },
        uColor: {
          value: new THREE.Color('rgb(255,0,0)'),
        },
        uScale: {
          value: 0.01,
        },
        uAnimate: {
          value: true,
        },
      },
      vertexShader: VertexShader,
      fragmentShader: FragmentShader,
    });
    const lineMesh = new THREE.Points(lineGeometry,lineMaterial)

    gsap.to(lineMaterial.uniforms.uTime, {
      value: points.length,
      duration: 10,
      repeat: -1,
      onUpdate: () => {
        // // console.log(material.uniforms.uTime.value);
      },
    });
    group.add(lineMesh)




    const extrudeSettings = {
      depth: 4,
      bevelEnabled: false,
      bevelSegments: 5,
      bevelThckness: 0.1
    }
    const geometry = new THREE.ExtrudeGeometry(shape,extrudeSettings)
    const material1 = createOpacityWallMat({height: 4 })

   

    geometry.computeBoundingBox()
    let size = new THREE.Vector3()
    let center = new THREE.Vector3();
    const box = geometry.boundingBox
    console.log(box.getSize(size));
    console.log(box.getCenter(center));
    console.log(box);
    const texture = new THREE.TextureLoader().load(require('../assets/cd.jpg'))
    texture.repeat.set(1 / size.x, 1 / size.y);
    texture.offset.set(box.min.x / size.x + 0.12, box.min.y / size.y -0.155);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    const imgMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.doubleSide,
      opacity: 1,
    })
    const mesh = new THREE.Mesh(geometry, [imgMaterial,material1]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.properties = 'CHENGDU'
    mesh.name ='map'



    group.add(mesh)
    return group
  }
  createSideShaderMaterial(material) {
    material.onBeforeCompile = function (shader) {
      // console.log(shader.fragmentShader);
      shader.vertexShader = shader.vertexShader.replace(
        "void main() {",
        "varying vec4 vPosition;\nvoid main() {"
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <fog_vertex>",
        "#include <fog_vertex>\nvPosition=modelMatrix * vec4( transformed, 1.0 );"
      );
  
      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        "varying vec4 vPosition;\nvoid main() {"
      );
  
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <transmissionmap_fragment>",
        `
        #include <transmissionmap_fragment>
        float z = vPosition.z;
        float s = step(2.0,z);
        vec3 bottomColor =  vec3(.0,1.,1.0);
      
        diffuseColor.rgb = mix(bottomColor,diffuseColor.rgb,s);
        // float r =  abs( 1.0 * (1.0 - s) + z  * (0.0  - s * 1.0) + s * 4.0) ;
        float r =  abs(z  * (1.0  - s * 2.0) + s * 4.0) ;
        diffuseColor.rgb *= pow(r, 0.5 + 2.0 * s);
        
        // float c = 
      `
      );
    };
  
    return material;
  }
}
// 返回一个转换函数（）
const projection = d3
  .geoMercator()
  .center([104.065861,30.657401])
  .scale(1000)
  .translate([0, 0]);
export default Map