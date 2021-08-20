// store account id in local storage
export function setAccountId(id: string) {
  // const store = window.localStorage;
  // store.setItem(`TVAccountId`, id);
  (window as any).currentTvAccountId = id;
}

export function getAccountId() {
  // const store = window.localStorage;
  // if (store.getItem(`TVAccountId`) === 'null') return undefined;
  // return store.getItem(`TVAccountId`);
  return (window as any).currentTvAccountId;
}
