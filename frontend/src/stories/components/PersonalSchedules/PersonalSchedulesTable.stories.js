import React from 'react';

import PersonalSchedulesTable from 'main/components/PersonalSchedules/PersonalSchedulesTable';
import { personalSchedulesFixtures } from 'fixtures/personalSchedulesFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';

export default {
    title: 'components/PersonalSchedules/PersonalSchedulesTable',
    component: PersonalSchedulesTable
};

const Template = (args) => {
    return (
        <PersonalSchedulesTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    personalSchedules: []
};

export const ThreeSubjects = Template.bind({});

ThreeSubjects.args = {
    personalSchedules: personalSchedulesFixtures.threePersonalSchedules
};


export const ThreeSubjectsUser = Template.bind({});
ThreeSubjectsUser.args = {
    personalSchedules: personalSchedulesFixtures.threePersonalSchedules,
    currentUser: currentUserFixtures.adminUser
};
