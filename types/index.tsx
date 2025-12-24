export interface BilanInitial {
  conscience: string;
  fc: number;
  fr: number;
  ta: string;
  spo2: string;
  temp: string;
}

export interface EvolutionStep {
  minute: number;
  description: string;
  fc?: number;
  fr?: number;
  ta?: string;
  spo2?: string;
  temp?: string;
}

export interface Scenario {
  situation: string;
  bilan_initial: BilanInitial;
  evolution: EvolutionStep[];
  objectif_pedagogique: string;
}

export interface SavedScenario {
  id: string;
  userId: string;
  scenario: Scenario;
  type: string;
  contraintes?: string;
  createdAt: string;
  title?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
}

export interface UserStatus {
  isPremium: boolean;
  generationsUsed: number;
  maxGenerations: number;
  remainingGenerations: number;
  premiumUntil?: string;
}

export interface Session {
  user: User;
  expires: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
}

export interface UserMetadata {
  isPremium: boolean;
  generationsUsed: number;
  maxGenerations: number;
  premiumUntil?: string;
  subscriptionId?: string;
}

export interface UsageData {
  userId: string;
  date: string;
  count: number;
}
