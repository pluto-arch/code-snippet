<template>
  <div>
    <MyEchart width="100%" height="400px" :options="options" />
  </div>
  <el-button @click="setvalue">Button</el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MyEchart from './components/MyEchart.vue';


const options = ref({
  title: {
    text: 'ECharts entry example'
  },
  tooltip: {},
  legend: {
    data: ['Sales']
  },
  xAxis: {
    data: ['shirt', 'cardign', 'chiffon shirt', 'pants', 'heels', 'socks']
  },
  yAxis: {},
  series: [{
    name: 'Sales',
    type: 'bar',
    data: [5, 20, 36, 10, 10, 20]
  }]
});

const setvalue = () => {
  options.value.series[0].data = [10, 20, 109, 10, 10, 20];
}

</script>

<style scoped>
.chart {
  width: 600px;
  height: 400px;
}
</style>