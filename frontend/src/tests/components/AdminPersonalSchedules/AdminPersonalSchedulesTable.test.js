import { fireEvent, render, waitFor } from "@testing-library/react";
import { adminPersonalSchedulesFixtures } from "fixtures/adminPersonalSchedulesFixtures";
import AdminPersonalSchedulesTable from "main/components/AdminPersonalSchedules/AdminPersonalSchedulesTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { onDeleteSuccess, cellToAxiosParamsDelete } from "main/components/AdminPersonalSchedules/AdminPersonalSchedulesTable";
import mockConsole from "jest-mock-console";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

const mockedMutate = jest.fn();

jest.mock('main/utils/useBackend', () => ({
    ...jest.requireActual('main/utils/useBackend'),
    useBackendMutation: () => ({mutate: mockedMutate})
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();




  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminPersonalSchedulesTable personalSchedules={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });



  test("Has the expected colum headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminPersonalSchedulesTable personalSchedules={adminPersonalSchedulesFixtures.threePersonalSchedules} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id","User","Name","Description","Quarter"];
    const expectedFields = ["id","user","name","description","quarter"];
    const testId = "AdminPersonalSchedulesTable";

    expectedHeaders.forEach((headerText) => {
      const header = getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");

    const editButton = getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });




  test("Edit button navigates to the edit page for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminPersonalSchedulesTable personalSchedules={adminPersonalSchedulesFixtures.threePersonalSchedules} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(getByTestId(`AdminPersonalSchedulesTable-cell-row-0-col-id`)).toHaveTextContent("1"); });

    const editButton = getByTestId(`AdminPersonalSchedulesTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/admin/personalschedules/edit/1'));

  });

  
  
  test("Delete button calls delete callback for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AdminPersonalSchedulesTable personalSchedules={adminPersonalSchedulesFixtures.threePersonalSchedules} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(getByTestId(`AdminPersonalSchedulesTable-cell-row-0-col-id`)).toHaveTextContent("1"); });

    const deleteButton = getByTestId(`AdminPersonalSchedulesTable-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    await waitFor(() => expect(mockedMutate).toHaveBeenCalledTimes(1));
  });


});
 

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("adminPersonalScheduleUtils", () => {

    describe("onDeleteSuccess", () => {

        test("It puts the message on console.log and in a toast", () => {
            // arrange
            const restoreConsole = mockConsole();

            // act
            onDeleteSuccess("abc");

            // assert
            expect(mockToast).toHaveBeenCalledWith("abc");
            expect(console.log).toHaveBeenCalled();
            const message = console.log.mock.calls[0][0];
            expect(message).toMatch("abc");

            restoreConsole();
        });

    });
    describe("cellToAxiosParamsDelete", () => {

        test("It returns the correct params", () => {
            // arrange
            const cell = { row: { values: { id: 17 } } };

            // act
            const result = cellToAxiosParamsDelete(cell);

            // assert
            expect(result).toEqual({
                url: "/api/personalschedules/admin",
                method: "DELETE",
                params: { id: 17 }
            });
        });

    });

});
