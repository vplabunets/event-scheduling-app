import { Recurrence } from '@/types/global.type';

export const weekOptions = [
  { label: 'Every week', value: Recurrence.WEEKLY },
  { label: 'Every other week', value: Recurrence.BIWEEKLY },
  { label: 'Every month', value: Recurrence.MONTHLY },
];
