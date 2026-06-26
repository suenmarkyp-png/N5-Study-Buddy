import React, { useState } from "react";
import { Word } from "@/data/vocab";
import { useMergedFlashcards, useMergedVocab } from "@/hooks/use-merged-data";
import { getNaiForm } from "@/lib/te-form";
import { useProgress } from "@/hooks/use-progress";
import { Ban, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type NaiQuestion = {
  word: Word;
  correct: string;
  correctRomaji: string;
  rule: string;
  options: string[];
};

const GROUP_LABELS: Record<string, string> = {
  godan: 'Group 1 (u-verb)',
  ichidan: 'Group 2 (ru-verb)',
  irregular: 'Group 3 (irregular)',
};

export default function QuizNaiForm() {
  const { recordQuizResult } = useProgress();
  const flashcards = useMergedFlashcards();
  const vocab = useMergedVocab();
  const seen = new Set<string>();
  const allWords = [...flashcards, ...vocab].filter(w => {
    if (seen.has(w.id)) return false;
    seen.add(w.id);
    return true;
  });

  const verbPool = allWords.filter(w =>
    w.type.includes('verb') && w.verbGroup && getNaiForm(w) !== null
  );

  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [quizLength, setQuizLength] = useState(10);
  const [filterGroup, setFilterGroup] = useState<string | null>(null);

  const [questions, setQuestions] = useState<NaiQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const startQuiz = () => {
    const pool = filterGroup
      ? verbPool.filter(w => w.verbGroup === filterGroup)
      : verbPool;

    const picked = fisherYates(pool).slice(0, Math.min(quizLength, pool.length));

    const allNaiForms = verbPool
      .map(w => getNaiForm(w))
      .filter(Boolean) as { kana: string; romaji: string; rule: string }[];

    const qs: NaiQuestion[] = picked.map(word => {
      const nf = getNaiForm(word)!;
      const wrongKanas = fisherYates(
        allNaiForms.filter(t => t.kana !== nf.kana)
      )
        .slice(0, 3)
        .map(t => t.kana);
      const options = fisherYates([...wrongKanas, nf.kana]);
      return {
        word,
        correct: nf.kana,
        correctRomaji: nf.romaji,
        rule: nf.rule,
        options,
      };
    });

    setQuestions(qs);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setIsStarted(true);
    setIsFinished(false);
  };

  const handleAnswer = (option: string) => {
    if (selectedAnswer !== null) return;
    const correct = option === questions[currentIndex].correct;
    setSelectedAnswer(option);
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(i => i + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        recordQuizResult(score + (correct ? 1 : 0), questions.length);
        setIsFinished(true);
      }
    }, 1800);
  };

  if (!isStarted) {
    const countFor = (g: string) => verbPool.filter(w => w.verbGroup === g).length;
    return (
      <div className="w-full max-w-lg mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
        <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <Ban className="w-12 h-12 text-destructive" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">ない-Form Quiz</h1>
          <p className="text-muted-foreground text-lg">Practice negative verb conjugation.</p>
        </div>

        <div className="w-full bg-muted/40 border border-border rounded-2xl p-4 text-left space-y-1.5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Rules reminder
          </p>
          <p className="text-xs text-muted-foreground mb-2 font-bold">
            Key difference from て/た: う → わない (NOT あない!)
          </p>
          {[
            ['う (godan)',      '→ わない', 'au → awanai, kau → kawanai'],
            ['つ (godan)',      '→ たない', 'matsu → matanai'],
            ['る (godan)',      '→ らない', 'uru → uranai, noru → noranai'],
            ['む (godan)',      '→ まない', 'yomu → yomanai'],
            ['ぶ (godan)',      '→ ばない', 'asobu → asobanai'],
            ['ぬ (godan)',      '→ なない', 'shinu → shinanai'],
            ['く (godan)',      '→ かない', 'kaku → kakanai'],
            ['ぐ (godan)',      '→ がない', 'oyogu → oyoganai'],
            ['す (godan)',      '→ さない', 'hanasu → hanasanai'],
            ['る-verb (ichidan)', '→ ない', 'taberu → tabenai'],
            ['する / compound', '→ しない', 'benkyousuru → benkyoushinai'],
            ['くる',            '→ こない', 'kuru → konai'],
          ].map(([pattern, result, ex]) => (
            <div key={pattern} className="flex items-center gap-2 text-xs">
              <span className="font-jp font-bold text-foreground w-36 shrink-0">{pattern}</span>
              <span className="text-primary font-bold w-16 shrink-0">{result}</span>
              <span className="text-muted-foreground">{ex}</span>
            </div>
          ))}
        </div>

        <div className="w-full bg-card border border-border rounded-2xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-3">Number of Questions</label>
            <div className="grid grid-cols-5 gap-3">
              {[5, 10, 15, 20, 30].map(n => {
                const available = filterGroup ? countFor(filterGroup) : verbPool.length;
                const disabled = n > available;
                return (
                  <button
                    key={n}
                    disabled={disabled}
                    onClick={() => !disabled && setQuizLength(n)}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      quizLength === n
                        ? 'bg-primary text-primary-foreground shadow-md scale-105'
                        : disabled
                          ? 'bg-muted text-muted-foreground/30 cursor-not-allowed'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-3">Verb Group</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterGroup(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  filterGroup === null
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-border hover:border-primary/40'
                }`}
              >
                All ({verbPool.length})
              </button>
              {(['godan', 'ichidan', 'irregular'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setFilterGroup(filterGroup === g ? null : g)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    filterGroup === g
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-muted-foreground border-border hover:border-primary/40'
                  }`}
                >
                  {GROUP_LABELS[g]} ({countFor(g)})
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors shadow-md active:scale-95"
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="w-full max-w-lg mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center shadow-lg"
        >
          <Trophy className="w-16 h-16" />
        </motion.div>
        <div>
          <h2 className="text-4xl font-bold text-foreground mb-2">{percentage}%</h2>
          <p className="text-xl text-muted-foreground">You got {score} out of {questions.length} correct.</p>
        </div>
        <div className="flex gap-4 w-full">
          <button
            onClick={() => setIsStarted(false)}
            className="flex-1 bg-muted text-foreground py-4 rounded-xl font-bold text-lg hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-5 h-5 rotate-180" /> Back
          </button>
          <button
            onClick={startQuiz}
            className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="w-full max-w-xl mx-auto py-6 px-4 md:py-10 flex flex-col h-[calc(100vh-80px)] md:h-auto">
      <div className="mb-8">
        <div className="flex justify-between text-sm font-bold text-muted-foreground mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentIndex / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col"
        >
          <div className="bg-card border-2 border-card-border rounded-3xl p-8 text-center mb-6 shadow-sm flex-1 flex flex-col items-center justify-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {GROUP_LABELS[currentQ.word.verbGroup ?? ''] ?? 'verb'}
            </span>

            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              What is the ない-form (negative) of...
            </p>

            <div className="space-y-1">
              <h2 className="text-5xl md:text-7xl font-jp font-bold text-foreground">
                {currentQ.word.kanji}
              </h2>
              <p className="text-xl text-primary font-medium">{currentQ.word.kana}</p>
              <p className="text-sm text-muted-foreground">{currentQ.word.meaning}</p>
            </div>

            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-2 px-4 py-2 rounded-xl text-sm font-bold ${
                  isCorrect
                    ? 'bg-success/10 text-success-foreground'
                    : 'bg-destructive/10 text-destructive'
                }`}
              >
                {isCorrect ? (
                  <span>{currentQ.correct} ({currentQ.correctRomaji})</span>
                ) : (
                  <span>Correct: {currentQ.correct} ({currentQ.correctRomaji})</span>
                )}
                <p className="text-xs font-normal mt-1 opacity-70">{currentQ.rule}</p>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            {currentQ.options.map((option, i) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer = option === currentQ.correct;
              let btnClass = "bg-card border-2 border-border text-foreground hover:bg-muted/50";
              if (selectedAnswer !== null) {
                if (isCorrectAnswer) btnClass = "bg-success/10 border-success text-success-foreground shadow-[0_0_15px_rgba(var(--success),0.2)]";
                else if (isSelected) btnClass = "bg-destructive/10 border-destructive text-destructive-foreground";
                else btnClass = "bg-card border-border opacity-50";
              }
              return (
                <motion.button
                  key={i}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswer(option)}
                  animate={isSelected && !isCorrect ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-2xl font-jp text-xl font-bold transition-all duration-200 flex justify-between items-center ${btnClass}`}
                >
                  <span>{option}</span>
                  {selectedAnswer !== null && isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-success shrink-0" />}
                  {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive shrink-0" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
