import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { allLevels } from "main/utils/levelsUtils_NoStryker.js"
import LevelSelector from "main/components/CourseSearch/LevelSelector";

const CourseSearchForm = ({ setCourseJSON, fetchJSON }) => {
	const levels = Object.values(allLevels);
	//Stryker disable next-line all : this value is hard coded and shouldn't ever change
	const localLevel = localStorage.getItem("CourseSearch.CourseLevel");

	//Stryker disable next-line all : these values aren't booleans and cannot become booleans
	const [level, setLevel] = useState(localLevel || allLevels[0].levelShort);

	const handleSubmit = (event) => {
		event.preventDefault();
		fetchJSON(event, { level }).then((courseJSON) => {
			setCourseJSON(courseJSON);
		});
	};

	//Stryker disable next-line all : handleLevelOnChange is passed into the levelSelector as setLevel which tests if setLevel gets called properly
	const handleLevelOnChange = (level) => {
		//Stryker disable next-line StringLiteral : key value is hard coded
		localStorage.setItem("CourseSearch.CourseLevel", level);
		setLevel(level);
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group as={Row}>
				<Col sm="auto">
				<LevelSelector
					levels={levels}
					setLevel={handleLevelOnChange}
					controlId={"CourseSearch.CourseLevel"}
					label={"Course Level"}
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