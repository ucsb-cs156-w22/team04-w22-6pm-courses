import fetch from "isomorphic-unfetch";

 const fetchJSON = async (_event, fields) => {
    const url = `/api/ucsbcourses/search?
    quarter=${fields.quarter}&
    courseId=${fields.courseId}&
    enrollcode=${fields.enrollCode}&
    session=${fields.session}&
    subjectCode=${fields.subjectCode}&
    deptCode=${fields.deptCode}&
    objLevelCode=${fields.objLevelCode}&
    title=${fields.title}&
    areas=${fields.areas}&
    openSections=${fields.openSections}&
    nonRestriction=${fields.nonRestriction}&
    nonPreReq=${fields.nonPreReq}&
    minUnits=${fields.minUnits}&
    maxUnits=${fields.maxUnits}&
    minStartTime=${fields.minStartTime}&
    maxStartTime=${fields.maxStartTime}&
    days=${fields.days}&
    instructor=${fields.instructor}&
    pageNumber=${fields.pageNumber}&
    pageSize=${fields.pageSize}&
    includeClassSections=${fields.includeClassSections}`;
    const courseJSON = await fetch(url);
    return courseJSON.json();
};

export { fetchJSON };