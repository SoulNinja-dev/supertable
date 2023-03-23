import type { ComponentStory, ComponentMeta } from "@storybook/react";

import LongText from "../LongText";

export default {
  title: "Components/Fields/LongText",
  component: LongText,
} as ComponentMeta<typeof LongText>;

const Template: ComponentStory<typeof LongText> = (args) => (
  <LongText {...args} />
);

export const Base = Template.bind({});
Base.args = {
  placeholder: "Long Text Placeholder",
};
