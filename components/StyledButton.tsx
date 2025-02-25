import React from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { ImagePropsBase } from 'react-native';
import { filterStyles } from '@/utils/filterStyle';
import StyledText from './StyledText';

interface Props {
  title: string;
  iconLeft?: ImagePropsBase;
  iconSize?: number;
  onPress?: () => void;
  gap?: number;
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
  disabledBackgroundColor?: string;
  color?: string;
  isLoading?: boolean;
  disabled?: boolean;
  isFlex?: boolean;
  stretchDisable?: boolean;
  fontSize?: number;
  paddingVertical?: number;
  height?: number;
  style?: ViewStyle;
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | undefined;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
}
const StyledButton: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={props.disabled}
      onPress={() => {
        if (props.isLoading) {
          return;
        }

        if (props.onPress) {
          props.onPress();
        }
      }}
      style={[
        styles.container,
        { backgroundColor: 'orange' },
        filterStyles({
          borderColor: props.borderColor,
          backgroundColor: props.backgroundColor,
          borderWidth: props.borderWidth,
          justifyContent: props.justifyContent || 'center',
          paddingVertical: props.paddingVertical,
          height: props.height || 56,
          ...props.style,
        }),
        props.disabled
          ? {
              backgroundColor: 'lightgrey',
            }
          : null,
        props.isFlex ? { flex: 1 } : {},
        props.stretchDisable ? { width: undefined } : {},
      ]}
    >
      {props.iconLeft && (
        <Image
          style={{
            width: props.iconSize || 20,
            height: props.iconSize || 20,
          }}
          source={props.iconLeft}
        />
      )}

      {props.isLoading && <ActivityIndicator color={'black'} />}
      {!props.isLoading && props.title != '' && (
        <StyledText
          color={props.disabled ? 'grey ' : props.color || '#fff'}
          lineHeight={0}
          fontFamily='Poppins-SemiBold'
          fontSize={props.fontSize || 14}
          fontWeight={props.fontWeight as any}
        >
          {props.title}
        </StyledText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
  },
  disabled: {
    backgroundColor: '#EAECF0',
  },
  disabledText: {
    color: '#98A2B3',
  },
});

export default StyledButton;
