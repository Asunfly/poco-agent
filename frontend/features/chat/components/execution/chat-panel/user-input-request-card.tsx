"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/client";
import type {
  UserInputQuestion,
  UserInputRequest,
} from "@/features/chat/types";

interface UserInputRequestCardProps {
  request: UserInputRequest;
  isSubmitting?: boolean;
  onSubmit: (answers: Record<string, string>) => Promise<void>;
}

interface QuestionState {
  selected: string[];
  otherText: string;
  multiSelect: boolean;
}

export function UserInputRequestCard({
  request,
  isSubmitting = false,
  onSubmit,
}: UserInputRequestCardProps) {
  const { t } = useT("translation");
  const questions = (request.tool_input?.questions ||
    []) as UserInputQuestion[];

  const [questionState, setQuestionState] = React.useState<
    Record<string, QuestionState>
  >(() => {
    const initial: Record<string, QuestionState> = {};
    questions.forEach((q) => {
      initial[q.question] = {
        selected: [],
        otherText: "",
        multiSelect: !!q.multiSelect,
      };
    });
    return initial;
  });

  const [secondsLeft, setSecondsLeft] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!request.expires_at) {
      setSecondsLeft(null);
      return;
    }
    const expiresAt = new Date(request.expires_at).getTime();
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((expiresAt - now) / 1000));
      setSecondsLeft(diff);
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [request.expires_at]);

  const setSelected = (question: string, values: string[]) => {
    setQuestionState((prev) => ({
      ...prev,
      [question]: { ...prev[question], selected: values },
    }));
  };

  const setOtherText = (question: string, value: string) => {
    setQuestionState((prev) => ({
      ...prev,
      [question]: { ...prev[question], otherText: value },
    }));
  };

  const buildAnswers = (): Record<string, string> | null => {
    const result: Record<string, string> = {};
    for (const q of questions) {
      const state = questionState[q.question];
      if (!state) continue;

      const trimmedOther = state.otherText.trim();
      if (state.multiSelect) {
        const selections = [...state.selected];
        if (trimmedOther) selections.push(trimmedOther);
        if (selections.length === 0) return null;
        result[q.question] = selections.join(", ");
      } else {
        if (trimmedOther) {
          result[q.question] = trimmedOther;
        } else if (state.selected[0]) {
          result[q.question] = state.selected[0];
        } else {
          return null;
        }
      }
    }
    return result;
  };

  const handleSubmit = async () => {
    const answers = buildAnswers();
    if (!answers) {
      toast.error(t("chat.askUserRequired", "请回答所有问题后再提交"));
      return;
    }
    try {
      await onSubmit(answers);
      toast.success(t("chat.askUserSubmitted", "已提交答案"));
    } catch (error) {
      console.error("Submit AskUserQuestion failed:", error);
      toast.error(t("chat.askUserFailed", "提交失败，请重试"));
    }
  };

  return (
    <div className="border border-border rounded-lg bg-card/60 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">
          {t("chat.askUserTitle", "需要你的确认")}
        </div>
        {secondsLeft !== null && (
          <div
            className={cn(
              "text-xs",
              secondsLeft <= 10 ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {t("chat.askUserTimeout", "剩余 {{seconds}} 秒", {
              seconds: secondsLeft,
            })}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((q) => {
          const state = questionState[q.question];
          const selected = state?.selected || [];
          return (
            <div key={q.question} className="space-y-2">
              <div className="text-sm font-medium text-foreground">
                {q.header}
              </div>
              <div className="text-sm text-muted-foreground">{q.question}</div>

              {q.multiSelect ? (
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const checked = selected.includes(opt.label);
                    return (
                      <label
                        key={opt.label}
                        className="flex items-start gap-2 text-sm cursor-pointer"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) => {
                            const next = value
                              ? [...selected, opt.label]
                              : selected.filter((v) => v !== opt.label);
                            setSelected(q.question, next);
                          }}
                        />
                        <div>
                          <div className="text-foreground">{opt.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {opt.description}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <RadioGroup
                  className="space-y-2"
                  value={selected[0] || ""}
                  onValueChange={(value) => setSelected(q.question, [value])}
                >
                  {q.options.map((opt) => (
                    <label
                      key={opt.label}
                      className="flex items-start gap-2 text-sm cursor-pointer"
                    >
                      <RadioGroupItem value={opt.label} />
                      <div>
                        <div className="text-foreground">{opt.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {opt.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              )}

              <Input
                value={state?.otherText || ""}
                onChange={(e) => setOtherText(q.question, e.target.value)}
                placeholder={t("chat.askUserOtherPlaceholder", "其他（可选）")}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {t("chat.askUserSubmit", "提交")}
        </Button>
      </div>
    </div>
  );
}
