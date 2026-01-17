<script setup>
import { useGPAStore } from '@/stores/gpa'
import { computed } from 'vue'

const store = useGPAStore()
const gpa = computed(() => store.cumulativeGPA)

// Simple color coding logic
const colorClass = computed(() => {
    const val = parseFloat(gpa.value);
    if (val >= 3.5) return 'text-green-500';
    if (val >= 3.0) return 'text-blue-500';
    if (val >= 2.0) return 'text-yellow-500';
    return 'text-red-500';
})
</script>

<template>
  <div class="flex flex-col items-center justify-center p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
    <div class="text-sm font-medium text-muted-foreground uppercase tracking-wider">
      Cumulative GPA (4.0 Scale)
    </div>
    <div class="text-6xl font-extrabold mt-2 transition-colors duration-300" :class="colorClass">
      {{ gpa }}
    </div>
    <div class="text-xs text-muted-foreground mt-2">
        Based on {{ store.totalCredits }} credits
    </div>
  </div>
</template>
