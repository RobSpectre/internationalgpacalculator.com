<script setup>
import { ref, computed } from 'vue'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useGPAStore } from '@/stores/gpa'
import { gradingScalesList } from '@/utils/scales'

const store = useGPAStore()
const open = ref(false)

const selectedName = computed(() => {
  if (!store.selectedCountry) return 'Click here to search for a school or country...'
  const found = gradingScalesList.find((s) => s.id === store.selectedCountry)
  return found ? found.name : 'Select a country/system...'
})

function handleSelect(scaleId) {
  store.setCountry(scaleId)
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-full justify-between font-normal text-muted-foreground"
        :class="{ 'text-foreground font-medium': store.selectedCountry }"
      >
        <span class="truncate">{{ selectedName }}</span>
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[--radix-popover-trigger-width] p-0" align="start">
      <Command>
        <CommandInput class="h-9" placeholder="Type a country or university name..." />
        <CommandEmpty>No results found for your search.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="scale in gradingScalesList"
              :key="scale.id"
              :value="scale.name"
              @select="handleSelect(scale.id)"
            >
              {{ scale.name }}
              <Check
                :class="cn(
                  'ml-auto h-4 w-4',
                  store.selectedCountry === scale.id ? 'opacity-100' : 'opacity-0'
                )"
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
