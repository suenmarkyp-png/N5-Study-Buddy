import React, { useState } from "react";
import { Type, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type KatakanaEntry = { kana: string; romaji: string; group: "basic" | "dakuten" | "combo" };

const KATAKANA: KatakanaEntry[] = [
  // Basic
  { kana: "ア", romaji: "a",   group: "basic" }, { kana: "イ", romaji: "i",   group: "basic" },
  { kana: "ウ", romaji: "u",   group: "basic" }, { kana: "エ", romaji: "e",   group: "basic" },
  { kana: "オ", romaji: "o",   group: "basic" },
  { kana: "カ", romaji: "ka",  group: "basic" }, { kana: "キ", romaji: "ki",  group: "basic" },
  { kana: "ク", romaji: "ku",  group: "basic" }, { kana: "ケ", romaji: "ke",  group: "basic" },
  { kana: "コ", romaji: "ko",  group: "basic" },
  { kana: "サ", romaji: "sa",  group: "basic" }, { kana: "シ", romaji: "shi", group: "basic" },
  { kana: "ス", romaji: "su",  group: "basic" }, { kana: "セ", romaji: "se",  group: "basic" },
  { kana: "ソ", romaji: "so",  group: "basic" },
  { kana: "タ", romaji: "ta",  group: "basic" }, { kana: "チ", romaji: "chi", group: "basic" },
  { kana: "ツ", romaji: "tsu", group: "basic" }, { kana: "テ", romaji: "te",  group: "basic" },
  { kana: "ト", romaji: "to",  group: "basic" },
  { kana: "ナ", romaji: "na",  group: "basic" }, { kana: "ニ", romaji: "ni",  group: "basic" },
  { kana: "ヌ", romaji: "nu",  group: "basic" }, { kana: "ネ", romaji: "ne",  group: "basic" },
  { kana: "ノ", romaji: "no",  group: "basic" },
  { kana: "ハ", romaji: "ha",  group: "basic" }, { kana: "ヒ", romaji: "hi",  group: "basic" },
  { kana: "フ", romaji: "fu",  group: "basic" }, { kana: "ヘ", romaji: "he",  group: "basic" },
  { kana: "ホ", romaji: "ho",  group: "basic" },
  { kana: "マ", romaji: "ma",  group: "basic" }, { kana: "ミ", romaji: "mi",  group: "basic" },
  { kana: "ム", romaji: "mu",  group: "basic" }, { kana: "メ", romaji: "me",  group: "basic" },
  { kana: "モ", romaji: "mo",  group: "basic" },
  { kana: "ヤ", romaji: "ya",  group: "basic" }, { kana: "ユ", romaji: "yu",  group: "basic" },
  { kana: "ヨ", romaji: "yo",  group: "basic" },
  { kana: "ラ", romaji: "ra",  group: "basic" }, { kana: "リ", romaji: "ri",  group: "basic" },
  { kana: "ル", romaji: "ru",  group: "basic" }, { kana: "レ", romaji: "re",  group: "basic" },
  { kana: "ロ", romaji: "ro",  group: "basic" },
  { kana: "ワ", romaji: "wa",  group: "basic" }, { kana: "ヲ", romaji: "wo",  group: "basic" },
  { kana: "ン", romaji: "n",   group: "basic" },
  // Dakuten / Handakuten
  { kana: "ガ", romaji: "ga",  group: "dakuten" }, { kana: "ギ", romaji: "gi",  group: "dakuten" },
  { kana: "グ", romaji: "gu",  group: "dakuten" }, { kana: "ゲ", romaji: "ge",  group: "dakuten" },
  { kana: "ゴ", romaji: "go",  group: "dakuten" },
  { kana: "ザ", romaji: "za",  group: "dakuten" }, { kana: "ジ", romaji: "ji",  group: "dakuten" },
  { kana: "ズ", romaji: "zu",  group: "dakuten" }, { kana: "ゼ", romaji: "ze",  group: "dakuten" },
  { kana: "ゾ", romaji: "zo",  group: "dakuten" },
  { kana: "ダ", romaji: "da",  group: "dakuten" }, { kana: "デ", romaji: "de",  group: "dakuten" },
  { kana: "ド", romaji: "do",  group: "dakuten" },
  { kana: "バ", romaji: "ba",  group: "dakuten" }, { kana: "ビ", romaji: "bi",  group: "dakuten" },
  { kana: "ブ", romaji: "bu",  group: "dakuten" }, { kana: "ベ", romaji: "be",  group: "dakuten" },
  { kana: "ボ", romaji: "bo",  group: "dakuten" },
  { kana: "パ", romaji: "pa",  group: "dakuten" }, { kana: "ピ", romaji: "pi",  group: "dakuten" },
  { kana: "プ", romaji: "pu",  group: "dakuten" }, { kana: "ペ", romaji: "pe",  group: "dakuten" },
  { kana: "ポ", romaji: "po",  group: "dakuten" },
  // Combination (youon)
  { kana: "キャ", romaji: "kya", group: "combo" }, { kana: "キュ", romaji: "kyu", group: "combo" },
  { kana: "キョ", romaji: "kyo", group: "combo" },
  { kana: "シャ", romaji: "sha", group: "combo" }, { kana: "シュ", romaji: "shu", group: "combo" },
  { kana: "ショ", romaji: "sho", group: "combo" },
  { kana: "チャ", romaji: "cha", group: "combo" }, { kana: "チュ", romaji: "chu", group: "combo" },
  { kana: "チョ", romaji: "cho", group: "combo" },
  { kana: "ニャ", romaji: "nya", group: "combo" }, { kana: "ニュ", romaji: "nyu", group: "combo" },
  { kana: "ニョ", romaji: "nyo", group: "combo" },
  { kana: "ヒャ", romaji: "hya", group: "combo" }, { kana: "ヒュ", romaji: "hyu", group: "combo" },
  { kana: "ヒョ", romaji: "hyo", group: "combo" },
  { kana: "ミャ", romaji: "mya", group: "combo" }, { kana: "ミュ", romaji: "myu", group: "combo" },
  { kana: "ミョ", romaji: "myo", group: "combo" },
  { kana: "リャ", romaji: "rya", group: "combo" }, { kana: "リュ", romaji: "ryu", group: "combo" },
  { kana: "リョ", romaji: "ryo", group: "combo" },
  { kana: "ギャ", romaji: "gya", group: "combo" }, { kana: "ギュ", romaji: "gyu", group: "combo" },
  { kana: "ギョ", romaji: "gyo", group: "combo" },
  { kana: "ジャ", romaji: "ja",  group: "combo" }, { kana: "ジュ", romaji: "ju",  group: "combo" },
  { kana: "ジョ", romaji: "jo",  group: "combo" },
  { kana: "ビャ", romaji: "bya", group: "combo" }, { kana: "ビュ", romaji: "byu", group: "combo" },
  { kana: "ビョ", romaji: "byo", group: "combo" },
  { kana: "ピャ", romaji: "pya", group: "combo" }, { kana: "ピュ", romaji: "pyu", group: "combo" },
  { kana: "ピョ", romaji: "pyo", group: "combo" },
];

const GROUP_LABELS: Record<string, string> = {
  basic:   "Basic (46)",
  dakuten: "Dakuten ゛/ ゜(23)",
  combo:   "Combination (33)",
};

type QuizMode = "romaji-to-kana" | "kana-to-romaji";

type KatakanaQuestion = {
  entry: KatakanaEntry;
  correct: string;
  options: string[];
};

export default function QuizKatakana() {
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [quizLength, setQuizLength] = useState(20);
  const [filterGroup, setFilterGroup] = useState<string | null>(null);
  const [mode, setMode] = useState<QuizMode>("romaji-to-kana");

  const [questions, setQuestions] = useState<KatakanaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const pool = filterGroup ? KATAKANA.filter(h => h.group === filterGroup) : KATAKANA;

  const startQuiz = () => {
    const picked = fisherYates(pool).slice(0, Math.min(quizLength, pool.length));
    const qs: KatakanaQuestion[] = picked.map(entry => {
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
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(i => i + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setIsFinished(true);
      }
    }, 1300);
  };

  if (!isStarted) {
    return (
      <div className="w-full max-w-lg mx-auto py-10 px-4 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
        <div className="w-24 h-24 bg-secondary/30 rounded-full flex items-center justify-center">
          <Type className="w-12 h-12 text-secondary-foreground" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Katakana Quiz</h1>
          <p className="text-muted-foreground text-lg">Drill all 102 katakana characters.</p>
          <p className="text-xs text-muted-foreground mt-1">Used for foreign words, loanwords, and emphasis.</p>
        </div>

        <div className="w-full bg-muted/40 border border-border rounded-2xl p-4 text-left">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Quick reference
          </p>
          <div className="grid grid-cols-5 gap-1 text-center font-jp">
            {[
              ["ア","a"],["イ","i"],["ウ","u"],["エ","e"],["オ","o"],
              ["カ","ka"],["サ","sa"],["タ","ta"],["ナ","na"],["ハ","ha"],
              ["マ","ma"],["ヤ","ya"],["ラ","ra"],["ワ","wa"],["ン","n"],
            ].map(([k, r]) => (
              <div key={k} className="bg-card border border-border rounded-lg py-1.5 flex flex-col items-center">
                <span className="text-lg font-bold text-foreground">{k}</span>
                <span className="text-[10px] text-muted-foreground">{r}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Tip: コーヒー (ko-hi-) = coffee · テレビ (te-re-bi) = TV · アイスクリーム = ice cream
          </p>
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
                Romaji → Katakana
              </button>
              <button
                onClick={() => setMode("kana-to-romaji")}
                className={`py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all ${mode === "kana-to-romaji" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
              >
                Katakana → Romaji
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
                All ({KATAKANA.length})
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
              {[10, 20, 30, 46, pool.length]
                .filter((v, i, arr) => arr.indexOf(v) === i && v <= pool.length)
                .slice(0, 5)
                .map(n => (
                <button
                  key={n}
                  onClick={() => setQuizLength(n)}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${quizLength === n ? "bg-primary text-primary-foreground shadow-md scale-105" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  {n === pool.length ? "All" : n}
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
              {isKanaMode ? "Which katakana?" : "Which reading?"}
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
                  className={`p-4 rounded-2xl font-bold transition-all duration-200 flex justify-between items-center ${cls}`}
                >
                  <span className={isKanaMode ? "font-jp text-3xl" : "text-xl"}>{option}</span>
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
