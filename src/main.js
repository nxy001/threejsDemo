/*
 * @Author: NIXY
 * @LastEditors: NIXY
 * @Date: 2023-08-14 11:15:21
 * @LastEditTime: 2023-08-14 14:44:24
 * @Description: desc
 * @FilePath: \threejsDemo\threejsdemo\src\main.js
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'


const app = createApp(App)
app.use(router).mount('#app')
app.config.errorHandler = (err) => {
  console.log('111',err)
}
