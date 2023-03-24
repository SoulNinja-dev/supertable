import type { ComponentStory, ComponentMeta } from "@storybook/react";

import DateInput from "../DateInput";

export default {
  title: "Components/Fields/DateInput",
  component: DateInput,
} as ComponentMeta<typeof DateInput>;

const Template: ComponentStory<typeof DateInput> = (args) => (
  <DateInput {...args} />
);

export const Base = Template.bind({});
Base.args = {};
