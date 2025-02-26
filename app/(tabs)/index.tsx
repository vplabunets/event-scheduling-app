import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import Ionicons from '@expo/vector-icons/Ionicons';

import { addEvent, deleteEvent, modifyEvent } from '@/store/event/eventSlice';
import { RootState } from '@/store/store';

import DDPicker from '@/components/DDPicker';
import StyledButton from '@/components/StyledButton';
import StyledText from '@/components/StyledText';

import { timeOptions } from '@/constants/timeOptions';
import { weekOptions } from '@/constants/weekOption';
import { FormData, MarkedDate, Event, Recurrence, RecurrenceStep } from '@/types/global.type';
import ErrorMessage from '@/components/ErrorMessage';

const initialEventState = {
  eventName: '',
  startsDate: '',
  startsTime: '',
  endsDate: '',
  endsTime: '',
  recurrence: Recurrence.WEEKLY,
};
export default function HomeScreen() {
  const dispatch = useDispatch();
  const today = new Date().toISOString().split('T')[0];

  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);
  const [openWeekItems, setOpenWeekItems] = useState(false);
  const [timeOption, setTimeOption] = useState(timeOptions);
  const [weekItems, setWeekItems] = useState(weekOptions);
  const [storedEventsToDisplay, setStoredEventsToDisplay] = useState<{ [key: string]: MarkedDate }>({});

  const [selectedEvent, setSelectedEvent] = useState<Event>();

  const [firstDay, setFirstDay] = useState('');
  const [lastDay, setLastDay] = useState('');
  const [markedDates, setMarkedDates] = useState<{
    [key: string]: {};
  }>({});
  const storedEvents = useSelector((state: RootState) => state.event.events);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm({
    defaultValues: initialEventState,
  });

  useEffect(() => {
    const updatedMarkedDates: { [key: string]: MarkedDate } = storedEvents.reduce((acc, event) => {
      acc[event.startsDate] = {
        id: event.id,
        selectedColor: 'orange',
      };
      return acc;
    }, {} as { [key: string]: MarkedDate });

    setStoredEventsToDisplay(updatedMarkedDates);
  }, [storedEvents]);

  useEffect(() => {
    if (Object.keys(markedDates).length > 0) {
      const sortedDates = Object.keys(markedDates).sort();
      const start = sortedDates[0];
      const end = sortedDates[sortedDates.length - 1];

      setFirstDay(start);
      setLastDay(end);
      setValue('startsDate', start);
      setValue('endsDate', end);
    } else {
      setFirstDay('');
      setLastDay('');
      setValue('startsDate', '');
      setValue('endsDate', '');
    }
  }, [markedDates, selectedEvent, storedEventsToDisplay]);

  const onSubmit = (data: FormData) => {
    const isEventModified =
      selectedEvent &&
      storedEvents.some((event) => event.id === selectedEvent.id && event.startsDate === selectedEvent.startsDate);

    if (isEventModified) {
      const modifiedData: Event = {
        ...data,
        id: selectedEvent.id,
        recurrence: data.recurrence as Recurrence,
      };
      dispatch(modifyEvent(modifiedData));
      reset(initialEventState);
      setMarkedDates({});
      setSelectedEvent(undefined);
    } else {
      if (
        data.recurrence === Recurrence.WEEKLY ||
        data.recurrence === Recurrence.BIWEEKLY ||
        data.recurrence === Recurrence.MONTHLY
      ) {
        dispatch(addEvent(data));
        reset(initialEventState);
        setMarkedDates({});
      }
    }
  };

  const onDayPress = (day: any) => {
    if (Object.keys(storedEventsToDisplay).includes(day.dateString)) {
      const selectedEvent = storedEvents.find((ev) => ev.startsDate === day.dateString);
      if (selectedEvent) {
        reset({
          eventName: selectedEvent.eventName,
          recurrence: selectedEvent.recurrence,
          startsDate: selectedEvent.startsDate,
          endsDate: selectedEvent.endsDate,
          startsTime: selectedEvent.startsTime,
          endsTime: selectedEvent.endsTime,
        });
        setValue('endsDate', selectedEvent.endsDate);
      }
      setSelectedEvent(storedEvents.find((ev) => ev.startsDate === day.dateString));

      return;
    }

    setMarkedDates((prev) => {
      const updatedMarkedDates = { ...prev };
      if (updatedMarkedDates[day.dateString]) {
        delete updatedMarkedDates[day.dateString];
      } else {
        updatedMarkedDates[day.dateString] = {
          selected: true,
          disableTouchEvent: false,
          selectedColor: 'blue',
        };
      }
      return updatedMarkedDates;
    });
  };

  const removeEvent = (id: string, startsDate: string) => {
    dispatch(deleteEvent({ id, startsDate }));
    setSelectedEvent(undefined);
    reset(initialEventState);
  };

  const dayPressStyles = (date: any, state: any) => {
    const isSelectedSaved = !!storedEventsToDisplay[date.dateString];
    const isSelectedMarked = !!markedDates[date.dateString];
    return {
      backgroundColor: isSelectedSaved ? 'blue' : isSelectedMarked ? 'orange' : 'white',
      color: state === 'disabled' ? 'gray' : isSelectedSaved ? 'white' : 'black',
    };
  };

  const isDisabledButton =
    getValues('eventName') === '' || getValues('endsTime') === '' || getValues('startsTime') === '';

  return (
    <SafeAreaView style={styles.container}>
      <RNCalendar
        style={styles.calendar}
        markingType={'period'}
        minDate={today}
        dayComponent={({ date, state }: { date: any; state: any }) => {
          const { backgroundColor, color } = dayPressStyles(date, state);
          return (
            <Pressable onPress={() => onDayPress(date)} disabled={state === 'disabled'}>
              <View style={[styles.selectedDay, { backgroundColor }]}>
                <Text style={{ textAlign: 'center', verticalAlign: 'middle', color }}>{date.day}</Text>
              </View>
            </Pressable>
          );
        }}
      />
      <View style={styles.mainContent}>
        <View style={{ marginBottom: 10 }}>
          <View style={styles.screenTitle}>
            <StyledText fontSize={12} fontWeight='600'>
              Event Name
            </StyledText>
            {selectedEvent && (
              <TouchableOpacity
                onPress={() => {
                  removeEvent(selectedEvent!.id, selectedEvent!.startsDate);
                }}
                style={styles.createEventButtonWrapper}
              >
                <View style={styles.addEventIcon}>
                  <Ionicons name='remove' size={12} color='white' />
                </View>
              </TouchableOpacity>
            )}
          </View>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={{ ...styles.input, width: '100%' }}
                placeholder='Event Name'
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name='eventName'
          />
          <ErrorMessage error={errors.eventName} />
        </View>
        <View style={styles.dateWrapper}>
          <StyledText style={{ paddingRight: 55 }} fontSize={12} fontWeight='700'>
            Starts
          </StyledText>
          <View style={styles.dateTimeContainer}>
            <Controller
              control={control}
              rules={{ required: false }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={{ ...styles.input, width: 120, position: 'relative' }}
                  placeholder='Jan 28, 2025'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={firstDay || selectedEvent?.startsDate}
                />
              )}
              name='startsDate'
            />
            <ErrorMessage error={errors.startsDate} />
            <Controller
              control={control}
              name='startsTime'
              rules={{ required: false }}
              render={({ field: { onChange, value } }) => (
                <DDPicker
                  open={openStartTime}
                  items={timeOption}
                  value={value}
                  setOpen={setOpenStartTime}
                  setPickedValue={(selectedValue) => {
                    onChange(selectedValue);
                  }}
                  onChangeValue={onChange}
                  setItems={setTimeOption}
                  placeholder='Select Time'
                  customStyles={{ width: 120, zIndex: 10 }}
                />
              )}
            />

            <ErrorMessage error={errors.startsTime} />
          </View>
        </View>
        <View style={styles.dateWrapper}>
          <StyledText style={{ paddingRight: 40 }} fontSize={12} fontWeight='700'>
            Ends
          </StyledText>
          <View style={styles.dateTimeContainer}>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={{ ...styles.input, width: 120, position: 'relative' }}
                  placeholder='Jan 28, 2025'
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={lastDay || selectedEvent?.endsDate}
                />
              )}
              name='endsDate'
            />
            <ErrorMessage error={errors.endsDate} />
            <View style={{ width: 120 }}>
              <Controller
                control={control}
                name='endsTime'
                rules={{ required: false }}
                render={({ field: { onChange, value } }) => (
                  <DDPicker
                    open={openEndTime}
                    items={timeOption}
                    value={value}
                    setOpen={setOpenEndTime}
                    setPickedValue={(selectedValue) => {
                      onChange(selectedValue);
                    }}
                    setItems={setTimeOption}
                    placeholder='Select Time'
                    customStyles={{ width: 120, zIndex: 15 }}
                  />
                )}
              />
            </View>
            <ErrorMessage error={errors.endsTime} />
          </View>
        </View>

        <View style={{ marginBottom: 15 }}>
          <StyledText style={{ marginBottom: 10 }} fontSize={12} fontWeight='600'>
            Repeat
          </StyledText>
          <Controller
            control={control}
            name='recurrence'
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <DDPicker
                open={openWeekItems}
                items={weekItems}
                value={value}
                setOpen={setOpenWeekItems}
                setPickedValue={(selectedValue) => {
                  onChange(selectedValue);
                }}
                setItems={setWeekItems}
                placeholder='Select Recurrence'
                customStyles={{ width: '100%', zIndex: 30 }}
              />
            )}
          />
          {errors.recurrence && <Text style={styles.errorMessage}>This is required.</Text>}
        </View>
        <TouchableOpacity
          onPress={() => {
            setMarkedDates({});
            reset(initialEventState);
            setSelectedEvent(undefined);
          }}
          style={styles.createEventButtonWrapper}
        >
          <View style={styles.addEventIcon}>
            <Ionicons name='add' size={12} color='white' />
          </View>
          <StyledText fontSize={12} fontWeight='600'>
            Create New Event (reset form)
          </StyledText>
        </TouchableOpacity>
        <StyledButton
          disabled={isDisabledButton}
          height={40}
          style={styles.button}
          color='#FFF'
          fontSize={16}
          fontWeight='700'
          title='SAVE'
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e7e7e7',
    flex: 1,
    padding: 16,
    borderRadius: 8,
  },
  mainContent: {
    gap: 10,
    flex: 1,
    marginTop: 10,
  },
  screenTitle: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendar: {
    padding: 0,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 12,
    minHeight: 320,
  },
  calendarTheme: {
    backgroundColor: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    selectedDayBackgroundColor: 'orange',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#00adf5',
    dayTextColor: '#2d4150',
    textDisabledColor: '#dd99ee',
    textDayFontSize: 8,
    textDayHeaderFontSize: 8,
  },
  selectedDay: {
    borderRadius: 20,
    padding: 5,
    width: 25,
    height: 25,
  },
  errorMessage: {
    fontSize: 8,
    position: 'absolute',
    left: 6,
    bottom: -10,
    color: 'red',
  },
  dateWrapper: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  createEventButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addEventIcon: {
    width: 24,
    height: 24,
    backgroundColor: 'orange',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    fontWeight: 900,
    marginBottom: 50,
    marginTop: 'auto',
    alignSelf: 'stretch',
    paddingVertical: 12,
  },
  input: {
    height: 40,
    width: 120,
    backgroundColor: '#fff',
    border: 'none',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
