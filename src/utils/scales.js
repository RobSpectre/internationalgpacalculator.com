export const gradingScales = {
    US: {
        name: "USA (4.0 Scale)",
        type: "range",
        max: 4.0,
        ranges: [
            { min: 4.0, gpa: 4.0, label: "A" },
            { min: 3.7, gpa: 3.7, label: "A-" },
            { min: 3.3, gpa: 3.3, label: "B+" },
            { min: 3.0, gpa: 3.0, label: "B" },
            { min: 2.7, gpa: 2.7, label: "B-" },
            { min: 2.3, gpa: 2.3, label: "C+" },
            { min: 2.0, gpa: 2.0, label: "C" },
            { min: 1.7, gpa: 1.7, label: "C-" },
            { min: 1.3, gpa: 1.3, label: "D+" },
            { min: 1.0, gpa: 1.0, label: "D" },
            { min: 0.0, gpa: 0.0, label: "F" },
        ],
    },
    UK: {
        name: "United Kingdom (Percentage)",
        type: "range",
        max: 100,
        ranges: [
            { min: 70, gpa: 4.0, label: "First Class" },
            { min: 65, gpa: 3.7, label: "Upper Second (2:1)" },
            { min: 60, gpa: 3.3, label: "Upper Second (2:1)" },
            { min: 55, gpa: 3.0, label: "Lower Second (2:2)" },
            { min: 50, gpa: 2.7, label: "Lower Second (2:2)" },
            { min: 45, gpa: 2.3, label: "Third Class" },
            { min: 40, gpa: 2.0, label: "Third Class" },
            { min: 35, gpa: 1.0, label: "Pass" }, // Approx
            { min: 0, gpa: 0.0, label: "Fail" },
        ],
    },
    India_10: {
        name: "India (10-point Scale)",
        type: "linear",
        max: 10,
        formula: (grade) => (grade / 10) * 4,
    },
    Percentage: {
        name: "Percentage (0-100)",
        type: "linear",
        max: 100,
        formula: (grade) => (grade / 100) * 4,
    },
};

export const calculateCourseGPA = (grade, scaleKey) => {
    const scale = gradingScales[scaleKey];
    if (!scale) return 0;

    let gpa = 0;
    const numGrade = parseFloat(grade);

    if (isNaN(numGrade)) return 0;

    if (scale.type === "range") {
        // Find the range that the grade falls into
        // Assumes ranges are sorted desc by min
        const match = scale.ranges.find((r) => numGrade >= r.min);
        gpa = match ? match.gpa : 0;
    } else if (scale.type === "linear") {
        gpa = scale.formula(numGrade);
    }

    return Math.min(4.0, Math.max(0, gpa)); // Clamp between 0 and 4.0
};
