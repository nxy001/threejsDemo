import * as THREE from 'three';
import gsap from 'gsap';
import FragmentShader1 from './fragment.glsl';
import VertexShader1 from './vertex.glsl';

import FragmentShader2 from './fragment1.glsl';
import VertexShader2 from './vertex1.glsl';

export default class FlyLine {
  constructor(
    fromPosition,
    toPosition,
    opt = {
      lineType: 1, //
      scale: 0.015,
      color: new THREE.Color('#ffffff'),
      timeDuration: 3,
      animate: true,
      baseColor: new THREE.Color('#ff0000')
    }
  ) {
    this.fromPosition = new THREE.Vector3(
      fromPosition.x,
      fromPosition.y,
      fromPosition.z
    );
    this.toPosition = new THREE.Vector3(
      toPosition.x,
      toPosition.y,
      toPosition.z
    );
    this.scale = opt.scale || 0.015;
    this.timeDuration = opt.timeDuration || 3;
    this.color = opt.color || new THREE.Color('#ffffff');
    this.baseColor = opt.baseColor || new THREE.Color('#ff0000');
    this.animate = opt.animate === undefined ? true : opt.animate;

    if (opt.lineType == 1 || opt.lineType) {
      this.FragmentShader = FragmentShader1;
      this.VertexShader = VertexShader1;
    }

    if (opt.lineType == 2) {
      this.FragmentShader = FragmentShader2;
      this.VertexShader = VertexShader2;
    }
  }

  init() {
    const curve = setCubicBezierCurve(this.fromPosition, this.toPosition);

    const points = curve.getPoints(1000);
    const geom = new THREE.BufferGeometry().setFromPoints(points);

    const ver = new Float32Array(points.length);

    for (let i = 0; i < points.length; i++) {
      ver[i] = i;
    }

    geom.setAttribute('aIndex', new THREE.BufferAttribute(ver, 1));
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uLength: {
          value: points.length,
        },
        uBaseColor: {
          value: this.baseColor,
        },
        uColor: {
          value: this.color,
        },
        uScale: {
          value: this.scale,
        },
        uAnimate: {
          value: this.animate,
        },
      },
      vertexShader: this.VertexShader,
      fragmentShader: this.FragmentShader,
    });

    gsap.to(material.uniforms.uTime, {
      value: points.length,
      duration: 3,
      repeat: -1,
      onUpdate: () => {
        // // console.log(material.uniforms.uTime.value);
      },
    });
    const mesh = new THREE.Points(geom, material);

    return mesh;
  }
}

function setCubicBezierCurve(fromPosition, toPosition) {
  const dn = 2; // 将线分成3份,取三分之一处的点
  // 获取两点的中心点,
  //控制点1, 1/dn处的点
  const controlP1 = new THREE.Vector3(
    (dn * fromPosition.x + toPosition.x) / (dn + 1),
    (dn * fromPosition.y + toPosition.y) / (dn + 1),
    (dn * fromPosition.z + toPosition.z) / (dn + 1)
  );
  //控制点2,  (dn-1)/dn处的点
  const controlP2 = new THREE.Vector3(
    (fromPosition.x + dn * toPosition.x) / (dn + 1),
    (fromPosition.y + dn * toPosition.y) / (dn + 1),
    (fromPosition.z + dn * toPosition.z) / (dn + 1)
  );


  // 控制点在半径往外延伸(dis * 0.3)的地方, earthRadius为0的话,代表是在平面上,所以默认为0.9
  const dbulge1 =  1.2; // 圆弧往外延伸的第一个控制点 (根弧在同一个平面上)
  const dbulge2 =  1.2; // 圆弧往外延伸的第二个控制点 (根弧在同一个平面上)

  return new THREE.CubicBezierCurve3(
    // 起始点
    new THREE.Vector3(fromPosition.x, fromPosition.y, fromPosition.z),
    new THREE.Vector3(
      controlP1.x * dbulge1,
      controlP1.y * dbulge1,
      controlP1.z * dbulge1
    ),

    new THREE.Vector3(
      controlP2.x * dbulge2,
      controlP2.y * dbulge2,
      controlP2.z * dbulge2
    ),
    // 结束点
    new THREE.Vector3(toPosition.x, toPosition.y, toPosition.z)
  );
}
