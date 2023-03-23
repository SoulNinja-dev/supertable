import type { ComponentStory, ComponentMeta } from "@storybook/react";

import CurrencyInput from "../CurrencyInput";

export default {
  title: "Components/Fields/CurrencyInput",
  component: CurrencyInput,
} as ComponentMeta<typeof CurrencyInput>;

const Template: ComponentStory<typeof CurrencyInput> = (args) => (
  <CurrencyInput {...args} />
);

export const Base = Template.bind({});
Base.args = {
  type: "number",
  placeholder: "Currency Placeholder",
};
