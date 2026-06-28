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

// まず-form (masu): godan changes last kana from う-row → い-row + ます
const GODAN_MASU: Record<string, { kana: string; romajiDrop: number; romajiAdd: string; rule: string }> = {
  'う': { kana: 'います', romajiDrop: 1,  romajiAdd: 'imasu',   rule: 'う → います (u→imasu)' },
  'つ': { kana: 'ちます', romajiDrop: 3,  romajiAdd: 'chimasu', rule: 'つ → ちます (tsu→chimasu)' },
  'る': { kana: 'ります', romajiDrop: 2,  romajiAdd: 'rimasu',  rule: 'る (godan) → ります (ru→rimasu)' },
  'む': { kana: 'みます', romajiDrop: 2,  romajiAdd: 'mimasu',  rule: 'む → みます (mu→mimasu)' },
  'ぶ': { kana: 'びます', romajiDrop: 2,  romajiAdd: 'bimasu',  rule: 'ぶ → びます (bu→bimasu)' },
  'ぬ': { kana: 'にます', romajiDrop: 2,  romajiAdd: 'nimasu',  rule: 'ぬ → にます (nu→nimasu)' },
  'く': { kana: 'きます', romajiDrop: 2,  romajiAdd: 'kimasu',  rule: 'く → きます (ku→kimasu)' },
  'ぐ': { kana: 'ぎます', romajiDrop: 2,  romajiAdd: 'gimasu',  rule: 'ぐ → ぎます (gu→gimasu)' },
  'す': { kana: 'します', romajiDrop: 2,  romajiAdd: 'shimasu', rule: 'す → します (su→shimasu)' },
};

export function getMasuForm(word: Word): TeForm | null {
  const { kana, romaji, verbGroup } = word;
  if (!verbGroup) return null;

  if (verbGroup === 'irregular') {
    if (kana.endsWith('する')) {
      const base = kana.slice(0, -2);
      const romajiBase = romaji.slice(0, -4);
      return { kana: base + 'します', romaji: romajiBase + 'shimasu', rule: 'する → します (suru→shimasu)' };
    }
    if (kana === 'くる') {
      return { kana: 'きます', romaji: 'kimasu', rule: 'くる → きます (kuru→kimasu)' };
    }
    return null;
  }

  if (verbGroup === 'ichidan') {
    return {
      kana: kana.slice(0, -1) + 'ます',
      romaji: romaji.slice(0, -2) + 'masu',
      rule: 'る-verb (ichidan): drop る → add ます',
    };
  }

  // Godan
  const lastKana = kana.slice(-1);
  const map = GODAN_MASU[lastKana];
  if (!map) return null;
  return {
    kana: kana.slice(0, -1) + map.kana,
    romaji: romaji.slice(0, -map.romajiDrop) + map.romajiAdd,
    rule: map.rule,
  };
}

// Passive form (受け身): godan changes last kana to あ-row + れる (う→わ special case)
const GODAN_PASSIVE: Record<string, { kana: string; romajiDrop: number; romajiAdd: string; rule: string }> = {
  'う': { kana: 'われる', romajiDrop: 1,  romajiAdd: 'wareru',  rule: 'う → われる (u→wareru)' },
  'つ': { kana: 'たれる', romajiDrop: 3,  romajiAdd: 'tareru',  rule: 'つ → たれる (tsu→tareru)' },
  'る': { kana: 'られる', romajiDrop: 2,  romajiAdd: 'rareru',  rule: 'る (godan) → られる (ru→rareru)' },
  'む': { kana: 'まれる', romajiDrop: 2,  romajiAdd: 'mareru',  rule: 'む → まれる (mu→mareru)' },
  'ぶ': { kana: 'ばれる', romajiDrop: 2,  romajiAdd: 'bareru',  rule: 'ぶ → ばれる (bu→bareru)' },
  'ぬ': { kana: 'なれる', romajiDrop: 2,  romajiAdd: 'nareru',  rule: 'ぬ → なれる (nu→nareru)' },
  'く': { kana: 'かれる', romajiDrop: 2,  romajiAdd: 'kareru',  rule: 'く → かれる (ku→kareru)' },
  'ぐ': { kana: 'がれる', romajiDrop: 2,  romajiAdd: 'gareru',  rule: 'ぐ → がれる (gu→gareru)' },
  'す': { kana: 'される', romajiDrop: 2,  romajiAdd: 'sareru',  rule: 'す → される (su→sareru)' },
};

export function getPassiveForm(word: Word): TeForm | null {
  const { kana, romaji, verbGroup } = word;
  if (!verbGroup) return null;

  if (verbGroup === 'irregular') {
    if (kana.endsWith('する')) {
      const base = kana.slice(0, -2);
      const romajiBase = romaji.slice(0, -4);
      return { kana: base + 'される', romaji: romajiBase + 'sareru', rule: 'する → される (suru→sareru)' };
    }
    if (kana === 'くる') {
      return { kana: 'こられる', romaji: 'korareru', rule: 'くる → こられる (kuru→korareru)' };
    }
    return null;
  }

  if (verbGroup === 'ichidan') {
    return {
      kana: kana.slice(0, -1) + 'られる',
      romaji: romaji.slice(0, -2) + 'rareru',
      rule: 'る-verb (ichidan): drop る → add られる',
    };
  }

  // Godan
  const lastKana = kana.slice(-1);
  const map = GODAN_PASSIVE[lastKana];
  if (!map) return null;
  return {
    kana: kana.slice(0, -1) + map.kana,
    romaji: romaji.slice(0, -map.romajiDrop) + map.romajiAdd,
    rule: map.rule,
  };
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
