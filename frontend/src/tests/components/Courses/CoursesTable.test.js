import { render, waitFor } from "@testing-library/react";
import CoursesTable from "main/components/Courses/CoursesTable";
import {coursesFixtures} from 'fixtures/coursesFixtures'

describe("CoursesTable tests", () => {

    test("renders an empty table without crashing", () => {
        render(
            <CoursesTable courses={[]} />
        );
    });

    test("renders a table with three rows without crashing", () => {
        render(
            <CoursesTable courses={coursesFixtures.threeCourses} />
        );
    });

    test("CoursesTable is testId", async () => {
        const {getByTestId } = render(
            <CoursesTable courses={coursesFixtures.threeCourses} />
        );
        await waitFor( ()=> expect(getByTestId("CoursesTable-header-quarter")).toBeInTheDocument() );
    });

    test("renders a table with three rows with correct content", async () => {
        const {getByTestId, getByText } = render(
            <CoursesTable courses={coursesFixtures.threeCourses} />
        );

        const columns = [
            {
                accessor: "quarter",
                Header: "Quarter"
            },
            {
                accessor: "courseId",
                Header: "Course ID"
            },
            {
                accessor: "title",
                Header: "Title"
            },
            {
                accessor: "description",
                Header: "Description"
            },
            {
                accessor: "objLevelCode",
                Header: "Course Level"
            },
            {
                accessor: "subjectArea",
                Header: "Subject Area"
            },
            {
                accessor: "unitsFixed",
                Header: "Units"
            },
        ]

        const expectedHeaders = columns.map(column => column.Header)
        const expectedFields = columns.map(column => column.accessor)
        const testId = "CoursesTable";
    
        expectedHeaders.forEach((headerText) => {
          const header = getByText(headerText);
          expect(header).toBeInTheDocument();
        });
    
        expectedFields.forEach((field) => {
          const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
          expect(header).toBeInTheDocument();
        });
    
        expect(getByTestId(`${testId}-cell-row-0-col-quarter`)).toHaveTextContent("20222");
        expect(getByTestId(`${testId}-cell-row-0-col-description`)).toHaveTextContent("The nature of culture: survey of the range of cultural phenomena, including material culture, social...");



    });

});