import React, { useState } from "react";
import { RefreshCw, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type VerbGroup = "G1" | "G2" | "Irregular";

type PassiveVerb = {
  group: VerbGroup;
  plain: string;
  plainRomaji: string;
  meaning: string;
  passive: string;
  passiveRomaji: string;
  rule: string;
};

const VERBS: PassiveVerb[] = [
  { group: "G1", plain: "書く",  plainRomaji: "kaku",   meaning: "to write",  passive: "書かれる",  passiveRomaji: "kakareru",   rule: "G1: replace u→areru" },
  { group: "G1", plain: "読む",  plainRomaji: "yomu",   meaning: "to read",   passive: "読まれる",  passiveRomaji: "yomareru",   rule: "G1: replace u→areru" },
  { group: "G1", plain: "話す",  plainRomaji: "hanasu", meaning: "to speak",  passive: "話される",  passiveRomaji: "hanasareru", rule: "G1: replace u→areru" },
  { group: "G1", plain: "買う",  plainRomaji: "kau",    meaning: "to buy",    passive: "買われる",  passiveRomaji: "kawareru",   rule: "G1: replace u→areru" },
  { group: "G1", plain: "待つ",  plainRomaji: "matsu",  meaning: "to wait",   passive: "待たれる",  passiveRomaji: "matareru",   rule: "G1: replace u→areru" },
  { group: "G2", plain: "食べる", plainRomaji: "taberu", meaning: "to eat",    passive: "食べられる", passiveRomaji: "taberareru", rule: "G2: replace る→られる" },
  { group: "G2", plain: "見る",  plainRomaji: "miru",   meaning: "to see",    passive: "見られる",  passiveRomaji: "mirareru",   rule: "G2: replace る→られる" },
  { group: "G2", plain: "教える", plainRomaji: "oshieru", meaning: "to teach", passive: "教えられる", passiveRomaji: "oshierareru", rule: "G2: replace る→られる" },
  { group: "G2", plain: "起きる", plainRomaji: "okiru",  meaning: "to wake up", passive: "起きられる", passiveRomaji: "okirareru", rule: "G2: replace る→られる" },
  { group: "Irregular", plain: "する",  plainRomaji: "suru", meaning: "to do",   passive: "される",   passiveRomaji: "sareru",     rule: "Irregular: memorise" },
  { group: "Irregular", plain: "来る",  plainRomaji: "kuru", meaning: "to come", passive: "来られる", passiveRomaji: "korareru",   rule: "Irregular: memorise" },
];

const GROUP_LABELS: Record<VerbGroup, string> = {
  G1: "Group 1 — u-verbs",
  G2: "Group 2 — ru-verbs",
  Irregular: "Group 3 — irregular",
};

const GROUP_RULE: Record<VerbGroup, string> = {
  G1: "Drop the final u-sound and add -areru (e.g. kaku → kakareru)",
  G2: "Replace the final る with られる (e.g. taberu → taberareru)",
  Irregular: "する → される  /  来る → 来られる (memorise)",
};

type PassiveQuestion = {
  verb: PassiveVerb;
  options: string[];
};

type FilterGroup = VerbGroup | null;

export default function QuizPassive() {
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [filterGroup, setFilterGroup] = useState<FilterGroup>(null);

  const [questions, setQuestions] = useState<PassiveQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const pool = filterGroup ? VERBS.filter(v => v.group === filterGroup) : VERBS;

  const startQuiz = () => {
    const picked = fisherYates(pool);
    const allPassives = VERBS.map(v => v.passive);
    const qs: PassiveQuestion[] = picked.map(verb => {
      const wrongs = fisherYates(allPassives.filter(p => p !== verb.passive)).slice(0, 3);
      return { verb, options: fisherYates([verb.passive, ...wrongs]) };
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
    const correct = option === questions[currentIndex].verb.passive;
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
    }, 1500);
  };

  // — Setup screen —
  if (!isStarted) {
    return (
      <div className="w-full max-w-lg mx-auto py-10 px-4 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
          <RefreshCw className="w-12 h-12 text-primary" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Passive Form</h1>
          <p className="text-muted-foreground text-lg">受け身形 — Ukemi-kei</p>
        </div>

        {/* Rule cards */}
        <div className="w-full space-y-3 text-left">
          {(["G1", "G2", "Irregular"] as VerbGroup[]).map(g => (
            <div key={g} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{g}</span>
                <span className="text-sm font-bold text-foreground">{GROUP_LABELS[g]}</span>
              </div>
              <p className="text-xs text-muted-foreground">{GROUP_RULE[g]}</p>
            </div>
          ))}
        </div>

        {/* Verb table */}
        <div className="w-full bg-card border border-border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <span>Plain</span>
            <span>Passive</span>
            <span>Meaning</span>
          </div>
          {VERBS.map(v => (
            <div key={v.plain} className="grid grid-cols-3 px-4 py-2.5 border-t border-border text-sm items-center">
              <span className="font-jp font-bold text-foreground">{v.plain}</span>
              <span className="font-jp text-primary font-bold">{v.passive}</span>
              <span className="text-muted-foreground text-xs">{v.meaning}</span>
            </div>
          ))}
        </div>

        <div className="w-full bg-card border border-border rounded-2xl p-6 space-y-5">
          {/* Group filter */}
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-3">Filter by Group</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterGroup(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filterGroup === null ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/40"}`}
              >
                All ({VERBS.length})
              </button>
              {(["G1", "G2", "Irregular"] as VerbGroup[]).map(g => (
                <button
                  key={g}
                  onClick={() => setFilterGroup(filterGroup === g ? null : g)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filterGroup === g ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/40"}`}
                >
                  {g} ({VERBS.filter(v => v.group === g).length})
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startQuiz}
            disabled={pool.length < 4}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors shadow-md active:scale-95 disabled:opacity-40"
          >
            {pool.length < 4 ? "Not enough verbs in this group" : "Start Quiz"}
          </button>
        </div>
      </div>
    );
  }

  // — Finished screen —
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
        <div className="w-full bg-card border border-border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 bg-muted px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <span>Plain</span>
            <span>Passive</span>
            <span>Reading</span>
          </div>
          {questions.map(q => (
            <div key={q.verb.plain} className="grid grid-cols-3 px-4 py-2.5 border-t border-border text-sm items-center">
              <span className="font-jp font-bold">{q.verb.plain}</span>
              <span className="font-jp text-primary font-bold">{q.verb.passive}</span>
              <span className="text-xs text-muted-foreground">{q.verb.passiveRomaji}</span>
            </div>
          ))}
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

  // — Question screen —
  const q = questions[currentIndex];

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
          <div className="bg-card border-2 border-card-border rounded-3xl p-8 text-center mb-6 shadow-sm flex-1 flex flex-col items-center justify-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full">
              Passive form of…
            </span>

            <p className="text-6xl md:text-8xl font-jp font-bold text-foreground">{q.verb.plain}</p>
            <p className="text-lg text-muted-foreground">{q.verb.plainRomaji} — {q.verb.meaning}</p>

            <span className="text-xs font-bold bg-muted px-3 py-1 rounded-full text-muted-foreground">{q.verb.group}</span>

            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 px-5 py-3 rounded-xl text-sm text-left space-y-1"
              >
                <p className={`font-bold text-base ${isCorrect ? "text-success-foreground" : "text-destructive"}`}>
                  {q.verb.plain} → {q.verb.passive} ({q.verb.passiveRomaji})
                </p>
                <p className="text-xs text-muted-foreground">{q.verb.rule}</p>
              </motion.div>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            {q.options.map((option, i) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer = option === q.verb.passive;
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
                  className={`p-4 rounded-2xl font-jp font-bold text-xl transition-all duration-200 flex justify-between items-center ${cls}`}
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
