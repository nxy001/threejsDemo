<!--
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-14 11:15:21
 * @LastEditTime: 2023-08-29 09:25:28
 * @Description: desc
 * @FilePath: \demo\src\App.vue
-->
<template>
  <div class="container">
    <div class="left-nav">
      <div class="nav" :class="{active:item.path===activePath}" v-for="(item,index) in navList" :key="index" @click="navTo(item)">
        {{ item.name }}
      </div>
    </div>
    <div class="box">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
const router = useRouter()
// 左侧导航模块
const navList = ref([
  {
    name: '加载场景',
    id: 'loadScene',
    path: 'loadScene'
  },
  {
    name: 'BufferGeometry',
    id: 'bufferGeometry',
    path: 'bufferGeometry'
  },
  {
    name: '聚光源',
    id: 'spotLight',
    path: 'spotLight'
  },
  {
    name: '3d物体',
    id: 'objectThreeD',
    path: 'objectThreeD'
  },
  {
    name: '架构图',
    id: 'orgTree',
    path: 'orgTree'
  },
  {
    name: '行政区划',
    id: 'mapTypeOne',
    path: 'mapTypeOne'
  },
  {
    name: '特效',
    id: 'animationScene',
    path: 'animationScene'
  },
  {
    name: '粒子系统',
    id: 'particleScene',
    path: 'particleScene'
  },
  {
    name: '辉光',
    id: 'bloomScene',
    path: 'bloomScene'
  }
])
// 被激活的菜单
const activePath = ref('')
const navTo = (info)=>{
  if(info.path) {
    router.push({
      path: info.path
    })
    activePath.value = info.path
  }
}
</script>

<style scoped lang="less">
html,body {
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
  background: #fff;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  
  .container{
    height: 100%;
    display: flex;
    .left-nav {
      width: 20%;
      height: 100%;
      border-right: 1px solid #999;
      padding: 20px;
      box-sizing: border-box;
      .nav {
        position: relative;
        font-size: 16px;
        width: 100%;
        height: 40px;
        line-height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #222;
        padding-left: 15px;
        box-sizing: border-box;
        cursor: pointer;
        &::before{
          position: absolute;
          content: '';
          width: 8px;
          height: 8px;
          background: #000;
          border-radius: 50%;
          top: 16px;
          left: 0;
        }

        &.active {
          color: rgb(0, 140, 255);
          &::before{
            position: absolute;
            content: '';
            width: 8px;
            height: 8px;
            background: rgb(0, 140, 255);
            border-radius: 50%;
            top: 16px;
            left: 0;
          }
        }
      }
    }
    .box {
      flex: 1;
      padding: 20px;
      box-sizing: border-box;
    }
  }
  
}
</style>
