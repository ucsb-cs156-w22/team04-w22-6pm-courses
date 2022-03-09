import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseSearchForm from "main/components/CourseSearch/CourseSearchForm";
import CourseFilters from "main/components/CourseSearch/CourseFilters";
import TableLegend from "main/components/CourseSearch/TableLegend";

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

    // courseId, title, sectionNumber, instructor, enroll code, units, total enrolled students, max enrolled
    const [courseJSON, setCourseJSON] = useState(initialCourseJSON);

    //Check for closed, cancelled, full status
    const [cancelled, setCancelledChecked] = useState(false);
    const [closed, setClosedChecked] = useState(false);
    const [full, setFullChecked] = useState(false);

    const handleCancelledOnChange = () => {
        setCancelledChecked(!cancelled);
    };
    const handleClosedOnChange = () => {
        setClosedChecked(!closed);
    };
    const handleFullOnChange = () => {
        setFullChecked(!full);
    };

    return (
        <BasicLayout>
            <h2>Course Search</h2>

            <CourseSearchForm/>

            <TableLegend legend />
            <CourseFilters cancelled={cancelled} handleCancelledOnChange={handleCancelledOnChange} closed={closed} handleClosedOnChange={handleClosedOnChange} full={full} handleFullOnChange={handleFullOnChange}/>
        </BasicLayout>
    );
};

export default CourseSearchPage;