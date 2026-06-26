import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCustomData } from "@/hooks/use-custom-data";

import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import Flashcards from "@/pages/flashcards";
import VocabBuilder from "@/pages/vocab";
import Quiz from "@/pages/quiz";
import QuizTeForm from "@/pages/quiz-teform";
import GrammarGuide from "@/pages/grammar";
import Phrases from "@/pages/phrases";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/flashcards" component={Flashcards} />
        <Route path="/vocab" component={VocabBuilder} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/quiz/teform" component={QuizTeForm} />
        <Route path="/grammar" component={GrammarGuide} />
        <Route path="/phrases" component={Phrases} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const load = useCustomData((s) => s.load);
  useEffect(() => {
    load();
  }, [load]);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
