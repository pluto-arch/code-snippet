<template>
    <button @click="handleLogin"> {{ $t('test.welcome') }}</button>
</template>

<script setup lang="ts">
import { getDemoApi } from '@/api/account';

const handleLogin = async () => {
    const res = await getDemoApi()
    console.log(res)
}

</script>