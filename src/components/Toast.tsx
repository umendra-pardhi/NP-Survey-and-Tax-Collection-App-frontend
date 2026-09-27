import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

type ToastProps = {
    visible: boolean;
    message: string;
    type?: ToastType;
    duration?: number;
    onHide?: () => void;
};

const typeStyles: Record<ToastType, { backgroundColor: string; borderColor: string; accent: string }> = {
    success: { backgroundColor: '#EAFBF3', borderColor: '#8FE2B1', accent: '#1F9D69' },
    error: { backgroundColor: '#FDECEC', borderColor: '#F1A9A9', accent: '#D64545' },
    info: { backgroundColor: '#EEF4FF', borderColor: '#B8C9F3', accent: '#2F5FCD' },
};

export const Toast = ({ visible, message, type = 'info', duration = 2200, onHide }: ToastProps) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!visible) {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }).start();
            return;
        }

        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 180,
                useNativeDriver: true,
            }),
            Animated.delay(duration),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onHide?.();
        });
    }, [duration, fadeAnim, onHide, visible]);

    if (!visible || !message) {
        return null;
    }

    const palette = typeStyles[type];

    return (
        <View pointerEvents="none" style={styles.container}>
            <Animated.View
                style={[
                    styles.toast,
                    {
                        backgroundColor: palette.backgroundColor,
                        borderColor: palette.borderColor,
                        opacity: fadeAnim,
                        transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
                    },
                ]}
            >
                <View style={[styles.dot, { backgroundColor: palette.accent }]} />
                <Text style={[styles.text, { color: palette.accent }]}>{message}</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 24,
        alignItems: 'center',
        zIndex: 100,
        pointerEvents: 'none',
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderWidth: 1,
        maxWidth: '90%',
        shadowColor: '#000',
        shadowOpacity: 0.16,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
    },
    dot: {
        width: 9,
        height: 9,
        borderRadius: 999,
        marginRight: 10,
    },
    text: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
        includeFontPadding: false,
    },
});
