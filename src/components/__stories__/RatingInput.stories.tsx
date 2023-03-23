import type { ComponentStory, ComponentMeta } from "@storybook/react";

import RatingInput from "../RatingInput";

export default {
  title: "Components/Fields/RatingInput",
  component: RatingInput,
} as ComponentMeta<typeof RatingInput>;

const Template: ComponentStory<typeof RatingInput> = (args) => (
  <RatingInput {...args} />
);

export const Base = Template.bind({});
Base.args = {
  rating: 5,
  setRating: () => {
    // pass
  },
};
