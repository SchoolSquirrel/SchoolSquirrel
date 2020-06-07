export const isElectron = (): boolean => typeof window !== "undefined" && (<any>window).process && (<any>window).process.type;
