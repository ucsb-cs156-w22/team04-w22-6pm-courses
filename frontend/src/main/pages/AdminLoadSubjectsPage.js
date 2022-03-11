import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import SubjectsTable from "main/components/UCSBSubjects/UCSBSubjectsTable"
import { toast } from "react-toastify";
import { useBackend } from "main/utils/useBackend";
import { useBackendMutation } from 'main/utils/useBackend';
import { Button } from 'react-bootstrap';

const AdminLoadSubjectsPage = () => {

    const { data: UCSBSubjects, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/UCSBSubjects/all"],
            { method: "GET", url: "/api/UCSBSubjects/all" },
            []
        );
    const objectToAxiosParams = () => ({
        url: "api/UCSBSubjects/load",
        method: "POST",
    });
 
    const loadMut = useBackendMutation(
        objectToAxiosParams,
    
        ['/api/UCSBSubjects/all']
    )
   
 
    const subjectload = async(data) => {
        
        
        loadMut.mutate(data);
        toast(`${UCSBSubjects.length} subjects loaded`)
        //location.reload();
    }
    return (
        <BasicLayout>
            <h2>UCSBSubjects</h2>
            <SubjectsTable subjects={UCSBSubjects} />
            <Button
                onClick={subjectload}
                data-testid="AdminLoadSubjectsPage-load"
            >

                Load
            </Button>
        </BasicLayout>
    );
};
export default AdminLoadSubjectsPage;
