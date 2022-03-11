import React from "react";
import OurTable from "main/components/OurTable"

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

export default function PersonalScheduleTable({ personalSchedule }) {
    return <OurTable
        data={personalSchedule}
        columns={columns}
        testid={"personalScheduleTable"} />;
};