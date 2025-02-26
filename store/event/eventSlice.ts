import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event, Recurrence, RecurrenceStep } from '@/types/global.type';

const initialState = {
  events: [] as Event[],
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    addEvent: (state, { payload }) => {
      let recurrenceStep: number;
      if (payload.recurrence === Recurrence.WEEKLY) {
        recurrenceStep = RecurrenceStep.WEEKLY;
      } else if (payload.recurrence === Recurrence.BIWEEKLY) {
        recurrenceStep = RecurrenceStep.BIWEEKLY;
      } else {
        recurrenceStep = RecurrenceStep.MONTHLY;
      }
      const sD = new Date(payload.startsDate);
      const eD = new Date(payload.endsDate);

      const differenceInTime = eD.getTime() - sD.getTime();
      const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);

      const recurrenceQuantity = Math.round(differenceInDays / recurrenceStep);
      const id = Math.random().toString(36).substr(2, 9);

      for (let i = 0; i <= recurrenceQuantity; i += 1) {
        const newStartDate = new Date(sD);
        newStartDate.setDate(sD.getDate() + i * recurrenceStep);

        const eventData = {
          ...payload,
          startsDate: newStartDate.toISOString().split('T')[0],
          id: id,
          recurrence: payload.recurrence as Recurrence,
        };
        state.events.push(eventData);
      }
    },
    modifyEvent: (state, { payload }: PayloadAction<Event>) => {
      const index = state.events.findIndex(
        (event) => event.id === payload.id && event.startsDate === payload.startsDate
      );

      if (index !== -1) {
        state.events[index] = payload;
      } else {
        console.error('Event not found');
      }
    },
    deleteEvent: (state, { payload }: PayloadAction<{ id: string; startsDate: string }>) => {
      state.events = state.events.filter(
        (event) => !(event.id === payload.id && event.startsDate === payload.startsDate)
      );
    },
  },
});

export const { addEvent, modifyEvent, deleteEvent } = eventSlice.actions;

export const selectEventData = (state: { event: { events: Event[] } }) => state.event.events;

export default eventSlice.reducer;
