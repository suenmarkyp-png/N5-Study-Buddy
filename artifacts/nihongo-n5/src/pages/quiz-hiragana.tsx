import React, { useState } from "react";
import { PencilLine, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type HiraganaEntry = { kana: string; romaji: string; group: "basic" | "dakuten" | "combo" };

const HIRAGANA: HiraganaEntry[] = [
  // Basic
  { kana: "あ", romaji: "a",   group: "basic" }, { kana: "い", romaji: "i",   group: "basic" },
  { kana: "う", romaji: "u",   group: "basic" }, { kana: "え", romaji: "e",   group: "basic" },
  { kana: "お", romaji: "o",   group: "basic" },
  { kana: "か", romaji: "ka",  group: "basic" }, { kana: "き", romaji: "ki",  group: "basic" },
  { kana: "く", romaji: "ku",  group: "basic" }, { kana: "け", romaji: "ke",  group: "basic" },
  { kana: "こ", romaji: "ko",  group: "basic" },
  { kana: "さ", romaji: "sa",  group: "basic" }, { kana: "し", romaji: "shi", group: "basic" },
  { kana: "す", romaji: "su",  group: "basic" }, { kana: "せ", romaji: "se",  group: "basic" },
  { kana: "そ", romaji: "so",  group: "basic" },
  { kana: "た", romaji: "ta",  group: "basic" }, { kana: "ち", romaji: "chi", group: "basic" },
  { kana: "つ", romaji: "tsu", group: "basic" }, { kana: "て", romaji: "te",  group: "basic" },
  { kana: "と", romaji: "to",  group: "basic" },
  { kana: "な", romaji: "na",  group: "basic" }, { kana: "に", romaji: "ni",  group: "basic" },
  { kana: "ぬ", romaji: "nu",  group: "basic" }, { kana: "ね", romaji: "ne",  group: "basic" },
  { kana: "の", romaji: "no",  group: "basic" },
  { kana: "は", romaji: "ha",  group: "basic" }, { kana: "ひ", romaji: "hi",  group: "basic" },
  { kana: "ふ", romaji: "fu",  group: "basic" }, { kana: "へ", romaji: "he",  group: "basic" },
  { kana: "ほ", romaji: "ho",  group: "basic" },
  { kana: "ま", romaji: "ma",  group: "basic" }, { kana: "み", romaji: "mi",  group: "basic" },
  { kana: "む", romaji: "mu",  group: "basic" }, { kana: "め", romaji: "me",  group: "basic" },
  { kana: "も", romaji: "mo",  group: "basic" },
  { kana: "や", romaji: "ya",  group: "basic" }, { kana: "ゆ", romaji: "yu",  group: "basic" },
  { kana: "よ", romaji: "yo",  group: "basic" },
  { kana: "ら", romaji: "ra",  group: "basic" }, { kana: "り", romaji: "ri",  group: "basic" },
  { kana: "る", romaji: "ru",  group: "basic" }, { kana: "れ", romaji: "re",  group: "basic" },
  { kana: "ろ", romaji: "ro",  group: "basic" },
  { kana: "わ", romaji: "wa",  group: "basic" }, { kana: "を", romaji: "wo",  group: "basic" },
  { kana: "ん", romaji: "n",   group: "basic" },
  // Dakuten / Handakuten
  { kana: "が", romaji: "ga",  group: "dakuten" }, { kana: "ぎ", romaji: "gi",  group: "dakuten" },
  { kana: "ぐ", romaji: "gu",  group: "dakuten" }, { kana: "げ", romaji: "ge",  group: "dakuten" },
  { kana: "ご", romaji: "go",  group: "dakuten" },
  { kana: "ざ", romaji: "za",  group: "dakuten" }, { kana: "じ", romaji: "ji",  group: "dakuten" },
  { kana: "ず", romaji: "zu",  group: "dakuten" }, { kana: "ぜ", romaji: "ze",  group: "dakuten" },
  { kana: "ぞ", romaji: "zo",  group: "dakuten" },
  { kana: "だ", romaji: "da",  group: "dakuten" }, { kana: "で", romaji: "de",  group: "dakuten" },
  { kana: "ど", romaji: "do",  group: "dakuten" },
  { kana: "ば", romaji: "ba",  group: "dakuten" }, { kana: "び", romaji: "bi",  group: "dakuten" },
  { kana: "ぶ", romaji: "bu",  group: "dakuten" }, { kana: "べ", romaji: "be",  group: "dakuten" },
  { kana: "ぼ", romaji: "bo",  group: "dakuten" },
  { kana: "ぱ", romaji: "pa",  group: "dakuten" }, { kana: "ぴ", romaji: "pi",  group: "dakuten" },
  { kana: "ぷ", romaji: "pu",  group: "dakuten" }, { kana: "ぺ", romaji: "pe",  group: "dakuten" },
  { kana: "ぽ", romaji: "po",  group: "dakuten" },
  // Combination (youon)
  { kana: "きゃ", romaji: "kya", group: "combo" }, { kana: "きゅ", romaji: "kyu", group: "combo" },
  { kana: "きょ", romaji: "kyo", group: "combo" },
  { kana: "しゃ", romaji: "sha", group: "combo" }, { kana: "しゅ", romaji: "shu", group: "combo" },
  { kana: "しょ", romaji: "sho", group: "combo" },
  { kana: "ちゃ", romaji: "cha", group: "combo" }, { kana: "ちゅ", romaji: "chu", group: "combo" },
  { kana: "ちょ", romaji: "cho", group: "combo" },
  { kana: "にゃ", romaji: "nya", group: "combo" }, { kana: "にゅ", romaji: "nyu", group: "combo" },
  { kana: "にょ", romaji: "nyo", group: "combo" },
  { kana: "ひゃ", romaji: "hya", group: "combo" }, { kana: "ひゅ", romaji: "hyu", group: "combo" },
  { kana: "ひょ", romaji: "hyo", group: "combo" },
  { kana: "みゃ", romaji: "mya", group: "combo" }, { kana: "みゅ", romaji: "myu", group: "combo" },
  { kana: "みょ", romaji: "myo", group: "combo" },
  { kana: "りゃ", romaji: "rya", group: "combo" }, { kana: "りゅ", romaji: "ryu", group: "combo" },
  { kana: "りょ", romaji: "ryo", group: "combo" },
  { kana: "ぎゃ", romaji: "gya", group: "combo" }, { kana: "ぎゅ", romaji: "gyu", group: "combo" },
  { kana: "ぎょ", romaji: "gyo", group: "combo" },
  { kana: "じゃ", romaji: "ja",  group: "combo" }, { kana: "じゅ", romaji: "ju",  group: "combo" },
  { kana: "じょ", romaji: "jo",  group: "combo" },
  { kana: "びゃ", romaji: "bya", group: "combo" }, { kana: "びゅ", romaji: "byu", group: "combo" },
  { kana: "びょ", romaji: "byo", group: "combo" },
  { kana: "ぴゃ", romaji: "pya", group: "combo" }, { kana: "ぴゅ", romaji: "pyu", group: "combo" },
  { kana: "ぴょ", romaji: "pyo", group: "combo" },
];

const GROUP_LABELS: Record<string, string> = {
  basic:   "Basic (46)",
  dakuten: "Dakuten ゛/ ゜(23)",
  combo:   "Combination (33)",
};

type QuizMode = "romaji-to-kana" | "kana-to-romaji";

type HiraganaQuestion = {
  entry: HiraganaEntry;
  correct: string;
  options: string[];
};

export default function QuizHiragana() {
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [quizLength, setQuizLength] = useState(20);
  const [filterGroup, setFilterGroup] = useState<string | null>(null);
  const [mode, setMode] = useState<QuizMode>("romaji-to-kana");

  const [questions, setQuestions] = useState<HiraganaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const pool = filterGroup ? HIRAGANA.filter(h => h.group === filterGroup) : HIRAGANA;

  const startQuiz = () => {
    const picked = fisherYates(pool).slice(0, Math.min(quizLength, pool.length));
    const qs: HiraganaQuestion[] = picked.map(entry => {
      const correct = mode === "romaji-to-kana" ? entry.kana : entry.romaji;
      const wrongs = fisherYates(
        pool.filter(h => (mode === "romaji-to-kana" ? h.kana : h.romaji) !== correct)
      ).slice(0, 3).map(h => mode === "romaji-to-kana" ? h.kana : h.romaji);
      return { entry, correct, options: fisherYates([correct, ...wrongs]) };
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
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
    }
  };

  if (!isStarted) {
    return (
      <div className="w-full max-w-lg mx-auto py-10 px-4 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
          <PencilLine className="w-12 h-12 text-primary" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Hiragana Quiz</h1>
          <p className="text-muted-foreground text-lg">Drill all 102 hiragana characters.</p>
        </div>

        <div className="w-full bg-muted/40 border border-border rounded-2xl p-4 text-left">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Quick reference
          </p>
          <div className="grid grid-cols-5 gap-1 text-center font-jp">
            {[
              ["あ","a"],["い","i"],["う","u"],["え","e"],["お","o"],
              ["か","ka"],["さ","sa"],["た","ta"],["な","na"],["は","ha"],
              ["ま","ma"],["や","ya"],["ら","ra"],["わ","wa"],["ん","n"],
            ].map(([k, r]) => (
              <div key={k} className="bg-card border border-border rounded-lg py-1.5 flex flex-col items-center">
                <span className="text-lg font-bold text-foreground">{k}</span>
                <span className="text-[10px] text-muted-foreground">{r}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full bg-card border border-border rounded-2xl p-6 space-y-6">
          {/* Mode */}
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-3">Quiz Direction</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode("romaji-to-kana")}
                className={`py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all ${mode === "romaji-to-kana" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
              >
                Romaji → Hiragana
              </button>
              <button
                onClick={() => setMode("kana-to-romaji")}
                className={`py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all ${mode === "kana-to-romaji" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
              >
                Hiragana → Romaji
              </button>
            </div>
          </div>

          {/* Group filter */}
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-3">Character Group</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterGroup(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filterGroup === null ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/40"}`}
              >
                All ({HIRAGANA.length})
              </button>
              {(["basic", "dakuten", "combo"] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setFilterGroup(filterGroup === g ? null : g)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filterGroup === g ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/40"}`}
                >
                  {GROUP_LABELS[g]}
                </button>
              ))}
            </div>
          </div>

          {/* Question count */}
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-3">Number of Questions</label>
            <div className="grid grid-cols-5 gap-2">
              {[10, 20, 30, 46, pool.length].filter((v, i, arr) => arr.indexOf(v) === i && v <= pool.length).slice(0, 5).map(n => (
                <button
                  key={n}
                  onClick={() => setQuizLength(n)}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${quizLength === n ? "bg-primary text-primary-foreground shadow-md scale-105" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  {n === pool.length && n > 46 ? "All" : n === 46 && filterGroup === null ? "46" : n === pool.length ? "All" : n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startQuiz}
            disabled={pool.length < 4}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors shadow-md active:scale-95 disabled:opacity-40"
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const pct = Math.round((score / questions.length) * 100);
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
          <h2 className="text-4xl font-bold text-foreground mb-2">{pct}%</h2>
          <p className="text-xl text-muted-foreground">{score} / {questions.length} correct</p>
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

  const q = questions[currentIndex];
  const isKanaMode = mode === "romaji-to-kana";

  return (
    <div className="w-full max-w-xl mx-auto py-6 px-4 md:py-10 flex flex-col h-[calc(100vh-80px)] md:h-auto">
      {/* Progress */}
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
          {/* Question card */}
          <div className="bg-card border-2 border-card-border rounded-3xl p-8 text-center mb-6 shadow-sm flex-1 flex flex-col items-center justify-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {isKanaMode ? "Which hiragana?" : "Which reading?"}
            </span>

            {isKanaMode ? (
              <p className="text-5xl md:text-7xl font-bold text-foreground tracking-widest">{q.entry.romaji}</p>
            ) : (
              <p className="text-7xl md:text-9xl font-jp font-bold text-foreground">{q.entry.kana}</p>
            )}

            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`px-4 py-2 rounded-xl text-sm font-bold ${isCorrect ? "bg-success/10 text-success-foreground" : "bg-destructive/10 text-destructive"}`}
              >
                {isKanaMode
                  ? `${q.entry.romaji} → ${q.entry.kana}`
                  : `${q.entry.kana} → ${q.entry.romaji}`}
              </motion.div>
            )}
          </div>

          {selectedAnswer !== null && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNext}
              className="mb-3 w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              {currentIndex + 1 < questions.length ? (
                <><ArrowRight className="w-5 h-5" /> Next Question</>
              ) : (
                <><Trophy className="w-5 h-5" /> See Results</>
              )}
            </motion.button>
          )}

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            {q.options.map((option, i) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer = option === q.correct;
              let cls = "bg-card border-2 border-border text-foreground hover:bg-muted/50";
              if (selectedAnswer !== null) {
                if (isCorrectAnswer) cls = "bg-success/10 border-success text-success-foreground";
                else if (isSelected) cls = "bg-destructive/10 border-destructive text-destructive-foreground";
                else cls = "bg-card border-border opacity-40";
              }
              return (
                <motion.button
                  key={i}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswer(option)}
                  animate={isSelected && !isCorrect ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-2xl font-bold transition-all duration-200 flex justify-between items-center ${cls} ${isKanaMode ? "font-jp text-3xl" : "text-xl"}`}
                >
                  <span className={isKanaMode ? "text-3xl" : "text-xl"}>{option}</span>
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
