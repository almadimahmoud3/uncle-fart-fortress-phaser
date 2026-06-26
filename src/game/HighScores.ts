export interface HighScoreEntry {
  score: number;
  wave: number;
  name: string;
  date: string;
}

const STORAGE_KEY = 'uffHS';

export function getHighScores(): HighScoreEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHighScore(score: number, wave: number, name: string): HighScoreEntry[] {
  try {
    const scores = getHighScores();
    scores.push({ score, wave, name, date: new Date().toLocaleDateString() });
    scores.sort((a, b) => b.score - a.score);
    const top5 = scores.slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(top5));
    return top5;
  } catch {
    return [];
  }
}

export function getTopScore(): number {
  const scores = getHighScores();
  return scores.length > 0 ? scores[0].score : 0;
}
