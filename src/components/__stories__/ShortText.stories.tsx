import type { ComponentStory, ComponentMeta } from "@storybook/react";

import ShortText from "../ShortText";

export default {
  title: "Components/Fields/ShortText",
  component: ShortText,
} as ComponentMeta<typeof ShortText>;

const Template: ComponentStory<typeof ShortText> = (args) => (
  <ShortText {...args} />
);

export const Base = Template.bind({});
Base.args = {
  type: "text",
  placeholder: "Short Text Placeholder",
};
