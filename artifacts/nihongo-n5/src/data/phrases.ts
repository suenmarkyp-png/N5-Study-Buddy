export interface Phrase {
  id: string;
  jp: string;
  romaji: string;
  en: string;
  note: string;
  category: string;
}

export const phraseCategories = [
  'Greetings', 'Self-Introduction', 'Restaurant', 'Shopping', 'Directions', 'Apologies & Thanks', 'Classroom'
];

export const phrases: Phrase[] = [
  // Greetings
  { id: 'p1', jp: 'おはようございます。', romaji: 'Ohayou gozaimasu.', en: 'Good morning.', note: 'Polite. Say just "Ohayou" to friends/family.', category: 'Greetings' },
  { id: 'p2', jp: 'こんにちは。', romaji: 'Konnichiwa.', en: 'Good afternoon / Hello.', note: 'Standard daytime greeting.', category: 'Greetings' },
  { id: 'p3', jp: 'こんばんは。', romaji: 'Konbanwa.', en: 'Good evening.', note: 'Used after the sun goes down.', category: 'Greetings' },
  { id: 'p4', jp: 'おやすみなさい。', romaji: 'Oyasumi nasai.', en: 'Good night.', note: 'Said before going to sleep.', category: 'Greetings' },
  { id: 'p5', jp: 'さようなら。', romaji: 'Sayounara.', en: 'Goodbye.', note: 'Usually used when you won\'t see the person for a while.', category: 'Greetings' },
  { id: 'p6', jp: 'じゃあ、また。', romaji: 'Jaa, mata.', en: 'See you later.', note: 'Casual. Used with friends.', category: 'Greetings' },

  // Self-Introduction
  { id: 'p7', jp: '初めまして。', romaji: 'Hajimemashite.', en: 'Nice to meet you.', note: 'Said at the very beginning of a first meeting.', category: 'Self-Introduction' },
  { id: 'p8', jp: '私は〜です。', romaji: 'Watashi wa ~ desu.', en: 'I am ~.', note: 'Used to state your name.', category: 'Self-Introduction' },
  { id: 'p9', jp: '〜から来ました。', romaji: '~ kara kimashita.', en: 'I come from ~.', note: 'Used to state your home country/city.', category: 'Self-Introduction' },
  { id: 'p10', jp: 'よろしくお願いします。', romaji: 'Yoroshiku onegaishimasu.', en: 'Please treat me well.', note: 'Essential phrase said at the end of an introduction.', category: 'Self-Introduction' },

  // Restaurant
  { id: 'p11', jp: 'すみません。', romaji: 'Sumimasen.', en: 'Excuse me.', note: 'Used to call a waiter/staff member.', category: 'Restaurant' },
  { id: 'p12', jp: 'メニューをお願いします。', romaji: 'Menyuu o onegaishimasu.', en: 'Menu, please.', note: 'Polite request.', category: 'Restaurant' },
  { id: 'p13', jp: 'これをください。', romaji: 'Kore o kudasai.', en: 'I will have this.', note: 'Point at the menu while saying this.', category: 'Restaurant' },
  { id: 'p14', jp: '水をお願いします。', romaji: 'Mizu o onegaishimasu.', en: 'Water, please.', note: 'Often free in Japanese restaurants.', category: 'Restaurant' },
  { id: 'p15', jp: 'いただきます。', romaji: 'Itadakimasu.', en: 'Let\'s eat.', note: 'Said before starting to eat to express gratitude.', category: 'Restaurant' },
  { id: 'p16', jp: 'ごちそうさまでした。', romaji: 'Gochisousama deshita.', en: 'Thank you for the meal.', note: 'Said after finishing the meal.', category: 'Restaurant' },
  { id: 'p17', jp: 'お会計をお願いします。', romaji: 'Okaikei o onegaishimasu.', en: 'Check, please.', note: 'Usually done at the register, not the table.', category: 'Restaurant' },

  // Shopping
  { id: 'p18', jp: 'いらっしゃいませ。', romaji: 'Irasshaimase.', en: 'Welcome (to the store).', note: 'Said by store clerks. No reply needed.', category: 'Shopping' },
  { id: 'p19', jp: 'これはいくらですか。', romaji: 'Kore wa ikura desu ka.', en: 'How much is this?', note: 'Essential shopping phrase.', category: 'Shopping' },
  { id: 'p20', jp: 'カードは使えますか。', romaji: 'Kaado wa tsukaemasu ka.', en: 'Can I use a credit card?', note: 'Japan is still somewhat cash-based.', category: 'Shopping' },
  { id: 'p21', jp: 'これをお願いします。', romaji: 'Kore o onegaishimasu.', en: 'I\'ll take this.', note: 'Polite way to say you want to buy it.', category: 'Shopping' },
  { id: 'p22', jp: '袋は要りません。', romaji: 'Fukuro wa irimasen.', en: 'I don\'t need a bag.', note: 'Plastic bags often cost a few yen now.', category: 'Shopping' },

  // Directions
  { id: 'p23', jp: '〜はどこですか。', romaji: '~ wa doko desu ka.', en: 'Where is ~?', note: 'e.g., Toire wa doko desu ka (Where is the toilet?).', category: 'Directions' },
  { id: 'p24', jp: 'まっすぐ行ってください。', romaji: 'Massugu itte kudasai.', en: 'Please go straight.', note: 'Common response when asking for directions.', category: 'Directions' },
  { id: 'p25', jp: '右に曲がってください。', romaji: 'Migi ni magatte kudasai.', en: 'Please turn right.', note: 'Migi = right, Hidari = left.', category: 'Directions' },
  { id: 'p26', jp: '左に曲がってください。', romaji: 'Hidari ni magatte kudasai.', en: 'Please turn left.', note: 'Migi = right, Hidari = left.', category: 'Directions' },
  { id: 'p27', jp: '駅までどのくらいかかりますか。', romaji: 'Eki made dono kurai kakarimasu ka.', en: 'How long does it take to the station?', note: 'Useful for travel planning.', category: 'Directions' },

  // Apologies & Thanks
  { id: 'p28', jp: 'ありがとうございます。', romaji: 'Arigatou gozaimasu.', en: 'Thank you very much.', note: 'Polite expression of gratitude.', category: 'Apologies & Thanks' },
  { id: 'p29', jp: 'どういたしまして。', romaji: 'Dou itashimashite.', en: 'You\'re welcome.', note: 'Standard reply to thank you.', category: 'Apologies & Thanks' },
  { id: 'p30', jp: 'すみません。', romaji: 'Sumimasen.', en: 'I\'m sorry / Excuse me.', note: 'Extremely versatile. Can be an apology or a way to get attention.', category: 'Apologies & Thanks' },
  { id: 'p31', jp: 'ごめんなさい。', romaji: 'Gomen nasai.', en: 'I am sorry.', note: 'More personal apology than sumimasen.', category: 'Apologies & Thanks' },
  { id: 'p32', jp: '大丈夫です。', romaji: 'Daijoubu desu.', en: 'It\'s okay / No problem.', note: 'Used to reassure someone, or to politely decline.', category: 'Apologies & Thanks' },

  // Classroom
  { id: 'p33', jp: 'わかりません。', romaji: 'Wakarimasen.', en: 'I don\'t understand.', note: 'Crucial for beginners.', category: 'Classroom' },
  { id: 'p34', jp: 'もう一度お願いします。', romaji: 'Mou ichido onegaishimasu.', en: 'One more time, please.', note: 'When you need someone to repeat themselves.', category: 'Classroom' },
  { id: 'p35', jp: 'ゆっくり話してください。', romaji: 'Yukkuri hanashite kudasai.', en: 'Please speak slowly.', note: 'Very useful when native speakers are too fast.', category: 'Classroom' },
  { id: 'p36', jp: '「〜」は英語で何ですか。', romaji: '"~" wa eigo de nan desu ka.', en: 'What is "~" in English?', note: 'To ask the meaning of a Japanese word.', category: 'Classroom' },
  { id: 'p37', jp: '「〜」は日本語で何ですか。', romaji: '"~" wa nihongo de nan desu ka.', en: 'What is "~" in Japanese?', note: 'To ask how to say an English word in Japanese.', category: 'Classroom' }
];
