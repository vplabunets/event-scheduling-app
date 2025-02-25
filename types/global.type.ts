export type Font = 'OpenSans-Regular';
export type FontWeight = '300' | '400' | '500' | '600' | '700' | 'bold' | 'normal';
export type FontSize = 16 | 18 | 22 | 24 | 32;

export interface FormData {
  eventName: string;
  startsDate: string;
  startsTime: string;
  endsDate: string;
  endsTime: string;
  recurrence: string;
}
export interface Event {
  id: string;
  endsDate: string;
  endsTime: string;
  eventName: string;
  recurrence: string;
  startsDate: string;
  startsTime: string;
}

export type EventFields = Omit<Event, 'id'>;

export interface MarkedDate {
  selectedColor: string;
}

export enum RecurrenceStep {
  WEEKLY = 7,
  BIWEEKLY = 14,
  MONTHLY = 30,
}

export enum Recurrence {
  WEEKLY = 'weekly',
  BIWEEKLY = 'bi-weekly',
  MONTHLY = 'monthly',
}
