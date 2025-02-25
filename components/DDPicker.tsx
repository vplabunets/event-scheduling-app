import React from 'react';
import { StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

interface DDPickerProps {
  open: boolean;
  items: { label: string; value: string }[];
  value: string | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPickedValue: (value: string | null) => void;
  onChangeValue?: (value: string | null) => void;
  setItems: React.Dispatch<React.SetStateAction<{ label: string; value: string }[]>>;
  placeholder?: string;
  customStyles?: object;
}

const DDPicker: React.FC<DDPickerProps> = ({
  open,
  items,
  value,
  setOpen,
  setPickedValue,
  onChangeValue,
  setItems,
  placeholder,
  customStyles,
}) => {
  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      maxHeight={400}
      setValue={(callback) => {
        const selectedValue = typeof callback === 'function' ? callback(value) : callback;
        setPickedValue(selectedValue);
        if (onChangeValue) {
          onChangeValue(selectedValue);
        }
      }}
      setItems={setItems}
      style={[styles.main, customStyles]}
      dropDownContainerStyle={styles.dropDownContainer}
      textStyle={styles.text}
      labelStyle={styles.label}
      placeholder={placeholder}
    />
  );
};

export default DDPicker;

const styles = StyleSheet.create({
  main: {
    minHeight: 40,
    borderWidth: 0,
    borderRadius: 5,
  },
  dropDownContainer: {
    borderRadius: 5,
    borderWidth: 0,
    minHeight: 10,
  },
  text: {
    fontSize: 12,
  },
  label: {
    width: 120,
    fontSize: 12,
  },
});
