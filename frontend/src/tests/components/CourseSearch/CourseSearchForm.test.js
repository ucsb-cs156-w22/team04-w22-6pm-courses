import React from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CourseSearchForm from "main/components/CourseSearch/CourseSearchForm";

describe("CourseSearchForm tests", () => {
	const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

	test("renders without crashing", () => {
		const queryClient = new QueryClient();
		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<CourseSearchPage />
				</MemoryRouter>
			</QueryClientProvider>
		);
	});

	test("when I select a level, the state for level changes", () => {
		const queryClient = new QueryClient();
		const { getByLabelText } = render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<CourseSearchPage />
				</MemoryRouter>
			</QueryClientProvider>
		);
		const selectLevel = getByLabelText("Course Level");
		userEvent.selectOptions(selectLevel, "G");

		expect(selectLevel.value).toBe("G");
		expect(localStorage.getItem("CourseSearch.CourseLevel")).toBe("G");
	});

	test("when I click submit, the right stuff happens", async () => {
		const queryClient = new QueryClient();
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
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<CourseSearchForm
					setCourseJSON={setCourseJSONSpy}
					fetchJSON={fetchJSONSpy}/>
				</MemoryRouter>
			</QueryClientProvider>
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
		await waitFor(() => expect(setCourseJSONSpy).toHaveBeenCalledTimes(1));
		await waitFor(() => expect(fetchJSONSpy).toHaveBeenCalledTimes(1));

		// assert that ourSpy was called with the right value
		expect(setCourseJSONSpy).toHaveBeenCalledWith(sampleReturnValue);
		expect(fetchJSONSpy).toHaveBeenCalledWith(
			expect.any(Object),
			expectedFields
		);
	});
});