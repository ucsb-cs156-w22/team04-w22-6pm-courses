import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import AdminPersonalSchedulesTable from 'main/components/AdminPersonalSchedules/AdminPersonalSchedulesTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function AdminPersonalSchedulesIndexPage() {

  const currentUser = useCurrentUser();

  const { data: personalSchedules, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/personalschedules/admin/all"],
      { method: "GET", url: "/api/personalschedules/admin/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>All Personal Schedules</h1>
        <AdminPersonalSchedulesTable personalSchedules={personalSchedules} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
  
}