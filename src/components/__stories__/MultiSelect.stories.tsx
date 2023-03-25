import type { ComponentStory, ComponentMeta } from "@storybook/react";

import MultiSelect from "../MultiSelect";

export default {
  title: "Components/Fields/MultiSelect",
  component: MultiSelect,
} as ComponentMeta<typeof MultiSelect>;

const Template: ComponentStory<typeof MultiSelect> = (args) => (
  <MultiSelect {...args} />
);

export const Base = Template.bind({});
Base.args = {
  options: ["this", "is", "opened", "and", "these", "are", "the", "options"],
  placeholder: "Multi Select Placeholder"
};
