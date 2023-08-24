module.exports = `varying float vSize;
  uniform vec3 uColor;
  uniform vec3 uBaseColor;
  void main(){
    float distanceToCenter = distance(gl_PointCoord,vec2(0.5,0.5));
    float alpha = 1.0 - (distanceToCenter*2.0);
    if(vSize<=2.0){
      gl_FragColor = vec4(uBaseColor,0);
    }else{
      gl_FragColor = vec4(uColor,alpha);
    }
  }`