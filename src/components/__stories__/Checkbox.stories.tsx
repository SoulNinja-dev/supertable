import type { ComponentStory, ComponentMeta } from "@storybook/react";

import Checkbox from "../Checkbox";

export default {
  title: "Components/Fields/Checkbox",
  component: Checkbox,
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => (
  <Checkbox {...args} />
);

export const Base = Template.bind({});
Base.args = {
  checked: false,
  setChecked: () => {
    // pass
  },
};
