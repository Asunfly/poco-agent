import type { LucideIcon } from "lucide-react";

export type SettingsTabId = "account" | "models" | "usage";

export interface SettingsSidebarItem {
  id: SettingsTabId;
  label: string;
  icon: LucideIcon;
}

export type ApiProviderConfig = {
  enabled: boolean;
  key: string;
  useCustomBaseUrl: boolean;
  baseUrl: string;
};
