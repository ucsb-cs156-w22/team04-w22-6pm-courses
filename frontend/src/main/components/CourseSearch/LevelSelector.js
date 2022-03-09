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
            <Form.Control as="select" value={levelState} onChange={handleLevelOnChange} >
                {levels.map(function (object, i) {
                    const key=`${controlId}-option-${i}`;
                    // const selectedLevel = "U";
                    // const selectedLevelVerbose = "Undergrad - All"
                    // if(object[0] != "" && object[1] != ""){
                    //     return <option key={key} data-testid={key} value={object[0]}>{object[1]}</option>;
                    // }
                    // else if(object[0] != ""){
                    //     return <option key={key} data-testid={key} value={object[0]}>{selectedLevelVerbose}</option>;
                    // } else if(object[1] != ""){
                    //     return <option key={key} data-testid={key} value={selectedLevel}>{object[1]}</option>;
                    // } else {
                    return <option key={key} data-testid={key} value={object[0]}>{object[1]}</option>;
                })}
            </Form.Control>
        </Form.Group>
    );
};

export default LevelSelector;