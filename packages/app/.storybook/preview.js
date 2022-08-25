import "../src/styles/globals.css";
import { WagmiConfig } from "wagmi";
import { RecoilRoot } from "recoil";

import { wagmiClient } from "../src/lib/wagmi";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

/*
 * @dev: chakra provider is required since chakra provides storybook add-on
 */
export const decorators = [
  (Story) => (
    <RecoilRoot>
      <WagmiConfig client={wagmiClient}>
        <Story />
      </WagmiConfig>
    </RecoilRoot>
  ),
];
