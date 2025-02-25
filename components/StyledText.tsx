import React, { ReactNode } from 'react';
import { Text, StyleProp, TextStyle, StyleSheet, TouchableOpacity } from 'react-native';
import { filterStyles } from '../utils/filterStyle';
import { FontWeight } from '../types/global.type';
import { RFValue } from 'react-native-responsive-fontsize';
// import {useTheme} from '@components/navigation/providers/ThemeProvider/useTheme';

export interface StyledTextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  color?: string;
  fontSize?: number;
  fontFamily?:
    | 'Poppins'
    | 'Poppins-Bold'
    | 'Poppins-Italic'
    | 'Poppins-Light'
    | 'Poppins-Medium'
    | 'Poppins-Regular'
    | 'Poppins-SemiBold'
    | 'Poppins-Thin'
    | 'TimesNewRomanMTStd';
  fontWeight?: FontWeight;
  lineHeight?: number;
  textAlign?: 'center' | 'left' | 'right';
  underline?: boolean;
  onPress?: () => void;
  textDecorationLine?: 'underline' | 'line-through' | 'none';
}

const StyledText: React.FC<StyledTextProps> = (props) => {
  return (
    <TouchableOpacity activeOpacity={0.6} disabled={!props.onPress} onPress={props.onPress}>
      <Text
        style={[
          styles.default,
          props.style,
          filterStyles({
            color: props.color,
            fontSize: RFValue(props.fontSize || 20, 812),
            fontFamily: props.fontFamily,
            fontWeight: props.fontWeight,
            lineHeight: props.lineHeight,
            textAlign: props.textAlign,
            textDecorationLine: props.textDecorationLine || (props.underline ? 'underline' : undefined),
          }),
        ]}
      >
        {props.children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  default: {
    fontSize: 20,
    fontFamily: 'Poppins',
  },
});

export default StyledText;
