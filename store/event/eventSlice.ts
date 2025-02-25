import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event } from '@/types/global.type';

const initialState = {
  events: [] as Event[],
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    addEvent: (state, { payload }: PayloadAction<Event>) => {
      state.events.push(payload);
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
