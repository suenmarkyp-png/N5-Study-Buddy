import React, { useState } from "react";
import { grammarPoints } from "@/data/grammar";
import { BookOpen, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GrammarGuide() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleOpen = (id: string) => {
    setOpenId(prev => prev === id ? null : id);
  };

  return (
    <div className="w-full space-y-6 py-6 px-4 md:py-10 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <BookOpen className="w-8 h-8" /> Grammar Guide
        </h1>
        <p className="text-muted-foreground text-lg">Essential N5 sentence patterns and particles.</p>
      </div>

      <div className="space-y-3">
        {grammarPoints.map((point, index) => {
          const isOpen = openId === point.id;
          
          return (
            <div 
              key={point.id} 
              className={`bg-card rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen ? 'border-primary shadow-md' : 'border-card-border hover:border-primary/30'
              }`}
            >
              {/* Accordion Header */}
              <button 
                onClick={() => toggleOpen(point.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">#{index + 1}</span>
                    <h3 className="text-xl font-jp font-bold text-foreground">{point.pattern}</h3>
                  </div>
                  <p className="text-primary font-medium">{point.meaning}</p>
                </div>
                <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              {/* Accordion Body */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-border">
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Explanation</h4>
                          <p className="text-foreground leading-relaxed">{point.explanation}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Examples</h4>
                          <div className="space-y-3">
                            {point.examples.map((ex, i) => (
                              <div key={i} className="bg-muted/30 p-4 rounded-xl border border-border/50">
                                <p className="text-lg font-jp text-foreground mb-1">{ex.jp}</p>
                                <p className="text-sm text-primary mb-2">{ex.romaji}</p>
                                <p className="text-sm text-muted-foreground italic">{ex.en}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-secondary/10 border border-secondary/30 p-4 rounded-xl">
                          <h4 className="text-sm font-bold text-secondary-foreground mb-1">Note</h4>
                          <p className="text-sm text-foreground">{point.notes}</p>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

    </div>
  );
}
