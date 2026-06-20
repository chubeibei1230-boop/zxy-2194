import { ScoreResult, Grade, GameState } from '../types';

export const calculateScore = (state: GameState): ScoreResult => {
  const {
    totalStationsUsed,
    totalStationsCleaned,
    admissionTimes,
    assistants,
    eventLog,
    elapsedTime,
    currentLevel,
  } = state;

  const stationRecoveryRate = totalStationsUsed > 0 
    ? (totalStationsCleaned / totalStationsUsed) * 100 
    : 100;

  const totalDelay = admissionTimes.reduce((sum, t) => {
    return sum + Math.max(0, t.actual - t.planned);
  }, 0);
  const admissionDelay = admissionTimes.length > 0 
    ? totalDelay / admissionTimes.length 
    : 0;

  const totalAssistantTime = assistants.reduce((sum, a) => {
    return sum + a.totalIdleTime + a.totalBusyTime;
  }, 0);
  const totalIdleTime = assistants.reduce((sum, a) => sum + a.totalIdleTime, 0);
  const assistantIdleRatio = totalAssistantTime > 0 
    ? (totalIdleTime / totalAssistantTime) * 100 
    : 30;

  const missedEvents = eventLog.filter((e) => !e.handled).length;

  const totalTime = elapsedTime;

  const stationScore = Math.max(0, stationRecoveryRate) * 0.3;
  
  const delayScore = Math.max(0, 100 - admissionDelay * 5) * 0.2;
  
  const idleDeviation = Math.abs(assistantIdleRatio - 30);
  const idleScore = Math.max(0, 100 - idleDeviation * 2) * 0.2;
  
  const eventScore = Math.max(0, 100 - missedEvents * 25) * 0.15;
  
  const targetTime = currentLevel?.targetTime || 120;
  const timeRatio = Math.min(totalTime / targetTime, 2);
  const timeScore = Math.max(0, 100 - (timeRatio - 1) * 100) * 0.15;

  const totalScore = Math.round(stationScore + delayScore + idleScore + eventScore + timeScore);

  let grade: Grade;
  if (totalScore >= 90) grade = 'S';
  else if (totalScore >= 80) grade = 'A';
  else if (totalScore >= 70) grade = 'B';
  else if (totalScore >= 60) grade = 'C';
  else grade = 'D';

  return {
    stationRecoveryRate: Math.round(stationRecoveryRate * 10) / 10,
    admissionDelay: Math.round(admissionDelay * 10) / 10,
    assistantIdleRatio: Math.round(assistantIdleRatio * 10) / 10,
    missedEvents,
    totalTime: Math.round(totalTime),
    totalScore,
    grade,
  };
};

export const getImprovementSuggestion = (score: ScoreResult): string => {
  const suggestions: { key: keyof ScoreResult; threshold: number; message: string }[] = [
    {
      key: 'stationRecoveryRate',
      threshold: 90,
      message: '工位恢复率很好！继续保持清理工作的优先级。',
    },
    {
      key: 'stationRecoveryRate',
      threshold: 70,
      message: '建议优先安排工位清理任务，避免工位堆积影响后续批次。',
    },
    {
      key: 'stationRecoveryRate',
      threshold: 0,
      message: '工位恢复率过低！请确保每个使用后的工位都及时清理。',
    },
    {
      key: 'admissionDelay',
      threshold: 5,
      message: '入场控制很好！参与者等待时间很短。',
    },
    {
      key: 'admissionDelay',
      threshold: 15,
      message: '入场有些延误，建议提前准备砂纸和清理工位。',
    },
    {
      key: 'admissionDelay',
      threshold: 100,
      message: '入场延误严重！请优化任务顺序，确保入场任务及时完成。',
    },
    {
      key: 'assistantIdleRatio',
      threshold: 20,
      message: '助理分配效率很高！空闲比例控制在理想范围。',
    },
    {
      key: 'assistantIdleRatio',
      threshold: 50,
      message: '助理空闲时间较多，尝试让他们同时处理多个任务。',
    },
    {
      key: 'assistantIdleRatio',
      threshold: 100,
      message: '助理过于忙碌！考虑调整任务分配，避免 burnout。',
    },
    {
      key: 'missedEvents',
      threshold: 0,
      message: '完美！所有事件都得到了及时处理。',
    },
    {
      key: 'missedEvents',
      threshold: 2,
      message: '有些事件被遗漏了，下次要更注意事件通知。',
    },
    {
      key: 'missedEvents',
      threshold: 100,
      message: '太多事件被遗漏！事件处理是获得高分的关键。',
    },
  ];

  for (const suggestion of suggestions) {
    const value = score[suggestion.key];
    if (typeof value === 'number') {
      if (suggestion.key === 'admissionDelay' || suggestion.key === 'missedEvents') {
        if (value <= suggestion.threshold) {
          return suggestion.message;
        }
      } else {
        if (value >= suggestion.threshold) {
          return suggestion.message;
        }
      }
    }
  }

  return '整体表现不错！继续优化任务顺序和助理分配可以获得更高分数。';
};
