import React, { useState } from 'react';

import SubjectSelector from "main/components/CourseSearch/SubjectSelector.js";

import * as subjectFixtures from "fixtures/subjectFixtures.js"

export default {
  title: 'components/CourseSearch/SubjectSelector',
  component: SubjectSelector
};

const Template = (args) => {
  const [subject, setSubject] = useState("ANTH");

  return (
    <SubjectSelector setSubject={setSubject} subject={subject} {...args} />
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