import { TaskConfig, EventType } from '../types';

export const TASK_CONFIGS: Record<string, TaskConfig> = {
  sandpaper: {
    type: 'sandpaper',
    baseTime: 5,
    name: '砂纸发放',
    icon: '📋',
    color: 'amber',
  },
  cleanup: {
    type: 'cleanup',
    baseTime: 10,
    name: '工位清理',
    icon: '🧹',
    color: 'emerald',
  },
  oiling: {
    type: 'oiling',
    baseTime: 15,
    name: '上油等待',
    icon: '🧴',
    color: 'sky',
  },
  admission: {
    type: 'admission',
    baseTime: 8,
    name: '下一批入场',
    icon: '🚪',
    color: 'violet',
  },
};

export const EVENT_CONFIGS: Record<EventType, { title: string; description: string; timeLimit: number }> = {
  'cleanup-difficulty': {
    title: '工位清理困难',
    description: '某个工位有顽固污渍，清理时间增加50%！点击分配额外助理加速。',
    timeLimit: 10,
  },
  'material-delay': {
    title: '材料包延迟',
    description: '材料包运送延迟，入场时间推迟10秒。点击确认并重新安排。',
    timeLimit: 15,
  },
  'early-arrival': {
    title: '参与者提前到达',
    description: '下一批参与者提前到达！需要立即安排入场。点击优先处理。',
    timeLimit: 8,
  },
  'assistant-leave': {
    title: '助理临时离开',
    description: '某位助理临时有事，10秒内不可用。点击重新分配任务。',
    timeLimit: 12,
  },
};

export const EVENT_FREQUENCY_MAP: Record<string, number> = {
  low: 25,
  medium: 18,
  high: 12,
  extreme: 8,
};

export const ASSISTANT_NAMES = ['小明', '小红', '小刚', '小丽', '小强'];

export const STORAGE_KEY = 'woodwork_game_high_scores';
