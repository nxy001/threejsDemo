module.exports = `attribute float aIndex;
      uniform float uTime;
      uniform float uLength;
      uniform float uScale;
      varying float vSize;
      void main() {
        vec4 modelPosition = modelMatrix * vec4( position, 1.0 ); // 顶点坐标
        gl_Position =  projectionMatrix * viewMatrix * modelPosition;
        float size = aIndex  - uTime; 
        if(size < 0.0) {
          size = size + uLength;
        }
        vSize = (size - uLength / 2.0) * uScale; // 设置二分之一的点为不可见
        gl_PointSize = vSize<=2.0?2.0:vSize;
      }`