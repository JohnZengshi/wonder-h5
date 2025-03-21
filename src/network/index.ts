export const tronTestnet = {
  id: 94_894,
  name: "Nile Testnet",
  network: "nile",
  nativeCurrency: {
    decimals: 18, // 必须强制使用 18 位小数通过验证
    name: "TRON",
    symbol: "TRX",
  },
  rpcUrls: {
    default: { http: ["https://nile.trongrid.io"] },
  },
  blockExplorers: {
    default: {
      name: "Tronscan",
      url: "https://nile.tronscan.org",
    },
  },
};
