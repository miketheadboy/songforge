
export interface SongProject {
  title: string;
  keyTempo: string;
  moodTheme: string;
  notes: string;
  melodicIdeas: string;
  draft: string;
}

export interface ProcessedPhrase {
  text: string;
  adjective: string;
  noun: string;
  commonality: number;
  totalSyllables: number;
}

export interface ChordProgressionItem {
  name: string;
  progressions: string[];
}

export interface ChordProgressions {
  [key: string]: ChordProgressionItem;
}

export interface AlbumTitleParts {
  adjectives: string[];
  nouns: string[];
  connectors: string[];
  concepts: string[];
  verbsGerund: string[];
}

export type Theme = 'light' | 'dark';

export type CanvasDestination = 'title' | 'notes' | 'draft' | 'keyTempo' | 'moodTheme' | 'melodicIdeas';

export interface GeminiModalConfig {
  isOpen: boolean;
  title: string;
  isLoading: boolean;
  responseText: string;
  onConfirmAction?: () => void;
  confirmButtonText?: string;
}

export interface ConfirmationModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

// New types for Socratic Mentor
export interface SocraticChoice {
  text: string;
  nextQuestionId?: number;
  conceptNote?: string;
}

export interface SocraticQuestion {
  id: number;
  text: string;
  choices: SocraticChoice[];
}