import React from "react";
import { useProgress } from "@/hooks/use-progress";
import { Settings as SettingsIcon, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { resetProgress } = useProgress();
  const { toast } = useToast();

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
