import networks from "../networks.json";

export type Network = keyof typeof networks;

export const isNetwork = (network: string): network is Network => {
  return Object.keys(networks).includes(network);
};
