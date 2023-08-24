/*
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-18 16:29:36
 * @LastEditTime: 2023-08-23 14:14:40
 * @Description: desc
 * @FilePath: \demo\src\utils\material.js
 */
import * as THREE from 'three'
// import gsap from 'gsap';
	/**
       * 创建透明墙体材质
       * option =>
       * params height color opacity speed
       * **/
  const createOpacityWallMat = ({
    height = 10,
    color = "#00ffff",
    opacity = 0.5,
    speed = 1,
  }) => {
    // 顶点着色器
    const vertexShader = `
      uniform vec3 u_color;

      uniform float time;
      uniform float u_height;
      varying float v_opacity;
 
      

      void main() {
          vec3 vPosition = position;
          v_opacity =  (vPosition.z / u_height * 1.0  - 0.5) > 0.0 ? 1.0 : 0.3;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1);

      }
   `;
    // 片元着色器
    const fragmentShader = `
      uniform vec3 u_color;
      uniform float u_opacity;
      varying float v_opacity;
      void main() {
          gl_FragColor = vec4(1,0,0, v_opacity);
      }
    `;
      const material = new THREE.ShaderMaterial({
        uniforms: {
          u_height: {
            value: height,
          },
          u_opacity: {
            value: opacity,
          },
          u_color: {
            value: new THREE.Color(color),
          },
          time: {
            value: 0.5,
          },
          speed: {
            value: speed,
          },
        },
        uAnimate: true,
        transparent: false,
        depthWrite: true,
        depthTest: true,
        side: THREE.DoubleSide,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      // let i = 0
      // setInterval(()=>{
      //   material.uniforms.time.value = i
      //   i += 0.01
      //   if(i>=1) {
      //     i=0
      //   }
      // },50)

      // gsap.to(material.uniforms.time, {
      //   value: 0,
      //   duration: 2,
      //   repeat: -1,
      //   onUpdate: () => {
      //     // // console.log(material.uniforms.uTime.value);
      //   },
      // });
    return material
  };
  export default createOpacityWallMat
