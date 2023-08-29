import * as THREE from 'three'
class Sphere {
  constructor(){

  }
  init(){
    // 首先实现一个半球
    // const geometry = new THREE.SphereGeometry(
    //   5,
    //   36,
    //   36,
    //   0,
    //   Math.PI * 2,
    //   0,
    //   (Math.PI / 180) * 90,
    // );
    // const texture = new THREE.TextureLoader().load(require('./assets/texture1.png'))
    // // 为他增加一个shader材质：
    // const material = new THREE.ShaderMaterial({
    //   uniforms: {
    //     c: { type: 'f', value: 1.5 }, // 系数
    //     p: { type: 'f', value: 4 },   // 强度
    //     backgroundTexture: {          // 用于实现扫描效果的贴图
    //       type: 't', 
    //       value: texture 
    //     },
    //     offset,                       // 扫描的偏移量
    //     u_resolution: {               // 用于生成噪声
    //       value: new THREE.Vector2(500, 500) 
    //     },
    //     u_time: time,                 // 噪声随时间变化
    //     glowColor,                    // 光罩的颜色
    //     viewVector: {                 // 相机位置
    //       type: 'v3', value: camera.position 
    //     },
    //   },
    //   vertexShader: vertex,
    //   fragmentShader: fragment,
    //   side: THREE.FrontSide,
    //   depthWrite: false,
    //   transparent: true,
    // });


  }
}
export default Sphere