import { render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import AdminLoadSubjectsPage from "main/pages/AdminLoadSubjectsPage";
//import usersFixtures from "fixtures/usersFixtures";
//import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import mockConsole from "jest-mock-console";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("AdminLoadSubjectsPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    //const testId = "UsersTable";

    beforeEach( () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        //axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    




    test("renders empty page", async () => {
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/admin/loadSubjects").reply(200);

        const { getByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AdminLoadSubjectsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

    });


});


