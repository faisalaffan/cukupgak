<script setup lang="ts">
import { useSalaryCalculator } from '~/composables/use-salary-calculator'
import { useUrlSync } from '~/composables/use-url-sync'

const { form, result } = useSalaryCalculator()
useUrlSync(form)
</script>

<template>
  <SalaryForm v-model="form" />
  <SalaryResults :result="result" />
</template>
