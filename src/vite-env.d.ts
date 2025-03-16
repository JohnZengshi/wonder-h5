/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 前端基础域名 */
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_API_BASE_URL: string;
  // 其他环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
