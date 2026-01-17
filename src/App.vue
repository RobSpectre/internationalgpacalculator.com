<script setup>
import { useGPAStore } from '@/stores/gpa'
import { Trash2, Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import CountrySelector from '@/components/CountrySelector.vue'
import GPADisplay from '@/components/GPADisplay.vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const store = useGPAStore()
</script>

<template>
  <div class="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans antialiased">
    <div class="max-w-4xl mx-auto space-y-8">
      
      <div class="text-center space-y-2">
        <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          International GPA Calculator
        </h1>
        <p class="text-muted-foreground">
          Convert your international grades to the US 4.0 scale instantly.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <!-- Sidebar / Controls -->
        <div class="space-y-6">
            <GPADisplay />
            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <CountrySelector />
                </CardContent>
            </Card>
        </div>

        <!-- Main Course List -->
        <Card class="md:col-span-2">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                <div class="space-y-1">
                    <CardTitle>Courses</CardTitle>
                    <CardDescription>Enter your grades below.</CardDescription>
                </div>
                <Button @click="store.addCourse" size="sm" class="gap-1">
                    <Plus class="h-4 w-4" /> Add Course
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-[40%]">Course Name</TableHead>
                            <TableHead class="w-[20%]">Credits</TableHead>
                            <TableHead class="w-[30%]">Grade</TableHead>
                            <TableHead class="w-[10%]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="course in store.courses" :key="course.id">
                            <TableCell>
                                <Input v-model="course.name" placeholder="Class Name" />
                            </TableCell>
                            <TableCell>
                                <Input type="number" v-model="course.credits" placeholder="3" min="0" />
                            </TableCell>
                            <TableCell>
                                <Input v-model="course.grade" placeholder="e.g. 85 or A" />
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon" @click="store.removeCourse(course.id)" class="text-destructive hover:text-destructive/90">
                                    <Trash2 class="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                
                <div v-if="store.courses.length === 0" class="text-center py-10 text-muted-foreground">
                    No courses added. Click "Add Course" to start.
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
