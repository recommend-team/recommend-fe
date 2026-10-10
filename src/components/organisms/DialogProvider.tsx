"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";

type ConfirmVariant = "danger" | "primary";

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

interface PromptOptions {
  title: string;
  message?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  defaultValue?: string;
  multiline?: boolean;
  required?: boolean;
}

interface DialogContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  prompt: (options: PromptOptions) => Promise<string | null>;
}

const DialogContext = createContext<DialogContextValue | null>(null);

type DialogState =
  | { kind: "none" }
  | { kind: "confirm"; options: ConfirmOptions }
  | { kind: "prompt"; options: PromptOptions };

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DialogState>({ kind: "none" });
  const resolverRef = useRef<((value: boolean | string | null) => void) | null>(
    null
  );
  const [inputValue, setInputValue] = useState("");

  const close = useCallback((value: boolean | string | null) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setState({ kind: "none" });
    setInputValue("");
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = (v) => resolve(Boolean(v));
      setState({ kind: "confirm", options });
    });
  }, []);

  const prompt = useCallback((options: PromptOptions) => {
    return new Promise<string | null>((resolve) => {
      resolverRef.current = (v) =>
        resolve(typeof v === "string" ? v : v ? "" : null);
      setInputValue(options.defaultValue ?? "");
      setState({ kind: "prompt", options });
    });
  }, []);

  const value = useMemo(() => ({ confirm, prompt }), [confirm, prompt]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      {state.kind !== "none" && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) close(state.kind === "prompt" ? null : false);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md p-6 md:p-7 relative shadow-xl">
            <button
              type="button"
              onClick={() =>
                close(state.kind === "prompt" ? null : false)
              }
              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-bold font-dm text-gray-900 mb-1">
              {state.options.title}
            </h2>
            {state.options.message && (
              <p className="text-sm font-dm text-gray-600 mb-4">
                {state.options.message}
              </p>
            )}

            {state.kind === "prompt" &&
              (state.options.multiline ? (
                <textarea
                  autoFocus
                  rows={4}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={state.options.placeholder}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green focus:ring-1 focus:ring-recommend-green resize-none mb-4"
                />
              ) : (
                <input
                  autoFocus
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={state.options.placeholder}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (state.options.required && !inputValue.trim()) return;
                      close(inputValue);
                    }
                  }}
                  className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white font-dm text-sm focus:outline-none focus:border-recommend-green focus:ring-1 focus:ring-recommend-green mb-4"
                />
              ))}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() =>
                  close(state.kind === "prompt" ? null : false)
                }
                className="px-4 py-2 rounded-full border border-gray-300 bg-white text-sm font-bold font-dm text-gray-700 hover:bg-gray-50"
              >
                {state.options.cancelLabel ?? "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (state.kind === "prompt") {
                    if (state.options.required && !inputValue.trim()) return;
                    close(inputValue);
                  } else {
                    close(true);
                  }
                }}
                className={`px-4 py-2 rounded-full text-sm font-bold font-dm text-white ${
                  state.options.variant === "danger"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-recommend-green hover:bg-recommend-green-hover"
                }`}
              >
                {state.options.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useConfirm must be used inside <DialogProvider>");
  return ctx.confirm;
}

export function usePrompt() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("usePrompt must be used inside <DialogProvider>");
  return ctx.prompt;
}
