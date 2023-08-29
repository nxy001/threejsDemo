/*
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-14 14:26:46
 * @LastEditTime: 2023-08-29 09:25:59
 * @Description: desc
 * @FilePath: \demo\src\router\index.js
 */
import { createRouter, createWebHistory } from 'vue-router';
import loadScene from '../part/loadScene.vue'
import bufferGeometry from '../part/bufferGeometry.vue'
import spotLight from '../part/spotLight.vue'
import objectThreeD from '../part/objectThreeD.vue'
import orgTree from '../part/orgTree.vue'
import mapTypeOne from '../part/mapTypeOne.vue'
import animationScene from '../part/animationScene.vue'
import particleScene from '../part/particleScene.vue'
import bloomScene from '../part/bloomScene.vue'

const routes = [
    {
        path: '/spotLight',
        name: 'spotLight',
        component: spotLight
    },
    {
      path: '/loadScene',
      name: 'loadScene',
      component: loadScene
    },
    {
      path: '/bufferGeometry',
      name: 'bufferGeometry',
      component: bufferGeometry
    },
    {
      path: '/objectThreeD',
      name: 'objectThreeD',
      component: objectThreeD
    },
    {
      path: '/orgTree',
      name: 'orgTree',
      component: orgTree
    },
    {
      path: '/mapTypeOne',
      name: 'mapTypeOne',
      component: mapTypeOne
    },{
      path: '/animationScene',
      name: 'animationScene',
      component: animationScene
    },{
      path: '/particleScene',
      name: 'particleScene',
      component: particleScene
    },{
      path: '/bloomScene',
      name: 'bloomScene',
      component: bloomScene
    }
];

const router = createRouter({
    routes,
    // 路由模式
    // history: createWebHashHistory()    // hash 模式
    history: createWebHistory()  // history 模式
});

export default router;