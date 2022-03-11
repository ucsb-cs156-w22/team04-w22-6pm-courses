import React, { useState } from 'react';

import LevelSelector from "main/components/CourseSearch/LevelSelector";
import { oneLevel, allLevels } from "main/utils/levelsUtils_NoStryker.js"

export default {
    title: 'components/CourseSearch/LevelSelector',
    component: LevelSelector
};

const Template = (args) => {
    const [level, setLevel] = useState(args.levels[0]);

    return (
        <LevelSelector
        levels={args.levels} 
        setLevel={setLevel} 
        controlId={"SampleControlId"}
        label={"Level"} 
        {...args} />
    )
};

export const OneLevel = Template.bind({});
OneLevel.args = {
    levels : oneLevel
};

export const AllLevels = Template.bind({});
AllLevels.args = {
    levels: allLevels
};

