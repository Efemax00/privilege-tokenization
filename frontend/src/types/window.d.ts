interface XverseWindow {
  xfi?: {
    bitcoin?: {
      signAndSendTransaction: (options: any) => Promise<string>;
      signMessage: (message: string) => Promise<string>;
      getBalance: () => Promise<number>;
    };
  };
}

declare global {
  interface Window extends XverseWindow {}
}

export {};
