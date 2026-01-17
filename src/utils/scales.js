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

const interpolate = (x, x0, x1, y0, y1) => {
    if (x1 === x0) return y0;
    return y0 + (x - x0) * ((y1 - y0) / (x1 - x0));
};

export const calculateCourseGPA = (grade, scaleKey) => {
    const scale = gradingScales[scaleKey];
    if (!scale || !grade) return 0;

    // Handle US scale separately or via the same logic if numeric
    if (scaleKey === 'US') {
        const g = parseFloat(grade);
        if (!isNaN(g)) return Math.min(4.0, Math.max(0, g));
        const letter = grade.toUpperCase().trim();
        const map = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0 };
        return map[letter] || 0;
    }

    const x = parseFloat(grade);
    const intl = scale.parsedIntl;
    const us = scale.parsedUs;

    // If grade is not numeric, try exact string match
    if (isNaN(x)) {
        const cleanInput = grade.toString().trim().toUpperCase();
        for (let i = 0; i < scale.intlScale.length; i++) {
            if (cleanInput === scale.intlScale[i].toUpperCase()) {
                return us[i] || 0;
            }
        }
        return 0;
    }

    // Interpolation logic
    if (!intl || intl.length === 0 || intl.length !== us.length) {
        return 0;
    }

    let x1 = parseFloat(intl[0]);
    let y1 = parseFloat(us[0]);

    // Detect scale direction (Descending: 100->0, Ascending: 1->5)
    // We compare x1 (best) with the last numeric value in the scale
    let lastVal = parseFloat(intl[intl.length - 1]);
    // Fallback if last is NaN
    if (isNaN(lastVal) && intl.length > 1) lastVal = parseFloat(intl[1]);

    const isDescending = x1 > lastVal;

    // Cap at "Best" grade
    if (isDescending) {
        if (x >= x1) return y1;
    } else {
        if (x <= x1) return y1;
    }

    for (let i = 1; i < intl.length; i++) {
        let x0 = parseFloat(intl[i]);
        let y0 = parseFloat(us[i]);

        if (!isNaN(x0) && !isNaN(x1)) {
            let inRange = false;
            if (isDescending) {
                // e.g. 100 >= x >= 90
                inRange = (x1 >= x && x >= x0);
            } else {
                // e.g. 1 <= x <= 2
                inRange = (x1 <= x && x <= x0);
            }

            if (inRange) {
                return parseFloat(interpolate(x, x0, x1, y0, y1).toFixed(2));
            }
        }

        x1 = x0;
        y1 = y0;
    }

    // Fallback/Extrapolation
    // If we fell through, it's likely "worse" than the lowest grade.
    // For now, return 0 or do simple extrapolation from the last point to 0?
    // Current logic tried to interpolate to 0. Let's return 0 for safety if out of bounds.
    return 0.0;
};

// Export a sorted list for the UI selector
// Export a sorted list for the UI selector
export const gradingScalesList = Object.values(gradingScales).sort((a, b) => {
    // Helper to check if it's a default entry
    const isDefaultA = a.name.includes("(Default)");
    const isDefaultB = b.name.includes("(Default)");

    // If one is default and the other isn't, and they share the same starting string (country), prioritize default
    // Or simpler: clean the names to just country bases for comparison
    const countryA = a.country;
    const countryB = b.country;

    // First sort by country
    const countryComparison = countryA.localeCompare(countryB);
    if (countryComparison !== 0) return countryComparison;

    // If same country, put default first
    if (isDefaultA && !isDefaultB) return -1;
    if (!isDefaultA && isDefaultB) return 1;

    // otherwise sort by full name
    return a.name.localeCompare(b.name);
});

