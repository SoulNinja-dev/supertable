import type { ComponentStory, ComponentMeta } from "@storybook/react";

import DurationInput from "../DurationInput";

export default {
  title: "Components/Fields/DurationInput",
  component: DurationInput,
} as ComponentMeta<typeof DurationInput>;

const Template: ComponentStory<typeof DurationInput> = (args) => (
  <DurationInput {...args} />
);

export const Base = Template.bind({});
Base.args = {};
