import { ScoreResult } from '../types';
import { STORAGE_KEY } from '../data/constants';

export const loadHighScores = (): Record<number, ScoreResult> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load high scores:', e);
  }
  return {};
};

export const saveHighScores = (scores: Record<number, ScoreResult>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch (e) {
    console.error('Failed to save high scores:', e);
  }
};

export const saveHighScore = (levelId: number, score: ScoreResult): boolean => {
  const scores = loadHighScores();
  const existing = scores[levelId];
  
  if (!existing || score.totalScore > existing.totalScore) {
    scores[levelId] = score;
    saveHighScores(scores);
    return true;
  }
  return false;
};

export const getHighScore = (levelId: number): ScoreResult | null => {
  const scores = loadHighScores();
  return scores[levelId] || null;
};
