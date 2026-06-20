export type TaskType = 'sandpaper' | 'cleanup' | 'oiling' | 'admission';

export type StationStatus = 'idle' | 'in-use' | 'needs-cleaning' | 'cleaning';

export type AssistantStatus = 'idle' | 'busy' | 'away';

export type EventType = 'cleanup-difficulty' | 'material-delay' | 'early-arrival' | 'assistant-leave';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'completed';

export type EventFrequency = 'low' | 'medium' | 'high' | 'extreme';

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D';

export type ChallengeType =
  | 'batch-admission-time'
  | 'max-missed-events'
  | 'station-recovery-rate'
  | 'assistant-high-efficiency'
  | 'total-time-budget'
  | 'zero-admission-delay'
  | 'min-assistant-idle';

export interface Task {
  id: string;
  type: TaskType;
  stationId?: string;
  estimatedTime: number;
  remainingTime: number;
  assignedAssistantId?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: number;
  batchNumber: number;
}

export interface Station {
  id: string;
  number: number;
  status: StationStatus;
  currentTaskId?: string;
  cleanupProgress: number;
}

export interface Assistant {
  id: string;
  name: string;
  status: AssistantStatus;
  currentTaskId?: string;
  awayTimeRemaining: number;
  totalIdleTime: number;
  totalBusyTime: number;
}

export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  timeLimit: number;
  timeRemaining: number;
  affectedTaskId?: string;
  affectedStationId?: string;
  affectedAssistantId?: string;
  handled: boolean;
}

export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  batches: number;
  stations: number;
  assistants: number;
  eventFrequency: EventFrequency;
  targetTime: number;
}

export interface ScoreResult {
  stationRecoveryRate: number;
  admissionDelay: number;
  assistantIdleRatio: number;
  missedEvents: number;
  totalTime: number;
  totalScore: number;
  grade: Grade;
}

export interface GameRecord {
  levelId: number;
  score: ScoreResult;
  timestamp: number;
  isHighScore: boolean;
}

export interface AdmissionTime {
  planned: number;
  actual: number;
}

export interface EventLogEntry {
  event: GameEvent;
  handled: boolean;
  time: number;
}

export interface GameState {
  currentLevel: LevelConfig | null;
  gameStatus: GameStatus;
  currentBatch: number;
  totalBatches: number;
  elapsedTime: number;
  stations: Station[];
  assistants: Assistant[];
  taskQueue: Task[];
  activeEvents: GameEvent[];
  eventLog: EventLogEntry[];
  admissionTimes: AdmissionTime[];
  totalStationsUsed: number;
  totalStationsCleaned: number;
  gameMode: GameModeConfig;
  challengeResults: ChallengeResult[];
}

export interface TaskConfig {
  type: TaskType;
  baseTime: number;
  name: string;
  icon: string;
  color: string;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  icon: string;
  targetValue: number;
  unit: string;
  currentValue: number;
  isCompleted: boolean;
  rewardText: string;
  bonusScore: number;
}

export interface ChallengeResult {
  challenge: Challenge;
  achieved: boolean;
  finalValue: number;
}

export type ChallengeRating = 'none' | 'bronze' | 'silver' | 'gold' | 'perfect';

export interface GameModeConfig {
  challengeMode: boolean;
  challenges: Challenge[];
  showChallengePreview: boolean;
}
