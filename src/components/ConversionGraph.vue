<script setup>
import { computed, ref } from 'vue'
import { useGPAStore } from '@/stores/gpa'
import { gradingScales } from '@/utils/scales'
import { VisXYContainer, VisLine, VisAxis, VisScatter, VisTooltip, VisCrosshair } from '@unovis/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const store = useGPAStore()

const scaleData = computed(() => {
    const scale = gradingScales[store.selectedCountry]
    if (!scale) return []

    return scale.intlScale.map((intl, i) => {
        let us = parseFloat(scale.usScale[i])
        // Handle case where US scale might be non-numeric (unlikely for GPA, but safety first)
        if (isNaN(us)) us = 0

        // Check if intl is numeric
        const intlNum = parseFloat(intl)
        const isNumeric = !isNaN(intlNum)

        return {
            intl, // Original label
            x: isNumeric ? intlNum : i,
            y: us,
            isNumeric
        }
    }).reverse() // Usually data is high-to-low, graph might look better low-to-high?
                 // If data is 10, 9, 8, 7. X=10, Y=4.0. X=7, Y=2.0.
                 // A simple line plot is fine.
})

// Check if we are using numeric X axis or categorical (index)
const isXNumeric = computed(() => {
    return scaleData.value.every(d => d.isNumeric)
})

const xTickValues = computed(() => {
    if (!isXNumeric.value) return undefined // Let Unovis handle categorical
    const numericData = scaleData.value.map(d => d.x)
    if (numericData.length === 0) return []
    
    const min = Math.min(...numericData)
    const max = Math.max(...numericData)
    const range = max - min
    
    // Target 5-9 ticks
    // Try step sizes: 1, 2, 5, 10, 20, 25, 50, 100
    const steps = [1, 2, 5, 10, 20, 25, 50, 100]
    let step = 1
    
    for (const s of steps) {
        if (range / s <= 9) {
            step = s
            break
        }
    }
    
    const ticks = []
    let current = Math.ceil(min / step) * step
    while (current <= max) {
        ticks.push(current)
        current += step
    }
    
    return ticks
})

const xAccessor = (d) => d.x
const yAccessor = (d) => d.y
</script>

<template>
  <div class="h-full w-full">
     <VisXYContainer
       :data="scaleData"
       :margin="{ top: 20, right: 30, bottom: 50, left: 60 }"
       :yDomain="[1.0, 4.0]"
       class="w-full h-full font-sans font-medium"
     >
       <VisLine
         :x="xAccessor"
         :y="yAccessor"
         color="var(--primary)"
         :strokeWidth="3"
       />
       <VisScatter
         :x="xAccessor"
         :y="yAccessor"
         :size="8"
         color="var(--background)"
         stroke-color="var(--primary)"
         :stroke-width="2"
       />
       <VisAxis
         type="x"
         label="Original Grade"
         :gridLine="true"
         :domainLine="false"
         :tickValues="xTickValues"
         tick-text-color="var(--muted-foreground)"
         grid-line-color="var(--border)"
         domain-line-color="var(--border)"
       />
       <VisAxis 
         type="y" 
         label="US GPA" 
         :domainLine="false" 
         :gridLine="true"
         :tickValues="[1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0]"
         :tickFormat="(y) => y.toFixed(1)"
         tick-text-color="var(--muted-foreground)"
         grid-line-color="var(--border)"
         domain-line-color="var(--border)"
       />
       <VisCrosshair color="var(--primary)" :strokeWidth="1" template="<div style='background: var(--card); border: 1px solid var(--border); color: var(--card-foreground); padding: 4px 8px; border-radius: 4px; font-size: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>{{x}}: {{y}}</div>" /> 
     </VisXYContainer>
  </div>
</template>
