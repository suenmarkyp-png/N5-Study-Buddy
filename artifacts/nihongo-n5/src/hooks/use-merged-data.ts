import { flashcardWords, vocabWords } from "@/data/vocab";
import { grammarPoints } from "@/data/grammar";
import { phrases } from "@/data/phrases";
import { useCustomData } from "@/hooks/use-custom-data";

export function useMergedFlashcards() {
  const { customFlashcards, deletedFlashcardIds } = useCustomData();
  return [...flashcardWords, ...customFlashcards].filter(
    (w) => !deletedFlashcardIds[w.id],
  );
}

export function useMergedVocab() {
  const { customVocab, deletedVocabIds } = useCustomData();
  return [...vocabWords, ...customVocab].filter((w) => !deletedVocabIds[w.id]);
}

export function useMergedGrammar() {
  const { customGrammar, deletedGrammarIds } = useCustomData();
  return [...grammarPoints, ...customGrammar].filter(
    (g) => !deletedGrammarIds[g.id],
  );
}

export function useMergedPhrases() {
  const { customPhrases, deletedPhraseIds } = useCustomData();
  return [...phrases, ...customPhrases].filter(
    (p) => !deletedPhraseIds[p.id],
  );
}
