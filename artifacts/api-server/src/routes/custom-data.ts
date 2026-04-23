import { Router, type IRouter, type Request, type Response } from "express";
import { pool } from "@workspace/db";

const router: IRouter = Router();

const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

router.get("/custom-data", async (_req, res) => {
  try {
    const [fc, vo, gr, ph, del] = await Promise.all([
      pool.query("SELECT * FROM custom_flashcards ORDER BY created_at"),
      pool.query("SELECT * FROM custom_vocab ORDER BY created_at"),
      pool.query("SELECT * FROM custom_grammar ORDER BY created_at"),
      pool.query("SELECT * FROM custom_phrases ORDER BY created_at"),
      pool.query("SELECT section, entry_id FROM deleted_entries"),
    ]);
    res.json({
      flashcards: fc.rows.map((r) => ({
        id: r.id,
        kanji: r.kanji,
        kana: r.kana,
        romaji: r.romaji,
        meaning: r.meaning,
        type: r.type,
        verbGroup: r.verb_group ?? undefined,
        example: { jp: r.example_jp, romaji: r.example_romaji, en: r.example_en },
      })),
      vocab: vo.rows.map((r) => ({
        id: r.id,
        kanji: r.kanji,
        kana: r.kana,
        romaji: r.romaji,
        meaning: r.meaning,
        type: r.type,
        category: r.category ?? undefined,
        example: { jp: r.example_jp, romaji: r.example_romaji, en: r.example_en },
      })),
      grammar: gr.rows.map((r) => ({
        id: r.id,
        pattern: r.pattern,
        romaji: r.romaji,
        meaning: r.meaning,
        explanation: r.explanation,
        examples: [{ jp: r.example_jp, romaji: r.example_romaji, en: r.example_en }],
        notes: r.notes ?? "",
      })),
      phrases: ph.rows.map((r) => ({
        id: r.id,
        jp: r.jp,
        romaji: r.romaji,
        en: r.en,
        category: r.category,
        note: r.note ?? "",
      })),
      deleted: {
        flashcards: del.rows
          .filter((d) => d.section === "flashcards")
          .map((d) => d.entry_id),
        vocab: del.rows
          .filter((d) => d.section === "vocab")
          .map((d) => d.entry_id),
        grammar: del.rows
          .filter((d) => d.section === "grammar")
          .map((d) => d.entry_id),
        phrases: del.rows
          .filter((d) => d.section === "phrases")
          .map((d) => d.entry_id),
      },
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

const requireFields = (
  body: Record<string, unknown>,
  keys: string[],
  res: Response,
): boolean => {
  for (const k of keys) {
    const v = body[k];
    if (typeof v !== "string" || !v.trim()) {
      res.status(400).json({ error: `Missing field: ${k}` });
      return false;
    }
  }
  return true;
};

router.post("/custom-data/flashcards", async (req: Request, res: Response) => {
  const b = req.body ?? {};
  if (
    !requireFields(
      b,
      ["kanji", "kana", "romaji", "meaning", "type", "exJp", "exRomaji", "exEn"],
      res,
    )
  )
    return;
  const id = newId("uf");
  try {
    await pool.query(
      `INSERT INTO custom_flashcards (id, kanji, kana, romaji, meaning, type, verb_group, example_jp, example_romaji, example_en)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        id,
        b.kanji,
        b.kana,
        b.romaji,
        b.meaning,
        b.type,
        b.verbGroup || null,
        b.exJp,
        b.exRomaji,
        b.exEn,
      ],
    );
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/custom-data/vocab", async (req, res) => {
  const b = req.body ?? {};
  if (
    !requireFields(
      b,
      [
        "kanji",
        "kana",
        "romaji",
        "meaning",
        "type",
        "category",
        "exJp",
        "exRomaji",
        "exEn",
      ],
      res,
    )
  )
    return;
  const id = newId("uv");
  try {
    await pool.query(
      `INSERT INTO custom_vocab (id, kanji, kana, romaji, meaning, type, category, example_jp, example_romaji, example_en)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        id,
        b.kanji,
        b.kana,
        b.romaji,
        b.meaning,
        b.type,
        b.category,
        b.exJp,
        b.exRomaji,
        b.exEn,
      ],
    );
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/custom-data/grammar", async (req, res) => {
  const b = req.body ?? {};
  if (
    !requireFields(
      b,
      ["pattern", "romaji", "meaning", "explanation", "exJp", "exRomaji", "exEn"],
      res,
    )
  )
    return;
  const id = newId("ug");
  try {
    await pool.query(
      `INSERT INTO custom_grammar (id, pattern, romaji, meaning, explanation, example_jp, example_romaji, example_en, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        id,
        b.pattern,
        b.romaji,
        b.meaning,
        b.explanation,
        b.exJp,
        b.exRomaji,
        b.exEn,
        b.notes || "",
      ],
    );
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/custom-data/phrases", async (req, res) => {
  const b = req.body ?? {};
  if (!requireFields(b, ["jp", "romaji", "en", "category"], res)) return;
  const id = newId("up");
  try {
    await pool.query(
      `INSERT INTO custom_phrases (id, jp, romaji, en, category, note)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [id, b.jp, b.romaji, b.en, b.category, b.note || ""],
    );
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

const SECTION_TABLE: Record<string, string> = {
  flashcards: "custom_flashcards",
  vocab: "custom_vocab",
  grammar: "custom_grammar",
  phrases: "custom_phrases",
};

const SECTION_PREFIX: Record<string, string> = {
  flashcards: "uf-",
  vocab: "uv-",
  grammar: "ug-",
  phrases: "up-",
};

router.delete(
  "/custom-data/:section/:id",
  async (req: Request, res: Response) => {
    const { section, id } = req.params;
    const table = SECTION_TABLE[section];
    if (!table) {
      res.status(400).json({ error: "Invalid section" });
      return;
    }
    try {
      if (id.startsWith(SECTION_PREFIX[section])) {
        await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
      } else {
        await pool.query(
          `INSERT INTO deleted_entries (section, entry_id) VALUES ($1,$2)
           ON CONFLICT DO NOTHING`,
          [section, id],
        );
      }
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  },
);

export default router;
