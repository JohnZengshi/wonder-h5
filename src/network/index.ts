import { defineChain } from "viem";

export const tronTestnet = {
  id: 3448148188,
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
      url: "https://nile.tronscan.org/tx/",
    },
  },
};

export const tron = /*#__PURE__*/ defineChain({
  id: 728126428,
  name: "Tron",
  nativeCurrency: { name: "TRON", symbol: "TRX", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://tron-mainnet.token.im"],
    },
  },
  blockExplorers: {
    default: {
      name: "Tronscan",
      url: "https://tronscan.io",
      apiUrl: "https://apilist.tronscanapi.com/api",
    },
  },
});
