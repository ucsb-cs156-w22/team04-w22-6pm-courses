import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseSearchForm from "main/components/CourseSearch/CourseSearchForm";

const CourseSearchPage = () => {

    return (
        <BasicLayout>
            <h2>Course Search</h2>
            <CourseSearchForm fetchJSON={function fetchCourses(){}}/>
        </BasicLayout>
    );
};

export default CourseSearchPage;