/*
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-25 11:21:20
 * @LastEditTime: 2023-08-25 13:39:01
 * @Description: desc
 * @FilePath: \demo\src\utils\particle\snow.js
 */
import * as THREE from 'three'
class Snow {
  constructor(){
		this.count = 10000
  }
  init(){
    const geom = new THREE.BufferGeometry()

    const positions = []
    const colors = []
    for (let i = 0; i < this.count; i ++) {
      let vertex = new THREE.Vector3();
      vertex.x = Math.random() * 2 - 1;
      vertex.y = Math.random() * 2 - 1;
      vertex.z = Math.random() * 2 - 1;
      positions.push( vertex.x, vertex.y, vertex.z );
      let color = new THREE.Color();
      color.setHSL( Math.random() * 0.2 + 0.5, 0.55, Math.random() * 0.25 + 0.55 );
      colors.push( color.r, color.g, color.b );
    }
    geom.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    geom.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
		
    const snowMaterial = new THREE.PointsMaterial( {
      map: new THREE.TextureLoader().load(require('../../assets/snowflake.png')),
      size: 1,
      transparent: true,
      opacity: 1,
      vertexColors: true, //true：且该几何体的colors属性有值，则该粒子会舍弃第一个属性--color，而应用该几何体的colors属性的颜色
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    } );

    let snow = new THREE.Points( geom, snowMaterial );
    snow.scale.set( 300, 300, 300 );
    return snow
  }
}
export default Snow