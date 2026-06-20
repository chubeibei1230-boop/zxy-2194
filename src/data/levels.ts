import { LevelConfig } from '../types';

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: '入门工坊',
    description: '熟悉游戏操作，管理3批参与者',
    batches: 3,
    stations: 4,
    assistants: 2,
    eventFrequency: 'low',
    targetTime: 120,
  },
  {
    id: 2,
    name: '忙碌午后',
    description: '参与者增多，事件频率提升',
    batches: 5,
    stations: 6,
    assistants: 2,
    eventFrequency: 'medium',
    targetTime: 180,
  },
  {
    id: 3,
    name: '周末高峰',
    description: '周末人流高峰，增加1名助理',
    batches: 7,
    stations: 8,
    assistants: 3,
    eventFrequency: 'high',
    targetTime: 240,
  },
  {
    id: 4,
    name: '大师挑战',
    description: '终极挑战，考验你的管理能力',
    batches: 10,
    stations: 10,
    assistants: 3,
    eventFrequency: 'extreme',
    targetTime: 300,
  },
];

export const getLevelById = (id: number): LevelConfig | undefined => {
  return LEVELS.find((level) => level.id === id);
};
