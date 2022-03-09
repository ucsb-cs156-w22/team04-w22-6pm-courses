import React, { useState }  from "react";
import { Form } from "react-bootstrap";

const LevelSelector = ({ levels, level, setLevel, controlId, onChange = null, label = "Level"}) => {

    const localSearchLevel = localStorage.getItem(controlId);
    const [levelState, setLevelState] = useState(localSearchLevel || "U");

    const handleLevelOnChange = (event) => {
        const selectedLevel = event.target.value;
        localStorage.setItem(controlId, selectedLevel);
        setLevelState(selectedLevel);
        setLevel(selectedLevel);
        if(onChange != null){
            onChange(event);
        }
    };

    return (
        <Form.Group controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <Form.Control as="select" value={level} onChange={handleLevelOnChange} >
                {levels.map(function (object, i) {
                    const key=`${controlId}-option-${i}`;
                    let selString = "test";
                    let selVal = "x";
                    if(object[0] != null){
                        selVal = object[0].toString();
                    }
                    if(object[1] != null){
                        selString = object[1];
                    }
                    return <option key={key} data-testid={key} value={selVal}>{selString}</option>;
                })}
            </Form.Control>
        </Form.Group>
    );
};

export default LevelSelector;