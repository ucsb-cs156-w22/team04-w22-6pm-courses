import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { allTheSubjects } from "fixtures/subjectFixtures.js"
import { quarterRange } from "main/utils/quarterUtilities.js"
import LevelSelector from "main/components/CourseSearch/LevelSelector";

const CourseSearchForm = ({ setCourseJSON, fetchJSON }) => {
	const quarters = quarterRange("20221", "20222");
	const levels = [["L", "Undergrad - Lower"],
	["S", "Undergrad - Upper Division"],
	["U", "Undergrad - All"],
	["G", "Graduate"]];

	const localSubject = localStorage.getItem("BasicSearch.Subject");
	const localQuarter = localStorage.getItem("BasicSearch.Quarter");
	const localLevel = localStorage.getItem("BasicSearch.CourseLevel");

	const firstDepartment = allTheSubjects[0].subjectCode;
	const [level, setLevel] = useState(localLevel || "U");

	const handleSubmit = (event) => {
		event.preventDefault();
		fetchJSON(event, { level }).then((courseJSON) => {
			setCourseJSON(courseJSON);
		});
	};

	const handleLevelOnChange = (level) => {
		localStorage.setItem("BasicSearch.CourseLevel", level);
		setLevel(level);
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Container>
				<Row>
					<Col md="auto"><LevelSelector
						levels={levels}
						level={level}
						setLevel={handleLevelOnChange}
						controlId={"BasicSearch.CourseLevel"}
						label={"Course Level"}
					/></Col>
				</Row>
			</Container>
			<Button variant="primary" type="submit">
				Submit
			</Button>
		</Form>
	);
};

export default CourseSearchForm;