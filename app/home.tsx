import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Ionicons } from '@expo/vector-icons';

const GENRES = [
  { key: 'study', label: '勉強' },
  { key: 'nap', label: '仮眠' },
  { key: 'workout', label: '筋トレ' },
  { key: 'work', label: '仕事' },
];

function PomodoroTimer() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isRunning && seconds > 0) {
      timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    } else if (isRunning && seconds === 0) {
      setIsBreak(!isBreak);
      setSeconds(isBreak ? 25 * 60 : 5 * 60);
    }
    return () => clearTimeout(timer);
  }, [isRunning, seconds, isBreak]);

  const format = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerLabel}>{isBreak ? '休憩' : '集中'}</Text>
      <Text style={styles.timer}>{format(seconds)}</Text>
      <TouchableOpacity style={styles.timerButton} onPress={() => setIsRunning(!isRunning)}>
        <Text style={styles.timerButtonText}>{isRunning ? '一時停止' : 'スタート'}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function HomeScreen() {
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0].key);

  return (
    <View style={styles.container}>
      {/* 左上の3点リーダー */}
      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="ellipsis-horizontal" size={28} color={Colors.neutral[700]} />
      </TouchableOpacity>
      {/* ペット画像 */}
      <View style={styles.petContainer}>
        <Image source={require('../assets/images/pet.jpg')} style={styles.petImage} />
      </View>
      {/* ジャンル選択 */}
      <View style={styles.genreContainer}>
        {GENRES.map((g) => (
          <TouchableOpacity
            key={g.key}
            style={[styles.genreButton, selectedGenre === g.key && styles.genreButtonActive]}
            onPress={() => setSelectedGenre(g.key)}
          >
            <Text style={[styles.genreText, selectedGenre === g.key && styles.genreTextActive]}>{g.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* タイマー */}
      <PomodoroTimer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  },
  petImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#eee',
  },
  genreContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  genreButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral[200],
    marginHorizontal: 6,
  },
  genreButtonActive: {
    backgroundColor: Colors.primary[400],
  },
  genreText: {
    color: Colors.neutral[700],
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  genreTextActive: {
    color: '#fff',
    fontFamily: 'Inter-Bold',
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  timerLabel: {
    fontSize: 18,
    color: Colors.primary[400],
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  timer: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[900],
    marginBottom: 12,
  },
  timerButton: {
    backgroundColor: Colors.primary[400],
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 24,
  },
  timerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
});
