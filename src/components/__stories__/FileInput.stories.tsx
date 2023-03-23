import type { ComponentStory, ComponentMeta } from "@storybook/react";

import FileInput from "../FileInput";

export default {
  title: "Components/Fields/FileInput",
  component: FileInput,
} as ComponentMeta<typeof FileInput>;

const Template: ComponentStory<typeof FileInput> = (args) => (
  <FileInput {...args} />
);

export const Base = Template.bind({});
Base.args = {
  type: "file",
  placeholder: "File Placeholder",
};
