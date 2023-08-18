/*
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-18 16:29:36
 * @LastEditTime: 2023-08-18 17:19:45
 * @Description: desc
 * @FilePath: \demo\src\utils\material.js
 */
import * as THREE from 'three'
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
          v_opacity = mix(1.0, 0.0, position.y / u_height * 1.0) * (1.0 + sin(time) * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 0.5);
      }
   `;
    // 片元着色器
    const fragmentShader = `
      uniform vec3 u_color;
      uniform float u_opacity;
      varying float v_opacity;
      void main() {
        mat4 m4 = mat4(
          cos(0.52), sin(0.52), 0.0, 0.0,
          -sin(0.52), cos(0.52), 0.0, 0.0,
          0.0,        0.0,         1.0, 0.0,
          0.0,        0.0,         0.0, 1.0
          );
          gl_FragColor = vec4(0,1,1,1);
      }
    `;

    return new THREE.ShaderMaterial({
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
          value: 0,
        },
        speed: {
          value: speed,
        },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
  };
  export default createOpacityWallMat
