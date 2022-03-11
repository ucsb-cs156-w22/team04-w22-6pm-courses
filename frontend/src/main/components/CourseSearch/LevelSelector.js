import React, { useState }  from "react";
import { Form } from "react-bootstrap";

const LevelSelector = ({ levels, level, setLevel, controlId, onChange = null, label = "Level"}) => {

    const localSearchLevel = localStorage.getItem(controlId);
    //Stryker disable next-line all : this value is not a boolean nor can it become one. Also the default value is hard coded
    const [levelState, setLevelState] = useState(localSearchLevel || "L");

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
            <Form.Control as="select" value={levelState} onChange={handleLevelOnChange} >
                {levels.map(function (object, i) {
                    const key=`${controlId}-option-${i}`;
                    return <option key={key} data-testid={key} value={object.levelShort}>{object.level}</option>;
                })}
            </Form.Control>
        </Form.Group>
    );
};

export default LevelSelector;