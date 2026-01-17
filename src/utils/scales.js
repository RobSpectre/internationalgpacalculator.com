import gradingData from '@/data/grading_scales.json';

// Default US Scale (Manual Entry)
const usScale = {
    id: 'US',
    name: "USA (4.0 Scale)",
    country: "USA",
    type: "range",
    intlScale: ["4.0", "3.7", "3.3", "3.0", "2.7", "2.3", "2.0", "1.7", "1.3", "1.0", "0.0"],
    usScale: ["4.0", "3.7", "3.3", "3.0", "2.7", "2.3", "2.0", "1.7", "1.3", "1.0", "0.0"]
};

// Process JSON data into an object keyed by ID
const processedScales = {
    US: usScale
};

gradingData.forEach(item => {
    // Construct a name for display
    let name = item.country;
    if (item.schoolName && !item.schoolName.startsWith("DEFAULT")) {
        name = `${item.country} - ${item.schoolName}`;
    } else if (item.schoolName && item.schoolName.startsWith("DEFAULT")) {
        // e.g., "DEFAULT Argentina" -> "Argentina (Default)"
        name = item.schoolName.replace("DEFAULT ", "") + " (Default)";
    }

    processedScales[item.id] = {
        ...item,
        name: name,
        // Pre-parse scales for interpolation if numeric
        parsedIntl: item.intlScale.map(v => {
            const f = parseFloat(v);
            return isNaN(f) ? v : f;
        }),
        parsedUs: item.usScale.map(v => parseFloat(v))
    };
});

export const gradingScales = processedScales;

export const calculateCourseGPA = (grade, scaleKey) => {
    const scale = gradingScales[scaleKey];
    if (!scale || !grade) return 0;

    // If US scale, just return grade if numeric, or map letters
    if (scaleKey === 'US') {
        const g = parseFloat(grade);
        if (!isNaN(g)) return g;
        // Basic Letter mapping
        const letter = grade.toUpperCase().trim();
        const map = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0 };
        return map[letter] || 0;
    }

    // Generic Logic
    const input = parseFloat(grade);
    const isInputNumeric = !isNaN(input);
    const cleanInput = grade.toString().trim().toUpperCase();

    // Try to find match
    for (let i = 0; i < scale.intlScale.length; i++) {
        const rawIntl = scale.intlScale[i];
        const parsedIntl = scale.parsedIntl[i];
        const usVal = scale.parsedUs[i] || 0; // Default to 0 if missing

        if (isInputNumeric && typeof parsedIntl === 'number') {
            // Numeric comparison (assuming descending order in data?)
            // Check if data is descending. Australia: 100, 80, 70... Yes.
            // If input >= threshold, return usVal
            if (input >= parsedIntl) {
                return usVal;
            }
        } else {
            // String comparison
            // Check for exact match or range match (if rawIntl looks like "80-100")
            // But our parser split by slash, so rawIntl is "100", "80".
            // If the input is "A", match "A".
            if (cleanInput === rawIntl.toUpperCase()) {
                return usVal;
            }
        }
    }

    // Fallback: if numeric and we didn't match any threshold (e.g. grade < lowest), return 0?
    // Or check if it's ascending? (Rare for GPA scales, usually top-down).

    return 0;
};

// Export a sorted list for the UI selector
export const gradingScalesList = Object.values(gradingScales).sort((a, b) => {
    return a.name.localeCompare(b.name);
});

