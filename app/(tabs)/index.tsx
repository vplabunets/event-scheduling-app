import StyledButton from '@/components/StyledButton';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import StyledText from '@/components/StyledText';
import Ionicons from '@expo/vector-icons/Ionicons';
import { timeOptions } from '@/constants/timeOptions';
import { weekOptions } from '@/constants/weekOption';
import { FormData, MarkedDate } from '@/types/global.type';
import { useDispatch, useSelector } from 'react-redux';
import { addEvent, deleteEvent, modifyEvent } from '@/store/event/eventSlice';
import { RootState } from '@/store/store';
import { Event } from '@/types/global.type';
import DDPicker from '@/components/DDPicker';
const initialEventState = {
    eventName: '',
    startsDate: '',
    startsTime: '',
    endsDate: '',
    endsTime: '',
    recurrence: '',
};
export default function HomeScreen() {
    const dispatch = useDispatch();
    const today = new Date().toISOString().split('T')[0];

    const [markedDates, setMarkedDates] = useState<{
        [key: string]: { selected: boolean; disableTouchEvent: boolean; selectedColor: string };
    }>({
        // '2025-02-27': { disableTouchEvent: false, selected: true, selectedColor: 'orange' },
        // '2025-02-28': { disableTouchEvent: false, selected: true, selectedColor: 'orange' },
    });
    const [openStartTime, setOpenStartTime] = useState(false);
    const [openEndTime, setOpenEndTime] = useState(false);
    const [openWeekItems, setOpenWeekItems] = useState(false);
    const [timeOption, setTimeOption] = useState(timeOptions);
    const [weekItems, setWeekItems] = useState(weekOptions);
    const [displayedDates, setDisplayedDates] = useState();
    const [storedEventsToDisplay, setStoredEventsToDisplay] = useState<{ [key: string]: MarkedDate }>({});

    const [events, setEvents] = useState<object[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event>();

    const [firstDay, setFirstDay] = useState('');
    const [lastDay, setLastDay] = useState('');

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        setValue,
    } = useForm({
        defaultValues: initialEventState,
    });

    const storedEvents = useSelector((state: RootState) => state.event.events);
    const devents: any[] = [];

    // const storedEventsToDisplay = storedEvents.reduce((acc, event) => {
    //   acc[event.startsDate] = {
    //     disableTouchEvent: false,
    //     selected: true,
    //     selectedColor: 'orange',
    //   };
    //   return acc;
    // }, {});

    useEffect(() => {
        const updatedMarkedDates: {
            [key: string]: { disableTouchEvent: boolean; selected: boolean; selectedColor: string };
        } = storedEvents.reduce((acc, event) => {
            acc[event.startsDate] = {
                disableTouchEvent: false,
                selected: true,
                selectedColor: 'orange',
            };
            return acc;
        }, {} as { [key: string]: { disableTouchEvent: boolean; selected: boolean; selectedColor: string } });

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
    }, [markedDates, setDisplayedDates, selectedEvent, storedEventsToDisplay]);
    const onSubmit = (data: FormData) => {
        if (selectedEvent && storedEvents.find((event) => event.id === selectedEvent?.id)) {
            const modifiedData: Event = {
                ...data,
                id: selectedEvent.id,
            };
            dispatch(modifyEvent(modifiedData));
            reset(initialEventState);
            setMarkedDates({});
        } else {
            const id = Math.random().toString(36).substr(2, 9);
            const eventData: Event = {
                ...data,
                id: id,
            };
            dispatch(addEvent(eventData));
            reset(initialEventState);
            setMarkedDates({});
        }
    };

    const onDayPress = (day: any) => {
        if (selectedEvent) {
            Object.keys(selectedEvent).forEach((key) => {
                setValue('eventName', selectedEvent.eventName);
                setValue('recurrence', selectedEvent.recurrence);
                setValue('startsDate', selectedEvent.startsDate);
                setValue('endsDate', selectedEvent.endsDate);
                setValue('startsTime', selectedEvent.startsTime);
                setValue('endsTime', selectedEvent.endsTime);
            });
            return;
        }

        if (Object.keys(storedEventsToDisplay).includes(day.dateString)) {
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

    const removeEvent = (id: string) => {
        dispatch(deleteEvent(id));
        setSelectedEvent(undefined);
    };

    return (
        <SafeAreaView style={styles.container}>
            <RNCalendar
                style={styles.calendar}
                markingType={'period'}
                minDate={today}
                dayComponent={({ date, state }: { date: any; state: any }) => {
                    const isSelectedSaved = !!storedEventsToDisplay[date.dateString];
                    const isSelectedMarked = !!markedDates[date.dateString];
                    return (
                        <Pressable onPress={() => onDayPress(date)} disabled={state === 'disabled'}>
                            <View
                                style={[
                                    styles.selectedDay,
                                    {
                                        backgroundColor: isSelectedSaved
                                            ? isSelectedMarked
                                                ? 'yellow '
                                                : 'blue'
                                            : isSelectedMarked
                                                ? 'orange'
                                                : 'transparent',
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        verticalAlign: 'middle',
                                        color: state === 'disabled' ? 'gray' : isSelectedMarked ? 'white' : 'black',
                                    }}
                                >
                                    {date.day}
                                </Text>
                            </View>
                        </Pressable>
                    );
                }}
            />
            <View style={{ gap: 10, flex: 1, marginTop: 10 }}>
                <View style={{ marginBottom: 10 }}>
                    <View
                        style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                        <StyledText fontSize={12} fontWeight='600'>
                            Event Name
                        </StyledText>
                        {selectedEvent && (
                            <TouchableOpacity
                                onPress={() => {
                                    removeEvent(selectedEvent!.id);
                                    reset(initialEventState);
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
                        rules={{ required: false }}
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
                    {errors.eventName && <Text style={styles.errorMessage}>This is required.</Text>}
                </View>
                <View style={styles.dateWrapper}>
                    <StyledText style={{ paddingRight: 55 }} fontSize={12} fontWeight='700'>
                        Starts
                    </StyledText>
                    <View style={{ flexDirection: 'row', gap: 15 }}>
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

                        {errors.startsDate && <Text style={styles.errorMessage}>This is required.</Text>}
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

                        {errors.startsTime && <Text style={styles.errorMessage}>This is required.</Text>}
                    </View>
                </View>
                <View style={styles.dateWrapper}>
                    <StyledText style={{ paddingRight: 40 }} fontSize={12} fontWeight='700'>
                        Ends
                    </StyledText>
                    <View style={{ flexDirection: 'row', gap: 15 }}>
                        <Controller
                            control={control}
                            rules={{ required: false }}
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
                        {errors.endsDate && <Text style={styles.errorMessage}>This is required.</Text>}
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
                        {errors.endsTime && <Text style={styles.errorMessage}>This is required.</Text>}
                    </View>
                </View>

                <View style={{ marginBottom: 15 }}>
                    <StyledText style={{ marginBottom: 10 }} fontSize={12} fontWeight='600'>
                        Repeat
                    </StyledText>
                    <Controller
                        control={control}
                        name='recurrence'
                        rules={{ required: false }}
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
                        Create New Event
                    </StyledText>
                </TouchableOpacity>

                <StyledButton
                    disabled={getValues('eventName') === '' || getValues('endsTime') === '' || getValues('startsTime') === ''}
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
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
