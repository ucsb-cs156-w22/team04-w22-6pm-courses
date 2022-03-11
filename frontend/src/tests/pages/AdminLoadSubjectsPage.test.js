import { render, waitFor,fireEvent} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import AdminLoadSubjectsPage from "main/pages/AdminLoadSubjectsPage";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbSubjectsFixtures } from "fixtures/ucsbSubjectsFixtures";
import mockConsole from "jest-mock-console";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("AdminLoadSubjectsPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);


    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();

        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });


    const mockToast = jest.fn();
    jest.mock('react-toastify', () => {
        const originalModule = jest.requireActual('react-toastify');
        return {
            __esModule: true,
            ...originalModule,
            toast: (x) => mockToast(x),
        };
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
    
  test('retrieve subjects test', async () => {
    const axiosMock = new AxiosMockAdapter(axios);

    const queryClient = new QueryClient();
    axiosMock
      .onGet('api/admin/UCSBSubjects/all')
      .replyOnce(200, [])
      .onGet('/api/admin/UCSBSubjects/all')
      .reply(200, ucsbSubjectsFixtures.threeSubjects);
    axiosMock
      .onPost('/api/admin/UCSBSubjects/load')
      .reply(200, ucsbSubjectsFixtures.threeSubjects);

    const { queryByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminLoadSubjectsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const loadButton = queryByTestId(`AdminLoadSubjectsPage-load`);
    expect(loadButton).toBeInTheDocument();

    fireEvent.click(loadButton);
  });


});


