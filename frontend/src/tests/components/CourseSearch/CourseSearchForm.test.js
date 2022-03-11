import React from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ucsbSubjectsFixtures } from "fixtures/ucsbSubjectsFixtures";
import CourseSearchForm from "main/components/CourseSearch/CourseSearchForm";
import AxiosMockAdapter from "axios-mock-adapter";
import axios from "axios";

describe("CourseSearchForm tests", () => {
	const axiosMock =new AxiosMockAdapter(axios);
	axiosMock.onGet("/api/UCSBSubjects/all").reply(200, ucsbSubjectsFixtures.oneSubject);

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

		const setCourseJSONSpy = jest.fn();
		const fetchJSONSpy = jest.fn();

		fetchJSONSpy.mockResolvedValue(sampleReturnValue);

		const { getByText, getByLabelText } = render(
			<CourseSearchForm
				fetchJSON={fetchJSONSpy}
			/>
		);

		const expectedFields = {
			level: "G",
			quarter: "20084",
			subject: "ART - Art",
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

	test("test no courses toast", async () => {
		
		const sampleReturnValue = {
			total: 0
		};

		// Create spy functions (aka jest function, magic function)
		// The function doesn't have any implementation unless
		// we specify one.  But it does keep track of whether
		// it was called, how many times it was called,
		// and what it was passed.

		const setCourseJSONSpy = jest.fn();
		const fetchJSONSpy = jest.fn();

		fetchJSONSpy.mockResolvedValue(sampleReturnValue);

		const { getByText, getByLabelText } = render(
			<CourseSearchForm
				fetchJSON={fetchJSONSpy}
			/>
		);

		const expectedFields = {
			level: "G",
			quarter: "20084",
			subject: "ART - Art",
		};

		const selectLevel = getByLabelText("Course Level");
		userEvent.selectOptions(selectLevel, "G");

		const selectQuarter = getByLabelText("Quarter");
		userEvent.selectOptions(selectQuarter, "W22");

		const subjectSelector = getByLabelText("Subject");
		userEvent.selectOptions(subjectSelector, 'ANTH    ');

		const submitButton = getByText("Search");
		userEvent.click(submitButton);




	});
});