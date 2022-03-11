import React from 'react';

import PersonalScheduleTable from "main/components/PersonalSchedules/PersonalScheduleTable";
import { personalSchedulesFixtures } from 'fixtures/personalSchedulesFixtures';

export default {
    title: 'components/PersonalSchedules/PersonalScheduleTable',
    component: PersonalScheduleTable
};

const Template = (args) => {
    return (
        <PersonalScheduleTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    PersonalSchedule: []
};

export const Show = Template.bind({});

Show.args = {
    PersonalSchedule: personalSchedulesFixtures.onePersonalSchedule,
    submitText: "",
    submitAction: () => { }
};