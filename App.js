import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [randomNumber, setRandomNumber] = useState(null);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);

  const numberOpacity = useSharedValue(0);
  const numberScale = useSharedValue(0.5);
  const buttonScale = useSharedValue(1);
  const confettiOpacity = useSharedValue(0);

  useEffect(() => {
    if (randomNumber !== null) {
      numberOpacity.value = withSequence(
        withTiming(0, { duration: 100 }),
        withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) })
      );
      numberScale.value = withSequence(
        withTiming(0.8, { duration: 100 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );
      confettiOpacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 1000, easing: Easing.out(Easing.quad) })
      );
    }
  }, [randomNumber]);

  const generateNumber = () => {
    buttonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    const newNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    setRandomNumber(newNumber);
  };

  const animatedNumberStyle = useAnimatedStyle(() => {
    return {
      opacity: numberOpacity.value,
      transform: [{ scale: numberScale.value }],
    };
  });

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const animatedConfettiStyle = useAnimatedStyle(() => {
    return {
      opacity: confettiOpacity.value,
    };
  });

  return (
    <LinearGradient colors={['#1a0a33', '#0d0d1a', '#0a0a0a']} style={styles.container}>
      <Animated.View style={[styles.confettiOverlay, animatedConfettiStyle]}>
        {[...Array(15)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.confettiDot,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 70%)`,
                opacity: confettiOpacity.value,
                transform: [
                  { translateX: useSharedValue((Math.random() - 0.5) * 200).value },
                  { translateY: useSharedValue((Math.random() - 0.5) * 200).value },
                  { scale: useSharedValue(Math.random() * 0.5 + 0.5).value },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>

      <View style={styles.content}>
        <Text style={styles.title}>Quantum Roll</Text>
        <Text style={styles.subtitle}>Random Number Generator</Text>

        <View style={styles.numberDisplayContainer}>
          {randomNumber !== null ? (
            <Animated.Text style={[styles.randomNumber, animatedNumberStyle]}>
              {randomNumber}
            </Animated.Text>
          ) : (
            <Text style={styles.placeholderText}>Tap to Generate</Text>
          )}
        </View>

        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity style={styles.button} onPress={generateNumber}>
            <Text style={styles.buttonText}>GENERATE</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && {
      width: '100%',
      minHeight: '100vh',
    }),
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: height * 0.1,
    width: '90%',
    ...(Platform.OS === 'web' && {
      maxWidth: 600,
      marginHorizontal: 'auto',
      justifyContent: 'center',
      paddingVertical: 50,
    }),
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#E0BBE4',
    letterSpacing: 2,
    textShadowColor: 'rgba(224, 187, 228, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    ...(Platform.OS === 'web' && {
      fontSize: 60,
    }),
  },
  subtitle: {
    fontSize: 18,
    color: '#957DAD',
    marginBottom: 40,
    letterSpacing: 1,
  },
  numberDisplayContainer: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#E0BBE4',
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#E0BBE4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    ...(Platform.OS === 'web' && {
      width: 300,
      height: 300,
      borderRadius: 150,
      marginTop: 40,
    }),
  },
  randomNumber: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    ...(Platform.OS === 'web' && {
      fontSize: 100,
    }),
  },
  placeholderText: {
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#957DAD',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 50,
    shadowColor: '#957DAD',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 200,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  confettiOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  confettiDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
