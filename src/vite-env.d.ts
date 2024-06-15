/// <reference types="vite/client" />

declare const APP_VERSION: string;
declare const PREVIEW: boolean;
declare const NODE_ENV: "development" | "production";

declare module "*?raw" {
  const content: string;
  export default string;
}
