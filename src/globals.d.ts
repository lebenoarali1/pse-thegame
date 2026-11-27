declare global {
  const __APP_VERSION__: string;
  const __BUILD_DATE__: string;
  interface Window { __G: unknown; webkitAudioContext: typeof AudioContext }
}
export {};
