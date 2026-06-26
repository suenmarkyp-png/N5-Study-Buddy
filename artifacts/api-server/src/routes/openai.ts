import { Router } from "express";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();

const SYSTEM_PROMPT = `You are a friendly Japanese language tutor specializing in JLPT N5 level. 
The student is learning Japanese at beginner level.

When the student writes in Japanese:
1. Praise any effort warmly but concisely
2. If there are grammar mistakes, gently correct them and explain why (in English)
3. Provide furigana for kanji using this format: 漢字[かんじ]
4. Give an English translation
5. Ask a natural follow-up question in Japanese (simple N5 level) to continue the conversation

When the student writes in English:
- Respond in simple Japanese with furigana, then English translation
- Encourage them to try replying in Japanese

Keep responses concise and encouraging. Use simple N5 vocabulary.
Format corrections clearly, e.g.:
より自然な言い方: [corrected sentence]
理由: [explanation in English]

Always end with a question to keep the conversation going.`;

// List conversations
router.get("/openai/conversations", async (req, res) => {
  const rows = await db
    .select()
    .from(conversations)
    .orderBy(asc(conversations.createdAt));
  res.json(rows);
});

// Create conversation
router.post("/openai/conversations", async (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "title is required" });
    return;
  }
  const [conv] = await db
    .insert(conversations)
    .values({ title })
    .returning();
  res.status(201).json(conv);
});

// Get conversation with messages
router.get("/openai/conversations/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "invalid id" }); return; }

  const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
  if (!conv) { res.status(404).json({ error: "not found" }); return; }

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(asc(messages.createdAt));

  res.json({ ...conv, messages: msgs });
});

// Delete conversation
router.delete("/openai/conversations/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "invalid id" }); return; }

  const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
  if (!conv) { res.status(404).json({ error: "not found" }); return; }

  await db.delete(conversations).where(eq(conversations.id, id));
  res.status(204).end();
});

// Send message (SSE streaming)
router.post("/openai/conversations/:id/messages", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "invalid id" }); return; }

  const { content } = req.body;
  if (!content || typeof content !== "string") {
    res.status(400).json({ error: "content is required" });
    return;
  }

  const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
  if (!conv) { res.status(404).json({ error: "not found" }); return; }

  // Save user message
  await db.insert(messages).values({ conversationId: id, role: "user", content });

  // Load history for context
  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(asc(messages.createdAt));

  const chatMessages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    ...history.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
  ];

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 1024,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const c = chunk.choices[0]?.delta?.content;
      if (c) {
        fullResponse += c;
        res.write(`data: ${JSON.stringify({ content: c })}\n\n`);
      }
    }

    // Save assistant message
    await db.insert(messages).values({ conversationId: id, role: "assistant", content: fullResponse });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error(err, "OpenAI stream error");
    res.write(`data: ${JSON.stringify({ error: "AI error, please try again" })}\n\n`);
    res.end();
  }
});

export default router;
