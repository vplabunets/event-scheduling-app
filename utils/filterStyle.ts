import {TextStyle, ViewStyle} from 'react-native';

export const filterStyles = (styles: ViewStyle | TextStyle) => {
  const filteredStyles = Object.entries(styles).reduce(
    (acc: any, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    },
    {},
  );
  return filteredStyles;
};
