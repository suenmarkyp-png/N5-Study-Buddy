import { Word } from "@/data/vocab";

// Converts て-form kana/romaji to た-form by replacing final て→た, で→だ
function teToTa(kana: string, romaji: string, rule: string): TeForm {
  const taKana = kana.endsWith('で')
    ? kana.slice(0, -1) + 'だ'
    : kana.slice(0, -1) + 'た';
  const taRomaji = romaji.endsWith('de')
    ? romaji.slice(0, -2) + 'da'
    : romaji.slice(0, -2) + 'ta';
  const taRule = rule.replace('て', 'た').replace('で', 'だ')
    .replace('te', 'ta').replace('de', 'da')
    .replace('shite', 'shita').replace('ite', 'ita').replace('ide', 'ida')
    .replace('nde', 'nda').replace('tte', 'tta').replace('kite', 'kita');
  return { kana: taKana, romaji: taRomaji, rule: taRule };
}

export interface TeForm {
  kana: string;
  romaji: string;
  rule: string;
}

const KANA_ROMAJI_LEN: Record<string, number> = {
  'う': 1, 'つ': 3, 'る': 2,
  'む': 2, 'ぶ': 2, 'ぬ': 2,
  'く': 2, 'ぐ': 2, 'す': 2,
};

export function getTeForm(word: Word): TeForm | null {
  const { kana, romaji, verbGroup } = word;
  if (!verbGroup) return null;

  if (verbGroup === 'irregular') {
    if (kana.endsWith('する')) {
      const base = kana.slice(0, -2);
      const romajiBase = romaji.slice(0, -4);
      return {
        kana: base + 'して',
        romaji: romajiBase + 'shite',
        rule: 'する → して (irregular)',
      };
    }
    if (kana === 'くる') {
      return { kana: 'きて', romaji: 'kite', rule: 'くる → きて (irregular)' };
    }
    return null;
  }

  if (verbGroup === 'ichidan') {
    const base = kana.slice(0, -1);
    const romajiBase = romaji.slice(0, -2);
    return {
      kana: base + 'て',
      romaji: romajiBase + 'te',
      rule: 'る-verb (ichidan): drop る → add て',
    };
  }

  // Godan
  if (kana === 'いく') {
    return { kana: 'いって', romaji: 'itte', rule: '行く exception: いく → いって' };
  }

  const lastKana = kana.slice(-1);
  const kanaBase = kana.slice(0, -1);
  const romajiDrop = KANA_ROMAJI_LEN[lastKana] ?? 2;
  const romajiBase = romaji.slice(0, -romajiDrop);

  switch (lastKana) {
    case 'う':
    case 'つ':
    case 'る':
      return {
        kana: kanaBase + 'って',
        romaji: romajiBase + 'tte',
        rule: 'う/つ/る → って',
      };
    case 'む':
    case 'ぶ':
    case 'ぬ':
      return {
        kana: kanaBase + 'んで',
        romaji: romajiBase + 'nde',
        rule: 'む/ぶ/ぬ → んで',
      };
    case 'く':
      return {
        kana: kanaBase + 'いて',
        romaji: romajiBase + 'ite',
        rule: 'く → いて',
      };
    case 'ぐ':
      return {
        kana: kanaBase + 'いで',
        romaji: romajiBase + 'ide',
        rule: 'ぐ → いで',
      };
    case 'す':
      return {
        kana: kanaBase + 'して',
        romaji: romajiBase + 'shite',
        rule: 'す → して',
      };
    default:
      return null;
  }
}

export function getTaForm(word: Word): TeForm | null {
  const tf = getTeForm(word);
  if (!tf) return null;
  return teToTa(tf.kana, tf.romaji, tf.rule);
}

// ない-form: godan changes last kana to あ-row + ない (う→わ is a special exception)
const GODAN_NAI: Record<string, { kana: string; romajiDrop: number; romajiAdd: string; rule: string }> = {
  'う': { kana: 'わない', romajiDrop: 1,  romajiAdd: 'wanai',  rule: 'う → わない (u→wanai)' },
  'つ': { kana: 'たない', romajiDrop: 3,  romajiAdd: 'tanai',  rule: 'つ → たない (tsu→tanai)' },
  'る': { kana: 'らない', romajiDrop: 2,  romajiAdd: 'ranai',  rule: 'る (godan) → らない (ru→ranai)' },
  'む': { kana: 'まない', romajiDrop: 2,  romajiAdd: 'manai',  rule: 'む → まない (mu→manai)' },
  'ぶ': { kana: 'ばない', romajiDrop: 2,  romajiAdd: 'banai',  rule: 'ぶ → ばない (bu→banai)' },
  'ぬ': { kana: 'なない', romajiDrop: 2,  romajiAdd: 'nanai',  rule: 'ぬ → なない (nu→nanai)' },
  'く': { kana: 'かない', romajiDrop: 2,  romajiAdd: 'kanai',  rule: 'く → かない (ku→kanai)' },
  'ぐ': { kana: 'がない', romajiDrop: 2,  romajiAdd: 'ganai',  rule: 'ぐ → がない (gu→ganai)' },
  'す': { kana: 'さない', romajiDrop: 2,  romajiAdd: 'sanai',  rule: 'す → さない (su→sanai)' },
};

export function getNaiForm(word: Word): TeForm | null {
  const { kana, romaji, verbGroup } = word;
  if (!verbGroup) return null;

  if (verbGroup === 'irregular') {
    if (kana.endsWith('する')) {
      const base = kana.slice(0, -2);
      const romajiBase = romaji.slice(0, -4);
      return { kana: base + 'しない', romaji: romajiBase + 'shinai', rule: 'する → しない (suru→shinai)' };
    }
    if (kana === 'くる') {
      return { kana: 'こない', romaji: 'konai', rule: 'くる → こない (kuru→konai)' };
    }
    return null;
  }

  if (verbGroup === 'ichidan') {
    return {
      kana: kana.slice(0, -1) + 'ない',
      romaji: romaji.slice(0, -2) + 'nai',
      rule: 'る-verb (ichidan): drop る → add ない',
    };
  }

  // Godan
  const lastKana = kana.slice(-1);
  const map = GODAN_NAI[lastKana];
  if (!map) return null;
  return {
    kana: kana.slice(0, -1) + map.kana,
    romaji: romaji.slice(0, -map.romajiDrop) + map.romajiAdd,
    rule: map.rule,
  };
}
