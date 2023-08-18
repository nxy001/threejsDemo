module.exports = "varying float vSize;\nuniform vec3 uColor;\nuniform vec3 uBaseColor;\nvoid main(){\n    float distanceToCenter = distance(gl_PointCoord,vec2(0.5,0.5));\n    float alpha = 1.0 - (distanceToCenter*2.0);\n    if(vSize<=2.0){\n        gl_FragColor = vec4(uBaseColor,alpha);\n    }else{\n        gl_FragColor = vec4(uColor,alpha);\n    }\n}"