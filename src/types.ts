/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NextStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  category: string;
  status: 'Summarized' | '3 Risks Found' | '1 Risk Found' | 'Success' | 'In Progress';
  summary: string;
  risks: string[];
  insights: string[];
  talkingPoints: string[];
  nextSteps: NextStep[];
  participantsCount: number;
  participantAvatars: string[];
  attachments: string[];
  fullTranscript?: string;
  imageUrl?: string;
}

export interface Stats {
  hoursSaved: number;
  actionItems: number;
}

export interface CalendarProvider {
  id: 'google' | 'outlook';
  name: string;
  connected: boolean;
  description: string;
  recommended?: boolean;
}

export interface TimelineDetection {
  id: string;
  title: string;
  time: string;
  candidate?: string;
  type: 'Ready for Intel' | 'Internal Only';
}
