import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/PersonalScheduleUtils"
import { useNavigate } from "react-router-dom";


export default function PersonalSchedulesTable({  personalSchedules}) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/admin/personalschedules/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/admin/personalschedules/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'User',
            accessor: 'user', 
        },
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Description',
            accessor: 'description',
        },
        {
            Header: 'Quarter',
            accessor: 'quarter',
        },
    ];

    
    columns.push(ButtonColumn("Edit", "primary", editCallback, "AdminPersonalSchedulesTable"));
    columns.push(ButtonColumn("Delete", "danger", deleteCallback, "AdminPersonalSchedulesTable"));
    

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedPersonalSchedules = React.useMemo(() => personalSchedules, [personalSchedules]);

    return <OurTable
        data={memoizedPersonalSchedules}
        columns={memoizedColumns}
        testid={"AdminPersonalSchedulesTable"}
    />;
}; 