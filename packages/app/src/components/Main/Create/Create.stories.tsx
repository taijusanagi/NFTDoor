import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { Create as Component } from "./Create";

export default {
  title: "Components/Create",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => <Component {...args} />;

export const Create = Template.bind({});
