import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";


import { useBackend } from "main/utils/useBackend";
const AdminLoadSubjectsPage = () => {

    const { data: users, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/admin/loadSubjects"],
            { method: "GET", url: "/api/admin/loadSubjects" },
            []
        );

    return (
        <BasicLayout>
            <h2>LoadSubjects</h2>
            
        </BasicLayout>
    );
};

export default AdminLoadSubjectsPage;
