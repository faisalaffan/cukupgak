<script setup lang="ts">
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, GraphicComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import type { Expenses } from '~/types/salary'

use([PieChart, TooltipComponent, LegendComponent, GraphicComponent, CanvasRenderer])

const props = defineProps<{ expenses: Expenses; takeHome: number }>()

const colorMode = useColorMode()
const textColor = computed(() => colorMode.value === 'dark' ? '#f3f4f6' : '#111827')
const pieBorderColor = computed(() => colorMode.value === 'dark' ? '#111827' : '#ffffff')

const fmt = (n: number) => 'Rp ' + Math.round(n / 1_000_000) + ' jt'

const labels: Record<keyof Expenses, string> = {
  housing: 'Tempat tinggal',
  transport: 'Transportasi',
  food: 'Makan',
  lifestyle: 'Gaya hidup',
  utilities: 'Utilitas',
  personal: 'Pribadi',
}

const colors: Record<keyof Expenses, string> = {
  housing: '#378ADD',
  transport: '#1D9E75',
  food: '#EF9F27',
  lifestyle: '#D4537E',
  utilities: '#7F77DD',
  personal: '#D85A30',
}

const option = computed(() => ({
  tooltip: {
    trigger: 'item' as const,
    formatter: (p: { name: string; value: number; percent: number }) =>
      `${p.name}<br/>Rp ${Math.round(p.value).toLocaleString('id-ID')} (${p.percent.toFixed(1)}%)`,
  },
  legend: { show: false },
  series: [{
    type: 'pie',
    radius: ['55%', '80%'],
    center: ['50%', '50%'],
    avoidLabelOverlap: false,
    itemStyle: { borderRadius: 4, borderColor: pieBorderColor.value, borderWidth: 2 },
    label: { show: false },
    emphasis: {
      scale: true,
      scaleSize: 6,
      label: { show: false }
    },
    data: (Object.keys(props.expenses) as (keyof Expenses)[]).map((k) => ({
      name: labels[k],
      value: props.expenses[k],
      itemStyle: { color: colors[k] },
    })),
  }],
  graphic: [{
    type: 'text',
    left: 'center',
    top: 'center',
    style: {
      text: fmt(props.takeHome),
      textAlign: 'center',
      fontSize: 13,
      fontWeight: '600',
      fill: textColor.value,
    },
  }],
}))
</script>

<template>
  <div class="w-full max-w-xs mx-auto">
    <VChart :option="option" class="h-56" autoresize />
  </div>
</template>
