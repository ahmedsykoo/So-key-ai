export type ViewMode = 
  | 'dashboard'
  | 'chat'
  | 'projects'
  | 'agents'
  | 'skills'
  | 'plugins'
  | 'tools'
  | 'terminal'
  | 'files'
  | 'github'
  | 'automation'
  | 'usage'
  | 'reports'
  | 'settings'
  | 'mcps';

export type Language = 'ar' | 'en';

export type ThemeId = 
  | 'dark-orange'
  | 'amoled'
  | 'neon'
  | 'light'
  | 'minimal'
  | 'glass'
  | 'sunset'
  | 'ocean'
  | 'forest'
  | 'dracula';

export type TextScale = '85%' | '100%' | '115%' | '130%';

export interface Project {
  id: string;
  name: string;
  path: string;
  description: string;
  lastModified: string;
  tasksCount: number;
  agentsCount: number;
  filesCount: number;
  progressPercent: number;
  activeBranch: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  model: string;
  status: 'active' | 'idle' | 'running' | 'paused';
  skills: string[];
  systemPrompt: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  iconName: string;
  isInstalled: boolean;
  isEnabled: boolean;
  isRecommended?: boolean;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  isEnabled: boolean;
  isInstalled: boolean;
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'approval_required';
  result?: string;
}

export interface FileDiff {
  fileName: string;
  additions: number;
  deletions: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: string;
  model?: string;
  thinkingContent?: string;
  isThinkingExpanded?: boolean;
  toolCalls?: ToolCall[];
  fileDiffs?: FileDiff[];
  progressPercent?: number;
  statusText?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  model: string;
  messages: ChatMessage[];
}

export interface WorkflowNode {
  id: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'in_progress' | 'pending';
  iconName: string;
  color?: string;
}

export interface TerminalLog {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
  timestamp: string;
}
