// export "" from ""
import configs from "../../config.json";

export type LinkKey = keyof typeof configs.links;
export type WalletKey = keyof typeof configs.wallets;
