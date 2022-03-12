import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import PersonalSchedulesEditPage from "main/pages/PersonalSchedules/PersonalSchedulesEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
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
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("PersonalSchedulesEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/personalschedules", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {
            const {getByText, queryByTestId} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <PersonalSchedulesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await waitFor(() => expect(getByText("Edit PersonalSchedule")).toBeInTheDocument());
            expect(queryByTestId("PersonalScheduleForm-name")).not.toBeInTheDocument();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/personalschedules", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: "Joseph",
                description: "archery",
                quarter: "20202"
            });
            axiosMock.onPut('/api/personalschedules').reply(200, {
                id: "17",
                name: "Nicole",
                description: "video games",
                quarter: "20212"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <PersonalSchedulesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <PersonalSchedulesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("PersonalScheduleForm-name")).toBeInTheDocument());

            const idField = getByTestId("PersonalScheduleForm-id");
            const name = getByTestId("PersonalScheduleForm-name");
            const description = getByTestId("PersonalScheduleForm-description");
            const quarter = getByTestId("PersonalScheduleForm-quarter");
            const submitButton = getByTestId("PersonalScheduleForm-submit");

            expect(idField).toHaveValue("17");
            expect(name).toHaveValue("Joseph");
            expect(description).toHaveValue("archery");
            expect(quarter).toHaveValue("20202");
        });

        test("Changes when you click Update", async () => {

            const { getByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <PersonalSchedulesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await waitFor(() => expect(getByTestId("PersonalScheduleForm-name")).toBeInTheDocument());

            const idField = getByTestId("PersonalScheduleForm-id");
            const name = getByTestId("PersonalScheduleForm-name");
            const description = getByTestId("PersonalScheduleForm-description");
            const quarter = getByTestId("PersonalScheduleForm-quarter");
            const submitButton = getByTestId("PersonalScheduleForm-submit");

            expect(idField).toHaveValue("17");
            expect(name).toHaveValue("Joseph");
            expect(description).toHaveValue("archery");
            expect(quarter).toHaveValue("20202");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(name, { target: { value: 'Nicole' } })
            fireEvent.change(description, { target: { value: 'video games' } })
            fireEvent.change(quarter, { target: { value: "20212" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("PersonalSchedule Updated - id: 17 name: Nicole");
            expect(mockNavigate).toBeCalledWith({ "to": "/personalschedules/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: 'Nicole',
                description: "video games",
                quarter: "20212"
            })); // posted object

        });

       
    });
});