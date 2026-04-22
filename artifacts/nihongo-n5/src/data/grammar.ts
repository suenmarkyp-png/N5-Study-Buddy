export interface GrammarPoint {
  id: string;
  pattern: string;
  romaji: string;
  meaning: string;
  explanation: string;
  examples: {
    jp: string;
    romaji: string;
    en: string;
  }[];
  notes: string;
}

export const grammarPoints: GrammarPoint[] = [
  {
    id: 'g1',
    pattern: '〜です / 〜だ',
    romaji: '~ desu / ~ da',
    meaning: 'To be (am, is, are)',
    explanation: 'The copula used to state what something is. "desu" is polite, "da" is casual.',
    examples: [
      { jp: '私は学生です。', romaji: 'Watashi wa gakusei desu.', en: 'I am a student.' },
      { jp: 'これは本です。', romaji: 'Kore wa hon desu.', en: 'This is a book.' },
      { jp: '明日は休みだ。', romaji: 'Ashita wa yasumi da.', en: 'Tomorrow is a day off. (Casual)' }
    ],
    notes: 'In negative form, "desu" becomes "ja arimasen" (polite) or "ja nai" (casual).'
  },
  {
    id: 'g2',
    pattern: '〜は',
    romaji: '~ wa',
    meaning: 'Topic marker',
    explanation: 'Marks the topic of the sentence. Pronounced "wa" but written with the hiragana "ha".',
    examples: [
      { jp: '私は田中です。', romaji: 'Watashi wa Tanaka desu.', en: 'I am Tanaka. (As for me, I am Tanaka)' },
      { jp: '今日は暑いです。', romaji: 'Kyou wa atsui desu.', en: 'Today is hot.' }
    ],
    notes: 'The topic can be the subject, but it can also be the object, time, or location.'
  },
  {
    id: 'g3',
    pattern: '〜が',
    romaji: '~ ga',
    meaning: 'Subject marker',
    explanation: 'Marks the grammatical subject of the sentence, particularly when emphasizing the subject or introducing new information.',
    examples: [
      { jp: '犬が好きです。', romaji: 'Inu ga suki desu.', en: 'I like dogs. (Dogs are liked)' },
      { jp: '雨が降っています。', romaji: 'Ame ga futte imasu.', en: 'It is raining. (Rain is falling)' }
    ],
    notes: 'Often used with verbs of existence (iru, aru) and adjectives expressing likes/dislikes (suki, kirai).'
  },
  {
    id: 'g4',
    pattern: '〜を',
    romaji: '~ o',
    meaning: 'Direct object marker',
    explanation: 'Marks the direct object of an action verb. Pronounced "o" but written with "wo".',
    examples: [
      { jp: 'ご飯を食べます。', romaji: 'Gohan o tabemasu.', en: 'I eat a meal.' },
      { jp: '本を読みます。', romaji: 'Hon o yomimasu.', en: 'I read a book.' }
    ],
    notes: 'Only used as a particle. Never used in spelling normal words.'
  },
  {
    id: 'g5',
    pattern: '〜に',
    romaji: '~ ni',
    meaning: 'Target / Location / Time marker',
    explanation: 'Used for a variety of functions: destination of movement, location of existence, specific time, or target of an action.',
    examples: [
      { jp: '学校に行きます。', romaji: 'Gakkou ni ikimasu.', en: 'I go to school. (Destination)' },
      { jp: '部屋に猫がいます。', romaji: 'Heya ni neko ga imasu.', en: 'There is a cat in the room. (Location)' },
      { jp: '７時に起きます。', romaji: 'Shichiji ni okimasu.', en: 'I wake up at 7. (Time)' }
    ],
    notes: 'For movement, "e" (へ) can also be used.'
  },
  {
    id: 'g6',
    pattern: '〜で',
    romaji: '~ de',
    meaning: 'Context / Means / Location of action',
    explanation: 'Indicates the place where an action occurs, or the means/tool used to do something.',
    examples: [
      { jp: 'レストランで食べます。', romaji: 'Resutoran de tabemasu.', en: 'I eat at a restaurant. (Location of action)' },
      { jp: 'バスで行きます。', romaji: 'Basu de ikimasu.', en: 'I go by bus. (Means)' },
      { jp: '日本語で話します。', romaji: 'Nihongo de hanashimasu.', en: 'I speak in Japanese. (Means/Context)' }
    ],
    notes: 'Distinguish from "ni" for location: "ni" is for existence (is there), "de" is for action (do there).'
  },
  {
    id: 'g7',
    pattern: '〜へ',
    romaji: '~ e',
    meaning: 'Direction marker',
    explanation: 'Indicates the direction of movement. Pronounced "e" but written with "he". Very similar to "ni" when used for destinations.',
    examples: [
      { jp: '東京へ行きます。', romaji: 'Toukyou e ikimasu.', en: 'I am going to Tokyo.' },
      { jp: '家へ帰ります。', romaji: 'Ie e kaerimasu.', en: 'I return home.' }
    ],
    notes: 'Often interchangeable with "ni" for destination, but "e" focuses slightly more on the path/direction than the endpoint.'
  },
  {
    id: 'g8',
    pattern: '〜の',
    romaji: '~ no',
    meaning: 'Possession / Modification marker',
    explanation: 'Links two nouns. Generally translates to "\'s" or "of". Noun1 + no + Noun2 = Noun1\'s Noun2.',
    examples: [
      { jp: '私の本です。', romaji: 'Watashi no hon desu.', en: 'It is my book.' },
      { jp: '日本語の先生です。', romaji: 'Nihongo no sensei desu.', en: 'A Japanese language teacher.' }
    ],
    notes: 'Can string multiple together: watashi no tomodachi no kuruma (my friend\'s car).'
  },
  {
    id: 'g9',
    pattern: '〜ます',
    romaji: '~ masu',
    meaning: 'Polite verb ending',
    explanation: 'Added to the stem of a verb to make it polite (formal).',
    examples: [
      { jp: '食べます。', romaji: 'Tabemasu.', en: 'I eat. (Polite)' },
      { jp: '行きません。', romaji: 'Ikimasen.', en: 'I do not go. (Polite negative)' },
      { jp: '見ました。', romaji: 'Mimashita.', en: 'I saw. (Polite past)' }
    ],
    notes: 'Always use the -masu form when speaking to strangers, elders, or in formal situations.'
  },
  {
    id: 'g10',
    pattern: '〜て form',
    romaji: '~ te form',
    meaning: 'Connecting form / Requests',
    explanation: 'A versatile verb form used to connect actions, make requests (with kudasai), or express ongoing states (with imasu).',
    examples: [
      { jp: '食べて、飲みます。', romaji: 'Tabete, nomimasu.', en: 'I eat and drink.' },
      { jp: '待ってください。', romaji: 'Matte kudasai.', en: 'Please wait.' },
      { jp: '新聞を読んでいます。', romaji: 'Shinbun o yonde imasu.', en: 'I am reading the newspaper.' }
    ],
    notes: 'Conjugation depends on the verb group. Godan verbs have complex rules (e.g. u,tsu,ru -> tte).'
  },
  {
    id: 'g11',
    pattern: '〜ない form',
    romaji: '~ nai form',
    meaning: 'Casual negative verb form',
    explanation: 'The casual way to say you don\'t do something. Used as a base for many grammatical structures.',
    examples: [
      { jp: '行かない。', romaji: 'Ikanai.', en: 'I will not go.' },
      { jp: '食べないでください。', romaji: 'Tabenaide kudasai.', en: 'Please do not eat.' }
    ],
    notes: 'Ichidan: drop -ru, add -nai (taberu -> tabenai). Godan: change u-vowel to a-vowel, add -nai (iku -> ikanai).'
  },
  {
    id: 'g12',
    pattern: 'Past tense (た form)',
    romaji: 'Past tense (~ta form)',
    meaning: 'Casual past verb form',
    explanation: 'The casual past tense of a verb. Conjugates exactly like the -te form, but with "ta" or "da" instead of "te" or "de".',
    examples: [
      { jp: '昨日、映画を見た。', romaji: 'Kinou, eiga o mita.', en: 'Yesterday, I saw a movie.' },
      { jp: '寿司を食べた。', romaji: 'Sushi o tabeta.', en: 'I ate sushi.' }
    ],
    notes: 'Used in casual speech, and as a modifier for nouns (e.g., the book I read = yonda hon).'
  },
  {
    id: 'g13',
    pattern: '〜たい',
    romaji: '~ tai',
    meaning: 'Want to do',
    explanation: 'Attached to the verb stem to express desire. Acts like an i-adjective.',
    examples: [
      { jp: '日本に行きたいです。', romaji: 'Nihon ni ikitai desu.', en: 'I want to go to Japan.' },
      { jp: '何も食べたくないです。', romaji: 'Nani mo tabetakunai desu.', en: 'I don\'t want to eat anything.' }
    ],
    notes: 'You can use "ga" or "o" for the object of desire. "Nihon e ikitai" is also correct.'
  },
  {
    id: 'g14',
    pattern: '〜から',
    romaji: '~ kara',
    meaning: 'Because / From',
    explanation: 'Indicates the reason for something, or a starting point.',
    examples: [
      { jp: '忙しいですから、行きません。', romaji: 'Isogashii desu kara, ikimasen.', en: 'Because I am busy, I won\'t go.' },
      { jp: '９時から働きます。', romaji: 'Kuji kara hatarakimasu.', en: 'I work from 9 o\'clock.' }
    ],
    notes: 'As "because", it comes at the END of the reason clause, not the beginning like in English.'
  },
  {
    id: 'g15',
    pattern: '〜が ほしい',
    romaji: '~ ga hoshii',
    meaning: 'Want (an object)',
    explanation: 'Expresses desire for a noun. "hoshii" is an i-adjective.',
    examples: [
      { jp: '新しい車がほしいです。', romaji: 'Atarashii kuruma ga hoshii desu.', en: 'I want a new car.' },
      { jp: '時間がほしい。', romaji: 'Jikan ga hoshii.', en: 'I want time.' }
    ],
    notes: 'Only used for things you want. For actions you want to do, use ~tai instead.'
  }
];
