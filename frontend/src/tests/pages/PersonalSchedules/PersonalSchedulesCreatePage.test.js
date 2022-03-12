import { fireEvent, render, waitFor} from "@testing-library/react";
import PersonalSchedulesCreatePage from "main/pages/PersonalSchedules/PersonalSchedulesCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";


const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("PersonalSchedulesCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PersonalSchedulesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const personalSchedule = {
            id: 17,
            name: "Test name 1",
            description: "Test description 1",
            quarter: "W08",
        };

        axiosMock.onPost("/api/personalschedules/post").reply( 202, personalSchedule );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <PersonalSchedulesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("PersonalScheduleForm-name")).toBeInTheDocument();
        });

        const nameField = getByTestId("PersonalScheduleForm-name");
        const descriptionField = getByTestId("PersonalScheduleForm-description");
        const quarterField = document.querySelector("#PersonalScheduleForm-quarter");
        const submitButton = getByTestId("PersonalScheduleForm-submit");

        fireEvent.change(nameField, { target: { value: "Test name 1" } });
        fireEvent.change(descriptionField, { target: { value: "Test description 1" } });
        fireEvent.change(quarterField, { target: { value: "20222" } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(quarterField).toHaveValue("20222");
        expect(axiosMock.history.post[0].params).toEqual({
            name: "Test name 1",
            description: "Test description 1",
            quarter: "20222"
          });

          expect(mockToast).toBeCalledWith("New PersonalSchedule Created - id: 17 name: Test name 1");
          expect(mockNavigate).toBeCalledWith({ to: "/personalschedules/list" });
    });


});

