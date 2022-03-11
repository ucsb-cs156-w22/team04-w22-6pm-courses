import { getByDisplayValue, getByText, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LevelSelector from "main/components/CourseSearch/LevelSelector";
import * as levelsFixtures from "fixtures/levelsFixtures";

jest.mock('react', ()=>({
    ...jest.requireActual('react'),
    useState: jest.fn()
  }))
import { useState } from 'react';

describe("LevelSelector tests", () => {

    beforeEach(() => {
        useState.mockImplementation(jest.requireActual('react').useState);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const setLevel = jest.fn();

    const levels = Object.values(levelsFixtures.allLevels);

    test("renders without crashing with no levels", () => {
        render(<LevelSelector
            levels={[]}
            setLevel={setLevel}
            controlId="sqd1"
        />);
    })

    test("renders without crashing on one course level", () => {
        render(<LevelSelector
            levels={[levels[0]]}
            setLevel={setLevel}
            controlId="sqd1"
        />);
    });

    test("renders without crashing on four levels", () => {
        render(<LevelSelector
            levels={levels}
            setLevel={setLevel}
            controlId="sqd1"
        />);
    });

    test("when I select an object, the value changes", async () => {
        const { getByLabelText } =
            render(<LevelSelector
                levels={levels}
                setLevel={setLevel}
                controlId="sqd1"
                label="Select Level"
            />
            );
        await waitFor(() => expect(getByLabelText("Select Level")).toBeInTheDocument);
        const selectLevel = getByLabelText("Select Level")
        userEvent.selectOptions(selectLevel, "U");
        expect(setLevel).toBeCalledWith("U");
    });

    test("if I pass a non-null onChange, it gets called when the value changes", async () => {
        const onChange = jest.fn();
        const { getByLabelText } =
            render(<LevelSelector
                levels={levels}
                setLevel={setLevel}
                controlId="sqd1"
                label="Select Level"
                onChange={onChange}
            />
            );
        await waitFor(() => expect(getByLabelText("Select Level")).toBeInTheDocument);
        const selectLevel = getByLabelText("Select Level")
        userEvent.selectOptions(selectLevel, "L");
        await waitFor(() => expect(setLevel).toBeCalledWith("L"));
        await waitFor(() => expect(onChange).toBeCalledTimes(1));

        // x.mock.calls[0][0] is the first argument of the first call to the jest.fn() mock x

        const event = onChange.mock.calls[0][0];
        expect(event.target.value).toBe("L");
    });

    test("default label is Level", async () => {
        const { getByLabelText } =
            render(<LevelSelector
                levels={levels}
                setLevel={setLevel}
                controlId="sqd1"
            />
            );
        await waitFor(() => expect(getByLabelText("Level")).toBeInTheDocument);
    });

    test("keys / testids are set correctly on options", async () => {
        const { getByTestId } =
            render(<LevelSelector
                levels={levels}
                setLevel={setLevel}
                controlId="sqd1"
            />
            );
        const expectedKey = "sqd1-option-0";
        await waitFor(() => expect(getByTestId(expectedKey).toBeInTheDocument));
    });

    test("when localstorage has a value, it is used in the document", async () => {
        const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
        getItemSpy.mockImplementation(() => "G");

        const { getByTestId } =
            render(<LevelSelector
                levels={levels}
                setLevel={setLevel}
                controlId="sqd1"
            />
            );

        const expectedKey = "sqd1-option-3";
        await waitFor(() => expect(getByTestId(expectedKey).toBeInTheDocument));
    });

    test("when localstorage has no value, first element of level is passed to useState", async () => {
        const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
        getItemSpy.mockImplementation(() => null);

        const setLevelStateSpy = jest.fn();
        useState.mockImplementation((x)=>[x, setLevelStateSpy])

        const { getByTestId } =
            render(<LevelSelector
                levels={levels}
                setLevel={setLevel}
                controlId="sqd1"
            />
            );

        const expectedKey = "sqd1-option-0";
        await waitFor(() => expect(getByTestId(expectedKey).toBeInTheDocument));
    });
});