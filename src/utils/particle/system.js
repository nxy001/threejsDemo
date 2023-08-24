import * as THREE from 'three'
class System {
  constructor({
    scene = null,
    count = 100000, 
    xRange = [-1,1],
    yRange = [-1,1],
    zRange = [0,2],
    texture = null,
  }){
    this.count = count // 粒子个数
    this.xRange = xRange // x轴边界范围
    this.yRange = yRange // y轴边界范围
    this.zRange = zRange // z轴边界范围
    this.texture = texture // 贴图
    this.scene = scene
  }
  /**
   * 初始化
   */
  init(){
    const geometry = new THREE.BufferGeometry();
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
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    const starsMaterial = new THREE.PointsMaterial( {
      map: new THREE.TextureLoader().load(require('../../assets/spikey.png')),
      size: 1,
      transparent: true,
      opacity: 1,
      vertexColors: true, //true：且该几何体的colors属性有值，则该粒子会舍弃第一个属性--color，而应用该几何体的colors属性的颜色
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    } );

    let stars = new THREE.Points( geometry, starsMaterial );
    stars.scale.set( 300, 300, 300 );
    return stars
  }
}
export default System