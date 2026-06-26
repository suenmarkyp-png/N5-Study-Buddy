import React, { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, Send, Plus, Trash2, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

type Conversation = {
  id: number;
  title: string;
  createdAt: string;
  messages?: Message[];
};

function renderContent(text: string) {
  // Render furigana: 漢字[かんじ] → <ruby>漢字<rt>かんじ</rt></ruby>
  const parts = text.split(/(\[[^\]]+\])/);
  const rendered: React.ReactNode[] = [];
  let i = 0;
  const chars = text;
  let idx = 0;

  const segments = text.split(/([\u4e00-\u9fff\u3400-\u4dbf々〆〤]+\[[^\]]+\])/g);
  return (
    <>
      {segments.map((seg, si) => {
        const furiganaMatch = seg.match(/^([\u4e00-\u9fff\u3400-\u4dbf々〆〤]+)\[([^\]]+)\]$/);
        if (furiganaMatch) {
          return (
            <ruby key={si} className="font-jp">
              {furiganaMatch[1]}
              <rt className="text-xs text-primary/70 not-italic">{furiganaMatch[2]}</rt>
            </ruby>
          );
        }
        // Bold: **text**
        const boldParts = seg.split(/(\*\*[^*]+\*\*)/g);
        return (
          <React.Fragment key={si}>
            {boldParts.map((bp, bi) => {
              if (bp.startsWith("**") && bp.endsWith("**")) {
                return <strong key={bi}>{bp.slice(2, -2)}</strong>;
              }
              return <span key={bi}>{bp}</span>;
            })}
          </React.Fragment>
        );
      })}
    </>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-jp font-bold text-sm mr-2 shrink-0 mt-1">
          語
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-card border border-border text-foreground rounded-bl-sm"
        }`}
      >
        {isUser ? msg.content : renderContent(msg.content)}
      </div>
    </motion.div>
  );
}

export default function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages, streamingText]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const res = await fetch("/api/openai/conversations");
    if (res.ok) {
      const data = await res.json();
      setConversations(data);
    }
  };

  const loadConversation = async (id: number) => {
    setLoading(true);
    const res = await fetch(`/api/openai/conversations/${id}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages ?? []);
      setActiveId(id);
    }
    setLoading(false);
    setShowSidebar(false);
  };

  const newConversation = async () => {
    const title = `会話 ${new Date().toLocaleString("ja-JP", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
    const res = await fetch("/api/openai/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      const conv = await res.json();
      setConversations(prev => [...prev, conv]);
      setMessages([]);
      setActiveId(conv.id);
      setShowSidebar(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const deleteConversation = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await fetch(`/api/openai/conversations/${id}`, { method: "DELETE" });
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeId === id) {
      setActiveId(null);
      setMessages([]);
      setShowSidebar(true);
    }
  };

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !activeId || streaming) return;
    const text = input.trim();
    setInput("");

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setStreaming(true);
    setStreamingText("");

    try {
      const res = await fetch(`/api/openai/conversations/${activeId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const json = JSON.parse(line.slice(6));
            if (json.content) {
              full += json.content;
              setStreamingText(full);
            }
            if (json.done) {
              const assistantMsg: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content: full,
                createdAt: new Date().toISOString(),
              };
              setMessages(prev => [...prev, assistantMsg]);
              setStreamingText("");
              setStreaming(false);
            }
          } catch {}
        }
      }
    } catch {
      const errMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "エラーが発生しました。もう一度試してください。\n(An error occurred, please try again.)",
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errMsg]);
      setStreaming(false);
      setStreamingText("");
    }
  }, [input, activeId, streaming]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const activeConv = conversations.find(c => c.id === activeId);

  return (
    <div className="flex h-[calc(100dvh-0px)] md:h-[calc(100dvh-0px)] overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {(showSidebar || window.innerWidth >= 768) && (
          <motion.div
            key="sidebar"
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full md:w-72 shrink-0 border-r border-border bg-card flex flex-col absolute md:relative z-10 h-full"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-foreground">AI Tutor</h2>
              </div>
              <button
                onClick={newConversation}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" /> New
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {conversations.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No conversations yet.</p>
                  <p>Start a new chat to practice Japanese!</p>
                </div>
              )}
              {[...conversations].reverse().map(conv => (
                <button
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between group transition-all ${
                    activeId === conv.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${activeId === conv.id ? "text-primary-foreground" : ""}`}>
                      {conv.title}
                    </p>
                    <p className={`text-xs mt-0.5 ${activeId === conv.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {new Date(conv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={e => deleteConversation(conv.id, e)}
                    className={`opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-all hover:bg-destructive/20 ${activeId === conv.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-border text-xs text-muted-foreground text-center">
              Practice Japanese freely — your tutor corrects grammar and explains naturally.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header */}
        <div className="shrink-0 border-b border-border px-4 py-3 flex items-center gap-3 bg-card">
          {activeId && (
            <button
              onClick={() => setShowSidebar(true)}
              className="md:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground truncate">
              {activeConv?.title ?? "Japanese AI Tutor"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {activeId ? "Type Japanese or English — your tutor responds and corrects" : "Select or start a conversation"}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {!activeId && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-6 max-w-md mx-auto">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
                <span className="font-jp text-4xl font-bold text-primary">語</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Start Chatting in Japanese</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Write anything in Japanese — or even English — and your AI tutor will reply, correct mistakes gently, show furigana, and ask follow-up questions.
                </p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-left text-sm space-y-2 w-full">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Try saying...</p>
                {["今日は天気がいいですね。", "私は毎日日本語を勉強します。", "What does 食べる mean?"].map(s => (
                  <p key={s} className="font-jp text-foreground">・{s}</p>
                ))}
              </div>
              <button
                onClick={newConversation}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Start New Conversation
              </button>
            </div>
          )}

          {activeId && loading && (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {activeId && !loading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-3">
              <MessageCircle className="w-12 h-12 opacity-20" />
              <p className="text-sm">Send your first message to start the conversation!</p>
              <p className="font-jp text-primary text-lg">日本語で話しましょう！</p>
            </div>
          )}

          {messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {streaming && streamingText && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start mb-4"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-jp font-bold text-sm mr-2 shrink-0 mt-1">
                語
              </div>
              <div className="max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed bg-card border border-border text-foreground whitespace-pre-wrap">
                {renderContent(streamingText)}
                <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse rounded-sm" />
              </div>
            </motion.div>
          )}

          {streaming && !streamingText && (
            <div className="flex justify-start mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-jp font-bold text-sm mr-2 shrink-0 mt-1">
                語
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {activeId && (
          <div className="shrink-0 border-t border-border p-3 bg-card">
            <div className="flex gap-2 items-end max-w-3xl mx-auto">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={streaming}
                placeholder="日本語で入力してください... (or type in English)"
                rows={1}
                className="flex-1 resize-none bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 font-jp max-h-32 overflow-y-auto"
                style={{ lineHeight: "1.5" }}
                onInput={e => {
                  const t = e.currentTarget;
                  t.style.height = "auto";
                  t.style.height = Math.min(t.scrollHeight, 128) + "px";
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || streaming}
                className="w-11 h-11 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2">Enter to send · Shift+Enter for new line</p>
          </div>
        )}
      </div>
    </div>
  );
}
