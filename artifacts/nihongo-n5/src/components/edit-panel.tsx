import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";

export interface EditField {
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  type?: "text" | "select";
  options?: string[];
}

export interface EditItem {
  id: string;
  primary: string;
  secondary?: string;
  tertiary?: string;
}

interface EditPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  items: EditItem[];
  fields: EditField[];
  onAdd: (values: Record<string, string>) => void | Promise<void>;
  onRemove: (id: string) => void | Promise<void>;
}

export function EditPanel({
  open,
  onClose,
  title,
  items,
  fields,
  onAdd,
  onRemove,
}: EditPanelProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const f of fields) {
      if (f.required && !values[f.key]?.trim()) {
        setError(`${f.label} is required`);
        return;
      }
    }
    setSubmitting(true);
    try {
      await onAdd(values);
      setValues({});
      setError(null);
    } catch (err) {
      setError((err as Error).message || "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-3xl border border-card-border w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h2 className="text-xl font-bold text-foreground">
                Manage {title}
              </h2>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">
              <form onSubmit={handleSubmit} className="space-y-3">
                <h3 className="text-sm uppercase tracking-wider font-bold text-muted-foreground">
                  Add new
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {fields.map((f) => (
                    <div
                      key={f.key}
                      className={f.textarea ? "md:col-span-2" : ""}
                    >
                      <label className="block text-xs font-bold text-muted-foreground mb-1">
                        {f.label}
                        {f.required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </label>
                      {f.type === "select" ? (
                        <select
                          value={values[f.key] || ""}
                          onChange={(e) =>
                            setValues((v) => ({
                              ...v,
                              [f.key]: e.target.value,
                            }))
                          }
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                        >
                          <option value="">Select...</option>
                          {f.options?.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : f.textarea ? (
                        <textarea
                          value={values[f.key] || ""}
                          onChange={(e) =>
                            setValues((v) => ({
                              ...v,
                              [f.key]: e.target.value,
                            }))
                          }
                          placeholder={f.placeholder}
                          rows={2}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                        />
                      ) : (
                        <input
                          value={values[f.key] || ""}
                          onChange={(e) =>
                            setValues((v) => ({
                              ...v,
                              [f.key]: e.target.value,
                            }))
                          }
                          placeholder={f.placeholder}
                          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                        />
                      )}
                    </div>
                  ))}
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> {submitting ? "Saving..." : "Add"}
                </button>
              </form>

              <div className="space-y-2">
                <h3 className="text-sm uppercase tracking-wider font-bold text-muted-foreground">
                  Existing entries ({items.length})
                </h3>
                <div className="space-y-2">
                  {items.length === 0 && (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      No entries yet.
                    </p>
                  )}
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between gap-3 bg-background border border-border rounded-xl px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-jp font-bold text-foreground truncate">
                          {it.primary}
                        </p>
                        {it.secondary && (
                          <p className="text-sm text-muted-foreground truncate">
                            {it.secondary}
                          </p>
                        )}
                        {it.tertiary && (
                          <p className="text-xs text-muted-foreground truncate">
                            {it.tertiary}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemove(it.id)}
                        className="shrink-0 w-9 h-9 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive flex items-center justify-center"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
