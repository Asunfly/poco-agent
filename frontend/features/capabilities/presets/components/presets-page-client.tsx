"use client";

import { CapabilityPageHeader } from "@/features/capabilities/components/capability-page-header";
import { useT } from "@/lib/i18n/client";

export function PresetsPageClient() {
  const { t } = useT("translation");

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <CapabilityPageHeader title={t("library.presetsPage.header.title")} />
      <div className="flex flex-1 overflow-hidden" />
    </div>
  );
}
