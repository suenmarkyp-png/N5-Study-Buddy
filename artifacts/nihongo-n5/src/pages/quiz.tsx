import React, { useState } from "react";
import { useProgress } from "@/hooks/use-progress";
import { Word } from "@/data/vocab";
import { useMergedFlashcards } from "@/hooks/use-merged-data";
import { Target, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react";
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
  options: string[]; // meanings
  type: 'meaning' | 'reading';
};

export default function Quiz() {
  const { recordQuizResult } = useProgress();
  const allWords = useMergedFlashcards();

  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [quizLength, setQuizLength] = useState(10);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const startQuiz = () => {
    const count = Math.min(quizLength, allWords.length);
    const shuffled = fisherYates(allWords).slice(0, count);

    const qs: Question[] = shuffled.map(word => {
      const isMeaning = Math.random() > 0.5;
      const correctAnswer = isMeaning ? word.meaning : word.romaji;
      const wrongOptions = fisherYates(
        allWords.filter(w => w.id !== word.id)
      )
        .slice(0, 3)
        .map(w => isMeaning ? w.meaning : w.romaji);

      const options = fisherYates([...wrongOptions, correctAnswer]);
      
      return {
        word,
        options,
        type: isMeaning ? 'meaning' : 'reading'
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
    if (selectedAnswer !== null) return; // Prevent multiple clicks

    const currentQ = questions[currentIndex];
    const correct = currentQ.type === 'meaning' 
      ? option === currentQ.word.meaning 
      : option === currentQ.word.romaji;

    setSelectedAnswer(option);
    setIsCorrect(correct);
    
    if (correct) {
      setScore(s => s + 1);
    }

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

        <div className="flex gap-4 w-full mt-8">
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
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-bold text-muted-foreground mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
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
          {/* Question Card */}
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
          </div>

          {/* Options */}
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
