import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SelectSubject from "main/components/SelectSubject.js"
import * as subjectFixtures from "fixtures/subjectFixtures.js"

jest.mock('react', ()=>({
    ...jest.requireActual('react'),
    useState: jest.fn()
  }))
import { useState } from 'react';

describe("SingleQuarterSelector tests", () => {

    beforeEach(() => {
        useState.mockImplementation(jest.requireActual('react').useState);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const subject = jest.fn();
    const setSubject = jest.fn();

    test("renders without crashing on one subjects", () => {
        render(<SelectSubject 
            subjects={subjectFixtures.oneSubject} 
            subject={subject} 
            setSubject={setSubject}
            controlId="ss1" 
        />);
    });

    test("renders without crashing on three subjects", () => {
        render(<SelectSubject 
            subjects={subjectFixtures.threeSubjects} 
            subject={subject} 
            setSubject={setSubject}
            controlId="ss1" 
        />);
    });

    test("renders without crashing on many subjects", () => {
        render(<SelectSubject 
            subjects={subjectFixtures.allTheSubjects} 
            subject={subject} 
            setSubject={setSubject}
            controlId="ss1"
        />);
    });


    test("when I select an object, the value changes", async () => {
        const {getByLabelText} = 
            render(<SelectSubject 
                subjects={subjectFixtures.allTheSubjects} 
                subject={subject} 
                setSubject={setSubject}
                controlId="ss1"
            />);
        await waitFor(() => expect(getByLabelText("Subject")).toBeInTheDocument);
        const selectSubject = getByLabelText("Subject")
        userEvent.selectOptions(selectSubject, "CMPSC");
        expect(setSubject).toBeCalledWith("CMPSC");
    });

    test("if I pass a non-null onChange, it gets called when the value changes", async () => {
        const onChange = jest.fn();
        const { getByLabelText } =
            render(<SelectSubject
                subjects={subjectFixtures.allTheSubjects} 
                subject={subject} 
                setSubject={setSubject}
                controlId="ss1"
                onChange={onChange}
            />);
        await waitFor(() => expect(getByLabelText("Subject")).toBeInTheDocument);
        const selectSubject = getByLabelText("Subject")
        userEvent.selectOptions(selectSubject, "CMPSC");
        await waitFor(() => expect(setSubject).toBeCalledWith("CMPSC"));
        await waitFor(() => expect(onChange).toBeCalledTimes(1));

        // x.mock.calls[0][0] is the first argument of the first call to the jest.fn() mock x

        const event = onChange.mock.calls[0][0];
        expect(event.target.value).toBe("CMPSC");
    });

    test("default label is Subject", async () => {
        const { getByLabelText } =
            render(<SelectSubject
                subjects={subjectFixtures.oneSubject} 
                subject={subject} 
                setSubject={setSubject}
                controlId="ss1" 
            />);
        await waitFor(() => expect(getByLabelText("Subject")).toBeInTheDocument);
    });

    test("keys / testids are set correctly on options", async () => {
        const { getByTestId } =
            render(<SelectSubject
                subjects={subjectFixtures.oneSubject} 
                subject={subject} 
                setSubject={setSubject}
                controlId="ss1" 
            />);
        const expectedKey = "ss1-option-0"
        await waitFor(() => expect(getByTestId(expectedKey).toBeInTheDocument));
        const firstOption = getByTestId(expectedKey);
    });

    test("when localstorage has a value, it is passed to useState", async () => {
        const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
        getItemSpy.mockImplementation(() => "CMPSC");

        const setSubjectStateSpy = jest.fn();
        useState.mockImplementation((x)=>[x, setSubjectStateSpy])

        const { getByTestId } =
            render(<SelectSubject
                subjects={subjectFixtures.allTheSubjects} 
                subject={subject} 
                setSubject={setSubject}
                controlId="ss1" 
            />);

        await waitFor(() => expect(useState).toBeCalledWith("CMPSC"));
    });

    test("when localstorage has no value, first element of subjects is passed to useState", async () => {
        const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
        getItemSpy.mockImplementation(() => null);

        const setSubjectStateSpy = jest.fn();
        useState.mockImplementation((x)=>[x, setSubjectStateSpy])

        const { getByTestId } =
            render(<SelectSubject
                subjects={subjectFixtures.allTheSubjects} 
                subject={subject} 
                setSubject={setSubject}
                controlId="ss1" 
            />);

        await waitFor(() => expect(useState).toBeCalledWith("ANTH"));
    });

});