import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap"

import { allTheSubjects } from "fixtures/subjectFixtures.js"
import { allLevels } from "main/utils/levelsUtils_NoStryker.js"

import { useBackend } from "main/utils/useBackend";

import LevelSelector from "main/components/CourseSearch/LevelSelector.js"
import SubjectSelector from "main/components/CourseSearch/SubjectSelector.js"

import { useCurrentUser } from 'main/utils/currentUser'

const CourseSearchForm = ({ setCourseJSON, fetchJSON }) => {
	const currentUser = useCurrentUser();

	const levels = Object.values(allLevels);
	//Stryker disable next-line all : this value is hard coded and shouldn't ever change
	const localLevel = localStorage.getItem("CourseSearch.CourseLevel");
	const localSubject = localStorage.getItem("CourseSearch.Subject");

	const firstDepartment = allTheSubjects[0].subjectCode;
	//Stryker disable next-line all : these values aren't booleans and cannot become booleans
	const [level, setLevel] = useState(localLevel || allLevels[0].levelShort);
	const [subject, setSubject] = useState(localSubject || firstDepartment);
	
	const { data: subjects, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/UCSBSubjects/all"],
      { method: "GET", url: "/api/UCSBSubjects/all" },
      []
    );

	const handleSubmit = (event) => {
		event.preventDefault();
		fetchJSON(event, { subject, level }).then((courseJSON) => {
			setCourseJSON(courseJSON);
		});
	};

	//Stryker disable next-line all : handleLevelOnChange is passed into the levelSelector as setLevel which tests if setLevel gets called properly
	const handleLevelOnChange = (level) => {
		//Stryker disable next-line StringLiteral : key value is hard coded
		localStorage.setItem("CourseSearch.CourseLevel", level);
		setLevel(level);
	};

	const handleSubjectOnChange = (subject) => {
        localStorage.setItem("CourseSearch.CourseSubject", subject);
		setSubject(subject);
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group as={Row}>
				<Col sm="auto">
				<LevelSelector
					levels={levels}
					level={level}
					setLevel={handleLevelOnChange}
					controlId={"CourseSearch.CourseLevel"}
					label={"Course Level"}
				/></Col>
				<Col sm = "auto">
				<SubjectSelector
					subjects={subjects}
					setSubject={handleSubjectOnChange}
					controlId={"CourseSearch.CourseSubject"}
				/></Col>
			</Form.Group>
			<Form.Group as={Row}>
				<Col sm="auto">
					<Button type="submit">Search</Button>
				</Col>
			</Form.Group>
		</Form>
		
	);
		
};

export default CourseSearchForm;