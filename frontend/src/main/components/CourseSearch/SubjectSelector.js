import React, { useState } from 'react'
import { Form } from 'react-bootstrap';
import { compareValues } from "main/utils/sortHelper"

const SubjectSelector = ({ subjects = {}, setSubject, controlId, onChange = null, label = "Subject" }) => {
    
    const localSearchSubject = localStorage.getItem(controlId);

    const [subjectState, setSubjectState] = useState(
        // Stryker disable next-line all: not sure how to text/mock local storage
        localSearchSubject || subjects[0]?.subjectCode
    );

    const handleSubjectOnChange = (event) => {
        const selectedSubject = event.target.value;
        localStorage.setItem(controlId, selectedSubject);
        setSubjectState(selectedSubject);
        setSubject(event.target.value);
        if (onChange != null) {
            onChange(event);
        }
    };

    // Stryker disable next-line all : empty key mutation
    subjects.sort?.(compareValues("subjectCode"));

    return (
        <Form.Group controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <Form.Control 
                as="select" 
                value={subjectState} 
                onChange={handleSubjectOnChange} 
            >
                {subjects.map?.(function (object, i) {
                    const key=`${controlId}-option-${i}`;
                    return (
                        <option 
                            key={key}
                            data-testid={key}
                            value={object.subjectCode}
                            >
                                {object.subjectCode} - {object.subjectTranslation}
                        </option>
                    );
                })}
            </Form.Control>
        </Form.Group>
    );
};

export default SubjectSelector;