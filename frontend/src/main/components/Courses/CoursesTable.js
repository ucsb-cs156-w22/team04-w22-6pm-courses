import React from "react";
import OurTable from "../OurTable";

export default function CoursesTable({ courses }) {


    courses = courses.map(course => {
        course.description = course.description.length > 100 ? course.description.slice(0, 100) + '...' : course.description
        return course
    })


    const columns = [
        {
            accessor: "quarter",
            Header: "Quarter"
        },
        {
            accessor: "courseId",
            Header: "Course ID"
        },
        {
            accessor: "title",
            Header: "Title"
        },
        {
            accessor: "description",
            Header: "Description"
        },
        {
            accessor: "objLevelCode",
            Header: "Course Level"
        },
        {
            accessor: "subjectArea",
            Header: "Subject Area"
        },
        {
            accessor: "unitsFixed",
            Header: "Units"
        },
    ]

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    // Stryker disable next-line ArrayDeclaration : [courses] is a performance optimization
    const memoizedCourses = React.useMemo(() => courses, [courses]);


    return (
        <OurTable columns={memoizedColumns} data={memoizedCourses} testid={"CoursesTable"} />
    )

}