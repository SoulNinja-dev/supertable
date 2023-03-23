import type { ComponentStory, ComponentMeta } from "@storybook/react";

import PhoneInput from "../PhoneInput";

export default {
  title: "Components/Fields/PhoneInput",
  component: PhoneInput,
} as ComponentMeta<typeof PhoneInput>;

const Template: ComponentStory<typeof PhoneInput> = (args) => (
  <PhoneInput {...args} />
);

export const Base = Template.bind({});
Base.args = {
  type: "number",
  placeholder: "Phone Placeholder",
};
