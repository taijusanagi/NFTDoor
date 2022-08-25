import { useRecoilState } from "recoil";

import { consoleState } from "./consoleState";

export const useConsole = () => {
  const [, setConsoleState] = useRecoilState(consoleState);

  const _console = {
    log: (...logs: any[]) => {
      setConsoleState({ mode: "log", logs });
      console.log(logs);
    },
    error: (...logs: any[]) => {
      setConsoleState({ mode: "error", logs });
      console.error(logs);
    },
  };
  return { console: _console };
};
