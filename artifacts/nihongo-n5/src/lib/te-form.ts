import { Word } from "@/data/vocab";

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
