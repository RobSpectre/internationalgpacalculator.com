<script setup>
import { useGPAStore } from '@/stores/gpa'
import { gradingScales } from '@/utils/scales'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const store = useGPAStore()
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      Grading System
    </label>
    <Select v-model="store.selectedCountry" @update:modelValue="store.setCountry">
      <SelectTrigger class="w-full">
        <SelectValue placeholder="Select a country/system" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="(scale, key) in gradingScales" :key="key" :value="key">
          {{ scale.name }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
