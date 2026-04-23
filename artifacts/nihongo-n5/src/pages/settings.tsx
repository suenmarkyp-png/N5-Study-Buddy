import React, { useState } from "react";
import { useProgress } from "@/hooks/use-progress";
import { useCustomData } from "@/hooks/use-custom-data";
import { Settings as SettingsIcon, Trash2, AlertTriangle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { resetProgress } = useProgress();
  const {
    customFlashcards,
    customVocab,
    customGrammar,
    customPhrases,
    deletedFlashcardIds,
    deletedVocabIds,
    deletedGrammarIds,
    deletedPhraseIds,
  } = useCustomData();
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    try {
      const payload = {
        exportedAt: new Date().toISOString(),
        version: 1,
        customFlashcards,
        customVocab,
        customGrammar,
        customPhrases,
        deletedFlashcardIds,
        deletedVocabIds,
        deletedGrammarIds,
        deletedPhraseIds,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `nihongo-n5-backup-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Backup downloaded",
        description: "Your custom entries have been exported.",
      });
    } catch (err) {
      toast({
        title: "Export failed",
        description: (err as Error).message,
      });
    } finally {
      setExporting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
      resetProgress();
      toast({
        title: "Progress Reset",
        description: "All your study data has been cleared.",
      });
      // Small delay then reload to ensure state is clean
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="w-full space-y-6 py-6 px-4 md:py-10 max-w-2xl mx-auto">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <SettingsIcon className="w-8 h-8" /> Settings
        </h1>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground mb-2">About Nihongo N5</h2>
          <p className="text-muted-foreground">
            A quiet companion for your Japanese learning journey. Designed specifically for absolute beginners studying for the JLPT N5.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Version 1.0.0
          </p>
        </div>

        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground mb-2">Backup</h2>
          <p className="text-muted-foreground mb-4">
            Download a JSON backup of every entry you have added or removed in Manage.
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {exporting ? "Preparing..." : "Export Backup"}
          </button>
        </div>

        <div className="p-6 bg-destructive/5">
          <h2 className="text-xl font-bold text-destructive flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5" /> Danger Zone
          </h2>
          <p className="text-muted-foreground mb-4">
            Resetting your progress will erase all your flashcard statuses, known words, and quiz history.
          </p>
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-bold hover:bg-destructive/90 transition-colors"
          >
            <Trash2 className="w-5 h-5" /> Reset All Progress
          </button>
        </div>

      </div>
    </div>
  );
}
