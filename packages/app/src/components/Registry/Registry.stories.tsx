import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { Registry as Component } from "./Registry";

export default {
  title: "Components/Registry",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => <Component {...args} />;

export const Registry = Template.bind({});
