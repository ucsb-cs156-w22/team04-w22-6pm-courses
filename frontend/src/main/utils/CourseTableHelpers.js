const shouldShowSection = (section, filters) => {
    return ((!filters.cancelled) || (filters.cancelled && section.courseCancelled === null)) &&
    ((!filters.closed) || (filters.closed && section.classClosed === null)) &&
    ((!filters.full) || (filters.full && section.maxEnroll > section.enrolledTotal))
};


const addCourseInfoToSection = (section, course) => {
    section.course = {
    quarter: course.quarter,
    courseId: course.courseId,
    title: course.title,
    unitsFixed: course.unitsFixed
    };
};

export function reformatJSON(classes, checks) {
    let filters = {
        cancelled: false,
        closed: false,
        full: false
    }
    if (checks !== undefined) {
        filters.cancelled = checks[0];
        filters.closed = checks[1];
        filters.full = checks[2];
    }

    const sections = [];

    sections.forEach(section => {
        section.uniqueKey = `${section.course.quarter}-${section.enrollCode}`;
    });

    return sections;
}

export const availabilityColors = {
COLOR_UNAVAILABLE: { backgroundColor: '#FF8080' },
COLOR_CLOSEFULL: { backgroundColor: '#FFD761' },
COLOR_AVAILABLELECTUREORCLASSWITHSECTIONS: { backgroundColor: '#CEDEFA' },
};