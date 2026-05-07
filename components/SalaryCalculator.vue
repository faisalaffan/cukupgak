<script setup lang="ts">
import { useSalaryCalculator } from '~/composables/use-salary-calculator'

const { form, result } = useSalaryCalculator()
</script>

<template>
  <SalaryForm v-model="form" />
  <SalaryResults :result="result" />
</template>
