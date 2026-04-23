import { create } from "zustand";
import type { Word } from "@/data/vocab";
import type { GrammarPoint } from "@/data/grammar";
import type { Phrase } from "@/data/phrases";

const API_BASE = `${import.meta.env.BASE_URL.replace(/\/+$/, "")}/api`;

interface CustomDataState {
  customFlashcards: Word[];
  customVocab: Word[];
  customGrammar: GrammarPoint[];
  customPhrases: Phrase[];

  deletedFlashcardIds: Record<string, boolean>;
  deletedVocabIds: Record<string, boolean>;
  deletedGrammarIds: Record<string, boolean>;
  deletedPhraseIds: Record<string, boolean>;

  loaded: boolean;
  loading: boolean;
  error: string | null;

  load: () => Promise<void>;
  addFlashcard: (w: Omit<Word, "id">) => Promise<void>;
  addVocab: (w: Omit<Word, "id">) => Promise<void>;
  addGrammar: (g: Omit<GrammarPoint, "id">) => Promise<void>;
  addPhrase: (p: Omit<Phrase, "id">) => Promise<void>;

  removeFlashcard: (id: string) => Promise<void>;
  removeVocab: (id: string) => Promise<void>;
  removeGrammar: (id: string) => Promise<void>;
  removePhrase: (id: string) => Promise<void>;
}

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

const wordPayload = (w: Omit<Word, "id">) => ({
  kanji: w.kanji,
  kana: w.kana,
  romaji: w.romaji,
  meaning: w.meaning,
  type: w.type,
  verbGroup: w.verbGroup,
  category: w.category,
  exJp: w.example.jp,
  exRomaji: w.example.romaji,
  exEn: w.example.en,
});

const grammarPayload = (g: Omit<GrammarPoint, "id">) => ({
  pattern: g.pattern,
  romaji: g.romaji,
  meaning: g.meaning,
  explanation: g.explanation,
  exJp: g.examples[0]?.jp ?? "",
  exRomaji: g.examples[0]?.romaji ?? "",
  exEn: g.examples[0]?.en ?? "",
  notes: g.notes,
});

export const useCustomData = create<CustomDataState>()((set, get) => ({
  customFlashcards: [],
  customVocab: [],
  customGrammar: [],
  customPhrases: [],
  deletedFlashcardIds: {},
  deletedVocabIds: {},
  deletedGrammarIds: {},
  deletedPhraseIds: {},
  loaded: false,
  loading: false,
  error: null,

  load: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const data = await jsonFetch<{
        flashcards: Word[];
        vocab: Word[];
        grammar: GrammarPoint[];
        phrases: Phrase[];
        deleted: {
          flashcards: string[];
          vocab: string[];
          grammar: string[];
          phrases: string[];
        };
      }>(`${API_BASE}/custom-data`);
      const toMap = (ids: string[]) =>
        ids.reduce<Record<string, boolean>>((acc, id) => {
          acc[id] = true;
          return acc;
        }, {});
      set({
        customFlashcards: data.flashcards,
        customVocab: data.vocab,
        customGrammar: data.grammar,
        customPhrases: data.phrases,
        deletedFlashcardIds: toMap(data.deleted.flashcards),
        deletedVocabIds: toMap(data.deleted.vocab),
        deletedGrammarIds: toMap(data.deleted.grammar),
        deletedPhraseIds: toMap(data.deleted.phrases),
        loaded: true,
        loading: false,
      });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  addFlashcard: async (w) => {
    const { id } = await jsonFetch<{ id: string }>(
      `${API_BASE}/custom-data/flashcards`,
      { method: "POST", body: JSON.stringify(wordPayload(w)) },
    );
    set((s) => ({ customFlashcards: [...s.customFlashcards, { ...w, id }] }));
  },

  addVocab: async (w) => {
    const { id } = await jsonFetch<{ id: string }>(
      `${API_BASE}/custom-data/vocab`,
      { method: "POST", body: JSON.stringify(wordPayload(w)) },
    );
    set((s) => ({ customVocab: [...s.customVocab, { ...w, id }] }));
  },

  addGrammar: async (g) => {
    const { id } = await jsonFetch<{ id: string }>(
      `${API_BASE}/custom-data/grammar`,
      { method: "POST", body: JSON.stringify(grammarPayload(g)) },
    );
    set((s) => ({ customGrammar: [...s.customGrammar, { ...g, id }] }));
  },

  addPhrase: async (p) => {
    const { id } = await jsonFetch<{ id: string }>(
      `${API_BASE}/custom-data/phrases`,
      { method: "POST", body: JSON.stringify(p) },
    );
    set((s) => ({ customPhrases: [...s.customPhrases, { ...p, id }] }));
  },

  removeFlashcard: async (id) => {
    await jsonFetch(`${API_BASE}/custom-data/flashcards/${id}`, {
      method: "DELETE",
    });
    set((s) =>
      id.startsWith("uf-")
        ? { customFlashcards: s.customFlashcards.filter((w) => w.id !== id) }
        : { deletedFlashcardIds: { ...s.deletedFlashcardIds, [id]: true } },
    );
  },

  removeVocab: async (id) => {
    await jsonFetch(`${API_BASE}/custom-data/vocab/${id}`, { method: "DELETE" });
    set((s) =>
      id.startsWith("uv-")
        ? { customVocab: s.customVocab.filter((w) => w.id !== id) }
        : { deletedVocabIds: { ...s.deletedVocabIds, [id]: true } },
    );
  },

  removeGrammar: async (id) => {
    await jsonFetch(`${API_BASE}/custom-data/grammar/${id}`, {
      method: "DELETE",
    });
    set((s) =>
      id.startsWith("ug-")
        ? { customGrammar: s.customGrammar.filter((g) => g.id !== id) }
        : { deletedGrammarIds: { ...s.deletedGrammarIds, [id]: true } },
    );
  },

  removePhrase: async (id) => {
    await jsonFetch(`${API_BASE}/custom-data/phrases/${id}`, {
      method: "DELETE",
    });
    set((s) =>
      id.startsWith("up-")
        ? { customPhrases: s.customPhrases.filter((p) => p.id !== id) }
        : { deletedPhraseIds: { ...s.deletedPhraseIds, [id]: true } },
    );
  },
}));
