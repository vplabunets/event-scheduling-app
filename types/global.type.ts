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
  recurrence: Recurrence;
  startsDate: string;
  startsTime: string;
}

export type EventFields = Omit<Event, 'id'>;

export interface MarkedDate {
  selectedColor: string;
  id: string;
}

export enum RecurrenceStep {
  WEEKLY = 7,
  BIWEEKLY = 14,
  MONTHLY = 28,
}

export enum Recurrence {
  WEEKLY = 'weekly',
  BIWEEKLY = 'bi-weekly',
  MONTHLY = 'monthly',
}

export interface DDPickerProps {
  open: boolean;
  items: { label: string; value: string }[];
  value: string | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPickedValue: (value: string | null) => void;
  onChangeValue?: (value: string | null) => void;
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  placeholder?: string;
  customStyles?: object;
}
