<template>
  <div class="hello">
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
    <p>{{ state.count }}</p>
  </div>
</template>

<script setup>
import {ref, onMounted, reactive } from 'vue'
const title = ref('学习threejs')
const message = ref('使用vue搭建项目并且学习使用组合式api')
const state = reactive ({
    count: 111
  })
  
onMounted(()=>{
  title.value = '学习响应式的基础'

  console.log(state)
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
