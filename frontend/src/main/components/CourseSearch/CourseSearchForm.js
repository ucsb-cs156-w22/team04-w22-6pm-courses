import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { allLevels } from "main/utils/levelsUtils_NoStryker.js"
import { quarterRange } from "main/utils/quarterUtilities"
import SubjectSelector from "./SubjectSelector";
import LevelSelector from "main/components/CourseSearch/LevelSelector";
import SingleQuarterDropdown from "main/components/Quarters/SingleQuarterDropdown";
import { toast } from "react-toastify";
import axios from "axios";

const CourseSearchForm = ({ fetchJSON }) => {
	const levels = Object.values(allLevels);
	const quarters = quarterRange("20084", "20223");
	//Stryker disable next-line all : this value is hard coded and shouldn't ever change
	const localLevel = localStorage.getItem("CourseSearch.CourseLevel");
	const localQuarter = localStorage.getItem("CourseSearch.Quarter");
	const localSubject = localStorage.getItem("CourseSearch.Subject");

	const firstDepartment = "ART - Art";

	//Stryker disable next-line all : these values aren't booleans and cannot become booleans
	const [level, setLevel] = useState(localLevel || allLevels[0].levelShort);
	const [quarter, setQuarter] = useState(localQuarter || quarters[0].yyyyq);
	const [subject, setSubject] = useState(localSubject || firstDepartment);
	const [subjects, setSubjects] = useState(undefined);

	if(subjects === undefined){
		axios({
			url: "/api/UCSBSubjects/all",
			method: "GET"
		}).then(e => {setSubjects(e.data)}).catch(e => {
			toast("Error performing course search", {
				appearance: "error",
			});
			setSubjects({})
		})
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		fetchJSON(event, { level, quarter, subject }).then((courseJSON) => {
			if (courseJSON.total === 0) {
				toast("There are no courses that match the requested criteria.", {
					appearance: "error",
				});
			}
		});
	};

	//Stryker disable next-line all : handleLevelOnChange is passed into the levelSelector as setLevel which tests if setLevel gets called properly
	const handleLevelOnChange = (level) => {
		//Stryker disable next-line StringLiteral : key value is hard coded
		localStorage.setItem("CourseSearch.CourseLevel", level);
		setLevel(level);
	};

    const handleQuarterOnChange = (quarter) => {
        localStorage.setItem("CourseSearch.Quarter", quarter);
        setQuarter(quarter);
    }

    const handleSubjectOnChange = (subject) => {
        localStorage.setItem("CourseSearch.Subject", subject);
        setSubject(subject);
    }

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
				<Col sm="auto">
				<SingleQuarterDropdown
					quarters={quarters}
					quarter={quarter}
					setQuarter={handleQuarterOnChange	}
					controlId={"CourseSearch.Quarter"}
					label={"Quarter"}
				/></Col>
				<Col sm="auto">
				<SubjectSelector
					subjects={subjects}
					subject={subject}
					setSubject={handleSubjectOnChange}
					controlId={"CourseSearch.Subject"}
					label={"Subject"}
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