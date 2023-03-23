import type { ComponentStory, ComponentMeta } from "@storybook/react";

import SingleSelect from "../SingleSelect";

export default {
  title: "Components/Fields/SingleSelect",
  component: SingleSelect,
} as ComponentMeta<typeof SingleSelect>;

const Template: ComponentStory<typeof SingleSelect> = (args) => (
  <SingleSelect {...args} />
);

export const Base = Template.bind({});
Base.args = {
  options: ["this", "is", "opened", "and", "these", "are", "the", "options"],
  placeholder: "Single Select Placeholder"
};
