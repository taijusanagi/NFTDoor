import { atom } from "recoil";

import config from "../../../config.json";

export const consoleState = atom({
  key: "consoleState",
  default: {
    mode: "log",
    logs: [config.app.defaultLog],
  },
});
