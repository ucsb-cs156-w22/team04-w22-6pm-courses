import React from 'react';

import AdminPersonalSchedulesTable from 'main/components/AdminPersonalSchedules/AdminPersonalSchedulesTable';
import { adminPersonalSchedulesFixtures } from 'fixtures/adminPersonalSchedulesFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';

export default {
    title: 'components/AdminPersonalSchedules/AdminPersonalSchedulesTable',
    component: AdminPersonalSchedulesTable
};

const Template = (args) => {
    return (
        <AdminPersonalSchedulesTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    personalSchedules: []
};

export const ThreeSubjects = Template.bind({});

ThreeSubjects.args = {
    personalSchedules: adminPersonalSchedulesFixtures.threePersonalSchedules
};


export const ThreeSubjectsUser = Template.bind({});
ThreeSubjectsUser.args = {
    personalSchedules: adminPersonalSchedulesFixtures.threePersonalSchedules,
    currentUser: currentUserFixtures.adminUser
};
