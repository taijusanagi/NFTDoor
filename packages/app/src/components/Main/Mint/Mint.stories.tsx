import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { Mint as Component } from "./Mint";

export default {
  title: "Components/Mint",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => <Component {...args} />;

export const Mint = Template.bind({});
