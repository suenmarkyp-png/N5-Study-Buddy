import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/hooks/use-progress";
import { Word, WordType } from "@/data/vocab";
import { useMergedFlashcards } from "@/hooks/use-merged-data";
import { useCustomData } from "@/hooks/use-custom-data";
import { EditPanel } from "@/components/edit-panel";
import { Shuffle, Check, Clock, Eye, BookOpen, Layers, Settings2 } from "lucide-react";

export default function Flashcards() {
  const { knownWords, learningWords, markWordKnown, markWordLearning } = useProgress();
  const allCards = useMergedFlashcards();
  const { addFlashcard, removeFlashcard } = useCustomData();

  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [editOpen, setEditOpen] = useState(false);

  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const deck = useMemo(() => {
    let filtered = [...allCards];
    if (filterType !== "all") {
      filtered = filtered.filter((w) => w.type.includes(filterType));
    }
    if (filterStatus === "learning") {
      filtered = filtered.filter((w) => learningWords[w.id]);
    } else if (filterStatus === "review") {
      filtered = filtered.filter((w) => !knownWords[w.id]);
    }
    if (shuffleSeed > 0) {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }
    return filtered;
  }, [allCards, filterType, filterStatus, knownWords, learningWords, shuffleSeed]);

  React.useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filterType, filterStatus]);

  const shuffleDeck = () => {
    setShuffleSeed((s) => s + 1);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const currentWord = deck[currentIndex];

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(deck.length, 1));
    }, 150);
  };

  const handleKnown = () => {
    if (currentWord) {
      markWordKnown(currentWord.id);
      nextCard();
    }
  };

  const handleLearning = () => {
    if (currentWord) {
      markWordLearning(currentWord.id);
      nextCard();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 py-6 px-4 md:py-10 flex flex-col h-[calc(100vh-80px)] md:h-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Layers className="w-6 h-6" /> Flashcards
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Verbs and Adjectives</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-card border border-border text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="all">All Types</option>
            <option value="verb">Verbs</option>
            <option value="adj">Adjectives</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-card border border-border text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="all">All Words</option>
            <option value="review">Needs Review</option>
            <option value="learning">Currently Learning</option>
          </select>

          <button
            onClick={shuffleDeck}
            className="bg-secondary text-secondary-foreground p-2 rounded-lg hover:bg-secondary/80 transition-colors"
            title="Shuffle"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={() => setEditOpen(true)}
            className="bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm font-bold"
          >
            <Settings2 className="w-4 h-4" /> Manage
          </button>
        </div>
      </div>

      {deck.length === 0 || !currentWord ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-card rounded-2xl border border-dashed border-border">
          <BookOpen className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-foreground mb-2">No cards found</h3>
          <p className="text-muted-foreground">Try changing your filters or add new cards.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col w-full relative perspective-1000">
          <div className="flex justify-between items-center mb-4 text-sm font-medium text-muted-foreground shrink-0 px-2">
            <span>Card {currentIndex + 1} of {deck.length}</span>
            <span className="flex gap-4">
              <span className="flex items-center gap-1 text-success"><Check className="w-4 h-4" /> {deck.filter((w) => knownWords[w.id]).length}</span>
              <span className="flex items-center gap-1 text-orange-500"><Clock className="w-4 h-4" /> {deck.filter((w) => learningWords[w.id]).length}</span>
            </span>
          </div>

          <div className="flex-1 w-full relative cursor-pointer group min-h-[360px]" onClick={() => setIsFlipped(!isFlipped)}>
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentWord.id + (isFlipped ? "-back" : "-front")}
                initial={{ rotateX: isFlipped ? -90 : 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: isFlipped ? 90 : -90, opacity: 0 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                className="absolute inset-0 w-full h-full backface-hidden"
              >
                {!isFlipped ? (
                  <div className="w-full h-full bg-card border-2 border-card-border rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden group-hover:border-primary/30 transition-colors">
                    <span className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {currentWord.type} {currentWord.verbGroup ? `(${currentWord.verbGroup})` : ""}
                    </span>
                    <h2 className="text-6xl md:text-8xl font-jp font-bold text-foreground mb-6">{currentWord.kanji}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground mt-8">
                      <Eye className="w-5 h-5" />
                      <span className="text-sm font-medium uppercase tracking-widest">Tap to flip</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-card border-2 border-primary/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden">
                    <span className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full">{currentWord.type}</span>
                    <div className="space-y-6 w-full">
                      <div>
                        <p className="text-2xl font-jp text-muted-foreground mb-1">{currentWord.kana}</p>
                        <p className="text-lg font-medium text-primary mb-4">{currentWord.romaji}</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground">{currentWord.meaning}</h2>
                      </div>
                      <div className="w-full h-px bg-border my-6"></div>
                      <div className="space-y-2 max-w-md mx-auto bg-muted/30 p-4 rounded-xl">
                        <p className="text-lg font-jp text-foreground">{currentWord.example.jp}</p>
                        <p className="text-sm text-muted-foreground">{currentWord.example.romaji}</p>
                        <p className="text-sm font-medium text-foreground mt-2">{currentWord.example.en}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={`mt-6 grid grid-cols-2 gap-4 shrink-0 transition-opacity duration-300 ${isFlipped ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <button onClick={(e) => { e.stopPropagation(); handleLearning(); }} className="flex items-center justify-center gap-2 py-4 px-6 bg-card border-2 border-orange-200 text-orange-600 rounded-2xl font-bold text-lg hover:bg-orange-50 active:scale-95 transition-all">
              <Clock className="w-6 h-6" /> Learning
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleKnown(); }} className="flex items-center justify-center gap-2 py-4 px-6 bg-success/10 border-2 border-success text-success-foreground rounded-2xl font-bold text-lg hover:bg-success/20 active:scale-95 transition-all">
              <Check className="w-6 h-6 stroke-[3px]" /> Knew It
            </button>
          </div>
        </div>
      )}

      <EditPanel
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Flashcards"
        items={allCards.map((w) => ({
          id: w.id,
          primary: `${w.kanji} (${w.kana})`,
          secondary: `${w.romaji} — ${w.meaning}`,
          tertiary: w.type,
        }))}
        fields={[
          { key: "kanji", label: "Japanese (kanji or kana)", required: true, placeholder: "食べる" },
          { key: "kana", label: "Hiragana reading", required: true, placeholder: "たべる" },
          { key: "romaji", label: "Romaji", required: true, placeholder: "taberu" },
          { key: "meaning", label: "English meaning", required: true, placeholder: "to eat" },
          { key: "type", label: "Part of speech", required: true, type: "select", options: ["verb", "i-adj", "na-adj", "noun", "expression"] },
          { key: "verbGroup", label: "Verb group (optional)", type: "select", options: ["godan", "ichidan", "irregular"] },
          { key: "exJp", label: "Example (Japanese)", required: true, placeholder: "寿司を食べる", textarea: true },
          { key: "exRomaji", label: "Example (Romaji)", required: true, placeholder: "sushi o taberu", textarea: true },
          { key: "exEn", label: "Example (English)", required: true, placeholder: "I eat sushi", textarea: true },
        ]}
        onAdd={(v) => {
          const word: Omit<Word, "id"> = {
            kanji: v.kanji,
            kana: v.kana,
            romaji: v.romaji,
            meaning: v.meaning,
            type: v.type as WordType,
            verbGroup: v.verbGroup
              ? (v.verbGroup as "godan" | "ichidan" | "irregular")
              : undefined,
            example: { jp: v.exJp, romaji: v.exRomaji, en: v.exEn },
          };
          addFlashcard(word);
        }}
        onRemove={removeFlashcard}
      />
    </div>
  );
}
