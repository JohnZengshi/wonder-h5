/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 前端基础域名 */
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_BSC_USDT_ADDRESS: `0x${string}`;
  readonly VITE_BSC_BUSINESS_ADDRESS: `0x${string}`;
  readonly VITE_TRON_USDT_ADDRESS: `0x${string}`;
  readonly VITE_TRON_BUSINESS_ADDRESS: `0x${string}`;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
