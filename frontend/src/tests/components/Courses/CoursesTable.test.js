import { render, waitFor, fireEvent } from "@testing-library/react";
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

    test("click on a header and a sort caret should appear", async () => {
        const {getByTestId, getByText } = render(
            <CoursesTable courses={coursesFixtures.threeCourses} />
        );

        await waitFor( ()=> expect(getByTestId("CoursesTable-header-quarter")).toBeInTheDocument() );
        const col1Header = getByTestId("CoursesTable-header-quarter");

        const col1SortCarets = getByTestId("CoursesTable-header-quarter-sort-carets");
        expect(col1SortCarets).toHaveTextContent('');

        const col1Row0 = getByTestId("CoursesTable-cell-row-0-col-quarter");
        expect(col1Row0).toHaveTextContent("20222");

        fireEvent.click(col1Header);
        await waitFor( ()=> expect(getByText("🔼")).toBeInTheDocument() );

        fireEvent.click(col1Header);
        await waitFor( ()=> expect(getByText("🔽")).toBeInTheDocument() );

        

    });

});