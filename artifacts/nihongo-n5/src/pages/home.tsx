import React from "react";
import { Link } from "wouter";
import { useProgress } from "@/hooks/use-progress";
import { flashcardWords, allWords } from "@/data/vocab";
import { grammarPoints } from "@/data/grammar";
import { phrases } from "@/data/phrases";
import { ArrowRight, BookOpen, Layers, Target, Trophy, Flame, CheckCircle2 } from "lucide-react";

export default function Home() {
  const { quizStats, knownWords, learningWords } = useProgress();

  const totalWords = allWords.length;
  const knownCount = Object.keys(knownWords).length;
  const learningCount = Object.keys(learningWords).length;
  
  const progressPercent = Math.round((knownCount / totalWords) * 100) || 0;
  
  const lastScore = quizStats.recentScores.length > 0 
    ? quizStats.recentScores[quizStats.recentScores.length - 1] 
    : null;

  return (
    <div className="w-full space-y-8 py-6 px-4 md:py-10">
      
      {/* Header Section */}
      <section className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
          Okaeri (Welcome back)
        </h1>
        <p className="text-muted-foreground text-lg">
          Ready to continue your N5 journey?
        </p>
      </section>

      {/* Dashboard Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Streak Card */}
        <div className="bg-card border border-card-border p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-foreground">{quizStats.currentStreak}</h3>
              <span className="text-sm text-muted-foreground">days</span>
            </div>
          </div>
        </div>

        {/* Vocabulary Progress */}
        <div className="bg-card border border-card-border p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-success/20 text-success-foreground rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Words Known</p>
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="text-2xl font-bold text-foreground">{knownCount}</h3>
              <span className="text-sm text-muted-foreground">/ {totalWords}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div className="bg-success h-1.5 rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Last Quiz Score */}
        <div className="bg-card border border-card-border p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Recent Score</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-foreground">
                {lastScore !== null ? `${lastScore}%` : '-'}
              </h3>
            </div>
          </div>
        </div>

      </section>

      {/* Quick Jump Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Study Sections</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <Link href="/flashcards" className="group block bg-card border border-card-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all hover-elevate">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-secondary/30 text-secondary-foreground rounded-xl flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">Verbs & Adjectives</h3>
            <p className="text-sm text-muted-foreground">Master {flashcardWords.length} essential verbs and adjectives with flashcards.</p>
          </Link>

          <Link href="/vocab" className="group block bg-card border border-card-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all hover-elevate">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-accent/30 text-accent-foreground rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">Vocabulary Bank</h3>
            <p className="text-sm text-muted-foreground">Browse words by categories like family, time, and places.</p>
          </Link>

          <Link href="/grammar" className="group block bg-card border border-card-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all hover-elevate">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">Grammar Guide</h3>
            <p className="text-sm text-muted-foreground">{grammarPoints.length} core particles and sentence patterns.</p>
          </Link>

          <Link href="/quiz" className="group block bg-primary border border-primary text-primary-foreground rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-primary/90 transition-all hover-elevate relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Target className="w-32 h-32" />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors group-hover:translate-x-1" />
            </div>
            <h3 className="text-lg font-bold mb-1 relative z-10">Take a Pop Quiz</h3>
            <p className="text-sm text-primary-foreground/80 relative z-10">Test your knowledge and build your streak.</p>
          </Link>

        </div>
      </section>

    </div>
  );
}
