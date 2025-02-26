import { Recurrence, RecurrenceStep } from '@/types/global.type';

export const getRecurrenceStep = (recurrence: Recurrence) => {
  switch (recurrence) {
    case Recurrence.WEEKLY:
      return RecurrenceStep.WEEKLY;
    case Recurrence.BIWEEKLY:
      return RecurrenceStep.BIWEEKLY;
    case Recurrence.MONTHLY:
      return RecurrenceStep.MONTHLY;
    default:
      return 0;
  }
};
