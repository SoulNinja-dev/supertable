import type { ComponentStory, ComponentMeta } from "@storybook/react";

import EmailInput from "../EmailInput";

export default {
  title: "Components/Fields/EmailInput",
  component: EmailInput,
} as ComponentMeta<typeof EmailInput>;

const Template: ComponentStory<typeof EmailInput> = (args) => (
  <EmailInput {...args} />
);

export const Base = Template.bind({});
Base.args = {
  type: "email",
  placeholder: "Email Placeholder",
};
