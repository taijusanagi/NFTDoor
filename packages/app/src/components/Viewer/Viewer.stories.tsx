import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { Viewer as Component } from "./Viewer";

export default {
  title: "Components/Viewer",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => <Component {...args} />;

export const Common = Template.bind({});
Common.args = {
  image: "/img/samples/common.png",
  effectVideo: "/img/samples/common.mp4",
  delayTime: 2000,
};

export const Rare = Template.bind({});
Rare.args = {
  image: "/img/samples/rare.png",
  effectVideo: "/img/samples/rare.mp4",
  delayTime: 9250,
};
