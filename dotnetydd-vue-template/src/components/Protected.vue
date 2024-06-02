<script setup lang="ts">

  import { onMounted, ref } from 'vue';
  import { useKeycloakStore } from '@/stores';

  const protectedData = ref("")

  function fetchProtectedData() {

    const keycloak = useKeycloakStore().keycloak
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${keycloak?.token}`);

    protectedData.value = keycloak?.token || 'no token'
    var requestOptions = {
            headers: myHeaders,
        };
     fetch('http://localhost:5281/weatherforecast', requestOptions)
        .then(response => response.text())
        .then(text => {
            protectedData.value = "Protected data loaded successfully"
            console.info(text)
        }
        )
        .catch(err => console.error(err))
  }

  onMounted(() => {
    console.log("Mounted")
    fetchProtectedData()
  })
</script>

<template>
  <h3>Data: {{ protectedData }}</h3>
</template>