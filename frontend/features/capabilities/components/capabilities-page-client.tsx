"use client";

import * as React from "react";
import { Suspense } from "react";

import { CapabilitiesSidebar } from "@/features/capabilities/components/capabilities-sidebar";
import { useCapabilityViews } from "@/features/capabilities/hooks/use-capability-views";
import {
  consumePendingCapabilityView,
  getLastCapabilityView,
  setLastCapabilityView,
} from "@/features/capabilities/lib/capability-view-state";

export function CapabilitiesPageClient() {
  const views = useCapabilityViews();
  const [activeViewId, setActiveViewId] = React.useState<string>("skills");

  React.useEffect(() => {
    if (!views.length) return;

    const pendingViewId = consumePendingCapabilityView();
    if (pendingViewId && views.some((view) => view.id === pendingViewId)) {
      setActiveViewId(pendingViewId);
      return;
    }

    const lastViewId = getLastCapabilityView();
    if (lastViewId && views.some((view) => view.id === lastViewId)) {
      setActiveViewId(lastViewId);
      return;
    }

    const defaultViewId =
      views.find((view) => view.id === "skills")?.id ??
      views[0]?.id ??
      "skills";
    setActiveViewId(defaultViewId);
  }, [views]);

  React.useEffect(() => {
    if (!activeViewId) return;
    setLastCapabilityView(activeViewId);
  }, [activeViewId]);

  const activeView = React.useMemo(() => {
    return views.find((view) => view.id === activeViewId) ?? views[0];
  }, [views, activeViewId]);

  const ActiveComponent = activeView?.component;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid min-h-0 flex-1 lg:grid-cols-[240px_minmax(0,1fr)]">
        <CapabilitiesSidebar
          views={views}
          activeViewId={activeView?.id}
          onSelect={setActiveViewId}
        />

        <main className="min-h-0 overflow-hidden">
          {ActiveComponent ? (
            <Suspense fallback={<div className="h-full w-full" />}>
              <div className="flex h-full min-h-0 flex-col">
                <ActiveComponent key={activeView?.id} />
              </div>
            </Suspense>
          ) : null}
        </main>
      </div>
    </div>
  );
}
