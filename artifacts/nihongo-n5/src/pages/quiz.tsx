import React, { useState } from "react";
import { useProgress } from "@/hooks/use-progress";
import { Word } from "@/data/vocab";
import { useMergedFlashcards } from "@/hooks/use-merged-data";
import { Target, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Question = {
  word: Word;
  options: string[];
  type: 'meaning' | 'reading';
};

export default function Quiz() {
  const { recordQuizResult, recordWordResult, wordStats } = useProgress();
  const allWords = useMergedFlashcards();

  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [quizLength, setQuizLength] = useState(10);
  const [weakMode, setWeakMode] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const weakWords = allWords
    .filter(w => {
      const s = wordStats[w.id];
      return s && s.incorrect > 0;
    })
    .sort((a, b) => {
      const sa = wordStats[a.id] ?? { correct: 0, incorrect: 0 };
      const sb = wordStats[b.id] ?? { correct: 0, incorrect: 0 };
      const ratioA = sa.incorrect / Math.max(sa.correct + sa.incorrect, 1);
      const ratioB = sb.incorrect / Math.max(sb.correct + sb.incorrect, 1);
      return ratioB - ratioA;
    });

  const startQuiz = () => {
    let pool: Word[];
    if (weakMode && weakWords.length >= 4) {
      const top = weakWords.slice(0, quizLength);
      pool = top.length >= quizLength ? top : fisherYates([...top, ...allWords.filter(w => !top.find(t => t.id === w.id))]).slice(0, quizLength);
    } else {
      pool = fisherYates(allWords).slice(0, Math.min(quizLength, allWords.length));
    }

    const qs: Question[] = pool.map(word => {
      const isMeaning = Math.random() > 0.5;
      const correctAnswer = isMeaning ? word.meaning : word.romaji;
      const wrongOptions = fisherYates(allWords.filter(w => w.id !== word.id))
        .slice(0, 3)
        .map(w => isMeaning ? w.meaning : w.romaji);
      const options = fisherYates([...wrongOptions, correctAnswer]);
      return { word, options, type: isMeaning ? 'meaning' : 'reading' };
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

    const currentQ = questions[currentIndex];
    const correct = currentQ.type === 'meaning'
      ? option === currentQ.word.meaning
      : option === currentQ.word.romaji;

    setSelectedAnswer(option);
    setIsCorrect(correct);
    recordWordResult(currentQ.word.id, correct);

    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(i => i + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        finishQuiz(score + (correct ? 1 : 0));
      }
    }, 1500);
  };

  const finishQuiz = (finalScore: number) => {
    recordQuizResult(finalScore, questions.length);
    setIsFinished(true);
  };

  if (!isStarted) {
    const hasWeakWords = weakWords.length >= 4;
    return (
      <div className="w-full max-w-lg mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <Target className="w-12 h-12" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Pop Quiz</h1>
          <p className="text-muted-foreground text-lg">Test your memory and build your streak.</p>
        </div>

        <div className="w-full bg-card border border-border rounded-2xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-3">Number of Questions</label>
            <div className="grid grid-cols-5 gap-3">
              {[10, 20, 30, 40, 50].map(n => (
                <button
                  key={n}
                  onClick={() => setQuizLength(n)}
                  className={`py-3 rounded-xl font-bold transition-all ${
                    quizLength === n
                      ? 'bg-primary text-primary-foreground shadow-md scale-105'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-3">Mode</label>
            <button
              onClick={() => hasWeakWords && setWeakMode(w => !w)}
              disabled={!hasWeakWords}
              title={!hasWeakWords ? "Answer some quizzes first to unlock weak word mode" : undefined}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 font-bold transition-all ${
                weakMode
                  ? 'bg-destructive/10 border-destructive text-destructive'
                  : hasWeakWords
                    ? 'bg-muted border-border text-muted-foreground hover:border-primary/40'
                    : 'bg-muted border-border text-muted-foreground/40 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-sm font-bold">Weak Words Mode</p>
                  <p className="text-xs font-normal opacity-70">
                    {hasWeakWords
                      ? `Focus on your ${weakWords.length} most missed word${weakWords.length !== 1 ? 's' : ''}`
                      : 'Complete a quiz first to unlock'}
                  </p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                weakMode ? 'bg-destructive border-destructive' : 'border-muted-foreground/40'
              }`}>
                {weakMode && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          </div>

          <button
            onClick={startQuiz}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors shadow-md active:scale-95"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const missed = questions.filter((q, i) => {
      const correct = q.type === 'meaning' ? q.options.includes(q.word.meaning) : true;
      return correct;
    });
    const missedWords = questions.filter(q => {
      const s = wordStats[q.word.id];
      return s && s.incorrect > s.correct;
    });

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
          {weakMode && (
            <p className="text-sm text-destructive font-bold mt-2 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4" /> Weak Words Mode
            </p>
          )}
        </div>

        {missedWords.length > 0 && (
          <div className="w-full bg-destructive/5 border border-destructive/20 rounded-2xl p-4 text-left">
            <p className="text-sm font-bold text-destructive mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Still need work ({missedWords.length})
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {missedWords.slice(0, 8).map(q => {
                const s = wordStats[q.word.id];
                return (
                  <div key={q.word.id} className="flex items-center justify-between text-sm">
                    <span className="font-jp font-bold text-foreground">{q.word.kanji}</span>
                    <span className="text-muted-foreground">{q.word.meaning}</span>
                    <span className="text-xs text-destructive font-bold">{s?.incorrect ?? 0} wrong</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-4 w-full">
          <button
            onClick={() => { setIsStarted(false); }}
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
          <span className="flex items-center gap-2">
            Question {currentIndex + 1} of {questions.length}
            {weakMode && <span className="text-destructive flex items-center gap-1"><Flame className="w-3 h-3" /> Weak</span>}
          </span>
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
          <div className="bg-card border-2 border-card-border rounded-3xl p-8 text-center mb-6 shadow-sm flex-1 flex flex-col items-center justify-center">
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">
              {currentQ.type === 'meaning' ? 'What does this mean?' : 'How is this read?'}
            </p>

            <h2 className="text-5xl md:text-7xl font-jp font-bold text-foreground mb-4">
              {currentQ.word.kanji}
            </h2>

            {currentQ.type === 'meaning' && (
              <p className="text-xl text-primary font-medium">{currentQ.word.kana}</p>
            )}

            {(() => {
              const s = wordStats[currentQ.word.id];
              if (!s || s.incorrect === 0) return null;
              const total = s.correct + s.incorrect;
              const pct = Math.round((s.incorrect / total) * 100);
              return (
                <p className="mt-4 text-xs text-destructive font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Missed {pct}% of the time ({s.incorrect}/{total})
                </p>
              );
            })()}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
            {currentQ.options.map((option, i) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer = currentQ.type === 'meaning'
                ? option === currentQ.word.meaning
                : option === currentQ.word.romaji;

              let btnClass = "bg-card border-2 border-border text-foreground hover:bg-muted/50";

              if (selectedAnswer !== null) {
                if (isCorrectAnswer) {
                  btnClass = "bg-success/10 border-success text-success-foreground shadow-[0_0_15px_rgba(var(--success),0.2)]";
                } else if (isSelected) {
                  btnClass = "bg-destructive/10 border-destructive text-destructive-foreground";
                } else {
                  btnClass = "bg-card border-border opacity-50";
                }
              }

              return (
                <motion.button
                  key={i}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswer(option)}
                  animate={isSelected && !isCorrect ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-2xl text-lg font-bold transition-all duration-200 flex justify-between items-center ${btnClass}`}
                >
                  <span>{option}</span>
                  {selectedAnswer !== null && isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-success" />}
                  {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
