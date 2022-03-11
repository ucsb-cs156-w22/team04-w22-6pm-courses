import { render, fireEvent } from "@testing-library/react";
import CourseSearchPage from "main/pages/CourseSearchPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("CourseSearchPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseSearchPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("Test for checkbox Cancelled,Closed,Full", () => {
        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseSearchPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const checkboxCancelled = getByTestId("inline-checkbox-cancelled");
        expect(checkboxCancelled.checked).toEqual(false);
        fireEvent.click(checkboxCancelled);
        expect(checkboxCancelled.checked).toEqual(true);

        const checkboxClosed = getByTestId("inline-checkbox-closed");
        expect(checkboxClosed.checked).toEqual(false);
        fireEvent.click(checkboxClosed);
        expect(checkboxClosed.checked).toEqual(true);

        const checkboxFull = getByTestId("inline-checkbox-full");
        expect(checkboxFull.checked).toEqual(false);
        fireEvent.click(checkboxFull);
        expect(checkboxFull.checked).toEqual(true);
    });
});