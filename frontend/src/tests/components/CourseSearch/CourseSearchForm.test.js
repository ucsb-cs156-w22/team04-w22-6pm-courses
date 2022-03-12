import React from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify"

import CourseSearchForm from "main/components/CourseSearch/CourseSearchForm";


jest.mock('react-toastify', () => {
	const actual = jest.requireActual('react-toastify');
	Object.assign(actual, {toast: jest.fn()});
	return actual;
  });

describe("CourseSearchForm tests", () => {

	test("renders without crashing", () => {
		render(<CourseSearchForm />);
	});

	test("when I select a level, the state for level changes", () => {
		const { getByLabelText } = render(<CourseSearchForm />);
		const selectLevel = getByLabelText("Course Level");
		userEvent.selectOptions(selectLevel, "G");

		expect(selectLevel.value).toBe("G");
		expect(localStorage.getItem("CourseSearch.CourseLevel")).toBe("G");
	});

	test("when I click submit, the right stuff happens", async () => {
		const sampleReturnValue = {
			sampleKey: "sampleValue",
		};

		// Create spy functions (aka jest function, magic function)
		// The function doesn't have any implementation unless
		// we specify one.  But it does keep track of whether
		// it was called, how many times it was called,
		// and what it was passed.

		const fetchJSONSpy = jest.fn();

		fetchJSONSpy.mockResolvedValue(sampleReturnValue);

		const { getByText, getByLabelText } = render(
			<CourseSearchForm
				fetchJSON={fetchJSONSpy}
			/>
		);

		const expectedFields = {
			level: "G",
		};

		const selectLevel = getByLabelText("Course Level");
		userEvent.selectOptions(selectLevel, "G");

		const submitButton = getByText("Search");
		userEvent.click(submitButton);

		// we need to be careful not to assert this expectation
		// until all of the async promises are resolved
		await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

		// assert that ourSpy was called with the right value
		expect(fetchJSONSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expectedFields
		);
	});

	test("when I click submit, and don't find a course, the right stuff happens", async () => {
		const sampleReturnValue = {
			sampleKey: "sampleValue",
		};

		// Create spy functions (aka jest function, magic function)
		// The function doesn't have any implementation unless
		// we specify one.  But it does keep track of whether
		// it was called, how many times it was called,
		// and what it was passed.

		const fetchJSONSpy = jest.fn();

		fetchJSONSpy.mockResolvedValue(sampleReturnValue);

		const toastCalls = []
		const spy = toast.mockImplementation((...args) => {
			toastCalls.push(args)
			}
		)

		const { getByText, getByLabelText } = render(
			<CourseSearchForm
				fetchJSON={fetchJSONSpy}
			/>
		);

		const expectedFields = {
			level: "G",
		};

		const selectLevel = getByLabelText("Course Level");
		userEvent.selectOptions(selectLevel, "G");

		const submitButton = getByText("Search");
		userEvent.click(submitButton);

		// we need to be careful not to assert this expectation
		// until all of the async promises are resolved
		await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

		await waitFor(() => expect(toastCalls).toEqual([]));	

		// assert that ourSpy was called with the right value
		expect(fetchJSONSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expectedFields
		);
	});
});