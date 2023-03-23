import type { ComponentStory, ComponentMeta } from "@storybook/react";

import LinkInput from "../LinkInput";

export default {
  title: "Components/Fields/LinkInput",
  component: LinkInput,
} as ComponentMeta<typeof LinkInput>;

const Template: ComponentStory<typeof LinkInput> = (args) => (
  <LinkInput {...args} />
);

export const Base = Template.bind({});
Base.args = {
  type: "url",
  placeholder: "URL Placeholder",
};
