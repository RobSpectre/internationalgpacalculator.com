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

const xAccessor = (d) => d.x
const yAccessor = (d) => d.y

const xTickFormat = (x) => {
    if (isXNumeric.value) return x.toString()
    const match = scaleData.value.find(d => Math.abs(d.x - x) < 0.1)
    return match ? match.intl : ''
}
</script>

<template>
  <div v-if="scaleData.length > 0" class="w-full aspect-4/3 sm:aspect-video min-h-[250px]">
     <!-- Unovis Chart with Theme Colors -->
     <VisXYContainer 
        :data="scaleData" 
        :margin="{ top: 20, right: 20, bottom: 40, left: 50 }"
        class="w-full h-full font-sans"
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
            :size="6" 
            color="var(--background)" 
            stroke-color="var(--primary)" 
            :stroke-width="2" 
        />
        <VisAxis 
            type="x" 
            label="Original Grade" 
            :tickFormat="xTickFormat"
            :gridLine="false"
            tick-text-color="var(--muted-foreground)"
            domain-line-color="var(--border)"
        />
        <VisAxis 
            type="y" 
            label="US GPA" 
            :tickValues="[0, 1, 2, 3, 4]" 
            :gridLine="true"
            grid-line-color="var(--border)"
            tick-text-color="var(--muted-foreground)"
            domain-line-color="var(--border)"
        />
        <VisCrosshair color="var(--muted-foreground)" />
        <VisTooltip />
     </VisXYContainer>
  </div>
</template>
