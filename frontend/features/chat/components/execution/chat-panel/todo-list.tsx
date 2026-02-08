"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle } from "lucide-react";
import { useT } from "@/lib/i18n/client";
import type { TodoItem as TodoItemType } from "@/features/chat/types";

interface TodoListProps {
  todos: TodoItemType[];
  progress?: number;
  currentStep?: string;
}

export function TodoList({ todos, progress = 0, currentStep }: TodoListProps) {
  const { t } = useT("translation");

  const completedCount = todos.filter(
    (todo) => todo.status === "completed",
  ).length;
  const derivedProgress =
    progress > 0
      ? progress
      : todos.length > 0
        ? Math.round((completedCount / todos.length) * 100)
        : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-2.5 px-4">
        <div className="space-y-1.5">
          {/* Title with icon and count */}
          <CardTitle className="flex min-w-0 items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="size-4 text-foreground" />
            <span className="min-w-0 flex-1 truncate">
              {t("todo.title")}
              {currentStep && (
                <span className="ml-2 truncate text-xs font-normal text-muted-foreground/70">
                  - {currentStep}
                </span>
              )}
            </span>
            <span className="shrink-0 text-xs font-normal text-muted-foreground">
              {completedCount}/{todos.length} {derivedProgress}%
            </span>
          </CardTitle>

          {/* Progress bar */}
          <Progress value={derivedProgress} className="h-1" />
        </div>
      </CardHeader>

      {/* Todo items - auto height */}
      <CardContent className="px-4 pb-3 pt-0">
        <div className="grid min-w-0 grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {todos.map((todo, index) => {
            const isCompleted = todo.status === "completed";
            return (
              <div
                key={index}
                className="flex items-center gap-1.5 text-xs text-foreground/80"
              >
                {isCompleted ? (
                  <CheckCircle2 className="size-3.5 text-foreground shrink-0" />
                ) : (
                  <Circle className="size-3.5 text-muted-foreground shrink-0" />
                )}
                <span className="truncate">{todo.content}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
