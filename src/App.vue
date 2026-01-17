<script setup>
import { ref, computed, watch } from 'vue'
import { useGPAStore } from '@/stores/gpa'
import { usePostHog } from '@/composables/usePostHog' // Import composable
import CountrySelector from '@/components/CountrySelector.vue'
import ConversionGraph from '@/components/ConversionGraph.vue'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sun, Moon, GraduationCap, Calculator, TrendingUp } from 'lucide-vue-next'

const store = useGPAStore()
const { posthog } = usePostHog() // Init PostHog

const currentGrade = computed({
  get: () => store.courses[0].grade,
  set: (val) => store.updateCourse(store.courses[0].id, 'grade', val)
})

const calculatedGPA = computed(() => store.cumulativeGPA)

// Analytics Tracking
watch(() => store.selectedCountry, (newVal) => {
  if (newVal) {
    const scale = store.currentScale
    posthog.capture('school_selected', { 
      school_id: newVal,
      school_name: scale?.name 
    })
  }
})

let gpaDebounce
watch(currentGrade, (newVal) => {
  if (gpaDebounce) clearTimeout(gpaDebounce)
  gpaDebounce = setTimeout(() => {
    if (newVal) {
      posthog.capture('gpa_input', { 
        input_value: newVal,
        result_gpa: calculatedGPA.value,
        school_id: store.selectedCountry
      })
    }
  }, 1500) // 1.5s debounce to capture "final" input
})

const isDark = ref(false)

const toggleDark = () => {
    isDark.value = !isDark.value;
    const html = document.documentElement;
    if (isDark.value) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
}
</script>

<template>
  <div class="min-h-screen w-full bg-background transition-colors duration-300 p-4 flex flex-col items-center justify-center">
    
    <!-- Main Content Stack -->
    <div class="w-full max-w-lg flex flex-col gap-[45px] px-2">
      
      <!-- Header & Input Card (Always Visible) -->
      <Card class="border-border shadow-sm">
        <CardHeader class="p-6 border-b bg-primary text-primary-foreground">
          <div class="flex items-center justify-between">
             <div class="flex items-center gap-3">
               <div class="bg-white/10 p-2 rounded-xl shadow-sm border border-white/20">
                 <GraduationCap class="h-6 w-6 text-white" />
               </div>
               <div>
                  <CardTitle class="text-xl font-semibold uppercase tracking-widest">International GPA Calculator</CardTitle>
                  <CardDescription class="text-primary-foreground/80">International grade point average to US 4.0 Scale</CardDescription>
               </div>
             </div>
             <!-- Theme Toggle (Moved Here) -->
             <Button variant="ghost" size="icon" @click="toggleDark" class="rounded-full h-9 w-9 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Sun v-if="isDark" class="h-4 w-4" />
                <Moon v-else class="h-4 w-4" />
                <span class="sr-only">Toggle theme</span>
             </Button>
          </div>
        </CardHeader>
        <CardContent class="grid gap-6 p-6! md:p-10!">
          <div class="space-y-2">
            <Label class="text-sm font-medium ml-1">Select Grading System</Label>
            <CountrySelector />
          </div>

          <div class="space-y-2">
            <Label class="text-sm font-medium ml-1">Enter Grade Point Average</Label>
            <Input 
              v-model="currentGrade" 
              placeholder="e.g. 85, A, 7.5" 
              class="h-14 text-lg font-medium"
            />
          </div>
        </CardContent>
      </Card>

      <!-- Result Card (Conditional) -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-4 opacity-0"
      >
        <Card v-if="currentGrade" class="border-border shadow-sm overflow-hidden bg-primary text-primary-foreground relative">
            <div class="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none"></div>
            <CardContent class="p-8 text-center relative z-10 flex flex-col items-center justify-center gap-2">
               <span class="text-sm font-semibold uppercase tracking-widest opacity-90">Estimated US GPA</span>
               <div class="text-8xl font-black tracking-tighter leading-none">
                 {{ calculatedGPA || '0.0' }}
               </div>
            </CardContent>
        </Card>
      </transition>

      <!-- Visualization Card (Conditional) -->
      <transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div v-if="store.selectedCountry" class="space-y-6">
           <Card class="border-border shadow-sm flex flex-col overflow-hidden">
              <CardHeader class="p-4 px-6 border-b bg-primary text-primary-foreground flex flex-row items-center gap-2">
                 <TrendingUp class="h-4 w-4 text-primary-foreground/80" />
                 <CardTitle class="text-sm font-semibold uppercase tracking-widest text-primary-foreground">Conversion Scale</CardTitle>
              </CardHeader>
              <CardContent class="p-4! md:p-8! flex-1 min-h-[320px] bg-background/50">
                   <div class="w-full h-full">
                      <ConversionGraph />
                   </div>
              </CardContent>
           </Card>

           <!-- Notes Card (Conditional Nested) -->
           <Card v-if="store.currentScale?.notes" class="border-border shadow-sm bg-muted/50">
              <CardContent class="p-8 flex gap-4 items-start">
                 <div class="bg-primary/10 p-2 rounded-full shrink-0 mt-0.5">
                    <Calculator class="h-4 w-4 text-primary" />
                 </div>
                 <div class="space-y-1">
                   <h4 class="text-sm font-semibold uppercase tracking-widest text-foreground">Conversion Notes</h4>
                   <p class="text-sm text-muted-foreground leading-relaxed">
                     {{ store.currentScale.notes }}
                   </p>
                 </div>
              </CardContent>
           </Card>
        </div>
      </transition>

      <div class="flex justify-center pt-8 opacity-50">
          <p class="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
             For informational purposes only
          </p>
      </div>

    </div>
  </div>
</template>
