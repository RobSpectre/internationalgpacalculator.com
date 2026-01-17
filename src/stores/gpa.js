import { defineStore } from 'pinia'
import { calculateCourseGPA, gradingScales } from '@/utils/scales'

export const useGPAStore = defineStore('gpa', {
    state: () => ({
        selectedCountry: null, // No default selection
        courses: [
            { id: 1, name: 'Course 1', credits: 3, grade: '' },
            { id: 2, name: 'Course 2', credits: 3, grade: '' },
            { id: 3, name: 'Course 3', credits: 3, grade: '' },
        ],
    }),
    getters: {
        totalCredits: (state) => {
            return state.courses.reduce((sum, course) => {
                const cred = parseFloat(course.credits) || 0;
                return sum + cred;
            }, 0);
        },
        cumulativeGPA: (state) => {
            let totalPoints = 0;
            let totalCredits = 0;

            state.courses.forEach(course => {
                const cred = parseFloat(course.credits) || 0;
                const gpa = calculateCourseGPA(course.grade, state.selectedCountry);

                if (cred > 0 && course.grade !== '') {
                    totalPoints += gpa * cred;
                    totalCredits += cred;
                }
            });

            if (totalCredits === 0) return 0;
            return (totalPoints / totalCredits).toFixed(2);
        },
        currentScale: (state) => gradingScales[state.selectedCountry] // Added currentScale getter
    },
    actions: {
        addCourse() {
            this.courses.push({
                id: crypto.randomUUID(), // Changed ID generation
                name: '', // Changed default name
                credits: 3,
                grade: ''
            })
        },
        removeCourse(id) {
            this.courses = this.courses.filter(c => c.id !== id);
        },
        updateCourse(id, field, value) {
            const course = this.courses.find(c => c.id === id);
            if (course) {
                course[field] = value;
            }
        },
        setCountry(country) {
            this.selectedCountry = country
        }
    }
})
