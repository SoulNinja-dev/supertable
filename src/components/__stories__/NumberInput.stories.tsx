import type { ComponentStory, ComponentMeta } from "@storybook/react";

import NumberInput from "../NumberInput";

export default {
  title: "Components/Fields/NumberInput",
  component: NumberInput,
} as ComponentMeta<typeof NumberInput>;

const Template: ComponentStory<typeof NumberInput> = (args) => (
  <NumberInput {...args} />
);

export const Base = Template.bind({});
Base.args = {
  type: "number",
  placeholder: "Number Placeholder",
};
