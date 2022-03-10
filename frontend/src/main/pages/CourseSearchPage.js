import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseSearchForm from "main/components/CourseSearch/CourseSearchForm";

import { useBackend } from "main/utils/useBackend";
const CourseSearchPage = () => {

    return (
        <BasicLayout>
            <h2>Course Search</h2>
            <CourseSearchForm/>
        </BasicLayout>
    );
};

export default CourseSearchPage;