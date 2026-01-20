import { describe, it, expect } from 'vitest'
import { calculateCourseGPA } from './scales'

describe('GPA Calculation', () => {
    it('calculates Korea University correctly', () => {
        // Input 3.2 -> Expect 3.12
        const result = calculateCourseGPA(3.2, '256')
        expect(result).toBe(3.12)
    })

    it('calculates Default China correctly', () => {
        // Input 82 -> Expect 3.11
        const result = calculateCourseGPA(82, '29')
        expect(result).toBe(3.11)
    })

    it('calculates Lanzhou University correctly', () => {
        // Input 95 -> Expect 3.8
        const result = calculateCourseGPA(95, '413')
        expect(result).toBe(3.8)
    })

    it('calculates Johannes Kepler University Linz correctly', () => {
        // Input 1.2 -> Expect 3.80
        const result = calculateCourseGPA(1.2, '345')
        expect(result).toBe(3.80)
    })
})
