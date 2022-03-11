import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import PersonalScheduleTable from "main/components/PersonalSchedules/PersonalScheduleTable"
import { useBackend } from "main/utils/useBackend";
import { Button } from 'react-bootstrap';
const AdminLoadSubjectsPage = () => {

  const { data: PersonalSchedules, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/personalschedules/all"],
      { method: "GET", url: "/api/personalschedules/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>PersonalSchedulesList</h1>
        <PersonalScheduleTable personalSchedule={PersonalSchedules} />
        <Button
          variant="primary"
          data-testid="personalSchedulesEdit"
        >
          Edit
        </Button>
        <pre></pre>
        <Button
          variant="primary"
          data-testid="personalSchedulesDelete"
        >
          Delete
        </Button>
      </div>
    </BasicLayout>
  )
};

export default AdminLoadSubjectsPage;
