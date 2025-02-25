# Calendar Event Scheduling App

## Description

This is a mobile scheduling application that allows users to create, manage, and repeat events. The app provides an
intuitive interface for users to schedule events, choose recurrence options, and manage event details.

## Features

- **Create Events**: Users can create new events by entering an event name, setting a start time, and choosing a
  recurrence option.
- **Edit Events**: Users can modify the name, recurrence, or time of existing events.
- **Delete Events**: Users can remove events by clicking on a delete button.
- **Recurrence Options**:
  - Weekly: The event recurs every week.
  - Bi-weekly: The event recurs every other week.
  - Monthly: The event recurs every month.
- **Save Events**: Users must click the “Save” button to confirm event creation.
- **Event Storage**: Events are stored locally, ensuring past data is retained when the app is restarted.
- **Highlight Scheduled Dates**: Dates with scheduled events are highlighted in the calendar.

## Requirements

- **Tech Stack**:
  - React Native (Expo)
  - React State Management or Redux
  - Libraries to simplify your work
  - The application should function properly across all Expo-supported platforms: iOS, Android, and Web.

## Installation

1. Navigate to the project directory and install dependencies.

```bash
cd event-scheduling-app
npm install
```

## Running the App

- **iOS:**

```bash
npm run ios
```

- **Android:**

```bash
npm run android
```

- **Web:**

```bash
npm run web
```

## How to Use

1. Open the app and select a date on the calendar to create or edit an event.
2. Enter the event name, set a start time, and choose a recurrence option.
3. Click “Save” to store the event.
4. You can view and manage events by clicking on highlighted dates.

## Code Structure

- `HomeScreen.ts`: Main screen with the calendar and event management functionalities.
- `eventSlice.ts`: Redux slice for managing event data.

## License

This project is licensed under the MIT License.

## Contact

vplabunets@gmail.com Volodymyr Labunets
