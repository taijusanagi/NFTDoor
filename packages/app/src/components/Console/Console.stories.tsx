import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { Console as Component } from "./Console";

export default {
  title: "Components/Console",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Console = Template.bind({});
