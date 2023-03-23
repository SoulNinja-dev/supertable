import type { ComponentStory, ComponentMeta } from "@storybook/react";

import PercentInput from "../PercentInput";

export default {
  title: "Components/Fields/PercentInput",
  component: PercentInput,
} as ComponentMeta<typeof PercentInput>;

const Template: ComponentStory<typeof PercentInput> = (args) => (
  <PercentInput {...args} />
);

export const Base = Template.bind({});
Base.args = {
  type: "number",
  placeholder: "Percent Placeholder",
};
