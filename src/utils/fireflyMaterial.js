/*
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-28 16:14:29
 * @LastEditTime: 2023-08-28 16:21:40
 * @Description: desc
 * @FilePath: \demo\src\utils\fireflyMaterial.js
 */
import * as THREE from 'three'

const createMaterial = ()=>{
  const uniforms = {
    opacity: 1,
    texture1 : {value : new THREE.TextureLoader().load(require('../assets/spark.png'))}
  }
  const vertexShader = `
  varying vec2 vUv;
  void main()
      {
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          gl_Position = projectionMatrix * mvPosition;

      }
  `
  const fragmentShader = `
    //获取纹理
    uniform sampler2D texture1;
    //纹理坐标
    varying vec2 vUv;
    

    void main(void){
        gl_FragColor = texture2D(texture1, vUv);
    }
  `
  const material = new THREE.ShaderMaterial({
    uniforms : uniforms,
    vertexShader,
    fragmentShader,
    blending: THREE.AdditiveBlending,
    side:THREE.DoubleSide,
    color: new THREE.Color(Math.random() * 0.2 + 0.5, Math.random()+0.25, Math.random() * 0.25 ),
    transparent: true,
  })
  return material
}
export default createMaterial