import CourseSearchForm from "main/components/CourseSearch/CourseSearchForm";

export default {
    title: 'components/CourseSearch/CourseSearchForm',
    component: CourseSearchForm
};

function fetchCourses() {}

const Template = (args) => {
    return (
        <CourseSearchForm fetchJSON={fetchCourses}/>
    )
};

export const Form = Template.bind({});
