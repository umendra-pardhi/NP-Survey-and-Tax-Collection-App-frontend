import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export const Screen = ({ children }: { children: React.ReactNode }) => (
  <ScrollView style={styles.screen} contentContainerStyle={styles.content} >
    {children}
  </ScrollView>
);

export const Title = ({ children }: { children: React.ReactNode }) => <Text style={styles.title}>{children}</Text>;

export const Section = ({ children }: { children: React.ReactNode }) => <View style={styles.section}>{children}</View>;

export const Label = ({ children }: { children: React.ReactNode }) => <Text style={styles.label}>{children}</Text>;

export const Input = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  numberOfLines,
  multiline,
}: {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  numberOfLines?: number;
  multiline?: boolean;
}) => (
  <TextInput
    style={styles.input}
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
    multiline={multiline}
    numberOfLines={numberOfLines}
  />
);

export const Button = ({
  text,
  onPress,
  variant = 'primary',
}: {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}) => (
  <Pressable onPress={onPress} style={[styles.button, styles[variant]]}>
    <Text style={styles.buttonText}>{text}</Text>
  </Pressable>
);

export const Row = ({ children }: { children: React.ReactNode }) => <View style={styles.row}>{children}</View>;

export const Badge = ({ text }: { text: string }) => <Text style={styles.badge}>{text}</Text>;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F7FB' },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: '700', color: '#1B1D2A' },
  section: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#2B2D3A' },
  input: {
    borderWidth: 1,
    borderColor: '#D8DCE8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  button: { borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  primary: { backgroundColor: '#145DA0' },
  secondary: { backgroundColor: '#3E7CB1' },
  danger: { backgroundColor: '#BC3908' },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center', flexWrap: 'wrap' },
  badge: { backgroundColor: '#E4EEF7', color: '#145DA0', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
});
