<template>
    <div ref="echarEl" :style="{ height: height, width: width }" :option="options" />
</template>

<script setup lang="ts">
import { EChartOption, ECharts, init } from 'echarts';
import { onMounted, ref, watch } from 'vue';


interface EchartProps {
    width?: string;
    height?: string;
    options: EChartOption;
}

const props = withDefaults(defineProps<EchartProps>(), {
    width: '600px',
    height: '400px',
    options: () => ({})
})


const echarEl = ref<HTMLDivElement | null>(null)
let chart: ECharts | null = null

const initChart = () => {

    if (chart !== undefined) {
        chart?.dispose();
    }

    if (echarEl.value) {
        chart = init(echarEl.value)
        chart.setOption(props.options)
    }
}

const resize = () => {
    if (chart) {
        chart.resize()
    }
}


onMounted(() => {
    initChart()
    window.addEventListener('resize', resize)
})


watch(() => props.options, () => {
    initChart()
}, { deep: true })

</script>

<style scoped>
.chart {
    width: 600px;
    height: 400px;
}
</style>