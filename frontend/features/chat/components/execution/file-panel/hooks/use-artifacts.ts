import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { getFilesAction } from "@/features/chat/actions/query-actions";
import type { FileNode } from "@/features/chat/types";

export type ViewMode = "artifacts" | "document";

const normalizePath = (value: string) => value.replace(/^\/+/, "");

const isActiveStatus = (status?: UseArtifactsOptions["sessionStatus"]) =>
  status === "running" || status === "accepted";

const isFinishedStatus = (status?: UseArtifactsOptions["sessionStatus"]) =>
  status === "completed" ||
  status === "failed" ||
  status === "cancelled" ||
  status === "stopped";

const findFileByPath = (
  nodes: FileNode[],
  targetPath: string,
): FileNode | undefined => {
  const normalizedTarget = normalizePath(targetPath);
  for (const node of nodes) {
    if (node.type === "file" && normalizePath(node.path) === normalizedTarget) {
      return node;
    }
    if (node.children && node.children.length) {
      const found = findFileByPath(node.children, targetPath);
      if (found) return found;
    }
  }
  return undefined;
};

interface UseArtifactsOptions {
  sessionId?: string;
  sessionStatus?:
    | "running"
    | "accepted"
    | "completed"
    | "failed"
    | "cancelled"
    | "stopped";
}

interface UseArtifactsReturn {
  files: FileNode[];
  selectedFile: FileNode | undefined;
  viewMode: ViewMode;
  isRefreshing: boolean;
  selectFile: (file: FileNode) => void;
  closeViewer: () => void;
  refreshFiles: () => Promise<void>;
}

/**
 * Manages artifacts panel state and file list fetching
 *
 * Responsibilities:
 * - Fetch workspace file list from API
 * - Auto-refresh when session finishes
 * - Manage view mode (artifacts list vs document preview)
 * - Manage sidebar open/close state
 * - Handle file selection
 * - Force open sidebar for file preview
 */
export function useArtifacts({
  sessionId,
  sessionStatus,
}: UseArtifactsOptions): UseArtifactsReturn {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>("artifacts");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Coalesce concurrent refresh triggers (manual / auto / polling) into one request.
  const fetchPromiseRef = useRef<Promise<FileNode[]> | null>(null);
  const fetchFiles = useCallback(async (): Promise<FileNode[]> => {
    if (!sessionId) return [];
    if (fetchPromiseRef.current) return fetchPromiseRef.current;

    const promise = (async () => {
      setIsRefreshing(true);
      try {
        const data = await getFilesAction({ sessionId });
        setFiles(data);
        return data;
      } catch (error) {
        console.error("[Artifacts] Failed to fetch workspace files:", error);
        return [];
      } finally {
        setIsRefreshing(false);
        fetchPromiseRef.current = null;
      }
    })();

    fetchPromiseRef.current = promise;
    return promise;
  }, [sessionId]);

  // Manual refresh method
  const refreshFiles = useCallback(async () => {
    await fetchFiles();
  }, [fetchFiles]);

  // Initial fetch when sessionId becomes available.
  useEffect(() => {
    setViewMode("artifacts");
    setSelectedPath(undefined);
    void fetchFiles();
  }, [sessionId, fetchFiles]);

  // Auto-refresh when session transitions into a finished status.
  const prevStatusRef = useRef<typeof sessionStatus>(undefined);
  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = sessionStatus;

    if (!sessionId || !sessionStatus) return;
    if (isActiveStatus(prevStatus) && isFinishedStatus(sessionStatus)) {
      void fetchFiles();
    }
  }, [sessionId, sessionStatus, fetchFiles]);

  // Select a file and switch to document view
  const selectFile = useCallback((file: FileNode) => {
    setSelectedPath(normalizePath(file.path));
    setViewMode("document");
  }, []);

  const closeViewer = useCallback(() => {
    setViewMode("artifacts");
    setSelectedPath(undefined);
  }, []);

  const selectedFile = useMemo((): FileNode | undefined => {
    if (!selectedPath) return undefined;
    return (
      findFileByPath(files, selectedPath) ?? {
        id: selectedPath,
        name: selectedPath.split("/").pop() || selectedPath,
        path: selectedPath,
        type: "file",
      }
    );
  }, [files, selectedPath]);

  // If the user opens a file before its preview URL is ready, poll until it becomes available.
  useEffect(() => {
    if (!sessionId) return;
    if (viewMode !== "document") return;
    if (!selectedPath) return;
    if (selectedFile?.url) return;

    const intervalMs = 2000;
    const maxAttempts = 60; // ~2 minutes
    let attempts = 0;
    let cancelled = false;
    let timer: number | undefined;

    const pollOnce = async () => {
      if (cancelled) return;
      if (attempts >= maxAttempts) return;
      attempts += 1;
      await fetchFiles();
      if (cancelled) return;
      timer = window.setTimeout(() => {
        void pollOnce();
      }, intervalMs);
    };

    // Kick off immediately so the preview can become available ASAP.
    void pollOnce();

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [sessionId, viewMode, selectedPath, selectedFile?.url, fetchFiles]);

  // Listen for close-document-viewer event
  useEffect(() => {
    const handleCloseViewer = () => {
      closeViewer();
    };

    window.addEventListener("close-document-viewer", handleCloseViewer);
    return () => {
      window.removeEventListener("close-document-viewer", handleCloseViewer);
    };
  }, [closeViewer]);

  return {
    files,
    selectedFile,
    viewMode,
    isRefreshing,
    selectFile,
    closeViewer,
    refreshFiles,
  };
}
