/**
 * i18n: Simple translation system for English and Japanese.
 */

type Lang = 'en' | 'ja';

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Title
    titleMain: "UNCLE'S",
    titleSub: 'FART FORTRESS',
    titleEdition: 'POKED Edition',
    start: 'START',
    highScores: 'HIGH SCORES',
    howToPlay: 'HOW TO PLAY',
    settings: 'SETTINGS',
    credits: 'CREDITS',
    hiScore: 'HI-SCORE',
    noScores: 'NO SCORES YET',
    pressEnterBack: 'PRESS ENTER TO GO BACK',
    // Cinema
    cinemaSkip: 'PRESS ENTER TO SKIP',
    cinema0Title: "UNCLE'S FAVORITE HOBBY",
    cinema0Sub: 'A long day at work... time to rest.',
    cinema1Title: 'FIRST THING... REMOVE THE SHIRT!',
    cinema1Sub: 'Who needs formality at home?',
    cinema2Title: 'THE SACRED COUCH AWAITS...',
    cinema2Sub: 'His true sanctuary.',
    cinema3Big: 'PREPARE YOUR FARTS!',
    // Game
    sleep: 'SLEEP',
    wave: 'WAVE',
    score: 'SCORE',
    hi: 'HI',
    btnTiny: 'TINY',
    btnMega: 'MEGA',
    btnPoison: 'POISON',
    // Pause
    paused: 'PAUSED',
    resume: 'RESUME',
    sound: 'SOUND',
    quitToMenu: 'QUIT TO MENU',
    // Game Over
    gameOver: 'GAME OVER!',
    uncleWoke: 'UNCLE WOKE UP!',
    scoreLabel: 'SCORE',
    waveLabel: 'WAVE',
    playerLabel: 'PLAYER',
    topScores: 'TOP SCORES',
    tryAgain: 'TRY AGAIN',
    mainMenu: 'MAIN MENU',
    // How To
    howTitle: 'HOW TO PLAY',
    how1: 'UNCLE IS SLEEPING!',
    how2: 'RELATIVES TRY TO WAKE HIM!',
    how3: 'USE FARTS TO STOP THEM:',
    how4: '[1] QUICK - FAST, SMALL',
    how5: '[2] MEGA - SLOW, HUGE',
    how6: '[3] POISON - SILENT KILL',
    how7: '[ESC] PAUSE',
    how8: 'TAP BUTTONS ON MOBILE',
    // Settings
    settingsTitle: 'SETTINGS',
    language: 'LANGUAGE',
    english: 'ENGLISH',
    japanese: 'JAPANESE',
    // Credits
    creditsTitle: 'CREDITS',
    creditsStory1: 'After a long day at the office,',
    creditsStory2: 'Uncle just wants to sleep on',
    creditsStory3: 'his favorite couch in peace.',
    creditsStory4: 'But the relatives keep coming!',
    creditsStory5: '',
    creditsStory6: 'Only his legendary farts',
    creditsStory7: 'can protect his sacred nap.',
    creditsStory8: '',
    creditsStory9: 'A game by',
    creditsNames: 'Moga & Yuri',
    creditsThanks: 'Thanks for playing!',
    // Mobile
    mobileControls: 'MOBILE CONTROLS',
    tapQuick: 'TAP: Quick Fart',
    swipeMega: 'SWIPE UP: Mega Fart',
    swipeTiny: 'SWIPE DOWN: Tiny Fart',
    swipePoison: 'SWIPE RIGHT: Poison',
    tapBelow: 'TAP BUTTONS BELOW',
  },
  ja: {
    titleMain: 'おじさんの',
    titleSub: 'おなら要塞',
    titleEdition: 'POKED版',
    start: 'スタート',
    highScores: 'ハイスコア',
    howToPlay: '遊び方',
    settings: '設定',
    credits: 'クレジット',
    hiScore: 'ハイスコア',
    noScores: 'スコアなし',
    pressEnterBack: 'ENTERで戻る',
    cinemaSkip: 'ENTERでスキップ',
    cinema0Title: 'おじさんの趣味',
    cinema0Sub: '長い仕事の後…休憩の時間。',
    cinema1Title: 'まず…シャツを脱ぐ！',
    cinema1Sub: '家で堅苦しいことなんて不要！',
    cinema2Title: '神聖なソファが待っている…',
    cinema2Sub: '彼の真の聖域。',
    cinema3Big: 'おならを構えろ！',
    sleep: '睡眠',
    wave: 'ウェーブ',
    score: 'スコア',
    hi: '最高',
    btnTiny: 'チチ',
    btnMega: 'メガ',
    btnPoison: 'ポイズン',
    paused: '一時停止',
    resume: '再開',
    sound: 'サウンド',
    quitToMenu: 'メニューに戻る',
    gameOver: 'ゲームオーバー！',
    uncleWoke: 'おじさんが起きた！',
    scoreLabel: 'スコア',
    waveLabel: 'ウェーブ',
    playerLabel: 'プレイヤー',
    topScores: 'トップスコア',
    tryAgain: 'リトライ',
    mainMenu: 'メインメニュー',
    howTitle: '遊び方',
    how1: 'おじさんが寝ている！',
    how2: '親戚が起こしに来る！',
    how3: 'おならで止めろ：',
    how4: '[1] 速い - 速い、小さい',
    how5: '[2] メガ - 遅い、大きい',
    how6: '[3] ポイズン - 静かにキル',
    how7: '[ESC] 一時停止',
    how8: 'モバイルではボタンをタップ',
    settingsTitle: '設定',
    language: '言語',
    english: '英語',
    japanese: '日本語',
    creditsTitle: 'クレジット',
    creditsStory1: '長い仕事の後、',
    creditsStory2: 'おじさんはお気に入りのソファで',
    creditsStory3: '静かに寝たいだけ。',
    creditsStory4: 'でも親戚がやってくる！',
    creditsStory5: '',
    creditsStory6: '伝説のおならだけが',
    creditsStory7: '神聖な昼寝を守れる。',
    creditsStory8: '',
    creditsStory9: 'ゲーム制作者',
    creditsNames: 'モガ & ユリ',
    creditsThanks: 'プレイありがとう！',
    mobileControls: 'モバイル操作',
    tapQuick: 'タップ: 速いおなら',
    swipeMega: '上スワイプ: 大おなら',
    swipeTiny: '下スワイプ: 小おなら',
    swipePoison: '右スワイプ: ポイズン',
    tapBelow: '下のボタンをタップ',
  }
};

let currentLang: Lang = 'en';

/** Get translated text for a key */
export function t(key: string): string {
  return translations[currentLang][key] || key;
}

/** Set the current language */
export function setLang(lang: Lang): void {
  currentLang = lang;
  try { localStorage.setItem('uffLang', lang); } catch { /* ignore */ }
}

/** Get the current language */
export function getLang(): Lang {
  return currentLang;
}

/** Initialize language from localStorage */
export function initLang(): void {
  try {
    const saved = localStorage.getItem('uffLang');
    if (saved === 'en' || saved === 'ja') currentLang = saved;
  } catch { /* ignore */ }
}
