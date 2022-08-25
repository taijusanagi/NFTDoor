import { getDefaultProvider } from "ethers";
import { createClient } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

export const wagmiClient = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

export const connectors = {
  injected: new InjectedConnector(),
  walletConnect: new WalletConnectConnector({
    options: {
      qrcode: true,
    },
  }),
};
