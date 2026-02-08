"use client";

import * as React from "react";
import { Activity, Server, User } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useT } from "@/lib/i18n/client";
import { useUserAccount } from "@/features/user/hooks/use-user-account";
import { SettingsSidebar } from "@/features/settings/components/settings-sidebar";
import { AccountSettingsTab } from "@/features/settings/components/tabs/account-settings-tab";
import { ModelsSettingsTab } from "@/features/settings/components/tabs/models-settings-tab";
import { UsageSettingsTab } from "@/features/settings/components/tabs/usage-settings-tab";
import type {
  ApiProviderConfig,
  SettingsSidebarItem,
  SettingsTabId,
} from "@/features/settings/types";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_OPENAI_CONFIG: ApiProviderConfig = {
  enabled: false,
  key: "",
  useCustomBaseUrl: false,
  baseUrl: "https://api.openai.com/v1",
};

const DEFAULT_ANTHROPIC_CONFIG: ApiProviderConfig = {
  enabled: false,
  key: "",
  useCustomBaseUrl: false,
  baseUrl: "https://api.anthropic.com",
};

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { t } = useT("translation");
  const { profile, credits, isLoading } = useUserAccount();

  const [activeTab, setActiveTab] = React.useState<SettingsTabId>("account");
  const [isGlmEnabled, setIsGlmEnabled] = React.useState(true);
  const [openAiConfig, setOpenAiConfig] = React.useState(DEFAULT_OPENAI_CONFIG);
  const [anthropicConfig, setAnthropicConfig] = React.useState(
    DEFAULT_ANTHROPIC_CONFIG,
  );

  const sidebarItems = React.useMemo<SettingsSidebarItem[]>(
    () => [
      { icon: User, label: t("settings.sidebar.account"), id: "account" },
      { icon: Server, label: t("settings.sidebar.models"), id: "models" },
      { icon: Activity, label: t("settings.sidebar.usage"), id: "usage" },
    ],
    [t],
  );

  const activeTitle = React.useMemo(
    () => sidebarItems.find((item) => item.id === activeTab)?.label,
    [activeTab, sidebarItems],
  );

  const updateOpenAiConfig = React.useCallback(
    (patch: Partial<ApiProviderConfig>) => {
      setOpenAiConfig((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const updateAnthropicConfig = React.useCallback(
    (patch: Partial<ApiProviderConfig>) => {
      setAnthropicConfig((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const renderContent = () => {
    if (activeTab === "account") {
      return (
        <AccountSettingsTab
          profile={profile}
          credits={credits}
          isLoading={isLoading}
        />
      );
    }

    if (activeTab === "models") {
      return (
        <ModelsSettingsTab
          isGlmEnabled={isGlmEnabled}
          openAiConfig={openAiConfig}
          anthropicConfig={anthropicConfig}
          onToggleGlm={setIsGlmEnabled}
          onUpdateOpenAiConfig={updateOpenAiConfig}
          onUpdateAnthropicConfig={updateAnthropicConfig}
        />
      );
    }

    return <UsageSettingsTab />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-[1000px] !h-[75vh] flex w-[90vw] min-h-[500px] max-h-[800px] flex-col overflow-hidden gap-0 bg-background p-0 text-foreground"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{t("settings.dialogTitle")}</DialogTitle>
        </DialogHeader>

        <div className="flex min-h-0 flex-1">
          <SettingsSidebar
            items={sidebarItems}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
            <div className="flex shrink-0 items-center justify-between p-5 pb-2">
              <h2 className="text-xl font-semibold">{activeTitle}</h2>
            </div>
            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
