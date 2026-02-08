"use client";

import { CapabilityContentShell } from "@/features/capabilities/components/capability-content-shell";
import { useT } from "@/lib/i18n/client";

export function PresetsPageClient() {
  const { t } = useT("translation");

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <CapabilityContentShell className="overflow-auto">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          <div className="flex flex-col gap-2 rounded-xl bg-muted/50 px-5 py-4 text-sm text-muted-foreground">
            <p>{t("library.presets.description")}</p>
          </div>

          <div className="rounded-xl border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
            {t("library.comingSoon")}
          </div>
        </div>
      </CapabilityContentShell>
    </div>
  );
}
