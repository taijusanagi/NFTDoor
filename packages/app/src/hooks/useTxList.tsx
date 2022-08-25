import { TXList } from "../type/txList";

const LOCAL_STORAGE_KEY = "txList";

export const useTxList = () => {
  const get = (chainId: string) => {
    const txListString = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    let txList: TXList;
    if (!txListString) {
      txList = { [chainId]: [] };
    } else {
      txList = JSON.parse(txListString);
      if (!txList[chainId]) {
        txList[chainId] = [];
      }
    }
    return txList;
  };

  const set = (chainId: string, hash: string) => {
    const txList = get(chainId);
    const isExist = txList[chainId].some((existingHash) => {
      return existingHash === hash;
    });
    if (!isExist) {
      txList[chainId].push(hash);
    }
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(txList));
  };

  const remove = (chainId: string, hash: string) => {
    const txList = get(chainId);
    const index = txList[chainId].findIndex((existingHash) => {
      return existingHash === hash;
    });
    if (index >= 0) {
      txList[chainId].splice(index);
    }
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(txList));
  };

  return { get, remove, set };
};
