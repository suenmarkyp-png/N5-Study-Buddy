import React, { useState } from "react";
import { phraseCategories } from "@/data/phrases";
import { useMergedPhrases } from "@/hooks/use-merged-data";
import { useCustomData } from "@/hooks/use-custom-data";
import { EditPanel } from "@/components/edit-panel";
import { MessageCircle, Volume2, Settings2 } from "lucide-react";

export default function Phrases() {
  const phrases = useMergedPhrases();
  const { addPhrase, removePhrase } = useCustomData();
  const [activeCategory, setActiveCategory] = useState(phraseCategories[0]);
  const [editOpen, setEditOpen] = useState(false);

  const filteredPhrases = phrases.filter((p) => p.category === activeCategory);

  return (
    <div className="w-full space-y-6 py-6 px-4 md:py-10 max-w-4xl mx-auto">
      <div className="space-y-4 mb-8 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <MessageCircle className="w-8 h-8" /> Useful Phrases
          </h1>
          <p className="text-muted-foreground text-lg mt-2">Everyday sentences for real-life situations.</p>
        </div>
        <button
          onClick={() => setEditOpen(true)}
          className="bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm font-bold"
        >
          <Settings2 className="w-4 h-4" /> Manage
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 gap-2 hide-scrollbar">
          {phraseCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap md:whitespace-normal text-left px-4 py-3 rounded-xl font-bold transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-6 hidden md:block">{activeCategory}</h2>

          <div className="grid gap-4">
            {filteredPhrases.length === 0 && (
              <p className="text-muted-foreground text-center py-12">No phrases in this category yet.</p>
            )}
            {filteredPhrases.map((phrase) => (
              <div
                key={phrase.id}
                className="bg-card border border-card-border p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-jp font-bold text-foreground">{phrase.jp}</h3>
                    <p className="text-primary font-medium">{phrase.romaji}</p>
                    <p className="text-lg text-foreground mt-2">{phrase.en}</p>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                    <Volume2 className="w-5 h-5" />
                  </div>
                </div>

                {phrase.note && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground flex gap-2">
                      <span className="font-bold text-foreground">Usage:</span> {phrase.note}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <EditPanel
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Phrases"
        items={phrases.map((p) => ({
          id: p.id,
          primary: p.jp,
          secondary: `${p.romaji} — ${p.en}`,
          tertiary: p.category,
        }))}
        fields={[
          { key: "jp", label: "Phrase (Japanese)", required: true, placeholder: "ありがとう" },
          { key: "romaji", label: "Romaji", required: true, placeholder: "Arigatou" },
          { key: "en", label: "English", required: true, placeholder: "Thank you" },
          { key: "category", label: "Category", required: true, type: "select", options: phraseCategories },
          { key: "note", label: "Usage note (optional)", textarea: true },
        ]}
        onAdd={(v) => {
          addPhrase({
            jp: v.jp,
            romaji: v.romaji,
            en: v.en,
            category: v.category,
            note: v.note || "",
          });
        }}
        onRemove={removePhrase}
      />
    </div>
  );
}
