import { ReactNode } from "react";
import { SWRConfig, SWRConfiguration } from "swr";

const config: SWRConfiguration = {};

export function SWRConfigProvider({ children }: { children: ReactNode }) {
  return <SWRConfig value={config}>{children}</SWRConfig>;
}
