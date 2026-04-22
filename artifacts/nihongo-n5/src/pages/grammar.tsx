import React, { useState } from "react";
import { useMergedGrammar } from "@/hooks/use-merged-data";
import { useCustomData } from "@/hooks/use-custom-data";
import { EditPanel } from "@/components/edit-panel";
import { BookOpen, ChevronDown, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GrammarGuide() {
  const grammarPoints = useMergedGrammar();
  const { addGrammar, removeGrammar } = useCustomData();
  const [openId, setOpenId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const toggleOpen = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full space-y-6 py-6 px-4 md:py-10 max-w-3xl mx-auto">
      <div className="space-y-4 mb-8 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <BookOpen className="w-8 h-8" /> Grammar Guide
          </h1>
          <p className="text-muted-foreground text-lg mt-2">Essential N5 sentence patterns and particles.</p>
        </div>
        <button
          onClick={() => setEditOpen(true)}
          className="bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm font-bold"
        >
          <Settings2 className="w-4 h-4" /> Manage
        </button>
      </div>

      <div className="space-y-3">
        {grammarPoints.map((point, index) => {
          const isOpen = openId === point.id;
          return (
            <div
              key={point.id}
              className={`bg-card rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen ? "border-primary shadow-md" : "border-card-border hover:border-primary/30"
              }`}
            >
              <button
                onClick={() => toggleOpen(point.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">#{index + 1}</span>
                    <h3 className="text-xl font-jp font-bold text-foreground">{point.pattern}</h3>
                  </div>
                  <p className="text-primary font-medium">{point.meaning}</p>
                </div>
                <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180 bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-border">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Explanation</h4>
                          <p className="text-foreground leading-relaxed">{point.explanation}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Examples</h4>
                          <div className="space-y-3">
                            {point.examples.map((ex, i) => (
                              <div key={i} className="bg-muted/30 p-4 rounded-xl border border-border/50">
                                <p className="text-lg font-jp text-foreground mb-1">{ex.jp}</p>
                                <p className="text-sm text-primary mb-2">{ex.romaji}</p>
                                <p className="text-sm text-muted-foreground italic">{ex.en}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {point.notes && (
                          <div className="bg-secondary/10 border border-secondary/30 p-4 rounded-xl">
                            <h4 className="text-sm font-bold text-secondary-foreground mb-1">Note</h4>
                            <p className="text-sm text-foreground">{point.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <EditPanel
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Grammar Points"
        items={grammarPoints.map((g) => ({
          id: g.id,
          primary: g.pattern,
          secondary: g.meaning,
          tertiary: g.romaji,
        }))}
        fields={[
          { key: "pattern", label: "Pattern (Japanese)", required: true, placeholder: "〜たことがある" },
          { key: "romaji", label: "Pattern (Romaji)", required: true, placeholder: "~ ta koto ga aru" },
          { key: "meaning", label: "Meaning", required: true, placeholder: "Have done before" },
          { key: "explanation", label: "Explanation", required: true, textarea: true, placeholder: "Used to talk about past experiences..." },
          { key: "exJp", label: "Example (Japanese)", required: true, textarea: true, placeholder: "日本に行ったことがあります。" },
          { key: "exRomaji", label: "Example (Romaji)", required: true, textarea: true, placeholder: "Nihon ni itta koto ga arimasu." },
          { key: "exEn", label: "Example (English)", required: true, textarea: true, placeholder: "I have been to Japan." },
          { key: "notes", label: "Note (optional)", textarea: true },
        ]}
        onAdd={(v) => {
          addGrammar({
            pattern: v.pattern,
            romaji: v.romaji,
            meaning: v.meaning,
            explanation: v.explanation,
            examples: [{ jp: v.exJp, romaji: v.exRomaji, en: v.exEn }],
            notes: v.notes || "",
          });
        }}
        onRemove={removeGrammar}
      />
    </div>
  );
}
