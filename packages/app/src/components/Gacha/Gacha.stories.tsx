import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { Gacha as Component } from "./Gacha";

export default {
  title: "Components/Gacha",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => <Component {...args} />;

export const Gacha = Template.bind({});
