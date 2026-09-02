export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: string[];
  suggestedPhrases?: string[];
}

export interface ChatSessionMeta {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
}

export interface ParentingAssessmentQuestion {
  id: number;
  scenario: string;
  options: {
    text: string;
    style: 'Demokratis/Otoritatif' | 'Otoriter' | 'Permisif' | 'Pengabaian';
    explanation: string;
  }[];
}

export interface RoleplayScenario {
  id: string;
  title: string;
  childAge: string;
  situation: string;
  childStatement: string;
  goal: string;
  tips: string[];
}

export interface ImageSsePayload {
  imageId: string;
  base64: string;
  mimeType: string;
  size: number;
  toolName?: string;
  toolCallId?: string;
}

export interface ImageAttachment {
  imageId: string;
  storageKey: string;
  url: string;
  mimeType: string;
  size: number;
}
