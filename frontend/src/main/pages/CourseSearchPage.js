import React from "react";
import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseSearchForm from "main/components/CourseSearch/CourseSearchForm";
import CourseFilters from "main/components/CourseSearch/CourseFilters";
import TableLegend from "main/components/CourseSearch/TableLegend";
import axios from "axios";
import { toast } from "react-toastify";
import CoursesTable from "main/components/Courses/CoursesTable";

const CourseSearchPage = () => {

    // every function that starts with "use" is a hook
    // e.g. useState, useSWR, useAuth0

    // courseJSON is the variable for the state
    // setCourseJSON is the setter
    // the parameter to useState is the initial value of the state

    const initialCourseJSON = {
        "pageNumber": 1,
        "pageSize": 1,
        "total": 0,
        "classes": []
    };

    //Check for closed, cancelled, full status
    const [cancelled, setCancelledChecked] = useState(false);
    const [closed, setClosedChecked] = useState(false);
    const [full, setFullChecked] = useState(false);
    const [returned_courses, setCourses] = useState([]);

    const handleCancelledOnChange = () => {
        setCancelledChecked(!cancelled);
    };
    const handleClosedOnChange = () => {
        setClosedChecked(!closed);
    };
    const handleFullOnChange = () => {
        setFullChecked(!full);
    };

    const fetchCourses = async (event, { level, quarter, subject }) => {
        const response = await axios({
            url: "/api/ucsbcourses/search",
            method: "GET",
            params: { 
                quarter: quarter,
                subjectCode: subject.split(" -")[0],
                objLevelCode: level
            }
        }).then(e => e.data.classes).catch(e => {})
        setCourses(response);
    };

    return (
        <BasicLayout>
            <h2>Course Search</h2>

            <CourseSearchForm fetchJSON={fetchCourses}/>

            <TableLegend legend />
            <CourseFilters cancelled={cancelled} handleCancelledOnChange={handleCancelledOnChange} closed={closed} handleClosedOnChange={handleClosedOnChange} full={full} handleFullOnChange={handleFullOnChange}/>
            { returned_courses.length !== 0 ? <CoursesTable courses={returned_courses}/> : null }
        </BasicLayout>
    );
};

export default CourseSearchPage;