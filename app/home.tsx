import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

const GENRES = [
  { key: 'study', label: '勉強' },
  { key: 'nap', label: '仮眠' },
  { key: 'workout', label: '筋トレ' },
  { key: 'work', label: '仕事' },
];

function useFadeIn(delay = 0) {
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [anim, delay]);
  return { opacity: anim };
}

function PomodoroTimer({ onProgress }: { onProgress?: (progress: number) => void }) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isRunning && seconds > 0) {
      timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      if (onProgress) {
        const total = isBreak ? 5 * 60 : 25 * 60;
        onProgress(1 - seconds / total);
      }
    } else if (isRunning && seconds === 0) {
      setIsBreak(!isBreak);
      setSeconds(isBreak ? 25 * 60 : 5 * 60);
      if (onProgress) onProgress(0);
    }
    return () => clearTimeout(timer);
  }, [isRunning, seconds, isBreak, onProgress]);

  const format = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const fadeAnim = useFadeIn(400);

  return (
    <Animated.View style={[styles.timerContainer, fadeAnim]}>
      <Text style={styles.timerLabel}>{isBreak ? '休憩' : '集中'}</Text>
      <Text style={styles.timer}>{format(seconds)}</Text>
      <TouchableOpacity
        style={styles.timerButton}
        onPress={() => setIsRunning(!isRunning)}
        activeOpacity={0.85}
      >
        <Text style={styles.timerButtonText}>{isRunning ? '一時停止' : 'スタート'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0].key);
  const [focusedGenre, setFocusedGenre] = useState<string | null>(null);
  const [borderProgress, setBorderProgress] = useState(0);

  const fadeMenu = useFadeIn(0);
  const fadePet = useFadeIn(200);
  const fadeGenres = useFadeIn(300);

  // アニメーション用の値
  const borderAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: borderProgress,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();
  }, [borderProgress]);

  // 円弧の描画用パラメータ
  const size = 220;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [dashOffset, setDashOffset] = useState(circumference);
  React.useEffect(() => {
    const id = borderAnim.addListener(({ value }) => {
      setDashOffset(circumference * (1 - value));
    });
    return () => borderAnim.removeListener(id);
  }, [borderAnim, circumference]);

  return (
    <View style={styles.container}>
      {/* 左上の3点リーダー */}
      <Animated.View style={[styles.menuButton, fadeMenu]}>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={28} color={Colors.neutral[700]} />
        </TouchableOpacity>
      </Animated.View>
      {/* ペット画像＋アニメーションボーダー */}
      <Animated.View style={[styles.petContainer, fadePet]}> 
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={require('../assets/images/pet.jpg')} style={styles.petImage} />
          <Animated.View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg width={size} height={size}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#26A69A"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference},${circumference}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                rotation="-90"
                origin={`${size / 2},${size / 2}`}
              />
            </Svg>
          </Animated.View>
        </View>
      </Animated.View>
      {/* ジャンル選択 */}
      <Animated.View style={[styles.genreContainer, fadeGenres]}>
        {GENRES.map((g) => {
          return (
            <TouchableOpacity
              key={g.key}
              style={[
                styles.genreButton,
                selectedGenre === g.key && styles.genreButtonActive,
                focusedGenre === g.key && styles.genreButtonFocused,
              ]}
              onPress={() => setSelectedGenre(g.key)}
              onFocus={() => setFocusedGenre(g.key)}
              onBlur={() => setFocusedGenre(null)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.genreText,
                  selectedGenre === g.key && styles.genreTextActive,
                  focusedGenre === g.key && styles.genreTextFocused,
                ]}
              >
                {g.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
      {/* タイマー */}
      <PomodoroTimer onProgress={setBorderProgress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F9',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  petContainer: {
    marginTop: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#B2DFDB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  petImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e0f2f1',
  },
  genreContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  genreButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E0E7EF',
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#B2DFDB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  genreButtonActive: {
    backgroundColor: '#B2DFDB',
    borderColor: '#26A69A',
  },
  genreButtonFocused: {
    borderColor: '#26A69A',
    backgroundColor: '#E0F7FA',
  },
  genreText: {
    color: '#607D8B',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  genreTextActive: {
    color: '#00796B',
    fontFamily: 'Inter-Bold',
  },
  genreTextFocused: {
    color: '#004D40',
    fontFamily: 'Inter-Bold',
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingVertical: 48,
    paddingHorizontal: 24,
    width: '90%',
    minHeight: 220,
    shadowColor: '#B2DFDB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    justifyContent: 'center',
  },
  timerLabel: {
    fontSize: 22,
    color: '#26A69A',
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  timer: {
    fontSize: 72,
    fontFamily: 'Inter-Bold',
    color: '#263238',
    marginBottom: 18,
  },
  timerButton: {
    backgroundColor: '#26A69A',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 28,
    marginTop: 12,
    shadowColor: '#B2DFDB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  timerButtonPressed: {
    backgroundColor: '#00897B',
  },
  timerButtonText: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 1,
  },
});
