<script setup>
import { ref, computed } from 'vue'
import { useGPAStore } from '@/stores/gpa'
import { calculateCourseGPA } from '@/utils/scales'
import CountrySelector from '@/components/CountrySelector.vue'
import ConversionGraph from '@/components/ConversionGraph.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-vue-next'

const store = useGPAStore()

const currentGrade = computed({
  get: () => store.courses[0].grade,
  set: (val) => store.updateCourse(store.courses[0].id, 'grade', val)
})

const calculatedGPA = computed(() => {
  return store.cumulativeGPA
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
    <Card class="w-full max-w-md shadow-xl border-accent/20">
      <CardHeader class="pb-2">
        <CardTitle class="text-2xl font-bold text-center tracking-tight">GPA Calculator</CardTitle>
        <CardDescription class="text-center">Convert international grades to US 4.0 Scale</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-6">
        
        <div class="grid gap-2">
          <Label class="text-sm font-medium">Grading System</Label>
          <CountrySelector />
        </div>

        <div v-if="store.currentScale && store.selectedCountry" class="space-y-6 animate-in slide-in-from-bottom-2 duration-500 fade-in">
            <div class="space-y-2">
              <Label class="text-xs font-semibold text-muted-foreground uppercase">Conversion Chart</Label>
              <div class="rounded-lg border bg-card p-4 shadow-sm">
                  <ConversionGraph />
              </div>
            </div>

             <Alert v-if="store.currentScale.notes" class="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200/50 dark:border-blue-800/50 pr-10 [&>svg~*]:pl-0">
                <Info class="h-4 w-4 text-blue-600 dark:text-blue-400 absolute right-4 !top-3 !left-auto" />
                <AlertTitle class="text-blue-800 dark:text-blue-300">Conversion Notes</AlertTitle>
                <AlertDescription class="text-blue-700/80 dark:text-blue-400/80 text-xs mt-1">
                  {{ store.currentScale.notes }}
                </AlertDescription>
             </Alert>
        </div>

        <div class="grid gap-2">
          <Label class="text-sm font-medium">Your Grade / Score</Label>
          <Input 
            v-model="currentGrade" 
            placeholder="e.g. 85, A, 7.5" 
            class="text-lg h-12 text-center font-medium tracking-wide"
          />
        </div>

        <div class="bg-muted/30 rounded-xl p-6 flex flex-col items-center justify-center border border-border/50">
          <p class="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Estimated US GPA</p>
          <div class="text-6xl font-black text-primary tracking-tighter" :class="{'opacity-50 blur-sm scale-95': !currentGrade, 'scale-100 blur-0 opacity-100': currentGrade}">
            <span class="transition-all duration-500 ease-out inline-block">{{ calculatedGPA }}</span>
          </div>
        </div>


      </CardContent>
      
      <CardFooter class="justify-center text-xs text-muted-foreground">
        Results are estimates based on standard conversion scales.
      </CardFooter>
    </Card>
  </div>
</template>
