import React from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, Layers, Target, BookType, MessageCircle, Home, Settings, CheckCircle2, Zap } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { hasSeenOnboarding, completeOnboarding } = useProgress();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/flashcards", label: "Cards", icon: Layers },
    { href: "/vocab", label: "Vocab", icon: BookType },
    { href: "/quiz", label: "Quiz", icon: Target },
    { href: "/quiz/teform", label: "て-Form", icon: Zap },
    { href: "/grammar", label: "Grammar", icon: BookOpen },
    { href: "/phrases", label: "Phrases", icon: MessageCircle },
  ];

  if (!hasSeenOnboarding) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-6">
          <div className="w-24 h-24 bg-primary text-primary-foreground rounded-3xl mx-auto flex items-center justify-center shadow-lg transform -rotate-6">
            <span className="font-jp text-5xl font-bold">語</span>
          </div>
          <h1 className="text-3xl font-bold text-primary mt-6">Welcome to Nihongo N5</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Your quiet, focused companion for mastering the basics of Japanese. 
            Learn vocabulary, grasp essential grammar, and test yourself at your own pace.
          </p>
          <button 
            onClick={completeOnboarding}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium text-lg hover:bg-primary/90 transition-colors shadow-md mt-8 active:scale-95"
          >
            Hajimemashou! (Let's begin)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] pb-24 md:pb-0 md:pl-64 flex flex-col">
      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 px-2 py-2 flex justify-between items-center pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const active = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center w-full py-2 px-1 rounded-xl transition-all duration-200 ${active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}>
              <item.icon className={`w-5 h-5 mb-1 ${active ? "stroke-[2.5px]" : "stroke-2"}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-64 bg-card border-r border-border flex-col z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-sm">
            <span className="font-jp text-xl font-bold">語</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-primary leading-tight">Nihongo N5</h1>
            <p className="text-xs text-muted-foreground font-medium">Study Companion</p>
          </div>
        </div>
        
        <div className="flex-1 px-4 py-2 space-y-2">
          {navItems.map((item) => {
            const active = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
                <item.icon className={`w-5 h-5 ${active ? "stroke-[2.5px]" : "stroke-2"}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-6">
          <Link href="/settings" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors px-2">
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full max-w-4xl mx-auto">
        {children}
      </main>
    </div>
  );
}
