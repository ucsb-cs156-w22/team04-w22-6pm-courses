import React, { useState } from 'react';

import SelectSubject from "main/components/SelectSubject.js";

import * as subjectFixtures from "fixtures/subjectFixtures.js"

export default {
  title: 'components/BasicCourseSearch/SelectSubject',
  component: SelectSubject
};

const Template = (args) => {
  const [subject, setSubject] = useState("ANTH");

  return (
    < SelectSubject setSubject={setSubject} subject={subject} {...args} />
  )
};


export const OneSubject = Template.bind({});
OneSubject.args = {
  subjects: subjectFixtures.oneSubject
};

export const ThreeSubjects = Template.bind({});
ThreeSubjects.args = {
  subjects: subjectFixtures.threeSubjects
};

export const AllTheSubjects = Template.bind({});
AllTheSubjects.args = {
  subjects: subjectFixtures.allTheSubjects,
};