
import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
// import { toast } from "react-toastify";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/UCSBSubjectsUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBSubjectsTable({ subjects, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/ucsbsubjects/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/ucsbsubjects/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'ID',
            accessor: 'id',
        },
        {
            Header: 'Subject Code',
            accessor: 'subjectCode',
        },
        {
            Header: 'Subject Translation',
            accessor: 'subjectTranslation',
        },
        {
            Header: 'Dept. Code',
            accessor: 'deptCode',
        },
        {
            Header: 'College Code',
            accessor: 'collegeCode',
        },
        {
            Header: 'Related Dept. Code',
            accessor: 'relatedDeptCode',
        },
        {
            Header: 'Inactive',
            accessor: 'inactive',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "UCSBSubjectsTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "UCSBSubjectsTable"));
    } 

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    const memoizedSubjects = React.useMemo(() => subjects, [subjects]);
  
    return <OurTable
        data={memoizedSubjects}
        columns={memoizedColumns}
        testid={"UCSBSubjectsTable"}
    />;
};