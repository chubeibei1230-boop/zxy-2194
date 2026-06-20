export type TaskType = 'sandpaper' | 'cleanup' | 'oiling' | 'admission';

export type StationStatus = 'idle' | 'in-use' | 'needs-cleaning' | 'cleaning';

export type AssistantStatus = 'idle' | 'busy' | 'away';

export type EventType = 'cleanup-difficulty' | 'material-delay' | 'early-arrival' | 'assistant-leave';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'completed';

export type EventFrequency = 'low' | 'medium' | 'high' | 'extreme';

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D';

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
}

export interface TaskConfig {
  type: TaskType;
  baseTime: number;
  name: string;
  icon: string;
  color: string;
}
