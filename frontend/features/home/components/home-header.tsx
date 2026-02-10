"use client";

import * as React from "react";
import { ChevronDown, Coins } from "lucide-react";

import { useT } from "@/lib/i18n/client";
import { Button } from "@/components/ui/button";
import { CreditsPopover } from "./credits-popover";
import { UserMenu } from "@/features/user/components/user-menu";
import { RepoLinkButton } from "@/components/shared/repo-link-button";
import { PageHeaderShell } from "@/components/shared/page-header-shell";
import type { SettingsTabId } from "@/features/settings/types";

interface HomeHeaderProps {
  onOpenSettings?: (tab?: SettingsTabId) => void;
}

export function HomeHeader({ onOpenSettings }: HomeHeaderProps) {
  const { t } = useT("translation");

  return (
    <PageHeaderShell
      left={
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2 text-sm font-medium"
            title={t("header.switchWorkspace")}
          >
            {t("header.workspace")}
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </Button>
        </div>
      }
      right={
        <div className="flex items-center gap-1">
          <RepoLinkButton
            size="sm"
            className="flex size-8 items-center justify-center rounded-full p-0"
          />
          <CreditsPopover
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="mx-1 flex size-8 items-center justify-center rounded-full border border-primary/10 bg-primary/5 p-0 text-sm font-medium text-primary hover:bg-primary/10 hover:text-primary"
              >
                <Coins className="size-3.5" />
              </Button>
            }
            onViewUsage={() => onOpenSettings?.("usage")}
          />
          <UserMenu onOpenSettings={(tab) => onOpenSettings?.(tab)} />
        </div>
      }
    />
  );
}
