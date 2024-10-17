<template>
    <div>
        <h1>登录页面</h1>
        <div>
            <label for="name">用户名:</label>
            <input v-model="name" id="name" type="text" placeholder="请输入用户名" />
        </div>
        <div>
            <label for="pass">密码:</label>
            <input v-model="pass" id="pass" type="password" placeholder="请输入密码" />
        </div>
        <button @click="handleLogin">登录</button>
        <div v-if="token">
            <h2>Token:</h2>
            <p>{{ token }}</p>
        </div>
    </div>
</template>


<script setup lang="ts">
import { loginApi } from '@/api/account';


const name = ref('admin')
const pass = ref('123456')
const token = ref('')

const handleLogin = async () => {

    const loginParams = {
        name: name.value,
        pass: pass.value,
    }

    const res = await loginApi(loginParams)
    console.log(res)
    if (res.data.token) {
        token.value = res.data.token
    }
}


</script>