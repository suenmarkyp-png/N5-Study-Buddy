import React, { useState } from "react";
import { useProgress } from "@/hooks/use-progress";
import { vocabWords, vocabCategories, Word } from "@/data/vocab";
import { Search, BookType, Check, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VocabBuilder() {
  const { knownWords, markWordKnown, markWordLearning } = useProgress();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWords = vocabWords.filter(word => {
    const matchesSearch = 
      word.kanji.includes(searchQuery) || 
      word.kana.includes(searchQuery) || 
      word.romaji.toLowerCase().includes(searchQuery.toLowerCase()) || 
      word.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "All" || word.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleStatus = (id: string) => {
    if (knownWords[id]) {
      markWordLearning(id); // unmark
    } else {
      markWordKnown(id);
    }
  };

  return (
    <div className="w-full space-y-6 py-6 px-4 md:py-10">
      
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <BookType className="w-8 h-8" /> Expand Words
        </h1>
        <p className="text-muted-foreground">Build your vocabulary by category.</p>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search Japanese, romaji, or English..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border-2 border-border rounded-xl focus:border-primary focus:ring-0 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Category Pills */}
      {!searchQuery && (
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 gap-2 hide-scrollbar">
          <button
            onClick={() => setActiveCategory("All")}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              activeCategory === "All" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Words
          </button>
          {vocabCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                activeCategory === cat 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Word List */}
      <div className="space-y-3">
        {filteredWords.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No words found matching your search.
          </div>
        ) : (
          <AnimatePresence>
            {filteredWords.map((word, index) => (
              <motion.div
                key={word.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.5) }}
                className={`group bg-card border ${knownWords[word.id] ? 'border-success/30 bg-success/5' : 'border-card-border'} p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-4`}
              >
                
                {/* Checkbox */}
                <button 
                  onClick={() => toggleStatus(word.id)}
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    knownWords[word.id] ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {knownWords[word.id] ? <Check className="w-5 h-5 stroke-[3px]" /> : <Circle className="w-5 h-5" />}
                </button>

                {/* Word Info */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-2xl font-jp font-bold text-foreground">{word.kanji}</h3>
                      <span className="text-sm font-jp text-muted-foreground">{word.kana}</span>
                    </div>
                    <p className="text-sm font-medium text-primary">{word.romaji}</p>
                  </div>

                  <div>
                    <p className="text-lg font-bold text-foreground">{word.meaning}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1">{word.category}</p>
                  </div>

                  <div className="text-sm space-y-1 bg-muted/30 p-3 rounded-lg md:col-span-1 border border-border/50">
                    <p className="font-jp text-foreground">{word.example.jp}</p>
                    <p className="text-muted-foreground italic">{word.example.en}</p>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

    </div>
  );
}
