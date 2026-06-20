import { Challenge, ChallengeType, LevelConfig, GameState, ChallengeResult, ChallengeRating } from '../types';
import { generateId, randomInt, randomChoice } from '../utils/helpers';

interface ChallengeTemplate {
  type: ChallengeType;
  title: string;
  descriptions: string[];
  icon: string;
  unit: string;
  rewardText: string;
  bonusScore: number;
  generateTarget: (level: LevelConfig) => number;
}

const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  {
    type: 'batch-admission-time',
    title: '准时入场大师',
    descriptions: [
      '前 3 批次入场总耗时不超过 {target} 秒',
      '把控节奏，前 3 批入场总耗时 ≤ {target} 秒',
      '高效调度，前 3 批次入场在 {target} 秒内完成',
    ],
    icon: '⏰',
    unit: '秒',
    rewardText: '优秀的时间掌控力',
    bonusScore: 15,
    generateTarget: (level) => {
      const baseTime = (level.targetTime / level.batches) * 3;
      return Math.round(baseTime * randomInt(10, 14) / 10);
    },
  },
  {
    type: 'max-missed-events',
    title: '零失误管家',
    descriptions: [
      '本局事件遗漏不超过 {target} 次',
      '专注应对，最多允许 {target} 次事件遗漏',
      '眼疾手快，事件处理失误控制在 {target} 次以内',
    ],
    icon: '🎯',
    unit: '次',
    rewardText: '出色的应急处理能力',
    bonusScore: 20,
    generateTarget: (level) => {
      if (level.eventFrequency === 'low') return 0;
      if (level.eventFrequency === 'medium') return 1;
      return randomInt(1, 2);
    },
  },
  {
    type: 'station-recovery-rate',
    title: '工位守护者',
    descriptions: [
      '本局工位恢复率达到 {target}% 以上',
      '保持整洁，工位恢复率不低于 {target}%',
      '细心呵护，{target}% 工位恢复达标率',
    ],
    icon: '🧹',
    unit: '%',
    rewardText: '卓越的工位管理能力',
    bonusScore: 15,
    generateTarget: () => randomInt(85, 95),
  },
  {
    type: 'assistant-high-efficiency',
    title: '金牌调度官',
    descriptions: [
      '让至少 {target} 名助理持续高效工作（忙碌占比 ≥ 65%）',
      '人尽其才，{target} 位助理高效运转',
      '合理分工，保持 {target} 名助理的高效状态',
    ],
    icon: '👥',
    unit: '名',
    rewardText: '优秀的团队管理能力',
    bonusScore: 15,
    generateTarget: (level) => Math.max(1, level.assistants - 1),
  },
  {
    type: 'total-time-budget',
    title: '时间规划师',
    descriptions: [
      '全局总耗时不超过目标时间的 {target}%',
      '速战速决，总耗时控制在目标的 {target}% 以内',
      '精益管理，全流程耗时压缩至 {target}% 以内',
    ],
    icon: '⚡',
    unit: '%',
    rewardText: '出色的整体调度效率',
    bonusScore: 20,
    generateTarget: () => randomInt(115, 130),
  },
  {
    type: 'zero-admission-delay',
    title: '零延误承诺',
    descriptions: [
      '所有批次入场延误总计不超过 {target} 秒',
      '精确到秒，累计入场延误 ≤ {target} 秒',
      '分秒必争，入场总延误控制在 {target} 秒以内',
    ],
    icon: '🚀',
    unit: '秒',
    rewardText: '极致的入场管控能力',
    bonusScore: 20,
    generateTarget: (level) => randomInt(level.batches * 3, level.batches * 6),
  },
  {
    type: 'min-assistant-idle',
    title: '人力效率官',
    descriptions: [
      '全局助理平均空闲比例不超过 {target}%',
      '充分利用人力，助理平均闲置率 ≤ {target}%',
      '紧凑安排，团队空闲度控制在 {target}% 以下',
    ],
    icon: '💪',
    unit: '%',
    rewardText: '极致的人力资源利用',
    bonusScore: 15,
    generateTarget: () => randomInt(30, 45),
  },
];

export const generateChallenges = (level: LevelConfig, count: number = randomInt(2, 3)): Challenge[] => {
  const shuffled = [...CHALLENGE_TEMPLATES].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  return selected.map((template) => {
    const targetValue = template.generateTarget(level);
    const descriptionTemplate = randomChoice(template.descriptions);
    const description = descriptionTemplate.replace('{target}', targetValue.toString());

    return {
      id: generateId(),
      type: template.type,
      title: template.title,
      description,
      icon: template.icon,
      targetValue,
      unit: template.unit,
      currentValue: 0,
      isCompleted: false,
      rewardText: template.rewardText,
      bonusScore: template.bonusScore,
    };
  });
};

const hasEnoughData = (challengeType: string, gameState: GameState): boolean => {
  switch (challengeType) {
    case 'batch-admission-time':
      return gameState.admissionTimes.length >= 3;
    case 'max-missed-events':
      return gameState.elapsedTime > 10 || gameState.eventLog.length > 0;
    case 'station-recovery-rate':
      return gameState.totalStationsUsed > 0;
    case 'assistant-high-efficiency':
      return gameState.assistants.some((a) => a.totalIdleTime + a.totalBusyTime > 0);
    case 'total-time-budget':
      return gameState.elapsedTime > 5;
    case 'zero-admission-delay':
      return gameState.admissionTimes.length > 0;
    case 'min-assistant-idle':
      return gameState.assistants.some((a) => a.totalIdleTime + a.totalBusyTime > 0);
    default:
      return true;
  }
};

export const updateChallengeProgress = (
  challenges: Challenge[],
  gameState: GameState
): Challenge[] => {
  return challenges.map((challenge) => {
    let currentValue = 0;
    let isCompleted = false;
    const hasData = hasEnoughData(challenge.type, gameState);

    switch (challenge.type) {
      case 'batch-admission-time': {
        const targetBatches = 3;
        const completedAdmissions = gameState.admissionTimes.length;
        if (completedAdmissions >= targetBatches) {
          currentValue = Math.round(gameState.admissionTimes[targetBatches - 1].actual);
          isCompleted = currentValue <= challenge.targetValue;
        } else if (completedAdmissions > 0) {
          currentValue = Math.round(gameState.admissionTimes[completedAdmissions - 1].actual);
        } else {
          currentValue = 0;
        }
        break;
      }
      case 'max-missed-events': {
        currentValue = gameState.eventLog.filter((e) => !e.handled).length;
        if (hasData) {
          isCompleted = currentValue <= challenge.targetValue;
        }
        break;
      }
      case 'station-recovery-rate': {
        if (gameState.totalStationsUsed > 0) {
          currentValue = Math.round(
            (gameState.totalStationsCleaned / gameState.totalStationsUsed) * 100
          );
          if (hasData) {
            isCompleted = currentValue >= challenge.targetValue;
          }
        } else {
          currentValue = 0;
        }
        break;
      }
      case 'assistant-high-efficiency': {
        let efficientCount = 0;
        for (const assistant of gameState.assistants) {
          const totalTime = assistant.totalIdleTime + assistant.totalBusyTime;
          if (totalTime > 0) {
            const busyRatio = (assistant.totalBusyTime / totalTime) * 100;
            if (busyRatio >= 65) efficientCount++;
          }
        }
        currentValue = efficientCount;
        if (hasData) {
          isCompleted = currentValue >= challenge.targetValue;
        }
        break;
      }
      case 'total-time-budget': {
        if (gameState.currentLevel) {
          const ratio = (gameState.elapsedTime / gameState.currentLevel.targetTime) * 100;
          currentValue = Math.round(ratio);
          if (hasData) {
            isCompleted = currentValue <= challenge.targetValue;
          }
        }
        break;
      }
      case 'zero-admission-delay': {
        currentValue = Math.round(
          gameState.admissionTimes.reduce((sum, t) => {
            return sum + Math.max(0, t.actual - t.planned);
          }, 0)
        );
        if (hasData) {
          isCompleted = currentValue <= challenge.targetValue;
        }
        break;
      }
      case 'min-assistant-idle': {
        const totalAssistantTime = gameState.assistants.reduce((sum, a) => {
          return sum + a.totalIdleTime + a.totalBusyTime;
        }, 0);
        const totalIdleTime = gameState.assistants.reduce((sum, a) => sum + a.totalIdleTime, 0);
        if (totalAssistantTime > 0) {
          currentValue = Math.round((totalIdleTime / totalAssistantTime) * 100);
          if (hasData) {
            isCompleted = currentValue <= challenge.targetValue;
          }
        }
        break;
      }
    }

    return {
      ...challenge,
      currentValue,
      isCompleted,
    };
  });
};

export const finalizeChallengeResults = (
  challenges: Challenge[],
  gameState: GameState
): ChallengeResult[] => {
  const finalChallenges = updateChallengeProgress(challenges, gameState);

  return finalChallenges.map((challenge) => ({
    challenge,
    achieved: challenge.isCompleted,
    finalValue: challenge.currentValue,
  }));
};

export const getChallengeRating = (
  results: ChallengeResult[],
  totalChallenges: number
): { rating: ChallengeRating; label: string; icon: string; bonusMultiplier: number } => {
  const achievedCount = results.filter((r) => r.achieved).length;
  const ratio = totalChallenges > 0 ? achievedCount / totalChallenges : 0;

  if (totalChallenges === 0 || achievedCount === 0) {
    return { rating: 'none', label: '再接再厉', icon: '📋', bonusMultiplier: 0 };
  }
  if (ratio === 1) {
    return { rating: 'perfect', label: '完美达成！', icon: '🏆', bonusMultiplier: 2.0 };
  }
  if (ratio >= 0.8) {
    return { rating: 'gold', label: '金牌经营', icon: '🥇', bonusMultiplier: 1.5 };
  }
  if (ratio >= 0.5) {
    return { rating: 'silver', label: '银牌经营', icon: '🥈', bonusMultiplier: 1.2 };
  }
  return { rating: 'bronze', label: '铜牌经营', icon: '🥉', bonusMultiplier: 1.0 };
};

export const calculateChallengeBonus = (results: ChallengeResult[]): number => {
  const rating = getChallengeRating(results, results.length);
  const baseBonus = results
    .filter((r) => r.achieved)
    .reduce((sum, r) => sum + r.challenge.bonusScore, 0);
  return Math.round(baseBonus * rating.bonusMultiplier);
};

export const getChallengeProgressText = (challenge: Challenge): string => {
  switch (challenge.type) {
    case 'batch-admission-time':
      return `第 3 批入场: ${challenge.currentValue}/${challenge.targetValue}${challenge.unit}`;
    case 'max-missed-events':
      return `遗漏: ${challenge.currentValue}/${challenge.targetValue}${challenge.unit}`;
    case 'station-recovery-rate':
      return `恢复率: ${challenge.currentValue}/${challenge.targetValue}${challenge.unit}`;
    case 'assistant-high-efficiency':
      return `高效助理: ${challenge.currentValue}/${challenge.targetValue}${challenge.unit}`;
    case 'total-time-budget':
      return `耗时比例: ${challenge.currentValue}/${challenge.targetValue}${challenge.unit}`;
    case 'zero-admission-delay':
      return `累计延误: ${challenge.currentValue}/${challenge.targetValue}${challenge.unit}`;
    case 'min-assistant-idle':
      return `平均闲置: ${challenge.currentValue}/${challenge.targetValue}${challenge.unit}`;
    default:
      return `${challenge.currentValue}/${challenge.targetValue}${challenge.unit}`;
  }
};
