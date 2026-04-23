export type WordType = 'verb' | 'i-adj' | 'na-adj' | 'noun' | 'expression' | 'kanji';

export interface Word {
  id: string;
  kanji: string;
  kana: string;
  romaji: string;
  meaning: string;
  type: WordType;
  verbGroup?: 'godan' | 'ichidan' | 'irregular';
  category?: string;
  example: {
    jp: string;
    romaji: string;
    en: string;
  };
}

export const flashcardWords: Word[] = [
  // Verbs (Godan)
  { id: 'v1', kanji: '行く', kana: 'いく', romaji: 'iku', meaning: 'to go', type: 'verb', verbGroup: 'godan', example: { jp: '学校に行く', romaji: 'gakkou ni iku', en: 'I go to school' } },
  { id: 'v2', kanji: '飲む', kana: 'のむ', romaji: 'nomu', meaning: 'to drink', type: 'verb', verbGroup: 'godan', example: { jp: '水を飲む', romaji: 'mizu o nomu', en: 'I drink water' } },
  { id: 'v3', kanji: '聞く', kana: 'きく', romaji: 'kiku', meaning: 'to listen / to ask', type: 'verb', verbGroup: 'godan', example: { jp: '音楽を聞く', romaji: 'ongaku o kiku', en: 'I listen to music' } },
  { id: 'v4', kanji: '話す', kana: 'はなす', romaji: 'hanasu', meaning: 'to speak', type: 'verb', verbGroup: 'godan', example: { jp: '日本語を話す', romaji: 'nihongo o hanasu', en: 'I speak Japanese' } },
  { id: 'v5', kanji: '買う', kana: 'かう', romaji: 'kau', meaning: 'to buy', type: 'verb', verbGroup: 'godan', example: { jp: '本を買う', romaji: 'hon o kau', en: 'I buy a book' } },
  { id: 'v6', kanji: '売る', kana: 'うる', romaji: 'uru', meaning: 'to sell', type: 'verb', verbGroup: 'godan', example: { jp: '車を売る', romaji: 'kuruma o uru', en: 'I sell a car' } },
  { id: 'v7', kanji: '書く', kana: 'かく', romaji: 'kaku', meaning: 'to write', type: 'verb', verbGroup: 'godan', example: { jp: '手紙を書く', romaji: 'tegami o kaku', en: 'I write a letter' } },
  { id: 'v8', kanji: '泳ぐ', kana: 'およぐ', romaji: 'oyogu', meaning: 'to swim', type: 'verb', verbGroup: 'godan', example: { jp: '海で泳ぐ', romaji: 'umi de oyogu', en: 'I swim in the sea' } },
  { id: 'v9', kanji: '遊ぶ', kana: 'あそぶ', romaji: 'asobu', meaning: 'to play', type: 'verb', verbGroup: 'godan', example: { jp: '公園で遊ぶ', romaji: 'kouen de asobu', en: 'I play in the park' } },
  { id: 'v10', kanji: '待つ', kana: 'まつ', romaji: 'matsu', meaning: 'to wait', type: 'verb', verbGroup: 'godan', example: { jp: '友達を待つ', romaji: 'tomodachi o matsu', en: 'I wait for a friend' } },
  { id: 'v11', kanji: '帰る', kana: 'かえる', romaji: 'kaeru', meaning: 'to return (home)', type: 'verb', verbGroup: 'godan', example: { jp: '家に帰る', romaji: 'ie ni kaeru', en: 'I return home' } },
  { id: 'v12', kanji: '死ぬ', kana: 'しぬ', romaji: 'shinu', meaning: 'to die', type: 'verb', verbGroup: 'godan', example: { jp: '花が死ぬ', romaji: 'hana ga shinu', en: 'The flower dies' } },
  { id: 'v13', kanji: '読む', kana: 'よむ', romaji: 'yomu', meaning: 'to read', type: 'verb', verbGroup: 'godan', example: { jp: '本を読む', romaji: 'hon o yomu', en: 'I read a book' } },
  { id: 'v14', kanji: '呼ぶ', kana: 'よぶ', romaji: 'yobu', meaning: 'to call', type: 'verb', verbGroup: 'godan', example: { jp: 'タクシーを呼ぶ', romaji: 'takushii o yobu', en: 'I call a taxi' } },
  { id: 'v15', kanji: '乗る', kana: 'のる', romaji: 'noru', meaning: 'to ride', type: 'verb', verbGroup: 'godan', example: { jp: '電車に乗る', romaji: 'densha ni noru', en: 'I ride a train' } },
  { id: 'v16', kanji: '終わる', kana: 'おわる', romaji: 'owaru', meaning: 'to finish', type: 'verb', verbGroup: 'godan', example: { jp: '仕事が終わる', romaji: 'shigoto ga owaru', en: 'Work finishes' } },
  { id: 'v17', kanji: '洗う', kana: 'あらう', romaji: 'arau', meaning: 'to wash', type: 'verb', verbGroup: 'godan', example: { jp: '手を洗う', romaji: 'te o arau', en: 'I wash my hands' } },
  { id: 'v18', kanji: '歌う', kana: 'うたう', romaji: 'utau', meaning: 'to sing', type: 'verb', verbGroup: 'godan', example: { jp: '歌を歌う', romaji: 'uta o utau', en: 'I sing a song' } },
  { id: 'v19', kanji: 'わかる', kana: 'わかる', romaji: 'wakaru', meaning: 'to understand', type: 'verb', verbGroup: 'godan', example: { jp: '英語がわかる', romaji: 'eigo ga wakaru', en: 'I understand English' } },
  { id: 'v20', kanji: '会う', kana: 'あう', romaji: 'au', meaning: 'to meet', type: 'verb', verbGroup: 'godan', example: { jp: '友達に会う', romaji: 'tomodachi ni au', en: 'I meet a friend' } },

  // Verbs (Ichidan)
  { id: 'v21', kanji: '食べる', kana: 'たべる', romaji: 'taberu', meaning: 'to eat', type: 'verb', verbGroup: 'ichidan', example: { jp: '寿司を食べる', romaji: 'sushi o taberu', en: 'I eat sushi' } },
  { id: 'v22', kanji: '見る', kana: 'みる', romaji: 'miru', meaning: 'to see / to watch', type: 'verb', verbGroup: 'ichidan', example: { jp: '映画を見る', romaji: 'eiga o miru', en: 'I watch a movie' } },
  { id: 'v23', kanji: '寝る', kana: 'ねる', romaji: 'neru', meaning: 'to sleep', type: 'verb', verbGroup: 'ichidan', example: { jp: '早く寝る', romaji: 'hayaku neru', en: 'I sleep early' } },
  { id: 'v24', kanji: '起きる', kana: 'おきる', romaji: 'okiru', meaning: 'to wake up', type: 'verb', verbGroup: 'ichidan', example: { jp: '７時に起きる', romaji: 'shichiji ni okiru', en: 'I wake up at 7' } },
  { id: 'v25', kanji: '開ける', kana: 'あける', romaji: 'akeru', meaning: 'to open', type: 'verb', verbGroup: 'ichidan', example: { jp: 'ドアを開ける', romaji: 'doa o akeru', en: 'I open the door' } },
  { id: 'v26', kanji: '閉める', kana: 'しめる', romaji: 'shimeru', meaning: 'to close', type: 'verb', verbGroup: 'ichidan', example: { jp: '窓を閉める', romaji: 'mado o shimeru', en: 'I close the window' } },
  { id: 'v27', kanji: '教える', kana: 'おしえる', romaji: 'oshieru', meaning: 'to teach', type: 'verb', verbGroup: 'ichidan', example: { jp: '英語を教える', romaji: 'eigo o oshieru', en: 'I teach English' } },
  { id: 'v28', kanji: '忘れる', kana: 'わすれる', romaji: 'wasureru', meaning: 'to forget', type: 'verb', verbGroup: 'ichidan', example: { jp: '名前を忘れる', romaji: 'namae o wasureru', en: 'I forget the name' } },
  { id: 'v29', kanji: '覚える', kana: 'おぼえる', romaji: 'oboeru', meaning: 'to remember', type: 'verb', verbGroup: 'ichidan', example: { jp: '漢字を覚える', romaji: 'kanji o oboeru', en: 'I remember kanji' } },
  { id: 'v30', kanji: '借りる', kana: 'かりる', romaji: 'kariru', meaning: 'to borrow', type: 'verb', verbGroup: 'ichidan', example: { jp: '本を借りる', romaji: 'hon o kariru', en: 'I borrow a book' } },
  { id: 'v31', kanji: '降りる', kana: 'おりる', romaji: 'oriru', meaning: 'to get off', type: 'verb', verbGroup: 'ichidan', example: { jp: 'バスを降りる', romaji: 'basu o oriru', en: 'I get off the bus' } },
  { id: 'v32', kanji: '着る', kana: 'きる', romaji: 'kiru', meaning: 'to wear (upper body)', type: 'verb', verbGroup: 'ichidan', example: { jp: 'シャツを着る', romaji: 'shatsu o kiru', en: 'I wear a shirt' } },
  { id: 'v33', kanji: '見せる', kana: 'みせる', romaji: 'miseru', meaning: 'to show', type: 'verb', verbGroup: 'ichidan', example: { jp: '写真を見せる', romaji: 'shashin o miseru', en: 'I show a photo' } },
  { id: 'v34', kanji: '疲れる', kana: 'つかれる', romaji: 'tsukareru', meaning: 'to get tired', type: 'verb', verbGroup: 'ichidan', example: { jp: '仕事で疲れる', romaji: 'shigoto de tsukareru', en: 'I get tired from work' } },
  { id: 'v35', kanji: '出かける', kana: 'でかける', romaji: 'dekakeru', meaning: 'to go out', type: 'verb', verbGroup: 'ichidan', example: { jp: '買い物に出かける', romaji: 'kaimono ni dekakeru', en: 'I go out for shopping' } },

  // Verbs (Irregular)
  { id: 'v36', kanji: 'する', kana: 'する', romaji: 'suru', meaning: 'to do', type: 'verb', verbGroup: 'irregular', example: { jp: '勉強をする', romaji: 'benkyou o suru', en: 'I do study' } },
  { id: 'v37', kanji: '来る', kana: 'くる', romaji: 'kuru', meaning: 'to come', type: 'verb', verbGroup: 'irregular', example: { jp: '日本に来る', romaji: 'nihon ni kuru', en: 'I come to Japan' } },
  { id: 'v38', kanji: '勉強する', kana: 'べんきょうする', romaji: 'benkyousuru', meaning: 'to study', type: 'verb', verbGroup: 'irregular', example: { jp: '日本語を勉強する', romaji: 'nihongo o benkyousuru', en: 'I study Japanese' } },
  { id: 'v39', kanji: '結婚する', kana: 'けっこんする', romaji: 'kekkonsuru', meaning: 'to marry', type: 'verb', verbGroup: 'irregular', example: { jp: '来年結婚する', romaji: 'rainen kekkonsuru', en: 'I will marry next year' } },
  { id: 'v40', kanji: '買い物する', kana: 'かいものする', romaji: 'kaimonosuru', meaning: 'to shop', type: 'verb', verbGroup: 'irregular', example: { jp: 'デパートで買い物する', romaji: 'depaato de kaimonosuru', en: 'I shop at the department store' } },

  // i-Adjectives
  { id: 'a1', kanji: '大きい', kana: 'おおきい', romaji: 'ookii', meaning: 'big', type: 'i-adj', example: { jp: '大きい犬', romaji: 'ookii inu', en: 'A big dog' } },
  { id: 'a2', kanji: '小さい', kana: 'ちいさい', romaji: 'chiisai', meaning: 'small', type: 'i-adj', example: { jp: '小さい猫', romaji: 'chiisai neko', en: 'A small cat' } },
  { id: 'a3', kanji: '新しい', kana: 'あたらしい', romaji: 'atarashii', meaning: 'new', type: 'i-adj', example: { jp: '新しい車', romaji: 'atarashii kuruma', en: 'A new car' } },
  { id: 'a4', kanji: '古い', kana: 'ふるい', romaji: 'furui', meaning: 'old', type: 'i-adj', example: { jp: '古い本', romaji: 'furui hon', en: 'An old book' } },
  { id: 'a5', kanji: '良い', kana: 'いい', romaji: 'ii / yoi', meaning: 'good', type: 'i-adj', example: { jp: '天気が良い', romaji: 'tenki ga ii', en: 'The weather is good' } },
  { id: 'a6', kanji: '悪い', kana: 'わるい', romaji: 'warui', meaning: 'bad', type: 'i-adj', example: { jp: '気分が悪い', romaji: 'kibun ga warui', en: 'I feel bad' } },
  { id: 'a7', kanji: '熱い', kana: 'あつい', romaji: 'atsui', meaning: 'hot (thing)', type: 'i-adj', example: { jp: '熱いお茶', romaji: 'atsui ocha', en: 'Hot tea' } },
  { id: 'a8', kanji: '暑い', kana: 'あつい', romaji: 'atsui', meaning: 'hot (weather)', type: 'i-adj', example: { jp: '今日は暑い', romaji: 'kyou wa atsui', en: 'Today is hot' } },
  { id: 'a9', kanji: '冷たい', kana: 'つめたい', romaji: 'tsumetai', meaning: 'cold (thing)', type: 'i-adj', example: { jp: '冷たい水', romaji: 'tsumetai mizu', en: 'Cold water' } },
  { id: 'a10', kanji: '寒い', kana: 'さむい', romaji: 'samui', meaning: 'cold (weather)', type: 'i-adj', example: { jp: '今日は寒い', romaji: 'kyou wa samui', en: 'Today is cold' } },
  { id: 'a11', kanji: '高い', kana: 'たかい', romaji: 'takai', meaning: 'high / expensive', type: 'i-adj', example: { jp: '高い山', romaji: 'takai yama', en: 'A high mountain' } },
  { id: 'a12', kanji: '安い', kana: 'やすい', romaji: 'yasui', meaning: 'cheap', type: 'i-adj', example: { jp: '安い靴', romaji: 'yasui kutsu', en: 'Cheap shoes' } },
  { id: 'a13', kanji: '低い', kana: 'ひくい', romaji: 'hikui', meaning: 'low', type: 'i-adj', example: { jp: '背が低い', romaji: 'se ga hikui', en: 'Short (stature)' } },
  { id: 'a14', kanji: '面白い', kana: 'おもしろい', romaji: 'omoshiroi', meaning: 'interesting', type: 'i-adj', example: { jp: '面白い映画', romaji: 'omoshiroi eiga', en: 'An interesting movie' } },
  { id: 'a15', kanji: '美味しい', kana: 'おいしい', romaji: 'oishii', meaning: 'delicious', type: 'i-adj', example: { jp: '美味しいケーキ', romaji: 'oishii keeki', en: 'A delicious cake' } },
  { id: 'a16', kanji: '忙しい', kana: 'いそがしい', romaji: 'isogashii', meaning: 'busy', type: 'i-adj', example: { jp: '今日は忙しい', romaji: 'kyou wa isogashii', en: 'I am busy today' } },
  { id: 'a17', kanji: '楽しい', kana: 'たのしい', romaji: 'tanoshii', meaning: 'fun', type: 'i-adj', example: { jp: '楽しいパーティー', romaji: 'tanoshii paatii', en: 'A fun party' } },
  { id: 'a18', kanji: '難しい', kana: 'むずかしい', romaji: 'muzukashii', meaning: 'difficult', type: 'i-adj', example: { jp: '難しいテスト', romaji: 'muzukashii tesuto', en: 'A difficult test' } },
  { id: 'a19', kanji: '易しい', kana: 'やさしい', romaji: 'yasashii', meaning: 'easy', type: 'i-adj', example: { jp: '易しい問題', romaji: 'yasashii mondai', en: 'An easy problem' } },
  { id: 'a20', kanji: '近い', kana: 'ちかい', romaji: 'chikai', meaning: 'near', type: 'i-adj', example: { jp: '駅に近い', romaji: 'eki ni chikai', en: 'Near the station' } },

  // na-Adjectives
  { id: 'a21', kanji: '静か', kana: 'しずか', romaji: 'shizuka', meaning: 'quiet', type: 'na-adj', example: { jp: '静かな部屋', romaji: 'shizuka na heya', en: 'A quiet room' } },
  { id: 'a22', kanji: '賑やか', kana: 'にぎやか', romaji: 'nigiyaka', meaning: 'lively', type: 'na-adj', example: { jp: '賑やかな町', romaji: 'nigiyaka na machi', en: 'A lively town' } },
  { id: 'a23', kanji: '綺麗', kana: 'きれい', romaji: 'kirei', meaning: 'beautiful / clean', type: 'na-adj', example: { jp: '綺麗な花', romaji: 'kirei na hana', en: 'A beautiful flower' } },
  { id: 'a24', kanji: '元気', kana: 'げんき', romaji: 'genki', meaning: 'healthy / energetic', type: 'na-adj', example: { jp: '元気な子供', romaji: 'genki na kodomo', en: 'An energetic child' } },
  { id: 'a25', kanji: '有名', kana: 'ゆうめい', romaji: 'yuumei', meaning: 'famous', type: 'na-adj', example: { jp: '有名な人', romaji: 'yuumei na hito', en: 'A famous person' } },
  { id: 'a26', kanji: '親切', kana: 'しんせつ', romaji: 'shinsetsu', meaning: 'kind', type: 'na-adj', example: { jp: '親切な先生', romaji: 'shinsetsu na sensei', en: 'A kind teacher' } },
  { id: 'a27', kanji: '便利', kana: 'べんり', romaji: 'benri', meaning: 'convenient', type: 'na-adj', example: { jp: '便利なパソコン', romaji: 'benri na pasokon', en: 'A convenient computer' } },
  { id: 'a28', kanji: '不便', kana: 'ふべん', romaji: 'fuben', meaning: 'inconvenient', type: 'na-adj', example: { jp: '不便な場所', romaji: 'fuben na basho', en: 'An inconvenient place' } },
  { id: 'a29', kanji: '暇', kana: 'ひま', romaji: 'hima', meaning: 'free (time)', type: 'na-adj', example: { jp: '暇な日', romaji: 'hima na hi', en: 'A free day' } },
  { id: 'a30', kanji: '好き', kana: 'すき', romaji: 'suki', meaning: 'likable / fond of', type: 'na-adj', example: { jp: '好きな食べ物', romaji: 'suki na tabemono', en: 'Favorite food' } },
];

export const vocabCategories = [
  'Family', 'Food', 'Numbers', 'Time', 'Places', 'Body', 'Weather', 'Daily Life'
];

export const vocabWords: Word[] = [
  // Family
  { id: 'n1', kanji: '家族', kana: 'かぞく', romaji: 'kazoku', meaning: 'family', type: 'noun', category: 'Family', example: { jp: '私の家族', romaji: 'watashi no kazoku', en: 'My family' } },
  { id: 'n2', kanji: '父', kana: 'ちち', romaji: 'chichi', meaning: 'father (own)', type: 'noun', category: 'Family', example: { jp: '父は会社員です', romaji: 'chichi wa kaishain desu', en: 'My father is an office worker' } },
  { id: 'n3', kanji: '母', kana: 'はは', romaji: 'haha', meaning: 'mother (own)', type: 'noun', category: 'Family', example: { jp: '母は優しいです', romaji: 'haha wa yasashii desu', en: 'My mother is kind' } },
  { id: 'n4', kanji: '兄', kana: 'あに', romaji: 'ani', meaning: 'older brother (own)', type: 'noun', category: 'Family', example: { jp: '兄は学生です', romaji: 'ani wa gakusei desu', en: 'My older brother is a student' } },
  { id: 'n5', kanji: '姉', kana: 'あね', romaji: 'ane', meaning: 'older sister (own)', type: 'noun', category: 'Family', example: { jp: '姉は医者です', romaji: 'ane wa isha desu', en: 'My older sister is a doctor' } },
  { id: 'n6', kanji: '弟', kana: 'おとうと', romaji: 'otouto', meaning: 'younger brother', type: 'noun', category: 'Family', example: { jp: '弟がいます', romaji: 'otouto ga imasu', en: 'I have a younger brother' } },
  { id: 'n7', kanji: '妹', kana: 'いもうと', romaji: 'imouto', meaning: 'younger sister', type: 'noun', category: 'Family', example: { jp: '妹は可愛いです', romaji: 'imouto wa kawaii desu', en: 'My younger sister is cute' } },
  { id: 'n8', kanji: 'お父さん', kana: 'おとうさん', romaji: 'otousan', meaning: 'father (someone else\'s)', type: 'noun', category: 'Family', example: { jp: 'お父さんは元気ですか', romaji: 'otousan wa genki desu ka', en: 'Is your father well?' } },
  
  // Food
  { id: 'n9', kanji: '水', kana: 'みず', romaji: 'mizu', meaning: 'water', type: 'noun', category: 'Food', example: { jp: '水を下さい', romaji: 'mizu o kudasai', en: 'Water, please' } },
  { id: 'n10', kanji: 'お茶', kana: 'おちゃ', romaji: 'ocha', meaning: 'green tea', type: 'noun', category: 'Food', example: { jp: 'お茶を飲みます', romaji: 'ocha o nomimasu', en: 'I drink green tea' } },
  { id: 'n11', kanji: 'ご飯', kana: 'ごはん', romaji: 'gohan', meaning: 'rice / meal', type: 'noun', category: 'Food', example: { jp: 'ご飯を食べます', romaji: 'gohan o tabemasu', en: 'I eat a meal' } },
  { id: 'n12', kanji: '肉', kana: 'にく', romaji: 'niku', meaning: 'meat', type: 'noun', category: 'Food', example: { jp: '肉が好きです', romaji: 'niku ga suki desu', en: 'I like meat' } },
  { id: 'n13', kanji: '魚', kana: 'さかな', romaji: 'sakana', meaning: 'fish', type: 'noun', category: 'Food', example: { jp: '魚は美味しいです', romaji: 'sakana wa oishii desu', en: 'Fish is delicious' } },
  { id: 'n14', kanji: '野菜', kana: 'やさい', romaji: 'yasai', meaning: 'vegetable', type: 'noun', category: 'Food', example: { jp: '野菜を食べます', romaji: 'yasai o tabemasu', en: 'I eat vegetables' } },
  { id: 'n15', kanji: '卵', kana: 'たまご', romaji: 'tamago', meaning: 'egg', type: 'noun', category: 'Food', example: { jp: '卵を買います', romaji: 'tamago o kaimasu', en: 'I buy eggs' } },
  { id: 'n16', kanji: '果物', kana: 'くだもの', romaji: 'kudamono', meaning: 'fruit', type: 'noun', category: 'Food', example: { jp: '果物が高いです', romaji: 'kudamono ga takai desu', en: 'Fruit is expensive' } },

  // Numbers
  { id: 'n17', kanji: '一', kana: 'いち', romaji: 'ichi', meaning: 'one', type: 'noun', category: 'Numbers', example: { jp: '一つ', romaji: 'hitotsu', en: 'One thing' } },
  { id: 'n18', kanji: '二', kana: 'に', romaji: 'ni', meaning: 'two', type: 'noun', category: 'Numbers', example: { jp: '二つ', romaji: 'futatsu', en: 'Two things' } },
  { id: 'n19', kanji: '三', kana: 'さん', romaji: 'san', meaning: 'three', type: 'noun', category: 'Numbers', example: { jp: '三つ', romaji: 'mittsu', en: 'Three things' } },
  { id: 'n20', kanji: '四', kana: 'よん / し', romaji: 'yon / shi', meaning: 'four', type: 'noun', category: 'Numbers', example: { jp: '四つ', romaji: 'yottsu', en: 'Four things' } },
  { id: 'n21', kanji: '五', kana: 'ご', romaji: 'go', meaning: 'five', type: 'noun', category: 'Numbers', example: { jp: '五つ', romaji: 'itsutsu', en: 'Five things' } },
  { id: 'n22', kanji: '百', kana: 'ひゃく', romaji: 'hyaku', meaning: 'hundred', type: 'noun', category: 'Numbers', example: { jp: '百円', romaji: 'hyaku en', en: '100 yen' } },
  { id: 'n23', kanji: '千', kana: 'せん', romaji: 'sen', meaning: 'thousand', type: 'noun', category: 'Numbers', example: { jp: '千円', romaji: 'sen en', en: '1000 yen' } },
  { id: 'n24', kanji: '万', kana: 'まん', romaji: 'man', meaning: 'ten thousand', type: 'noun', category: 'Numbers', example: { jp: '一万円', romaji: 'ichi man en', en: '10,000 yen' } },

  // Time
  { id: 'n25', kanji: '今日', kana: 'きょう', romaji: 'kyou', meaning: 'today', type: 'noun', category: 'Time', example: { jp: '今日は月曜日です', romaji: 'kyou wa getsuyoubi desu', en: 'Today is Monday' } },
  { id: 'n26', kanji: '明日', kana: 'あした', romaji: 'ashita', meaning: 'tomorrow', type: 'noun', category: 'Time', example: { jp: '明日は雨です', romaji: 'ashita wa ame desu', en: 'Tomorrow is rain' } },
  { id: 'n27', kanji: '昨日', kana: 'きのう', romaji: 'kinou', meaning: 'yesterday', type: 'noun', category: 'Time', example: { jp: '昨日は日曜日でした', romaji: 'kinou wa nichiyoubi deshita', en: 'Yesterday was Sunday' } },
  { id: 'n28', kanji: '今', kana: 'いま', romaji: 'ima', meaning: 'now', type: 'noun', category: 'Time', example: { jp: '今は何時ですか', romaji: 'ima wa nanji desu ka', en: 'What time is it now?' } },
  { id: 'n29', kanji: '朝', kana: 'あさ', romaji: 'asa', meaning: 'morning', type: 'noun', category: 'Time', example: { jp: '朝ご飯', romaji: 'asa gohan', en: 'Breakfast' } },
  { id: 'n30', kanji: '昼', kana: 'ひる', romaji: 'hiru', meaning: 'noon / daytime', type: 'noun', category: 'Time', example: { jp: '昼ご飯', romaji: 'hiru gohan', en: 'Lunch' } },
  { id: 'n31', kanji: '晩', kana: 'ばん', romaji: 'ban', meaning: 'evening / night', type: 'noun', category: 'Time', example: { jp: '晩ご飯', romaji: 'ban gohan', en: 'Dinner' } },
  { id: 'n32', kanji: '夜', kana: 'よる', romaji: 'yoru', meaning: 'night', type: 'noun', category: 'Time', example: { jp: '夜は寒いです', romaji: 'yoru wa samui desu', en: 'Night is cold' } },

  // Places
  { id: 'n33', kanji: '学校', kana: 'がっこう', romaji: 'gakkou', meaning: 'school', type: 'noun', category: 'Places', example: { jp: '学校に行く', romaji: 'gakkou ni iku', en: 'Go to school' } },
  { id: 'n34', kanji: '会社', kana: 'かいしゃ', romaji: 'kaisha', meaning: 'company', type: 'noun', category: 'Places', example: { jp: '会社で働く', romaji: 'kaisha de hataraku', en: 'Work at a company' } },
  { id: 'n35', kanji: '家', kana: 'いえ', romaji: 'ie', meaning: 'house / home', type: 'noun', category: 'Places', example: { jp: '家に帰る', romaji: 'ie ni kaeru', en: 'Return home' } },
  { id: 'n36', kanji: '駅', kana: 'えき', romaji: 'eki', meaning: 'station', type: 'noun', category: 'Places', example: { jp: '駅で待つ', romaji: 'eki de matsu', en: 'Wait at the station' } },
  { id: 'n37', kanji: '店', kana: 'みせ', romaji: 'mise', meaning: 'shop / store', type: 'noun', category: 'Places', example: { jp: '店で買う', romaji: 'mise de kau', en: 'Buy at a shop' } },
  { id: 'n38', kanji: '病院', kana: 'びょういん', romaji: 'byouin', meaning: 'hospital', type: 'noun', category: 'Places', example: { jp: '病院に行く', romaji: 'byouin ni iku', en: 'Go to the hospital' } },
  { id: 'n39', kanji: '銀行', kana: 'ぎんこう', romaji: 'ginkou', meaning: 'bank', type: 'noun', category: 'Places', example: { jp: '銀行はどこですか', romaji: 'ginkou wa doko desu ka', en: 'Where is the bank?' } },
  { id: 'n40', kanji: '公園', kana: 'こうえん', romaji: 'kouen', meaning: 'park', type: 'noun', category: 'Places', example: { jp: '公園で遊ぶ', romaji: 'kouen de asobu', en: 'Play in the park' } },

  // Body
  { id: 'n41', kanji: '目', kana: 'め', romaji: 'me', meaning: 'eye', type: 'noun', category: 'Body', example: { jp: '目が痛い', romaji: 'me ga itai', en: 'My eye hurts' } },
  { id: 'n42', kanji: '耳', kana: 'みみ', romaji: 'mimi', meaning: 'ear', type: 'noun', category: 'Body', example: { jp: '耳がいい', romaji: 'mimi ga ii', en: 'Good hearing' } },
  { id: 'n43', kanji: '口', kana: 'くち', romaji: 'kuchi', meaning: 'mouth', type: 'noun', category: 'Body', example: { jp: '口を開ける', romaji: 'kuchi o akeru', en: 'Open mouth' } },
  { id: 'n44', kanji: '手', kana: 'て', romaji: 'te', meaning: 'hand', type: 'noun', category: 'Body', example: { jp: '手を洗う', romaji: 'te o arau', en: 'Wash hands' } },
  { id: 'n45', kanji: '足', kana: 'あし', romaji: 'ashi', meaning: 'foot / leg', type: 'noun', category: 'Body', example: { jp: '足が速い', romaji: 'ashi ga hayai', en: 'Fast legs' } },
  { id: 'n46', kanji: '頭', kana: 'あたま', romaji: 'atama', meaning: 'head', type: 'noun', category: 'Body', example: { jp: '頭がいい', romaji: 'atama ga ii', en: 'Smart' } },
  { id: 'n47', kanji: '体', kana: 'からだ', romaji: 'karada', meaning: 'body', type: 'noun', category: 'Body', example: { jp: '体にいい', romaji: 'karada ni ii', en: 'Good for the body' } },
  { id: 'n48', kanji: '顔', kana: 'かお', romaji: 'kao', meaning: 'face', type: 'noun', category: 'Body', example: { jp: '顔を洗う', romaji: 'kao o arau', en: 'Wash face' } },

  // Weather
  { id: 'n49', kanji: '天気', kana: 'てんき', romaji: 'tenki', meaning: 'weather', type: 'noun', category: 'Weather', example: { jp: 'いい天気ですね', romaji: 'ii tenki desu ne', en: 'It is good weather, isn\'t it' } },
  { id: 'n50', kanji: '雨', kana: 'あめ', romaji: 'ame', meaning: 'rain', type: 'noun', category: 'Weather', example: { jp: '雨が降る', romaji: 'ame ga furu', en: 'It rains' } },
  { id: 'n51', kanji: '雪', kana: 'ゆき', romaji: 'yuki', meaning: 'snow', type: 'noun', category: 'Weather', example: { jp: '雪が降る', romaji: 'yuki ga furu', en: 'It snows' } },
  { id: 'n52', kanji: '風', kana: 'かぜ', romaji: 'kaze', meaning: 'wind', type: 'noun', category: 'Weather', example: { jp: '風が強い', romaji: 'kaze ga tsuyoi', en: 'The wind is strong' } },
  { id: 'n53', kanji: '空', kana: 'そら', romaji: 'sora', meaning: 'sky', type: 'noun', category: 'Weather', example: { jp: '青い空', romaji: 'aoi sora', en: 'Blue sky' } },
  { id: 'n54', kanji: '晴れ', kana: 'はれ', romaji: 'hare', meaning: 'sunny / clear weather', type: 'noun', category: 'Weather', example: { jp: '明日は晴れです', romaji: 'ashita wa hare desu', en: 'Tomorrow is sunny' } },
  { id: 'n55', kanji: '曇り', kana: 'くもり', romaji: 'kumori', meaning: 'cloudy weather', type: 'noun', category: 'Weather', example: { jp: '今日は曇りです', romaji: 'kyou wa kumori desu', en: 'Today is cloudy' } },
  { id: 'n56', kanji: '雲', kana: 'くも', romaji: 'kumo', meaning: 'cloud', type: 'noun', category: 'Weather', example: { jp: '白い雲', romaji: 'shiroi kumo', en: 'White cloud' } },

  // Daily Life
  { id: 'n57', kanji: '本', kana: 'ほん', romaji: 'hon', meaning: 'book', type: 'noun', category: 'Daily Life', example: { jp: '本を読む', romaji: 'hon o yomu', en: 'Read a book' } },
  { id: 'n58', kanji: '新聞', kana: 'しんぶん', romaji: 'shinbun', meaning: 'newspaper', type: 'noun', category: 'Daily Life', example: { jp: '新聞を読む', romaji: 'shinbun o yomu', en: 'Read a newspaper' } },
  { id: 'n59', kanji: '手紙', kana: 'てがみ', romaji: 'tegami', meaning: 'letter', type: 'noun', category: 'Daily Life', example: { jp: '手紙を書く', romaji: 'tegami o kaku', en: 'Write a letter' } },
  { id: 'n60', kanji: '時計', kana: 'とけい', romaji: 'tokei', meaning: 'watch / clock', type: 'noun', category: 'Daily Life', example: { jp: '時計を買う', romaji: 'tokei o kau', en: 'Buy a watch' } },
  { id: 'n61', kanji: '靴', kana: 'くつ', romaji: 'kutsu', meaning: 'shoes', type: 'noun', category: 'Daily Life', example: { jp: '靴を履く', romaji: 'kutsu o haku', en: 'Put on shoes' } },
  { id: 'n62', kanji: '服', kana: 'ふく', romaji: 'fuku', meaning: 'clothes', type: 'noun', category: 'Daily Life', example: { jp: '服を着る', romaji: 'fuku o kiru', en: 'Put on clothes' } },
  { id: 'n63', kanji: '車', kana: 'くるま', romaji: 'kuruma', meaning: 'car', type: 'noun', category: 'Daily Life', example: { jp: '車に乗る', romaji: 'kuruma ni noru', en: 'Ride a car' } },
  { id: 'n64', kanji: '自転車', kana: 'じてんしゃ', romaji: 'jitensha', meaning: 'bicycle', type: 'noun', category: 'Daily Life', example: { jp: '自転車で行く', romaji: 'jitensha de iku', en: 'Go by bicycle' } }
];

export const allWords = [...flashcardWords, ...vocabWords];
