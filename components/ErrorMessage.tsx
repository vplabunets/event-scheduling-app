import { Text, StyleSheet } from 'react-native';
import { FieldError } from 'react-hook-form';

const ErrorMessage = ({ error }: { error?: FieldError }) =>
  error ? <Text style={styles.errorMessage}>{error.message || 'This is required.'}</Text> : null;

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 8,
    position: 'absolute',
    left: 6,
    bottom: -10,
    color: 'red',
  },
});

export default ErrorMessage;
