<template>
  <div>
    <div>数量:{{ countComputed }}</div>
    <el-button type="primary"
      size="default"
      @click="countStore.countAdd"> +1 </el-button>
    <el-button type="primary"
      size="default"
      @click="countStore.countAdd"> -1 </el-button>
    <el-button type="primary"
      size="default"
      @click="login"> 登录 </el-button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCountStore, useKeycloakStore } from '@/stores'

const countStore = useCountStore()
const keycloakStore = useKeycloakStore()

// 通过计算属性
const countComputed = computed(() => countStore.count)

const login = () => {
  keycloakStore.keycloak
    .login()
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>
