import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
  label: string;
  onPress?: () => void;
};

export default function IconButton({ label, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && { opacity: 0.8 },
      ]}
      onPress={onPress}
    >
      <FontAwesome name="camera" size={16} color="#fff" />
      <Text style={styles.label}>{label}</Text>
    </Pressable>

  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#FFB300',
    borderRadius: 20,

    paddingVertical: 8,
    paddingHorizontal: 14,

    alignSelf: 'center',

    elevation: 3,
  },

  label: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});