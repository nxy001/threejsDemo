/*
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-18 13:35:36
 * @LastEditTime: 2023-08-18 17:04:44
 * @Description: desc
 * @FilePath: \demo\src\utils\map.js
 */
import * as THREE from 'three'
import * as d3 from 'd3'
import createOpacityWallMat from './material.js'
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
    let positions = []
    this.bounds.forEach((item,index)=>{
      let [x,y] = projection(item)
      if(index == 0) {
        shape.moveTo(x,-y)
      }
      shape.lineTo(x,-y)
      positions.push(x,-y,4)

    })
    // const lineMaterial = new THREE.LineBasicMaterial({
    //   color: 'white'
    // })
    // const lineGeometry = new THREE.Line()
    // lineGeometry.setPositions(positions)
    const extrudeSettings = {
      depth: 4,
      bevelEnabled: false,
      bevelSegments: 5,
      bevelThckness: 0.1
    }
    const geometry = new THREE.ExtrudeGeometry(shape,extrudeSettings)
    const material = new THREE.MeshStandardMaterial({
      color: '#2dd35f',
      transparent: true
    })
    // let material1 = new THREE.MeshStandardMaterial({
    //   color: '#ff0000',
    //   transparent: true
    // })
    // material1 = this.createSideShaderMaterial(material1);


    // const material1 = new THREE.ShaderMaterial({
    //   side: THREE.DoubleSide,
    //   vertexShader: `
    //     varying vec2 vUv;
    //     void main() {
    //       vUv = uv;
    //       vec4 modelPosition =  modelViewMatrix * vec4(position, 1.0);
    //       vec4 projectionPosition = projectionMatrix * modelPosition;
    //       gl_Position = projectionPosition;
    //     }
    //   `,
    //   fragmentShader: `
    //     varying vec2 vUv;
    //     void main() {
    //       gl_FragColor = vec4(1.0,0.3, vUv.x, 1.0);
    //     }
    //   `,
    // })

    const material1 = createOpacityWallMat({height:10})

    const mesh = new THREE.Mesh(geometry, [material,material1]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.properties = 'CHENGDU'
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