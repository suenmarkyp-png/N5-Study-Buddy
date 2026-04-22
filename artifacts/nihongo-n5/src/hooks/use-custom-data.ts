import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Word } from "@/data/vocab";
import type { GrammarPoint } from "@/data/grammar";
import type { Phrase } from "@/data/phrases";

interface CustomDataState {
  customFlashcards: Word[];
  customVocab: Word[];
  customGrammar: GrammarPoint[];
  customPhrases: Phrase[];

  deletedFlashcardIds: Record<string, boolean>;
  deletedVocabIds: Record<string, boolean>;
  deletedGrammarIds: Record<string, boolean>;
  deletedPhraseIds: Record<string, boolean>;

  addFlashcard: (w: Omit<Word, "id">) => void;
  addVocab: (w: Omit<Word, "id">) => void;
  addGrammar: (g: Omit<GrammarPoint, "id">) => void;
  addPhrase: (p: Omit<Phrase, "id">) => void;

  removeFlashcard: (id: string) => void;
  removeVocab: (id: string) => void;
  removeGrammar: (id: string) => void;
  removePhrase: (id: string) => void;
}

const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export const useCustomData = create<CustomDataState>()(
  persist(
    (set) => ({
      customFlashcards: [],
      customVocab: [],
      customGrammar: [],
      customPhrases: [],
      deletedFlashcardIds: {},
      deletedVocabIds: {},
      deletedGrammarIds: {},
      deletedPhraseIds: {},

      addFlashcard: (w) =>
        set((s) => ({
          customFlashcards: [...s.customFlashcards, { ...w, id: newId("uf") }],
        })),
      addVocab: (w) =>
        set((s) => ({
          customVocab: [...s.customVocab, { ...w, id: newId("uv") }],
        })),
      addGrammar: (g) =>
        set((s) => ({
          customGrammar: [...s.customGrammar, { ...g, id: newId("ug") }],
        })),
      addPhrase: (p) =>
        set((s) => ({
          customPhrases: [...s.customPhrases, { ...p, id: newId("up") }],
        })),

      removeFlashcard: (id) =>
        set((s) =>
          id.startsWith("uf-")
            ? {
                customFlashcards: s.customFlashcards.filter((w) => w.id !== id),
              }
            : {
                deletedFlashcardIds: { ...s.deletedFlashcardIds, [id]: true },
              },
        ),
      removeVocab: (id) =>
        set((s) =>
          id.startsWith("uv-")
            ? { customVocab: s.customVocab.filter((w) => w.id !== id) }
            : { deletedVocabIds: { ...s.deletedVocabIds, [id]: true } },
        ),
      removeGrammar: (id) =>
        set((s) =>
          id.startsWith("ug-")
            ? { customGrammar: s.customGrammar.filter((g) => g.id !== id) }
            : { deletedGrammarIds: { ...s.deletedGrammarIds, [id]: true } },
        ),
      removePhrase: (id) =>
        set((s) =>
          id.startsWith("up-")
            ? { customPhrases: s.customPhrases.filter((p) => p.id !== id) }
            : { deletedPhraseIds: { ...s.deletedPhraseIds, [id]: true } },
        ),
    }),
    { name: "nihongo-n5-custom-data" },
  ),
);
