import { defineStore } from 'pinia'
import { calculateCourseGPA } from '@/utils/scales'

export const useGPAStore = defineStore('gpa', {
    state: () => ({
        selectedCountry: 'US', // Default to US 4.0 scale
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
        }
    },
    actions: {
        addCourse() {
            const id = this.courses.length > 0 ? Math.max(...this.courses.map(c => c.id)) + 1 : 1;
            this.courses.push({ id, name: `Course ${id}`, credits: 3, grade: '' });
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
        setCountry(countryKey) {
            this.selectedCountry = countryKey;
        }
    },
})
